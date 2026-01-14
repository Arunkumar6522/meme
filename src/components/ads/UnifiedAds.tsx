import React from 'react';
import { cn } from '@/utils/cn';
import AdBanner from './AdBanner';
import { MonetagBanner, MonetagNative, MonetagMobileBanner, MonetagVideo } from './MonetagAds';

interface UnifiedAdProps {
  placement: 'header' | 'sidebar' | 'footer' | 'content' | 'mobile';
  className?: string;
  showBoth?: boolean; // Show both AdSense and Monetag
}

export const UnifiedAd: React.FC<UnifiedAdProps> = ({ 
  placement, 
  className = '', 
  showBoth = false 
}) => {
  const getAdConfig = () => {
    switch (placement) {
      case 'header':
        return {
          adsense: { slot: '1234567890', format: 'horizontal' as const },
          monetag: MonetagBanner,
          containerClass: 'w-full max-w-4xl mx-auto mb-6'
        };
      case 'sidebar':
        return {
          adsense: { slot: '0987654321', format: 'rectangle' as const },
          monetag: MonetagNative,
          containerClass: 'w-full max-w-sm'
        };
      case 'footer':
        return {
          adsense: { slot: '1111222233', format: 'horizontal' as const },
          monetag: MonetagBanner,
          containerClass: 'w-full max-w-4xl mx-auto mt-6'
        };
      case 'content':
        return {
          adsense: { slot: '4444555566', format: 'rectangle' as const },
          monetag: MonetagVideo,
          containerClass: 'w-full max-w-md mx-auto my-4'
        };
      case 'mobile':
        return {
          adsense: { slot: '7777888899', format: 'auto' as const },
          monetag: MonetagMobileBanner,
          containerClass: 'w-full md:hidden'
        };
      default:
        return {
          adsense: { slot: '1234567890', format: 'auto' as const },
          monetag: MonetagBanner,
          containerClass: 'w-full'
        };
    }
  };

  const config = getAdConfig();
  const MonetagComponent = config.monetag;

  if (showBoth) {
    return (
      <div className={cn('space-y-4', config.containerClass, className)}>
        {/* Google AdSense */}
        <AdBanner
          slot={config.adsense.slot}
          format={config.adsense.format}
          className="w-full"
        />
        
        {/* Monetag Ad */}
        <MonetagComponent className="w-full" />
      </div>
    );
  }

  // Show Monetag by default (since it's newly integrated)
  return (
    <div className={cn(config.containerClass, className)}>
      <MonetagComponent className="w-full" />
    </div>
  );
};

// Predefined unified ad components for easy use
export const HeaderAd: React.FC<{ className?: string }> = ({ className }) => (
  <UnifiedAd placement="header" className={className} />
);

export const SidebarAd: React.FC<{ className?: string }> = ({ className }) => (
  <UnifiedAd placement="sidebar" className={className} />
);

export const FooterAd: React.FC<{ className?: string }> = ({ className }) => (
  <UnifiedAd placement="footer" className={className} />
);

export const ContentAd: React.FC<{ className?: string }> = ({ className }) => (
  <UnifiedAd placement="content" className={className} />
);

export const MobileAd: React.FC<{ className?: string }> = ({ className }) => (
  <UnifiedAd placement="mobile" className={className} />
);

export default UnifiedAd;