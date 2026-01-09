import React from 'react';
import { cn } from '@/utils/cn';

interface SkeletonLoaderProps {
  className?: string;
  children?: React.ReactNode;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200',
        className
      )}
      aria-hidden="true"
    >
      {children}
    </div>
  );
};

// Predefined skeleton components
const SkeletonCard: React.FC = () => (
  <div className="space-y-3">
    <SkeletonLoader className="h-48 w-full" />
    <div className="space-y-2">
      <SkeletonLoader className="h-4 w-3/4" />
      <SkeletonLoader className="h-4 w-1/2" />
    </div>
  </div>
);

const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonLoader
        key={i}
        className={cn(
          'h-4',
          i === lines - 1 ? 'w-3/4' : 'w-full'
        )}
      />
    ))}
  </div>
);

export { SkeletonLoader, SkeletonCard, SkeletonText };