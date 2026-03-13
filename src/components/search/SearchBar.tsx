import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuggestionsStore } from '../../store/suggestions';

export const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { suggestions, loading, fetchSuggestions, clearSuggestions, addRecentSearch } =
    useSuggestionsStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addRecentSearch(query.trim());
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      clearSuggestions();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (text: string) => {
    setQuery(text);
    addRecentSearch(text);
    navigate(`/search?q=${encodeURIComponent(text)}`);
    setShowSuggestions(false);
    clearSuggestions();
  };

  return (
    <div className="relative max-w-2xl w-full mx-auto" ref={wrapperRef}>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Search for quotes or authors..."
          className="w-full px-6 py-4 rounded-pill border border-border
                   bg-white/80 dark:bg-navy-card/80 backdrop-blur-sm
                   text-foreground placeholder-muted-foreground font-body
                   focus:outline-none focus:ring-2 focus:ring-primary-500
                   shadow-sm transition-shadow hover:shadow-md"
          aria-label="Search quotes"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2
                   text-muted-foreground hover:text-primary-500 transition-colors"
        >
          <span className="w-5 h-5 block">&#128269;</span>
        </button>
      </form>

      {showSuggestions && (suggestions.length > 0 || loading) && (
        <div className="absolute top-full mt-2 w-full bg-white/95 dark:bg-navy-card/95
                      backdrop-blur-xl border border-border rounded-card shadow-xl
                      max-h-60 overflow-auto z-50">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground font-body">
              Loading...
            </div>
          ) : (
            suggestions.map((suggestion, idx) => (
              <button
                key={`${suggestion.type}-${idx}`}
                type="button"
                className="w-full px-5 py-3 text-left hover:bg-primary-50 dark:hover:bg-primary-900/20
                         text-foreground font-body transition-colors"
                onClick={() => handleSuggestionClick(suggestion.text)}
              >
                <span className="font-medium">{suggestion.text}</span>
                <span className="ml-2 font-label text-muted-foreground">
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
