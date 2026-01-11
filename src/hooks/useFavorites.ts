import { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load favorites', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites', e);
    }
  }, [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
};
