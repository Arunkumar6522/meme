# Storage Buckets Setup Guide

## Required Storage Buckets

To enable file uploads, you need to create the following storage buckets in Supabase:

1. **library-audio** - For audio files (MP3, WAV, etc.)
2. **library-video** - For video files (MP4, WebM, etc.)
3. **thumbnails** - For thumbnail images

## How to Create Buckets

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"** or **"Create bucket"**
4. Create each bucket with these settings:

### Bucket: `library-audio`
- **Name**: `library-audio`
- **Public bucket**: ✅ Yes (checked)
- **File size limit**: 100 MB
- **Allowed MIME types**: `audio/mpeg`, `audio/wav`, `audio/ogg`, `audio/mp3`

### Bucket: `library-video`
- **Name**: `library-video`
- **Public bucket**: ✅ Yes (checked)
- **File size limit**: 100 MB
- **Allowed MIME types**: `video/mp4`, `video/webm`, `video/ogg`

### Bucket: `thumbnails`
- **Name**: `thumbnails`
- **Public bucket**: ✅ Yes (checked)
- **File size limit**: 5 MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`

## Storage Policies

After creating buckets, you need to set up storage policies:

1. Go to **Storage** → Click on each bucket → **Policies**
2. Add the following policies:

### For all buckets:
- **Policy Name**: "Public read access"
- **Policy Type**: SELECT
- **Policy Definition**: `true` (allow all)

- **Policy Name**: "Admin upload access"
- **Policy Type**: INSERT
- **Policy Definition**: 
  ```sql
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
  ```

## Verification

After setup, try uploading a file from `/admin/upload`. If you see errors, check:
1. Buckets are created with exact names
2. Buckets are set to public
3. Storage policies are configured
4. Your user has admin role in the `users` table
