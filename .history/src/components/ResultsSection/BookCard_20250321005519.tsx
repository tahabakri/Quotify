import { Star, Bookmark, Quote as QuoteIcon, Eye } from 'lucide-react';
import { Book } from '../../services/supabase/types';
import { BookCover } from './BookCover';

interface BookCardProps {
  book: Book;
  onSave?: (book: Book) => void;
  onQuote?: (book: Book) => void;
  onPreview?: (book: Book) => void;
  className?: string;
}

export function BookCard({ book, onSave, onQuote, onPreview, className = '' }: BookCardProps) {
  return (
    <article className={`group relative ${className}`}>
      <div className="flex gap-4">
        <BookCover
          coverUrl={book.cover_url}
          title={book.title}
          className="w-24 h-36 rounded-lg shadow-md transition-transform group-hover:scale-105"
        />
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {book.title}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {book.author}
          </p>
          
          {book.average_rating && (
            <div className="flex items-center gap-1 text-sm text-yellow-500 mb-2">
              <Star className="w-4 h-4 fill-current" />
              <span>{book.average_rating.toFixed(1)}</span>
            </div>
          )}
          
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-4">
            {book.description}
          </p>
          
          <div className="flex items-center gap-3 text-sm">
            {onQuote && (
              <button
                onClick={() => onQuote(book)}
                className="btn-secondary !p-2"
                aria-label="Create quote from book"
              >
                <QuoteIcon className="w-4 h-4" />
              </button>
            )}
            
            {onSave && (
              <button
                onClick={() => onSave(book)}
                className="btn-secondary !p-2"
                aria-label="Save book"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            )}
            
            {onPreview && book.preview_link && (
              <button
                onClick={() => onPreview(book)}
                className="btn-secondary !p-2"
                aria-label="Preview book"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            
            <span className="ml-auto text-gray-500 dark:text-gray-400">
              {book.published_date}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}