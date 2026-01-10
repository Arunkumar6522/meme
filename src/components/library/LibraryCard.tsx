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
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { downloadItem } = useLibraryItem(item.id);

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

  const handlePlay = async () => {
    if (item.media_type === 'audio') {
      if (isPlaying && audioElement) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        if (audioElement) {
          audioElement.play();
        } else {
          const audio = new Audio(item.file_url);
          audio.addEventListener('ended', () => setIsPlaying(false));
          audio.addEventListener('error', () => setIsPlaying(false));
          setAudioElement(audio);
          audio.play();
        }
        setIsPlaying(true);
      }
    } else {
      // For video, we'll open in a modal or new tab
      window.open(item.file_url, '_blank');
    }
  };

  const handleDownload = async () => {
    await downloadItem();
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
        {/* Play icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-full">
          <Play className="h-6 w-6 sm:h-8 sm:w-8 text-white ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
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
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-100 hover:bg-red-50 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
          aria-label="Like"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 hover:text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Copy Link */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(window.location.origin + '/library/' + item.id);
          }}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-100 hover:bg-blue-50 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label="Copy link"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>

        {/* Share/Download */}
        <button
          onClick={handleDownload}
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
export default LibraryCard;