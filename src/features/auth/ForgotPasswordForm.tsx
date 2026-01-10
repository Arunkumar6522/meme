import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
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
  const stepRef = useRef(step);
  
  // Keep ref in sync with state
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

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
      console.log('🚀 Starting password reset for:', email);
      const result = await resetPassword(email);
      
      console.log('📦 resetPassword result:', JSON.stringify(result, null, 2));
      console.log('📊 Current step state:', step);
      console.log('❓ Has error?', !!result?.error);
      
      // Check if there's an error
      if (result?.error) {
        console.error('❌ Error in resetPassword:', result.error);
        setErrors({ general: result.error });
        showError(result.error, 'Password Reset Failed');
        return;
      }

      // Success - FORCE step update to OTP using flushSync for immediate render
      console.log('✅ No error, setting step to OTP...');
      console.log('📝 Step before update:', step);
      
      // Use flushSync to force synchronous state update and re-render
      flushSync(() => {
        setStep('otp');
        stepRef.current = 'otp';
      });
      
      console.log('✅ Step set to otp (synchronously), component should re-render NOW');
      
      // Show success message after state update
      showSuccess('Verification code sent to your email!', 'Check Your Email');
      
    } catch (err) {
      console.error('💥 Exception in handleSubmit:', err);
      const errorMessage = (err as Error).message || 'An unexpected error occurred';
      setErrors({ general: errorMessage });
      showError(errorMessage, 'Password Reset Failed');
    }
  };

  // Show OTP verification form if on OTP step
  // Check state first, then ref as fallback
  if (step === 'otp') {
    console.log('✅✅✅ RENDERING OTP SCREEN - step is otp!');
    return (
      <OTPVerificationForm
        key={`otp-${email}`}
        email={email}
        type="reset-password"
        onBack={() => {
          flushSync(() => {
            setStep('form');
            stepRef.current = 'form';
          });
          setErrors({});
        }}
      />
    );
  }
  
  // Fallback check using ref (shouldn't be needed but just in case)
  if (stepRef.current === 'otp' && step !== 'otp') {
    console.warn('⚠️ Ref says otp but state says form - forcing state update');
    flushSync(() => {
      setStep('otp');
    });
    return (
      <OTPVerificationForm
        key={`otp-${email}`}
        email={email}
        type="reset-password"
        onBack={() => {
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