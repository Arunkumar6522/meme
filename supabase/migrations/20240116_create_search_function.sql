-- Create the search_library_items RPC function
-- This function provides fuzzy search capabilities and filtering for the frontend

CREATE OR REPLACE FUNCTION public.search_library_items(
  q text,
  p_media_type text DEFAULT NULL,
  p_emotion text DEFAULT NULL,
  p_languages text[] DEFAULT NULL,
  p_artist text[] DEFAULT NULL,
  p_sort_by text DEFAULT 'latest',
  p_page integer DEFAULT 1,
  p_per_page integer DEFAULT 20
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  keywords text[],
  emotion emotion_type,
  media_type media_type,
  file_url text,
  thumbnail_url text,
  duration integer,
  file_size bigint,
  is_published boolean,
  download_count integer,
  created_at timestamptz,
  updated_at timestamptz,
  created_by uuid,
  is_premium boolean,
  thumbnail_bucket text,
  thumbnail_path text,
  file_bucket text,
  file_path text,
  rank real,
  total_count bigint
) AS $$
DECLARE
  v_offset integer;
BEGIN
  v_offset := (p_page - 1) * p_per_page;

  RETURN QUERY
  WITH filtered_items AS (
    SELECT
      li.*,
      ts_rank(to_tsvector('english', li.title || ' ' || COALESCE(li.description, '') || ' ' || array_to_string(li.keywords, ' ')), plainto_tsquery('english', q)) as search_rank,
      COUNT(*) OVER() as full_count
    FROM public.library_items li
    WHERE
      li.is_published = true
      AND (
        -- Search condition
        q IS NULL OR q = '' OR
        (
          li.title ILIKE '%' || q || '%'
          OR li.description ILIKE '%' || q || '%'
          OR array_to_string(li.keywords, ' ') ILIKE '%' || q || '%'
        )
      )
      AND (p_media_type IS NULL OR li.media_type::text = p_media_type)
      AND (p_emotion IS NULL OR li.emotion::text = p_emotion)
      AND (
        p_languages IS NULL 
        OR (li.languages IS NOT NULL AND li.languages && p_languages)
      )
      AND (
        p_artist IS NULL 
        OR (li.keywords IS NOT NULL AND li.keywords && p_artist)
      )
  )
  SELECT
    fi.id,
    fi.title,
    fi.description,
    fi.keywords,
    fi.emotion,
    fi.media_type,
    fi.file_url,
    fi.thumbnail_url,
    fi.duration,
    fi.file_size,
    fi.is_published,
    fi.download_count,
    fi.created_at,
    fi.updated_at,
    fi.created_by,
    fi.is_premium,
    fi.thumbnail_bucket,
    fi.thumbnail_path,
    fi.file_bucket,
    fi.file_path,
    fi.search_rank::real as rank,
    fi.full_count::bigint as total_count
  FROM filtered_items fi
  ORDER BY
    CASE WHEN p_sort_by = 'latest' THEN fi.created_at END DESC,
    CASE WHEN p_sort_by = 'trending' THEN fi.download_count END DESC,
    CASE WHEN p_sort_by = 'title' THEN fi.title END ASC,
    fi.search_rank DESC
  LIMIT p_per_page
  OFFSET v_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.search_library_items TO anon, authenticated;
