# 🚀 Simple Netlify Deployment

## Quick Setup

### 1. Connect GitHub to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Choose "GitHub"
4. Select repository: `Arunkumar6522/meme`
5. Branch: `main`

### 2. Build Settings

```
Build command: npm run build
Publish directory: dist
```

### 3. Environment Variables

Add these in Netlify Dashboard → Site settings → Environment variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_GOOGLE_ADS_CLIENT_ID=ca-pub-your-id
NODE_ENV=production
```

### 4. Deploy!

Click "Deploy site" - that's it! 🎉

## After Deployment

1. **Configure Supabase:**
   - Update Site URL to your Netlify domain
   - Add OAuth redirect URLs

2. **Make Admin User:**
   - Register account
   - Go to Supabase → users table
   - Change role to 'admin'

3. **Test Upload:**
   - Go to `/admin/upload`
   - Upload your first meme!

Your site will be live at: `https://random-name.netlify.app`

## That's It!

No complex configuration needed - just connect GitHub and deploy! 🚀