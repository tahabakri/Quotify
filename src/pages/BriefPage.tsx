import React, { useState } from 'react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getRandomQuotes } from '../api/quotes';
import { useCollectionsStore } from '../store/collections';
import type { QuotableQuote } from '../api/quotes';
import type { Book } from '../types/book';

interface BriefPageProps {
  book: Book;
  onGenerateAnother?: () => void;
  onBack?: () => void;
}

export const BriefPage: React.FC<BriefPageProps> = ({
  book,
  onGenerateAnother,
  onBack,
}) => {
  const [quote, setQuote] = useState<QuotableQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const { saveQuote, isSaved } = useCollectionsStore();

  React.useEffect(() => {
    const fetchQuote = async () => {
      setLoading(true);
      try {
        const quotes = await getRandomQuotes(1);
        if (quotes.length > 0) setQuote(quotes[0]);
      } catch {
        setQuote(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [book]);

  const handleSave = () => {
    if (quote) saveQuote(quote);
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-deep py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 flex items-center font-label text-xs text-muted-foreground hover:text-foreground uppercase tracking-wider transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Book Selection
        </button>

        <div className="bg-white dark:bg-navy-card rounded-card shadow-sm border border-border card-border-accent p-8 md:p-12">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : quote ? (
            <div className="space-y-10">
              <blockquote className="font-quote text-2xl md:text-4xl text-foreground italic text-center leading-relaxed">
                &ldquo;{quote.content}&rdquo;
              </blockquote>

              <div className="text-center">
                <p className="font-heading text-sm tracking-wider text-foreground uppercase">
                  {quote.author}
                </p>
                <p className="font-label text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                  Inspired by: {book.title}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={onGenerateAnother}
                  className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-pill font-label text-xs uppercase tracking-wider transition-all btn-magnetic"
                >
                  Get Another Quote
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaved(quote._id)}
                  className="px-8 py-3 border border-border rounded-pill font-label text-xs text-muted-foreground uppercase tracking-wider hover:border-primary-500/40 disabled:opacity-50 transition-all"
                >
                  {isSaved(quote._id) ? 'Saved!' : 'Save Quote'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center font-body text-muted-foreground py-12">
              Failed to load quote. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
