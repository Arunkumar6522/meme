import React from 'react';
import { cn } from '@/utils/cn';

interface SafeAdProps {
  className?: string;
  width?: number;
  height?: number;
  placeholder?: boolean;
}

// Temporary safe ad component that won't block page loading
export const SafeAd: React.FC<SafeAdProps> = ({ 
  className, 
  width = 728, 
  height = 90,
  placeholder = true 
}) => {
  if (!placeholder) return null;

  return (
    <div 
      className={cn(
        'bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm',
        className
      )}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      Ad Space ({width}x{height})
    </div>
  );
};

// Safe versions of ad components
export const SafeLeaderboard: React.FC<{ className?: string }> = ({ className }) => (
  <SafeAd width={728} height={90} className={className} />
);

export const SafeRectangle: React.FC<{ className?: string }> = ({ className }) => (
  <SafeAd width={300} height={250} className={className} />
);

export const SafeMobile: React.FC<{ className?: string }> = ({ className }) => (
  <SafeAd width={320} height={50} className={className} />
);

export default SafeAd;