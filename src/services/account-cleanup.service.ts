import { supabase } from './supabase';

/**
 * Service to handle account cleanup for cancelled OAuth attempts
 */
export class AccountCleanupService {
  /**
   * Clean up incomplete OAuth accounts
   * This runs when users cancel OAuth or don't complete the flow
   */
  static async cleanupIncompleteAccounts() {
    try {
      console.log('🧹 Starting account cleanup...');
      
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.log('🧹 No session found, nothing to clean up');
        return;
      }

      const user = session.user;
      
      // Check if this is a fresh OAuth account with no activity
      const isIncompleteAccount = (
        // OAuth user (has provider metadata)
        user.app_metadata?.provider && 
        user.app_metadata?.provider !== 'email' &&
        // Account created very recently (within last 5 minutes)
        new Date(user.created_at).getTime() > Date.now() - (5 * 60 * 1000)
      );

      if (isIncompleteAccount) {
        console.log('🧹 Found incomplete OAuth account, cleaning up:', user.id);
        
        // Delete the user account
        const { error } = await supabase.auth.admin.deleteUser(user.id);
        
        if (error) {
          console.warn('⚠️ Failed to delete incomplete account:', error);
        } else {
          console.log('✅ Successfully cleaned up incomplete account');
        }
      }
    } catch (error) {
      console.warn('⚠️ Account cleanup failed:', error);
    }
  }

  /**
   * Handle OAuth cancellation cleanup
   * Call this when user explicitly cancels OAuth
   */
  static async handleOAuthCancellation() {
    try {
      console.log('🚫 Handling OAuth cancellation cleanup');
      
      // Sign out any partial session
      await supabase.auth.signOut();
      
      // Run cleanup for any orphaned accounts
      await this.cleanupIncompleteAccounts();
      
    } catch (error) {
      console.warn('⚠️ OAuth cancellation cleanup failed:', error);
    }
  }

  /**
   * Periodic cleanup of old incomplete accounts
   * Can be called on app initialization
   */
  static async periodicCleanup() {
    try {
      // This would require admin privileges, so we'll skip for now
      // In production, this should be a server-side cron job
      console.log('🧹 Periodic cleanup not implemented (requires admin privileges)');
    } catch (error) {
      console.warn('⚠️ Periodic cleanup failed:', error);
    }
  }
}

export default AccountCleanupService;