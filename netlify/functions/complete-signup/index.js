// Complete signup securely: verify OTP server-side and create Supabase user using service role.
// Prevents storing passwords in localStorage/sessionStorage.

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
    return { statusCode: 403, headers, body: JSON.stringify({ error: 'Origin not allowed' }) };
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
    const password = String(requestData.password || '');
    const fullName = String(requestData.fullName || '').trim();

    if (!email || !code || !password) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields: email, code, password' }) };
    }

    if (!validateEmail(email)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid email address format' }) };
    }

    if (!/^\d{6}$/.test(code)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid code format. Expected 6 digits.' }) };
    }

    if (password.length < 6 || password.length > 128) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Password must be between 6 and 128 characters.' }) };
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      console.error('Supabase service configuration missing');
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server not configured.' }) };
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Verify OTP (hashed)
    const hmacSecret = process.env.OTP_HMAC_SECRET || serviceKey;
    const otpHash = crypto
      .createHmac('sha256', hmacSecret)
      .update(`${email}:signup:${code}`)
      .digest('hex');

    const { data: otpRow, error: otpError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', email)
      .eq('type', 'signup')
      .eq('code', otpHash)
      .maybeSingle();

    if (otpError) {
      console.error('OTP lookup error:', otpError);
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to verify code. Please try again.' }) };
    }

    if (!otpRow) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid or expired verification code.' }) };
    }

    const expiresAt = new Date(otpRow.expires_at).getTime();
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
      try { await supabase.from('otp_codes').delete().eq('id', otpRow.id); } catch {}
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Verification code has expired. Please request a new one.' }) };
    }

    // Prevent duplicates (best-effort)
    try {
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      if (existing?.id) {
        return { statusCode: 409, headers, body: JSON.stringify({ error: 'An account with this email already exists. Please sign in.' }) };
      }
    } catch {}

    // Create auth user (service role)
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: fullName ? { full_name: fullName } : undefined,
    });

    if (createError || !created?.user?.id) {
      console.error('User create error:', createError);
      const msg = createError?.message || 'Failed to create account';
      return { statusCode: 400, headers, body: JSON.stringify({ error: msg }) };
    }

    // Create profile row (best-effort)
    try {
      await supabase.from('users').insert({
        id: created.user.id,
        email,
        full_name: fullName || null,
        role: 'user',
      });
    } catch (e) {
      // ignore profile insert failure; auth user exists
    }

    // Consume OTP (best-effort)
    try {
      await supabase.from('otp_codes').delete().eq('id', otpRow.id);
    } catch {}

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('complete-signup error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};

