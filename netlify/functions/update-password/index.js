const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

exports.handler = async (event, context) => {
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || '';
  const allowedOrigins = allowedOriginsEnv
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const originAllowed = allowedOrigins.length === 0 || (origin && allowedOrigins.includes(origin));

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': originAllowed && origin ? origin : (allowedOrigins.length ? allowedOrigins[0] : '*'),
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({}) };
  }

  if (!originAllowed && allowedOrigins.length) {
    return { statusCode: 403, headers: corsHeaders, body: JSON.stringify({ error: 'Origin not allowed' }) };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { email, code, newPassword } = JSON.parse(event.body);

    if (!email || !code || !newPassword) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Email, code, and new password are required' }),
      };
    }

    // Validate password length
    if (newPassword.length < 6) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Password must be at least 6 characters' }),
      };
    }

    // Initialize Supabase admin client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Verify OTP (server-side) before allowing password change
    const normalizedEmail = String(email).trim().toLowerCase();
    const otpCode = String(code).trim();

    if (!/^\d{6}$/.test(otpCode)) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid code format. Expected 6 digits.' }) };
    }

    const hmacSecret = process.env.OTP_HMAC_SECRET || supabaseServiceKey;
    const otpHash = crypto
      .createHmac('sha256', hmacSecret)
      .update(`${normalizedEmail}:password_reset:${otpCode}`)
      .digest('hex');

    const { data: otpRow, error: otpError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('type', 'password_reset')
      .eq('code', otpHash)
      .maybeSingle();

    if (otpError) {
      console.error('OTP lookup error:', otpError);
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Failed to verify code. Please try again.' }) };
    }

    if (!otpRow) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid or expired verification code.' }) };
    }

    const expiresAt = new Date(otpRow.expires_at).getTime();
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
      // best-effort cleanup
      try { await supabase.from('otp_codes').delete().eq('id', otpRow.id); } catch {}
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Verification code has expired. Please request a new one.' }) };
    }

    // Find user ID (prefer public.users mapping; fallback to auth.admin listUsers)
    let userId = null;
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('id')
        .eq('email', normalizedEmail)
        .maybeSingle();
      if (profile?.id) userId = profile.id;
    } catch (e) {
      // ignore and fallback
    }

    if (!userId) {
      const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
        console.error('Error listing users:', listError);
        return {
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Failed to find user' }),
        };
      }
      const user = authUsers.users.find(u => (u.email || '').toLowerCase() === normalizedEmail);
      if (!user) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'User not found' }),
        };
      }
      userId = user.id;
    }

    // Update password using admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (updateError) {
      console.error('Error updating password:', updateError);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: updateError.message || 'Failed to update password' }),
      };
    }

    // Consume OTP (best-effort)
    try {
      await supabase.from('otp_codes').delete().eq('id', otpRow.id);
    } catch {}

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, message: 'Password updated successfully' }),
    };
  } catch (error) {
    console.error('Error in update-password function:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};
