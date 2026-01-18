-- Fix Artists Table RLS Policy (Compatible with all PostgreSQL versions)

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can read artists" ON public.artists;
DROP POLICY IF EXISTS "Anonymous users can read artists" ON public.artists;

-- Create policies for reading artists
CREATE POLICY "Authenticated users can read artists"
    ON public.artists
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Anonymous users can read artists"
    ON public.artists
    FOR SELECT
    TO anon
    USING (true);
