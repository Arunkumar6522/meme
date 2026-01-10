-- Storage Policies Setup for Meme Library
-- Run this SQL in Supabase SQL Editor to allow admin uploads and public reads

-- Policy for library-audio bucket
-- Allow public read access
CREATE POLICY IF NOT EXISTS "Public read access for library-audio"
ON storage.objects
FOR SELECT
USING (bucket_id = 'library-audio');

-- Allow admin uploads to library-audio
CREATE POLICY IF NOT EXISTS "Admin upload access for library-audio"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'library-audio' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow admin updates/deletes to library-audio
CREATE POLICY IF NOT EXISTS "Admin update access for library-audio"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'library-audio' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY IF NOT EXISTS "Admin delete access for library-audio"
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
CREATE POLICY IF NOT EXISTS "Public read access for library-video"
ON storage.objects
FOR SELECT
USING (bucket_id = 'library-video');

CREATE POLICY IF NOT EXISTS "Admin upload access for library-video"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'library-video' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY IF NOT EXISTS "Admin update access for library-video"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'library-video' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY IF NOT EXISTS "Admin delete access for library-video"
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
CREATE POLICY IF NOT EXISTS "Public read access for thumbnails"
ON storage.objects
FOR SELECT
USING (bucket_id = 'thumbnails');

CREATE POLICY IF NOT EXISTS "Admin upload access for thumbnails"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'thumbnails' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY IF NOT EXISTS "Admin update access for thumbnails"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'thumbnails' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY IF NOT EXISTS "Admin delete access for thumbnails"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'thumbnails' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
