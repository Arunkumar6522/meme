# Image Upload Setup Guide

## ✅ Completed:
1. Frontend code updated to support image uploads
2. File validation accepts images (max 10MB)
3. Upload service updated to handle 'image' bucket type
4. TypeScript types updated

## 🚧 Required Steps to Complete:

### 1. Run Database Migration
You MUST run this SQL in your Supabase SQL Editor:

```sql
-- File: supabase/migrations/20240118_add_image_and_search_analytics.sql

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'image' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'media_type')
    ) THEN
        ALTER TYPE media_type ADD VALUE 'image';
    END IF;
END $$;
```

### 2. Create 'image' Storage Bucket in Supabase

Go to Supabase Dashboard → Storage → Create new bucket:
- **Name**: `image`
- **Public**: No (keep private)
- **File size limit**: 10MB
- **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp`

### 3. Update Storage Upload Function

Your Netlify function `storage-upload-url` needs to handle 'image' bucket:

```javascript
// In netlify/functions/storage-upload-url/index.js
const BUCKET_MAP = {
  audio: 'audio',
  video: 'video',
  image: 'image',  // ADD THIS LINE
  thumbnail: 'thumbnail'
};
```

### 4. Test Image Upload

1. Go to `/upload`
2. Click "Image" media type
3. Select an image file (JPG, PNG, GIF, WebP)
4. Fill in title, emotion, keywords
5. Click "Upload Meme"

## Expected Behavior:

- ✅ Image uploads to 'image' bucket
- ✅ Saved to database with media_type='image'
- ✅ Image serves as its own thumbnail
- ✅ No thumbnail generation needed

## Troubleshooting:

**Error: "Bucket not found"**
→ Create 'image' bucket in Supabase Storage

**Error: "Invalid media type"**
→ Update Netlify function to include 'image'

**Error: "File too large"**
→ Images are limited to 10MB (vs 100MB for video)

## Next Steps After This Works:

1. Update LibraryCard to display images
2. Implement infinite scroll for image gallery
3. Add image-specific filters
4. Create search analytics dashboard
