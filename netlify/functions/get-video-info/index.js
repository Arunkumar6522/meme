'use strict';
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const BINARY_PATH = path.join(__dirname, 'yt-dlp');

// Spawn yt-dlp with the given args, resolve with stdout or reject with stderr
function runYtDlp(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(BINARY_PATH, args, {
      timeout: 20000,
      env: { ...process.env, HOME: '/tmp' },
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (d) => { stdout += d.toString(); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); });

    proc.on('close', (code) => {
      if (code === 0) resolve(stdout.trim());
      else reject(new Error(stderr.trim() || `yt-dlp exited with code ${code}`));
    });

    proc.on('error', reject);
  });
}

function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return null;
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  const kb = bytes / 1024;
  return `${kb.toFixed(0)} KB`;
}

function normalizeFormats(formats) {
  const videoMap = {};   // keyed by height for dedup
  const audioMap = {};   // keyed by ext for dedup

  for (const f of (formats || [])) {
    if (!f.url) continue;
    if (!f.vcodec && !f.acodec) continue;
    if ((f.format_note || '').includes('storyboard')) continue;
    // Skip manifest/streaming-only formats — browser can't download them directly
    if (['m3u8', 'm3u8_native', 'dash', 'frag_urls'].includes(f.protocol)) continue;
    if (f.has_drm) continue;

    const hasVideo = f.vcodec && f.vcodec !== 'none';
    const hasAudio = f.acodec && f.acodec !== 'none';

    if (hasVideo && hasAudio) {
      const height = f.height || 0;
      const existing = videoMap[height];
      const thisSize = f.filesize || f.filesize_approx || 0;
      const existingSize = existing ? (existing._raw_size || 0) : -1;
      // Keep the format with the larger filesize at the same resolution
      if (!existing || thisSize > existingSize) {
        videoMap[height] = {
          format_id: f.format_id,
          ext: f.ext || 'mp4',
          resolution: height ? `${height}p` : (f.resolution || 'unknown'),
          height,
          filesize: f.filesize || f.filesize_approx || null,
          filesize_str: formatBytes(f.filesize || f.filesize_approx),
          fps: f.fps || null,
          url: f.url,
          format_note: f.format_note || (height ? `${height}p` : 'Video'),
          _raw_size: thisSize,
        };
      }
    } else if (!hasVideo && hasAudio) {
      const ext = f.ext || 'audio';
      if (!audioMap[ext]) {
        audioMap[ext] = {
          format_id: f.format_id,
          ext,
          resolution: 'audio',
          height: 0,
          filesize: f.filesize || f.filesize_approx || null,
          filesize_str: formatBytes(f.filesize || f.filesize_approx),
          abr: Math.round(f.abr || f.tbr || 0) || null,
          url: f.url,
          format_note: f.format_note || `${ext.toUpperCase()} Audio`,
        };
      }
    }
  }

  // Remove internal _raw_size before returning
  const video = Object.values(videoMap)
    .map(({ _raw_size, ...rest }) => rest)
    .sort((a, b) => b.height - a.height);

  const audio = Object.values(audioMap);

  return { video, audio };
}

function friendlyError(rawMsg) {
  const msg = rawMsg || '';
  if (msg.includes('not supported') || msg.includes('Unsupported URL'))
    return 'This platform is not supported. Try YouTube, Instagram, TikTok, or Twitter/X.';
  if (msg.includes('Private video') || msg.includes('private'))
    return 'This video is private and cannot be downloaded.';
  if (msg.includes('Login Required') || msg.includes('login required'))
    return 'This video requires a login to access.';
  if (msg.includes('removed') || msg.includes('not available') || msg.includes('deleted'))
    return 'Video not found. It may have been removed or is unavailable.';
  if (msg.includes('age') && msg.includes('restrict'))
    return 'This video is age-restricted and cannot be downloaded.';
  if (msg.includes('Unable to extract') || msg.includes('Could not'))
    return 'Could not extract video information. The URL may be invalid or the platform may have changed.';
  return 'Failed to fetch video information. Please check the URL and try again.';
}

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '{}' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Make sure the binary was bundled at build time
  if (!fs.existsSync(BINARY_PATH)) {
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({ error: 'Downloader service is not available. Binary not found.' }),
    };
  }

  let url;
  try {
    ({ url } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request body.' }) };
  }

  if (!url || typeof url !== 'string') {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'URL is required.' }) };
  }

  const trimmedUrl = url.trim();
  if (!isValidUrl(trimmedUrl)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Please enter a valid HTTP/HTTPS URL.' }) };
  }

  try {
    const jsonStr = await runYtDlp([
      '--dump-json',
      '--no-playlist',
      '--no-warnings',
      '--socket-timeout', '8',
      '--no-check-certificates',
      trimmedUrl,
    ]);

    const info = JSON.parse(jsonStr);
    const formats = normalizeFormats(info.formats);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        title: info.title || 'Untitled Video',
        thumbnail: info.thumbnail || null,
        duration: info.duration || null,
        uploader: info.uploader || info.channel || null,
        platform: info.extractor_key || info.extractor || null,
        formats,
      }),
    };
  } catch (err) {
    console.error('[get-video-info] yt-dlp error:', err.message);
    return {
      statusCode: 422,
      headers,
      body: JSON.stringify({ error: friendlyError(err.message) }),
    };
  }
};
