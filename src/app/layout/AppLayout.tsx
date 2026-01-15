import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';


const AppLayout: React.FC = () => {
  const location = useLocation();

  // Stop all media playback on route change
  React.useEffect(() => {
    window.dispatchEvent(new Event('media:stopAll'));
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 pb-safe">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Global ad slots removed to prevent violations on Auth/Contact pages */}
          {/* Ads should be placed individually on content-rich pages */}
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;