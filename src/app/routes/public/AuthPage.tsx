import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import LoginForm from '@/features/auth/LoginForm';
import RegisterForm from '@/features/auth/RegisterForm';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui';

const AuthPage: React.FC = () => {
  const { type } = useParams<{ type: 'login' | 'register' }>();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {type === 'register' ? <RegisterForm /> : <LoginForm />}
      </div>
    </div>
  );
};

export default AuthPage;