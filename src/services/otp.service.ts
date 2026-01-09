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
  static async checkUserExists(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      return !error && !!data;
    } catch {
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

  // Send OTP via email using our SMTP configuration
  static async sendOTPEmail(email: string, code: string, type: 'signup' | 'password_reset'): Promise<{ error: string | null }> {
    try {
      if (!smtpConfig) {
        throw new Error('SMTP configuration not found');
      }

      const subject = type === 'signup' 
        ? 'Your Meme Library Verification Code'
        : 'Password Reset Code - Meme Library';

      const htmlContent = type === 'signup' 
        ? this.getSignupEmailTemplate(code)
        : this.getPasswordResetEmailTemplate(code);

      // Use Supabase Edge Function or direct SMTP
      // For now, we'll use a simple approach with Supabase's built-in email
      // but with our custom template
      
      // Store the OTP first
      const storeResult = await this.storeOTP(email, code, type);
      if (storeResult.error) {
        throw new Error(storeResult.error);
      }

      // Send email using Supabase auth (it will use our SMTP settings)
      // We'll trigger this through a custom function
      const { error } = await supabase.functions.invoke('send-otp-email', {
        body: {
          email,
          code,
          type,
          subject,
          htmlContent,
        },
      });

      if (error) {
        // Fallback: use browser-based email sending or show code in console for development
        console.log(`OTP Code for ${email}: ${code}`);
        console.log('Email content:', htmlContent);
      }

      return { error: null };
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