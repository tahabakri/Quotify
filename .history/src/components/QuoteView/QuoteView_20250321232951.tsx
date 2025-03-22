import { useState } from 'react';
import { FiHeart, FiShare2, FiCopy, FiImage, FiBookmark } from 'react-icons/fi';
import { TrendingQuote } from '../../types/quote';

interface QuoteViewProps {
  quote: TrendingQuote;
  onLike?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  onGenerateImage?: () => void;
}

export function QuoteView({ 
  quote, 
  onLike, 
  onShare, 
  onSave, 
  onGenerateImage 
}: QuoteViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(quote.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      {/* Quote Content */}
      <div className="mb-8">
        <blockquote className="text-2xl md:text-3xl text-gray-900 dark:text-white leading-relaxed">
          "{quote.content}"
        </blockquote>
      </div>

      {/* Book and Author Info */}
      <div className="flex items-center gap-4 mb-8">
        {quote.book?.imageUrl && (
          <img
            src={quote.book.imageUrl}
            alt={quote.book.title}
            className="w-16 h-24 object-cover rounded"
          />
        )}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {quote.book?.title || "Unknown Book"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            by {quote.author.name}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={onLike}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full
            ${quote.likes > 0 
              ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300' 
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}
            hover:bg-red-100 hover:text-red-600
            dark:hover:bg-red-900 dark:hover:text-red-300
            transition-colors
          `}
        >
          <FiHeart className={quote.likes > 0 ? 'fill-current' : ''} />
          <span>{quote.likes}</span>
        </button>

        <button
          onClick={handleCopy}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full
            ${copied 
              ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' 
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}
            hover:bg-blue-100 hover:text-blue-600
            dark:hover:bg-blue-900 dark:hover:text-blue-300
            transition-colors
          `}
        >
          <FiCopy />
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>

        <button
          onClick={onShare}
          className="
            flex items-center gap-2 px-4 py-2 rounded-full
            bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300
            hover:bg-blue-100 hover:text-blue-600
            dark:hover:bg-blue-900 dark:hover:text-blue-300
            transition-colors
          "
        >
          <FiShare2 />
          <span>Share</span>
        </button>

        <button
          onClick={onSave}
          className="
            flex items-center gap-2 px-4 py-2 rounded-full
            bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300
            hover:bg-blue-100 hover:text-blue-600
            dark:hover:bg-blue-900 dark:hover:text-blue-300
            transition-colors
          "
        >
          <FiBookmark />
          <span>Save</span>
        </button>

        <button
          onClick={onGenerateImage}
          className="
            flex items-center gap-2 px-4 py-2 rounded-full
            bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300
            hover:bg-purple-100 hover:text-purple-600
            dark:hover:bg-purple-900 dark:hover:text-purple-300
            transition-colors
          "
        >
          <FiImage />
          <span>Generate Image</span>
        </button>
      </div>
    </div>
  );
}