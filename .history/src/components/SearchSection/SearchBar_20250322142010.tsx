import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiClock, FiTrendingUp } from 'react-icons/fi';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { NoResults } from '../common/NoResults';
import { SearchFallback } from './SearchFallback';
import { useSearchStore } from '../../store/search';
import {
  useSuggestions,
  useSuggestionsLoading,
  useSuggestionsError,
  useSelectedIndex,
  useSuggestionsActions
} from '../../store/suggestions';

interface SearchProps {
  className?: string;
  placeholder?: string;
}

export function SearchBar({ className = '', placeholder = 'Search quotes, authors, or books...' }: SearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  useFocusTrap(containerRef, isOpen);

  // Zustand store selectors
  const suggestions = useSuggestions();
  const loading = useSuggestionsLoading();
  const error = useSuggestionsError();
  const selectedIndex = useSelectedIndex();
  const { setQuery: setSearchQuery } = useSearchStore();
  const {
    fetchSuggestions,
    setSelectedIndex,
    addRecentSearch,
    clearSuggestions
  } = useSuggestionsActions();

  useEffect(() => {
    if (query) {
      fetchSuggestions(query);
    } else {
      clearSuggestions();
    }
  }, [query, fetchSuggestions, clearSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    addRecentSearch(query);
    setSearchQuery(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(selectedIndex < suggestions.length - 1 ? selectedIndex + 1 : selectedIndex);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : selectedIndex);
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
        clearSuggestions();
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
          <ErrorMessage 
            message={error} 
            variant="inline" 
            className="mt-2" 
          />
        )}
      </form>

      {isOpen && (
        <div
          id="search-suggestions"
          className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          {loading ? (
            <div className="p-6">
              <LoadingSpinner 
                size="small" 
                label="Loading suggestions..." 
              />
            </div>
          ) : suggestions.length === 0 && query ? (
            <NoResults 
              type="search"
              message="No matching results"
              suggestion="Try different keywords or check your spelling"
              className="py-6"
            />
          ) : (
            <ul 
              ref={listRef}
              role="listbox"
              className="py-2"
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