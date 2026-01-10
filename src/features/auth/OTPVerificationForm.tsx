import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

interface OTPVerificationFormProps {
  email: string;
  type: 'signup' | 'reset-password';
  onBack: () => void;
}

const OTPVerificationForm: React.FC<OTPVerificationFormProps> = ({ email, type, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { verifyOTP, resendOTP } = useAuth();
  const { showSuccess, showError } = useToast();

  // Normalize email for display and use
  const normalizedEmail = email.trim().toLowerCase();

  // Get dev code from sessionStorage in development mode
  useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      try {
        const storedCode = sessionStorage.getItem(`dev_otp_${normalizedEmail}`);
        if (storedCode) {
          setDevCode(storedCode);
        }
      } catch (e) {
        // Ignore if sessionStorage unavailable
      }
    }
  }, [normalizedEmail]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    
    setOtp(newOtp);
    
    // Focus next empty input or last input
    const nextEmptyIndex = newOtp.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpCode = otp.join('');
    
    // Validate OTP format
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    if (!/^\d{6}$/.test(otpCode)) {
      setError('OTP code must contain only numbers');
      return;
    }

    // Validate email format (use normalizedEmail from component scope)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      setError('Invalid email address');
      showError('Invalid email address', 'Validation Error');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await verifyOTP(normalizedEmail, otpCode, type);
      
      if (error) {
        setError(error);
        showError(error, 'Verification Failed');
        setLoading(false);
        return;
      }
      
      // Success - clear OTP inputs
      setOtp(['', '', '', '', '', '']);
      
      if (type === 'signup') {
        showSuccess('Account verified successfully! Welcome to Meme Library!', 'Verification Complete');
        // Small delay to show success message before navigation
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } else {
        showSuccess('Email verified! You can now reset your password.', 'Verification Complete');
        // Small delay to show success message before navigation
        setTimeout(() => {
          navigate('/auth/reset-password', { state: { email: normalizedEmail } });
        }, 1000);
      }
    } catch (err) {
      const errorMessage = (err as Error).message || 'An unexpected error occurred';
      console.error('OTP verification error:', err);
      setError(errorMessage);
      showError(errorMessage, 'Verification Failed');
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    setError(null);

    try {
      const { error } = await resendOTP(normalizedEmail, type);
      
      if (error) {
        showError(error, 'Resend Failed');
      } else {
        showSuccess('New verification code sent to your email!', 'Code Sent');
        // Clear current OTP
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      showError((err as Error).message, 'Resend Failed');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="text-center">
        <div className="mx-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary-100">
          <svg
            className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 className="mt-3 sm:mt-4 text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Enter Verification Code
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-gray-600">
          We sent a 6-digit code to:
        </p>
        <p 
          className="mt-1 text-xs sm:text-sm font-medium text-gray-900 break-all px-2" 
          style={{ 
            wordBreak: 'break-all', 
            overflowWrap: 'break-word',
            maxWidth: '100%',
            overflow: 'visible',
            hyphens: 'auto'
          }}
          title={normalizedEmail}
        >
          {normalizedEmail}
        </p>
      </div>

      {error && (
        <div
          className="rounded-md bg-red-50 p-4 border border-red-200"
          role="alert"
          aria-live="polite"
        >
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Verification Code
          </label>
          <div className="flex justify-center gap-2 sm:gap-3 px-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-11 h-11 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors touch-manipulation"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={loading}
          disabled={loading || otp.join('').length !== 6}
        >
          {type === 'signup' ? 'Verify & Create Account' : 'Verify Email'}
        </Button>
      </form>

      <div className="text-center space-y-4">
        <div>
          <span className="text-sm text-gray-600">Didn't receive the code? </span>
          <button
            type="button"
            onClick={handleResendCode}
            disabled={resending}
            className="text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded disabled:opacity-50"
          >
            {resending ? 'Sending...' : 'Resend Code'}
          </button>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="text-sm text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
        >
          ← Change Email Address
        </button>
      </div>


      <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Tips
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Check your spam/junk folder</li>
                <li>Code expires in 10 minutes</li>
                <li>You can paste the code from your clipboard</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationForm;