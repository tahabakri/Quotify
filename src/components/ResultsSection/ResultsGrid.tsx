import React, { useCallback } from 'react';
import { Quote, Book, SearchResult } from '../../services/supabase/types';
import QuoteCard from '../QuoteImage/QuoteCard';
import { BookCard } from './BookCard';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

interface ResultsGridProps {
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

export const ResultsGrid: React.FC<ResultsGridProps> = ({
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

  const handlePreview = useCallback((book: Book) => {
    window.open(book.preview_link || book.info_link, '_blank');
  }, []);

  const renderQuote = (quote: Quote) => (
    <QuoteCard
      key={quote.id}
      quote={quote}
      className="transition-all duration-300 hover:shadow-lg"
    />
  );

  const renderBook = (book: Book) => (
    <BookCard
      key={book.id}
      book={{
        ...book,
        cover_url: book.cover_url || ''
      }}
      onPreview={() => handlePreview(book)}
      className="transition-all duration-300 hover:shadow-lg"
    />
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 gap-6">
        {results.map((item) => {
          if (type === 'quotes' && isQuote(item)) {
            return renderQuote(item);
          }
          if (type === 'books' && isBook(item)) {
            return renderBook(item);
          }
          return null;
        })}
      </div>

      {loading && (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      )}

      {!loading && hasMore && (
        <div ref={ref} className="h-20 flex items-center justify-center">
          <div className="text-gray-500">Scroll for more</div>
        </div>
      )}

      {!loading && !hasMore && results.length > 0 && (
        <div className="text-center text-gray-500 py-4">
          No more {type} to load
        </div>
      )}

      {!loading && results.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No {type} found matching your criteria
        </div>
      )}
    </div>
  );
};

export default ResultsGrid;