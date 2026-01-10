/**
 * Helper function to create storage buckets in Supabase
 * Run this from the browser console or admin page if buckets don't exist
 */

import { supabase } from '@/services/supabase';

export async function createStorageBuckets(): Promise<{ success: boolean; message: string }> {
  const buckets = [
    {
      id: 'library-audio',
      name: 'library-audio',
      public: true,
      fileSizeLimit: 100 * 1024 * 1024, // 100MB
    },
    {
      id: 'library-video',
      name: 'library-video',
      public: true,
      fileSizeLimit: 100 * 1024 * 1024, // 100MB
    },
    {
      id: 'thumbnails',
      name: 'thumbnails',
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
    },
  ];

  const results: string[] = [];
  let successCount = 0;

  for (const bucket of buckets) {
    try {
      const { data, error } = await supabase.storage.createBucket(bucket.id, {
        public: bucket.public,
        fileSizeLimit: bucket.fileSizeLimit,
      });

      if (error) {
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          results.push(`✅ Bucket "${bucket.id}" already exists`);
          successCount++;
        } else {
          results.push(`❌ Failed to create "${bucket.id}": ${error.message}`);
        }
      } else {
        results.push(`✅ Successfully created bucket "${bucket.id}"`);
        successCount++;
      }
    } catch (error: any) {
      results.push(`❌ Error creating "${bucket.id}": ${error.message || 'Unknown error'}`);
    }
  }

  return {
    success: successCount === buckets.length,
    message: results.join('\n'),
  };
}

// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as any).createStorageBuckets = createStorageBuckets;
}
