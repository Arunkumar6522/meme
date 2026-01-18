// Admin-only: delete a library item and its associated storage objects (file + thumbnail).
// Keeps storage buckets private while still allowing admins to clean up content.

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
    Vary: 'Origin',
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
    if (profile?.role !== 'admin' && profile?.role !== 'superadmin') {
      return { statusCode: 403, headers, body: JSON.stringify({ error: 'Admin access required' }) };
    }

    let requestData;
    try {
      requestData = JSON.parse(event.body || '{}');
    } catch {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON in request body' }) };
    }

    const itemId = requestData.itemId;
    if (!itemId) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing itemId' }) };
    }

    const { data: item, error: itemError } = await supabase
      .from('library_items')
      .select('id,file_bucket,file_path,thumbnail_bucket,thumbnail_path')
      .eq('id', itemId)
      .maybeSingle();

    if (itemError) {
      console.error('delete-library-item: item lookup error', itemError);
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to load item' }) };
    }
    if (!item) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Item not found' }) };
    }

    // Delete storage objects first (best-effort; don't block DB delete on missing files)
    const removeOps = [];
    if (item.file_bucket && item.file_path) {
      removeOps.push(supabase.storage.from(item.file_bucket).remove([item.file_path]));
    }
    if (item.thumbnail_bucket && item.thumbnail_path) {
      removeOps.push(supabase.storage.from(item.thumbnail_bucket).remove([item.thumbnail_path]));
    }

    if (removeOps.length) {
      const results = await Promise.allSettled(removeOps);
      for (const r of results) {
        if (r.status === 'fulfilled' && r.value?.error) {
          console.warn('delete-library-item: storage remove error', r.value.error);
        }
      }
    }

    const { error: delError } = await supabase.from('library_items').delete().eq('id', itemId);
    if (delError) {
      console.error('delete-library-item: DB delete error', delError);
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to delete item' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('delete-library-item error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};

