-- 1. Add view/play count to track "most seen"
ALTER TABLE public.library_items 
ADD COLUMN IF NOT EXISTS view_count BIGINT DEFAULT 0;

-- 2. Create function to increment view count (call this when a user views/plays an item)
CREATE OR REPLACE FUNCTION increment_view_count(item_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.library_items 
  SET view_count = view_count + 1 
  WHERE id = item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Update Dashboard Stats to include Top Content
-- This function accepts optional filters for language and media_type
CREATE OR REPLACE FUNCTION get_dashboard_stats(
  filter_lang TEXT DEFAULT NULL, 
  filter_media TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  result JSON;
  downloads_count BIGINT;
  views_count BIGINT;
  favorites_count BIGINT; -- We don't have a favorites table join handy here easily without more complex querying, but we can approximate or skip if strictly needed from `favorites` array in user profile? No, usually favorites are in a separate table or array. 
  -- Creating a simpler "top content" query.
BEGIN

  -- Top 5 Most Viewed
  WITH top_viewed AS (
    SELECT id, title, view_count, media_type, languages
    FROM public.library_items
    WHERE (filter_lang IS NULL OR filter_lang = ANY(languages))
      AND (filter_media IS NULL OR media_type = filter_media)
    ORDER BY view_count DESC
    LIMIT 5
  ),
  -- Top 5 Most Downloaded
  top_downloaded AS (
    SELECT id, title, download_count, media_type, languages
    FROM public.library_items
    WHERE (filter_lang IS NULL OR filter_lang = ANY(languages))
      AND (filter_media IS NULL OR media_type = filter_media)
    ORDER BY download_count DESC
    LIMIT 5
  )
  
  SELECT json_build_object(
    'metrics', json_build_object(
      'total_items', (SELECT COUNT(*) FROM public.library_items WHERE (filter_lang IS NULL OR filter_lang = ANY(languages)) AND (filter_media IS NULL OR media_type = filter_media)),
      'total_downloads', (SELECT COALESCE(SUM(download_count), 0) FROM public.library_items WHERE (filter_lang IS NULL OR filter_lang = ANY(languages)) AND (filter_media IS NULL OR media_type = filter_media)),
      'total_views', (SELECT COALESCE(SUM(view_count), 0) FROM public.library_items WHERE (filter_lang IS NULL OR filter_lang = ANY(languages)) AND (filter_media IS NULL OR media_type = filter_media))
    ),
    'top_viewed', (SELECT json_agg(row_to_json(top_viewed)) FROM top_viewed),
    'top_downloaded', (SELECT json_agg(row_to_json(top_downloaded)) FROM top_downloaded)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_dashboard_stats(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO anon; -- Allow public users to count towards views? Yes.
