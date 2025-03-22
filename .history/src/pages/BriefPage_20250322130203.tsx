import React, { useState } from 'react';
import { Book } from '../types/book';
import { Quote } from '../types/quote';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface BriefPageProps {
  book: Book;
  onGenerateAnother?: () => void;
  onBack?: () => void;
}

export const BriefPage: React.FC<BriefPageProps> = ({ 
  book, 
  onGenerateAnother,
  onBack 
}) => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulated quote generation
  React.useEffect(() => {
    const generateQuote = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock quote generation
      setQuote({
        id: Math.random().toString(),
        text: "This is a generated quote from the selected book. In a real implementation, this would be generated based on the book's content.",
        author: book.author,
        book: { id: book.id, title: book.title }
      });
      setLoading(false);
    };

    generateQuote();
  }, [book]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          Back to Book Selection
        </button>

        {/* Main content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : quote ? (
            <div className="space-y-8">
              {/* Quote */}
              <blockquote className="text-2xl md:text-3xl text-gray-900 dark:text-white font-serif italic text-center">
                "{quote.text}"
              </blockquote>

              {/* Book and Author info */}
              <div className="text-center">
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {book.title}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  by {book.author.name}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={onGenerateAnother}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium 
                           hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Generate Another Quote
                </button>
                
                <button
                  onClick={() => {
                    // In a real implementation, this would save to the user's favorites
                    alert('Quote saved to favorites!');
                  }}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium
                           text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                           transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Quote
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600 dark:text-gray-400">
              Failed to generate quote. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};