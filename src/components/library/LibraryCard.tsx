import React, { useState } from 'react';
import { Play, Download, Volume2, Video } from 'lucide-react';
import { Button } from '@/components/ui';
import { useLibraryItem } from '@/hooks/useLibrary';
import type { LibraryItem } from '@/types';
import { cn } from '@/utils/cn';

interface LibraryCardProps {
  item: LibraryItem;
  className?: string;
}

const LibraryCard: React.FC<LibraryCardProps> = ({ item, className }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { downloadItem } = useLibraryItem(item.id);
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
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [audioElement]);

  const handlePlay = async () => {
    if (item.media_type === 'audio') {
      if (isPlaying && audioElement) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        try {
          if (audioElement) {
            await audioElement.play();
          } else {
            const audio = new Audio(item.file_url);
            audio.addEventListener('ended', () => setIsPlaying(false));
            audio.addEventListener('error', () => {
              setIsPlaying(false);
              showError('Failed to play audio', 'Playback Error');
            });
            audio.addEventListener('play', () => setIsPlaying(true));
            audio.addEventListener('pause', () => setIsPlaying(false));
            setAudioElement(audio);
            await audio.play();
          }
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing audio:', error);
          showError('Failed to play audio', 'Playback Error');
        }
      }
    } else {
      // For video, open in new tab
      window.open(item.file_url, '_blank');
    }
  };

  const handleDownload = async () => {
    try {
      await downloadItem();
      showSuccess('Download started!', 'Download');
    } catch (error) {
      showError('Failed to download', 'Download Error');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement like functionality with backend
  };

  const handleShare = async () => {
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
  };

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
          'relative w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-lg hover:shadow-xl',
          'transition-all duration-200 transform hover:scale-105 active:scale-95',
          'focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-offset-2',
          'overflow-hidden border-4 border-white',
          getThumbnailColor()
        )}
        aria-label={`Play ${item.title}`}
      >
        {item.thumbnail_url ? (
          <img
            src={item.thumbnail_url}
            alt={`Thumbnail for ${item.title}`}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            {item.media_type === 'audio' ? (
              <Volume2 className="h-8 w-8 sm:h-10 sm:w-10 text-white" aria-hidden="true" />
            ) : (
              <Video className="h-8 w-8 sm:h-10 sm:w-10 text-white" aria-hidden="true" />
            )}
          </div>
        )}
        {/* Play/Pause icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-full">
          {isPlaying ? (
            <Pause className="h-6 w-6 sm:h-8 sm:w-8 text-white opacity-100 transition-opacity" />
          ) : (
            <Play className="h-6 w-6 sm:h-8 sm:w-8 text-white ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </button>

      {/* Title */}
      <h3 className="text-xs sm:text-sm font-medium text-gray-900 text-center line-clamp-2 max-w-[120px] sm:max-w-[140px] leading-tight">
        {item.title}
      </h3>

      {/* Action Icons */}
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {/* Like/Heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          className={cn(
            'w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-red-300',
            isLiked 
              ? 'bg-red-100 text-red-500' 
              : 'bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500'
          )}
          aria-label="Like"
        >
          <Heart className={cn('w-3 h-3 sm:w-4 sm:h-4', isLiked && 'fill-current')} />
        </button>

        {/* Share */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-100 hover:bg-blue-50 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label="Share"
        >
          <Share2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 hover:text-blue-500" />
        </button>

        {/* Download */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-100 hover:bg-green-50 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
          aria-label="Download"
        >
          <Download className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 hover:text-green-500" />
        </button>
      </div>
    </div>
  );
};

export default LibraryCard;