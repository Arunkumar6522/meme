-- Fix RLS Policies for OTP Codes Table
-- Run this in your Supabase SQL Editor to fix the 406 error when verifying OTP

-- Allow anonymous and authenticated users to read OTP codes for verification
DROP POLICY IF EXISTS "Allow OTP code verification" ON public.otp_codes;
CREATE POLICY "Allow OTP code verification" ON public.otp_codes
  FOR SELECT USING (true);

-- Allow anonymous and authenticated users to insert OTP codes
DROP POLICY IF EXISTS "Allow OTP code storage" ON public.otp_codes;
CREATE POLICY "Allow OTP code storage" ON public.otp_codes
  FOR INSERT WITH CHECK (true);

-- Allow anonymous and authenticated users to delete OTP codes (for cleanup)
DROP POLICY IF EXISTS "Allow OTP code deletion" ON public.otp_codes;
CREATE POLICY "Allow OTP code deletion" ON public.otp_codes
  FOR DELETE USING (true);

-- Grant necessary permissions
GRANT SELECT, INSERT, DELETE ON public.otp_codes TO anon, authenticated;
