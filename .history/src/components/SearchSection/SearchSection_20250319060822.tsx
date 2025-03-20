import { SearchBar } from './SearchBar';
import { QuickFilters } from './QuickFilters';
import { GenreSelector } from './GenreSelector';
import { ApiSourceSelector } from './ApiSourceSelector';
import { useSearch } from '../../contexts/SearchContext';

export function SearchSection() {
  const {
    selectedFilter,
    setSelectedFilter,
    setQuery,
    performSearch,
    setSelectedGenres
  } = useSearch();

  const handleSearch = (query: string) => {
    setQuery(query);
    performSearch({ query });
  };

  const handleFilterSelect = (filterId: string) => {
    setSelectedFilter(filterId);
    if (filterId !== 'genre') {
      setSelectedGenres([]);
    }
    performSearch({ filter: filterId });
  };

  const handleGenreSelect = (genreList: string) => {
    const genres = genreList.split(',').filter(Boolean);
    setSelectedGenres(genres);
    performSearch({ genres });
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