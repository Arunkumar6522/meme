# Create Image Storage Bucket in Supabase

## Step 1: Go to Supabase Dashboard
1. Open your Supabase project
2. Click on **Storage** in the left sidebar
3. Click **New Bucket**

## Step 2: Create the Bucket
Fill in these details:

**Bucket Name**: `library-images`
**Public**: ❌ No (keep it private - we use signed URLs)
**File size limit**: `10485760` (10MB in bytes)
**Allowed MIME types**: 
```
image/jpeg
image/png
image/gif
image/webp
image/svg+xml
```

## Step 3: Set Bucket Policies (RLS)

After creating the bucket, go to **Storage → Policies** and add:

### Policy 1: Allow Authenticated Users to Upload
```sql
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'library-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 2: Allow Anyone to Read (via signed URLs)
```sql
CREATE POLICY "Anyone can read images via signed URLs"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'library-images');
```

### Policy 3: Allow Admins to Delete
```sql
CREATE POLICY "Admins can delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'library-images' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND (users.is_admin = true OR users.is_super_admin = true)
  )
);
```

## Step 4: Test Image Upload

1. Go to `/upload` in your app
2. Click **Image** media type
3. Select an image (JPG, PNG, GIF, WebP)
4. Fill in title, emotion, keywords
5. Click **Upload Meme**

## Expected Result:
✅ Image uploads successfully
✅ Saved to `library-images` bucket
✅ Stored in database with media_type='image'
✅ Visible in library when you filter by "Image"

## Troubleshooting:

**Error: "Bucket not found"**
→ Make sure bucket name is exactly `library-images`

**Error: "Invalid mediaType"**  
→ Already fixed! Netlify function now supports 'image'

**Images not showing in library**
→ Need to update LibraryCard component to display images (next step)
