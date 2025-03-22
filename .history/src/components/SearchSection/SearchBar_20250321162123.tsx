import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiClock, FiTrendingUp } from 'react-icons/fi';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { supabase } from '../../services/supabase/client';
import { SearchFallback } from './SearchFallback';

interface SearchSuggestion {
  type: 'author' | 'book' | 'quote' | 'recent' | 'trending';
  text: string;
  id?: string;
}

export function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('recent_searches', []);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useFocusTrap(containerRef, isOpen);

  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (!searchTerm) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Search in quotes
        const { data: quotes, error: quotesError } = await supabase
          .from('quotes')
          .select('id, content')
          .ilike('content', `%${searchTerm}%`)
          .limit(3);

        if (quotesError) throw quotesError;

        // Search in books
        const { data: books, error: booksError } = await supabase
          .from('books')
          .select('id, title')
          .ilike('title', `%${searchTerm}%`)
          .limit(3);

        if (booksError) throw booksError;

        // Search in authors
        const { data: authors, error: authorsError } = await supabase
          .from('authors')
          .select('id, name')
          .ilike('name', `%${searchTerm}%`)
          .limit(3);

        if (authorsError) throw authorsError;

        // Combine all suggestions
        const newSuggestions: SearchSuggestion[] = [
          // Recent searches first
          ...recentSearches
            .filter(recent => recent.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 2)
            .map(text => ({ type: 'recent', text })),
          
          // Then quotes
          ...(quotes || []).map(quote => ({
            type: 'quote',
            text: quote.content.length > 60 
              ? quote.content.substring(0, 57) + '...' 
              : quote.content,
            id: quote.id
          })),
          
          // Then authors
          ...(authors || []).map(author => ({
            type: 'author',
            text: author.name,
            id: author.id
          })),
          
          // Finally books
          ...(books || []).map(book => ({
            type: 'book',
            text: book.title,
            id: book.id
          }))
        ];

        setSuggestions(newSuggestions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch suggestions');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [recentSearches]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add to recent searches
    setRecentSearches(prev => {
      const newSearches = [query, ...prev.filter(s => s !== query)].slice(0, 5);
      return newSearches;
    });

    navigate(`/search?q=${encodeURIComponent(query)}`);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <SearchFallback />
      
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search quotes, authors, or books..."
            className="w-full pl-12 pr-4 py-3 text-gray-900 bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search"
            aria-expanded={isOpen}
            aria-controls="search-suggestions"
            aria-describedby={error ? "search-error" : undefined}
          />
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {error && (
          <div 
            id="search-error"
            className="mt-2 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </div>
        )}
      </form>

      {isOpen && (suggestions.length > 0 || loading) && (
        <div
          id="search-suggestions"
          className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          role="listbox"
        >
          {loading ? (
            <div className="p-4 text-center text-gray-600 dark:text-gray-400">
              Loading suggestions...
            </div>
          ) : (
            <ul className="py-2">
              {suggestions.map((suggestion, index) => (
                <li key={`${suggestion.type}-${index}`}>
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                    onClick={() => {
                      if (suggestion.type === 'recent') {
                        setQuery(suggestion.text);
                      } else {
                        navigate(
                          suggestion.type === 'quote'
                            ? `/quote/${suggestion.id}`
                            : suggestion.type === 'author'
                            ? `/author/${suggestion.id}`
                            : `/search?book=${suggestion.id}`
                        );
                        setIsOpen(false);
                      }
                    }}
                    role="option"
                  >
                    {suggestion.type === 'recent' ? (
                      <FiClock className="text-gray-400" />
                    ) : suggestion.type === 'trending' ? (
                      <FiTrendingUp className="text-gray-400" />
                    ) : null}
                    <span className="flex-1">{suggestion.text}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {suggestion.type !== 'recent' && suggestion.type !== 'trending'
                        ? suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)
                        : null}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}