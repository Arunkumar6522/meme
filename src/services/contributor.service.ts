import { DatabaseService } from './database.service';

export interface ContributorData {
    name: string;
    email: string;
    mobile: string;
}

export interface PendingContributor {
    user_id: string;
    email: string;
    contributor_name: string;
    contributor_email: string;
    contributor_mobile: string;
    requested_at: string;
}

export class ContributorService {
    /**
     * Request to become a contributor (sets status to PENDING)
     */
    static async requestContributor(data: ContributorData): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const { data: result, error } = await DatabaseService.supabase
                .rpc('request_contributor', {
                    p_name: data.name,
                    p_email: data.email,
                    p_mobile: data.mobile,
                });

            if (error) {
                console.error('Error requesting contributor status:', error);
                return { success: false, error: error.message };
            }

            return result as { success: boolean; message?: string; error?: string };
        } catch (error) {
            console.error('Error in requestContributor:', error);
            return { success: false, error: 'Failed to submit contributor request' };
        }
    }

    /**
     * Approve or reject a contributor request (admin only)
     */
    static async approveContributor(userId: string, approve: boolean = true): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const { data: result, error } = await DatabaseService.supabase
                .rpc('approve_contributor', {
                    p_user_id: userId,
                    p_approve: approve,
                });

            if (error) {
                console.error('Error approving contributor:', error);
                return { success: false, error: error.message };
            }

            return result as { success: boolean; message?: string; error?: string };
        } catch (error) {
            console.error('Error in approveContributor:', error);
            return { success: false, error: 'Failed to approve contributor' };
        }
    }

    /**
     * Get pending contributor requests (admin only)
     */
    static async getPendingContributors(): Promise<PendingContributor[]> {
        try {
            const { data, error } = await DatabaseService.supabase
                .rpc('get_pending_contributors');

            if (error) {
                console.error('Error getting pending contributors:', error);
                return [];
            }

            return data || [];
        } catch (error) {
            console.error('Error in getPendingContributors:', error);
            return [];
        }
    }

    /**
     * Check contributor status
     */
    static async getContributorStatus(userId: string): Promise<'none' | 'pending' | 'active' | 'rejected' | null> {
        try {
            const { data, error } = await DatabaseService.supabase
                .from('users')
                .select('contributor_status')
                .eq('id', userId)
                .single();

            if (error || !data) {
                return null;
            }

            return data.contributor_status || 'none';
        } catch (error) {
            console.error('Error checking contributor status:', error);
            return null;
        }
    }

    /**
     * Get contributor stats (admin only)
     */
    static async getContributorStats(): Promise<{
        total_active: number;
        total_pending: number;
        new_this_month: number;
        new_this_week: number;
    } | null> {
        try {
            const { data, error } = await DatabaseService.supabase
                .rpc('get_contributor_stats')
                .single();

            if (error) {
                console.error('Error getting contributor stats:', error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Error in getContributorStats:', error);
            return null;
        }
    }
}
