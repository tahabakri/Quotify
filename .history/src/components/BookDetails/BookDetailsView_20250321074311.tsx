import { ArrowLeft, Star, Calendar, Link, Book } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Book as BookType } from '../../services/supabase/types';
import { QuoteBrowser } from './QuoteBrowser';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface BookDetailsViewProps {
  book: BookType;
  onClose: () => void;
}

type TabId = 'overview' | 'quotes';

export function BookDetailsView({ book, onClose }: BookDetailsViewProps) {
  const [lastFocusedElement, setLastFocusedElement] = useState<HTMLElement | null>(null);
  const focusTrapRef = useFocusTrap(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    // Save the currently focused element
    const activeElement = document.activeElement as HTMLElement;
    setLastFocusedElement(activeElement);

    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyDown);

    // Prevent scrolling of the background
    document.body.style.overflow = 'hidden';

    return () => {
      // Restore background scrolling
      document.body.style.overflow = '';

      // Remove keyboard event listener
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus
      lastFocusedElement?.focus();
    };
  }, [handleKeyDown, lastFocusedElement]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-details-title"
    >
      <div 
        ref={focusTrapRef}
        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Close details"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 id="book-details-title" className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
            Book Details
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto" ref={scrollRef}>
          <div className="p-6">
            <div className="flex gap-6">
              {/* Book Cover */}
              <div className="w-40 flex-shrink-0">
                {book.cover_url ? (
                  <img
                    src={book.cover_url}
                    alt={`Cover of ${book.title}`}
                    className="w-full rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Book className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
              </div>

              {/* Book Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {book.title}
                </h1>
                
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  {book.author}
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm mb-6">
                  {book.average_rating && (
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{book.average_rating.toFixed(1)}</span>
                    </div>
                  )}
                  
                  {book.published_date && (
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{book.published_date}</span>
                    </div>
                  )}
                  
                  {book.preview_link && (
                    <a
                      href={book.preview_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <Link className="w-4 h-4" />
                      <span>Preview</span>
                    </a>
                  )}
                </div>

                {book.description && (
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    {book.description}
                  </p>
                )}
              </div>
            </div>

            {/* Quotes Section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Notable Quotes
              </h3>
              <QuoteBrowser 
                bookId={book.id} 
                bookTitle={book.title} 
                author={book.author} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}