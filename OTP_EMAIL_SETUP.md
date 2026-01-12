# OTP Email Setup Guide

## Overview

The password reset flow now uses a secure backend Netlify function to send OTP emails. This prevents OTP codes from being exposed in client-side code or browser console.

## Flow

1. **Forgot Password** → User enters email
2. **OTP Screen** → User enters 6-digit code received via email
3. **Reset Password** → User sets new password and confirms it

## Security Features

✅ OTP codes are never logged to console  
✅ OTP codes are never exposed in client-side code  
✅ Email sending happens on secure backend (Netlify function)  
✅ OTP codes are stored securely in database with expiration

## Setup Instructions

### 1. Install Netlify Function Dependencies

```bash
cd netlify/functions/send-otp
npm install
```

### 2. Configure Environment Variables

Add these to your Netlify dashboard (Site settings → Environment variables):

**Required:**
- `SMTP_HOST` - SMTP server host (e.g., `smtp.gmail.com`)
- `SMTP_PORT` - SMTP port (e.g., `587`)
- `SMTP_USER` - SMTP username/email
- `SMTP_PASSWORD` - SMTP password/app password
- `SMTP_FROM_EMAIL` - From email address
- `SMTP_FROM_NAME` - From name (e.g., "ilovememe.in")

**Note:** For Gmail, you'll need to:
1. Enable 2-factor authentication
2. Generate an "App Password" 
3. Use the app password as `SMTP_PASSWORD`

### 3. Local Development

For local development, the app will:
- Store OTP codes in the database
- Attempt to call Netlify function
- If function unavailable, fall back gracefully (OTP still stored, can be verified)

To test locally with Netlify CLI:
```bash
npm install -g netlify-cli
netlify dev
```

### 4. Production Deployment

1. Deploy to Netlify
2. Ensure environment variables are set
3. Netlify will automatically deploy the function
4. Test the forgot password flow

## Testing the Flow

1. Go to `/auth/forgot-password`
2. Enter your email address
3. Click "Send Reset Instructions"
4. Check your email for the 6-digit code
5. Enter the code on the OTP verification screen
6. Set your new password
7. Confirm your new password
8. Sign in with your new password

## Troubleshooting

### Email not received
- Check spam folder
- Verify SMTP credentials are correct
- Check Netlify function logs
- Ensure SMTP port is not blocked

### OTP screen not showing
- Check browser console for errors
- Verify `setStep('otp')` is being called
- Check network tab for failed requests

### Function not found (404)
- Ensure `netlify.toml` has `functions = "netlify/functions"`
- Verify function is deployed
- Check function URL in network requests

## Security Notes

⚠️ **Never expose OTP codes in:**
- Console logs
- Client-side code
- Browser network responses
- Error messages

✅ **OTP codes are:**
- Generated server-side (in Netlify function)
- Sent via secure email
- Stored encrypted in database
- Expire after 10 minutes
- Deleted after use
