import { DatabaseService } from './database.service';

export interface ContributorData {
    name: string;
    email: string;
    mobile: string;
}

export class ContributorService {
    /**
     * Register current user as a contributor
     */
    static async becomeContributor(data: ContributorData): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const { data: result, error } = await DatabaseService.supabase
                .rpc('become_contributor', {
                    p_name: data.name,
                    p_email: data.email,
                    p_mobile: data.mobile,
                });

            if (error) {
                console.error('Error becoming contributor:', error);
                return { success: false, error: error.message };
            }

            return result as { success: boolean; message?: string; error?: string };
        } catch (error) {
            console.error('Error in becomeContributor:', error);
            return { success: false, error: 'Failed to register as contributor' };
        }
    }

    /**
     * Check if current user is a contributor
     */
    static async isContributor(userId: string): Promise<boolean> {
        try {
            const { data, error } = await DatabaseService.supabase
                .from('users')
                .select('is_contributor')
                .eq('id', userId)
                .single();

            if (error || !data) {
                return false;
            }

            return data.is_contributor || false;
        } catch (error) {
            console.error('Error checking contributor status:', error);
            return false;
        }
    }

    /**
     * Get contributor stats (admin only)
     */
    static async getContributorStats(): Promise<{
        total_contributors: number;
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
