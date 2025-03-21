import React from 'react';
import { Book } from '../../services/supabase/types';
import BookCover from './BookCover';

interface DisplayBook extends Omit<Book, 'cover_url' | 'average_rating'> {
  coverUrl: string;
  rating: number;
}

export interface BookCardProps {
  book: DisplayBook;
  onPreview: () => void;
  className?: string;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onPreview,
  className = ''
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-48 p-4">
          <BookCover
            url={book.coverUrl}
            title={book.title}
            className="w-full h-64 sm:h-48 object-cover rounded"
          />
        </div>
        
        <div className="flex-1 p-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {book.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {book.author}
          </p>

          {book.description && (
            <p className="mt-4 text-gray-700 dark:text-gray-300 line-clamp-3">
              {book.description}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {book.rating > 0 && (
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-gray-600 dark:text-gray-400">
                    {book.rating.toFixed(1)}
                  </span>
                </div>
              )}
              {book.page_count && (
                <span className="text-gray-600 dark:text-gray-400">
                  {book.page_count} pages
                </span>
              )}
            </div>

            <button
              onClick={onPreview}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Preview
            </button>
          </div>

          {book.categories && book.categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {book.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded"
                >
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;