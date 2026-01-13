import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';
import { BannerAd, MobileAd } from '@/components/ads/AdBanner';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 pb-safe">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Global ad slots (safe placeholders now; real ads later) */}
          <div className="mt-4 mb-4">
            <MobileAd />
            <BannerAd className="hidden md:block" />
          </div>
          <Outlet />
          <div className="mt-8 mb-4">
            <BannerAd />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;