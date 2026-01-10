import { supabase } from './supabase';
import { OTPService } from './otp.service';

export class CustomAuthService {
  // Send password reset OTP (checks if user exists first)
  static async sendPasswordResetOTP(email: string): Promise<{ error: string | null }> {
    try {
      // Normalize email
      const normalizedEmail = email.trim().toLowerCase();
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        return { error: 'Invalid email address format' };
      }
      
      console.log(`📧 Sending password reset OTP to ${normalizedEmail}...`);
      
      // Try to check if user exists (allow RLS fallback for password reset)
      // If RLS blocks the check, we'll proceed anyway - email service will handle non-existent users
      let userExists = false;
      try {
        userExists = await OTPService.checkUserExists(normalizedEmail, true); // Allow RLS fallback
      } catch (checkError) {
        // If check fails due to RLS, proceed anyway for password reset
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

      // Send OTP email (use normalized email)
      const result = await OTPService.sendOTPEmail(normalizedEmail, otpCode, 'password_reset');
      
      if (result.error) {
        console.error('❌ Failed to send password reset OTP:', result.error);
        return { error: result.error };
      }

      console.log(`✅ Password reset OTP sent successfully to ${normalizedEmail}`);

      // In development, store the code for testing (never expose in production)
      if (import.meta.env.MODE === 'development' && result.devCode) {
        try {
          sessionStorage.setItem(`dev_otp_${normalizedEmail}`, result.devCode);
          console.log(`💡 Development mode: OTP code stored in sessionStorage (key: dev_otp_${normalizedEmail})`);
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
      // Normalize email
      const normalizedEmail = email.trim().toLowerCase();
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        return { error: 'Invalid email address format' };
      }

      // Validate password
      if (!password || password.length < 6) {
        return { error: 'Password must be at least 6 characters' };
      }

      if (password.length > 128) {
        return { error: 'Password is too long (maximum 128 characters)' };
      }

      // Check if user already exists (don't allow RLS fallback for signup)
      let userExists = false;
      try {
        userExists = await OTPService.checkUserExists(normalizedEmail, false);
      } catch (checkError: any) {
        // If RLS blocks the check, we can't proceed with signup
        console.error('Cannot verify if user exists:', checkError);
        return { error: 'Unable to verify account status. Please check your Supabase RLS policies or try again later.' };
      }
      
      if (userExists) {
        return { error: 'An account with this email already exists. Please sign in instead.' };
      }

      // Generate OTP code
      const otpCode = OTPService.generateOTPCode();
      
      console.log(`📧 Sending signup OTP to ${normalizedEmail}...`);

      // Send OTP email (use normalized email)
      const result = await OTPService.sendOTPEmail(normalizedEmail, otpCode, 'signup');
      
      if (result.error) {
        console.error('❌ Failed to send signup OTP:', result.error);
        return { error: result.error };
      }

      console.log(`✅ Signup OTP sent successfully to ${normalizedEmail}`);

      // Store signup data in localStorage temporarily (use normalized email)
      const signupData = {
        email: normalizedEmail,
        password,
        fullName: fullName?.trim() || '',
        timestamp: Date.now(),
      };
      localStorage.setItem('pending_signup', JSON.stringify(signupData));

      // In development, log where to find the OTP
      if (import.meta.env.MODE === 'development' && result.devCode) {
        console.log(`💡 Development mode: OTP code stored in sessionStorage (key: dev_otp_${normalizedEmail})`);
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
      // Normalize email
      const normalizedEmail = email.trim().toLowerCase();
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        return { error: 'Invalid email address format' };
      }

      // Validate OTP code format (6 digits)
      if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
        return { error: 'Invalid verification code format' };
      }

      // Verify OTP
      const { valid, error: verifyError } = await OTPService.verifyOTP(normalizedEmail, code, 'signup');
      
      if (!valid) {
        return { error: verifyError || 'Invalid or expired verification code' };
      }

      // Get stored signup data
      const storedData = localStorage.getItem('pending_signup');
      if (!storedData) {
        return { error: 'Signup session expired. Please try again.' };
      }

      const signupData = JSON.parse(storedData);
      
      // Check if data matches (use normalized email) and is not expired (10 minutes)
      if (signupData.email !== normalizedEmail || Date.now() - signupData.timestamp > 10 * 60 * 1000) {
        localStorage.removeItem('pending_signup');
        return { error: 'Signup session expired. Please try again.' };
      }

      // Create account with Supabase
      // Note: If Supabase requires email confirmation, the user will be created but not confirmed
      // We'll handle this by checking the user status after signup
      const { data, error: signupError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            full_name: signupData.fullName,
          },
          // Try to skip email confirmation since we already verified via OTP
          // If Supabase requires confirmation, this will still create the user
          emailRedirectTo: window.location.origin + '/auth/callback',
        },
      });

      if (signupError) {
        console.error('Supabase signup error:', signupError);
        
        // Handle specific error cases with better messages
        if (signupError.message?.includes('already registered') || 
            signupError.message?.includes('already exists') ||
            signupError.message?.includes('User already registered') ||
            signupError.message?.includes('duplicate')) {
          // Clean up on duplicate error
          localStorage.removeItem('pending_signup');
          return { error: 'An account with this email already exists. Please sign in instead.' };
        }
        
        if (signupError.message?.includes('email') || signupError.message?.includes('Email')) {
          return { error: 'Invalid email address. Please check your email and try again.' };
        }
        
        if (signupError.message?.includes('password') || signupError.message?.includes('Password')) {
          return { error: 'Password does not meet requirements. Please try again.' };
        }
        
        // Handle 422 Unprocessable Content error (common for validation failures)
        if (signupError.status === 422) {
          return { error: 'Unable to create account. Please check your email and password, then try again.' };
        }
        
        // Handle network/connection errors
        if (signupError.message?.includes('fetch') || signupError.message?.includes('network') || signupError.message?.includes('Failed to fetch')) {
          return { error: 'Network error. Please check your connection and try again.' };
        }
        
        // Return user-friendly error message
        return { error: signupError.message || 'Failed to create account. Please try again.' };
      }

      // Check if user was created successfully
      // Note: If email confirmation is required, user.email_confirmed_at will be null
      // but the user is still created and can sign in after confirmation
      if (!data?.user) {
        return { error: 'Account creation failed. Please try again.' };
      }
      
      // If user was created but email confirmation is required, sign them in anyway
      // (since we already verified via OTP)
      if (!data.user.email_confirmed_at) {
        // Try to sign in with the credentials to confirm the account
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: signupData.email,
          password: signupData.password,
        });
        
        if (signInError) {
          console.warn('Auto sign-in after registration failed:', signInError);
          // This is OK - user can sign in manually
        }
      }

      // Clean up stored data
      localStorage.removeItem('pending_signup');
      
      // Also clear sessionStorage
      try {
        sessionStorage.removeItem('register-step');
        sessionStorage.removeItem('register-email');
        sessionStorage.removeItem('register-form-data');
      } catch (e) {
        // Ignore
      }

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