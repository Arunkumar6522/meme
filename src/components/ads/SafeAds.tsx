import React from 'react';
import { cn } from '@/utils/cn';

interface SafeAdProps {
  className?: string;
  width?: number;
  height?: number;
  placeholder?: boolean;
}

// Mobile-responsive ad component that won't block page loading
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
        'bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm mx-auto',
        'max-w-full overflow-hidden', // Mobile responsive
        className
      )}
      style={{ 
        width: `min(${width}px, 100%)`, 
        height: `${height}px`,
        minHeight: `${height}px`
      }}
    >
      <span className="text-center px-2">Ad Space ({width}x{height})</span>
    </div>
  );
};

// Safe versions of ad components with mobile responsiveness
export const SafeLeaderboard: React.FC<{ className?: string }> = ({ className }) => (
  <SafeAd 
    width={728} 
    height={90} 
    className={cn('w-full max-w-4xl', className)} 
  />
);

export const SafeRectangle: React.FC<{ className?: string }> = ({ className }) => (
  <SafeAd 
    width={300} 
    height={250} 
    className={cn('w-full max-w-sm', className)} 
  />
);

export const SafeMobile: React.FC<{ className?: string }> = ({ className }) => (
  <SafeAd 
    width={320} 
    height={50} 
    className={cn('w-full max-w-sm sm:hidden', className)} 
  />
);

export default SafeAd;