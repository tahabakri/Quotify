import { useEffect, useState } from 'react';
import { TrendingQuote } from '../../types/quote';
import { supabase } from '../../services/supabase/client';
import { FiHeart, FiShare2, FiCopy } from 'react-icons/fi';

type SortOption = 'trending' | 'recent' | 'likes';

interface TrendingQuotesProps {
  limit?: number;
  featured?: boolean;
  sort?: SortOption;
}

export function TrendingQuotes({ limit = 6, featured = false, sort = 'trending' }: TrendingQuotesProps) {
  const [quotes, setQuotes] = useState<TrendingQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrendingQuotes() {
      try {
        let query = supabase
          .from('quotes')
          .select(`
            *,
            book:books(title, cover_url),
            author:authors(name, image_url)
          `);

        // Apply sorting
        switch (sort) {
          case 'recent':
            query = query.order('created_at', { ascending: false });
            break;
          case 'likes':
            query = query.order('likes', { ascending: false });
            break;
          case 'trending':
          default:
            query = query.order('views', { ascending: false });
            break;
        }

        const { data, error } = await query.limit(limit);

        if (error) throw error;

        setQuotes(data as TrendingQuote[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trending quotes');
      } finally {
        setLoading(false);
      }
    }

    fetchTrendingQuotes();
  }, [limit, sort]);

  if (loading) {
    return (
      <div className={`grid ${featured ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6 animate-pulse`}>
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

  if (featured && quotes.length > 0) {
    const quote = quotes[0];
    return (
      <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-8">
        <blockquote className="text-2xl mb-6 font-serif italic">
          "{quote.content}"
        </blockquote>
        
        <div className="flex items-center gap-6">
          {quote.book?.imageUrl && (
            <img
              src={quote.book.imageUrl}
              alt={quote.book.title}
              className="w-20 h-28 object-cover rounded-lg shadow-md"
            />
          )}
          <div>
            <p className="text-xl font-medium dark:text-gray-200">{quote.book?.title}</p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {quote.author.name}
            </p>
          </div>
        </div>

        <div className="flex justify-end items-center gap-4 mt-6 text-gray-600 dark:text-gray-400">
          <button
            className="flex items-center gap-2 hover:text-red-500 transition-colors"
            aria-label="Like quote"
          >
            <FiHeart />
            <span>{quote.likes}</span>
          </button>
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
            {quote.book?.imageUrl && (
              <img
                src={quote.book.imageUrl}
                alt={quote.book.title}
                className="w-12 h-16 object-cover rounded"
              />
            )}
            <div>
              <p className="font-medium dark:text-gray-200">{quote.book?.title}</p>
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