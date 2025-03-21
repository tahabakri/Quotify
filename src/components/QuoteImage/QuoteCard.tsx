import React, { useState } from 'react';
import { Quote } from '../../services/supabase/types';
import { QuoteImage } from './QuoteImage';

interface QuoteCardProps {
  quote: Quote;
  className?: string;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote, className = '' }) => {
  const [showImageGenerator, setShowImageGenerator] = useState(false);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className}`}>
      <div className="p-6">
        <blockquote className="relative">
          <svg
            className="absolute top-0 left-0 transform -translate-x-6 -translate-y-8 h-16 w-16 text-gray-100 dark:text-gray-800"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18C6.15392 12.6333 5.52552 12.86 4.76621 12.86C3.84979 12.86 3.09047 12.5533 2.48825 11.94C1.91222 11.3266 1.62421 10.4467 1.62421 9.3C1.62421 8.2333 1.96459 7.2 2.64535 6.2C3.35231 5.2 4.33418 4.31333 5.59098 3.54L6.4943 4.36C5.81354 4.95333 5.26369 5.55333 4.84476 6.16C4.45201 6.76666 4.19017 7.38667 4.05926 8.02C4.29491 7.86 4.59678 7.78 4.96486 7.78C5.69797 7.78 6.31037 8 6.80786 8.44C7.30534 8.85333 7.39762 9.47333 7.39762 10.3ZM14.6242 10.3C14.6242 11.0733 14.3755 11.7 13.878 12.18C13.3805 12.6333 12.7521 12.86 11.9928 12.86C11.0764 12.86 10.3171 12.5533 9.71484 11.94C9.13881 11.3266 8.85079 10.4467 8.85079 9.3C8.85079 8.2333 9.19117 7.2 9.87194 6.2C10.5789 5.2 11.5608 4.31333 12.8176 3.54L13.7209 4.36C13.0401 4.95333 12.4903 5.55333 12.0713 6.16C11.6786 6.76666 11.4168 7.38667 11.2858 8.02C11.5215 7.86 11.8234 7.78 12.1915 7.78C12.9246 7.78 13.537 8 14.0345 8.44C14.532 8.85333 14.6242 9.47333 14.6242 10.3Z"
              fill="currentColor"
            />
          </svg>
          
          <div className="relative z-10">
            <p className="text-xl text-gray-900 dark:text-gray-100">
              "{quote.content}"
            </p>
            
            <footer className="mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <cite className="block text-lg font-semibold text-gray-700 dark:text-gray-300 not-italic">
                    {quote.book_title}
                  </cite>
                  {quote.author && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      by {quote.author}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowImageGenerator(!showImageGenerator)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {showImageGenerator ? 'Hide Image Generator' : 'Generate Image'}
                </button>
              </div>
            </footer>
          </div>
        </blockquote>
      </div>

      {showImageGenerator && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <QuoteImage
            quote={quote}
          />
        </div>
      )}
    </div>
  );
};

export default QuoteCard;