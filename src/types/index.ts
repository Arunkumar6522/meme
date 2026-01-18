// Database Types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'user' | 'admin' | 'superadmin';
  is_premium?: boolean;
  preferred_languages?: string[];
  created_at: string;
  updated_at: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  description?: string;
  keywords: string[];
  emotion: EmotionType;
  media_type: 'audio' | 'video' | 'image';
  file_url: string;
  thumbnail_url?: string;
  // For private buckets + signed URLs
  file_bucket?: string;
  file_path?: string;
  thumbnail_bucket?: string;
  thumbnail_path?: string;
  duration?: number;
  file_size?: number;
  is_published: boolean;
  download_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  languages?: string[];
  users?: {
    full_name?: string;
    email?: string;
  };
}

// Emotion categories for filtering
export type EmotionType =
  | 'happy'
  | 'sad'
  | 'funny'
  | 'thug'
  | 'angry'
  | 'surprised'
  | 'confused'
  | 'excited'
  | 'dramatic'
  | 'sarcastic';

// Filter and Sort Types
export interface LibraryFilters {
  search?: string;
  emotion?: EmotionType;
  media_type?: 'audio' | 'video';
  artist?: string[];
  languages?: string[];
  sort_by?: 'trending' | 'latest' | 'title';
}

// Auth Types
export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

// Component Props Types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  asChild?: boolean;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Upload Types
export interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

// Search Analytics Types
export interface SearchAnalytics {
  id: string;
  user_id?: string;
  user_email?: string;
  search_query: string;
  filters: Record<string, any>;
  results_count: number;
  media_type?: string;
  emotion?: string;
  languages?: string[];
  searched_at: string;
}