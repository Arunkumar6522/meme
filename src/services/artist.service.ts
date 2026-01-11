import { supabase } from './supabase';

export interface Artist {
  id: string;
  name: string;
  languages?: string[];
  created_at?: string;
  updated_at?: string;
}

export class ArtistService {
  static async list(search?: string): Promise<Artist[]> {
    let query = supabase.from('artists').select('*').order('created_at', { ascending: false });
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async create(name: string, languages: string[] = []): Promise<Artist | null> {
    const { data, error } = await supabase
      .from('artists')
      .insert({ name, languages })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async update(id: string, payload: Partial<Artist>): Promise<Artist | null> {
    const { data, error } = await supabase
      .from('artists')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async remove(id: string): Promise<void> {
    const { error } = await supabase.from('artists').delete().eq('id', id);
    if (error) throw error;
  }
}
