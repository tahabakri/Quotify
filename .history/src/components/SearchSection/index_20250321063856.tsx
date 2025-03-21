import { SearchBar } from './SearchBar';
import { QuickFilters } from './QuickFilters';
import { GenreSelector } from './GenreSelector';
import { SearchProvider } from '../../contexts/useSearch';

export function SearchSection() {
  return (
    <SearchProvider>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <SearchBar />
        </div>
        <div className="space-y-4">
          <QuickFilters />
          <GenreSelector />
        </div>
      </div>
    </SearchProvider>
  );
}

export * from './SearchBar';
export * from './QuickFilters';
export * from './GenreSelector';