import React, { useState, useCallback } from 'react';
import { useSearch } from '../../contexts/useSearch';
import { SearchBar } from './SearchBar';
import { QuickFilters } from './QuickFilters';
import { GenreSelector } from './GenreSelector';

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

  const handleGenreSelect = useCallback((genres: string[]) => {
    setFilters({
      ...filters,
      genres
    });
  }, [filters, setFilters]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <label 
              htmlFor="search-type"
              className="text-sm text-gray-600 dark:text-gray-400 mb-1"
            >
              Search Type
            </label>
            <select
              id="search-type"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'quotes' | 'books')}
              className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
              aria-label="Select search type"
            >
              <option value="quotes">Quotes</option>
              <option value="books">Books</option>
            </select>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            aria-expanded={showFilters}
            aria-controls="search-filters"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {showFilters && (
        <div 
          id="search-filters"
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quick Filters
              </h3>
              <QuickFilters
                onFilterSelect={handleFilterSelect}
                selectedFilter={filters.quickFilter}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Genres
              </h3>
              <GenreSelector
                onGenreSelect={handleGenreSelect}
                selectedGenres={filters.genres || []}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSection;