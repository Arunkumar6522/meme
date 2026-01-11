import { supabase, STORAGE_BUCKETS } from './supabase';
import type { LibraryItem, LibraryFilters, PaginatedResponse } from '@/types';

export class LibraryService {
  private static sanitizeFileName(name: string): string {
    const trimmed = name.trim();
    const replaced = trimmed.replace(/[^\w.-]+/g, '-');
    return replaced.toLowerCase();
  }

  // Get library items with filters and pagination
  static async getLibraryItems(
    filters: LibraryFilters = {},
    page = 1,
    perPage = 20
  ): Promise<PaginatedResponse<LibraryItem>> {
    try {
      let query = supabase
        .from('library_items')
        .select('*', { count: 'exact' })
        .eq('is_published', true);

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,keywords.cs.{${filters.search}}`);
      }

      if (filters.artist && filters.artist.length > 0) {
        query = query.contains('keywords', filters.artist);
      }

      if (filters.emotion) {
        query = query.eq('emotion', filters.emotion);
      }

      if (filters.media_type) {
        query = query.eq('media_type', filters.media_type);
      }

      // Apply sorting
      switch (filters.sort_by) {
        case 'trending':
          query = query.order('download_count', { ascending: false });
          break;
        case 'latest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'title':
          query = query.order('title', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
        page,
        per_page: perPage,
        total_pages: Math.ceil((count || 0) / perPage),
      };
    } catch (error) {
      console.error('Error fetching library items:', error);
      return {
        data: [],
        count: 0,
        page,
        per_page: perPage,
        total_pages: 0,
      };
    }
  }

  // Get items by ids (for favorites)
  static async getLibraryItemsByIds(ids: string[]): Promise<LibraryItem[]> {
    if (!ids.length) return [];
    const { data, error } = await supabase
      .from('library_items')
      .select('*')
      .in('id', ids)
      .eq('is_published', true);
    if (error) throw error;
    return data || [];
  }

  // Get single library item by ID
  static async getLibraryItem(id: string): Promise<LibraryItem | null> {
    try {
      const { data, error } = await supabase
        .from('library_items')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching library item:', error);
      return null;
    }
  }

  // Increment download count
  static async incrementDownloadCount(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('increment_download_count', {
        item_id: id,
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error incrementing download count:', error);
      return false;
    }
  }

  // Get download URL for a library item
  static async getDownloadUrl(fileUrl: string): Promise<string | null> {
    try {
      // Extract bucket and path from file_url
      const urlParts = fileUrl.split('/');
      const bucket = urlParts[urlParts.length - 2];
      const fileName = urlParts[urlParts.length - 1];

      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(fileName, 3600); // 1 hour expiry

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting download URL:', error);
      return null;
    }
  }

  // Admin: Create new library item
  static async createLibraryItem(item: Omit<LibraryItem, 'id' | 'created_at' | 'updated_at' | 'download_count'>): Promise<LibraryItem | null> {
    try {
      const { data, error } = await supabase
        .from('library_items')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating library item:', error);
      return null;
    }
  }

  // Admin: Update library item
  static async updateLibraryItem(id: string, updates: Partial<LibraryItem>): Promise<LibraryItem | null> {
    try {
      const { data, error } = await supabase
        .from('library_items')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating library item:', error);
      return null;
    }
  }

  // Admin: Delete library item
  static async deleteLibraryItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('library_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting library item:', error);
      return false;
    }
  }

  // Admin: Upload file to storage
  static async uploadFile(file: File, bucket: string, fileName: string): Promise<string | null> {
    try {
      const safeName = this.sanitizeFileName(fileName);

      // Try to upload directly - if bucket doesn't exist, Supabase will return an error
      // This is more reliable than checking buckets first (which might fail due to permissions)

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(safeName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        // Provide more helpful error messages
        if (error.message.includes('Bucket not found') || error.message.includes('does not exist')) {
          // Try to list buckets to give better error message
          const { data: buckets } = await supabase.storage.listBuckets();
          const existingBuckets = buckets?.map(b => b.name).join(', ') || 'none';
          throw new Error(
            `Storage bucket "${bucket}" does not exist.\n\n` +
            `Required buckets: library-audio, library-video, thumbnails\n` +
            `Existing buckets: ${existingBuckets}\n\n` +
            `Please create the missing buckets in Supabase Dashboard → Storage → New Bucket\n` +
            `Or use SQL Editor to create them:\n` +
            `INSERT INTO storage.buckets (id, name, public) VALUES ('${bucket}', '${bucket}', true);`
          );
        }
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error; // Re-throw to show error message to user
    }
  }

  // Admin: Get all library items (including unpublished)
  static async getAllLibraryItems(page = 1, perPage = 20): Promise<PaginatedResponse<LibraryItem>> {
    try {
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      const { data, error, count } = await supabase
        .from('library_items')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
        page,
        per_page: perPage,
        total_pages: Math.ceil((count || 0) / perPage),
      };
    } catch (error) {
      console.error('Error fetching all library items:', error);
      return {
        data: [],
        count: 0,
        page,
        per_page: perPage,
        total_pages: 0,
      };
    }
  }
}