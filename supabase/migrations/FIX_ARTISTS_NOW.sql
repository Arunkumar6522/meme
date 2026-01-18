-- ARTISTS TABLE RLS FIX - SIMPLE VERSION
-- Copy and paste this ENTIRE script into Supabase SQL Editor and click RUN

-- Step 1: Disable RLS temporarily
ALTER TABLE public.artists DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies (if any)
DROP POLICY IF EXISTS "Everyone can read artists" ON public.artists;
DROP POLICY IF EXISTS "Authenticated users can read artists" ON public.artists;
DROP POLICY IF EXISTS "Anonymous users can read artists" ON public.artists;
DROP POLICY IF EXISTS "Admins can insert artists" ON public.artists;
DROP POLICY IF EXISTS "Admins can update artists" ON public.artists;
DROP POLICY IF EXISTS "Admins can delete artists" ON public.artists;
DROP POLICY IF EXISTS "Users can insert artists" ON public.artists;
DROP POLICY IF EXISTS "Users can update artists" ON public.artists;
DROP POLICY IF EXISTS "Users can delete artists" ON public.artists;

-- Step 3: Create new policies
-- SELECT: Everyone can read (public access)
CREATE POLICY "artists_select_policy"
ON public.artists
FOR SELECT
TO public
USING (true);

-- INSERT: Only authenticated admins
CREATE POLICY "artists_insert_policy"
ON public.artists
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND (users.is_admin = true OR users.is_super_admin = true)
    )
);

-- UPDATE: Only authenticated admins
CREATE POLICY "artists_update_policy"
ON public.artists
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND (users.is_admin = true OR users.is_super_admin = true)
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND (users.is_admin = true OR users.is_super_admin = true)
    )
);

-- DELETE: Only authenticated admins
CREATE POLICY "artists_delete_policy"
ON public.artists
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND (users.is_admin = true OR users.is_super_admin = true)
    )
);

-- Step 4: Re-enable RLS
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;

-- Step 5: Verify (this should return 4 policies)
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'artists'
ORDER BY policyname;
