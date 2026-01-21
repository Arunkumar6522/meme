// Mint a signed URL for a published library item media/thumbnail.
// Avoids exposing arbitrary bucket/path access to the client: client passes itemId only.

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || '';
  const allowedOrigins = allowedOriginsEnv
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const originAllowed = allowedOrigins.length === 0 || (origin && allowedOrigins.includes(origin));

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': originAllowed && origin ? origin : (allowedOrigins.length ? allowedOrigins[0] : '*'),
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: JSON.stringify({}) };
  }

  if (!originAllowed && allowedOrigins.length) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: 'Origin not allowed' }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server not configured.' }) };
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    let requestData;
    try {
      requestData = JSON.parse(event.body || '{}');
    } catch {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON in request body' }) };
    }

    const itemId = requestData.itemId;
    const kind = requestData.kind || 'file'; // 'file' | 'thumbnail'
    const expiresIn = Number(requestData.expiresIn || 60 * 15); // 15m default

    if (!itemId) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing itemId' }) };
    }
    if (kind !== 'file' && kind !== 'thumbnail') {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid kind' }) };
    }

    const { data: item, error: itemError } = await supabase
      .from('library_items')
      .select(
        [
          'id',
          'is_published',
          'file_url',
          'thumbnail_url',
          'file_bucket',
          'file_path',
          'thumbnail_bucket',
          'thumbnail_path',
        ].join(',')
      )
      .eq('id', itemId)
      .maybeSingle();

    if (itemError) {
      console.error('library item lookup error:', itemError);
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to load item' }) };
    }
    if (!item) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Item not found' }) };
    }
    if (!item.is_published) {
      return { statusCode: 403, headers, body: JSON.stringify({ error: 'Not available' }) };
    }

    // Backward compatibility: if we have a public URL, return it.
    const legacyUrl = kind === 'thumbnail' ? item.thumbnail_url : item.file_url;
    const bucket = kind === 'thumbnail' ? item.thumbnail_bucket : item.file_bucket;
    const path = kind === 'thumbnail' ? item.thumbnail_path : item.file_path;

    if (!bucket || !path) {
      if (legacyUrl) {
        return { statusCode: 200, headers, body: JSON.stringify({ url: legacyUrl }) };
      }
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Item storage path missing' }) };
    }

    const options = kind === 'thumbnail'
      ? { transform: { width: 400, height: 400, resize: 'cover', format: 'webp' } }
      : undefined;

    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn, options);
    if (error || !data?.signedUrl) {
      console.error('createSignedUrl error:', error);
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to create signed URL' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ url: data.signedUrl }) };
  } catch (err) {
    console.error('library-item-url error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};

