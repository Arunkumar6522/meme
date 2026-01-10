import { supabase } from './supabase';
import { OTPService } from './otp.service';

export class CustomAuthService {
  // Send password reset OTP (checks if user exists first)
  static async sendPasswordResetOTP(email: string): Promise<{ error: string | null }> {
    try {
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
        return { error: result.error };
      }

      // In development, store the code for testing (never expose in production)
      if (import.meta.env.MODE === 'development' && result.devCode) {
        try {
          sessionStorage.setItem(`dev_otp_${email}`, result.devCode);
        } catch (e) {
          // Ignore if sessionStorage unavailable
        }
      }

      return { error: null };
    } catch (error) {
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
  static async updatePasswordWithEmail(email: string, newPassword: string): Promise<{ error: string | null }> {
    try {
      // Get user by email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        return { error: 'User not found' };
      }

      // Get current user's password hash to compare (if possible)
      // Note: Supabase doesn't expose password hashes for security
      // So we'll skip the "not same as old password" check for now
      // and implement it differently

      // Update password using Supabase admin API
      const { error } = await supabase.auth.admin.updateUserById(userData.id, {
        password: newPassword,
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
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

      // Store signup data temporarily (we'll need a temp table for this)
      // For now, we'll use localStorage or a different approach
      
      // Generate OTP code
      const otpCode = OTPService.generateOTPCode();

      // Send OTP email
      const { error } = await OTPService.sendOTPEmail(email, otpCode, 'signup');
      
      if (error) {
        return { error };
      }

      // Store signup data in localStorage temporarily
      const signupData = {
        email,
        password,
        fullName,
        timestamp: Date.now(),
      };
      localStorage.setItem('pending_signup', JSON.stringify(signupData));

      return { error: null };
    } catch (error) {
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