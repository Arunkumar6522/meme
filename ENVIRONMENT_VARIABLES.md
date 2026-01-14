# 🔐 Environment Variables Configuration

## For Netlify Deployment

Add these **4 environment variables** in your Netlify dashboard:

### Required Variables:

```env
VITE_SUPABASE_URL=https://csajwbsedfaegygaeooy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzYWp3YnNlZGZhZWd5Z2Flb295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NTMwOTQsImV4cCI6MjA4MzUyOTA5NH0.gJOhLCcIEUNlGJxLSGQMZHwzOcKJiPdxSJCbmGEb4Zg
NODE_ENV=production
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzYWp3YnNlZGZhZWd5Z2Flb295Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzk1MzA5NCwiZXhwIjoyMDgzNTI5MDk0fQ.qB8tDAU1a2-kj9HoYgt9SavQq7ZHERAKEILVWvLiW9Q

# Google OAuth Configuration
VITE_ENABLE_GOOGLE_SSO=true
VITE_GOOGLE_OAUTH_CLIENT_ID=2007102877-kd1r89e9ekr1mi3t06i9pcueeuu9q682.apps.googleusercontent.com

# SMTP Email Configuration (Secure)
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=587
VITE_SMTP_USER=arunkumark1664@gmail.com
VITE_SMTP_PASSWORD=lilf nlea gvrw joif
VITE_SMTP_FROM_EMAIL=arunkumark1664@gmail.com
VITE_SMTP_FROM_NAME=I Love Meme

# OTP / Functions Security (Recommended)
# Comma-separated list of allowed origins for Netlify functions (no '*' in production)
ALLOWED_ORIGINS=https://ilovememe.in,https://www.ilovememe.in
# Secret used to hash OTP codes before storing in DB (server-only)
OTP_HMAC_SECRET=YOUR_LONG_RANDOM_SECRET
# Throttle resend (seconds)
OTP_MIN_INTERVAL_SECONDS=30

# Signup completion (server-side)
# Requires Netlify function `complete-signup` to create user securely after OTP.

# Storage signed URLs (Recommended for security)
# Keep buckets PRIVATE in Supabase Storage.
# Admin upload uses Netlify function `storage-upload-url` and requires a valid session + admin role.
# Playback/download uses Netlify function `library-item-url` by itemId (no bucket/path exposure).
```

### Optional Variables:

```env
# Application Configuration
VITE_APP_NAME=ilovememe.in
VITE_APP_VERSION=1.2.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_UPLOADS=true
VITE_ENABLE_DEBUG_LOGS=false

# Google Ads (Monetag)
VITE_GOOGLE_ADS_CLIENT_ID=ae562b7ca89a32cf54f0e23d39a65ba5
```

## How to Add in Netlify:

1. Go to your Netlify site dashboard
2. **Site settings** → **Environment variables**
3. Click **"Add variable"** for each one:

**Variable 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://YOUR_PROJECT_REF.supabase.co`

**Variable 2:**
- Name: `VITE_SUPABASE_ANON_KEY`  
- Value: `YOUR_SUPABASE_ANON_KEY`

**Variable 3:**
- Name: `NODE_ENV`
- Value: `production`

**Variable 4:** ⚠️ **IMPORTANT - This creates the database tables!**
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: `YOUR_SUPABASE_SERVICE_ROLE_KEY`

## What Each Key Does:

- **VITE_SUPABASE_URL**: Your Supabase project URL
- **VITE_SUPABASE_ANON_KEY**: Public key for app users (limited permissions)
- **NODE_ENV**: Tells the app it's in production
- **SUPABASE_SERVICE_ROLE_KEY**: Admin key for creating tables during build ⚠️

## After Adding Variables:

1. **Trigger new deployment** (push any change or click "Deploy site")
2. **Build will run:** Database tables created automatically
3. **Site goes live:** Ready to use immediately!

## Security Notes:

✅ **Safe to share:**
- VITE_SUPABASE_URL (public)
- VITE_SUPABASE_ANON_KEY (public, limited permissions)

⚠️ **Keep secret:**
- SUPABASE_SERVICE_ROLE_KEY (admin privileges, only for build)
- SMTP_PASSWORD (email credentials)