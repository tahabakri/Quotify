import { Quote as QuoteIcon, BookOpen, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { generateBookQuotes, QuoteCategory, QuoteDetail } from '../../services/gemini';
import { Quote } from '../../services/supabase/types';
import { QuoteCard } from '../ResultsSection/QuoteCard';

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

export function QuoteBrowser({ bookId, bookTitle, author, className = '' }: QuoteBrowserProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<QuoteCategory>('motivational');
  const [detail, setDetail] = useState<QuoteDetail>('concise');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        setLoading(true);
        setError(null);
        // TODO: Implement actual quote fetching
        const mockQuotes: Quote[] = [
          {
            id: '1',
            content: 'A sample quote from the book...',
            author: 'Author Name',
            book_title: 'Book Title',
            tags: ['inspirational']
          }
        ];
        setQuotes(mockQuotes);
      } catch (err) {
        setError('Failed to load quotes');
        console.error('Error fetching quotes:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuotes();
  }, [bookId]);

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

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!quotes.length) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600 dark:text-gray-400">
          No quotes found for this book yet.
        </p>
      </div>
    );
  }

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