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

-- ============================================================
-- Search (case-insensitive partial + typo-tolerant)
-- Requires pg_trgm extension for fuzzy matching.
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Helpful trigram indexes (optional but recommended once you have many rows)
CREATE INDEX IF NOT EXISTS idx_library_items_title_trgm
  ON public.library_items USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_library_items_description_trgm
  ON public.library_items USING gin (description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_library_items_keywords_trgm
  ON public.library_items USING gin ((array_to_string(keywords, ' ')) gin_trgm_ops);

-- Fuzzy search function used by the app when filters.search is present.
-- Returns published items only (safe for anon/authenticated).
CREATE OR REPLACE FUNCTION public.search_library_items(
  q text,
  p_media_type text DEFAULT NULL,
  p_emotion text DEFAULT NULL,
  p_languages text[] DEFAULT NULL,
  p_artist text[] DEFAULT NULL,
  p_sort_by text DEFAULT 'latest',
  p_page int DEFAULT 1,
  p_per_page int DEFAULT 20
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  keywords text[],
  emotion text,
  media_type text,
  file_url text,
  thumbnail_url text,
  file_bucket text,
  file_path text,
  thumbnail_bucket text,
  thumbnail_path text,
  languages text[],
  duration integer,
  file_size bigint,
  is_published boolean,
  download_count integer,
  created_at timestamptz,
  updated_at timestamptz,
  created_by uuid,
  total_count bigint,
  rank real
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
WITH norm AS (
  SELECT trim(coalesce(q, '')) AS q
),
base AS (
  SELECT
    li.*,
    greatest(
      similarity(coalesce(li.title, ''), (SELECT q FROM norm)),
      similarity(coalesce(li.description, ''), (SELECT q FROM norm)),
      coalesce((
        SELECT max(similarity(coalesce(kw, ''), (SELECT q FROM norm)))
        FROM unnest(coalesce(li.keywords, '{}'::text[])) kw
      ), 0)
    ) AS rank
  FROM public.library_items li
  WHERE li.is_published = true
    AND (p_media_type IS NULL OR p_media_type = '' OR li.media_type = p_media_type)
    AND (p_emotion IS NULL OR p_emotion = '' OR li.emotion = p_emotion)
    AND (p_languages IS NULL OR array_length(p_languages, 1) IS NULL OR li.languages && p_languages)
    AND (p_artist IS NULL OR array_length(p_artist, 1) IS NULL OR li.keywords @> p_artist)
    AND (
      (SELECT q FROM norm) = ''
      OR li.title ILIKE '%' || (SELECT q FROM norm) || '%'
      OR li.description ILIKE '%' || (SELECT q FROM norm) || '%'
      OR EXISTS (
        SELECT 1 FROM unnest(coalesce(li.keywords, '{}'::text[])) kw
        WHERE kw ILIKE '%' || (SELECT q FROM norm) || '%'
      )
      OR similarity(coalesce(li.title, ''), (SELECT q FROM norm)) > 0.22
      OR similarity(coalesce(li.description, ''), (SELECT q FROM norm)) > 0.22
      OR EXISTS (
        SELECT 1 FROM unnest(coalesce(li.keywords, '{}'::text[])) kw
        WHERE similarity(coalesce(kw, ''), (SELECT q FROM norm)) > 0.22
      )
    )
)
SELECT
  base.*,
  count(*) OVER () AS total_count
FROM base
ORDER BY
  CASE WHEN (SELECT q FROM norm) <> '' THEN rank ELSE NULL END DESC NULLS LAST,
  CASE WHEN p_sort_by = 'trending' THEN download_count ELSE NULL END DESC NULLS LAST,
  CASE WHEN p_sort_by = 'title' THEN title ELSE NULL END ASC NULLS LAST,
  created_at DESC
LIMIT greatest(p_per_page, 1)
OFFSET greatest((p_page - 1), 0) * greatest(p_per_page, 1);
$$;

-- OTP codes indexes
CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON public.otp_codes(email);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires_at ON public.otp_codes(expires_at);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.users TO anon, authenticated;
GRANT SELECT ON public.library_items TO anon, authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.library_items TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_library_items(text, text, text, text[], text[], text, int, int) TO anon, authenticated;
-- OTP is handled server-side via Netlify functions using SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
-- Do NOT allow anon/authenticated roles direct access to otp_codes.
REVOKE ALL ON public.otp_codes FROM anon, authenticated;

-- RLS Policies for OTP codes
-- Intentionally no policies for anon/authenticated.

-- Storage setup (create these buckets manually in Supabase dashboard)
-- Bucket names: library-audio, library-video, thumbnails
-- Make them public with 100MB file size limit