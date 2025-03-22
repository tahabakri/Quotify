import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface Suggestion {
  id: string;
  text: string;
  type: 'author' | 'book' | 'topic';
}

export const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (value.trim().length >= 2) {
      setIsLoading(true);
      // Simulated API call with delay
      timeoutRef.current = setTimeout(() => {
        // This will be replaced with actual API call
        const mockSuggestions: Suggestion[] = [
          { id: '1', text: 'William Shakespeare', type: 'author' },
          { id: '2', text: 'The Great Gatsby', type: 'book' },
          { id: '3', text: 'Philosophy', type: 'topic' }
        ];
        setSuggestions(mockSuggestions);
        setIsLoading(false);
      }, 300);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="relative max-w-2xl w-full mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search for an author, book, or topic..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   placeholder-gray-500 dark:placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                   shadow-sm"
          aria-label="Search quotes"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2
                   text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {/* Placeholder for search icon */}
          <span className="w-5 h-5 block">🔍</span>
        </button>
      </form>

      {/* Suggestions dropdown */}
      {(suggestions.length > 0 || isLoading) && (
        <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 
                      border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg
                      max-h-60 overflow-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Loading suggestions...
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700
                         text-gray-700 dark:text-gray-300"
                onClick={() => {
                  setQuery(suggestion.text);
                  setSuggestions([]);
                }}
              >
                <span className="font-medium">{suggestion.text}</span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {suggestion.type}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};