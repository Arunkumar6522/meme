# Configuration Guide

## Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

### Required Configuration

```env
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Application Settings
VITE_APP_NAME=Meme Library
VITE_APP_VERSION=1.0.0
NODE_ENV=development
```

### Optional Configuration

```env
# Google Ads Integration (Optional)
VITE_GOOGLE_ADS_CLIENT_ID=ca-pub-xxxxxxxxxx

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_UPLOADS=true
```

## Supabase Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be ready
4. Go to Settings → API
5. Copy your Project URL and anon public key

### 2. Database Auto-Initialization
The application will automatically:
- Create required tables if they don't exist
- Set up Row Level Security (RLS) policies
- Create storage buckets
- Set up helper functions and triggers

**No manual SQL execution needed!** The app handles everything serverlessly.

### 3. Authentication Setup
1. Go to Authentication → Settings
2. Configure Google OAuth:
   - Add your site URL to "Site URL"
   - Enable Google provider
   - Add Google OAuth credentials

### 4. Storage Configuration
The app automatically creates these buckets:
- `library-audio` - For audio files
- `library-video` - For video files  
- `thumbnails` - For thumbnail images

## Google OAuth Setup

### 1. Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Add authorized domains:
   - `localhost:3000` (development)
   - Your production domain

### 2. Supabase Integration
1. In Supabase Dashboard → Authentication → Settings
2. Enable Google provider
3. Add your Google OAuth Client ID and Secret
4. Set redirect URL: `https://your-project.supabase.co/auth/v1/callback`

## Admin User Setup

### Automatic Admin Creation
The first user to register will need to be made admin manually:

1. Register a user account
2. Go to Supabase Dashboard → Table Editor → users
3. Find your user record
4. Change the `role` field from `user` to `admin`

### Programmatic Admin Creation
You can also use the database service:

```typescript
import { DatabaseService } from '@/services/database.service';

// Make user admin
await DatabaseService.makeUserAdmin('user-id-here');
```

## Security Best Practices

### Environment Variables
- ✅ Never commit `.env` files to git
- ✅ Use different keys for development/production
- ✅ Rotate keys regularly
- ✅ Use Supabase RLS policies

### File Uploads
- ✅ File type validation
- ✅ File size limits (100MB for media, 5MB for thumbnails)
- ✅ Virus scanning (recommended for production)
- ✅ CDN integration (recommended)

### Database Security
- ✅ Row Level Security (RLS) enabled
- ✅ Admin-only upload permissions
- ✅ Authenticated user access only
- ✅ SQL injection protection via Supabase

## Production Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically

### Environment Variables for Production
```env
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-prod-anon-key
VITE_GOOGLE_ADS_CLIENT_ID=ca-pub-your-prod-id
VITE_APP_NAME=Meme Library
NODE_ENV=production
```

### Domain Configuration
1. Update Supabase site URL to production domain
2. Update Google OAuth authorized domains
3. Configure CDN for media files (optional)

## Troubleshooting

### Common Issues

**"Missing Supabase environment variables"**
- Check `.env.local` file exists
- Verify variable names are correct
- Restart development server

**"Database initialization failed"**
- Check Supabase project is active
- Verify API keys are correct
- Check network connectivity

**"Upload failed"**
- Verify storage buckets exist
- Check file size limits
- Ensure user has admin role

**"Google OAuth not working"**
- Verify OAuth credentials in Google Console
- Check authorized domains
- Ensure redirect URLs match

### Debug Mode
Set `NODE_ENV=development` to enable:
- Detailed console logging
- Configuration validation
- Error stack traces

## Feature Flags

Control features via environment variables:

```env
# Enable/disable Google Ads
VITE_GOOGLE_ADS_CLIENT_ID=ca-pub-xxx  # Set to enable

# Enable/disable analytics
VITE_ENABLE_ANALYTICS=true

# Enable/disable uploads (admin feature)
VITE_ENABLE_UPLOADS=true
```

## Database Schema Customization

The app uses a serverless approach - tables are created automatically based on TypeScript types. To customize:

1. Update types in `src/types/index.ts`
2. Modify `DatabaseService.createTables()` in `src/services/database.service.ts`
3. Use `DatabaseService.addColumn()` for migrations

Example:
```typescript
// Add new column
await DatabaseService.addColumn(
  'library_items', 
  'new_field', 
  'TEXT', 
  "'default_value'"
);
```

## Support

For configuration help:
1. Check this guide first
2. Review console errors in browser dev tools
3. Check Supabase dashboard for errors
4. Verify all environment variables are set correctly

The application is designed to be self-configuring and will guide you through any missing setup steps.