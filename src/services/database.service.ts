import { supabase } from './supabase';
import type { EmotionType } from '@/types';

// Database schema definitions - code-level table creation
export class DatabaseService {
  // Check if tables exist and create them if they don't
  static async initializeDatabase(): Promise<boolean> {
    try {
      console.log('Initializing database...');
      
      // Check if tables exist
      const tablesExist = await this.checkTablesExist();
      
      if (!tablesExist) {
        console.log('Tables do not exist, creating...');
        await this.createTables();
        await this.createStorageBuckets();
        await this.setupRLS();
        console.log('Database initialized successfully');
      } else {
        console.log('Database already initialized');
      }
      
      return true;
    } catch (error) {
      console.error('Database initialization failed:', error);
      return false;
    }
  }

  // Check if required tables exist
  private static async checkTablesExist(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('library_items')
        .select('id')
        .limit(1);
      
      // If no error, table exists
      return !error;
    } catch {
      return false;
    }
  }

  // Create tables using Supabase SQL execution
  private static async createTables(): Promise<void> {
    const createTablesSQL = `
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

      -- Full text search index
      CREATE INDEX IF NOT EXISTS idx_library_items_search ON public.library_items 
      USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
    `;

    const { error } = await supabase.rpc('exec_sql', { sql: createTablesSQL });
    if (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }

  // Create storage buckets
  private static async createStorageBuckets(): Promise<void> {
    const buckets = [
      { id: 'library-audio', name: 'library-audio', public: true },
      { id: 'library-video', name: 'library-video', public: true },
      { id: 'thumbnails', name: 'thumbnails', public: true },
    ];

    for (const bucket of buckets) {
      try {
        const { error } = await supabase.storage.createBucket(bucket.id, {
          public: bucket.public,
          fileSizeLimit: 100 * 1024 * 1024, // 100MB
          allowedMimeTypes: bucket.id === 'library-audio' 
            ? ['audio/mpeg', 'audio/wav', 'audio/ogg']
            : bucket.id === 'library-video'
            ? ['video/mp4', 'video/webm', 'video/ogg']
            : ['image/jpeg', 'image/png', 'image/webp']
        });

        if (error && !error.message.includes('already exists')) {
          console.error(`Error creating bucket ${bucket.id}:`, error);
        }
      } catch (error) {
        console.error(`Error creating bucket ${bucket.id}:`, error);
      }
    }
  }

  // Setup Row Level Security policies
  private static async setupRLS(): Promise<void> {
    const rlsSQL = `
      -- Enable RLS
      ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;

      -- Users policies
      CREATE POLICY IF NOT EXISTS "Users can view their own profile" ON public.users
        FOR SELECT USING (auth.uid() = id);

      CREATE POLICY IF NOT EXISTS "Users can update their own profile" ON public.users
        FOR UPDATE USING (auth.uid() = id);

      -- Library items policies
      CREATE POLICY IF NOT EXISTS "Anyone can view published library items" ON public.library_items
        FOR SELECT USING (is_published = true);

      CREATE POLICY IF NOT EXISTS "Authenticated users can view all library items" ON public.library_items
        FOR SELECT USING (auth.role() = 'authenticated');

      CREATE POLICY IF NOT EXISTS "Admins can insert library items" ON public.library_items
        FOR INSERT WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
          )
        );

      CREATE POLICY IF NOT EXISTS "Admins can update library items" ON public.library_items
        FOR UPDATE USING (
          EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
          )
        );

      CREATE POLICY IF NOT EXISTS "Admins can delete library items" ON public.library_items
        FOR DELETE USING (
          EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
          )
        );
    `;

    const { error } = await supabase.rpc('exec_sql', { sql: rlsSQL });
    if (error) {
      console.error('Error setting up RLS:', error);
      throw error;
    }
  }

  // Create helper functions
  static async createHelperFunctions(): Promise<void> {
    const functionsSQL = `
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

      -- Function to update updated_at timestamp
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Triggers for updated_at
      DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
      CREATE TRIGGER update_users_updated_at 
        BEFORE UPDATE ON public.users 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_library_items_updated_at ON public.library_items;
      CREATE TRIGGER update_library_items_updated_at 
        BEFORE UPDATE ON public.library_items 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `;

    const { error } = await supabase.rpc('exec_sql', { sql: functionsSQL });
    if (error) {
      console.error('Error creating helper functions:', error);
      throw error;
    }
  }

  // Add new column to existing table (migration helper)
  static async addColumn(
    tableName: string, 
    columnName: string, 
    columnType: string, 
    defaultValue?: string
  ): Promise<boolean> {
    try {
      const sql = `
        ALTER TABLE ${tableName} 
        ADD COLUMN IF NOT EXISTS ${columnName} ${columnType}
        ${defaultValue ? `DEFAULT ${defaultValue}` : ''};
      `;

      const { error } = await supabase.rpc('exec_sql', { sql });
      if (error) {
        console.error(`Error adding column ${columnName}:`, error);
        return false;
      }
      return true;
    } catch (error) {
      console.error(`Error adding column ${columnName}:`, error);
      return false;
    }
  }

  // Check if user is admin
  static async isUserAdmin(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) return false;
      return data?.role === 'admin';
    } catch {
      return false;
    }
  }

  // Make user admin (for initial setup)
  static async makeUserAdmin(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', userId);

      return !error;
    } catch {
      return false;
    }
  }
}