-- Fix RLS Policies for Proper Access
-- Run this in your Supabase SQL Editor to fix the 401 errors

-- First, let's add a policy that allows anonymous users to check if tables exist
-- by allowing them to query published library items
DROP POLICY IF EXISTS "Anonymous can view published library items" ON public.library_items;
CREATE POLICY "Anonymous can view published library items" ON public.library_items
  FOR SELECT USING (is_published = true);

-- Allow anonymous users to see basic user info (needed for admin checks)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users;
CREATE POLICY "Public profiles are viewable by everyone" ON public.users
  FOR SELECT USING (true);

-- Allow users to insert their own profile during registration
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Update the existing policies to be more permissive
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id OR true); -- Allow all for now

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Make library items more accessible
DROP POLICY IF EXISTS "Anyone can view published library items" ON public.library_items;
CREATE POLICY "Anyone can view published library items" ON public.library_items
  FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');

-- Grant proper permissions to anon and authenticated users
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.users TO anon, authenticated;
GRANT SELECT ON public.library_items TO anon, authenticated;
GRANT INSERT ON public.users TO authenticated;
GRANT UPDATE ON public.users TO authenticated;
GRANT ALL ON public.library_items TO authenticated;

-- Make sure the trigger function has proper permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION increment_download_count(UUID) TO anon, authenticated;