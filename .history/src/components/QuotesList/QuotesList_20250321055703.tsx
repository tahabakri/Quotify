import { useState, useEffect } from 'react';
import { QuoteCard } from '../QuoteCard/QuoteCard';
import { TrendingQuote } from '../../types/quote';
import { SortingControls, SortOption } from '../SortingControls/SortingControls';
import { supabase } from '../../services/supabase/client';

interface QuotesListProps {
  authorId: string;
  bookId?: string;
}

export function QuotesList({ authorId, bookId }: QuotesListProps) {
  const [quotes, setQuotes] = useState<TrendingQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  useEffect(() => {
    async function fetchQuotes() {
      try {
        setLoading(true);
        
        let query = supabase
          .from('quotes')
          .select(`
            *,
            book:books(title, cover_url),
            author:authors(name, image_url)
          `)
          .eq('author_id', authorId);

        if (bookId) {
          query = query.eq('book_id', bookId);
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

        const { data, error } = await query;

        if (error) throw error;
        setQuotes(data as TrendingQuote[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch quotes');
      } finally {
        setLoading(false);
      }
    }

    fetchQuotes();
  }, [authorId, bookId, sortBy]);

  const handleLike = async (quoteId: string) => {
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
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="flex justify-end mb-6">
          <div className="w-64 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div 
              key={i}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 h-48"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600 dark:text-gray-400">
        No quotes found
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {bookId ? 'Book Quotes' : 'All Quotes'}
          <span className="ml-2 text-sm font-normal text-gray-600 dark:text-gray-400">
            ({quotes.length})
          </span>
        </h2>
        <SortingControls
          selectedSort={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quotes.map(quote => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            onLike={() => handleLike(quote.id)}
          />
        ))}
      </div>
    </div>
  );
}