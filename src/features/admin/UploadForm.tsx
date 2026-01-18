import React, { useState, useRef } from 'react';
import { Upload, X, Play, Pause, Volume2, Video } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { LibraryService } from '@/services/library.service';
import { ArtistService } from '@/services/artist.service';
import type { EmotionType } from '@/types';
import { cn } from '@/utils/cn';
import { compressImageToThumbnail } from '@/utils/imageCompression';

interface UploadFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface UploadData {
  title: string;
  artists: string[];
  languages: string[];
  description: string;
  keywords: string;
  emotion: EmotionType;
  mediaType: 'audio' | 'video' | 'image';
  file: File | null;
  thumbnail: File | null;
}

const emotionOptions = [
  { value: '', label: 'Select Emotion' },
  { value: 'happy', label: 'Happy 😊' },
  { value: 'sad', label: 'Sad 😢' },
  { value: 'funny', label: 'Funny 😂' },
  { value: 'thug', label: 'Thug 😎' },
  { value: 'angry', label: 'Angry 😠' },
  { value: 'surprised', label: 'Surprised 😱' },
  { value: 'confused', label: 'Confused 🤔' },
  { value: 'excited', label: 'Excited 🤩' },
  { value: 'dark', label: 'Dark 💀' },
  { value: '18+', label: '18+ (Adult) 🔞' },
];



