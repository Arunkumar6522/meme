import { useState, useEffect, useCallback } from 'react';
import { LibraryService } from '@/services/library.service';
import type { LibraryItem, LibraryFilters, PaginatedResponse } from '@/types';

export const useLibrary = (initialFilters: LibraryFilters = {}, initialPage = 1, perPage = 20) => {
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

  const fetchLibraryItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await LibraryService.getLibraryItems(filters, page, perPage);
      setData(response);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filters, page, perPage]);

  useEffect(() => {
    fetchLibraryItems();
  }, [fetchLibraryItems]);

  const updateFilters = useCallback((newFilters: LibraryFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
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
    data: data.data,
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
    if (!item) return null;

    try {
      // Increment download count
      await LibraryService.incrementDownloadCount(item.id);
      
      // Get download URL
      const downloadUrl = await LibraryService.getDownloadUrl(item.file_url);
      
      if (downloadUrl) {
        // Trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${item.title}.${item.media_type === 'audio' ? 'mp3' : 'mp4'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Update local state
        setItem(prev => prev ? { ...prev, download_count: prev.download_count + 1 } : null);
        
        return downloadUrl;
      }
      
      return null;
    } catch (err) {
      console.error('Error downloading item:', err);
      return null;
    }
  }, [item]);

  return {
    item,
    loading,
    error,
    downloadItem,
  };
};