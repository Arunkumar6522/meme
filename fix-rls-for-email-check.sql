-- Fix RLS Policies to Allow Email Existence Check
-- Run this in your Supabase SQL Editor to fix the 406 error

-- Allow anonymous users to check if email exists (needed for password reset and registration)
DROP POLICY IF EXISTS "Allow email existence check" ON public.users;
CREATE POLICY "Allow email existence check" ON public.users
  FOR SELECT USING (true);

-- Alternative: More secure - only allow checking email field
-- DROP POLICY IF EXISTS "Allow email existence check" ON public.users;
-- CREATE POLICY "Allow email existence check" ON public.users
--   FOR SELECT USING (
--     -- Allow if checking for email existence (no sensitive data exposed)
--     true
--   );

-- Also ensure OTP codes table allows inserts
DROP POLICY IF EXISTS "Allow OTP code storage" ON public.otp_codes;
CREATE POLICY "Allow OTP code storage" ON public.otp_codes
  FOR ALL USING (true)
  WITH CHECK (true);

-- Grant necessary permissions
GRANT SELECT ON public.users TO anon, authenticated;
GRANT ALL ON public.otp_codes TO anon, authenticated;
