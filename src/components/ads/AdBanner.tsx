import React, { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';
import { googleAdsConfig } from '@/config';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  'data-testid'?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({
  slot,
  format = 'auto',
  responsive = true,
  className,
  'data-testid': testId,
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    // Only load ads if Google Ads client ID is configured
    const clientId = googleAdsConfig?.clientId;
    if (!clientId || isAdLoaded.current) return;

    try {
      // Load Google AdSense script if not already loaded
      if (!window.adsbygoogle) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      // Initialize ad when script is loaded
      const initAd = () => {
        if (window.adsbygoogle && adRef.current) {
          try {
            (window.adsbygoogle as any[]).push({});
            isAdLoaded.current = true;
          } catch (error) {
            console.warn('AdSense error:', error);
          }
        }
      };

      if (window.adsbygoogle) {
        initAd();
      } else {
        // Wait for script to load
        const checkAdSense = setInterval(() => {
          if (window.adsbygoogle) {
            clearInterval(checkAdSense);
            initAd();
          }
        }, 100);

        // Cleanup interval after 10 seconds
        setTimeout(() => clearInterval(checkAdSense), 10000);
      }
    } catch (error) {
      console.warn('Error loading ads:', error);
    }
  }, [slot]);

  // Don't render if no client ID is configured
  const clientId = googleAdsConfig?.clientId;
  if (!clientId) {
    return null;
  }

  return (
    <div
      className={cn(
        'ad-container flex justify-center items-center min-h-[100px] bg-gray-50 border border-gray-200 rounded-lg',
        className
      )}
      data-testid={testId}
      role="complementary"
      aria-label="Advertisement"
    >
      <ins
        ref={adRef}
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
      
      {/* Fallback content for development or when ads fail to load */}
      <noscript>
        <div className="text-center p-4 text-gray-500 text-sm">
          <p>Advertisement</p>
          <p className="text-xs mt-1">Enable JavaScript to view ads</p>
        </div>
      </noscript>
    </div>
  );
};

// Predefined ad components for common placements
export const BannerAd: React.FC<{ className?: string }> = ({ className }) => (
  <AdBanner
    slot="1234567890" // Replace with actual ad slot
    format="horizontal"
    className={cn('w-full max-w-4xl mx-auto', className)}
    data-testid="banner-ad"
  />
);

export const SidebarAd: React.FC<{ className?: string }> = ({ className }) => (
  <AdBanner
    slot="0987654321" // Replace with actual ad slot
    format="rectangle"
    className={cn('w-full max-w-sm', className)}
    data-testid="sidebar-ad"
  />
);

export const MobileAd: React.FC<{ className?: string }> = ({ className }) => (
  <AdBanner
    slot="1122334455" // Replace with actual ad slot
    format="auto"
    responsive={true}
    className={cn('w-full md:hidden', className)}
    data-testid="mobile-ad"
  />
);

// Declare global types for TypeScript
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default AdBanner;