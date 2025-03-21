import { useEffect, useState } from 'react';
import { TrendingQuote } from '../../types/quote';
import { QuoteCard } from '../QuoteCard/QuoteCard';
import { supabase } from '../../services/supabase/client';

interface RelatedQuotesProps {
  currentQuoteId: string;
  authorId?: string;
  bookId?: string;
  limit?: number;
}

export function RelatedQuotes({ 
  currentQuoteId, 
  authorId, 
  bookId, 
  limit = 3 
}: RelatedQuotesProps) {
  const [quotes, setQuotes] = useState<TrendingQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRelatedQuotes() {
      try {
        let query = supabase
          .from('quotes')
          .select(`
            *,
            book:books(title, cover_url),
            author:authors(name, image_url)
          `)
          .neq('id', currentQuoteId)
          .limit(limit);

        // If we have an authorId or bookId, prioritize quotes from the same source
        if (authorId) {
          query = query.eq('author_id', authorId);
        } else if (bookId) {
          query = query.eq('book_id', bookId);
        }

        const { data, error } = await query;

        if (error) throw error;
        setQuotes(data as TrendingQuote[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch related quotes');
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedQuotes();
  }, [currentQuoteId, authorId, bookId, limit]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 h-48" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-6 text-gray-600 dark:text-gray-400">
        No related quotes found
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Related Quotes
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quotes.map(quote => (
          <QuoteCard
            key={quote.id}
            quote={quote}
          />
        ))}
      </div>
    </div>
  );
}