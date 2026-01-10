import { supabase } from './supabase';
import { OTPService } from './otp.service';

export class CustomAuthService {
  // Send password reset OTP (checks if user exists first)
  static async sendPasswordResetOTP(email: string): Promise<{ error: string | null }> {
    try {
      console.log(`📧 Sending password reset OTP to ${email}...`);
      
      // Try to check if user exists (but don't fail if RLS blocks it)
      // If RLS blocks the check, we'll proceed anyway - email service will handle non-existent users
      let userExists = false;
      try {
        userExists = await OTPService.checkUserExists(email);
      } catch (checkError) {
        // If check fails due to RLS, proceed anyway
        console.warn('User existence check failed, proceeding with OTP send:', checkError);
        userExists = true; // Assume user exists to allow OTP send
      }
      
      // Only return error if we're certain user doesn't exist
      // (not if RLS blocked the check)
      if (userExists === false) {
        // Double-check: try to send OTP anyway - if user doesn't exist, 
        // they simply won't receive the email (which is fine for security)
        // But for UX, we'll show the error
        return { error: 'No account found with this email address' };
      }

      // Generate OTP code
      const otpCode = OTPService.generateOTPCode();

      // Send OTP email
      const result = await OTPService.sendOTPEmail(email, otpCode, 'password_reset');
      
      if (result.error) {
        console.error('❌ Failed to send password reset OTP:', result.error);
        return { error: result.error };
      }

      console.log(`✅ Password reset OTP sent successfully to ${email}`);

      // In development, store the code for testing (never expose in production)
      if (import.meta.env.MODE === 'development' && result.devCode) {
        try {
          sessionStorage.setItem(`dev_otp_${email}`, result.devCode);
          console.log(`💡 Development mode: OTP code stored in sessionStorage (key: dev_otp_${email})`);
          console.log(`💡 To test email sending, run 'netlify dev' instead of 'npm run dev'`);
        } catch (e) {
          // Ignore if sessionStorage unavailable
        }
      }

      return { error: null };
    } catch (error) {
      console.error('💥 Exception in sendPasswordResetOTP:', error);
      return { error: (error as Error).message };
    }
  }

  // Verify password reset OTP
  static async verifyPasswordResetOTP(email: string, code: string): Promise<{ valid: boolean; error: string | null }> {
    try {
      const result = await OTPService.verifyOTP(email, code, 'password_reset');
      return result;
    } catch (error) {
      return { valid: false, error: (error as Error).message };
    }
  }

  // Update password after OTP verification
  // Uses Netlify function for secure password update (admin API requires service role key)
  static async updatePasswordWithEmail(email: string, newPassword: string): Promise<{ error: string | null }> {
    try {
      // Call Netlify function to update password securely
      const response = await fetch('/.netlify/functions/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          newPassword,
        }),
      });

      // Check if response is ok
      if (!response.ok) {
        let errorMessage = 'Failed to update password';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            errorMessage = await response.text() || errorMessage;
          }
        } catch (parseError) {
          // If parsing fails, use default error message
          console.error('Error parsing error response:', parseError);
        }
        return { error: errorMessage };
      }

      // Parse successful response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.error) {
          return { error: data.error };
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Error updating password:', error);
      // If Netlify function is not available (local dev), provide helpful error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return { error: 'Unable to connect to server. Please ensure you are running "netlify dev" for local development.' };
      }
      return { error: (error as Error).message || 'Failed to update password' };
    }
  }

  // Send signup OTP
  static async sendSignupOTP(email: string, password: string, fullName?: string): Promise<{ error: string | null }> {
    try {
      // Check if user already exists
      const userExists = await OTPService.checkUserExists(email);
      
      if (userExists) {
        return { error: 'An account with this email already exists' };
      }

      // Generate OTP code
      const otpCode = OTPService.generateOTPCode();
      
      console.log(`📧 Sending signup OTP to ${email}...`);

      // Send OTP email
      const result = await OTPService.sendOTPEmail(email, otpCode, 'signup');
      
      if (result.error) {
        console.error('❌ Failed to send signup OTP:', result.error);
        return { error: result.error };
      }

      console.log(`✅ Signup OTP sent successfully to ${email}`);

      // Store signup data in localStorage temporarily
      const signupData = {
        email,
        password,
        fullName,
        timestamp: Date.now(),
      };
      localStorage.setItem('pending_signup', JSON.stringify(signupData));

      // In development, log where to find the OTP
      if (import.meta.env.MODE === 'development' && result.devCode) {
        console.log(`💡 Development mode: OTP code stored in sessionStorage (key: dev_otp_${email})`);
        console.log(`💡 To test email sending, run 'netlify dev' instead of 'npm run dev'`);
      }

      return { error: null };
    } catch (error) {
      console.error('💥 Exception in sendSignupOTP:', error);
      return { error: (error as Error).message };
    }
  }

  // Verify signup OTP and create account
  static async verifySignupOTP(email: string, code: string): Promise<{ error: string | null }> {
    try {
      // Verify OTP
      const { valid, error } = await OTPService.verifyOTP(email, code, 'signup');
      
      if (!valid) {
        return { error: error || 'Invalid verification code' };
      }

      // Get stored signup data
      const storedData = localStorage.getItem('pending_signup');
      if (!storedData) {
        return { error: 'Signup session expired. Please try again.' };
      }

      const signupData = JSON.parse(storedData);
      
      // Check if data matches and is not expired (10 minutes)
      if (signupData.email !== email || Date.now() - signupData.timestamp > 10 * 60 * 1000) {
        localStorage.removeItem('pending_signup');
        return { error: 'Signup session expired. Please try again.' };
      }

      // Create account with Supabase
      const { data, error: signupError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            full_name: signupData.fullName,
          },
          emailRedirectTo: undefined, // Skip email confirmation since we already verified
        },
      });

      if (signupError) {
        return { error: signupError.message };
      }

      // Clean up stored data
      localStorage.removeItem('pending_signup');

      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  // Resend OTP
  static async resendOTP(email: string, type: 'signup' | 'password_reset'): Promise<{ error: string | null }> {
    try {
      if (type === 'signup') {
        // Get stored signup data
        const storedData = localStorage.getItem('pending_signup');
        if (!storedData) {
          return { error: 'No pending signup found. Please start over.' };
        }

        const signupData = JSON.parse(storedData);
        if (signupData.email !== email) {
          return { error: 'Email mismatch. Please start over.' };
        }

        // Generate new OTP
        const otpCode = OTPService.generateOTPCode();
        return await OTPService.sendOTPEmail(email, otpCode, 'signup');
      } else {
        // For password reset, check if user exists and send new OTP
        return await this.sendPasswordResetOTP(email);
      }
    } catch (error) {
      return { error: (error as Error).message };
    }
  }
}