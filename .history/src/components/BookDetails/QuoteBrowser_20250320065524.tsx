import { Quote as QuoteIcon, ThumbsUp, Copy, Share2, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { generateBookQuotes, QuoteCategory, QuoteDetail, GeneratedQuote } from '../../services/gemini';

interface Quote extends GeneratedQuote {
  id: string;
  likes: number;
}

interface QuoteBrowserProps {
  bookId: string;
  bookTitle: string;
  author: string;
  className?: string;
}

const quoteCategories: { value: QuoteCategory; label: string }[] = [
  { value: 'motivational', label: 'Motivational' },
  { value: 'philosophical', label: 'Philosophical' },
  { value: 'poetic', label: 'Poetic' },
];

function QuoteCard({ quote }: { quote: Quote }) {
  return (
    <div className="bg-white dark:bg-dark-100 rounded-lg p-4 shadow-md">
      <div className="flex items-start gap-2 mb-3">
        <QuoteIcon className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
        <p className="text-gray-800 dark:text-gray-200">{quote.content}</p>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            aria-label="Like quote"
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm">{quote.likes}</span>
          </button>
          <button
            className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            aria-label="Copy quote"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            aria-label="Share quote"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {quote.isDetailed && (
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Detailed
            </span>
          )}
          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
            AI Generated
          </span>
        </div>
      </div>
    </div>
  );
}

export function QuoteBrowser({ bookTitle, author, className = '' }: QuoteBrowserProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<QuoteCategory>('motivational');
  const [detail, setDetail] = useState<QuoteDetail>('concise');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuotes = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      if (!bookTitle.trim()) {
        throw new Error('Book title is required');
      }

      const generatedQuotes = await generateBookQuotes(
        bookTitle,
        author,
        selectedCategory,
        detail
      );
      
      const newQuotes: Quote[] = generatedQuotes.map(quote => ({
        ...quote,
        id: Date.now() + Math.random().toString(),
        likes: 0
      }));
      
      setQuotes(prev => [...newQuotes, ...prev]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate quotes. Please try again.';
      setError(errorMessage);
      console.error('Quote generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Notable Quotes
        </h3>
        <div className="flex items-center gap-4">
          <select
            className="bg-white dark:bg-dark-200 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as QuoteCategory)}
            aria-label="Select quote category"
          >
            {quoteCategories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <button
            className={`text-sm font-medium ${
              detail === 'detailed'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            } hover:text-blue-700 dark:hover:text-blue-300`}
            onClick={() => setDetail(prev => prev === 'concise' ? 'detailed' : 'concise')}
            title={detail === 'detailed' ? 'Switch to concise quotes' : 'Switch to detailed quotes'}
          >
            <BookOpen className="w-4 h-4" />
          </button>
          <button
            className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGenerateQuotes}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {quotes.map(quote => (
          <QuoteCard key={quote.id} quote={quote} />
        ))}
      </div>

      {quotes.length === 0 && (
        <div className="text-center py-8">
          <QuoteIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No quotes found for this book yet.
          </p>
          <button 
            className="mt-4 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 disabled:cursor-not-allowed"
            onClick={handleGenerateQuotes}
            disabled={isGenerating}
          >
            Generate the first quote
          </button>
        </div>
      )}
    </div>
  );
}