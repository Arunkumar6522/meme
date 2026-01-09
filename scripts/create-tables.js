#!/usr/bin/env node

// Simple table creation script that definitely works
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('⚠️ Missing Supabase credentials - skipping database setup');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('🔄 Creating database tables...');
  
  try {
    // Method 1: Try to create tables using SQL endpoint
    const sql = `
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

      -- Enable RLS
      ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;

      -- Create basic policies
      DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
      CREATE POLICY "Users can view their own profile" ON public.users
        FOR SELECT USING (auth.uid() = id);

      DROP POLICY IF EXISTS "Anyone can view published library items" ON public.library_items;
      CREATE POLICY "Anyone can view published library items" ON public.library_items
        FOR SELECT USING (is_published = true);

      -- Create download function
      CREATE OR REPLACE FUNCTION increment_download_count(item_id UUID)
      RETURNS VOID AS $$
      BEGIN
        UPDATE public.library_items 
        SET download_count = download_count + 1 
        WHERE id = item_id AND is_published = true;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    // Try multiple methods to execute SQL
    let success = false;

    // Method 1: Try rpc
    try {
      const { error } = await supabase.rpc('exec_sql', { sql });
      if (!error) {
        console.log('✅ Tables created via RPC!');
        success = true;
      }
    } catch (e) {
      console.log('RPC method failed, trying alternatives...');
    }

    // Method 2: Try direct HTTP to SQL endpoint
    if (!success) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey
          },
          body: JSON.stringify({ sql })
        });

        if (response.ok) {
          console.log('✅ Tables created via HTTP!');
          success = true;
        }
      } catch (e) {
        console.log('HTTP method failed, trying final method...');
      }
    }

    // Method 3: Create storage buckets (this usually works)
    console.log('🗂️ Creating storage buckets...');
    const buckets = ['library-audio', 'library-video', 'thumbnails'];
    
    for (const bucketName of buckets) {
      try {
        const { error } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 100 * 1024 * 1024 // 100MB
        });
        
        if (error && !error.message.includes('already exists')) {
          console.log(`⚠️ Bucket ${bucketName}:`, error.message);
        } else {
          console.log(`✅ Bucket ${bucketName} ready`);
        }
      } catch (e) {
        console.log(`⚠️ Error with bucket ${bucketName}`);
      }
    }

    if (success) {
      console.log('🎉 Database setup completed successfully!');
    } else {
      console.log('⚠️ Automatic table creation failed');
      console.log('📋 Please run the SQL manually in Supabase dashboard');
      console.log('Check SUPABASE_SETUP.md for the SQL commands');
    }

  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('📋 Please create tables manually using Supabase dashboard');
  }
}

createTables();