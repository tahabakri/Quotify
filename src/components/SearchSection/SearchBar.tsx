import { Search } from 'lucide-react';
import { useState, useCallback } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search by title, author, or genre...', className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  }, [query, onSearch]);

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-3xl mx-auto ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-6 py-4 pr-12 text-lg rounded-full border-2 border-purple-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-dark-200 dark:border-dark-100 dark:text-white dark:placeholder-gray-400 transition-all duration-300"
        />
        <button
          type="submit"
          aria-label="Search books"
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-purple-100 dark:hover:bg-dark-100 transition-colors duration-300"
        >
          <Search className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </button>
      </div>
    </form>
  );
}