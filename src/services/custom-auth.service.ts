import { supabase } from './supabase';
import { OTPService } from './otp.service';

export class CustomAuthService {
  // Send password reset OTP (checks if user exists first)
  static async sendPasswordResetOTP(email: string): Promise<{ error: string | null }> {
    try {
      // Normalize email
      const normalizedEmail = email.trim().toLowerCase();
      
      // Validate email format (use shared validator)
      if (!OTPService.validateEmail(normalizedEmail)) {
        return { error: 'Invalid email address format' };
      }
      
      console.log(`📧 Sending password reset OTP to ${normalizedEmail}...`);

      // Server-side OTP generation + DB storage + email sending
      const result = await OTPService.requestOTP(normalizedEmail, 'password_reset');
      
      if (result.error) {
        console.error('❌ Failed to send password reset OTP:', result.error);
        return { error: result.error };
      }

      console.log(`✅ Password reset OTP sent successfully to ${normalizedEmail}`);

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
  static async updatePasswordWithEmail(email: string, code: string, newPassword: string): Promise<{ error: string | null }> {
    try {
      // Call Netlify function to update password securely
      const response = await fetch('/.netlify/functions/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code,
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
      
      // Validate email format (use shared validator)
      if (!OTPService.validateEmail(normalizedEmail)) {
        return { error: 'Invalid email address format' };
      }

      // Validate password
      if (!password || password.length < 6) {
        return { error: 'Password must be at least 6 characters' };
      }

      if (password.length > 128) {
        return { error: 'Password is too long (maximum 128 characters)' };
      }

      console.log(`📧 Sending signup OTP to ${normalizedEmail}...`);

      // Server-side OTP generation + DB storage + email sending
      const result = await OTPService.requestOTP(normalizedEmail, 'signup');
      
      if (result.error) {
        console.error('❌ Failed to send signup OTP:', result.error);
        return { error: result.error };
      }

      console.log(`✅ Signup OTP sent successfully to ${normalizedEmail}`);

      // SECURITY: Never store passwords in localStorage/sessionStorage.
      // The UI should keep the password only in memory for this flow.

      return { error: null };
    } catch (error) {
      console.error('💥 Exception in sendSignupOTP:', error);
      return { error: (error as Error).message };
    }
  }

  // Complete signup (server-side): verifies OTP and creates the user securely.
  static async completeSignupWithOTP(
    email: string,
    code: string,
    password: string,
    fullName?: string
  ): Promise<{ error: string | null }> {
    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (!OTPService.validateEmail(normalizedEmail)) {
        return { error: 'Invalid email address format' };
      }
      if (!/^\d{6}$/.test(code)) {
        return { error: 'Invalid verification code format' };
      }
      if (!password || password.length < 6 || password.length > 128) {
        return { error: 'Password must be between 6 and 128 characters' };
      }

      const response = await fetch('/.netlify/functions/complete-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          code,
          password,
          fullName: fullName?.trim() || undefined,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();
      const payload = contentType.includes('application/json') && text ? JSON.parse(text) : {};

      if (!response.ok) {
        const msg = payload?.error || payload?.message || 'Failed to create account';
        if (import.meta.env.MODE === 'development') {
          return { error: `${msg}. (Tip: run "netlify dev" so functions are available locally.)` };
        }
        return { error: msg };
      }

      return { error: null };
    } catch (e: any) {
      const msg = e?.message || 'Failed to create account';
      if (import.meta.env.MODE === 'development') {
        return { error: `${msg}. (Tip: run "netlify dev" so functions are available locally.)` };
      }
      return { error: msg };
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

      // SECURITY: Signup completion is now handled by server-side function `complete-signup`
      // to avoid storing passwords in localStorage/sessionStorage.
      return { error: 'Please complete signup from the registration screen.' };

    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  // Resend OTP
  static async resendOTP(email: string, type: 'signup' | 'password_reset'): Promise<{ error: string | null }> {
    try {
      if (type === 'signup') {
        // Server-side OTP generation + send
        return await OTPService.requestOTP(email, 'signup');
      } else {
        // For password reset, check if user exists and send new OTP
        return await this.sendPasswordResetOTP(email);
      }
    } catch (error) {
      return { error: (error as Error).message };
    }
  }
}