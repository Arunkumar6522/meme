-- DIAGNOSTIC: Check Users Table Structure
-- Run this FIRST to see what columns exist in your users table

SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'users'
ORDER BY ordinal_position;

-- Also check your current user's admin status
SELECT 
    id,
    email,
    role,
    is_admin,
    is_super_admin,
    is_premium,
    is_contributor
FROM public.users
WHERE id = auth.uid();
