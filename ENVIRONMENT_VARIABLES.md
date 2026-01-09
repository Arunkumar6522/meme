# 🔐 Environment Variables Configuration

## For Netlify Deployment

Add these **4 environment variables** in your Netlify dashboard:

### Required Variables:

```env
VITE_SUPABASE_URL=https://csajwbsedfaegygaeooy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzYWp3YnNlZGZhZWd5Z2Flb295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NTc3NjksImV4cCI6MjA4MzUzMzc2OX0.Hw69uftUhcF2E49crp-KLWh_URAQC-RX0L7PCQoZdCo
NODE_ENV=production
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzYWp3YnNlZGZhZWd5Z2Flb295Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzk1Nzc2OSwiZXhwIjoyMDgzNTMzNzY5fQ.o3aIHMelGC6wNdVYoXTp4JjC4uERfd0Nnhp0UO6X9Uo
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
- Value: `https://csajwbsedfaegygaeooy.supabase.co`

**Variable 2:**
- Name: `VITE_SUPABASE_ANON_KEY`  
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzYWp3YnNlZGZhZWd5Z2Flb295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NTc3NjksImV4cCI6MjA4MzUzMzc2OX0.Hw69uftUhcF2E49crp-KLWh_URAQC-RX0L7PCQoZdCo`

**Variable 3:**
- Name: `NODE_ENV`
- Value: `production`

**Variable 4:** ⚠️ **IMPORTANT - This creates the database tables!**
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzYWp3YnNlZGZhZWd5Z2Flb295Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzk1Nzc2OSwiZXhwIjoyMDgzNTMzNzY5fQ.o3aIHMelGC6wNdVYoXTp4JjC4uERfd0Nnhp0UO6X9Uo`

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