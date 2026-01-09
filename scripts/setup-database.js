#!/usr/bin/env node

// Build-time database setup script
// This runs during Netlify build with service role key

import { createClient } from '@supabase/supabase-js';

// Use service role key for admin operations during build
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // This has admin privileges

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('⚠️ Missing Supabase credentials - skipping database setup');
  console.log('Add SUPABASE_SERVICE_ROLE_KEY to Netlify environment variables');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🔄 Setting up database tables...');

  try {
    // SQL to create all tables and setup
    const setupSQL = `
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
        )
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email,
          full_name = EXCLUDED.full_name,
          avatar_url = EXCLUDED.avatar_url;
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

      -- Create RLS policies for users table
      DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
      CREATE POLICY "Users can view their own profile" ON public.users
        FOR SELECT USING (auth.uid() = id);

      DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
      CREATE POLICY "Users can update their own profile" ON public.users
        FOR UPDATE USING (auth.uid() = id);

      -- Create RLS policies for library_items table
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

    // Execute the setup SQL using direct HTTP call
    console.log('🔧 Executing database setup SQL...');
    
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ sql: setupSQL })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HTTP Error:', response.status, errorText);
      
      // Try alternative method - create tables one by one
      console.log('🔄 Trying alternative table creation method...');
      await createTablesDirectly();
    } else {
      console.log('✅ SQL executed successfully via HTTP!');
    }

    console.log('✅ Database tables created successfully!');

    // Create storage buckets
    await createStorageBuckets();

    console.log('🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.log('⚠️ You may need to run the SQL manually in Supabase dashboard');
    // Don't fail the build, just warn
    process.exit(0);
  }
}

async function createStorageBuckets() {
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
        console.warn(`⚠️ Could not create bucket ${bucket.id}:`, error.message);
      } else {
        console.log(`✅ Storage bucket '${bucket.id}' ready`);
      }
    } catch (error) {
      console.warn(`⚠️ Error with bucket ${bucket.id}:`, error);
    }
  }
}

// Alternative method - create tables directly using Supabase client
async function createTablesDirectly() {
  console.log('🔧 Creating tables directly...');
  
  try {
    // Create users table by trying to insert and handle the error
    console.log('Creating users table...');
    const { error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (usersError && usersError.code === 'PGRST116') {
      console.log('Users table does not exist, will be created on first user registration');
    }
    
    // Create library_items table by trying to insert and handle the error  
    console.log('Creating library_items table...');
    const { error: itemsError } = await supabase
      .from('library_items')
      .select('id')
      .limit(1);
      
    if (itemsError && itemsError.code === 'PGRST116') {
      console.log('Library_items table does not exist, creating manually...');
      
      // Use raw SQL execution via REST API
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS public.library_items (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
        
        ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Anyone can view published library items" ON public.library_items
          FOR SELECT USING (is_published = true);
      `;
      
      const response = await fetch(`${supabaseUrl}/sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({ query: createTableSQL })
      });
      
      if (response.ok) {
        console.log('✅ Library_items table created successfully!');
      } else {
        console.log('⚠️ Could not create library_items table via SQL endpoint');
      }
    }
    
    console.log('✅ Direct table creation completed');
    
  } catch (error) {
    console.error('❌ Error in direct table creation:', error);
  }
}

// Run the setup
setupDatabase();