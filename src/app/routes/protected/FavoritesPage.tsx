import React, { useEffect, useState } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { LibraryService } from '@/services/library.service';
import type { LibraryItem } from '@/types';
import LibraryGrid from '@/components/library/LibraryGrid';
import { Button } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await LibraryService.getLibraryItemsByIds(favorites);
        // Preserve user order
        const ordered = favorites
          .map(id => data.find(d => d.id === id))
          .filter(Boolean) as LibraryItem[];
        setItems(ordered);
      } catch (e) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [favorites]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Wishlist</h1>
            <p className="text-sm text-gray-600">Your saved audios and videos</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/profile')}>
            Back to Profile
          </Button>
        </div>

        <LibraryGrid items={items} loading={loading} />

        {!loading && items.length === 0 && (
          <div className="text-center text-gray-600 mt-10">
            No favorites yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
