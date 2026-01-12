# 🔐 Environment Variables Configuration

## For Netlify Deployment

Add these **4 environment variables** in your Netlify dashboard:

### Required Variables:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
NODE_ENV=production
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

# SMTP Email Configuration (Secure)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=YOUR_SMTP_USER
SMTP_PASSWORD=YOUR_SMTP_PASSWORD
SMTP_FROM_EMAIL=YOUR_FROM_EMAIL
SMTP_FROM_NAME=ilovememe.in

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
VITE_GOOGLE_ADS_CLIENT_ID=ca-pub-your-id-here
VITE_ENABLE_ANALYTICS=false
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