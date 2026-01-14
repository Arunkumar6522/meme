import type { AuthUser } from '@/types';

/**
 * Utility functions for authentication
 */

/**
 * Check if user signed in with OAuth provider
 */
export const isOAuthUser = (user: AuthUser | null): boolean => {
  if (!user) return false;
  
  // Check if user has OAuth provider metadata
  const provider = user.app_metadata?.provider;
  return provider === 'google' || provider === 'github' || provider === 'facebook';
};

/**
 * Check if user signed in with Google specifically
 */
export const isGoogleUser = (user: AuthUser | null): boolean => {
  if (!user) return false;
  return user.app_metadata?.provider === 'google';
};

/**
 * Check if user signed in with email/password
 */
export const isEmailPasswordUser = (user: AuthUser | null): boolean => {
  if (!user) return false;
  return user.app_metadata?.provider === 'email' || !user.app_metadata?.provider;
};

/**
 * Get user's OAuth provider
 */
export const getUserProvider = (user: AuthUser | null): string | null => {
  if (!user) return null;
  return user.app_metadata?.provider || 'email';
};

/**
 * Get user's display name (prioritizes full_name from metadata)
 */
export const getUserDisplayName = (user: AuthUser | null): string => {
  if (!user) return '';
  
  // For OAuth users, try to get name from metadata
  if (isOAuthUser(user)) {
    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           user.email?.split('@')[0] || 
           'User';
  }
  
  // For email users, use email prefix
  return user.email?.split('@')[0] || 'User';
};

/**
 * Get user's avatar URL (for OAuth users)
 */
export const getUserAvatarUrl = (user: AuthUser | null): string | null => {
  if (!user || !isOAuthUser(user)) return null;
  
  return user.user_metadata?.avatar_url || 
         user.user_metadata?.picture || 
         null;
};