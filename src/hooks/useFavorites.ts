import { useEffect, useState, useCallback } from 'react';
import { FavoritesService } from '@/services/favorites.service';
import { useAuth } from '@/hooks/useAuth';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) {
        setFavorites([]);
        return;
      }
      setLoading(true);
      try {
        const items = await FavoritesService.list(user.id);
        setFavorites(items);
      } catch {
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const toggleFavorite = useCallback(
    async (id: string) => {
      if (!user?.id) return;
      const exists = favorites.includes(id);
      const next = exists ? favorites.filter((f) => f !== id) : [...favorites, id];
      setFavorites(next);
      try {
        if (exists) {
          await FavoritesService.remove(user.id, id);
        } else {
          await FavoritesService.add(user.id, id);
        }
      } catch (e) {
        // Revert on error
        setFavorites(favorites);
        throw e;
      }
    },
    [favorites, user?.id]
  );

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    loading,
  };
};
