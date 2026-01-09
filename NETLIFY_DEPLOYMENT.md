# 🚀 Netlify Deployment Guide

## Quick Deploy (Recommended)

### Option 1: Deploy from GitHub (Automatic)

1. **Go to Netlify Dashboard**
   - Visit [netlify.com](https://netlify.com)
   - Sign up/Login with GitHub

2. **Import from Git**
   - Click "New site from Git"
   - Choose "GitHub"
   - Select your repository: `Arunkumar6522/meme`
   - Branch: `main`

3. **Build Settings** (Auto-detected)
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add these variables:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_GOOGLE_ADS_CLIENT_ID=ca-pub-your-id (optional)
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `https://random-name.netlify.app`

### Option 2: Manual Deploy (Quick Test)

```bash
# Build locally
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

## 🔧 Configuration Details

### Build Configuration
The `netlify.toml` file is already configured with:
- ✅ Build command: `npm run build`
- ✅ Publish directory: `dist`
- ✅ SPA redirect rules
- ✅ Security headers
- ✅ Asset caching
- ✅ Node.js 18 environment

### Environment Variables Required

**Production Environment Variables:**
```env
# Required - Get from Supabase Dashboard
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional - For Google Ads
VITE_GOOGLE_ADS_CLIENT_ID=ca-pub-1234567890

# App Configuration
VITE_APP_NAME=Meme Library
NODE_ENV=production
```

### Custom Domain Setup (Optional)

1. **Add Custom Domain**
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Enter your domain (e.g., `memelibrary.com`)

2. **Configure DNS**
   - Add CNAME record: `www` → `your-site.netlify.app`
   - Or A record: `@` → Netlify's IP

3. **SSL Certificate**
   - Automatically provisioned by Netlify
   - Force HTTPS enabled by default

## 🛡️ Security Configuration

### Supabase Settings for Production

1. **Update Site URL**
   - Go to Supabase Dashboard → Authentication → Settings
   - Set Site URL to: `https://your-netlify-domain.netlify.app`
   - Add to Additional URLs if using custom domain

2. **Update Redirect URLs**
   - Add: `https://your-netlify-domain.netlify.app/auth/callback`
   - Add: `https://your-netlify-domain.netlify.app/**` (for OAuth)

3. **CORS Settings**
   - Supabase automatically handles CORS for your domain
   - No additional configuration needed

### Google OAuth Setup

1. **Google Cloud Console**
   - Go to Credentials → OAuth 2.0 Client IDs
   - Add Authorized JavaScript origins:
     - `https://your-netlify-domain.netlify.app`
   - Add Authorized redirect URIs:
     - `https://your-project.supabase.co/auth/v1/callback`

## 📊 Performance Optimizations

### Already Configured:
- ✅ Static asset caching (1 year)
- ✅ Font caching
- ✅ Gzip compression
- ✅ Code splitting
- ✅ Lazy loading

### Additional Optimizations:
```toml
# Add to netlify.toml for even better performance
[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## 🔄 Continuous Deployment

### Automatic Deployments:
- ✅ Every push to `main` branch triggers deployment
- ✅ Preview deployments for pull requests
- ✅ Branch deployments for feature branches

### Deploy Previews:
- Each PR gets a unique preview URL
- Test changes before merging
- Share with team for review

## 🚨 Troubleshooting

### Common Issues:

**Build Fails:**
```bash
# Check build locally first
npm run build

# Common fixes:
npm install  # Install dependencies
npm run lint # Fix linting errors
```

**Environment Variables Not Working:**
- Ensure variables start with `VITE_`
- Check spelling and values
- Redeploy after adding variables

**404 Errors on Refresh:**
- SPA redirect rule in `netlify.toml` handles this
- Ensure `netlify.toml` is in repository root

**Supabase Connection Issues:**
- Verify SUPABASE_URL and ANON_KEY
- Check Supabase site URL settings
- Ensure CORS is configured

## 📈 Monitoring & Analytics

### Netlify Analytics:
- Built-in traffic analytics
- Performance monitoring
- Error tracking

### Custom Analytics:
```env
# Add to environment variables
VITE_ENABLE_ANALYTICS=true
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

## 🎯 Post-Deployment Checklist

After successful deployment:

1. **Test Core Features:**
   - [ ] User registration/login
   - [ ] Google OAuth
   - [ ] Library browsing
   - [ ] File downloads
   - [ ] Admin upload (make yourself admin first)

2. **Configure Admin User:**
   - [ ] Register an account
   - [ ] Go to Supabase → Table Editor → users
   - [ ] Change your role to 'admin'
   - [ ] Test admin upload portal

3. **Upload Sample Content:**
   - [ ] Go to `/admin/upload`
   - [ ] Upload test audio/video files
   - [ ] Verify they appear in library

4. **Performance Check:**
   - [ ] Test on mobile devices
   - [ ] Check loading speeds
   - [ ] Verify responsive design

## 🌟 Success!

Your meme library is now live on Netlify! 

**Next Steps:**
1. Share your live URL
2. Start uploading memes
3. Invite users to test
4. Monitor performance and usage

**Live URL:** `https://your-site-name.netlify.app`

---

Need help? Check the Netlify docs or Supabase documentation for additional configuration options.