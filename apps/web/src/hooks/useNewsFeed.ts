'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import type { INews } from '@newsapp/shared';

export interface UseNewsFeedOptions {
  category: string;
  limit?: number;
}

export interface UseNewsFeedResult {
  docs: INews[];
  page: number;
  hasNextPage: boolean;
  isLoading: boolean;
  error: string | null;
  loadMore: () => void;
  retry: () => void;
}

const DEFAULT_LIMIT = 12;

/**
 * Paginated news feed driven by the category query param.
 * Resets pagination whenever the category changes.
 */
export function useNewsFeed({
  category,
  limit = DEFAULT_LIMIT,
}: UseNewsFeedOptions): UseNewsFeedResult {
  const [docs, setDocs] = useState<INews[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reset when category changes.
  useEffect(() => {
    setDocs([]);
    setPage(1);
  }, [category]);

  const fetchPage = useCallback(
    async (p: number, append: boolean) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await apiClient.get('/news/get-all-news', {
          params: { page: p, limit, category },
        });
        const data = res.data.data;
        setDocs((prev) => (append ? [...prev, ...data.docs] : data.docs));
        setHasNextPage(data.hasNextPage);
      } catch {
        setError('SIGNAL LOST // ошибка загрузки');
      } finally {
        setIsLoading(false);
      }
    },
    [category, limit],
  );

  useEffect(() => {
    fetchPage(page, page > 1);
  }, [page, fetchPage]);

  return {
    docs,
    page,
    hasNextPage,
    isLoading,
    error,
    loadMore: () => setPage((p) => p + 1),
    retry: () => fetchPage(page, false),
  };
}
