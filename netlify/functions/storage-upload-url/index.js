// Admin-only: mint signed upload URLs for Supabase Storage.
// Frontend uploads directly to the signed URL; the bucket can remain private.

const { createClient } = require('@supabase/supabase-js');

function safeName(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
}

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

    // Require a valid user session and admin role
    const authHeader = event.headers?.authorization || event.headers?.Authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : '';
    if (!token) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Missing Authorization token' }) };
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user?.id) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid session' }) };
    }

    const userId = userData.user.id;
    const { data: profile } = await supabase.from('users').select('role').eq('id', userId).maybeSingle();
    if (profile?.role !== 'admin') {
      return { statusCode: 403, headers, body: JSON.stringify({ error: 'Admin access required' }) };
    }

    let requestData;
    try {
      requestData = JSON.parse(event.body || '{}');
    } catch {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON in request body' }) };
    }

    const mediaType = requestData.mediaType; // 'audio' | 'video' | 'thumbnail'
    const originalName = requestData.originalName;

    if (!mediaType || !originalName) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields: mediaType, originalName' }) };
    }

    const bucket =
      mediaType === 'audio'
        ? 'library-audio'
        : mediaType === 'video'
          ? 'library-video'
          : mediaType === 'thumbnail'
            ? 'thumbnails'
            : null;

    if (!bucket) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid mediaType' }) };
    }

    const namePart = safeName(originalName);
    const path = `${userId}/${Date.now()}-${Math.random().toString(16).slice(2, 10)}-${namePart}`;

    const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(path);
    if (error || !data?.signedUrl) {
      console.error('createSignedUploadUrl error:', error);
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to create upload URL' }) };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        bucket,
        path,
        signedUrl: data.signedUrl,
      }),
    };
  } catch (err) {
    console.error('storage-upload-url error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};

