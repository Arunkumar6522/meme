-- CREATE library-images BUCKET IN SUPABASE
-- Run this in Supabase SQL Editor

-- Step 1: Create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'library-images',
  'library-images',
  false,
  10485760,  -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Create upload policy
CREATE POLICY IF NOT EXISTS "auth_upload_images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'library-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Step 3: Create read policy
CREATE POLICY IF NOT EXISTS "public_read_images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'library-images');

-- Step 4: Create delete policy
CREATE POLICY IF NOT EXISTS "auth_delete_own_images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'library-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Step 5: Verify bucket was created
SELECT * FROM storage.buckets WHERE id = 'library-images';
