-- =======================================================================
-- Video Downloader Usage Table
-- Run this in your Supabase Dashboard → SQL Editor
-- =======================================================================

-- Tracks each time a user downloads a video via the external video downloader.
-- Free users: 3 downloads/day  |  Pro users: unlimited (checked client-side)
CREATE TABLE IF NOT EXISTS public.video_downloads (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform   TEXT,                        -- e.g. "Youtube", "Instagram", "Tiktok"
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for fast daily-count lookup per user
CREATE INDEX IF NOT EXISTS idx_video_downloads_user_date
  ON public.video_downloads (user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.video_downloads ENABLE ROW LEVEL SECURITY;

-- Users can only read their own rows
CREATE POLICY "video_downloads: select own" ON public.video_downloads
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own rows
CREATE POLICY "video_downloads: insert own" ON public.video_downloads
  FOR INSERT WITH CHECK (auth.uid() = user_id);
