import React, { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';

interface SimpleAdProps {
  className?: string;
  style?: React.CSSProperties;
  format?: 'banner' | 'rectangle' | 'mobile';
}

// Simple Monetag Banner (non-intrusive)
export const SimpleMonetagBanner: React.FC<SimpleAdProps> = ({ 
  className = '', 
  style = {},
  format = 'banner'
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load simple banner ad without popups or redirects
    const script = document.createElement('script');
    script.type = 'text/javascript';
    
    const adConfig = {
      banner: { height: 90, width: 728 },
      rectangle: { height: 250, width: 300 },
      mobile: { height: 50, width: 320 }
    };
    
    const config = adConfig[format];
    
    script.innerHTML = `
      atOptions = {
        'key' : 'ae562b7ca89a32cf54f0e23d39a65ba5',
        'format' : 'iframe',
        'height' : ${config.height},
        'width' : ${config.width},
        'params' : {
          'no_popup': true,
          'no_redirect': true,
          'safe_mode': true
        }
      };
    `;
    
    const adScript = document.createElement('script');
    adScript.type = 'text/javascript';
    adScript.src = 'https://www.topcreativeformat.com/ae562b7ca89a32cf54f0e23d39a65ba5/invoke.js';
    
    if (adRef.current) {
      adRef.current.appendChild(script);
      adRef.current.appendChild(adScript);
    }

    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, [format]);

  const minHeight = format === 'banner' ? '90px' : format === 'rectangle' ? '250px' : '50px';

  return (
    <div 
      ref={adRef}
      className={cn(
        'simple-ad-banner flex justify-center items-center bg-gray-50 border border-gray-200 rounded-lg',
        className
      )}
      style={{ minHeight, ...style }}
    />
  );
};

// Simple Quge5 Banner (non-intrusive)
export const SimpleQuge5Banner: React.FC<SimpleAdProps> = ({ 
  className = '', 
  style = {},
  format = 'banner'
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple banner without popups
    if (window.quge5 && typeof window.quge5.init === 'function') {
      window.quge5.init();
    }
  }, []);

  const minHeight = format === 'banner' ? '90px' : format === 'rectangle' ? '250px' : '50px';

  return (
    <div 
      ref={adRef}
      className={cn(
        'simple-quge5-banner flex justify-center items-center bg-gray-50 border border-gray-200 rounded-lg',
        className
      )}
      style={{ minHeight, ...style }}
      data-zone="201858"
      data-format="banner"
    />
  );
};

// Combined Simple Banner (uses your existing banner space)
export const SimpleAdBanner: React.FC<SimpleAdProps> = ({ 
  className = '', 
  style = {},
  format = 'banner'
}) => {
  return (
    <div className={cn('simple-ad-container space-y-2', className)} style={style}>
      {/* Only show one ad at a time to avoid clutter */}
      <SimpleMonetagBanner format={format} className="w-full" />
    </div>
  );
};

// Declare global types
declare global {
  interface Window {
    quge5?: {
      init: () => void;
      [key: string]: any;
    };
  }
}