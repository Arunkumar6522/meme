-- Storage Policies Setup for Meme Library
-- Run this SQL in Supabase SQL Editor to allow admin uploads and public reads

-- Policy for library-audio bucket
-- Drop existing policies if they exist, then create new ones
DROP POLICY IF EXISTS "Public read access for library-audio" ON storage.objects;
CREATE POLICY "Public read access for library-audio"
ON storage.objects
FOR SELECT
USING (bucket_id = 'library-audio');

DROP POLICY IF EXISTS "Admin upload access for library-audio" ON storage.objects;
CREATE POLICY "Admin upload access for library-audio"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'library-audio' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admin update access for library-audio" ON storage.objects;
CREATE POLICY "Admin update access for library-audio"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'library-audio' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admin delete access for library-audio" ON storage.objects;
CREATE POLICY "Admin delete access for library-audio"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'library-audio' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy for library-video bucket
DROP POLICY IF EXISTS "Public read access for library-video" ON storage.objects;
CREATE POLICY "Public read access for library-video"
ON storage.objects
FOR SELECT
USING (bucket_id = 'library-video');

DROP POLICY IF EXISTS "Admin upload access for library-video" ON storage.objects;
CREATE POLICY "Admin upload access for library-video"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'library-video' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admin update access for library-video" ON storage.objects;
CREATE POLICY "Admin update access for library-video"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'library-video' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admin delete access for library-video" ON storage.objects;
CREATE POLICY "Admin delete access for library-video"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'library-video' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy for thumbnails bucket
DROP POLICY IF EXISTS "Public read access for thumbnails" ON storage.objects;
CREATE POLICY "Public read access for thumbnails"
ON storage.objects
FOR SELECT
USING (bucket_id = 'thumbnails');

DROP POLICY IF EXISTS "Admin upload access for thumbnails" ON storage.objects;
CREATE POLICY "Admin upload access for thumbnails"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'thumbnails' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admin update access for thumbnails" ON storage.objects;
CREATE POLICY "Admin update access for thumbnails"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'thumbnails' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admin delete access for thumbnails" ON storage.objects;
CREATE POLICY "Admin delete access for thumbnails"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'thumbnails' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
