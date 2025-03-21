import React from 'react';
import { Quote, Book, SearchResult } from '../../services/supabase/types';
import { QuoteCard } from './QuoteCard';
import { BookCard } from './BookCard';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { Loader2, BookOpenText, Quote as QuoteIcon } from 'lucide-react';

interface ResultsSectionProps {
  results: SearchResult[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  type: 'quotes' | 'books';
  className?: string;
}

const isQuote = (item: SearchResult): item is Quote => {
  return 'content' in item;
};

const isBook = (item: SearchResult): item is Book => {
  return 'title' in item && !('content' in item);
};

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  results,
  loading,
  hasMore,
  onLoadMore,
  type,
  className = ''
}) => {
  const { ref } = useInfiniteScroll(onLoadMore, {
    threshold: 0.8,
    enabled: hasMore && !loading
  });

  if (loading && !results.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Searching...</p>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        {type === 'books' ? (
          <BookOpenText className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
        ) : (
          <QuoteIcon className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
        )}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No results found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          Try adjusting your search or filters to find what you're looking for
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 gap-6">
        {results.map((result) => (
          'quote' in result ? (
            <QuoteCard
              key={result.id}
              quote={result}
              className="card p-6"
            />
          ) : (
            <BookCard
              key={result.id}
              book={result}
              className="card p-6"
            />
          )
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="btn-secondary"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Loading more...
              </>
            ) : (
              'Load more'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;