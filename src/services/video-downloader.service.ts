import type { VideoInfo } from '@/types';

/**
 * Calls the get-video-info Netlify function which runs yt-dlp server-side
 * and returns normalised format URLs ready for browser download.
 */
export class VideoDownloaderService {
  private static get baseUrl(): string {
    // Support local Netlify CLI dev server
    if (typeof window !== 'undefined' && window.location.port === '5173') {
      return 'http://localhost:8888';
    }
    return '';
  }

  static async getVideoInfo(url: string): Promise<VideoInfo> {
    const response = await fetch(`${this.baseUrl}/.netlify/functions/get-video-info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url.trim() }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Include rawError in the thrown message so the UI can show it
      const detail = data.rawError ? ` (${data.rawError})` : '';
      throw new Error((data.error || 'Failed to fetch video information.') + detail);
    }

    return data as VideoInfo;
  }
}
