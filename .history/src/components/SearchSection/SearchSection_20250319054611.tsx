import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { QuickFilters } from './QuickFilters';
import { GenreSelector } from './GenreSelector';

export function SearchSection() {
  const [selectedFilter, setSelectedFilter] = useState('trending');
  const [selectedGenres, setSelectedGenres] = useState<string>('');

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    if (selectedGenres) {
      console.log('Filtering by genres:', selectedGenres);
    }
    // TODO: Implement search functionality with genre filters
  };

  const handleFilterSelect = (filterId: string) => {
    setSelectedFilter(filterId);
    if (filterId !== 'genre') {
      setSelectedGenres('');
    }
    console.log('Selected filter:', filterId);
  };

  const handleGenreSelect = (genres: string) => {
    setSelectedGenres(genres);
    console.log('Selected genres:', genres);
  };

  return (
    <section className="py-8 px-4 bg-gray-50 dark:bg-dark-100">
      <SearchBar onSearch={handleSearch} className="mb-6" />
      <QuickFilters
        onFilterSelect={handleFilterSelect}
        selectedFilter={selectedFilter}
        className="justify-center mb-6"
      />
      {selectedFilter === 'genre' && (
        <GenreSelector
          onGenreSelect={handleGenreSelect}
          className="mt-6"
        />
      )}
    </section>
  );
}