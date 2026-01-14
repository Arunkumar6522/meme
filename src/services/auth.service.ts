import { supabase } from './supabase';
import { oauthConfig } from '@/config';
import type { AuthUser } from '@/types';

export class AuthService {
  private static isInvalidRefreshTokenError(err: any): boolean {
    const msg = String(err?.message || '');
    return (
      msg.includes('Invalid Refresh Token') ||
      msg.includes('Refresh Token Not Found') ||
      msg.includes('refresh_token')
    );
  }

  static async clearLocalSession(): Promise<void> {
    try {
      // Prefer local-only signOut (no network)
      // @ts-expect-error - supabase-js supports scope in signOut options
      await supabase.auth.signOut({ scope: 'local' });
    } catch {
      // ignore
    }

    // Extra safety: remove supabase auth tokens from storage
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        // Supabase v2 storage keys often look like: sb-<ref>-auth-token
        if (key.startsWith('sb-') && key.includes('-auth-token')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore
    }
  }
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
      // Check if Google SSO is enabled
      if (!oauthConfig.google.enabled) {
        throw new Error('Google Sign-in is not enabled');
      }

      // Determine the correct redirect URL based on environment
      const getRedirectUrl = () => {
        const origin = window.location.origin;
        
        // For production domain
        if (origin.includes('ilovememe.in')) {
          return `${origin}/auth/callback`;
        }
        
        // For Netlify preview/deploy
        if (origin.includes('netlify.app')) {
          return `${origin}/auth/callback`;
        }
        
        // For local development
        if (origin.includes('localhost')) {
          return `${origin}/auth/callback`;
        }
        
        // Fallback
        return `${origin}/auth/callback`;
      };

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getRedirectUrl(),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      // Set up detection for window close/cancellation
      if (data?.url) {
        console.log('🔗 OAuth URL generated, setting up cancellation detection');
        
        // Listen for page visibility changes (user might close tab/window)
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            // User came back to the page - check if they completed OAuth
            setTimeout(() => {
              const { data: { session } } = supabase.auth.getSession();
              if (!session) {
                console.log('🚫 User returned without completing OAuth');
                // Could trigger cleanup here if needed
              }
            }, 1000);
          }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Clean up listener after 5 minutes
        setTimeout(() => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        }, 5 * 60 * 1000);
      }

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
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        // Common in production after tokens are invalidated/rotated: clear and continue cleanly
        if (this.isInvalidRefreshTokenError(error)) {
          await this.clearLocalSession();
          return null;
        }
        throw error;
      }
      return data.session;
    } catch (error) {
      console.error('Error getting current session:', error);
      if (this.isInvalidRefreshTokenError(error)) {
        await this.clearLocalSession();
        return null;
      }
      return null;
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (event: string, user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, (session?.user as AuthUser) || null);
    });
  }
}