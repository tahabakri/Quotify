import React from 'react';
import { Book } from '../../types/book';
import { BaseProps } from '../../types';

interface BookCardProps extends BaseProps {
  book: Book;
  onSelect?: (book: Book) => void;
  selected?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  onSelect,
  selected = false,
  className = '' 
}) => {
  return (
    <div 
      className={`
        relative bg-white dark:bg-gray-800 rounded-lg shadow-md 
        transition-all duration-300 hover:shadow-lg cursor-pointer
        ${selected ? 'ring-2 ring-blue-500' : ''}
        ${className}
      `}
      onClick={() => onSelect?.(book)}
    >
      <div className="aspect-[2/3] relative overflow-hidden rounded-t-lg">
        <img
          src={book.coverUrl || '/placeholder-book-cover.jpg'}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
          {book.author.name}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {book.category}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {book.quotesCount} quotes
          </span>
        </div>
      </div>
    </div>
  );
};

export const BookCardSkeleton: React.FC<BaseProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
      <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-t-lg animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
        <div className="flex justify-between mt-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4" />
        </div>
      </div>
    </div>
  );
};