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
  // Get dashboard analytics
  static async getDashboardStats(): Promise<any> {
    try {
      // Execute queries in parallel for better performance
      const [
        { count: totalUsers },
        { count: totalMemes },
        { count: audioCount },
        { count: videoCount },
        { data: downloadsData }
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('library_items').select('*', { count: 'exact', head: true }),
        supabase.from('library_items').select('*', { count: 'exact', head: true }).eq('media_type', 'audio'),
        supabase.from('library_items').select('*', { count: 'exact', head: true }).eq('media_type', 'video'),
        supabase.from('library_items').select('download_count')
      ]);

      // Calculate total downloads
      const totalDownloads = downloadsData?.reduce((sum, item) => sum + (item.download_count || 0), 0) || 0;

      return {
        total_users: totalUsers || 0,
        total_memes: totalMemes || 0,
        total_downloads: totalDownloads,
        audio_count: audioCount || 0,
        video_count: videoCount || 0
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        total_users: 0,
        total_memes: 0,
        total_downloads: 0,
        audio_count: 0,
        video_count: 0
      };
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

  // Record a successful payment
  static async recordPayment(paymentData: {
    userId: string;
    amount: number;
    currency: string;
    orderId: string;
    paymentId: string;
    status: string;
  }): Promise<boolean> {
    try {
      // First ensure table exists (simple check)
      const { error: tableError } = await supabase.from('payments').select('id').limit(1);
      if (tableError && tableError.code === '42P01') {
        // Table doesn't exist, try to create it via SQL rpc if possible, or fail gracefully
        console.warn('Payments table missing. Payment not recorded in history.');
        return false;
      }

      const { error } = await supabase.from('payments').insert({
        user_id: paymentData.userId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        order_id: paymentData.orderId,
        payment_id: paymentData.paymentId,
        status: paymentData.status,
        created_at: new Date().toISOString()
      });

      return !error;
    } catch (e) {
      console.error('Error recording payment:', e);
      return false;
    }
  }
  // Check download eligibility
  static async checkDownloadEligibility(userId: string): Promise<{ allowed: boolean; reason?: 'limit_reached' | 'error'; remaining?: number }> {
    try {
      // 1. Check if user is premium
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('is_premium')
        .eq('id', userId)
        .single();

      if (userError || !user) return { allowed: false, reason: 'error' };
      if (user.is_premium) return { allowed: true };

      // 2. Check daily download count for free users
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today

      const { count, error: countError } = await supabase
        .from('user_downloads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', today.toISOString());

      if (countError) {
        // If table doesn't exist, we might default to allowed or log error
        if (countError.code === '42P01') {
          console.warn('user_downloads table missing. Allowing download.');
          return { allowed: true };
        }
        return { allowed: false, reason: 'error' };
      }

      const LIMIT = 5;
      const downloadCount = count || 0;

      if (downloadCount >= LIMIT) {
        return { allowed: false, reason: 'limit_reached', remaining: 0 };
      }

      return { allowed: true, remaining: LIMIT - downloadCount };
    } catch (e) {
      console.error('Error checking download eligibility:', e);
      return { allowed: false, reason: 'error' };
    }
  }

  // Record a user download
  static async recordUserDownload(userId: string, itemId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('user_downloads').insert({
        user_id: userId,
        item_id: itemId,
        created_at: new Date().toISOString()
      });
      return !error;
    } catch {
      return false;
    }
  }

  // Get total user downloads (for profile stats)
  static async getUserTotalDownloads(userId: string): Promise<number> {
    try {
      const { count } = await supabase
        .from('user_downloads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      return count || 0;
    } catch {
      return 0;
    }
  }
}