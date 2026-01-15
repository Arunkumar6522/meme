import React, { useLayoutEffect, useState, useEffect, useRef, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { Play, Pause, Download, Share2, Heart, Volume2, Maximize, MoreVertical, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui';
import { LibraryService } from '@/services/library.service';
import { useToast } from '@/hooks/useToast';
import { useFavorites } from '@/hooks/useFavorites';
import type { LibraryItem } from '@/types';
import { cn } from '@/utils/cn';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { DatabaseService } from '@/services/database.service';

interface LibraryCardProps {
  item: LibraryItem;
  className?: string;
  isAdmin?: boolean;
  locked?: boolean;
}

const LibraryCard: React.FC<LibraryCardProps> = memo(({ item, className, isAdmin = false, locked = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [resolvedFileUrl, setResolvedFileUrl] = useState<string>(item.file_url || '');
  const [resolvedThumbUrl, setResolvedThumbUrl] = useState<string>(item.thumbnail_url || '');
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { showSuccess, showError } = useToast();
  const mediaId = item.id;
  const { isFavorite, toggleFavorite } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuPanelRef = useRef<HTMLDivElement | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
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

  // Stop playback on global navigation/pagination changes
  useEffect(() => {
    const handler = () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.src = '';
        audioElementRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
    };
    window.addEventListener('media:stopAll', handler as EventListener);
    return () => window.removeEventListener('media:stopAll', handler as EventListener);
  }, []);
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

  // Single-open guarantee across the whole app (stronger than relying on events alone)
  useEffect(() => {
    if (!menuOpen) return;
    (window as any).__ilovememe_openMenuId = mediaId;
    return () => {
      if ((window as any).__ilovememe_openMenuId === mediaId) {
        (window as any).__ilovememe_openMenuId = null;
      }
    };
  }, [menuOpen, mediaId]);

  const positionMenu = useCallback(() => {
    const btn = menuButtonRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const padding = 8;
    const assumedWidth = 200; // close to w-44 (176px) + padding



    // Default: align menu's right edge to button's right edge
    let left = r.right - assumedWidth;
    left = Math.max(padding, Math.min(left, window.innerWidth - assumedWidth - padding));

    let top = r.bottom + 8;
    // If near bottom, try open upwards
    if (top > window.innerHeight - 220) {
      top = Math.max(padding, r.top - 8 - 220);
    }

    setMenuPos({ top, left });
  }, []);



  // Keep the portal menu positioned correctly
  useLayoutEffect(() => {
    if (!menuOpen) return;
    positionMenu();
    // After first paint, measure the actual panel height and adjust if needed
    requestAnimationFrame(() => {
      const panel = menuPanelRef.current;
      const btn = menuButtonRef.current;
      if (!panel || !btn) return;
      const pr = panel.getBoundingClientRect();
      const br = btn.getBoundingClientRect();
      const padding = 8;
      let top = br.bottom + 8;
      if (top + pr.height > window.innerHeight - padding) {
        top = Math.max(padding, br.top - 8 - pr.height);
      }
      let left = br.right - pr.width;
      left = Math.max(padding, Math.min(left, window.innerWidth - pr.width - padding));
      setMenuPos({ top, left });
    });
  }, [menuOpen, positionMenu]);

  useEffect(() => {
    if (!menuOpen) return;
    const onResizeOrScroll = () => positionMenu();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (menuPanelRef.current?.contains(target)) return;
      if (menuButtonRef.current?.contains(target)) return;
      setMenuOpen(false);
    };
    window.addEventListener('resize', onResizeOrScroll);
    window.addEventListener('scroll', onResizeOrScroll, true);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('resize', onResizeOrScroll);
      window.removeEventListener('scroll', onResizeOrScroll, true);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen, positionMenu]);


  const emitPlay = () => {
    window.dispatchEvent(new CustomEvent('media:play', { detail: mediaId }));
  };

  const ensureSignedUrls = useCallback(async (): Promise<{ fileUrl: string; thumbUrl: string }> => {
    // IMPORTANT: don't rely on async React state updates for immediate playback.
    // Fetch and return the URLs directly, then also cache them in state for later renders.
    let fileUrl = resolvedFileUrl || item.file_url || '';
    let thumbUrl = resolvedThumbUrl || item.thumbnail_url || '';

    if (!fileUrl) {
      const signed = await LibraryService.getSignedItemUrl(item.id, 'file');
      if (signed) {
        fileUrl = signed;
        setResolvedFileUrl(signed);
      }
    }

    if (!thumbUrl && (item.thumbnail_bucket || item.thumbnail_path)) {
      const signedThumb = await LibraryService.getSignedItemUrl(item.id, 'thumbnail');
      if (signedThumb) {
        thumbUrl = signedThumb;
        setResolvedThumbUrl(signedThumb);
      }
    }

    return { fileUrl, thumbUrl };
  }, [
    item.id,
    item.file_url,
    item.thumbnail_url,
    item.thumbnail_bucket,
    item.thumbnail_path,
    resolvedFileUrl,
    resolvedThumbUrl,
  ]);

  const handlePlay = useCallback(async () => {
    // Playback allowed for everyone
    const { fileUrl } = await ensureSignedUrls();
    if (!fileUrl) {
      showError('File unavailable. If you are admin, re-upload after running the DB migration for storage columns.', 'Playback Error');
      return;
    }
    if (item.media_type === 'audio') {
      if (isPlaying && audioElementRef.current) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          if (!audioElementRef.current) {
            const audio = new Audio(fileUrl);
            audio.preload = 'auto';
            audio.addEventListener('ended', () => setIsPlaying(false));
            audio.addEventListener('error', () => {
              setIsPlaying(false);
              showError('Failed to play audio', 'Playback Error');
            });
            audio.addEventListener('play', () => setIsPlaying(true));
            audio.addEventListener('pause', () => setIsPlaying(false));
            audioElementRef.current = audio;
          } else if (audioElementRef.current.src !== fileUrl) {
            // Signed URLs can expire; always refresh to the latest URL before playing.
            audioElementRef.current.pause();
            audioElementRef.current.src = fileUrl;
          }
          emitPlay();
          await audioElementRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing audio:', error);
          showError('Failed to play audio. Please try again.', 'Playback Error');
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
          if (videoRef.current.src !== fileUrl) {
            videoRef.current.src = fileUrl;
          }
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing video:', error);
          showError('Failed to play video. Please try again.', 'Playback Error');
        }
      }
    }
  }, [ensureSignedUrls, item.media_type, isPlaying, locked, navigate, showError]);

  const { user } = useAuth();

  const handleDownload = useCallback(async () => {
    if (downloading) return;
    if (locked) {
      showError('Login to unlock downloads.', 'Locked');
      navigate('/auth/login');
      return;
    }

    setDownloading(true);
    try {
      // Check download limits for authenticated users
      if (user) {
        const eligibility = await DatabaseService.checkDownloadEligibility(user.id);
        if (!eligibility.allowed) {
          if (eligibility.reason === 'limit_reached') {
            showError('Daily download limit reached (5/5). Upgrade to Pro for unlimited downloads!', 'Limit Reached');
            navigate('/pro');
            return;
          }
        }
      }

      // Increment download count (global stats)
      LibraryService.incrementDownloadCount(item.id).catch(() => { });

      // Record user download (personal stats & limit tracking)
      if (user) {
        DatabaseService.recordUserDownload(user.id, item.id).catch(() => { });
      }

      const signed = await LibraryService.getSignedItemUrl(item.id, 'file');
      const downloadUrl = signed || resolvedFileUrl || item.file_url;

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
  }, [item.id, item.file_url, item.title, item.media_type, resolvedFileUrl, downloading, showSuccess, showError, user, locked, navigate]);

  const handleLike = useCallback(async () => {
    if (locked) {
      showError('Login to use wishlist.', 'Locked');
      navigate('/auth/login');
      return;
    }
    try {
      await toggleFavorite(item.id);
      showSuccess(isFavorite(item.id) ? 'Removed from wishlist' : 'Added to wishlist', 'Wishlist');
    } catch (e: any) {
      showError('Failed to update wishlist', 'Error');
    }
  }, [locked, navigate, item.id, toggleFavorite, showError, showSuccess, isFavorite]);

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
        ref={menuButtonRef}
        onClick={(e) => {
          e.stopPropagation();
          emitMenuOpen();
          const openId = (window as any).__ilovememe_openMenuId as string | null | undefined;
          // If another menu is open, close it via the shared event and open this one.
          if (openId && openId !== mediaId) {
            window.dispatchEvent(new CustomEvent('menu:open', { detail: mediaId }));
            setMenuOpen(true);
            return;
          }
          setMenuOpen((prev) => !prev);
        }}
        className="w-9 h-9 rounded-full bg-white/95 hover:bg-orange-50 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-orange-300 active:scale-95 shadow-sm hover:shadow touch-manipulation border border-gray-200"
        aria-label="More actions"
        aria-expanded={menuOpen}
        aria-haspopup="menu"
      >
        <MoreVertical className="w-5 h-5 text-gray-700" />
      </button>
      {menuOpen &&
        createPortal(
          <div
            ref={menuPanelRef}
            className="fixed w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[9999]"
            style={{ top: menuPos.top, left: menuPos.left }}
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
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            )}
            {isAdmin && (
              <button
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                onClick={async (e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  try {
                    const ok = window.confirm(`Delete "${item.title}"? This cannot be undone.`);
                    if (!ok) return;
                    const success = await LibraryService.deleteLibraryItem(item.id);
                    if (!success) throw new Error('Delete failed');
                    showSuccess('Deleted', 'Library');
                    window.dispatchEvent(new CustomEvent('library:itemDeleted', { detail: item.id }));
                  } catch (err: any) {
                    showError(err?.message || 'Failed to delete', 'Error');
                  }
                }}
                role="menuitem"
              >
                <Trash2 className="w-4 h-4" />
                Delete
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
          </div>,
          document.body
        )}
    </div>
  );

  const renderVideo = () => (
    <div className="w-full">
      {/* Put the kebab OUTSIDE the <video> surface so it remains clickable on mobile and isn't clipped by overflow-hidden */}
      {!locked && (
        <div className="flex justify-end mb-2">
          {renderActionsMenu()}
        </div>
      )}

      <div className="relative w-full overflow-hidden rounded-lg shadow-sm border border-gray-200 bg-gray-900 aspect-video">
        {resolvedThumbUrl && !isPlaying ? (
          <img
            src={resolvedThumbUrl}
            alt={`Thumbnail for ${item.title}`}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={resolvedFileUrl || item.file_url}
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
    </div>
  );

  const renderAudio = () => (
    <div className="relative inline-block">
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
        {resolvedThumbUrl ? (
          <img
            src={resolvedThumbUrl}
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

        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-200 rounded-full">
          {isPlaying ? (
            <Pause className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white opacity-100 transition-opacity" />
          ) : (
            <Play className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>

      </button>
      {!locked && (
        <div className="absolute -right-3 -top-2 z-10 w-9 h-9">
          {renderActionsMenu()}
        </div>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        'w-full space-y-2 group',
        item.media_type === 'video' ? 'max-w-full' : 'max-w-[240px] sm:max-w-sm',
        className
      )}
    >
      {item.media_type === 'video' ? renderVideo() : renderAudio()}

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 text-center">
          {item.title}
        </h3>
      </div>

      {isAdmin && item.users && (
        <div className="text-xs text-center text-gray-500">
          By: {item.users.full_name || item.users.email || 'Unknown'}
        </div>
      )}

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