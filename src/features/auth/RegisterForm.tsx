import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { validateEmail, validateFullName, validatePassword } from '@/utils/validation';
import { oauthConfig } from '@/config';
import OTPVerificationForm from './OTPVerificationForm';
import RegistrationDebug from '@/components/debug/RegistrationDebug';

const RegisterForm: React.FC = () => {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpData, setOtpData] = useState<{
    email: string;
    password: string;
    fullName?: string;
  } | null>(null);
  const isSubmittingRef = useRef(false);
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

  // Simple effect to log state changes (NO state updates to prevent loops)
  useEffect(() => {
    console.log('🔄 RegisterForm state changed:', { 
      step, 
      hasOtpData: !!otpData, 
      otpEmail: otpData?.email,
      shouldShowOtp: (step === 'otp' && otpData) || (otpData && step !== 'form')
    });
    
    // Force re-render when OTP data is set
    if (step === 'otp' && otpData) {
      console.log('🚀 OTP data is ready, component should re-render');
    }
    
    // REMOVED: Don't update state in useEffect - this causes infinite loops!
  }, [step, otpData]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Validate full name
    const nameCheck = validateFullName(formData.fullName);
    if (!nameCheck.ok) newErrors.fullName = nameCheck.error;

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const trimmedEmail = formData.email.trim().toLowerCase();
      if (!validateEmail(trimmedEmail)) {
        newErrors.email = 'Please enter a valid email address (e.g., name@example.com)';
      }
    }

    // Validate password
    const passwordCheck = validatePassword(formData.password);
    if (!passwordCheck.ok) newErrors.password = passwordCheck.error;

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
    e.stopPropagation(); // Prevent event bubbling

    // Prevent multiple submissions
    if (isSubmittingRef.current) {
      console.log('🚫 Already submitting, ignoring duplicate submission');
      return;
    }

    isSubmittingRef.current = true;

    // Validate form first
    if (!validateForm()) {
      isSubmittingRef.current = false;
      return;
    }

    // Clear previous errors
    setErrors({});
    
    console.log('🚀 Starting registration process...');

    try {
      // Normalize email before sending
      const normalizedEmail = formData.email.trim().toLowerCase();
      
      // Double-check email validation before API call
      if (!validateEmail(normalizedEmail)) {
        setErrors({ email: 'Please enter a valid email address' });
        showError('Invalid email address', 'Validation Error');
        return;
      }

      console.log('📧 Sending OTP to:', normalizedEmail);
      const result = await signUp(normalizedEmail, formData.password, formData.fullName.trim());
      
      console.log('📨 SignUp result:', result);
      
      // Check for error
      if (result?.error) {
        console.error('❌ Registration error:', result.error);
        
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
        }
        
        setErrors({ general: userFriendlyError });
        showError(userFriendlyError, 'Registration Failed');
        return;
      }

      // SUCCESS: Switch to OTP screen
      console.log('✅ Email sent successfully! Switching to OTP screen...');
      
      // Show success message FIRST (before state changes)
      showSuccess('Verification code sent to your email!', 'Check Your Email');
      
      // Create complete OTP data object
      const newOtpData = {
        email: normalizedEmail,
        password: formData.password,
        fullName: formData.fullName?.trim() || undefined,
      };
      
      console.log('🔄 Setting OTP data:', newOtpData);
      console.log('🔄 Current step before change:', step);
      
      // Update state - use simple approach without flushSync to prevent issues
      console.log('🔄 About to update state...');
      
      // Set OTP data first
      setOtpData(newOtpData);
      
      // Then set step in next tick to ensure otpData is set
      setTimeout(() => {
        setStep('otp');
        console.log('🔄 Step updated to otp');
      }, 0);
      
      console.log('🎯 OTP screen should show after state updates');
      
      // Reset submission flag after a delay
      setTimeout(() => {
        isSubmittingRef.current = false;
        console.log('🔍 Final check - registration process complete');
      }, 200);
      
    } catch (err) {
      console.error('💥 Exception in handleSubmit:', err);
      
      const errorMessage = (err as Error).message || 'An unexpected error occurred';
      setErrors({ general: errorMessage });
      showError(errorMessage, 'Registration Failed');
      isSubmittingRef.current = false; // Reset on error
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      setErrors({ general: error });
      showError(error, 'Google Sign-in Failed');
    }
    // Don't show success toast here - let AuthCallbackPage handle it after actual completion
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // For full name, filter out invalid characters in real-time
    if (field === 'fullName') {
      // Only allow letters, remove everything else immediately
      value = value.replace(/[^a-zA-Z]/g, '');
      // Limit to 30 characters
      if (value.length > 30) {
        value = value.substring(0, 30);
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
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

  // Show OTP verification form if we're on the OTP step
  console.log('🔍 Render check - step:', step, 'otpData:', !!otpData);
  
  // More flexible condition - show OTP if we have otpData OR if step is 'otp'
  if ((step === 'otp' && otpData) || (otpData && step !== 'form')) {
    console.log('🎯 Rendering OTP screen for:', otpData?.email || 'unknown email');
    console.log('🎯 OTP screen props:', {
      email: otpData?.email,
      hasPassword: !!otpData?.password,
      hasFullName: !!otpData?.fullName
    });
    
    return (
      <div>
        {/* Debug info - remove this after testing */}
        <div style={{ 
          position: 'fixed', 
          top: '10px', 
          right: '10px', 
          background: 'green', 
          color: 'white', 
          padding: '10px', 
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 9999
        }}>
          ✅ OTP Screen Active<br/>
          📧 Email: {otpData?.email}<br/>
          🔄 Step: {step}
        </div>
        
        <OTPVerificationForm
          key={`otp-${otpData.email}`}
          email={otpData.email}
          type="signup"
          signupData={{
            password: otpData.password,
            fullName: otpData.fullName
          }}
          onBack={() => {
            // Reset to form
            setStep('form');
            setOtpData(null);
            setErrors({});
          }}
        />
      </div>
    );
  }

  return (
    <>
      <RegistrationDebug 
        step={step} 
        otpContext={otpData} 
        formData={formData} 
        errors={errors} 
      />
      <div className="w-full max-w-md space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Create Account</h1>
        <p className="mt-2 text-xs sm:text-sm text-gray-600">Join ilovememe.in today</p>
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
          placeholder="Enter your name (letters only)"
          autoComplete="name"
          autoFocus
          maxLength={30}
          helperText="Only letters allowed, no spaces or special characters"
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
          disabled={loading || step === 'otp'}
        >
          Create Account
        </Button>
      </form>

      {/* Show Google SSO only if enabled */}
      {oauthConfig.google.enabled && (
        <>
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
        </>
      )}

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
    </>
  );
};

export default RegisterForm;