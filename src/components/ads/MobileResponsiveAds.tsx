import React, { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';

interface ResponsiveAdProps {
  className?: string;
  width: number;
  height: number;
  mobileWidth?: number;
  mobileHeight?: number;
}

// Mobile-responsive Monetag ad component
export const ResponsiveMonetagAd: React.FC<ResponsiveAdProps> = ({ 
  className, 
  width, 
  height,
  mobileWidth = width,
  mobileHeight = height
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const scriptId = useRef(`monetag-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (!adRef.current) return;

    // Detect if mobile
    const isMobile = window.innerWidth < 768;
    const adWidth = isMobile ? mobileWidth : width;
    const adHeight = isMobile ? mobileHeight : height;

    // Create unique container
    const adContainer = document.createElement('div');
    adContainer.id = scriptId.current;
    
    // Clear and add container
    adRef.current.innerHTML = '';
    adRef.current.appendChild(adContainer);

    // Load ad after a delay to prevent blocking
    const loadAd = () => {
      try {
        // Set up global atOptions for Monetag
        (window as any).atOptions = {
          'key': 'ae562b7ca89a32cf54f0e23d39a65ba5',
          'format': 'iframe',
          'height': adHeight,
          'width': adWidth,
          'params': {}
        };

        // Create and load the script asynchronously
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.defer = true;
        script.src = 'https://www.topcreativeformat.com/ae562b7ca89a32cf54f0e23d39a65ba5/invoke.js';
        
        // Add error handling
        script.onerror = () => {
          console.warn('Monetag ad failed to load, showing placeholder');
          if (adContainer) {
            adContainer.innerHTML = `
              <div style="
                width: ${adWidth}px; 
                height: ${adHeight}px; 
                background: #f3f4f6; 
                border: 1px solid #e5e7eb; 
                border-radius: 8px; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                color: #6b7280; 
                font-size: 14px;
                max-width: 100%;
              ">
                Ad Space (${adWidth}x${adHeight})
              </div>
            `;
          }
        };
        
        script.onload = () => {
          console.log('✅ Monetag ad loaded:', { width: adWidth, height: adHeight });
        };
        
        adContainer.appendChild(script);
      } catch (error) {
        console.warn('Failed to load Monetag ad:', error);
      }
    };

    // Load ad after a small delay
    const timeoutId = setTimeout(loadAd, 200);

    return () => {
      clearTimeout(timeoutId);
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, [width, height, mobileWidth, mobileHeight]);

  return (
    <div 
      ref={adRef}
      className={cn(
        'monetag-responsive-ad flex justify-center items-center mx-auto',
        'w-full max-w-full overflow-hidden',
        className
      )}
      style={{ 
        minHeight: `${window.innerWidth < 768 ? mobileHeight : height}px`,
        maxWidth: '100%'
      }}
    />
  );
};

// Predefined responsive ad components
export const ResponsiveLeaderboard: React.FC<{ className?: string }> = ({ className }) => (
  <ResponsiveMonetagAd 
    width={728} 
    height={90}
    mobileWidth={320}
    mobileHeight={50}
    className={cn('w-full max-w-4xl', className)} 
  />
);

export const ResponsiveRectangle: React.FC<{ className?: string }> = ({ className }) => (
  <ResponsiveMonetagAd 
    width={300} 
    height={250}
    mobileWidth={300}
    mobileHeight={250}
    className={cn('w-full max-w-sm', className)} 
  />
);

export const ResponsiveMobile: React.FC<{ className?: string }> = ({ className }) => (
  <ResponsiveMonetagAd 
    width={320} 
    height={50}
    mobileWidth={320}
    mobileHeight={50}
    className={cn('w-full max-w-sm md:hidden', className)} 
  />
);

export default ResponsiveMonetagAd;