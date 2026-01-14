import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';
import GoogleAdSense from '@/components/ads/GoogleAdSense';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 pb-safe">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Global ad slots */}
          <div className="hidden md:block mb-6">
            <GoogleAdSense type="horizontal" className="mx-auto max-w-4xl" />
          </div>
          <div className="md:hidden mb-6">
            <GoogleAdSense type="square" className="mx-auto max-w-[300px]" />
          </div>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;