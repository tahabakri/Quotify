import { useEffect, useState } from 'react';
import { TrendingQuote } from '../../types/quote';
import { supabase } from '../../services/supabase/client';
import { FiHeart, FiShare2, FiCopy } from 'react-icons/fi';

interface TrendingQuotesProps {
  limit?: number;
}

export function TrendingQuotes({ limit = 6 }: TrendingQuotesProps) {
  const [quotes, setQuotes] = useState<TrendingQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrendingQuotes() {
      try {
        const { data, error } = await supabase
          .from('quotes')
          .select(`
            *,
            book:books(title, cover_url),
            author:authors(name, image_url)
          `)
          .order('likes', { ascending: false })
          .limit(limit);

        if (error) throw error;

        setQuotes(data as TrendingQuote[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trending quotes');
      } finally {
        setLoading(false);
      }
    }

    fetchTrendingQuotes();
  }, [limit]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 h-64" />
        ))}
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quotes.map((quote) => (
        <div
          key={quote.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col"
        >
          <blockquote className="text-lg mb-4 flex-grow">
            "{quote.content}"
          </blockquote>
          
          <div className="flex items-center gap-4 mb-4">
            {quote.book.coverUrl && (
              <img
                src={quote.book.coverUrl}
                alt={quote.book.title}
                className="w-12 h-16 object-cover rounded"
              />
            )}
            <div>
              <p className="font-medium dark:text-gray-200">{quote.book.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {quote.author.name}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1 hover:text-red-500 transition-colors"
                aria-label="Like quote"
              >
                <FiHeart />
                <span>{quote.likes}</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="hover:text-blue-500 transition-colors"
                aria-label="Copy quote"
              >
                <FiCopy />
              </button>
              <button
                className="hover:text-blue-500 transition-colors"
                aria-label="Share quote"
              >
                <FiShare2 />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}