// Netlify serverless function to send OTP emails securely
// This prevents OTP codes from being exposed in client-side code

const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function validateEmail(email) {
  // keep in sync with client validator; server must be strict
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email) && email.length >= 6 && email.length <= 254;
}

exports.handler = async (event, context) => {
  // Set CORS headers
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

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({}),
    };
  }

  if (!originAllowed && allowedOrigins.length) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: 'Origin not allowed' }),
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body safely
    let requestData;
    try {
      requestData = JSON.parse(event.body || '{}');
    } catch (parseError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
      };
    }

    const email = normalizeEmail(requestData.email);
    const type = requestData.type;

    // Validate input
    if (!email || !type) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: email, type' }),
      };
    }

    if (!validateEmail(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email address format' }),
      };
    }

    if (type !== 'signup' && type !== 'password_reset') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid type. Expected "signup" or "password_reset".' }),
      };
    }

    // Supabase (service role) – used to store OTP server-side so the browser never sees the code.
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

    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Hash OTP before storing (even if DB is leaked, OTP can't be derived).
    // Uses a server-side secret (never shipped to browser).
    const hmacSecret = process.env.OTP_HMAC_SECRET || serviceKey;
    const otpHash = crypto
      .createHmac('sha256', hmacSecret)
      .update(`${email}:${type}:${otpCode}`)
      .digest('hex');

    // Basic throttling (per email+type) to reduce abuse/spam.
    const minIntervalSeconds = Number(process.env.OTP_MIN_INTERVAL_SECONDS || 30);
    if (Number.isFinite(minIntervalSeconds) && minIntervalSeconds > 0) {
      const { data: recent } = await supabase
        .from('otp_codes')
        .select('created_at')
        .eq('email', email)
        .eq('type', type)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (recent?.created_at) {
        const last = new Date(recent.created_at).getTime();
        if (Number.isFinite(last) && Date.now() - last < minIntervalSeconds * 1000) {
          return {
            statusCode: 429,
            headers,
            body: JSON.stringify({ error: 'Please wait before requesting another code.' }),
          };
        }
      }
    }

    // Best-effort cleanup of older OTPs for this email+type
    try {
      await supabase.from('otp_codes').delete().eq('email', email).eq('type', type);
    } catch (e) {
      // ignore cleanup failure
    }

    const { error: insertError } = await supabase.from('otp_codes').insert({
      email,
      code: otpHash,
      type,
      expires_at: expiresAt,
    });

    if (insertError) {
      console.error('Failed to store OTP:', insertError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to generate verification code. Please try again.' }),
      };
    }

    // Get SMTP configuration from environment variables
    const smtpConfig = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    // Validate SMTP config
    if (!smtpConfig.host || !smtpConfig.auth.user || !smtpConfig.auth.pass) {
      console.error('SMTP configuration missing');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Email service not configured. Please set up SMTP environment variables.' }),
      };
    }

    // Create transporter
    const transporter = nodemailer.createTransport(smtpConfig);

    // Email templates
    const getEmailSubject = () => {
      return type === 'signup' 
        ? 'Welcome to Meme Library - Verification Code'
        : 'Meme Library - Password Reset Code';
    };

    const getEmailHtml = () => {
      const isSignup = type === 'signup';
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${getEmailSubject()}</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5;">Meme Library</h1>
          </div>
          
          <h2>${isSignup ? 'Welcome to Meme Library!' : 'Password Reset Request'}</h2>
          <p>${isSignup 
            ? 'Thank you for signing up. Please use the verification code below to complete your registration:'
            : 'You requested to reset your password. Please use the verification code below:'}</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; display: inline-block;">
              <h1 style="font-size: 32px; letter-spacing: 8px; color: #4F46E5; margin: 0;">${otpCode}</h1>
            </div>
          </div>
          
          <p><strong>This code expires in 10 minutes.</strong></p>
          <p>${isSignup 
            ? 'If you didn\'t create an account with Meme Library, please ignore this email.'
            : 'If you didn\'t request a password reset, please ignore this email or contact support if you\'re concerned about your account security.'}</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; font-size: 14px;">
            This email was sent by Meme Library. If you have any questions, please contact our support team.
          </p>
        </body>
        </html>
      `;
    };

    const fromEmail = process.env.SMTP_FROM_EMAIL || smtpConfig.auth.user;
    const fromName = process.env.SMTP_FROM_NAME || 'ilovememe.in';

    // Send email
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: getEmailSubject(),
      html: getEmailHtml(),
    });

    // Log success (without exposing the code)
    console.log('Email sent successfully to:', email, 'Message ID:', info.messageId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: 'Email sent successfully',
      }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Ensure we always return valid JSON
    const errorMessage = error?.message || 'Failed to send email';
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to send email',
        message: errorMessage,
      }),
    };
  }
};
