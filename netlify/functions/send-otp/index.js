// Netlify serverless function to send OTP emails securely
// This prevents OTP codes from being exposed in client-side code

const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({}),
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

    const { email, code, type } = requestData;

    // Validate input
    if (!email || !code || !type) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: email, code, type' }),
      };
    }

    // Get SMTP configuration from environment variables
    const smtpConfig = {
      host: process.env.VITE_SMTP_HOST || process.env.SMTP_HOST,
      port: parseInt(process.env.VITE_SMTP_PORT || process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.VITE_SMTP_USER || process.env.SMTP_USER,
        pass: process.env.VITE_SMTP_PASSWORD || process.env.SMTP_PASSWORD,
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
              <h1 style="font-size: 32px; letter-spacing: 8px; color: #4F46E5; margin: 0;">${code}</h1>
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

    const fromEmail = process.env.VITE_SMTP_FROM_EMAIL || process.env.SMTP_FROM_EMAIL || smtpConfig.auth.user;
    const fromName = process.env.VITE_SMTP_FROM_NAME || process.env.SMTP_FROM_NAME || 'Meme Library';

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
