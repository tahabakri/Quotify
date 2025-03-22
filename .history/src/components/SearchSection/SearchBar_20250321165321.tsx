import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiClock, FiTrendingUp } from 'react-icons/fi';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { supabase } from '../../services/supabase/client';
import { SearchFallback } from './SearchFallback';

type SuggestionType = 'author' | 'book' | 'quote' | 'recent' | 'trending';

interface SearchSuggestion {
  type: SuggestionType;
  text: string;
  id?: string;
}

interface SearchProps {
  className?: string;
  placeholder?: string;
}

export function SearchBar({ className = '', placeholder = 'Search quotes, authors, or books...' }: SearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('recent_searches', []);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
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
            .map(text => ({ type: 'recent' as const, text })),
          
          // Then quotes
          ...(quotes || []).map(quote => ({
            type: 'quote' as const,
            text: quote.content.length > 60 
              ? quote.content.substring(0, 57) + '...' 
              : quote.content,
            id: quote.id
          })),
          
          // Then authors
          ...(authors || []).map(author => ({
            type: 'author' as const,
            text: author.name,
            id: author.id
          })),
          
          // Finally books
          ...(books || []).map(book => ({
            type: 'book' as const,
            text: book.title,
            id: book.id
          }))
        ];

        setSuggestions(newSuggestions);
        setSelectedIndex(-1);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const selected = suggestions[selectedIndex];
          if (selected.type === 'recent') {
            setQuery(selected.text);
          } else {
            navigate(
              selected.type === 'quote'
                ? `/quote/${selected.id}`
                : selected.type === 'author'
                ? `/author/${selected.id}`
                : `/search?book=${selected.id}`
            );
            setIsOpen(false);
          }
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className={className}>
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
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-3 text-gray-900 bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search"
            aria-expanded={isOpen ? "true" : "false"}
            aria-controls="search-suggestions"
            aria-describedby={error ? "search-error" : undefined}
            aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
            role="combobox"
            autoComplete="off"
          />
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
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
          role="region"
          aria-label="Search suggestions"
        >
          {loading ? (
            <div className="p-4 text-center text-gray-600 dark:text-gray-400" role="status">
              <span className="sr-only">Loading suggestions...</span>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white mx-auto" />
            </div>
          ) : (
            <ul 
              ref={listRef}
              role="listbox"
              className="py-2"
              aria-label="Search suggestions"
            >
              {suggestions.map((suggestion, index) => (
                <li 
                  key={`${suggestion.type}-${index}`}
                  id={`suggestion-${index}`}
                  role="option"
                  aria-selected={index === selectedIndex ? "true" : "false"}
                  className={`
                    ${index === selectedIndex ? 'bg-gray-100 dark:bg-gray-700' : ''}
                  `}
                >
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
                    tabIndex={-1}
                  >
                    {suggestion.type === 'recent' ? (
                      <FiClock className="text-gray-400" aria-hidden="true" />
                    ) : suggestion.type === 'trending' ? (
                      <FiTrendingUp className="text-gray-400" aria-hidden="true" />
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