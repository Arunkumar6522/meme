import { supabase } from './supabase';

export class TableCreatorService {
  // Create tables by running SQL directly through Supabase
  static async createAllTables(): Promise<boolean> {
    try {
      console.log('Creating database tables...');
      
      // SQL to create all tables and functions
      const createTablesSQL = `
        -- Enable UUID extension
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        
        -- Create users table
        CREATE TABLE IF NOT EXISTS public.users (
          id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          full_name TEXT,
          avatar_url TEXT,
          role TEXT DEFAULT 'user' NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );

        -- Create library_items table
        CREATE TABLE IF NOT EXISTS public.library_items (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          keywords TEXT[] DEFAULT '{}',
          emotion TEXT NOT NULL,
          media_type TEXT NOT NULL,
          file_url TEXT NOT NULL,
          thumbnail_url TEXT,
          duration INTEGER,
          file_size BIGINT,
          is_published BOOLEAN DEFAULT false NOT NULL,
          download_count INTEGER DEFAULT 0 NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          created_by UUID NOT NULL
        );

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_library_items_published ON public.library_items(is_published);
        CREATE INDEX IF NOT EXISTS idx_library_items_emotion ON public.library_items(emotion);
        CREATE INDEX IF NOT EXISTS idx_library_items_media_type ON public.library_items(media_type);
        CREATE INDEX IF NOT EXISTS idx_library_items_download_count ON public.library_items(download_count DESC);
        CREATE INDEX IF NOT EXISTS idx_library_items_created_at ON public.library_items(created_at DESC);

        -- Create download increment function
        CREATE OR REPLACE FUNCTION increment_download_count(item_id UUID)
        RETURNS VOID AS $$
        BEGIN
          UPDATE public.library_items 
          SET download_count = download_count + 1 
          WHERE id = item_id AND is_published = true;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        -- Create user registration trigger function
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

        -- Create trigger for new user registration
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

        -- Enable RLS
        ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies
        DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
        CREATE POLICY "Users can view their own profile" ON public.users
          FOR SELECT USING (auth.uid() = id);

        DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
        CREATE POLICY "Users can update their own profile" ON public.users
          FOR UPDATE USING (auth.uid() = id);

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
      `;

      // Execute the SQL
      const { error } = await supabase.rpc('exec_sql', { sql: createTablesSQL });
      
      if (error) {
        console.error('Error creating tables with exec_sql:', error);
        // Try alternative method
        return await this.createTablesAlternative();
      }

      console.log('✅ All tables created successfully!');
      return true;
    } catch (error) {
      console.error('Error in createAllTables:', error);
      return await this.createTablesAlternative();
    }
  }

  // Alternative method if exec_sql doesn't work
  private static async createTablesAlternative(): Promise<boolean> {
    try {
      console.log('Trying alternative table creation method...');
      
      // Create storage buckets first (this usually works)
      await this.createStorageBuckets();
      
      // Show user they need to run SQL manually
      console.warn('⚠️ Automatic table creation failed.');
      console.warn('Please run the SQL from SUPABASE_SETUP.md in your Supabase dashboard.');
      
      return false;
    } catch (error) {
      console.error('Alternative method also failed:', error);
      return false;
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
        });

        if (error && !error.message.includes('already exists')) {
          console.warn(`Could not create bucket ${bucket.id}:`, error.message);
        } else {
          console.log(`✅ Bucket ${bucket.id} ready`);
        }
      } catch (error) {
        console.warn(`Error with bucket ${bucket.id}:`, error);
      }
    }
  }

  // Check if tables exist
  static async checkTablesExist(): Promise<boolean> {
    try {
      // Try to query both tables
      const { error: usersError } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      const { error: itemsError } = await supabase
        .from('library_items')
        .select('id')
        .limit(1);

      // If no errors, tables exist
      return !usersError && !itemsError;
    } catch (error) {
      return false;
    }
  }
}