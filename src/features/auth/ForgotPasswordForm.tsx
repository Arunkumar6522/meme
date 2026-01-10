import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import OTPVerificationForm from './OTPVerificationForm';

const ForgotPasswordForm: React.FC = () => {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const { resetPassword, loading } = useAuth();
  const { showSuccess, showError } = useToast();

  // Debug: Log step changes
  useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      console.log('🔍 ForgotPasswordForm step changed to:', step);
    }
  }, [step]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Clear any previous errors
    setErrors({});

    try {
      const result = await resetPassword(email);
      
      // Debug log
      if (import.meta.env.MODE === 'development') {
        console.log('🔍 resetPassword result:', result);
        console.log('🔍 Current step before update:', step);
      }
      
      // Check if there's an error
      if (result?.error) {
        setErrors({ general: result.error });
        showError(result.error, 'Password Reset Failed');
        return;
      }

      // Success - Update step to OTP FIRST (before toast)
      // This ensures the screen changes immediately
      setStep('otp');
      
      // Then show success message
      showSuccess('Verification code sent to your email!', 'Check Your Email');
      
      if (import.meta.env.MODE === 'development') {
        console.log('🔍 Step set to otp immediately');
      }
      
    } catch (err) {
      const errorMessage = (err as Error).message || 'An unexpected error occurred';
      setErrors({ general: errorMessage });
      showError(errorMessage, 'Password Reset Failed');
    }
  };

  // Show OTP verification form if on OTP step
  // CRITICAL: This check must happen BEFORE the main return statement
  // Use a unique key that includes step to force React to re-render
  if (step === 'otp') {
    if (import.meta.env.MODE === 'development') {
      console.log('✅ RENDERING OTP SCREEN - step:', step, 'email:', email);
    }
    return (
      <OTPVerificationForm
        key={`otp-screen-${email}-${Date.now()}`}
        email={email}
        type="reset-password"
        onBack={() => {
          setStep('form');
          setErrors({});
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-md space-y-6 mobile-form">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Forgot Password?
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
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
            if (errors.email) {
              setErrors(prev => ({ ...prev, email: undefined }));
            }
          }}
          error={errors.email}
          placeholder="Enter your email address"
          autoComplete="email"
          required
        />

        <Button
          type="submit"
          className="w-full"
          loading={loading}
          disabled={loading}
        >
          Send Reset Instructions
        </Button>
      </form>

      <div className="text-center">
        <Link
          to="/auth/login"
          className="text-sm text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
        >
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;