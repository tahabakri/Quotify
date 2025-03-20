import React, { createContext, useState, useCallback } from 'react';
// Update imports with explicit file extension to help TypeScript resolve them
import { openLibraryService, type SearchParams } from '../services/openLibrary.ts';
import { googleBooksService } from '../services/googleBooks';

type ApiSource = 'openLibrary' | 'googleBooks';

interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  rating: number;
  publishYear?: number;
  description?: string;
  pageCount?: number;
  categories?: string[];
  ratingsCount?: number;
}

interface SearchContextType {
  query: string;
  selectedFilter: string;
  selectedGenres: string[];
  loading: boolean;
  books: Book[];
  error: string | null;
  apiSource: ApiSource;
  setQuery: (query: string) => void;
  setSelectedFilter: (filter: string) => void;
  setSelectedGenres: (genres: string[]) => void;
  setApiSource: (source: ApiSource) => void;
  performSearch: (params: SearchParams) => Promise<void>;
}

// Export the SearchContext so it can be imported by useSearch.tsx
export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('trending');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [apiSource, setApiSource] = useState<ApiSource>('googleBooks');

  const performSearch = useCallback(async (params: SearchParams) => {
    const searchQuery = params.query ?? query;
    const filter = params.filter ?? selectedFilter;
    const genres = params.genres ?? selectedGenres;

    setLoading(true);
    setError(null);
    
    try {
      const service = apiSource === 'googleBooks' ? googleBooksService : openLibraryService;
      const results = await service.searchBooks({
        query: searchQuery,
        filter,
        genres,
      });
      
      setBooks(results);
    } catch (error) {
      console.error('Search failed:', error);
      setError(`Failed to fetch books from ${apiSource === 'googleBooks' ? 'Google Books' : 'Open Library'}. Please try again.`);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [query, selectedFilter, selectedGenres, apiSource]);

  // Initial search for trending books
  React.useEffect(() => {
    performSearch({ filter: 'trending' });
  }, [apiSource, performSearch]); // Added 'performSearch' to the dependency array

  const value = {
    query,
    selectedFilter,
    selectedGenres,
    loading,
    books,
    error,
    apiSource,
    setQuery,
    setSelectedFilter,
    setSelectedGenres,
    setApiSource,
    performSearch,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}