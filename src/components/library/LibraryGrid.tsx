import React, { memo } from 'react';
import LibraryCard from './LibraryCard';
import { SkeletonCard } from '@/components/ui';
import type { LibraryItem } from '@/types';
import { cn } from '@/utils/cn';

interface LibraryGridProps {
  items: LibraryItem[];
  loading?: boolean;
  className?: string;
  isAdmin?: boolean;
}

const LibraryGrid: React.FC<LibraryGridProps> = memo(({ items, loading = false, className, isAdmin = false }) => {
  if (loading) {
    return (
      <div
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6',
          className
        )}
        aria-label="Loading library items"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto max-w-md">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-5.657-2.343m0-11.314A7.962 7.962 0 0112 4a7.962 7.962 0 015.657 2.343M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No memes found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex justify-center',
        className
      )}
    >
      <div
        className={cn(
          'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4 md:gap-5 lg:gap-6 max-w-7xl w-full px-2 sm:px-4',
        )}
        role="grid"
        aria-label={`Library grid with ${items.length} items`}
      >
        {items.map((item) => (
          <div key={item.id} role="gridcell" className="flex justify-center">
            <LibraryCard item={item} isAdmin={isAdmin} />
          </div>
        ))}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if items array reference changes or loading state changes
  return (
    prevProps.loading === nextProps.loading &&
    prevProps.items.length === nextProps.items.length &&
    prevProps.items.every((item, index) => item.id === nextProps.items[index]?.id) &&
    prevProps.className === nextProps.className
  );
});

LibraryGrid.displayName = 'LibraryGrid';

export default LibraryGrid;