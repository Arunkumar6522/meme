import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import LoginForm from '@/features/auth/LoginForm';
import RegisterForm from '@/features/auth/RegisterForm';
import ForgotPasswordForm from '@/features/auth/ForgotPasswordForm';
import ResetPasswordForm from '@/features/auth/ResetPasswordForm';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui';

const AuthPage: React.FC = () => {
  const { type } = useParams<{ type: 'login' | 'register' | 'forgot-password' | 'reset-password' }>();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-6 sm:py-12 sm:px-6 lg:px-8">
      <div className="w-full mx-auto max-w-md">
        {renderForm()}
      </div>
    </div>
  );
};

export default AuthPage;