-- Fix Artists Table RLS Policy
-- Run this in Supabase SQL Editor

-- Allow authenticated users to read artists
CREATE POLICY IF NOT EXISTS "Authenticated users can read artists"
    ON public.artists
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow anonymous users to read artists (for public access)
CREATE POLICY IF NOT EXISTS "Anonymous users can read artists"
    ON public.artists
    FOR SELECT
    TO anon
    USING (true);
