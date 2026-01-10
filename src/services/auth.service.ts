import { supabase } from './supabase';
import type { AuthUser } from '@/types';

export class AuthService {
  // Sign up with email and password (using custom OTP system)
  static async signUp(email: string, password: string, fullName?: string) {
    try {
      const { CustomAuthService } = await import('./custom-auth.service');
      const { error } = await CustomAuthService.sendSignupOTP(email, password, fullName);
      return { data: null, error };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Sign in with Google
  static async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Sign out
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  // Update password
  static async updatePassword(password: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  // Verify OTP code (using custom OTP system)
  static async verifyOTP(email: string, token: string, type: 'signup' | 'recovery') {
    try {
      const { CustomAuthService } = await import('./custom-auth.service');
      
      if (type === 'signup') {
        const { error } = await CustomAuthService.verifySignupOTP(email, token);
        return { data: null, error };
      } else {
        const { valid, error } = await CustomAuthService.verifyPasswordResetOTP(email, token);
        return { data: valid ? { user: null } : null, error };
      }
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Resend OTP code (using custom OTP system)
  static async resendOTP(email: string, type: 'signup' | 'recovery') {
    try {
      const { CustomAuthService } = await import('./custom-auth.service');
      const otpType = type === 'signup' ? 'signup' : 'password_reset';
      return await CustomAuthService.resendOTP(email, otpType);
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  // Reset password (using custom OTP system to avoid rate limits)
  static async resetPassword(email: string) {
    try {
      // Use our custom OTP service instead of Supabase's built-in reset
      const { CustomAuthService } = await import('./custom-auth.service');
      const result = await CustomAuthService.sendPasswordResetOTP(email);
      return result;
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  // Update password
  static async updatePassword(password: string) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user as AuthUser;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Get current session
  static async getCurrentSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error getting current session:', error);
      return null;
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user as AuthUser || null);
    });
  }
}