import React, { createContext, useContext, useState, useCallback } from 'react';
import * as booksApi from '../api/books';
import type { OpenLibraryBook } from '../api/books';

interface SearchContextType {
  query: string;
  loading: boolean;
  books: OpenLibraryBook[];
  error: string | null;
  hasMore: boolean;
  totalItems: number;
  currentPage: number;
  setQuery: (query: string) => void;
  performSearch: (query?: string) => Promise<void>;
  loadMore: () => Promise<void>;
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function useBookSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useBookSearch must be used within a SearchProvider');
  }
  return context;
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<OpenLibraryBook[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const performSearch = useCallback(
    async (searchQuery?: string) => {
      const q = searchQuery ?? query;
      if (!q.trim()) return;

      setLoading(true);
      setError(null);
      setCurrentPage(0);

      try {
        const results = await booksApi.searchBooks(q, 0, 10);
        setBooks(results.books);
        setHasMore(results.hasMore);
        setTotalItems(results.totalItems);
      } catch {
        setError('Failed to search books. Please try again.');
        setBooks([]);
        setHasMore(false);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    const nextPage = currentPage + 1;

    try {
      const results = await booksApi.searchBooks(query, nextPage, 10);
      setBooks((prev) => [...prev, ...results.books]);
      setHasMore(results.hasMore);
      setTotalItems(results.totalItems);
      setCurrentPage(nextPage);
    } catch {
      setError('Failed to load more books.');
    } finally {
      setLoading(false);
    }
  }, [query, currentPage, hasMore, loading]);

  return (
    <SearchContext.Provider
      value={{ query, loading, books, error, hasMore, totalItems, currentPage, setQuery, performSearch, loadMore }}
    >
      {children}
    </SearchContext.Provider>
  );
}
