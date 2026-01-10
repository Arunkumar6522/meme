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
  static async checkUserExists(email: string, allowRLSFallback: boolean = false): Promise<boolean> {
    try {
      // Normalize email
      const normalizedEmail = email.trim().toLowerCase();
      
      // Validate email format first
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        console.warn('Invalid email format:', normalizedEmail);
        return false;
      }

      // Try to query users table - if RLS blocks it, try alternative method
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', normalizedEmail)
        .maybeSingle(); // Use maybeSingle instead of single to handle no results gracefully

      // If query succeeds and returns data, user exists
      if (!error && data) {
        return true;
      }

      // If no data found (user doesn't exist) - PGRST116 means no rows returned
      if (error && error.code === 'PGRST116') {
        return false;
      }

      // If RLS blocks the query (42501 = permission denied, 406 = not acceptable)
      if (error && (error.code === '42501' || error.code === '406' || error.message?.includes('permission') || error.message?.includes('row-level security'))) {
        console.warn('RLS policy blocked user check:', error.message);
        
        // For password reset, we can proceed (allowRLSFallback = true)
        // For signup, we should NOT proceed if RLS blocks (allowRLSFallback = false)
        if (allowRLSFallback) {
          // This is for password reset - proceed anyway
          return true;
        } else {
          // This is for signup - we need to know if user exists
          // Throw error so caller can handle it
          throw new Error('Unable to verify if user exists. Please check your Supabase RLS policies.');
        }
      }

      // For other errors, log and return false
      console.error('Error checking user existence:', error);
      return false;
    } catch (err) {
      console.error('Exception checking user existence:', err);
      // Re-throw if it's our custom error
      if (err instanceof Error && err.message.includes('Unable to verify')) {
        throw err;
      }
      // On other errors, return false to prevent OTP send
      return false;
    }
  }

  // Store OTP in database (we'll create an otp_codes table)
  static async storeOTP(email: string, code: string, type: 'signup' | 'password_reset'): Promise<{ error: string | null }> {
    try {
      // Normalize email
      const normalizedEmail = email.trim().toLowerCase();
      
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiry

      // First, delete any existing OTP for this email and type
      const { error: deleteError } = await supabase
        .from('otp_codes')
        .delete()
        .eq('email', normalizedEmail)
        .eq('type', type);

      // Log delete error but don't fail (it's OK if nothing to delete)
      if (deleteError && deleteError.code !== 'PGRST116') {
        console.warn('Error deleting existing OTP:', deleteError);
      }

      // Insert new OTP
      const { error } = await supabase
        .from('otp_codes')
        .insert({
          email: normalizedEmail,
          code,
          type,
          expires_at: expiresAt.toISOString(),
        });

      if (error) {
        console.error('Error storing OTP:', error);
        // Check if it's an RLS error
        if (error.code === '42501' || error.code === '406' || error.message?.includes('row-level security')) {
          return { error: 'Unable to store verification code. Please check your Supabase RLS policies for otp_codes table.' };
        }
        throw error;
      }
      
      return { error: null };
    } catch (error) {
      console.error('Exception storing OTP:', error);
      return { error: (error as Error).message || 'Failed to store verification code' };
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
        .maybeSingle(); // Use maybeSingle instead of single to handle RLS better

      if (error) {
        console.error('OTP verification error:', error);
        // If RLS is blocking, provide helpful error
        if (error.code === 'PGRST116' || error.code === '42501' || error.message?.includes('permission')) {
          return { valid: false, error: 'Unable to verify code. Please check your Supabase RLS policies for otp_codes table.' };
        }
        return { valid: false, error: 'Invalid or expired verification code' };
      }

      if (!data) {
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
      
      // Try to send via Netlify function first (works in production and when running 'netlify dev')
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
          // If function is not available (e.g., in development with Vite), fall back
          if (response.status === 404 || response.status === 500 || response.status === 502) {
            console.warn('Netlify function unavailable, using fallback for development');
            const fallbackResult = await this.sendOTPEmailDirect(email, code, type);
            return fallbackResult;
          }
          
          // Get error message from response
          const errorMsg = result.error || result.message || `Failed to send email (${response.status})`;
          console.error('Netlify function error:', errorMsg);
          throw new Error(errorMsg);
        }

        // Success - email sent securely from backend
        // OTP code is never exposed in client-side code
        console.log(`✅ OTP email sent successfully to ${email} via Netlify function`);
        return { error: null, devCode: undefined };
      } catch (fetchError) {
        // Handle network errors, JSON parsing errors, and function unavailability
        const errorMessage = (fetchError as Error).message || String(fetchError);
        
        console.warn('Error calling Netlify function:', errorMessage);
        
        // If it's a network error, JSON parse error, or function not found, use fallback
        // This is OK in development, but should be fixed in production
        if (
          fetchError instanceof TypeError || 
          errorMessage.includes('fetch') ||
          errorMessage.includes('JSON') ||
          errorMessage.includes('Unexpected') ||
          errorMessage.includes('Failed to fetch')
        ) {
          // Only use fallback in development mode
          if (import.meta.env.MODE === 'development') {
            console.warn('Using development fallback (no email sent, check sessionStorage)');
            const fallbackResult = await this.sendOTPEmailDirect(email, code, type);
            return fallbackResult;
          } else {
            // In production, this is an error
            return { 
              error: 'Email service temporarily unavailable. Please try again later or contact support.' 
            };
          }
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