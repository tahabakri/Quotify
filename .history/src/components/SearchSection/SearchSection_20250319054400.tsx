import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { QuickFilters } from './QuickFilters';

export function SearchSection() {
  const [selectedFilter, setSelectedFilter] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Search query:', query);
  };

  const handleFilterSelect = (filterId: string) => {
    setSelectedFilter(filterId);
    console.log('Selected filter:', filterId);
  };

  return (
    <section className="py-8 px-4 bg-gray-50 dark:bg-dark-100">
      <SearchBar onSearch={handleSearch} className="mb-6" />
      <QuickFilters
        onFilterSelect={handleFilterSelect}
        selectedFilter={selectedFilter}
        className="justify-center"
      />
    </section>
  );
}