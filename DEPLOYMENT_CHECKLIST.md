# 🚀 Deployment Checklist - OTP Email Functionality

## ✅ Pre-Deployment Checklist

### 1. Code is Ready ✅
- [x] Netlify function created (`netlify/functions/send-otp/index.js`)
- [x] Function dependencies installed (`nodemailer`)
- [x] `netlify.toml` configured with `functions = "netlify/functions"`
- [x] OTP service updated to call Netlify function in production
- [x] Fallback handling for development mode

### 2. Required Environment Variables in Netlify

**Go to Netlify Dashboard → Site Settings → Environment Variables**

Add these **SMTP variables** (required for email sending):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=ilovememe.in
```

**Note:** For Gmail:
1. Enable 2-factor authentication
2. Generate an "App Password" (not your regular password)
3. Use the app password as `SMTP_PASSWORD`

### 3. Existing Environment Variables

Make sure these are already set (from your ENVIRONMENT_VARIABLES.md):
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
NODE_ENV=production
SUPABASE_SERVICE_ROLE_KEY=...
```

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add secure OTP email functionality with Netlify function"
git push origin main
```

### Step 2: Netlify Auto-Deploys
- Netlify will automatically detect the push
- It will build your site and deploy the function
- Check the deploy logs to ensure:
  - ✅ Build succeeds
  - ✅ Function deploys successfully
  - ✅ No errors

### Step 3: Verify Function Deployment
1. Go to Netlify Dashboard → Functions
2. You should see `send-otp` function listed
3. Click on it to see logs and test it

### Step 4: Test Email Sending
1. Go to your deployed site
2. Navigate to `/auth/forgot-password`
3. Enter an email address
4. Click "Send Reset Instructions"
5. Check your email inbox (and spam folder)
6. You should receive the OTP code

## 🔍 Troubleshooting

### Issue: "Email service not configured"
**Solution:** Make sure all SMTP environment variables are set in Netlify dashboard

### Issue: "Failed to send email"
**Solution:** 
- Check Netlify function logs
- Verify SMTP credentials are correct
- For Gmail, ensure you're using an App Password, not regular password

### Issue: Function returns 404
**Solution:**
- Check `netlify.toml` has `functions = "netlify/functions"`
- Verify function folder structure is correct
- Redeploy the site

### Issue: Function returns 500
**Solution:**
- Check Netlify function logs for errors
- Verify `nodemailer` is installed in `netlify/functions/send-otp/package.json`
- Check SMTP configuration

## 📝 Production Behavior

### What Happens in Production:
1. User enters email → clicks "Send Reset Instructions"
2. OTP code is generated and stored in database
3. Netlify function is called to send email
4. Email is sent via SMTP (Gmail, etc.)
5. User receives email with OTP code
6. User enters code → verifies → resets password

### Security Features:
- ✅ OTP codes never exposed in console
- ✅ OTP codes never exposed in client-side code
- ✅ Email sending happens on secure backend (Netlify function)
- ✅ OTP codes expire after 10 minutes
- ✅ OTP codes deleted after use

## ✅ Post-Deployment Verification

After deploying, verify:
- [ ] Function appears in Netlify Functions list
- [ ] Can trigger forgot password flow
- [ ] Email is received (check spam folder)
- [ ] OTP code works for verification
- [ ] Password reset completes successfully

## 🎉 Success!

Once all environment variables are set and deployed, the OTP email functionality will work perfectly in production!
