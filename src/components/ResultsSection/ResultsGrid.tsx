import { BookCard } from './BookCard';
import { useSearch } from '../../contexts/SearchContext';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { BookDetailsView } from '../BookDetails/BookDetailsView';
import { useEffect, useState } from 'react';
import type { Book } from '../../contexts/SearchContext';

interface ResultsGridProps {
  className?: string;
}

export function ResultsGrid({ className = '' }: ResultsGridProps) {
  const { 
    loading, 
    books, 
    error, 
    hasMore, 
    loadMore, 
    totalItems 
  } = useSearch();

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const { targetRef, resetHasMore } = useInfiniteScroll({
    loading,
    threshold: 300,
  });

  useEffect(() => {
    if (!loading && hasMore) {
      loadMore();
    }
  }, [loading, hasMore, loadMore]);

  useEffect(() => {
    resetHasMore();
  }, [books.length]);

  const handleSave = (id: string) => {
    console.log('Save book:', id);
    // TODO: Implement save functionality
  };

  const handleQuote = (id: string) => {
    console.log('View quotes:', id);
    // TODO: Implement quote viewing functionality
  };

  const handlePreview = (book: Book) => {
    setSelectedBook(book);
  };

  if (loading && books.length === 0) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 ${className}`}>
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-dark-200 rounded-xl animate-pulse"
            style={{ aspectRatio: '3/4' }}
          />
        ))}
      </div>
    );
  }

  if (error && books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">No books found. Try adjusting your search.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 ${className}`}>
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onSave={handleSave}
              onQuote={handleQuote}
              onPreview={handlePreview}
            />
          ))}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
          </div>
        )}

        {/* Infinite scroll trigger */}
        {hasMore && (
          <div 
            ref={targetRef} 
            className="h-4"
            aria-hidden="true"
          />
        )}

        {/* Results count */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Showing {books.length} of {totalItems} books
        </div>
      </div>

      {/* Book Details Modal */}
      {selectedBook && (
        <BookDetailsView
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </>
  );
}