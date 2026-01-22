import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '@/services/auth.service';
import { clearAdminCache } from '@/components/navigation/Header';
import type { AuthUser, AuthState } from '@/types';
import analytics from '@/utils/mixpanel';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  verifyOTP: (email: string, token: string, type: 'signup' | 'reset-password') => Promise<{ error: string | null }>;
  resendOTP: (email: string, type: 'signup' | 'reset-password') => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        // If a stale refresh token exists in storage, Supabase may throw 400s on boot.
        // We proactively try to read the session, and if it's invalid we clear it.
        const session = await AuthService.getCurrentSession();
        const user = session?.user ? (session.user as AuthUser) : await AuthService.getCurrentUser();

        // Identify user in Mixpanel if logged in
        if (user) {
          analytics.identify(user.id);
          analytics.setUserProperties({
            $email: user.email,
            $name: user.user_metadata?.full_name || user.email?.split('@')[0],
            is_premium: (user.user_metadata as any)?.is_premium || false,
          });
        }

        setState(prev => ({ ...prev, user, loading: false, error: null }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: (error as Error).message,
          loading: false
        }));
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange((event, user) => {
      // If refresh token is invalid/corrupt, clean it and force signed-out state
      if (event === 'TOKEN_REFRESH_FAILED') {
        AuthService.clearLocalSession().finally(() => {
          setState(prev => ({ ...prev, user: null, loading: false, error: null }));
        });
        return;
      }
      setState(prev => ({ ...prev, user, loading: false, error: null }));
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const { error } = await AuthService.signIn(email, password);

    // Track sign in event
    if (!error) {
      const user = await AuthService.getCurrentUser();
      if (user) {
        analytics.identify(user.id);
        analytics.track('Sign In', {
          user_id: user.id,
          login_method: 'email',
          success: true,
        });
      }
    } else {
      analytics.track('Sign In', {
        login_method: 'email',
        success: false,
      });
    }

    setState(prev => ({ ...prev, loading: false, error }));
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const { error } = await AuthService.signUp(email, password, fullName);

    // Track sign up event
    if (!error) {
      analytics.track('Sign Up', {
        email: email,
        signup_method: 'email',
      });
    }

    setState(prev => ({ ...prev, loading: false, error }));
    return { error };
  };

  const signInWithGoogle = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const { error } = await AuthService.signInWithGoogle();

    // Track Google sign in
    if (!error) {
      analytics.track('Sign In', {
        login_method: 'google',
        success: true,
      });
    }

    setState(prev => ({ ...prev, loading: false, error }));
    return { error };
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    // Clear all local storage and session storage
    try {
      // Clear localStorage
      localStorage.clear();

      // Clear sessionStorage (but keep it selective to avoid clearing other tabs' data)
      // Clear auth-related sessionStorage items
      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (
          key.startsWith('register-') ||
          key.startsWith('forgot-password-') ||
          key.startsWith('login-') ||
          key.startsWith('pending_')
        )) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
    } catch (e) {
      console.warn('Error clearing storage:', e);
    }

    // Sign out from Supabase
    const { error } = await AuthService.signOut();

    // Clear admin cache
    clearAdminCache();

    // Reset Mixpanel identity
    analytics.reset();

    setState(prev => ({ ...prev, user: null, loading: false, error }));
    return { error };
  };

  const resetPassword = async (email: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const { error } = await AuthService.resetPassword(email);
    setState(prev => ({ ...prev, loading: false, error }));
    return { error };
  };

  const updatePassword = async (password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const { error } = await AuthService.updatePassword(password);
    setState(prev => ({ ...prev, loading: false, error }));
    return { error };
  };

  const verifyOTP = async (email: string, token: string, type: 'signup' | 'reset-password') => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const otpType = type === 'signup' ? 'signup' : 'recovery';
    const { error } = await AuthService.verifyOTP(email, token, otpType);
    setState(prev => ({ ...prev, loading: false, error }));
    return { error };
  };

  const resendOTP = async (email: string, type: 'signup' | 'reset-password') => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const otpType = type === 'signup' ? 'signup' : 'recovery';
    const { error } = await AuthService.resendOTP(email, otpType);
    setState(prev => ({ ...prev, loading: false, error }));
    return { error };
  };

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    verifyOTP,
    resendOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};