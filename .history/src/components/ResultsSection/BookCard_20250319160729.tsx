import { Star, Bookmark, Quote as QuoteIcon, Eye } from 'lucide-react';

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    coverUrl: string;
    rating: number;
    publishYear?: number;
    description?: string;
    pageCount?: number;
    ratingsCount?: number;
  };
  onSave?: (id: string) => void;
  onQuote?: (id: string) => void;
  onPreview?: (id: string) => void;
  className?: string;
}

export function BookCard({ book, onSave, onQuote, onPreview, className = '' }: BookCardProps) {
  const [imgError, setImgError] = React.useState(false);

  const fallbackCoverUrl = 'data:image/svg+xml,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
      <rect width="300" height="450" fill="#f3f4f6"/>
      <text x="150" y="225" font-family="Arial" font-size="16" fill="#6b7280" text-anchor="middle">
        No Cover Available
      </text>
    </svg>
  `);

  return (
    <div
      className={`group relative bg-white dark:bg-dark-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}
    >
      <div className="aspect-[3/4] relative overflow-hidden">
        <img
          src={imgError ? fallbackCoverUrl : book.coverUrl}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Action Buttons */}
        <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-center gap-3 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={() => onSave?.(book.id)}
            className="p-2 rounded-full bg-white/90 text-gray-800 hover:bg-white hover:text-purple-600 transition-colors duration-200"
            aria-label="Save book"
          >
            <Bookmark className="w-5 h-5" />
          </button>
          <button
            onClick={() => onQuote?.(book.id)}
            className="p-2 rounded-full bg-white/90 text-gray-800 hover:bg-white hover:text-purple-600 transition-colors duration-200"
            aria-label="View quotes"
          >
            <QuoteIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onPreview?.(book.id)}
            className="p-2 rounded-full bg-white/90 text-gray-800 hover:bg-white hover:text-purple-600 transition-colors duration-200"
            aria-label="Preview book"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          {book.author}
          {book.publishYear && <span className="ml-1 text-gray-400">({book.publishYear})</span>}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">
              {book.rating.toFixed(1)}
            </span>
            {book.ratingsCount && (
              <span className="ml-1 text-xs text-gray-400">
                ({book.ratingsCount.toLocaleString()})
              </span>
            )}
          </div>
          {book.pageCount && (
            <span className="text-xs text-gray-400">
              {book.pageCount} pages
            </span>
          )}
        </div>
        {book.description && (
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
              {book.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}