-- Add Contributor Feature with ADMIN APPROVAL - FIXED VERSION
-- Drops existing functions first to avoid conflicts

-- Add contributor fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_contributor BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS contributor_status TEXT DEFAULT 'none' CHECK (contributor_status IN ('none', 'pending', 'active', 'rejected')),
ADD COLUMN IF NOT EXISTS contributor_name TEXT,
ADD COLUMN IF NOT EXISTS contributor_email TEXT,
ADD COLUMN IF NOT EXISTS contributor_mobile TEXT,
ADD COLUMN IF NOT EXISTS contributor_requested_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS contributor_approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS contributor_approved_by UUID REFERENCES public.users(id);

-- Create index for faster contributor queries
CREATE INDEX IF NOT EXISTS idx_users_contributor_status ON public.users(contributor_status) WHERE contributor_status != 'none';

-- Update RLS policies
DROP POLICY IF EXISTS "Users can update own contributor info" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

CREATE POLICY "Users can update own profile"
    ON public.users
    FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (
        id = auth.uid() AND
        (role IS NOT DISTINCT FROM (SELECT role FROM public.users WHERE id = auth.uid())) AND
        (is_contributor IS NOT DISTINCT FROM (SELECT is_contributor FROM public.users WHERE id = auth.uid())) AND
        (contributor_status IS NOT DISTINCT FROM (SELECT contributor_status FROM public.users WHERE id = auth.uid()))
    );

-- DROP OLD FUNCTIONS FIRST
DROP FUNCTION IF EXISTS public.become_contributor(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.request_contributor(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.approve_contributor(UUID, BOOLEAN);
DROP FUNCTION IF EXISTS public.get_pending_contributors();
DROP FUNCTION IF EXISTS public.get_contributor_stats();

-- Function to REQUEST contributor status (sets to PENDING)
CREATE FUNCTION public.request_contributor(
    p_name TEXT,
    p_email TEXT,
    p_mobile TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_current_status TEXT;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
    END IF;
    
    SELECT contributor_status INTO v_current_status
    FROM public.users
    WHERE id = v_user_id;
    
    IF v_current_status = 'active' THEN
        RETURN jsonb_build_object('success', false, 'error', 'You are already an active contributor');
    END IF;
    
    IF v_current_status = 'pending' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Your request is pending admin approval');
    END IF;
    
    IF p_name IS NULL OR trim(p_name) = '' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Name is required');
    END IF;
    
    IF p_email IS NULL OR trim(p_email) = '' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Email is required');
    END IF;
    
    IF p_mobile IS NULL OR trim(p_mobile) = '' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Mobile number is required');
    END IF;
    
    UPDATE public.users
    SET 
        contributor_status = 'pending',
        contributor_name = trim(p_name),
        contributor_email = trim(p_email),
        contributor_mobile = trim(p_mobile),
        contributor_requested_at = NOW()
    WHERE id = v_user_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Your contributor request has been submitted! Please wait for admin approval.'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.request_contributor TO authenticated;

-- Function to APPROVE contributor (admin only)
CREATE FUNCTION public.approve_contributor(
    p_user_id UUID,
    p_approve BOOLEAN DEFAULT true
)
RETURNS JSONB AS $$
DECLARE
    v_admin_id UUID;
    v_admin_role TEXT;
    v_new_status TEXT;
BEGIN
    v_admin_id := auth.uid();
    
    SELECT role INTO v_admin_role
    FROM public.users
    WHERE id = v_admin_id;
    
    IF v_admin_role NOT IN ('admin', 'superadmin') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Admin access required');
    END IF;
    
    v_new_status := CASE WHEN p_approve THEN 'active' ELSE 'rejected' END;
    
    UPDATE public.users
    SET 
        contributor_status = v_new_status,
        is_contributor = p_approve,
        contributor_approved_at = CASE WHEN p_approve THEN NOW() ELSE NULL END,
        contributor_approved_by = CASE WHEN p_approve THEN v_admin_id ELSE NULL END
    WHERE id = p_user_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', CASE 
            WHEN p_approve THEN 'Contributor approved successfully'
            ELSE 'Contributor request rejected'
        END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.approve_contributor TO authenticated;

-- Function to get pending contributor requests (admin only)
CREATE FUNCTION public.get_pending_contributors()
RETURNS TABLE (
    user_id UUID,
    email TEXT,
    contributor_name TEXT,
    contributor_email TEXT,
    contributor_mobile TEXT,
    requested_at TIMESTAMPTZ
) AS $$
DECLARE
    v_admin_role TEXT;
BEGIN
    SELECT role INTO v_admin_role
    FROM public.users
    WHERE id = auth.uid();
    
    IF v_admin_role NOT IN ('admin', 'superadmin') THEN
        RAISE EXCEPTION 'Admin access required';
    END IF;
    
    RETURN QUERY
    SELECT 
        u.id as user_id,
        u.email,
        u.contributor_name,
        u.contributor_email,
        u.contributor_mobile,
        u.contributor_requested_at as requested_at
    FROM public.users u
    WHERE u.contributor_status = 'pending'
    ORDER BY u.contributor_requested_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_pending_contributors TO authenticated;

-- Function to get contributor stats (for admin dashboard)
CREATE FUNCTION public.get_contributor_stats()
RETURNS TABLE (
    total_active BIGINT,
    total_pending BIGINT,
    new_this_month BIGINT,
    new_this_week BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) FILTER (WHERE contributor_status = 'active') as total_active,
        COUNT(*) FILTER (WHERE contributor_status = 'pending') as total_pending,
        COUNT(*) FILTER (WHERE contributor_status = 'active' AND contributor_approved_at >= date_trunc('month', NOW())) as new_this_month,
        COUNT(*) FILTER (WHERE contributor_status = 'active' AND contributor_approved_at >= date_trunc('week', NOW())) as new_this_week
    FROM public.users;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_contributor_stats TO authenticated;
