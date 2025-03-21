import { Heart, Share2, Image as ImageIcon } from 'lucide-react';
import { Quote } from '../../services/supabase/types';

interface QuoteCardProps {
  quote: Quote;
  onLike?: (quote: Quote) => void;
  onShare?: (quote: Quote) => void;
  onGenerateImage?: (quote: Quote) => void;
  className?: string;
}

export function QuoteCard({ 
  quote, 
  onLike, 
  onShare, 
  onGenerateImage, 
  className = '' 
}: QuoteCardProps) {
  return (
    <article className={`group ${className}`}>
      <blockquote className="mb-4">
        <p className="text-lg text-gray-900 dark:text-white mb-3">
          "{quote.content}"
        </p>
        <footer className="text-sm">
          <cite className="text-gray-700 dark:text-gray-300 not-italic">
            {quote.author}
            {quote.book_title && (
              <>
                <span className="mx-2">·</span>
                <span className="text-gray-600 dark:text-gray-400">{quote.book_title}</span>
              </>
            )}
          </cite>
        </footer>
      </blockquote>

      <div className="flex items-center gap-4 text-sm">
        {onLike && (
          <button
            onClick={() => onLike(quote)}
            className="btn-secondary !p-2"
            aria-label="Like quote"
          >
            <Heart className={`w-4 h-4 ${quote.liked ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        )}

        {onShare && (
          <button
            onClick={() => onShare(quote)}
            className="btn-secondary !p-2"
            aria-label="Share quote"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}

        {onGenerateImage && (
          <button
            onClick={() => onGenerateImage(quote)}
            className="btn-secondary !p-2"
            aria-label="Generate image from quote"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
        )}

        {quote.tags && quote.tags.length > 0 && (
          <div className="ml-auto flex flex-wrap gap-2">
            {quote.tags.map(tag => (
              <span 
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default QuoteCard;