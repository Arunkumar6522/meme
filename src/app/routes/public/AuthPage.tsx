import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import LoginForm from '@/features/auth/LoginForm';
import RegisterForm from '@/features/auth/RegisterForm';
import ForgotPasswordForm from '@/features/auth/ForgotPasswordForm';
import ResetPasswordForm from '@/features/auth/ResetPasswordForm';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui';

const AuthPage: React.FC = () => {
  const { type } = useParams<{ type: 'login' | 'register' | 'forgot-password' | 'reset-password' }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect if already authenticated (except for reset-password)
  if (user && type !== 'reset-password') {
    return <Navigate to="/" replace />;
  }

  // Render form based on type - use key to preserve state when type doesn't change
  const renderForm = () => {
    switch (type) {
      case 'register':
        return <RegisterForm key="register-form" />;
      case 'forgot-password':
        return <ForgotPasswordForm key="forgot-password-form" />;
      case 'reset-password':
        return <ResetPasswordForm key="reset-password-form" />;
      default:
        return <LoginForm key="login-form" />;
    }
  };

  const handleClose = () => {
    // Go back if possible, else home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 sm:px-6">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-100 p-4 sm:p-6">
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {renderForm()}
      </div>
    </div>
  );
};

export default AuthPage;