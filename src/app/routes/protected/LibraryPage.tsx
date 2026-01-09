import React, { useState } from 'react';
import LibraryFilters from '@/components/library/LibraryFilters';
import LibraryGrid from '@/components/library/LibraryGrid';
import Pagination from '@/components/library/Pagination';
import { BannerAd, MobileAd } from '@/components/ads/AdBanner';
import { useLibrary } from '@/hooks/useLibrary';
import type { LibraryFilters as LibraryFiltersType } from '@/types';

const LibraryPage: React.FC = () => {
  const [filters, setFilters] = useState<LibraryFiltersType>({
    sort_by: 'latest',
  });

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

  const handleFiltersChange = (newFilters: LibraryFiltersType) => {
    setFilters(newFilters);
    updateFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meme Library</h1>
          <p className="mt-2 text-gray-600">
            Discover and download the perfect memes for your content
          </p>
          {count > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              {count.toLocaleString()} memes available
            </p>
          )}
        </div>

        {/* Mobile Ad */}
        <MobileAd className="mb-6" />

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