import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Play, Pause, Download, Share2, Heart, Volume2, Video, Maximize } from 'lucide-react';
import { Button } from '@/components/ui';
import { LibraryService } from '@/services/library.service';
import { useToast } from '@/hooks/useToast';
import { useFavorites } from '@/hooks/useFavorites';
import type { LibraryItem } from '@/types';
import { cn } from '@/utils/cn';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui';
import Modal from '@/components/ui/Modal';

interface LibraryCardProps {
  item: LibraryItem;
  className?: string;
  isAdmin?: boolean;
}

const LibraryCard: React.FC<LibraryCardProps> = memo(({ item, className, isAdmin = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { showSuccess, showError } = useToast();
  const mediaId = item.id;
  const { isFavorite, toggleFavorite } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editDescription, setEditDescription] = useState(item.description || '');
  const [editKeywords, setEditKeywords] = useState(item.keywords?.join(', ') || '');
  const navigate = useNavigate();

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

  // Cleanup media on unmount
  useEffect(() => {
    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.src = '';
        audioElementRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  // Stop playback when another media starts or menu opens
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail !== mediaId) {
        if (audioElementRef.current) {
          audioElementRef.current.pause();
          setIsPlaying(false);
        }
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    };
    window.addEventListener('media:play', handler as EventListener);
    return () => window.removeEventListener('media:play', handler as EventListener);
  }, [mediaId]);
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail !== mediaId) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('menu:open', handler as EventListener);
    return () => window.removeEventListener('menu:open', handler as EventListener);
  }, [mediaId]);

  const emitMenuOpen = () => {
    window.dispatchEvent(new CustomEvent('menu:open', { detail: mediaId }));
  };


  const emitPlay = () => {
    window.dispatchEvent(new CustomEvent('media:play', { detail: mediaId }));
  };

  const handlePlay = useCallback(async () => {
    if (item.media_type === 'audio') {
      if (isPlaying && audioElementRef.current) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          if (!audioElementRef.current) {
            const audio = new Audio(item.file_url);
            audio.preload = 'auto';
            audio.addEventListener('ended', () => setIsPlaying(false));
            audio.addEventListener('error', () => {
              setIsPlaying(false);
              showError('Failed to play audio', 'Playback Error');
            });
            audio.addEventListener('play', () => setIsPlaying(true));
            audio.addEventListener('pause', () => setIsPlaying(false));
            audioElementRef.current = audio;
          }
          emitPlay();
          await audioElementRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing audio:', error);
          showError('Failed to play audio', 'Playback Error');
        }
      }
    } else {
      // Inline video playback
      if (!videoRef.current) return;
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          emitPlay();
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing video:', error);
          showError('Failed to play video', 'Playback Error');
        }
      }
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

  const handleLike = useCallback(async () => {
    try {
      await toggleFavorite(item.id);
      showSuccess(isFavorite(item.id) ? 'Removed from wishlist' : 'Added to wishlist', 'Wishlist');
    } catch (e: any) {
      showError('Failed to update wishlist', 'Error');
    }
  }, [item.id, toggleFavorite, showError, showSuccess, isFavorite]);

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

  const renderActionsMenu = () => (
    <div className="relative inline-block text-left">
      <button
        onClick={(e) => {
          e.stopPropagation();
          emitMenuOpen();
          setMenuOpen((prev) => !prev);
        }}
        className="w-10 h-10 rounded-full bg-white hover:bg-orange-50 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-orange-300 active:scale-95 shadow-sm hover:shadow touch-manipulation"
        aria-label="More actions"
      >
        <span className="sr-only">More actions</span>
        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm4 2a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </button>
      {menuOpen && (
        <div
          className="absolute right-0 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
          role="menu"
        >
          <button
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
              setMenuOpen(false);
            }}
            role="menuitem"
          >
            <Heart className="w-4 h-4" />
            {isFavorite(item.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          </button>
          <button
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
              setMenuOpen(false);
            }}
            role="menuitem"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
              setMenuOpen(false);
            }}
            role="menuitem"
            disabled={downloading}
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Downloading…' : 'Download'}
          </button>
          {isAdmin && (
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation();
                setEditOpen(true);
                setMenuOpen(false);
              }}
              role="menuitem"
            >
              <Share2 className="w-4 h-4" />
              Edit
            </button>
          )}
          {item.media_type === 'video' && (
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation();
                if (videoRef.current?.requestFullscreen) {
                  videoRef.current.requestFullscreen();
                } else {
                  window.open(item.file_url, '_blank', 'noopener,noreferrer');
                }
                setMenuOpen(false);
              }}
              role="menuitem"
            >
              <Maximize className="w-4 h-4" />
              Full view
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderVideo = () => (
    <div className="relative w-full overflow-hidden rounded-lg shadow-sm border border-gray-200 bg-gray-900 aspect-video">
      {item.thumbnail_url && !isPlaying ? (
        <img
          src={item.thumbnail_url}
          alt={`Thumbnail for ${item.title}`}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={item.file_url}
          playsInline
          controls
          onPlay={() => {
            emitPlay();
            setIsPlaying(true);
          }}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      )}
      {!isPlaying && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
          aria-label={`Play ${item.title}`}
        >
          <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Play className="h-6 w-6 text-orange-600 ml-0.5" />
          </div>
        </button>
      )}
      {isPlaying && (
        <button
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.pause();
            }
            setIsPlaying(false);
          }}
          className="absolute bottom-2 left-2 px-3 py-1 rounded-full bg-black/70 text-white text-xs"
          aria-label="Stop video"
        >
          Stop
        </button>
      )}
      {item.duration && (
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs">
          {formatDuration(item.duration)}
        </div>
      )}
    </div>
  );

  const renderAudio = () => (
    <button
      onClick={handlePlay}
      className={cn(
        'relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full shadow-lg hover:shadow-xl',
        'transition-all duration-200 transform hover:scale-105 active:scale-95',
        'focus:outline-none focus:ring-4 focus:ring-orange-300 focus:ring-offset-2',
        'overflow-hidden border-2 sm:border-4 border-white',
        'touch-manipulation',
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
          <Volume2 className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white" aria-hidden="true" />
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-full">
        {isPlaying ? (
          <Pause className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white opacity-100 transition-opacity" />
        ) : (
          <Play className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </button>
  );

  return (
    <div className={cn('w-full max-w-sm space-y-2 group', className)}>
      {item.media_type === 'video' ? renderVideo() : renderAudio()}

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 text-center">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-xs text-gray-600 line-clamp-2 text-center">{item.description}</p>
        )}
        <div className="flex items-center justify-center gap-2">
          <span className={cn('text-[11px] px-2 py-1 rounded-full border', emotionColors[item.emotion] || 'bg-gray-100 text-gray-700 border-gray-200')}>
            {item.emotion}
          </span>
          {item.file_size && (
            <span className="text-[11px] text-gray-500">{formatFileSize(item.file_size)}</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center">
        {renderActionsMenu()}
      </div>

      {isAdmin && editOpen && (
        <Modal open onClose={() => setEditOpen(false)} title="Edit item">
          <div className="space-y-3">
            <Input
              label="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <Input
              label="Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <Input
              label="Keywords (comma separated)"
              value={editKeywords}
              onChange={(e) => setEditKeywords(e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  const keywordsArray = editKeywords
                    .split(',')
                    .map((k) => k.trim())
                    .filter(Boolean);
                  const updates: Partial<LibraryItem> = {
                    title: editTitle.trim(),
                    description: editDescription.trim() || null,
                    keywords: keywordsArray,
                  };
                  await LibraryService.updateLibraryItem(item.id, updates);
                  showSuccess('Updated', 'Library');
                  setEditOpen(false);
                } catch (e: any) {
                  showError(e.message || 'Failed to update', 'Error');
                }
              }}
            >
              Save
            </Button>
          </div>
        </Modal>
      )}
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