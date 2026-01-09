# 🗄️ Supabase Database Setup

Your site is deployed! Now let's set up the database quickly.

## Quick Database Setup

### 1. Go to Supabase SQL Editor
1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `gqmyazrdbhoilhorhond`
3. Go to **SQL Editor**

### 2. Run This SQL (Copy & Paste)

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
  CREATE TYPE emotion_type AS ENUM (
    'happy', 'sad', 'funny', 'thug', 'angry', 
    'surprised', 'confused', 'excited', 'dramatic', 'sarcastic'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE media_type AS ENUM ('audio', 'video');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Library items table
CREATE TABLE IF NOT EXISTS public.library_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  keywords TEXT[] DEFAULT '{}',
  emotion emotion_type NOT NULL,
  media_type media_type NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER,
  file_size BIGINT,
  is_published BOOLEAN DEFAULT false NOT NULL,
  download_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_library_items_published ON public.library_items(is_published);
CREATE INDEX IF NOT EXISTS idx_library_items_emotion ON public.library_items(emotion);
CREATE INDEX IF NOT EXISTS idx_library_items_media_type ON public.library_items(media_type);
CREATE INDEX IF NOT EXISTS idx_library_items_download_count ON public.library_items(download_count DESC);
CREATE INDEX IF NOT EXISTS idx_library_items_created_at ON public.library_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_library_items_keywords ON public.library_items USING GIN(keywords);

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
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Library items policies
DROP POLICY IF EXISTS "Anyone can view published library items" ON public.library_items;
CREATE POLICY "Anyone can view published library items" ON public.library_items
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Authenticated users can view all library items" ON public.library_items;
CREATE POLICY "Authenticated users can view all library items" ON public.library_items
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can insert library items" ON public.library_items;
CREATE POLICY "Admins can insert library items" ON public.library_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update library items" ON public.library_items;
CREATE POLICY "Admins can update library items" ON public.library_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete library items" ON public.library_items;
CREATE POLICY "Admins can delete library items" ON public.library_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 3. Create Storage Buckets
1. Go to **Storage** in Supabase
2. Create these buckets:
   - `library-audio` (public)
   - `library-video` (public)  
   - `thumbnails` (public)

### 4. Configure Authentication
1. Go to **Authentication** → **Settings**
2. Set **Site URL** to: `https://your-netlify-site.netlify.app`
3. Add to **Redirect URLs**: `https://your-netlify-site.netlify.app/**`

### 5. Make Yourself Admin
1. Register an account on your site
2. Go to Supabase → **Table Editor** → **users**
3. Find your user record
4. Change `role` from `user` to `admin`

### 6. Test Upload
1. Go to `/admin/upload` on your site
2. Upload your first meme!

## ✅ That's It!

Your meme library is now fully functional! The 401 errors will disappear once the database is set up.

**Your site:** https://your-netlify-site.netlify.app