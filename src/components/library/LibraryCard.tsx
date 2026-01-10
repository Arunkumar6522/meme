import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Play, Pause, Download, Share2, Heart, Volume2, Video } from 'lucide-react';
import { LibraryService } from '@/services/library.service';
import { useToast } from '@/hooks/useToast';
import type { LibraryItem } from '@/types';
import { cn } from '@/utils/cn';

interface LibraryCardProps {
  item: LibraryItem;
  className?: string;
}

const LibraryCard: React.FC<LibraryCardProps> = memo(({ item, className }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const { showSuccess, showError } = useToast();

  const emotionColors = {
    happy: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    sad: 'bg-blue-100 text-blue-800 border-blue-200',
    funny: 'bg-green-100 text-green-800 border-green-200',
    thug: 'bg-gray-100 text-gray-800 border-gray-200',
    angry: 'bg-red-100 text-red-800 border-red-200',
    surprised: 'bg-purple-100 text-purple-800 border-purple-200',
    confused: 'bg-orange-100 text-orange-800 border-orange-200',
    excited: 'bg-pink-100 text-pink-800 border-pink-200',
    dramatic: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    sarcastic: 'bg-teal-100 text-teal-800 border-teal-200',
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  // Cleanup audio element on unmount
  useEffect(() => {
    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.src = '';
        audioElementRef.current = null;
      }
    };
  }, []);

  const handlePlay = useCallback(async () => {
    if (item.media_type === 'audio') {
      if (isPlaying && audioElementRef.current) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          // Reuse existing audio element or create new one
          if (!audioElementRef.current) {
            const audio = new Audio(item.file_url);
            audio.preload = 'auto'; // Preload for faster playback
            audio.addEventListener('ended', () => setIsPlaying(false));
            audio.addEventListener('error', () => {
              setIsPlaying(false);
              showError('Failed to play audio', 'Playback Error');
            });
            audio.addEventListener('play', () => setIsPlaying(true));
            audio.addEventListener('pause', () => setIsPlaying(false));
            audioElementRef.current = audio;
          }
          
          await audioElementRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing audio:', error);
          showError('Failed to play audio', 'Playback Error');
        }
      }
    } else {
      // For video, open in new tab
      window.open(item.file_url, '_blank', 'noopener,noreferrer');
    }
  }, [item.media_type, item.file_url, isPlaying, showError]);

  const handleDownload = useCallback(async () => {
    if (downloading) return;
    
    setDownloading(true);
    try {
      // Increment download count (non-blocking)
      LibraryService.incrementDownloadCount(item.id).catch(() => {
        // Silently fail - not critical
      });
      
      // Use the file_url directly - it should be a public URL from Supabase storage
      const downloadUrl = item.file_url;
      
      if (!downloadUrl) {
        throw new Error('File URL not available');
      }

      // Fetch the file and create a blob URL for download
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${item.title.replace(/[^a-z0-9]/gi, '_')}.${item.media_type === 'audio' ? 'mp3' : 'mp4'}`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
      
      showSuccess('Download started!', 'Download');
    } catch (error: any) {
      console.error('Download error:', error);
      showError(error?.message || 'Failed to download file. Please try again.', 'Download Error');
    } finally {
      setDownloading(false);
    }
  }, [item.id, item.file_url, item.title, item.media_type, downloading, showSuccess, showError]);

  const handleLike = useCallback(() => {
    setIsLiked(prev => !prev);
    // TODO: Implement like functionality with backend
  }, []);

  const handleShare = useCallback(async () => {
    const shareUrl = `${window.location.origin}/library/${item.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: item.description || `Check out ${item.title}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showSuccess('Link copied to clipboard!', 'Share');
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        // Fallback to copy
        try {
          await navigator.clipboard.writeText(shareUrl);
          showSuccess('Link copied to clipboard!', 'Share');
        } catch (copyError) {
          showError('Failed to share', 'Share Error');
        }
      }
    }
  }, [item.id, item.title, item.description, showSuccess, showError]);

  // Get thumbnail with fallback color based on emotion
  const getThumbnailColor = () => {
    const colors: Record<string, string> = {
      happy: 'bg-yellow-400',
      sad: 'bg-blue-400',
      funny: 'bg-green-400',
      thug: 'bg-gray-600',
      angry: 'bg-red-500',
      surprised: 'bg-purple-400',
      confused: 'bg-orange-400',
      excited: 'bg-pink-400',
      dramatic: 'bg-indigo-500',
      sarcastic: 'bg-teal-400',
    };
    return colors[item.emotion] || 'bg-primary-500';
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center space-y-2 group',
        className
      )}
    >
      {/* Circular Button */}
      <button
        onClick={handlePlay}
        className={cn(
          'relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full shadow-lg hover:shadow-xl',
          'transition-all duration-200 transform hover:scale-105 active:scale-95',
          'focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-offset-2',
          'overflow-hidden border-2 sm:border-4 border-white',
          'touch-manipulation', // Better mobile touch
          getThumbnailColor()
        )}
        aria-label={`Play ${item.title}`}
      >
        {item.thumbnail_url ? (
          <img
            src={item.thumbnail_url}
            alt={`Thumbnail for ${item.title}`}
            className="w-full h-full object-cover rounded-full"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            {item.media_type === 'audio' ? (
              <Volume2 className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white" aria-hidden="true" />
            ) : (
              <Video className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white" aria-hidden="true" />
            )}
          </div>
        )}
        {/* Play/Pause icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-full">
          {isPlaying ? (
            <Pause className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white opacity-100 transition-opacity" />
          ) : (
            <Play className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </button>

      {/* Title */}
      <h3 className="text-xs sm:text-sm font-medium text-gray-900 text-center line-clamp-2 max-w-[100px] sm:max-w-[120px] md:max-w-[140px] leading-tight px-1">
        {item.title}
      </h3>

      {/* Action Icons */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3">
        {/* Like/Heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          className={cn(
            'w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all',
            'focus:outline-none focus:ring-2 focus:ring-red-300 active:scale-90',
            'touch-manipulation', // Better mobile touch
            isLiked 
              ? 'bg-red-100 text-red-500 shadow-sm' 
              : 'bg-white hover:bg-red-50 text-gray-600 hover:text-red-500 shadow-sm hover:shadow'
          )}
          aria-label="Like"
        >
          <Heart className={cn('w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5', isLiked && 'fill-current')} />
        </button>

        {/* Share */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-white hover:bg-blue-50 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-90 shadow-sm hover:shadow touch-manipulation"
          aria-label="Share"
        >
          <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-600 hover:text-blue-500" />
        </button>

        {/* Download */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
          disabled={downloading}
          className={cn(
            'w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-white hover:bg-green-50 flex items-center justify-center transition-all',
            'focus:outline-none focus:ring-2 focus:ring-green-300 active:scale-90 shadow-sm hover:shadow touch-manipulation',
            downloading && 'opacity-50 cursor-not-allowed'
          )}
          aria-label="Download"
        >
          {downloading ? (
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-600 hover:text-green-500" />
          )}
        </button>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.title === nextProps.item.title &&
    prevProps.item.thumbnail_url === nextProps.item.thumbnail_url &&
    prevProps.item.file_url === nextProps.item.file_url &&
    prevProps.className === nextProps.className
  );
});

LibraryCard.displayName = 'LibraryCard';

export default LibraryCard;