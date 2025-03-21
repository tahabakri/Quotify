import { Search } from 'lucide-react';
import { useSearch } from '../../contexts/useSearch';
import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({ placeholder = 'Search...', className = '' }: SearchBarProps) {
  const { query, setQuery, search } = useSearch();
  const [inputValue, setInputValue] = useState(query);
  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    if (debouncedValue !== query) {
      setQuery(debouncedValue);
      search();
    }
  }, [debouncedValue, query, setQuery, search]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    search();
  }, [search]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
      <input
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className={`${className} pl-12 pr-4`}
        aria-label="Search input"
      />
    </form>
  );
}