-- Add image support to media_type enum
-- First, add the new value to the enum type
DO $$ 
BEGIN
    -- Check if 'image' doesn't already exist in the enum
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'image' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'media_type')
    ) THEN
        ALTER TYPE media_type ADD VALUE 'image';
    END IF;
END $$;

-- Create search_analytics table to track user searches
CREATE TABLE IF NOT EXISTS public.search_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    search_query TEXT NOT NULL,
    filters JSONB DEFAULT '{}'::jsonb,
    results_count INTEGER DEFAULT 0,
    media_type TEXT,
    emotion TEXT,
    languages TEXT[],
    searched_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_search_analytics_user_id ON public.search_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_search_analytics_searched_at ON public.search_analytics(searched_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_analytics_results_count ON public.search_analytics(results_count);
CREATE INDEX IF NOT EXISTS idx_search_analytics_query ON public.search_analytics USING gin(to_tsvector('english', search_query));

-- Enable RLS
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert their own searches
CREATE POLICY "Users can insert their own searches"
    ON public.search_analytics
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all searches
CREATE POLICY "Admins can view all searches"
    ON public.search_analytics
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND (users.is_admin = true OR users.is_super_admin = true)
        )
    );

-- Policy: Admins can delete searches
CREATE POLICY "Admins can delete searches"
    ON public.search_analytics
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND (users.is_admin = true OR users.is_super_admin = true)
        )
    );

-- Function to log search
CREATE OR REPLACE FUNCTION public.log_search(
    p_user_id UUID,
    p_search_query TEXT,
    p_filters JSONB,
    p_results_count INTEGER
)
RETURNS UUID AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO public.search_analytics (
        user_id,
        search_query,
        filters,
        results_count,
        media_type,
        emotion,
        languages
    ) VALUES (
        p_user_id,
        p_search_query,
        p_filters,
        p_results_count,
        (p_filters->>'media_type')::TEXT,
        (p_filters->>'emotion')::TEXT,
        CASE 
            WHEN p_filters->'languages' IS NOT NULL 
            THEN ARRAY(SELECT jsonb_array_elements_text(p_filters->'languages'))
            ELSE NULL
        END
    )
    RETURNING id INTO v_id;
    
    RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.log_search TO authenticated, anon;

-- Function to get search analytics for admin
CREATE OR REPLACE FUNCTION public.get_search_analytics(
    p_limit INTEGER DEFAULT 100,
    p_offset INTEGER DEFAULT 0,
    p_zero_results_only BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    user_email TEXT,
    search_query TEXT,
    filters JSONB,
    results_count INTEGER,
    media_type TEXT,
    emotion TEXT,
    languages TEXT[],
    searched_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sa.id,
        sa.user_id,
        u.email as user_email,
        sa.search_query,
        sa.filters,
        sa.results_count,
        sa.media_type,
        sa.emotion,
        sa.languages,
        sa.searched_at
    FROM public.search_analytics sa
    LEFT JOIN auth.users u ON sa.user_id = u.id
    WHERE 
        CASE 
            WHEN p_zero_results_only THEN sa.results_count = 0
            ELSE TRUE
        END
    ORDER BY sa.searched_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_search_analytics TO authenticated;
