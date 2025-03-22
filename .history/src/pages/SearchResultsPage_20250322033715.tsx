import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QuoteCard } from '../components/QuoteCard/QuoteCard';
import { SearchSection } from '../components/SearchSection';
import { SortingControls, SortOption } from '../components/SortingControls/SortingControls';
import { ResultsCounter } from '../components/ResultsCounter/ResultsCounter';
import { TrendingQuote } from '../types/quote';
import { supabase } from '../services/supabase/client';

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [quotes, setQuotes] = useState<TrendingQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const searchTerm = searchParams.get('q') || '';
  const sortBy = (searchParams.get('sort') as SortOption) || 'trending';
  const genreFilter = searchParams.get('genre') || '';
  const authorFilter = searchParams.get('author') || '';
  const bookFilter = searchParams.get('book') || '';

  const handleSortChange = (sort: SortOption) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('sort', sort);
      return newParams;
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      return newParams;
    });
  };

  const handleLike = useCallback(async (quoteId: string) => {
    try {
      await supabase.rpc('increment_quote_likes', { quote_id: quoteId });
      setQuotes(prev => 
        prev.map(quote => 
          quote.id === quoteId 
            ? { ...quote, likes: quote.likes + 1 } 
            : quote
        )
      );
    } catch (error) {
      console.error('Error liking quote:', error);
    }
  }, []);

  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('quotes')
        .select(`
          *,
          book:books(title, cover_url),
          author:authors(name, image_url)
        `);

      // Apply search filter
      if (searchTerm) {
        query = query.ilike('content', `%${searchTerm}%`);
      }

      // Apply genre filter
      if (genreFilter) {
        query = query.eq('genre', genreFilter);
      }

      // Apply author filter
      if (authorFilter) {
        query = query.ilike('author.name', `%${authorFilter}%`);
      }

      // Apply book filter
      if (bookFilter) {
        query = query.ilike('book.title', `%${bookFilter}%`);
      }

      // Apply sorting
      switch (sortBy) {
        case 'trending':
          query = query.order('views', { ascending: false });
          break;
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'likes':
          query = query.order('likes', { ascending: false });
          break;
      }

      const { data, error } = await query.range((page - 1) * 20, page * 20 - 1);

      if (error) throw error;
      setQuotes(prev => [...prev, ...(data as TrendingQuote[])]);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quotes');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, sortBy, genreFilter, authorFilter, bookFilter, page]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Section */}
      <div className="mb-8">
        <SearchSection />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-1/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Filters</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Author</label>
            <input
              type="text"
              value={authorFilter}
              onChange={(e) => handleFilterChange('author', e.target.value)}
              placeholder="Search by author"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Book Title</label>
            <input
              type="text"
              value={bookFilter}
              onChange={(e) => handleFilterChange('book', e.target.value)}
              placeholder="Search by book title"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Genre</label>
            <select
              value={genreFilter}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">All Genres</option>
              <option value="History">History</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Science">Science</option>
            </select>
          </div>
        </aside>

        {/* Results Section */}
        <div className="w-full md:w-3/4">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <ResultsCounter total={quotes.length} searchTerm={searchTerm} />
            <SortingControls selectedSort={sortBy} onSortChange={handleSortChange} />
          </div>

          {/* Results Grid */}
          {loading && page === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 h-64" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quotes.map(quote => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  onLike={() => handleLike(quote.id)}
                />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {quotes.length > 0 && !loading && (
            <div className="text-center mt-8">
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                onClick={() => setPage(prev => prev + 1)}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}