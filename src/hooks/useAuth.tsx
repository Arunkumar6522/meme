import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '@/services/auth.service';
import type { AuthUser, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
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
        const user = await AuthService.getCurrentUser();
        setState(prev => ({ ...prev, user, loading: false }));
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
    const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
      setState(prev => ({ ...prev, user, loading: false, error: null }));
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const { error } = await AuthService.signIn(email, password);
    setState(prev => ({ ...prev, loading: false, error }));
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const { error } = await AuthService.signUp(email, password, fullName);
    setState(prev => ({ ...prev, loading: false, error }));
    return { error };
  };

  const signInWithGoogle = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const { error } = await AuthService.signInWithGoogle();
    setState(prev => ({ ...prev, loading: false, error }));
    return { error };
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const { error } = await AuthService.signOut();
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

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
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