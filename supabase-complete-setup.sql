-- Complete Supabase Database Setup
-- Run this SQL in your Supabase dashboard if automatic creation fails

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' NOT NULL,
  preferred_languages TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create library_items table
CREATE TABLE IF NOT EXISTS public.library_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  keywords TEXT[] DEFAULT '{}',
  emotion TEXT NOT NULL,
  media_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  -- For private buckets + signed URLs (recommended)
  file_bucket TEXT,
  file_path TEXT,
  thumbnail_bucket TEXT,
  thumbnail_path TEXT,
  languages TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  duration INTEGER,
  file_size BIGINT,
  is_published BOOLEAN DEFAULT false NOT NULL,
  download_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_by UUID NOT NULL
);

-- Create OTP codes table for email verification
CREATE TABLE IF NOT EXISTS public.otp_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('signup', 'password_reset')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for users table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS Policies for library_items table
DROP POLICY IF EXISTS "Anyone can view published library items" ON public.library_items;
CREATE POLICY "Anyone can view published library items" ON public.library_items
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admins can view all library items" ON public.library_items;
CREATE POLICY "Admins can view all library items" ON public.library_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can insert library items" ON public.library_items;
CREATE POLICY "Admins can insert library items" ON public.library_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update library items" ON public.library_items;
CREATE POLICY "Admins can update library items" ON public.library_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete library items" ON public.library_items;
CREATE POLICY "Admins can delete library items" ON public.library_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Create helper functions
CREATE OR REPLACE FUNCTION increment_download_count(item_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.library_items 
  SET download_count = download_count + 1 
  WHERE id = item_id AND is_published = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_library_items_published ON public.library_items(is_published);
CREATE INDEX IF NOT EXISTS idx_library_items_emotion ON public.library_items(emotion);
CREATE INDEX IF NOT EXISTS idx_library_items_media_type ON public.library_items(media_type);
CREATE INDEX IF NOT EXISTS idx_library_items_created_at ON public.library_items(created_at);

-- OTP codes indexes
CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON public.otp_codes(email);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires_at ON public.otp_codes(expires_at);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.users TO anon, authenticated;
GRANT SELECT ON public.library_items TO anon, authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.library_items TO authenticated;
-- OTP is handled server-side via Netlify functions using SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
-- Do NOT allow anon/authenticated roles direct access to otp_codes.
REVOKE ALL ON public.otp_codes FROM anon, authenticated;

-- RLS Policies for OTP codes
-- Intentionally no policies for anon/authenticated.

-- Storage setup (create these buckets manually in Supabase dashboard)
-- Bucket names: library-audio, library-video, thumbnails
-- Make them public with 100MB file size limit