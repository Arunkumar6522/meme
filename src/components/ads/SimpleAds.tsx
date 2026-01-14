import React, { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';

interface SimpleAdProps {
  className?: string;
  style?: React.CSSProperties;
  format?: 'banner' | 'rectangle' | 'mobile';
}

// Simple Monetag Banner (working implementation)
export const SimpleMonetagBanner: React.FC<SimpleAdProps> = ({ 
  className = '', 
  style = {},
  format = 'banner'
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Standard Monetag implementation
    const adConfig = {
      banner: { height: 90, width: 728 },
      rectangle: { height: 250, width: 300 },
      mobile: { height: 50, width: 320 }
    };
    
    const config = adConfig[format];
    
    // Create the ad configuration script
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.innerHTML = `
      atOptions = {
        'key': 'ae562b7ca89a32cf54f0e23d39a65ba5',
        'format': 'iframe',
        'height': ${config.height},
        'width': ${config.width},
        'params': {}
      };
    `;
    
    // Create the invoke script
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = 'https://www.topcreativeformat.com/ae562b7ca89a32cf54f0e23d39a65ba5/invoke.js';
    
    if (adRef.current) {
      // Clear any existing content
      adRef.current.innerHTML = '';
      
      // Add both scripts
      adRef.current.appendChild(configScript);
      adRef.current.appendChild(invokeScript);
      
      console.log('🎯 Monetag ad loaded for format:', format);
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
        'monetag-ad-container flex justify-center items-center',
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