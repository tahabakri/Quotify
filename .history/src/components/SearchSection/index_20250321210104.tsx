import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { ApiSourceSelector } from './ApiSourceSelector';
import { GenreSelector } from './GenreSelector';

export function SearchSection() {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Mock suggestions - replace with real API call
  const handleInputChange = (value: string) => {
    setSearchValue(value);
    if (value.length > 2) {
      // Mock suggestions - replace with actual API call
      setSuggestions([
        `${value} in literature`,
        `${value} by famous authors`,
        `Quotes about ${value}`,
      ]);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Search for an author, book, or topic..."
            className="w-full px-5 py-4 pr-12 text-lg rounded-xl border border-gray-200 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     shadow-sm hover:shadow-md transition-shadow"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FiSearch className="w-5 h-5" />
          </div>
        </div>

        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 first:rounded-t-lg last:rounded-b-lg"
                onClick={() => setSearchValue(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-4 justify-center">
        <ApiSourceSelector />
        <GenreSelector />
      </div>
    </div>
  );
}

export * from './SearchBar';
export * from './QuickFilters';
export * from './GenreSelector';