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

  const searchTerm = searchParams.get('q') || '';
  const sortBy = (searchParams.get('sort') as SortOption) || 'trending';

  const handleSortChange = (sort: SortOption) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('sort', sort);
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

      const { data, error } = await query.limit(20);

      if (error) throw error;
      setQuotes(data as TrendingQuote[]);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quotes');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, sortBy]);

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
      <SearchProvider>
        <SearchSection />
      </SearchProvider>
    </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <ResultsCounter total={quotes.length} searchTerm={searchTerm} />
        <SortingControls selectedSort={sortBy} onSortChange={handleSortChange} />
      </div>

      {/* Results Grid */}
      {loading ? (
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
      {quotes.length > 0 && (
        <div className="text-center mt-8">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            onClick={() => {/* TODO: Implement load more */}}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}