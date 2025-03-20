import { ArrowLeft, Star, User, Calendar, Hash } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import type { Book } from '../../contexts/SearchContext';
import { QuoteBrowser } from './QuoteBrowser';

interface BookDetailsViewProps {
  book: Book;
  onClose: () => void;
}

interface MetadataItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

type TabId = 'overview' | 'quotes';

interface TabProps {
  id: TabId;
  label: string;
  isActive: boolean;
  onClick: (id: TabId) => void;
}

function MetadataItem({ icon, label, value }: MetadataItemProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-purple-600 dark:text-purple-400">
        {icon}
      </div>
      <div>
        <dt className="text-sm text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className="text-gray-900 dark:text-gray-100">{value}</dd>
      </div>
    </div>
  );
}

function Tab({ id, label, isActive, onClick }: TabProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors ${
        isActive
          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
          : 'text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400'
      }`}
    >
      {label}
    </button>
  );
}

export function BookDetailsView({ book, onClose }: BookDetailsViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [lastFocusedElement, setLastFocusedElement] = useState<HTMLElement | null>(null);

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
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-details-title"
    >
      <div
        ref={useFocusTrap(true)}
        className="bg-white dark:bg-dark-200 rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-dark-100 flex items-center">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-100 rounded-full transition-colors"
            aria-label="Close details"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">Book Details</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero Section */}
          <div className="relative h-64 bg-gradient-to-r from-purple-600 to-pink-600">
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-center p-8">
              <div className="flex gap-8">
                <img
                  src={book.coverUrl}
                  alt={`Cover of ${book.title}`}
                  className="w-40 shadow-2xl rounded-lg"
                />
                <div className="flex flex-col justify-center">
                  <h1 className="text-3xl font-bold text-white mb-2">{book.title}</h1>
                  <p className="text-xl text-white/90 mb-4">{book.author}</p>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-white font-medium">{book.rating.toFixed(1)}</span>
                    {book.ratingsCount && (
                      <span className="text-white/70">
                        ({book.ratingsCount.toLocaleString()} ratings)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-8 pt-6 pb-4 border-b border-gray-200 dark:border-dark-100">
            <div className="flex gap-2">
              <Tab
                id="overview"
                label="Overview"
                isActive={activeTab === 'overview'}
                onClick={setActiveTab}
              />
              <Tab
                id="quotes"
                label="Quotes"
                isActive={activeTab === 'quotes'}
                onClick={setActiveTab}
              />
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'overview' && (
              <>
                {/* Metadata Grid */}
                <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <MetadataItem
                    icon={<User className="w-5 h-5" />}
                    label="Author"
                    value={book.author}
                  />
                  {book.publishYear && (
                    <MetadataItem
                      icon={<Calendar className="w-5 h-5" />}
                      label="Published"
                      value={book.publishYear}
                    />
                  )}
                  {book.pageCount && (
                    <MetadataItem
                      icon={<Hash className="w-5 h-5" />}
                      label="Pages"
                      value={book.pageCount}
                    />
                  )}
                </dl>

                {/* Description */}
                {book.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      About this book
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'quotes' && (
              <QuoteBrowser bookId={book.id} className="mt-2" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}