const UploadForm: React.FC<UploadFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<UploadData>({
    title: '',
    artists: [],
    languages: ['English', 'Tamil'],
    description: '',
    keywords: '',
    emotion: '' as EmotionType,
    mediaType: 'audio',
    file: null,
    thumbnail: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [artists, setArtists] = useState<string[]>([]);
  const [artistQuery, setArtistQuery] = useState('');
  const languages = ['English', 'Tamil', 'Malayalam', 'Kannada', 'Hindi', 'Telugu'];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Reset thumbnail when switching to video (not needed)
  const setMediaType = (type: 'audio' | 'video' | 'image') => {
    setFormData(prev => ({
      ...prev,
      mediaType: type,
      thumbnail: type === 'video' || type === 'image' ? null : prev.thumbnail,
    }));
    setErrors(prev => ({ ...prev, mediaType: '' }));
  };

  // Capture a frame from a video file to use as thumbnail
  const captureVideoThumbnail = (file: File): Promise<File | null> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const url = URL.createObjectURL(file);

      const cleanup = () => {
        URL.revokeObjectURL(url);
      };

      video.preload = 'metadata';
      video.src = url;
      video.muted = true;
      video.playsInline = true;

      video.onloadedmetadata = () => {
        const targetTime = Math.min(1, Math.max(0.1, video.duration ? video.duration * 0.1 : 0.1));
        video.currentTime = targetTime;
      };

      video.onerror = () => {
        cleanup();
        resolve(null);
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          const width = video.videoWidth || 640;
          const height = video.videoHeight || 360;
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              cleanup();
              if (!blob) {
                resolve(null);
                return;
              }
              const thumbFile = new File([blob], `thumb-${Date.now()}.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(thumbFile);
            },
            'image/jpeg',
            0.8
          );
        } catch (err) {
          console.error('Failed to capture video thumbnail', err);
          cleanup();
          resolve(null);
        }
      };
    });
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isAudio = file.type.startsWith('audio/');
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isAudio && !isVideo && !isImage) {
      setErrors(prev => ({ ...prev, file: 'Please select an audio, video, or image file' }));
      return;
    }

    // Validate file size (100MB for video/audio, 10MB for images)
    const maxSize = isImage ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
    if (file.size > maxSize) {
      const limit = isImage ? '10MB' : '100MB';
      setErrors(prev => ({ ...prev, file: `File size must be less than ${limit}` }));
      return;
    }

    // Auto-detect media type
    const mediaType = isAudio ? 'audio' : isVideo ? 'video' : 'image';

    setFormData(prev => ({
      ...prev,
      file,
      mediaType,
      title: prev.title || file.name.replace(/\.[^/.]+$/, '') // Auto-fill title from filename
    }));

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Clear file error
    setErrors(prev => ({ ...prev, file: '' }));
  };

  // Handle thumbnail selection with compression
  const handleThumbnailSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate image file
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, thumbnail: 'Please select an image file' }));
      return;
    }

    try {
      // Compress image to circular thumbnail (max 200x200, ~50KB)
      const compressedBlob = await compressImageToThumbnail(file, {
        maxWidth: 200,
        maxHeight: 200,
        quality: 0.7,
        format: 'image/jpeg',
      });

      // Convert blob to File
      const compressedFile = new File([compressedBlob], file.name, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });

      setFormData(prev => ({ ...prev, thumbnail: compressedFile }));
      setErrors(prev => ({ ...prev, thumbnail: '' }));
    } catch (error) {
      console.error('Error compressing thumbnail:', error);
      setErrors(prev => ({ ...prev, thumbnail: 'Failed to process thumbnail image' }));
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof UploadData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.emotion) {
      newErrors.emotion = 'Please select an emotion';
    }

    if (!formData.file) {
      newErrors.file = 'Please select a file to upload';
    }

    if (!formData.keywords.trim()) {
      newErrors.keywords = 'Keywords are required (comma-separated)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm() || !user || !formData.file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload main file (secure: backend-minted signed upload URL)
      setUploadProgress(25);
      const bucketType = formData.mediaType === 'audio' ? 'audio' : formData.mediaType === 'video' ? 'video' : 'image';
      const fileUpload = await LibraryService.uploadFileSigned(
        formData.file,
        bucketType
      );

      setUploadProgress(50);

      // Upload thumbnail if provided or auto-generate for video (not needed for images)
      let thumbnailUpload: { bucket: string; path: string } | null = null;
      if (formData.thumbnail) {
        thumbnailUpload = await LibraryService.uploadFileSigned(formData.thumbnail, 'thumbnail');
      } else if (formData.mediaType === 'video') {
        setUploadProgress(60);
        const generatedThumb = await captureVideoThumbnail(formData.file);
        if (generatedThumb) {
          thumbnailUpload = await LibraryService.uploadFileSigned(generatedThumb, 'thumbnail');
        }
      }
      // For images, the image itself serves as the thumbnail

      setUploadProgress(75);

      // Create library item
      const artistTags = formData.artists.map(a => a.trim()).filter(Boolean);
      const keywordsArray = Array.from(
        new Set([
          ...artistTags,
          ...formData.keywords
            .split(',')
            .map(k => k.trim())
            .filter(k => k.length > 0),
        ])
      );

      const libraryItem = await LibraryService.createLibraryItem({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        keywords: keywordsArray,
        emotion: formData.emotion,
        media_type: formData.mediaType,
        // Buckets can be private; we store bucket/path and (optionally) keep legacy url empty
        file_url: '',
        file_bucket: fileUpload.bucket,
        file_path: fileUpload.path,
        thumbnail_url: undefined,
        thumbnail_bucket: thumbnailUpload?.bucket,
        thumbnail_path: thumbnailUpload?.path,
        duration: formData.mediaType === 'audio' ? await getAudioDuration(formData.file) : undefined,
        file_size: formData.file.size,
        is_published: true, // Auto-publish for now
        created_by: user.id,
        languages: formData.languages,
      });

      if (!libraryItem) {
        throw new Error('Failed to create library item');
      }

      setUploadProgress(100);

      // Success!
      setTimeout(() => {
        onSuccess?.();
      }, 500);

    } catch (error) {
      console.error('Upload error:', error);
      setErrors({ general: (error as Error).message || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  // Get audio duration
  const getAudioDuration = (file: File): Promise<number | undefined> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('audio/')) {
        resolve(undefined);
        return;
      }

      const audio = new Audio();
      audio.addEventListener('loadedmetadata', () => {
        resolve(Math.round(audio.duration));
      });
      audio.addEventListener('error', () => {
        resolve(undefined);
      });
      audio.src = URL.createObjectURL(file);
    });
  };

  // Handle audio preview
  const toggleAudioPreview = () => {
    if (!audioRef.current || !previewUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Clean up preview URL
  React.useEffect(() => {
    const loadArtists = async () => {
      try {
        const list = await ArtistService.list();
        setArtists(list.map(a => a.name));
      } catch {
        // ignore
      }
    };
    loadArtists();

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Upload New Meme</h2>
        <p className="text-gray-600 mt-1">Add a new audio or video meme to the library</p>
        {user?.email && (
          <p className="text-xs text-gray-500 mt-2">You are uploading as {user.email}</p>
        )}
      </div>

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Media Type Selection First */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Media Type *
          </label>
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => {
                setMediaType('audio');
                // Clear file if switching media type
                if (formData.file && formData.mediaType !== 'audio') {
                  setFormData(prev => ({ ...prev, file: null, thumbnail: null }));
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }
              }}
              className={cn(
                'p-4 border-2 rounded-lg transition-all',
                formData.mediaType === 'audio'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              )}
            >
              <Volume2 className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <span className="text-sm font-medium">Audio</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMediaType('video');
                // Clear file if switching media type
                if (formData.file && formData.mediaType !== 'video') {
                  setFormData(prev => ({ ...prev, file: null, thumbnail: null }));
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }
              }}
              className={cn(
                'p-4 border-2 rounded-lg transition-all',
                formData.mediaType === 'video'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              )}
            >
              <Video className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <span className="text-sm font-medium">Video</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMediaType('image');
                // Clear file if switching media type
                if (formData.file && formData.mediaType !== 'image') {
                  setFormData(prev => ({ ...prev, file: null, thumbnail: null }));
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }
              }}
              className={cn(
                'p-4 border-2 rounded-lg transition-all',
                formData.mediaType === 'image'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              )}
            >
              <svg className="h-8 w-8 mx-auto mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Image</span>
            </button>
          </div>
        </div>

        {/* Emotion Selection */}
        <Select
          label="Emotion/Category *"
          value={formData.emotion}
          onChange={handleInputChange('emotion')}
          options={emotionOptions}
          error={errors.emotion}
          required
        />

        {/* Title */}
        <Input
          label="Title *"
          value={formData.title}
          onChange={handleInputChange('title')}
          error={errors.title}
          placeholder="Enter meme title"
          required
        />

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Languages *
          </label>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => {
              const active = formData.languages.includes(lang);
              return (
                <button
                  type="button"
                  key={lang}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      languages: active
                        ? prev.languages.filter((l) => l !== lang)
                        : [...prev.languages, lang],
                    }));
                  }}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm border transition-colors',
                    active
                      ? 'bg-primary-100 text-primary-700 border-primary-200'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  )}
                  aria-pressed={active}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>

        {/* Artist / Character (multi-select tags) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Artist / Character
          </label>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {formData.artists.map((artist) => (
                <span
                  key={artist}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {artist}
                  <button
                    type="button"
                    className="text-primary-700 hover:text-primary-900"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        artists: prev.artists.filter(a => a !== artist),
                      }));
                    }}
                    aria-label={`Remove ${artist}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                value={artistQuery}
                onChange={(e) => setArtistQuery(e.target.value)}
                placeholder="Type to add or select"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const newArtist = artistQuery.trim();
                    if (newArtist && !formData.artists.includes(newArtist)) {
                      setFormData(prev => ({ ...prev, artists: [...prev.artists, newArtist] }));
                      if (!artists.includes(newArtist)) setArtists(prev => [...prev, newArtist]);
                    }
                    setArtistQuery('');
                  }
                }}
              />
              {artistQuery && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto">
                  {artists
                    .filter((name) => name.toLowerCase().includes(artistQuery.toLowerCase()))
                    .slice(0, 6)
                    .map((name) => (
                      <button
                        type="button"
                        key={name}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                        onClick={() => {
                          if (!formData.artists.includes(name)) {
                            setFormData(prev => ({ ...prev, artists: [...prev.artists, name] }));
                          }
                          setArtistQuery('');
                        }}
                      >
                        {name}
                      </button>
                    ))}
                  {!artists.length && (
                    <div className="px-3 py-2 text-sm text-gray-500">No suggestions</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description - Hidden as requested
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={handleInputChange('description')}
            placeholder="Optional description of the meme"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        */}

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload {formData.mediaType === 'audio' ? 'Audio' : 'Video'} File *
          </label>

          {!formData.file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-400 transition-colors',
                errors.file && 'border-red-300'
              )}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Click to upload audio or video file</p>
              <p className="text-sm text-gray-500">MP3, WAV, MP4, WebM up to 100MB</p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {formData.mediaType === 'audio' ? (
                    <Volume2 className="h-8 w-8 text-primary-600" />
                  ) : (
                    <Video className="h-8 w-8 text-primary-600" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{formData.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, file: null }));
                    setPreviewUrl(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Audio Preview */}
              {formData.mediaType === 'audio' && previewUrl && (
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={toggleAudioPreview}
                    className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full hover:bg-primary-200 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5 text-primary-600" />
                    ) : (
                      <Play className="h-5 w-5 text-primary-600 ml-0.5" />
                    )}
                  </button>
                  <span className="text-sm text-gray-600">Preview</span>
                  <audio
                    ref={audioRef}
                    src={previewUrl}
                    onEnded={() => setIsPlaying(false)}
                    onError={() => setIsPlaying(false)}
                  />
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/*,image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {errors.file && (
            <p className="mt-1 text-sm text-red-600">{errors.file}</p>
          )}
        </div>

        {/* Keywords */}
        <Input
          label="Keywords"
          value={formData.keywords}
          onChange={handleInputChange('keywords')}
          error={errors.keywords}
          placeholder="funny, reaction, sound effect (comma-separated)"
          helperText="Add relevant keywords to help users find this meme"
          required
        />

        {/* Thumbnail Upload - audio only */}
        {formData.mediaType === 'audio' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail (Optional for audio)
            </label>
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => thumbnailInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {formData.thumbnail ? 'Change Thumbnail' : 'Add Thumbnail'}
              </Button>
              {formData.thumbnail && (
                <span className="text-sm text-gray-600">{formData.thumbnail.name}</span>
              )}
            </div>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailSelect}
              className="hidden"
            />
            {errors.thumbnail && (
              <p className="mt-1 text-sm text-red-600">{errors.thumbnail}</p>
            )}
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Uploading...</span>
              <span className="text-gray-900 font-medium">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={uploading}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            loading={uploading}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Meme'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;