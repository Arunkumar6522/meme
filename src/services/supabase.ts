import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/config';

export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Storage bucket names
export const STORAGE_BUCKETS = {
  LIBRARY_AUDIO: 'library-audio',
  LIBRARY_VIDEO: 'library-video',
  THUMBNAILS: 'thumbnails',
} as const;