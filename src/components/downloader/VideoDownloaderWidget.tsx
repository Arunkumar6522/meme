import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Download } from 'lucide-react';

const PLATFORMS = ['YouTube', 'Instagram', 'TikTok', 'Twitter/X', 'LinkedIn', 'Reddit'];

const VideoDownloaderWidget: React.FC = () => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    navigate(`/downloader?url=${encodeURIComponent(trimmed)}`);
  };

  return (
    <section
      aria-label="Video Downloader"
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
            <Download className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">Video Downloader</h2>
            <p className="text-sm text-gray-500 leading-tight">Download from YouTube, Instagram, TikTok &amp; more</p>
          </div>
        </div>
        <Link
          to="/downloader"
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          aria-label="Open full video downloader"
        >
          Open <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* URL Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste video URL here…"
          aria-label="Video URL"
          className="flex-1 min-w-0 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-gray-400"
        />
        <button
          type="submit"
          disabled={!url.trim()}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 whitespace-nowrap"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Download
        </button>
      </form>

      {/* Platform chips + limit info */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-y-2">
        <div className="flex flex-wrap gap-1.5">
          {PLATFORMS.map((p) => (
            <span
              key={p}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {p}
            </span>
          ))}
          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
            +1000 more
          </span>
        </div>
        <p className="text-xs text-gray-400">
          Free: 3/day &nbsp;·&nbsp; <span className="text-primary-600 font-medium">Pro: Unlimited</span>
        </p>
      </div>
    </section>
  );
};

export default VideoDownloaderWidget;
