-- Fix Artists Table RLS Policies - Complete Solution
-- Run this in Supabase SQL Editor

-- First, drop all existing policies
DROP POLICY IF EXISTS "Authenticated users can read artists" ON public.artists;
DROP POLICY IF EXISTS "Anonymous users can read artists" ON public.artists;
DROP POLICY IF EXISTS "Admins can insert artists" ON public.artists;
DROP POLICY IF EXISTS "Admins can update artists" ON public.artists;
DROP POLICY IF EXISTS "Admins can delete artists" ON public.artists;

-- 1. SELECT Policy - Everyone can read
CREATE POLICY "Everyone can read artists"
    ON public.artists
    FOR SELECT
    USING (true);

-- 2. INSERT Policy - Only admins and superadmins can insert
CREATE POLICY "Admins can insert artists"
    ON public.artists
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND (users.is_admin = true OR users.is_super_admin = true)
        )
    );

-- 3. UPDATE Policy - Only admins and superadmins can update
CREATE POLICY "Admins can update artists"
    ON public.artists
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND (users.is_admin = true OR users.is_super_admin = true)
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND (users.is_admin = true OR users.is_super_admin = true)
        )
    );

-- 4. DELETE Policy - Only admins and superadmins can delete
CREATE POLICY "Admins can delete artists"
    ON public.artists
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND (users.is_admin = true OR users.is_super_admin = true)
        )
    );

-- Verify RLS is enabled
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
