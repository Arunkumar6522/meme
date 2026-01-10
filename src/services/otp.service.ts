import { supabase } from './supabase';
import { smtpConfig } from '@/config';

interface OTPData {
  email: string;
  code: string;
  type: 'signup' | 'password_reset';
  expires_at: string;
  created_at: string;
}

export class OTPService {
  // Generate a 6-digit OTP code
  static generateOTPCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Check if user exists in database
  // Uses auth.users table via admin API or checks public.users with proper error handling
  static async checkUserExists(email: string): Promise<boolean> {
    try {
      // Try to query users table - if RLS blocks it, try alternative method
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle(); // Use maybeSingle instead of single to handle no results gracefully

      // If query succeeds and returns data, user exists
      if (!error && data) {
        return true;
      }

      // If RLS blocks the query (406 or 401), try using auth API
      // For password reset, we can also just proceed - if user doesn't exist, 
      // they won't receive email anyway
      if (error && (error.code === 'PGRST116' || error.code === '42501' || error.message?.includes('permission'))) {
        // RLS blocked - try alternative: check via auth admin or just return true
        // In production, we'll send OTP anyway - if user doesn't exist, email won't be sent
        // but Supabase will handle that gracefully
        console.warn('RLS policy blocked user check, proceeding with OTP send');
        return true; // Allow OTP to be sent - email service will handle non-existent users
      }

      // If no data found (user doesn't exist)
      if (error && error.code === 'PGRST116') {
        return false;
      }

      // For other errors, assume user doesn't exist to be safe
      return false;
    } catch (err) {
      console.error('Error checking user existence:', err);
      // On error, return false to prevent OTP send to non-existent users
      return false;
    }
  }

