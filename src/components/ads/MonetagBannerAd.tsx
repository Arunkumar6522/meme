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

    // Add the Monetag script directly to the container
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      (function() {
        var atOptions = {
          'key': 'ae562b7ca89a32cf54f0e23d39a65ba5',
          'format': 'iframe',
          'height': ${height},
          'width': ${width},
          'params': {}
        };
        document.write('<scr' + 'ipt type="text/javascript" src="https://www.topcreativeformat.com/ae562b7ca89a32cf54f0e23d39a65ba5/invoke.js"></scr' + 'ipt>');
      })();
    `;
    
    adContainer.appendChild(script);
    
    console.log('🎯 Direct Monetag banner loaded:', { width, height });

    return () => {
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