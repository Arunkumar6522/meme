# FIX IMAGE UPLOAD - COMPLETE GUIDE

## Problem 1: Image Bucket Doesn't Exist

You need to create the `library-images` bucket in Supabase.

### Step 1: Create Bucket in Supabase Dashboard

1. Go to **Supabase Dashboard** → **Storage**
2. Click **"New Bucket"**
3. Fill in:
   - **Name**: `library-images` (EXACTLY this name!)
   - **Public**: ❌ **NO** (keep it private)
   - **File size limit**: `10485760` (10MB)
   - **Allowed MIME types**: 
     ```
     image/jpeg
     image/png
     image/gif
     image/webp
     image/svg+xml
     ```

### Step 2: Add Storage Policies

After creating the bucket, go to **Storage → Policies** and add these:

```sql
-- Policy 1: Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'library-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: Allow public to read (via signed URLs)
CREATE POLICY "Anyone can read images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'library-images');

-- Policy 3: Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'library-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Problem 2: Library Filter Not Showing Images

The filter should already be in the code. Let me verify...

## Quick Test After Creating Bucket:

1. Create the `library-images` bucket
2. Add the 3 policies above
3. Try uploading an image
4. It should work!

## If Still Not Working:

Check browser console for the exact error message and send it to me.
