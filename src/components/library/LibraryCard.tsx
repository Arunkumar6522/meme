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

  return (
    <div
      className={cn(
        'group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200',
        'focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2',
        className
      )}
    >
      {/* Thumbnail/Preview */}
      <div className="aspect-video bg-gray-100 rounded-t-lg flex items-center justify-center relative overflow-hidden">
        {item.thumbnail_url ? (
          <img
            src={item.thumbnail_url}
            alt={`Thumbnail for ${item.title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary-50 to-primary-100">
            {item.media_type === 'audio' ? (
              <Volume2 className="h-12 w-12 text-primary-400" aria-hidden="true" />
            ) : (
              <Video className="h-12 w-12 text-primary-400" aria-hidden="true" />
            )}
          </div>
        )}
        
        {/* Play button overlay */}
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 focus:outline-none focus:bg-opacity-30"
          aria-label={`Play ${item.title}`}
        >
          <div className="bg-white bg-opacity-90 rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-200">
            <Play className="h-6 w-6 text-gray-900 ml-0.5" aria-hidden="true" />
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Emotion Badge */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-tight">
            {item.title}
          </h3>
          <div className="flex items-center justify-between">
            <span
              className={cn(
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border',
                emotionColors[item.emotion]
              )}
            >
              {item.emotion}
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {item.media_type}
            </span>
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            {item.duration && (
              <span>{formatDuration(item.duration)}</span>
            )}
            {item.file_size && (
              <span>{formatFileSize(item.file_size)}</span>
            )}
          </div>
          <span>{item.download_count} downloads</span>
        </div>

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          variant="outline"
          size="sm"
          className="w-full"
          aria-label={`Download ${item.title}`}
        >
          <Download className="h-4 w-4 mr-2" aria-hidden="true" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default LibraryCard;