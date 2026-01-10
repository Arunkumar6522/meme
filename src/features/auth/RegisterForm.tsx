import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import OTPVerificationForm from './OTPVerificationForm';

const RegisterForm: React.FC = () => {
  const location = useLocation();
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
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

  // Clear sessionStorage on mount - always start fresh when component mounts
  // Only restore if we're coming from OTP screen (via state or sessionStorage check)
  useEffect(() => {
    // Check if we have a valid OTP flow in progress
    try {
      const persistedStep = sessionStorage.getItem('register-step');
      const persistedEmail = sessionStorage.getItem('register-email');
      
      // Only restore if we have both step and email, and email is FULLY valid
      // Must be a complete, valid email address (not partial)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const normalizedPersistedEmail = persistedEmail?.trim().toLowerCase() || '';
      
      // CRITICAL: Only restore OTP step if:
      // 1. Step is 'otp'
      // 2. Email exists and is not empty
      // 3. Email is FULLY valid (matches regex completely)
      // 4. Email is at least 5 characters (a@b.c minimum)
      if (persistedStep === 'otp' && 
          normalizedPersistedEmail && 
          normalizedPersistedEmail.length >= 5 &&
          emailRegex.test(normalizedPersistedEmail)) {
        // Restore OTP step
        setStep('otp');
        stepRef.current = 'otp';
        
        // Restore form data if available
        const savedFormData = sessionStorage.getItem('register-form-data');
        if (savedFormData) {
          try {
            const parsed = JSON.parse(savedFormData);
            // Only restore if the email matches
            if (parsed.email && parsed.email.trim().toLowerCase() === normalizedPersistedEmail) {
              setFormData(parsed);
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      } else {
        // Clear everything - fresh start
        // This ensures we don't show OTP screen with incomplete emails
        sessionStorage.removeItem('register-step');
        sessionStorage.removeItem('register-email');
        sessionStorage.removeItem('register-form-data');
        setStep('form');
        stepRef.current = 'form';
      }
    } catch (e) {
      // If sessionStorage fails, just start fresh
      setStep('form');
      stepRef.current = 'form';
    }
  }, [location.pathname]); // Re-run when route changes

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

  // Proper email validation regex
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim().toLowerCase());
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Validate email with proper regex
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const trimmedEmail = formData.email.trim().toLowerCase();
      if (!validateEmail(trimmedEmail)) {
        newErrors.email = 'Please enter a valid email address (e.g., name@example.com)';
      } else if (trimmedEmail.length > 254) {
        newErrors.email = 'Email address is too long';
      }
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (formData.password.length > 128) {
      newErrors.password = 'Password is too long (maximum 128 characters)';
    }

    // Validate confirm password
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
    
    // Validate form first
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    // Clear previous errors
    setErrors({});
    
    // Ensure we're on form step (prevent showing OTP if there was an error before)
    if (step !== 'form') {
      flushSync(() => {
        setStep('form');
        stepRef.current = 'form';
      });
    }

    try {
      // Normalize email before sending
      const normalizedEmail = formData.email.trim().toLowerCase();
      
      // Double-check email validation before API call
      if (!validateEmail(normalizedEmail)) {
        setErrors({ email: 'Please enter a valid email address' });
        showError('Invalid email address', 'Validation Error');
        return;
      }

      console.log('Calling signUp API...', { email: normalizedEmail, hasPassword: !!formData.password });
      
      const result = await signUp(normalizedEmail, formData.password, formData.fullName.trim());
      
      console.log('signUp result:', result);
      
      // Check for error - CRITICAL: Don't show OTP screen if there's an error
      if (result?.error) {
        console.error('Registration error:', result.error);
        
        // Ensure we stay on form step
        flushSync(() => {
          setStep('form');
          stepRef.current = 'form';
        });
        
        // Clear any sessionStorage that might have been set
        try {
          sessionStorage.removeItem('register-step');
          sessionStorage.removeItem('register-email');
        } catch (e) {
          // Ignore
        }
        
        // Provide user-friendly error messages
        let userFriendlyError = result.error;
        if (result.error.includes('already exists') || 
            result.error.includes('duplicate') || 
            result.error.includes('already registered') ||
            result.error.includes('User already registered')) {
          userFriendlyError = 'An account with this email already exists. Please sign in instead.';
        } else if (result.error.includes('Invalid email') || result.error.includes('email')) {
          userFriendlyError = 'Please enter a valid email address.';
        } else if (result.error.includes('Password') || result.error.includes('password')) {
          userFriendlyError = 'Password must be at least 6 characters long.';
        } else if (result.error.includes('session expired') || result.error.includes('expired')) {
          userFriendlyError = 'Registration session expired. Please try again.';
        } else if (result.error.includes('Unable to verify') || result.error.includes('RLS')) {
          userFriendlyError = 'Unable to verify account status. Please check your Supabase RLS policies or contact support.';
        }
        
        setErrors({ general: userFriendlyError });
        showError(userFriendlyError, 'Registration Failed');
        return; // CRITICAL: Return here to prevent OTP screen
      }

      // Only proceed to OTP screen if there's NO error
      console.log('Registration successful, showing OTP screen...');
      
      // Success - persist email and step BEFORE state update
      try {
        sessionStorage.setItem('register-email', normalizedEmail);
        sessionStorage.setItem('register-step', 'otp');
        // Also update formData email to normalized version
        setFormData(prev => ({ ...prev, email: normalizedEmail }));
      } catch (e) {
        console.error('Failed to save to sessionStorage:', e);
      }

      // Force synchronous state update FIRST
      flushSync(() => {
        setStep('otp');
        stepRef.current = 'otp';
      });

      // Show success message AFTER state update
      showSuccess('Verification code sent to your email!', 'Check Your Email');
    } catch (err) {
      console.error('Exception in handleSubmit:', err);
      
      // Ensure we stay on form step on exception
      flushSync(() => {
        setStep('form');
        stepRef.current = 'form';
      });
      
      // Clear sessionStorage
      try {
        sessionStorage.removeItem('register-step');
        sessionStorage.removeItem('register-email');
      } catch (e) {
        // Ignore
      }
      
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

  // Show OTP verification form ONLY if:
  // 1. Step is 'otp'
  // 2. Email exists and is not empty
  // 3. Email is FULLY valid (complete email address, not partial)
  // 4. Email is at least 5 characters (minimum: a@b.c)
  // 5. NO errors exist (critical - don't show OTP if there's an error)
  // 6. We have a valid email in formData
  const normalizedEmail = formData.email?.trim().toLowerCase() || '';
  const isEmailComplete = normalizedEmail.length >= 5 && validateEmail(normalizedEmail);
  
  const shouldShowOTP = step === 'otp' && 
                        normalizedEmail && 
                        normalizedEmail.length >= 5 &&
                        isEmailComplete && 
                        !errors.general &&
                        Object.keys(errors).length === 0;

  if (shouldShowOTP) {
    return (
      <OTPVerificationForm
        key={`otp-${formData.email}`}
        email={formData.email.trim().toLowerCase()}
        type="signup"
        onBack={() => {
          // Clear sessionStorage and reset to form
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
          // Reset form data
          setFormData({
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
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