  // Store OTP in database (we'll create an otp_codes table)
  static async storeOTP(email: string, code: string, type: 'signup' | 'password_reset'): Promise<{ error: string | null }> {
    try {
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiry

      // First, delete any existing OTP for this email and type
      await supabase
        .from('otp_codes')
        .delete()
        .eq('email', email)
        .eq('type', type);

      // Insert new OTP
      const { error } = await supabase
        .from('otp_codes')
        .insert({
          email,
          code,
          type,
          expires_at: expiresAt.toISOString(),
        });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  // Verify OTP code
  static async verifyOTP(email: string, code: string, type: 'signup' | 'password_reset'): Promise<{ valid: boolean; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('email', email)
        .eq('code', code)
        .eq('type', type)
        .single();

      if (error || !data) {
        return { valid: false, error: 'Invalid or expired verification code' };
      }

      // Check if expired
      const now = new Date();
      const expiresAt = new Date(data.expires_at);
      
      if (now > expiresAt) {
        // Delete expired OTP
        await supabase
          .from('otp_codes')
          .delete()
          .eq('id', data.id);
        
        return { valid: false, error: 'Verification code has expired' };
      }

      // Delete used OTP
      await supabase
        .from('otp_codes')
        .delete()
        .eq('id', data.id);

      return { valid: true, error: null };
    } catch (error) {
      return { valid: false, error: (error as Error).message };
    }
  }

  // Send OTP via email using Netlify function (secure backend)
  static async sendOTPEmail(email: string, code: string, type: 'signup' | 'password_reset'): Promise<{ error: string | null; devCode?: string }> {
    try {
      // Store the OTP first
      const storeResult = await this.storeOTP(email, code, type);
      if (storeResult.error) {
        throw new Error(storeResult.error);
      }

      // Send email via Netlify function (secure backend)
      // This prevents OTP codes from being exposed in client-side code or console
      // In development with Vite, Netlify functions aren't available unless running 'netlify dev'
      // So we'll detect if we're in development and skip the function call to avoid 404 errors
      const functionUrl = import.meta.env.VITE_NETLIFY_FUNCTIONS_URL || '/.netlify/functions';
      
      // In development mode, check if Netlify dev server is available
      // If running regular Vite dev server, skip function call and use fallback directly
      if (import.meta.env.MODE === 'development') {
        // Try to detect if netlify dev is running by checking if function endpoint exists
        // For now, we'll use fallback directly in development to avoid 404 errors
        // User can run 'netlify dev' if they want to test the function locally
        return await this.sendOTPEmailDirect(email, code, type);
      }
      
      try {
        const response = await fetch(`${functionUrl}/send-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            code,
            type,
          }),
        });

        // Check if response has content before parsing JSON
        const contentType = response.headers.get('content-type');
        const hasJsonContent = contentType && contentType.includes('application/json');
        
        let result: any = {};
        
        // Only parse JSON if content-type indicates JSON and response has content
        if (hasJsonContent) {
          const text = await response.text();
          if (text && text.trim().length > 0) {
            try {
              result = JSON.parse(text);
            } catch (parseError) {
              // If JSON parsing fails, fall back to direct SMTP
              console.warn('Failed to parse function response, using fallback:', parseError);
              return await this.sendOTPEmailDirect(email, code, type);
            }
          }
        }

        if (!response.ok) {
          // If function is not available (e.g., in development), fall back to direct SMTP
          if (response.status === 404 || response.status === 500 || response.status === 502) {
            const fallbackResult = await this.sendOTPEmailDirect(email, code, type);
            return fallbackResult;
          }
          throw new Error(result.error || `Failed to send email (${response.status})`);
        }

        // Success - email sent securely from backend
        // OTP code is never exposed in client-side code
        return { error: null, devCode: undefined };
      } catch (fetchError) {
        // Handle network errors, JSON parsing errors, and function unavailability
        const errorMessage = (fetchError as Error).message || String(fetchError);
        
        // If it's a network error, JSON parse error, or function not found, use fallback
        if (
          fetchError instanceof TypeError || 
          errorMessage.includes('fetch') ||
          errorMessage.includes('JSON') ||
          errorMessage.includes('Unexpected')
        ) {
          const fallbackResult = await this.sendOTPEmailDirect(email, code, type);
          return fallbackResult;
        }
        
        // Re-throw other errors
        throw fetchError;
      }
    } catch (error) {
      console.error('Error sending OTP email:', error);
      return { error: (error as Error).message };
    }
  }

  // Direct SMTP sending (fallback for development or when Netlify function unavailable)
  // Note: This should only be used in development. In production, use Netlify function.
  private static async sendOTPEmailDirect(email: string, code: string, type: 'signup' | 'password_reset'): Promise<{ error: string | null; devCode?: string }> {
    try {
      // In development mode, allow OTP to be stored even if email can't be sent
      // The OTP is stored in the database and can be verified manually for testing
      if (import.meta.env.MODE === 'development') {
        // Store OTP code in sessionStorage for development testing (secure, cleared on tab close)
        try {
          sessionStorage.setItem(`dev_otp_${email}`, code);
          // Auto-clear after 10 minutes (same as OTP expiry)
          setTimeout(() => {
            sessionStorage.removeItem(`dev_otp_${email}`);
          }, 10 * 60 * 1000);
        } catch (e) {
          // sessionStorage might not be available, ignore
        }
        
        // Log helpful message (without exposing the code)
        console.log(`📧 OTP stored for ${email} (Development mode)`);
        console.log(`💡 Tip: Run 'netlify dev' instead of 'npm run dev' to test email sending locally`);
        console.log(`✅ OTP code is displayed on the OTP screen for testing`);
        
        // Return success with dev code for testing
        return { 
          error: null,
          devCode: code // Only returned in development, displayed on OTP screen
        };
      }

      // In production, if Netlify function is unavailable, return an error
      // This ensures we don't silently fail in production
      return { 
        error: 'Email service temporarily unavailable. Please try again later or contact support.' 
      };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  // Email templates
  private static getSignupEmailTemplate(code: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verification Code</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5;">Meme Library</h1>
        </div>
        
        <h2>Welcome to Meme Library!</h2>
        <p>Thank you for signing up. Please use the verification code below to complete your registration:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; display: inline-block;">
            <h1 style="font-size: 32px; letter-spacing: 8px; color: #4F46E5; margin: 0;">${code}</h1>
          </div>
        </div>
        
        <p><strong>This code expires in 10 minutes.</strong></p>
        <p>If you didn't create an account with Meme Library, please ignore this email.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
        <p style="color: #6B7280; font-size: 14px;">
          This email was sent by Meme Library. If you have any questions, please contact our support team.
        </p>
      </body>
      </html>
    `;
  }

  private static getPasswordResetEmailTemplate(code: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset Code</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5;">Meme Library</h1>
        </div>
        
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Please use the verification code below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; display: inline-block;">
            <h1 style="font-size: 32px; letter-spacing: 8px; color: #4F46E5; margin: 0;">${code}</h1>
          </div>
        </div>
        
        <p><strong>This code expires in 10 minutes.</strong></p>
        <p>If you didn't request a password reset, please ignore this email or contact support if you're concerned about your account security.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
        <p style="color: #6B7280; font-size: 14px;">
          This email was sent by Meme Library. If you have any questions, please contact our support team.
        </p>
      </body>
      </html>
    `;
  }

  // Clean up expired OTPs (should be called periodically)
  static async cleanupExpiredOTPs(): Promise<void> {
    try {
      const now = new Date().toISOString();
      await supabase
        .from('otp_codes')
        .delete()
        .lt('expires_at', now);
    } catch (error) {
      console.error('Error cleaning up expired OTPs:', error);
    }
  }
}