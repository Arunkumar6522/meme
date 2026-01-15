import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui';
import AppLayout from '@/app/layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';

// Lazy load components for code splitting
const LandingPage = React.lazy(() => import('./public/LandingPage'));
const AuthPage = React.lazy(() => import('./public/AuthPage'));
const AuthCallbackPage = React.lazy(() => import('./public/AuthCallbackPage'));
const HomePage = React.lazy(() => import('./protected/HomePage'));
const LibraryPage = React.lazy(() => import('./protected/LibraryPage'));

// Placeholder components for future implementation
const CreatePage = React.lazy(() => import('./protected/CreatePage'));
const ProfilePage = React.lazy(() => import('./protected/ProfilePage'));
const FavoritesPage = React.lazy(() => import('./protected/FavoritesPage'));
const UploadOnlyPage = React.lazy(() => import('./protected/UploadOnlyPage'));
const ArtistsPage = React.lazy(() => import('./admin/ArtistsPage'));
const DashboardPage = React.lazy(() => import('./admin/DashboardPage'));
const ContactUsPage = React.lazy(() => import('./policies/ContactUsPage'));
const TermsPage = React.lazy(() => import('./policies/TermsPage'));
const PrivacyPage = React.lazy(() => import('./policies/PrivacyPage'));
const RefundsPage = React.lazy(() => import('./policies/RefundsPage'));
const ShippingPage = React.lazy(() => import('./policies/ShippingPage'));
const ProPage = React.lazy(() => import('./protected/ProPage'));


// Loading component
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="auth/:type" element={<AuthPage />} />
          <Route path="auth/callback" element={<AuthCallbackPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="pro" element={<ProPage />} />

          {/* Policy Routes */}
          <Route path="contact-us" element={<ContactUsPage />} />
          <Route path="policies/terms" element={<TermsPage />} />
          <Route path="policies/privacy" element={<PrivacyPage />} />
          <Route path="policies/refunds" element={<RefundsPage />} />
          <Route path="policies/shipping" element={<ShippingPage />} />

          {/* Protected Routes */}
          <Route path="home" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />



          <Route path="create" element={
            <ProtectedRoute>
              <CreatePage />
            </ProtectedRoute>
          } />

          <Route path="profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="favorites" element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          } />



          {/* Admin Upload (renamed, no /admin base) */}
          <Route path="upload" element={
            <ProtectedRoute requireAdmin>
              <UploadOnlyPage />
            </ProtectedRoute>
          } />
          <Route path="library/upload" element={
            <ProtectedRoute requireAdmin>
              <UploadOnlyPage />
            </ProtectedRoute>
          } />
          <Route path="admin/artists" element={
            <ProtectedRoute requireAdmin>
              <ArtistsPage />
            </ProtectedRoute>
          } />
          <Route path="admin/dashboard" element={
            <ProtectedRoute requireAdmin>
              <DashboardPage />
            </ProtectedRoute>
          } />

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

// Simple 404 component
const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-6">Page not found</p>
        <a
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Go Home
        </a>
      </div>
    </div>
  </div>
);

export default AppRoutes;