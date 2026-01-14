import React, { useEffect, useRef } from 'react';

interface MonetagAdProps {
  adType?: 'banner' | 'popup' | 'native' | 'video';
  className?: string;
  style?: React.CSSProperties;
}

// Banner Ad Component
export const MonetagBanner: React.FC<MonetagAdProps> = ({ 
  className = '', 
  style = {} 
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Monetag banner ad script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      atOptions = {
        'key' : 'ae562b7ca89a32cf54f0e23d39a65ba5',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
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
      // Cleanup scripts on unmount
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      ref={adRef}
      className={`monetag-banner-ad flex justify-center items-center ${className}`}
      style={{ minHeight: '90px', ...style }}
    />
  );
};

// Native Ad Component
export const MonetagNative: React.FC<MonetagAdProps> = ({ 
  className = '', 
  style = {} 
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Monetag native ad script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      atOptions = {
        'key' : 'ae562b7ca89a32cf54f0e23d39a65ba5',
        'format' : 'native',
        'height' : 300,
        'width' : 300,
        'params' : {}
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
      // Cleanup scripts on unmount
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      ref={adRef}
      className={`monetag-native-ad ${className}`}
      style={{ minHeight: '300px', ...style }}
    />
  );
};

// Popup Ad Component (loads once per session)
export const MonetagPopup: React.FC = () => {
  useEffect(() => {
    // Only load popup once per session
    const popupLoaded = sessionStorage.getItem('monetag-popup-loaded');
    
    if (!popupLoaded) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = `
        atOptions = {
          'key' : 'ae562b7ca89a32cf54f0e23d39a65ba5',
          'format' : 'popup',
          'params' : {}
        };
      `;
      
      const adScript = document.createElement('script');
      adScript.type = 'text/javascript';
      adScript.src = 'https://www.topcreativeformat.com/ae562b7ca89a32cf54f0e23d39a65ba5/invoke.js';
      
      document.head.appendChild(script);
      document.head.appendChild(adScript);
      
      // Mark popup as loaded for this session
      sessionStorage.setItem('monetag-popup-loaded', 'true');
    }
  }, []);

  return null; // Popup ads don't render visible content
};

// Video Ad Component
export const MonetagVideo: React.FC<MonetagAdProps> = ({ 
  className = '', 
  style = {} 
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Monetag video ad script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      atOptions = {
        'key' : 'ae562b7ca89a32cf54f0e23d39a65ba5',
        'format' : 'video',
        'height' : 250,
        'width' : 300,
        'params' : {}
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
      // Cleanup scripts on unmount
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      ref={adRef}
      className={`monetag-video-ad ${className}`}
      style={{ minHeight: '250px', ...style }}
    />
  );
};

// Mobile Banner Ad (responsive)
export const MonetagMobileBanner: React.FC<MonetagAdProps> = ({ 
  className = '', 
  style = {} 
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Monetag mobile banner ad script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      atOptions = {
        'key' : 'ae562b7ca89a32cf54f0e23d39a65ba5',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
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
      // Cleanup scripts on unmount
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      ref={adRef}
      className={`monetag-mobile-banner-ad flex justify-center items-center ${className}`}
      style={{ minHeight: '50px', ...style }}
    />
  );
};