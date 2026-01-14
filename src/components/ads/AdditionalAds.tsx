import React, { useEffect, useRef } from 'react';

interface AdditionalAdProps {
  className?: string;
  style?: React.CSSProperties;
}

// Quge5 Ad Component (Zone 201858)
export const Quge5Ad: React.FC<AdditionalAdProps> = ({ 
  className = '', 
  style = {} 
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The quge5 script is already loaded in the HTML head
    // This component just provides a container for the ads
    
    // Add any specific initialization if needed
    if (window.quge5 && typeof window.quge5.init === 'function') {
      window.quge5.init();
    }
  }, []);

  return (
    <div 
      ref={adRef}
      className={`quge5-ad-container ${className}`}
      style={{ minHeight: '100px', ...style }}
      data-zone="201858"
    />
  );
};

// 5gvci Push Notification Ad Component
export const PushNotificationAd: React.FC<AdditionalAdProps> = ({ 
  className = '', 
  style = {} 
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize push notification ads
    const initPushAds = async () => {
      try {
        // Check if service worker is registered
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          
          // Request notification permission
          if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            console.log('Notification permission:', permission);
          }
          
          // Initialize push subscription if needed
          if (Notification.permission === 'granted') {
            // The service worker handles the 5gvci integration
            console.log('Push notifications enabled for ads');
          }
        }
      } catch (error) {
        console.warn('Push notification setup failed:', error);
      }
    };

    initPushAds();
  }, []);

  return (
    <div 
      ref={adRef}
      className={`push-ad-container ${className}`}
      style={{ minHeight: '50px', ...style }}
    >
      {/* This component enables push notifications but doesn't render visible content */}
    </div>
  );
};

// Multi-Network Ad Component (combines all networks)
export const MultiNetworkAd: React.FC<AdditionalAdProps & {
  networks?: ('monetag' | 'quge5' | 'push')[];
}> = ({ 
  className = '', 
  style = {},
  networks = ['monetag', 'quge5']
}) => {
  return (
    <div className={`multi-network-ad space-y-4 ${className}`} style={style}>
      {networks.includes('quge5') && (
        <Quge5Ad className="w-full" />
      )}
      
      {networks.includes('push') && (
        <PushNotificationAd className="w-full" />
      )}
    </div>
  );
};

// Declare global types for TypeScript
declare global {
  interface Window {
    quge5?: {
      init: () => void;
      [key: string]: any;
    };
  }
}