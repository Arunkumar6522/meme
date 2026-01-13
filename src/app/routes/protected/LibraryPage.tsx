import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload } from 'lucide-react';
import LibraryFilters from '@/components/library/LibraryFilters';
import LibraryGrid from '@/components/library/LibraryGrid';
import Pagination from '@/components/library/Pagination';
import { BannerAd, MobileAd } from '@/components/ads/AdBanner';
import { Button } from '@/components/ui';
import { useLibrary } from '@/hooks/useLibrary';
import { useAuth } from '@/hooks/useAuth';
import { DatabaseService } from '@/services/database.service';
import type { LibraryFilters as LibraryFiltersType } from '@/types';
import { cn } from '@/utils/cn';
import { useLanguage } from '@/hooks/useLanguage';

// Cache admin status to avoid repeated API calls
const adminStatusCache = new Map<string, { status: boolean; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { selectedLanguages } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [filters, setFilters] = useState<LibraryFiltersType>({
    sort_by: 'latest',
    media_type: 'audio',
    artist: [],
    languages: selectedLanguages,
  });
  const [mediaTab, setMediaTab] = useState<'audio' | 'video'>('audio');

  const {
    data: items,
    loading,
    error,
    page,
    totalPages,
    count,
    updateFilters,
    goToPage,
    refresh,
  } = useLibrary(filters);

  // Check if user is admin (with caching)
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.id) {
        setIsAdmin(false);
        return;
      }

      // Check cache first
      const cached = adminStatusCache.get(user.id);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setIsAdmin(cached.status);
        return;
      }

      try {
        const adminStatus = await DatabaseService.isUserAdmin(user.id);
        setIsAdmin(adminStatus);
        // Update cache
        adminStatusCache.set(user.id, { status: adminStatus, timestamp: Date.now() });
      } catch (error) {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [user?.id]);

  const handleFiltersChange = useCallback((newFilters: LibraryFiltersType) => {
    setFilters(newFilters);
    updateFilters(newFilters);
  }, [updateFilters]);

  // Pull initial search from URL (?search=...) so Landing page search works.
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const urlSearch = (sp.get('search') || '').trim();
    if (!urlSearch) return;
    if ((filters.search || '').trim() === urlSearch) return;
    const nextFilters = { ...filters, search: urlSearch };
    setFilters(nextFilters);
    updateFilters(nextFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Keep filters in sync with language selector (same tab, instant)
  useEffect(() => {
    const nextFilters = { ...filters, languages: selectedLanguages };
    setFilters(nextFilters);
    updateFilters(nextFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguages]);

  // Sync tab with filters
  useEffect(() => {
    if (filters.media_type === 'video') {
      setMediaTab('video');
    } else {
      setMediaTab('audio');
    }
  }, [filters.media_type]);

  const handleTabChange = (tab: 'audio' | 'video') => {
    setMediaTab(tab);
    const nextFilters = {
      ...filters,
      media_type: tab,
    };
    setFilters(nextFilters);
    updateFilters(nextFilters);
  };

  // language changes handled by LanguageProvider

  // Refresh list after admin deletes an item from the card menu
  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener('library:itemDeleted', handler as EventListener);
    return () => window.removeEventListener('library:itemDeleted', handler as EventListener);
  }, [refresh]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">ilovememe.in Library</h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
            Discover and download the perfect memes for your content
          </p>
          {count > 0 && (
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
              {count.toLocaleString()} memes available
            </p>
          )}
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Button
                  onClick={() => navigate('/upload')}
                  className="w-full sm:w-auto flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Meme</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Ad */}
        <MobileAd className="mb-6" />

        {/* Media Tabs */}
        <div className="mb-4 flex gap-2">
          {[
            { key: 'audio', label: 'Audio' },
            { key: 'video', label: 'Video' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key as any)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium border transition-colors',
                mediaTab === tab.key
                  ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-8">
          <LibraryFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 rounded-md bg-red-50 p-4 border border-red-200">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading library
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div>
            <LibraryGrid items={items} loading={loading} isAdmin={isAdmin} mediaType={mediaTab} />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(next) => {
                    // Stop any playing audio/video when navigating pages
                    window.dispatchEvent(new CustomEvent('media:stopAll'));
                    goToPage(next);
                  }}
                />
              </div>
            )}
        </div>

        {/* Bottom Banner Ad */}
        <div className="mt-12">
          <BannerAd />
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;