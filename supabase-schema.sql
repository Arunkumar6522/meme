-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE emotion_type AS ENUM (
  'happy',
  'sad', 
  'funny',
  'thug',
  'angry',
  'surprised',
  'confused',
  'excited',
  'dramatic',
  'sarcastic'
);

CREATE TYPE media_type AS ENUM ('audio', 'video');
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Library items table
CREATE TABLE public.library_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  keywords TEXT[] DEFAULT '{}',
  emotion emotion_type NOT NULL,
  media_type media_type NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER, -- in seconds
  file_size BIGINT, -- in bytes
  is_published BOOLEAN DEFAULT false NOT NULL,
  download_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL
);

-- Indexes for better performance
CREATE INDEX idx_library_items_published ON public.library_items(is_published);
CREATE INDEX idx_library_items_emotion ON public.library_items(emotion);
CREATE INDEX idx_library_items_media_type ON public.library_items(media_type);
CREATE INDEX idx_library_items_download_count ON public.library_items(download_count DESC);
CREATE INDEX idx_library_items_created_at ON public.library_items(created_at DESC);
CREATE INDEX idx_library_items_keywords ON public.library_items USING GIN(keywords);

-- Full text search index
CREATE INDEX idx_library_items_search ON public.library_items 
USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_library_items_updated_at 
  BEFORE UPDATE ON public.library_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(item_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.library_items 
  SET download_count = download_count + 1 
  WHERE id = item_id AND is_published = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Library items policies
CREATE POLICY "Anyone can view published library items" ON public.library_items
  FOR SELECT USING (is_published = true);

CREATE POLICY "Authenticated users can view all library items" ON public.library_items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert library items" ON public.library_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update library items" ON public.library_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete library items" ON public.library_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Storage policies

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('library-audio', 'library-audio', true),
  ('library-video', 'library-video', true),
  ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for library-audio bucket
CREATE POLICY "Anyone can view audio files" ON storage.objects
  FOR SELECT USING (bucket_id = 'library-audio');

CREATE POLICY "Admins can upload audio files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'library-audio' AND
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update audio files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'library-audio' AND
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete audio files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'library-audio' AND
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Storage policies for library-video bucket
CREATE POLICY "Anyone can view video files" ON storage.objects
  FOR SELECT USING (bucket_id = 'library-video');

CREATE POLICY "Admins can upload video files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'library-video' AND
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update video files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'library-video' AND
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete video files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'library-video' AND
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Storage policies for thumbnails bucket
CREATE POLICY "Anyone can view thumbnails" ON storage.objects
  FOR SELECT USING (bucket_id = 'thumbnails');

CREATE POLICY "Admins can upload thumbnails" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'thumbnails' AND
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update thumbnails" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'thumbnails' AND
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete thumbnails" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'thumbnails' AND
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Sample data (optional - for development)
-- INSERT INTO public.library_items (
--   title, description, keywords, emotion, media_type, file_url, is_published, created_by
-- ) VALUES 
-- ('Bruh Sound Effect', 'Classic bruh moment sound', ARRAY['bruh', 'meme', 'reaction'], 'funny', 'audio', 'https://example.com/bruh.mp3', true, (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1)),
-- ('Dramatic Chipmunk', 'Dramatic pause with chipmunk', ARRAY['dramatic', 'pause', 'chipmunk'], 'dramatic', 'video', 'https://example.com/dramatic-chipmunk.mp4', true, (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1));

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;