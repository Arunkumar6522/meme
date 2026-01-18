-- CONTRIBUTOR APPROVAL - STEP BY STEP VERSION
-- Run this entire script in one go

-- STEP 1: Add columns to users table
DO $$ 
BEGIN
    -- Add is_contributor if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'is_contributor'
    ) THEN
        ALTER TABLE public.users ADD COLUMN is_contributor BOOLEAN DEFAULT false;
    END IF;

    -- Add contributor_status if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'contributor_status'
    ) THEN
        ALTER TABLE public.users ADD COLUMN contributor_status TEXT DEFAULT 'none';
    END IF;

    -- Add contributor_name if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'contributor_name'
    ) THEN
        ALTER TABLE public.users ADD COLUMN contributor_name TEXT;
    END IF;

    -- Add contributor_email if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'contributor_email'
    ) THEN
        ALTER TABLE public.users ADD COLUMN contributor_email TEXT;
    END IF;

    -- Add contributor_mobile if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'contributor_mobile'
    ) THEN
        ALTER TABLE public.users ADD COLUMN contributor_mobile TEXT;
    END IF;

    -- Add contributor_requested_at if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'contributor_requested_at'
    ) THEN
        ALTER TABLE public.users ADD COLUMN contributor_requested_at TIMESTAMPTZ;
    END IF;

    -- Add contributor_approved_at if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'contributor_approved_at'
    ) THEN
        ALTER TABLE public.users ADD COLUMN contributor_approved_at TIMESTAMPTZ;
    END IF;

    -- Add contributor_approved_by if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'contributor_approved_by'
    ) THEN
        ALTER TABLE public.users ADD COLUMN contributor_approved_by UUID REFERENCES public.users(id);
    END IF;
END $$;

-- STEP 2: Add constraint to contributor_status
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'users_contributor_status_check'
    ) THEN
        ALTER TABLE public.users 
        ADD CONSTRAINT users_contributor_status_check 
        CHECK (contributor_status IN ('none', 'pending', 'active', 'rejected'));
    END IF;
END $$;

-- STEP 3: Create index
CREATE INDEX IF NOT EXISTS idx_users_contributor_status 
ON public.users(contributor_status) 
WHERE contributor_status != 'none';

-- STEP 4: Drop old policies
DROP POLICY IF EXISTS "Users can update own contributor info" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- STEP 5: Create new policy
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

-- STEP 6: Drop old functions
DROP FUNCTION IF EXISTS public.become_contributor(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.request_contributor(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.approve_contributor(UUID, BOOLEAN);
DROP FUNCTION IF EXISTS public.get_pending_contributors();
DROP FUNCTION IF EXISTS public.get_contributor_stats();

-- STEP 7: Create request_contributor function
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

-- STEP 8: Create approve_contributor function
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

-- STEP 9: Create get_pending_contributors function
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

-- STEP 10: Create get_contributor_stats function
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

-- STEP 11: Verify columns were created
SELECT 
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'users' 
  AND column_name LIKE 'contributor%'
ORDER BY column_name;
