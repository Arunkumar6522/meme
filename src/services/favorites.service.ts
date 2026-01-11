import { supabase } from './supabase';

export class FavoritesService {
  static async list(userId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select('item_id')
      .eq('user_id', userId);
    if (error) throw error;
    return (data || []).map((row: any) => row.item_id as string);
  }

  static async add(userId: string, itemId: string) {
    const { error } = await supabase
      .from('favorites')
      .upsert({ user_id: userId, item_id: itemId }, { onConflict: 'user_id,item_id' });
    if (error) throw error;
  }

  static async remove(userId: string, itemId: string) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('item_id', itemId);
    if (error) throw error;
  }
}
