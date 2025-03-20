import { BookCard } from './BookCard';
import { useSearch } from '../../contexts/SearchContext';

interface ResultsGridProps {
  className?: string;
}

export function ResultsGrid({ className = '' }: ResultsGridProps) {
  const { loading, books, error } = useSearch();

  const handleSave = (id: string) => {
    console.log('Save book:', id);
    // TODO: Implement save functionality
  };

  const handleQuote = (id: string) => {
    console.log('View quotes:', id);
    // TODO: Implement quote viewing functionality
  };

  const handlePreview = (id: string) => {
    console.log('Preview book:', id);
    // TODO: Implement preview functionality
  };

  if (loading) {
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

  if (error) {
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
  );
}