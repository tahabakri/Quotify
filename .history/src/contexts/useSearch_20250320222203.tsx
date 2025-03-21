import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Quote, Book, SearchResult } from '../services/supabase/types';

export type SearchType = 'quotes' | 'books';

interface SearchFilters {
  authors?: string[];
  tags?: string[];
  genres?: string[];
  quickFilter?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
}

export interface SearchContextType {
  query: string;
  filters: SearchFilters;
  results: SearchResult[];
  loading: boolean;
  hasMore: boolean;
  error: Error | null;
  searchType: SearchType;
  setQuery: (query: string) => void;
  setFilters: (filters: SearchFilters) => void;
  setSearchType: (type: SearchType) => void;
  search: () => Promise<void>;
  loadMore: () => Promise<void>;
  clearResults: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchType, setSearchType] = useState<SearchType>('quotes');

  const search = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement actual search with API
      const mockResults: SearchResult[] = searchType === 'quotes' 
        ? [{
            id: '1',
            content: 'Sample quote text',
            book_title: 'Sample Book',
            author: 'Sample Author',
            user_id: '1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            visibility: 'public'
          } as Quote]
        : [{
            id: '1',
            title: 'Sample Book',
            author: 'Sample Author',
            description: 'A sample book description',
            cover_url: 'https://example.com/cover.jpg',
            published_date: '2025',
            average_rating: 4.5,
            source: 'google_books'
          } as Book];
      
      setResults(mockResults);
      setHasMore(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Search failed'));
    } finally {
      setLoading(false);
    }
  }, [query, filters, searchType]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      // TODO: Implement pagination
      const mockMoreResults: SearchResult[] = [];
      setResults(prev => [...prev, ...mockMoreResults]);
      setHasMore(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load more results'));
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading]);

  const clearResults = useCallback(() => {
    setResults([]);
    setHasMore(true);
    setError(null);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        query,
        filters,
        results,
        loading,
        hasMore,
        error,
        searchType,
        setQuery,
        setFilters,
        setSearchType,
        search,
        loadMore,
        clearResults
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

export default SearchContext;