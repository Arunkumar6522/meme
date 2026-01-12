// Netlify serverless function to verify OTP codes securely.
// Uses Supabase service role key so the browser never needs access to otp_codes table.

const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function validateEmail(email) {
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email) && email.length >= 6 && email.length <= 254;
}

exports.handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || '';
  const allowedOrigins = allowedOriginsEnv
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const originAllowed = allowedOrigins.length === 0 || (origin && allowedOrigins.includes(origin));

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': originAllowed && origin ? origin : (allowedOrigins.length ? allowedOrigins[0] : '*'),
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: JSON.stringify({}) };
  }

  if (!originAllowed && allowedOrigins.length) {
    return { statusCode: 403, headers, body: JSON.stringify({ valid: false, error: 'Origin not allowed' }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    let requestData;
    try {
      requestData = JSON.parse(event.body || '{}');
    } catch {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON in request body' }) };
    }

    const email = normalizeEmail(requestData.email);
    const code = String(requestData.code || '').trim();
    const type = requestData.type;

    if (!email || !code || !type) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields: email, code, type' }) };
    }

    if (!validateEmail(email)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid email address format' }) };
    }

    if (!/^\d{6}$/.test(code)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid code format. Expected 6 digits.' }) };
    }

    if (type !== 'signup' && type !== 'password_reset') {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid type. Expected "signup" or "password_reset".' }) };
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      console.error('Supabase service configuration missing');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server not configured (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).' }),
      };
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const hmacSecret = process.env.OTP_HMAC_SECRET || serviceKey;
    const otpHash = crypto
      .createHmac('sha256', hmacSecret)
      .update(`${email}:${type}:${code}`)
      .digest('hex');

    const { data, error } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', email)
      .eq('code', otpHash)
      .eq('type', type)
      .maybeSingle();

    if (error) {
      console.error('OTP verify query error:', error);
      return { statusCode: 500, headers, body: JSON.stringify({ valid: false, error: 'Failed to verify code. Please try again.' }) };
    }

    if (!data) {
      return { statusCode: 200, headers, body: JSON.stringify({ valid: false, error: 'Invalid verification code. Please check and try again.' }) };
    }

    const expiresAt = new Date(data.expires_at);
    if (Number.isNaN(expiresAt.getTime()) || Date.now() > expiresAt.getTime()) {
      // best-effort cleanup
      try {
        await supabase.from('otp_codes').delete().eq('id', data.id);
      } catch {}
      return { statusCode: 200, headers, body: JSON.stringify({ valid: false, error: 'Verification code has expired. Please request a new code.' }) };
    }

    // delete used code (best-effort)
    try {
      await supabase.from('otp_codes').delete().eq('id', data.id);
    } catch {}

    return { statusCode: 200, headers, body: JSON.stringify({ valid: true }) };
  } catch (err) {
    console.error('verify-otp error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ valid: false, error: 'Failed to verify code. Please try again.' }) };
  }
};

