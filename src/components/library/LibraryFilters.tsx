import React from 'react';
import { Search, Filter, Mic } from 'lucide-react';
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
  const [searchInput, setSearchInput] = React.useState(filters.search || '');
  const [isListening, setIsListening] = React.useState(false);
  const searchTimer = React.useRef<number | null>(null);

  // Keep local input in sync if filters are changed externally (e.g. URL search)
  React.useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  // Debounce search to reduce API calls while typing
  React.useEffect(() => {
    if (searchTimer.current) window.clearTimeout(searchTimer.current);
    searchTimer.current = window.setTimeout(() => {
      const next = searchInput;
      if ((filters.search || '') !== next) {
        onFiltersChange({ ...filters, search: next });
      }
    }, 350);
    return () => {
      if (searchTimer.current) window.clearTimeout(searchTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search is not supported in this browser.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchInput(transcript); // Set input
      onFiltersChange({ ...filters, search: transcript }); // Trigger search
    };

    recognition.start();
  };

  return (
    <div className={className}>
      {/* Search Bar - Always Visible */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <Input
          type="text"
          placeholder={isListening ? "Listening..." : "Search memes by title, description, or keywords..."}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value.slice(0, 40))}
          maxLength={40}
          className="pl-10 pr-10" // Added right padding for Mic
          aria-label="Search memes"
        />
        <button
          type="button"
          onClick={startListening}
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-orange-600"
          title="Voice Search"
        >
          <Mic className={`h-5 w-5 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
        </button>
      </div>
// ... rest of the file

      {/* Artist filter (multi) */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by artist/character</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {artists.map((artist) => (
            <span
              key={artist}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
            >
              {artist}
              <button
                type="button"
                className="ml-1 text-orange-700 hover:text-orange-900"
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    artist: artists.filter((a) => a !== artist),
                  })
                }
                aria-label={`Remove ${artist}`}
              >
                ×
              </button>
            </span>
          ))}
          {artists.length === 0 && (
            <span className="text-xs text-gray-500">None</span>
          )}
        </div>
        <input
          type="text"
          value={artistQuery}
          onChange={(e) => setArtistQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const newArtist = artistQuery.trim() || 'Unknown artist';
              if (!artists.includes(newArtist)) {
                onFiltersChange({ ...filters, artist: [...artists, newArtist] });
              }
              setArtistQuery('');
            }
          }}
          placeholder="Type and press Enter to add (e.g., Unknown artist)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          aria-label="Add artist filter"
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
        className={`mt-4 space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-4 ${isExpanded ? 'block' : 'hidden md:grid'
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
          {filters.artist && filters.artist.length > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Artist: "{filters.artist.join(', ')}"
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