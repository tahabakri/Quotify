import React, { useState, useCallback } from 'react';
import { useSearch } from '../../contexts/useSearch';
import { SearchBar } from './SearchBar';
import { QuickFilters } from './QuickFilters';
import { GenreSelector } from './GenreSelector';
import { ApiSourceSelector } from './ApiSourceSelector';
import { Search, Filter } from 'lucide-react';

export const SearchSection: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { 
    searchType, 
    setSearchType, 
    search, 
    setFilters, 
    filters 
  } = useSearch();

  const handleSearch = useCallback((query: string) => {
    console.log('Searching for:', query);
    search();
  }, [search]);

  const handleFilterSelect = useCallback((filterName: string) => {
    setFilters({
      ...filters,
      quickFilter: filterName
    });
  }, [filters, setFilters]);

  const handleGenreSelect = useCallback((genreId: string) => {
    setFilters({
      ...filters,
      genres: [genreId]
    });
  }, [filters, setFilters]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Search</h2>
      </div>

      <div className="space-y-4">
        <SearchBar 
          className="input"
          placeholder={searchType === 'quotes' ? 'Search quotes...' : 'Search books...'}
        />

        <ApiSourceSelector 
          className="flex gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg"
        />

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </div>
          
          <QuickFilters 
            className="grid grid-cols-2 gap-2" 
          />

          <GenreSelector 
            className="grid grid-cols-2 sm:grid-cols-4 gap-2" 
          />
        </div>
      </div>
    </div>
  );
};

export default SearchSection;