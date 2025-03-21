import React, { useState } from 'react';
import { QuoteImage } from '../QuoteImage';
import { Quote } from '../../services/supabase/types';

interface QuoteCardProps {
  quote: Quote;
  className?: string;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote, className = '' }) => {
  const [showImageGenerator, setShowImageGenerator] = useState(false);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
      <div className="space-y-4">
        <blockquote className="text-lg font-medium text-gray-900 dark:text-gray-100">
          "{quote.content}"
        </blockquote>
        
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-medium">{quote.book_title}</span>
            {quote.author && <span> by {quote.author}</span>}
          </div>
          <button
            onClick={() => setShowImageGenerator(!showImageGenerator)}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {showImageGenerator ? 'Hide Image Generator' : 'Generate Image'}
          </button>
        </div>

        {showImageGenerator && (
          <div className="mt-6 border-t pt-6">
            <QuoteImage
              quote={quote.content}
              quoteId={quote.id}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteCard;