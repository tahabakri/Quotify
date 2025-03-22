import React, { useState } from 'react';
import { Book, BookCategory } from '../../types/book';
import { BookCard, BookCardSkeleton } from './BookCard';
import { BaseProps } from '../../types';

interface BookSelectionProps extends BaseProps {
  books: Book[];
  loading?: boolean;
  onBookSelect?: (book: Book) => void;
}

const categories: { id: BookCategory; label: string }[] = [
  { id: 'Philosophy', label: 'Philosophy' },
  { id: 'Fiction', label: 'Fiction' },
  { id: 'Poetry', label: 'Poetry' },
  { id: 'Science', label: 'Science' },
  { id: 'History', label: 'History' },
  { id: 'Self Help', label: 'Self Help' },
  { id: 'Biography', label: 'Biography' },
  { id: 'Other', label: 'Other' },
];

export const BookSelection: React.FC<BookSelectionProps> = ({
  books,
  loading = false,
  onBookSelect,
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'all'>('all');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const filteredBooks = selectedCategory === 'all' 
    ? books 
    : books.filter(book => book.category === selectedCategory);

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    onBookSelect?.(book);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          }`}
          aria-pressed={selectedCategory === 'all' ? 'true' : 'false'}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
            aria-pressed={selectedCategory === category.id ? 'true' : 'false'}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
          // Loading state
          Array(10).fill(0).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))
        ) : filteredBooks.length > 0 ? (
          // Books display
          filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              selected={selectedBook?.id === book.id}
              onSelect={handleBookSelect}
            />
          ))
        ) : (
          // No books found
          <div className="col-span-full py-8 text-center text-gray-500 dark:text-gray-400">
            No books found in this category
          </div>
        )}
      </div>

      {/* Generate Quote Button */}
      {selectedBook && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => onBookSelect?.(selectedBook)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium 
                     hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Generate Quote from {selectedBook.title}
          </button>
        </div>
      )}
    </div>
  );
};