import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input, Select, Button } from '@/components/ui';
import type { LibraryFilters, EmotionType } from '@/types';

interface LibraryFiltersProps {
  filters: LibraryFilters;
  onFiltersChange: (filters: LibraryFilters) => void;
  className?: string;
}

const emotionOptions = [
  { value: '', label: 'All Emotions' },
  { value: 'happy', label: 'Happy' },
  { value: 'sad', label: 'Sad' },
  { value: 'funny', label: 'Funny' },
  { value: 'thug', label: 'Thug' },
  { value: 'angry', label: 'Angry' },
  { value: 'surprised', label: 'Surprised' },
  { value: 'confused', label: 'Confused' },
  { value: 'excited', label: 'Excited' },
  { value: 'dramatic', label: 'Dramatic' },
  { value: 'sarcastic', label: 'Sarcastic' },
];

const mediaTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'audio', label: 'Audio' },
  { value: 'video', label: 'Video' },
];

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'trending', label: 'Trending' },
  { value: 'title', label: 'Title A-Z' },
];

const LibraryFilters: React.FC<LibraryFiltersProps> = ({
  filters,
  onFiltersChange,
  className,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleArtistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, artist: e.target.value });
  };

  const handleEmotionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      emotion: e.target.value as EmotionType | undefined,
    });
  };

  const handleMediaTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      media_type: e.target.value as 'audio' | 'video' | undefined,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      sort_by: e.target.value as 'trending' | 'latest' | 'title',
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      artist: '',
      emotion: undefined,
      media_type: undefined,
      sort_by: 'latest',
    });
  };

  const hasActiveFilters = filters.search || filters.artist || filters.emotion || filters.media_type;

  return (
    <div className={className}>
      {/* Search Bar - Always Visible */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <Input
          type="text"
          placeholder="Search memes by title, description, or keywords..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          className="pl-10 pr-4"
          aria-label="Search memes"
        />
      </div>

      {/* Artist filter */}
      <div className="mt-4">
        <Input
          type="text"
          placeholder="Filter by artist/character"
          value={filters.artist || ''}
          onChange={handleArtistChange}
          aria-label="Filter by artist"
        />
      </div>

      {/* Filter Toggle Button - Mobile */}
      <div className="flex items-center justify-between mt-4 md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls="filter-options"
        >
          <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Filter Options */}
      <div
        id="filter-options"
        className={`mt-4 space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-4 ${
          isExpanded ? 'block' : 'hidden md:grid'
        }`}
      >
        <Select
          label="Emotion"
          value={filters.emotion || ''}
          onChange={handleEmotionChange}
          options={emotionOptions}
          aria-label="Filter by emotion"
        />

        <Select
          label="Media Type"
          value={filters.media_type || ''}
          onChange={handleMediaTypeChange}
          options={mediaTypeOptions}
          aria-label="Filter by media type"
        />

        <Select
          label="Sort By"
          value={filters.sort_by || 'latest'}
          onChange={handleSortChange}
          options={sortOptions}
          aria-label="Sort results"
        />

        <div className="flex items-end">
          <Button
            variant="outline"
            size="md"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className="w-full md:w-auto"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2" role="status" aria-live="polite">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.search && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Search: "{filters.search}"
            </span>
          )}
          {filters.artist && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Artist: "{filters.artist}"
            </span>
          )}
          {filters.emotion && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Emotion: {filters.emotion}
            </span>
          )}
          {filters.media_type && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Type: {filters.media_type}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default LibraryFilters;