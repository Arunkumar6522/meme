-- Add Contributor Feature to Users Table
-- This allows users to become contributors by providing contact details

-- Add contributor fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_contributor BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS contributor_name TEXT,
ADD COLUMN IF NOT EXISTS contributor_email TEXT,
ADD COLUMN IF NOT EXISTS contributor_mobile TEXT,
ADD COLUMN IF NOT EXISTS contributor_since TIMESTAMPTZ;

-- Create index for faster contributor queries
CREATE INDEX IF NOT EXISTS idx_users_is_contributor ON public.users(is_contributor) WHERE is_contributor = true;

-- Update RLS policies to allow users to update their own contributor info
DROP POLICY IF EXISTS "Users can update own contributor info" ON public.users;

CREATE POLICY "Users can update own contributor info"
    ON public.users
    FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (
        id = auth.uid() AND
        -- Users can only update their own contributor fields, not admin fields
        (is_admin IS NOT DISTINCT FROM (SELECT is_admin FROM public.users WHERE id = auth.uid())) AND
        (is_super_admin IS NOT DISTINCT FROM (SELECT is_super_admin FROM public.users WHERE id = auth.uid()))
    );

-- Function to become a contributor
CREATE OR REPLACE FUNCTION public.become_contributor(
    p_name TEXT,
    p_email TEXT,
    p_mobile TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_result JSONB;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
    END IF;
    
    -- Validate inputs
    IF p_name IS NULL OR trim(p_name) = '' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Name is required');
    END IF;
    
    IF p_email IS NULL OR trim(p_email) = '' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Email is required');
    END IF;
    
    IF p_mobile IS NULL OR trim(p_mobile) = '' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Mobile number is required');
    END IF;
    
    -- Update user to contributor
    UPDATE public.users
    SET 
        is_contributor = true,
        contributor_name = trim(p_name),
        contributor_email = trim(p_email),
        contributor_mobile = trim(p_mobile),
        contributor_since = COALESCE(contributor_since, NOW())
    WHERE id = v_user_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'You are now a contributor!'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.become_contributor TO authenticated;

-- Function to get contributor stats (for admin dashboard)
CREATE OR REPLACE FUNCTION public.get_contributor_stats()
RETURNS TABLE (
    total_contributors BIGINT,
    new_this_month BIGINT,
    new_this_week BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) FILTER (WHERE is_contributor = true) as total_contributors,
        COUNT(*) FILTER (WHERE is_contributor = true AND contributor_since >= date_trunc('month', NOW())) as new_this_month,
        COUNT(*) FILTER (WHERE is_contributor = true AND contributor_since >= date_trunc('week', NOW())) as new_this_week
    FROM public.users;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_contributor_stats TO authenticated;
