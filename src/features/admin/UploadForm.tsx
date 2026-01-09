import React, { useState, useRef } from 'react';
import { Upload, X, Play, Pause, Volume2, Video } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { LibraryService } from '@/services/library.service';
import type { EmotionType } from '@/types';
import { cn } from '@/utils/cn';

interface UploadFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface UploadData {
  title: string;
  description: string;
  keywords: string;
  emotion: EmotionType;
  mediaType: 'audio' | 'video';
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
  { value: 'dramatic', label: 'Dramatic 🎭' },
  { value: 'sarcastic', label: 'Sarcastic 🙄' },
];

const UploadForm: React.FC<UploadFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<UploadData>({
    title: '',
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
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isAudio = file.type.startsWith('audio/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isAudio && !isVideo) {
      setErrors(prev => ({ ...prev, file: 'Please select an audio or video file' }));
      return;
    }

    // Validate file size (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, file: 'File size must be less than 100MB' }));
      return;
    }

    // Auto-detect media type
    const mediaType = isAudio ? 'audio' : 'video';
    
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

  // Handle thumbnail selection
  const handleThumbnailSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate image file
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, thumbnail: 'Please select an image file' }));
      return;
    }

    // Validate file size (5MB max for thumbnails)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, thumbnail: 'Thumbnail size must be less than 5MB' }));
      return;
    }

    setFormData(prev => ({ ...prev, thumbnail: file }));
    setErrors(prev => ({ ...prev, thumbnail: '' }));
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
      // Upload main file
      const bucket = formData.mediaType === 'audio' ? 'library-audio' : 'library-video';
      const fileName = `${Date.now()}-${formData.file.name}`;
      
      setUploadProgress(25);
      const fileUrl = await LibraryService.uploadFile(formData.file, bucket, fileName);
      
      if (!fileUrl) {
        throw new Error('Failed to upload file');
      }

      setUploadProgress(50);

      // Upload thumbnail if provided
      let thumbnailUrl: string | undefined;
      if (formData.thumbnail) {
        const thumbnailFileName = `thumb-${Date.now()}-${formData.thumbnail.name}`;
        thumbnailUrl = await LibraryService.uploadFile(formData.thumbnail, 'thumbnails', thumbnailFileName);
      }

      setUploadProgress(75);

      // Create library item
      const keywordsArray = formData.keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);

      const libraryItem = await LibraryService.createLibraryItem({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        keywords: keywordsArray,
        emotion: formData.emotion,
        media_type: formData.mediaType,
        file_url: fileUrl,
        thumbnail_url: thumbnailUrl,
        duration: formData.mediaType === 'audio' ? await getAudioDuration(formData.file) : undefined,
        file_size: formData.file.size,
        is_published: true, // Auto-publish for now
        created_by: user.id,
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
      </div>

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Media File *
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
            accept="audio/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {errors.file && (
            <p className="mt-1 text-sm text-red-600">{errors.file}</p>
          )}
        </div>

        {/* Title */}
        <Input
          label="Title"
          value={formData.title}
          onChange={handleInputChange('title')}
          error={errors.title}
          placeholder="Enter meme title"
          required
        />

        {/* Description */}
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

        {/* Emotion */}
        <Select
          label="Emotion"
          value={formData.emotion}
          onChange={handleInputChange('emotion')}
          options={emotionOptions}
          error={errors.emotion}
          required
        />

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail (Optional)
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