import { useState, useEffect, useCallback, useRef } from 'react';
import { LibraryService } from '@/services/library.service';
import type { LibraryItem, LibraryFilters, PaginatedResponse } from '@/types';

export const useLibrary = (initialFilters: LibraryFilters = {}, initialPage = 1, perPage = 20) => {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [data, setData] = useState<PaginatedResponse<LibraryItem>>({
    data: [],
    count: 0,
    page: initialPage,
    per_page: perPage,
    total_pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LibraryFilters>(initialFilters);
  const [page, setPage] = useState(initialPage);
  // Track previous filters to detect when to reset list
  const prevFiltersRef = useRef(JSON.stringify(initialFilters));

  // Use ref to always have latest filters without causing re-renders
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchLibraryItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const currentFiltersJson = JSON.stringify(filtersRef.current);
      const isNewFilter = currentFiltersJson !== prevFiltersRef.current;

      if (isNewFilter) {
        setPage(1);
        prevFiltersRef.current = currentFiltersJson;
        // Don't reset items here if we want smoother transition, 
        // but for correctness with new filters we should usually clear
      }

      // Use ref to get latest filters
      const response = await LibraryService.getLibraryItems(filtersRef.current, page, perPage);
      setData(response);

      setItems(prevItems => {
        if (page === 1) return response.data;
        // Filter out duplicates just in case
        const existingIds = new Set(prevItems.map(i => i.id));
        const newItems = response.data.filter(i => !existingIds.has(i.id));
        return [...prevItems, ...newItems];
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  // Reset page when filters change (detected via useEffect on filters)
  useEffect(() => {
    const currentFiltersJson = JSON.stringify(filters);
    if (currentFiltersJson !== prevFiltersRef.current) {
      setPage(1);
      setItems([]); // Clear items immediately on filter change
      // fetchLibraryItems will be called by the next useEffect due to filtersKey change logic or explicit call
    }
  }, [filters]);

  useEffect(() => {
    fetchLibraryItems();
  }, [fetchLibraryItems]);

  const updateFilters = useCallback((newFilters: LibraryFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change - this will trigger fetchLibraryItems via page dependency
  }, []);

  const nextPage = useCallback(() => {
    if (page < data.total_pages) {
      setPage(prev => prev + 1);
    }
  }, [page, data.total_pages]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }, [page]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= data.total_pages) {
      setPage(newPage);
    }
  }, [data.total_pages]);

  const refresh = useCallback(() => {
    fetchLibraryItems();
  }, [fetchLibraryItems]);

  return {
    data: items,
    count: data.count,
    page,
    totalPages: data.total_pages,
    loading,
    error,
    filters,
    updateFilters,
    nextPage,
    prevPage,
    goToPage,
    refresh,
  };
};

export const useLibraryItem = (id: string) => {
  const [item, setItem] = useState<LibraryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await LibraryService.getLibraryItem(id);
        setItem(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  const downloadItem = useCallback(async () => {
    if (!item) {
      throw new Error('Item not found');
    }

    try {
      // Increment download count (don't wait for it to complete)
      LibraryService.incrementDownloadCount(item.id).catch(err => {
        console.warn('Failed to increment download count:', err);
      });

      // Use the file_url directly - it should be a public URL from Supabase storage
      const downloadUrl = item.file_url;

      if (!downloadUrl) {
        throw new Error('File URL not available');
      }

      // Fetch the file and create a blob URL for download
      try {
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

        // Update local state
        setItem(prev => prev ? { ...prev, download_count: prev.download_count + 1 } : null);

        return downloadUrl;
      } catch (fetchError) {
        // Fallback: try direct download link
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${item.title.replace(/[^a-z0-9]/gi, '_')}.${item.media_type === 'audio' ? 'mp3' : 'mp4'}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);

        return downloadUrl;
      }
    } catch (err) {
      console.error('Error downloading item:', err);
      throw err; // Re-throw to show error to user
    }
  }, [item]);

  return {
    item,
    loading,
    error,
    downloadItem,
  };
};