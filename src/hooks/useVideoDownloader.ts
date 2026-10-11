import { useState, useCallback, useEffect } from 'react';
import { VideoDownloaderService } from '@/services/video-downloader.service';
import { DatabaseService } from '@/services/database.service';
import { useAuth } from './useAuth';
import type { VideoInfo, VideoFormat } from '@/types';

export type DownloaderStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface DownloadEligibility {
  allowed: boolean;
  remaining: number | null;  // null = unlimited (Pro)
  limit: number;             // -1 = unlimited
  checked: boolean;
}

export function useVideoDownloader(initialUrl = '') {
  const { user } = useAuth();

  const [url, setUrl] = useState(initialUrl);
  const [status, setStatus] = useState<DownloaderStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<VideoFormat | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [eligibility, setEligibility] = useState<DownloadEligibility>({
    allowed: true,
    remaining: null,
    limit: DatabaseService.VIDEO_DOWNLOAD_FREE_LIMIT,
    checked: false,
  });

  // Load eligibility whenever the user changes
  const refreshEligibility = useCallback(async () => {
    if (!user?.id) return;
    const result = await DatabaseService.checkVideoDownloadEligibility(user.id);
    setEligibility({
      allowed: result.allowed,
      remaining: result.remaining ?? null,
      limit: result.limit,
      checked: true,
    });
    return result;
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) refreshEligibility();
  }, [user?.id, refreshEligibility]);

  const fetchVideoInfo = useCallback(async (inputUrl: string) => {
    const trimmed = inputUrl.trim();
    if (!trimmed) return;

    setUrl(trimmed);
    setStatus('loading');
    setError(null);
    setVideoInfo(null);
    setSelectedFormat(null);

    try {
      const info = await VideoDownloaderService.getVideoInfo(trimmed);
      setVideoInfo(info);

      // Auto-select the best quality (first video format, or first audio if no video)
      if (info.formats.video.length > 0) {
        setSelectedFormat(info.formats.video[0]);
      } else if (info.formats.audio.length > 0) {
        setSelectedFormat(info.formats.audio[0]);
      }

      setStatus('ready');
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch video information.');
      setStatus('error');
    }
  }, []);

  const download = useCallback(async (format: VideoFormat) => {
    if (!user?.id) {
      setError('Please sign in to download videos.');
      return;
    }

    setDownloading(true);
    setError(null);

    try {
      // Re-check eligibility right before downloading
      const latest = await DatabaseService.checkVideoDownloadEligibility(user.id);

      if (!latest.allowed) {
        const msg = latest.reason === 'limit_reached'
          ? `You've reached your ${latest.limit} free downloads for today. Upgrade to Pro for unlimited downloads.`
          : 'Unable to verify download eligibility. Please try again.';
        setError(msg);
        setEligibility({ allowed: false, remaining: 0, limit: latest.limit, checked: true });
        return;
      }

      // Record before triggering download
      await DatabaseService.recordVideoDownload(user.id, videoInfo?.platform);

      // Refresh the counter shown in the UI
      await refreshEligibility();

      // Trigger the browser download / open the URL in a new tab
      const a = document.createElement('a');
      a.href = format.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setDownloading(false);
    }
  }, [user?.id, videoInfo?.platform, refreshEligibility]);

  const reset = useCallback(() => {
    setUrl('');
    setStatus('idle');
    setError(null);
    setVideoInfo(null);
    setSelectedFormat(null);
  }, []);

  return {
    url, setUrl,
    status, error,
    videoInfo,
    selectedFormat, setSelectedFormat,
    downloading,
    eligibility,
    fetchVideoInfo,
    download,
    reset,
  };
}
