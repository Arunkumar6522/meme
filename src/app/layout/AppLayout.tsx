import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/navigation/Header';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 pb-safe">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;