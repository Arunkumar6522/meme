import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import OTPVerificationForm from './OTPVerificationForm';

const RegisterForm: React.FC = () => {
  const [step, setStep] = useState<'form' | 'otp'>(() => {
    // Only restore from sessionStorage if we're coming back from OTP screen
    // Otherwise, always start fresh
    try {
      const persisted = sessionStorage.getItem('register-step');
      return persisted === 'otp' ? 'otp' : 'form';
    } catch {
      return 'form';
    }
  });
  const [formData, setFormData] = useState(() => {
    try {
      const persistedStep = sessionStorage.getItem('register-step');
      if (persistedStep === 'otp') {
        // If we're on OTP step, restore form data
        const saved = sessionStorage.getItem('register-form-data');
        return saved ? JSON.parse(saved) : {
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
        };
      }
      // Clear sessionStorage if we're starting fresh
      sessionStorage.removeItem('register-step');
      sessionStorage.removeItem('register-email');
      sessionStorage.removeItem('register-form-data');
      return {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      };
    } catch {
      return {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      };
    }
  });
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const { signUp, signInWithGoogle, loading } = useAuth();
  const { showSuccess, showError } = useToast();
  const stepRef = useRef(step);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // Clear sessionStorage on mount if form data is empty (fresh start)
  useEffect(() => {
    if (!formData.email && step === 'form') {
      try {
        sessionStorage.removeItem('register-step');
        sessionStorage.removeItem('register-email');
        sessionStorage.removeItem('register-form-data');
      } catch (e) {
        // Ignore
      }
    }
  }, []); // Only run on mount

  // Persist form data to sessionStorage
  useEffect(() => {
    try {
      if (step === 'form') {
        sessionStorage.setItem('register-form-data', JSON.stringify(formData));
      }
    } catch (e) {
      // Ignore sessionStorage errors
    }
  }, [formData, step]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setErrors({});

    try {
      const { error } = await signUp(formData.email, formData.password, formData.fullName);
      if (error) {
        // Provide user-friendly error messages
        let userFriendlyError = error;
        if (error.includes('already exists') || error.includes('duplicate')) {
          userFriendlyError = 'An account with this email already exists. Please sign in instead.';
        } else if (error.includes('Invalid email')) {
          userFriendlyError = 'Please enter a valid email address.';
        } else if (error.includes('Password')) {
          userFriendlyError = 'Password must be at least 6 characters long.';
        }
        setErrors({ general: userFriendlyError });
        showError(userFriendlyError, 'Registration Failed');
        return;
      }

      // Success - persist email and step BEFORE state update
      try {
        sessionStorage.setItem('register-email', formData.email);
        sessionStorage.setItem('register-step', 'otp');
      } catch (e) {
        // Ignore sessionStorage errors
      }

      // Force synchronous state update FIRST
      flushSync(() => {
        setStep('otp');
        stepRef.current = 'otp';
      });

      // Show success message AFTER state update
      showSuccess('Verification code sent to your email!', 'Check Your Email');
    } catch (err) {
      const errorMessage = (err as Error).message || 'An unexpected error occurred';
      setErrors({ general: errorMessage });
      showError(errorMessage, 'Registration Failed');
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

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
    // Clear password confirmation error if password changes
    if (field === 'password' && errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  // Check sessionStorage for persisted step (similar to ForgotPasswordForm)
  useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      console.log('🔍 RegisterForm step changed to:', step);
    }
  }, [step]);

  // Check sessionStorage for persisted step
  const persistedStep = (() => {
    try {
      return sessionStorage.getItem('register-step') as 'form' | 'otp' | null;
    } catch {
      return null;
    }
  })();

  const persistedEmail = (() => {
    try {
      const stored = sessionStorage.getItem('register-email');
      // Validate email format before using
      if (stored && /\S+@\S+\.\S+/.test(stored)) {
        return stored;
      }
      return formData.email;
    } catch {
      return formData.email;
    }
  })();

  const shouldShowOTP = step === 'otp' || stepRef.current === 'otp' || persistedStep === 'otp';
  const emailToUse = persistedEmail || formData.email;
  
  // Validate email format before showing OTP screen
  const isValidEmail = emailToUse && /\S+@\S+\.\S+/.test(emailToUse);

  // Show OTP verification form if on OTP step and email is valid
  if (shouldShowOTP && isValidEmail) {
    // Sync state if it's out of sync
    if (step !== 'otp') {
      flushSync(() => {
        setStep('otp');
        stepRef.current = 'otp';
      });
    }

    return (
      <OTPVerificationForm
        key={`otp-${emailToUse}`}
        email={emailToUse}
        type="signup"
        onBack={() => {
          try {
            sessionStorage.removeItem('register-step');
            sessionStorage.removeItem('register-email');
            sessionStorage.removeItem('register-form-data');
          } catch (e) {
            // Ignore
          }
          flushSync(() => {
            setStep('form');
            stepRef.current = 'form';
          });
          setErrors({});
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-md space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Create Account</h1>
        <p className="mt-2 text-xs sm:text-sm text-gray-600">Join Meme Library today</p>
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
          label="Full Name"
          type="text"
          value={formData.fullName}
          onChange={handleInputChange('fullName')}
          error={errors.fullName}
          placeholder="Enter your full name"
          autoComplete="name"
          autoFocus
          required
        />

        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={errors.email}
          placeholder="Enter your email"
          autoComplete="email"
          required
        />

        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleInputChange('password')}
          error={errors.password}
          placeholder="Create a password"
          autoComplete="new-password"
          helperText="Must be at least 6 characters"
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange('confirmPassword')}
          error={errors.confirmPassword}
          placeholder="Confirm your password"
          autoComplete="new-password"
          helperText={formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : undefined}
          required
        />

        <Button
          type="submit"
          className="w-full"
          loading={loading}
          disabled={loading}
        >
          Create Account
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
        Already have an account?{' '}
        <Link
          to="/auth/login"
          className="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;