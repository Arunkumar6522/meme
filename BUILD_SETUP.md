# 🔧 Build-Time Database Setup

Your app now creates database tables automatically during the Netlify build process!

## How It Works

1. **During Build:** `npm run build` → `npm run setup-db` → `vite build`
2. **Setup Script:** `scripts/setup-database.js` runs with admin privileges
3. **Creates:** All tables, indexes, functions, and storage buckets
4. **Result:** Database ready when site goes live

## Required Environment Variable

Add this to your **Netlify Environment Variables**:

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### How to Get Service Role Key:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `gqmyazrdbhoilhorhond`
3. Go to **Settings** → **API**
4. Copy the **service_role** key (not the anon key!)
5. Add it to Netlify environment variables

## What Gets Created During Build:

✅ **Tables:**
- `public.users` - User profiles with roles
- `public.library_items` - Meme library with metadata

✅ **Security:**
- Row Level Security (RLS) policies
- Admin-only upload permissions
- User access controls

✅ **Functions:**
- `increment_download_count()` - Track downloads
- `handle_new_user()` - Auto-create user profiles

✅ **Storage Buckets:**
- `library-audio` - Audio files
- `library-video` - Video files  
- `thumbnails` - Thumbnail images

✅ **Indexes:**
- Performance optimized queries
- Fast search and filtering

## Build Process:

```bash
# During Netlify build:
npm install                    # Install dependencies
npm run setup-db              # Create database tables ← NEW!
vite build                     # Build the app
```

## Fallback:

If the service role key is missing:
- Build continues without database setup
- Shows warning message
- User can still run SQL manually later

## Benefits:

- ✅ **Automatic:** Tables created during build
- ✅ **No manual setup:** Everything ready on deploy
- ✅ **Admin privileges:** Uses service role key
- ✅ **Safe:** Only runs during build, not runtime
- ✅ **Fast:** Database ready immediately

Your database will be fully set up automatically every time you deploy! 🚀