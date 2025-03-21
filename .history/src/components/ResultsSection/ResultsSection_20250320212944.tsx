import React from 'react';
import { Quote } from '../../services/supabase/types';
import QuoteCard from './QuoteCard';
import BookCard from './BookCard';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

interface ResultsSectionProps {
  results: (Quote | any)[]; // TODO: Add proper Book type
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  type: 'quotes' | 'books';
  className?: string;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  results,
  loading,
  hasMore,
  onLoadMore,
  type,
  className = ''
}) => {
  const loadMoreRef = useInfiniteScroll(onLoadMore, {
    threshold: 0.8,
    enabled: hasMore && !loading
  });

  const renderItem = (item: any, index: number) => {
    if (type === 'quotes') {
      return (
        <QuoteCard
          key={item.id}
          quote={item as Quote}
          className="transition-all duration-300 hover:shadow-lg"
        />
      );
    }

    return (
      <BookCard
        key={item.id}
        book={item}
        className="transition-all duration-300 hover:shadow-lg"
      />
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 gap-6">
        {results.map(renderItem)}
      </div>

      {loading && (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      )}

      {!loading && hasMore && (
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
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

export default ResultsSection;