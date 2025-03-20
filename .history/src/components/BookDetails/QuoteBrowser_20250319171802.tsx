import { Quote as QuoteIcon, ThumbsUp, Copy, Share2 } from 'lucide-react';

interface Quote {
  id: string;
  content: string;
  category: string;
  likes: number;
  isAiGenerated?: boolean;
}

interface QuoteBrowserProps {
  bookId: string;
  className?: string;
}

// Sample quotes for demonstration
const sampleQuotes: Quote[] = [
  {
    id: '1',
    content: "The world breaks everyone and afterward many are strong at the broken places.",
    category: "Life Lessons",
    likes: 234,
    isAiGenerated: false,
  },
  {
    id: '2',
    content: "We are all in the gutter, but some of us are looking at the stars.",
    category: "Inspiration",
    likes: 156,
    isAiGenerated: true,
  },
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
        {quote.isAiGenerated && (
          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
            AI Generated
          </span>
        )}
      </div>
    </div>
  );
}

export function QuoteBrowser({ bookId, className = '' }: QuoteBrowserProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Notable Quotes
        </h3>
        <button className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
          Generate with AI
        </button>
      </div>

      <div className="space-y-4">
        {sampleQuotes.map(quote => (
          <QuoteCard key={quote.id} quote={quote} />
        ))}
      </div>

      {sampleQuotes.length === 0 && (
        <div className="text-center py-8">
          <QuoteIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No quotes found for this book yet.
          </p>
          <button className="mt-4 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
            Generate the first quote
          </button>
        </div>
      )}
    </div>
  );
}