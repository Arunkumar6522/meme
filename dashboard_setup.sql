-- 1. Add Premium Subscription Support
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ;

-- 2. Create Dashboard Analytics Function
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'users', json_build_object(
      'total', (SELECT COUNT(*) FROM public.users),
      'premium', (SELECT COUNT(*) FROM public.users WHERE is_premium = true),
      'admins', (SELECT COUNT(*) FROM public.users WHERE role IN ('admin', 'superadmin'))
    ),
    'library', json_build_object(
      'total_items', (SELECT COUNT(*) FROM public.library_items),
      'audio_count', (SELECT COUNT(*) FROM public.library_items WHERE media_type = 'audio'),
      'video_count', (SELECT COUNT(*) FROM public.library_items WHERE media_type = 'video'),
      'total_downloads', (SELECT COALESCE(SUM(download_count), 0) FROM public.library_items)
    ),
    'languages', (
      SELECT json_object_agg(lang, count)
      FROM (
        SELECT unnest(languages) as lang, COUNT(*) as count
        FROM public.library_items
        GROUP BY lang
      ) sub
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Grant access to the function
GRANT EXECUTE ON FUNCTION get_dashboard_stats TO authenticated;
