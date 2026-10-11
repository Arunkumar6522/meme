import React, { useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Download, Search, AlertCircle, CheckCircle,
  Clock, User, Zap, Crown, RotateCcw,
} from 'lucide-react';
import { useVideoDownloader } from '@/hooks/useVideoDownloader';
import { useAuth } from '@/hooks/useAuth';
import type { VideoFormat } from '@/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDuration(seconds?: number | null): string {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function normalisePlatformName(raw?: string | null): string {
  const map: Record<string, string> = {
    Youtube: 'YouTube',
    Tiktok: 'TikTok',
    Twitter: 'Twitter/X',
    Linkedin: 'LinkedIn',
    Instagram: 'Instagram',
    Reddit: 'Reddit',
    Facebook: 'Facebook',
    Twitch: 'Twitch',
  };
  if (!raw) return '';
  return map[raw] || raw;
}

const SUPPORTED_PLATFORMS = [
  'YouTube', 'Instagram', 'TikTok', 'Twitter/X',
  'LinkedIn', 'Reddit', 'Facebook', 'Twitch',
];

// ── Sub-components ────────────────────────────────────────────────────────────

interface FormatCardProps {
  format: VideoFormat;
  selected: boolean;
  onSelect: () => void;
}

const FormatCard: React.FC<FormatCardProps> = ({ format, selected, onSelect }) => {
  const isAudio = format.height === 0;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`
        relative w-full text-left rounded-xl border-2 p-4 transition-all focus:outline-none
        focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${selected
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}
      `}
    >
      {selected && (
        <span className="absolute top-2 right-2">
          <CheckCircle className="w-4 h-4 text-primary-600" aria-hidden="true" />
        </span>
      )}
      <p className={`text-base font-bold ${selected ? 'text-primary-700' : 'text-gray-900'}`}>
        {isAudio ? format.ext.toUpperCase() : format.resolution}
      </p>
      <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wide">
        {isAudio ? 'Audio only' : format.ext}
        {format.fps && format.fps > 30 ? ` · ${format.fps}fps` : ''}
      </p>
      {format.filesize_str && (
        <p className="text-xs text-gray-400 mt-1.5">~{format.filesize_str}</p>
      )}
    </button>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────

const VideoDownloaderPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    url, setUrl,
    status, error,
    videoInfo,
    selectedFormat, setSelectedFormat,
    downloading,
    eligibility,
    fetchVideoInfo,
    download,
    reset,
  } = useVideoDownloader();

  // Auto-fetch if URL was passed from the widget
  useEffect(() => {
    const paramUrl = searchParams.get('url');
    if (paramUrl) {
      setUrl(paramUrl);
      fetchVideoInfo(paramUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) fetchVideoInfo(url);
  };

  const handleDownload = () => {
    if (selectedFormat) download(selectedFormat);
  };

  const isPro = eligibility.limit === -1;
  const isLimitReached = !isPro && eligibility.checked && !eligibility.allowed;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 mb-4">
            <Download className="w-7 h-7 text-primary-600" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Video Downloader</h1>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            Paste any video link and download it in your preferred quality.
          </p>
        </div>

        {/* Download Limit Badge */}
        {eligibility.checked && (
          <div className={`
            flex items-center justify-center gap-2 mb-6 px-4 py-2.5 rounded-full text-sm font-medium w-fit mx-auto
            ${isPro
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : isLimitReached
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'}
          `}>
            {isPro ? (
              <><Crown className="w-4 h-4" aria-hidden="true" /> Unlimited Pro downloads</>
            ) : isLimitReached ? (
              <><AlertCircle className="w-4 h-4" aria-hidden="true" /> Daily limit reached — upgrade to Pro</>
            ) : (
              <><Zap className="w-4 h-4" aria-hidden="true" />
                {eligibility.remaining} of {eligibility.limit} free downloads left today
              </>
            )}
          </div>
        )}

        {/* URL Input Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=…"
                aria-label="Video URL"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading' || !url.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 whitespace-nowrap text-sm"
            >
              {status === 'loading' ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                  Fetching…
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" aria-hidden="true" />
                  Fetch Video
                </>
              )}
            </button>
          </form>

          {/* Supported Platforms */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {SUPPORTED_PLATFORMS.map((p) => (
              <span key={p} className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                {p}
              </span>
            ))}
            <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
              +1000 more
            </span>
          </div>
        </div>

        {/* Error State */}
        {status === 'error' && error && (
          <div
            role="alert"
            className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-red-800">{error}</p>
              <button
                onClick={reset}
                className="mt-1 text-xs text-red-600 underline hover:text-red-700"
              >
                Try another URL
              </button>
            </div>
          </div>
        )}

        {/* Download error (after video loaded) */}
        {status === 'ready' && error && (
          <div
            role="alert"
            className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {/* Results */}
        {status === 'ready' && videoInfo && (
          <div className="space-y-5">

            {/* Video Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex gap-4">
              {videoInfo.thumbnail && (
                <img
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  className="w-32 h-20 object-cover rounded-lg flex-shrink-0 bg-gray-100"
                  loading="lazy"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 line-clamp-2 text-sm sm:text-base leading-snug">
                  {videoInfo.title}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                  {videoInfo.uploader && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <User className="w-3.5 h-3.5" aria-hidden="true" />
                      {videoInfo.uploader}
                    </span>
                  )}
                  {videoInfo.duration && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      {formatDuration(videoInfo.duration)}
                    </span>
                  )}
                  {videoInfo.platform && (
                    <span className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full font-medium">
                      {normalisePlatformName(videoInfo.platform)}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => { reset(); inputRef.current?.focus(); }}
                title="Search another URL"
                aria-label="Search another URL"
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Format Selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                Choose Quality
              </h2>

              {/* Video + Audio formats */}
              {videoInfo.formats.video.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-1.5">
                    <span aria-hidden="true">📹</span> Video + Audio
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {videoInfo.formats.video.map((fmt) => (
                      <FormatCard
                        key={fmt.format_id}
                        format={fmt}
                        selected={selectedFormat?.format_id === fmt.format_id}
                        onSelect={() => setSelectedFormat(fmt)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Audio-only formats */}
              {videoInfo.formats.audio.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-1.5">
                    <span aria-hidden="true">🔊</span> Audio Only
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {videoInfo.formats.audio.map((fmt) => (
                      <FormatCard
                        key={fmt.format_id}
                        format={fmt}
                        selected={selectedFormat?.format_id === fmt.format_id}
                        onSelect={() => setSelectedFormat(fmt)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {videoInfo.formats.video.length === 0 && videoInfo.formats.audio.length === 0 && (
                <div className="flex items-center gap-3 py-6 justify-center text-gray-400">
                  <AlertCircle className="w-5 h-5" aria-hidden="true" />
                  <p className="text-sm">No directly downloadable formats found for this video.</p>
                </div>
              )}
            </div>

            {/* Download Button */}
            {selectedFormat && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Selected: <span className="font-semibold text-gray-900">
                        {selectedFormat.height > 0 ? selectedFormat.resolution : selectedFormat.ext.toUpperCase()}
                      </span>
                      {selectedFormat.filesize_str && (
                        <span className="text-gray-400"> (~{selectedFormat.filesize_str})</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      The file will open in a new tab — save it from there.
                    </p>
                  </div>

                  {isLimitReached ? (
                    <Link
                      to="/pro"
                      className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 whitespace-nowrap"
                    >
                      <Crown className="w-4 h-4" aria-hidden="true" />
                      Upgrade to Pro
                    </Link>
                  ) : (
                    <button
                      onClick={handleDownload}
                      disabled={downloading || !user}
                      aria-label={`Download ${selectedFormat.height > 0 ? selectedFormat.resolution : selectedFormat.ext}`}
                      className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 whitespace-nowrap"
                    >
                      {downloading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                          Opening…
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" aria-hidden="true" />
                          Download
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Idle / how-it-works hint */}
        {status === 'idle' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center text-gray-400">
            <Download className="w-10 h-10 mx-auto mb-3 text-gray-200" aria-hidden="true" />
            <p className="text-sm">Paste a video URL above and click <strong className="font-semibold text-gray-500">Fetch Video</strong> to see available download options.</p>
          </div>
        )}

        {/* Loading skeleton */}
        {status === 'loading' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex gap-4 mb-6">
              <div className="w-32 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-xl" />
              ))}
            </div>
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Only download content you have rights to. Respect each platform's Terms of Service.
        </p>

      </div>
    </div>
  );
};

export default VideoDownloaderPage;
