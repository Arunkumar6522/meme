import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { LoadingSpinner } from '@/components/ui';
import { useToast } from '@/hooks/useToast';

const AuthCallbackPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔍 Auth callback started');
        console.log('🔍 Current URL:', window.location.href);
        console.log('🔍 Hash:', window.location.hash);
        
        // Get the hash from URL (Supabase sends tokens in hash)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        const errorParam = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        console.log('🔍 Tokens found:', { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken, 
          type,
          error: errorParam 
        });

        // Check for OAuth errors first
        if (errorParam) {
          throw new Error(errorDescription || errorParam);
        }

        if (accessToken && refreshToken) {
          console.log('✅ Setting session with tokens');
          
          // Set the session with the tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('❌ Session error:', error);
            throw error;
          }

          console.log('✅ Session set successfully:', data);

          // Handle different callback types
          if (type === 'signup') {
            showSuccess('Email confirmed successfully! Welcome to ilovememe.in!', 'Account Verified');
            navigate('/home');
          } else if (type === 'recovery') {
            showSuccess('Email verified! You can now reset your password.', 'Email Verified');
            navigate(`/auth/reset-password?access_token=${accessToken}&refresh_token=${refreshToken}`);
          } else {
            // OAuth login (Google, etc.)
            showSuccess('Successfully signed in!', 'Welcome Back');
            navigate('/home');
          }
        } else {
          // Check for error in URL params (fallback)
          const urlErrorDescription = searchParams.get('error_description') || 'Authentication failed - no tokens received';
          console.error('❌ No tokens found:', urlErrorDescription);
          throw new Error(urlErrorDescription);
        }
      } catch (err) {
        const errorMessage = (err as Error).message;
        console.error('❌ Auth callback error:', errorMessage);
        setError(errorMessage);
        showError(errorMessage, 'Authentication Error');
        
        // Redirect to login after error
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams, showSuccess, showError]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">
            Verifying your account...
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we confirm your email address.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-medium text-gray-900">
              Verification Failed
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {error}
            </p>
            <p className="mt-4 text-xs text-gray-500">
              Redirecting to login page in a few seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallbackPage;