import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner, Button } from '@/components/ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    // Redirect to login with return URL
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check admin requirement
  if (requireAdmin) {
    // Simple admin check - you can make yourself admin in Supabase dashboard
    // Check if user email contains 'admin' or specific admin emails
    const adminEmails = ['admin@example.com']; // Add your email here
    const isAdmin = user.email?.includes('admin') || 
                   adminEmails.includes(user.email || '') ||
                   user.user_metadata?.role === 'admin';
    
    if (!isAdmin) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Access Required</h2>
            <p className="text-gray-600 mb-4">
              You need admin privileges to access this area.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              To become an admin, go to your Supabase dashboard → Table Editor → users 
              and change your role to 'admin'.
            </p>
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;