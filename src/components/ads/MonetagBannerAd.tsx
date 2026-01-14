import React, { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';

interface MonetagBannerAdProps {
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

// Direct Monetag Banner Implementation
export const MonetagBannerAd: React.FC<MonetagBannerAdProps> = ({ 
  className = '', 
  style = {},
  width = 728,
  height = 90
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const scriptId = useRef(`monetag-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (!adRef.current) return;

    // Create unique container
    const adContainer = document.createElement('div');
    adContainer.id = scriptId.current;
    
    // Clear and add container
    adRef.current.innerHTML = '';
    adRef.current.appendChild(adContainer);

    // Use safer async script loading instead of document.write
    const loadAd = async () => {
      try {
        // Set up global atOptions for Monetag
        (window as any).atOptions = {
          'key': 'ae562b7ca89a32cf54f0e23d39a65ba5',
          'format': 'iframe',
          'height': height,
          'width': width,
          'params': {}
        };

        // Create and load the script asynchronously
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://www.topcreativeformat.com/ae562b7ca89a32cf54f0e23d39a65ba5/invoke.js';
        
        // Add error handling
        script.onerror = () => {
          console.warn('Monetag ad script failed to load');
        };
        
        script.onload = () => {
          console.log('🎯 Monetag banner loaded successfully:', { width, height });
        };
        
        adContainer.appendChild(script);
      } catch (error) {
        console.warn('Failed to load Monetag ad:', error);
      }
    };

    // Load ad after a small delay to prevent blocking
    const timeoutId = setTimeout(loadAd, 100);

    return () => {
      clearTimeout(timeoutId);
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, [width, height]);

  return (
    <div 
      ref={adRef}
      className={cn('monetag-banner-direct', className)}
      style={{ 
        minHeight: `${height}px`, 
        minWidth: `${width}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style 
      }}
    />
  );
};

// Predefined banner sizes
export const MonetagLeaderboard: React.FC<{ className?: string }> = ({ className }) => (
  <MonetagBannerAd width={728} height={90} className={className} />
);

export const MonetagRectangle: React.FC<{ className?: string }> = ({ className }) => (
  <MonetagBannerAd width={300} height={250} className={className} />
);

export const MonetagMobile: React.FC<{ className?: string }> = ({ className }) => (
  <MonetagBannerAd width={320} height={50} className={className} />
);

export default MonetagBannerAd;