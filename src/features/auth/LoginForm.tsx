import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState(() => {
    // Try to restore email from sessionStorage for better UX
    try {
      return sessionStorage.getItem('login-email') || '';
    } catch {
      return '';
    }
  });
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const { signIn, signInWithGoogle, loading } = useAuth();
  const { showSuccess, showError } = useToast();
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Save email to sessionStorage when it changes
  useEffect(() => {
    try {
      if (email) {
        sessionStorage.setItem('login-email', email);
      }
    } catch (e) {
      // Ignore sessionStorage errors
    }
  }, [email]);

  // Auto-focus password field after error (for better UX)
  useEffect(() => {
    if (errors.general || errors.password) {
      // Small delay to ensure input is rendered
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
    }
  }, [errors.general, errors.password]);

  // Proper email validation regex
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim().toLowerCase());
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const trimmedEmail = email.trim().toLowerCase();
      if (!validateEmail(trimmedEmail)) {
        newErrors.email = 'Please enter a valid email address (e.g., name@example.com)';
      } else if (trimmedEmail.length > 254) {
        newErrors.email = 'Email address is too long';
      }
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setErrors({});

    try {
      // Normalize email before sending
      const normalizedEmail = email.trim().toLowerCase();
      
      // Double-check email validation before API call
      if (!validateEmail(normalizedEmail)) {
        setErrors({ email: 'Please enter a valid email address' });
        showError('Invalid email address', 'Validation Error');
        return;
      }

      const { error } = await signIn(normalizedEmail, password);
      if (error) {
        // Keep email for better UX, only clear password for security
        setPassword('');
        // Provide user-friendly error messages
        let userFriendlyError = error;
        if (error.includes('Invalid login credentials') || error.includes('Email not confirmed')) {
          userFriendlyError = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.includes('Email rate limit')) {
          userFriendlyError = 'Too many login attempts. Please wait a moment and try again.';
        }
        setErrors({ general: userFriendlyError });
        showError(userFriendlyError, 'Sign In Failed');
      } else {
        // Update email state with normalized email
        setEmail(normalizedEmail);
        // Clear form and sessionStorage on success
        try {
          sessionStorage.removeItem('login-email');
        } catch (e) {
          // Ignore
        }
        setEmail('');
        setPassword('');
        setErrors({});
        showSuccess('Successfully signed in! Welcome back!', 'Sign In Successful');
      }
    } catch (err) {
      const errorMessage = (err as Error).message || 'An unexpected error occurred';
      setPassword(''); // Clear password on error, but keep email
      setErrors({ general: errorMessage });
      showError(errorMessage, 'Sign In Failed');
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      setErrors({ general: error });
      showError(error, 'Google Sign-in Failed');
    } else {
      showSuccess('Successfully signed in with Google!', 'Welcome Back');
    }
  };

  return (
    <div className="w-full max-w-md space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Sign In</h1>
        <p className="mt-2 text-xs sm:text-sm text-gray-600">Welcome back to Meme Library</p>
      </div>

      {errors.general && (
        <div
          className="rounded-md bg-red-50 p-4 border border-red-200"
          role="alert"
          aria-live="polite"
        >
          <p className="text-sm text-red-800">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            // Clear errors when user starts typing
            if (errors.email) {
              setErrors(prev => ({ ...prev, email: undefined }));
            }
            if (errors.general) {
              setErrors(prev => ({ ...prev, general: undefined }));
            }
          }}
          error={errors.email}
          placeholder="Enter your email"
          autoComplete="email"
          autoFocus
          required
        />

        <Input
          ref={passwordInputRef}
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            // Clear errors when user starts typing
            if (errors.password) {
              setErrors(prev => ({ ...prev, password: undefined }));
            }
            if (errors.general) {
              setErrors(prev => ({ ...prev, general: undefined }));
            }
          }}
          error={errors.password}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-between">
          <Link
            to="/auth/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
          >
            Forgot your password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={loading}
          disabled={loading}
        >
          Sign In
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link
          to="/auth/register"
          className="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;