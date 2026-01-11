import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus } from 'lucide-react';
import LibraryFilters from '@/components/library/LibraryFilters';
import LibraryGrid from '@/components/library/LibraryGrid';
import Pagination from '@/components/library/Pagination';
import { BannerAd, MobileAd } from '@/components/ads/AdBanner';
import { Button } from '@/components/ui';
import { useLibrary } from '@/hooks/useLibrary';
import { useAuth } from '@/hooks/useAuth';
import { DatabaseService } from '@/services/database.service';
import type { LibraryFilters as LibraryFiltersType } from '@/types';

// Cache admin status to avoid repeated API calls
const adminStatusCache = new Map<string, { status: boolean; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [filters, setFilters] = useState<LibraryFiltersType>({
    sort_by: 'latest',
  });
  const [mediaTab, setMediaTab] = useState<'all' | 'audio' | 'video'>('all');

  const {
    data: items,
    loading,
    error,
    page,
    totalPages,
    count,
    updateFilters,
    goToPage,
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

  // Sync tab with filters
  useEffect(() => {
    if (!filters.media_type) {
      setMediaTab('all');
    } else if (filters.media_type === 'audio') {
      setMediaTab('audio');
    } else if (filters.media_type === 'video') {
      setMediaTab('video');
    }
  }, [filters.media_type]);

  const handleTabChange = (tab: 'all' | 'audio' | 'video') => {
    setMediaTab(tab);
    const nextFilters = {
      ...filters,
      media_type: tab === 'all' ? undefined : tab,
    };
    setFilters(nextFilters);
    updateFilters(nextFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Meme Library</h1>
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
                  onClick={() => navigate('/admin/upload')}
                  className="w-full sm:w-auto flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Meme</span>
                </Button>
              )}
              <Button
                onClick={() => {
                  alert('Feature coming soon! Create Meme functionality will be available in a future update.');
                }}
                variant="outline"
                className="w-full sm:w-auto flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Meme</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Ad */}
        <MobileAd className="mb-6" />

        {/* Media Tabs */}
        <div className="mb-4 flex gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'audio', label: 'Audio' },
            { key: 'video', label: 'Video' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key as any)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium border transition-colors',
                mediaTab === tab.key
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
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
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Library Grid */}
          <div className="lg:col-span-3">
            <LibraryGrid items={items} loading={loading} />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              </div>
            )}
          </div>

          {/* Sidebar with Ads */}
          <div className="mt-8 lg:mt-0 lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Banner Ad */}
              <BannerAd className="hidden lg:block" />
              
              {/* Popular Categories */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Popular Categories
                </h3>
                <div className="space-y-2">
                  {[
                    { emotion: 'funny', count: 2500 },
                    { emotion: 'dramatic', count: 1800 },
                    { emotion: 'thug', count: 1200 },
                    { emotion: 'happy', count: 900 },
                    { emotion: 'sarcastic', count: 750 },
                  ].map((category) => (
                    <button
                      key={category.emotion}
                      onClick={() => handleFiltersChange({ 
                        ...filters, 
                        emotion: category.emotion as any 
                      })}
                      className="flex items-center justify-between w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      <span className="capitalize">{category.emotion}</span>
                      <span className="text-gray-400">{category.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Library Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Memes</span>
                    <span className="font-medium text-gray-900">10,247</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Audio Files</span>
                    <span className="font-medium text-gray-900">6,891</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Video Files</span>
                    <span className="font-medium text-gray-900">3,356</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Added Today</span>
                    <span className="font-medium text-primary-600">127</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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