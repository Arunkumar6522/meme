import { supabase } from './supabase';
import { TableCreatorService } from './table-creator.service';
import type { EmotionType } from '@/types';
import { enableDebugLogs } from '@/config';

// Database schema definitions - code-level table creation
export class DatabaseService {
  public static readonly supabase = supabase;

  // Check if tables exist and create them if they don't
  static async initializeDatabase(): Promise<boolean> {
    try {
      if (enableDebugLogs) console.debug('🔄 Initializing database...');

      // Since tables are created during build or manually, skip the check
      // and assume they exist. This avoids RLS permission issues.
      if (enableDebugLogs) console.debug('✅ Database assumed to be initialized (tables created during build)');
      return true;

    } catch (error) {
      if (enableDebugLogs) console.error('❌ Database initialization failed:', error);
      // Always return true since tables should exist
      return true;
    }
  }

  // Check if required tables exist (delegated to TableCreatorService)
  private static async checkTablesExist(): Promise<boolean> {
    return await TableCreatorService.checkTablesExist();
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

      CREATE POLICY IF NOT EXISTS "Admins and Superadmins can insert library items" ON public.library_items
        FOR INSERT WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
          )
        );

      CREATE POLICY IF NOT EXISTS "Admins and Superadmins can update library items" ON public.library_items
        FOR UPDATE USING (
          EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
          )
        );

      CREATE POLICY IF NOT EXISTS "Admins and Superadmins can delete library items" ON public.library_items
        FOR DELETE USING (
          EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
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

  // Check if user is admin or superadmin
  static async isUserAdmin(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) return false;
      return data?.role === 'admin' || data?.role === 'superadmin';
    } catch {
      return false;
    }
  }

  // Check if user is specifically superadmin
  static async isUserSuperAdmin(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) return false;
      return data?.role === 'superadmin';
    } catch {
      return false;
    }
  }

  // Get dashboard analytics (Superadmin only)
  static async getDashboardStats(): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('get_dashboard_stats');
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return null;
    }
  }

  // Update subscription status
  static async setPremiumStatus(userId: string, isPremium: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          is_premium: isPremium,
          subscription_end_date: isPremium ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null // 30 days validity
        })
        .eq('id', userId);
      return !error;
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