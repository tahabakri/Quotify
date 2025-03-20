import React, { createContext, useContext, useState, useCallback } from 'react';

interface SearchContextType {
  query: string;
  selectedFilter: string;
  selectedGenres: string[];
  loading: boolean;
  setQuery: (query: string) => void;
  setSelectedFilter: (filter: string) => void;
  setSelectedGenres: (genres: string[]) => void;
  setLoading: (loading: boolean) => void;
  performSearch: (params: { query?: string; filter?: string; genres?: string[] }) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('trending');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const performSearch = useCallback(async (params: {
    query?: string;
    filter?: string;
    genres?: string[];
  }) => {
    const searchQuery = params.query ?? query;
    const filter = params.filter ?? selectedFilter;
    const genres = params.genres ?? selectedGenres;

    setLoading(true);
    
    try {
      // TODO: Implement actual search API call
      console.log('Performing search with:', {
        query: searchQuery,
        filter,
        genres,
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, [query, selectedFilter, selectedGenres]);

  const value = {
    query,
    selectedFilter,
    selectedGenres,
    loading,
    setQuery,
    setSelectedFilter,
    setSelectedGenres,
    setLoading,
    performSearch,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}