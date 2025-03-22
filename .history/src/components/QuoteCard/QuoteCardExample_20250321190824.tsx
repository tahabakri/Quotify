import { useState } from 'react';
import type { Quote } from '../../types';
import { QuoteCard } from './QuoteCard';
import { QuoteCardLoadingGrid } from './QuoteCardLoadingGrid';
import { NoResults } from '../common';

interface QuoteCardExampleProps {
  quotes?: Quote[];
  loading?: boolean;
  error?: string | null;
}

export function QuoteCardExample({
  quotes = [],
  loading = false,
  error = null
}: QuoteCardExampleProps) {
  const [likedQuotes, setLikedQuotes] = useState<Set<string>>(new Set());
  const [savedQuotes, setSavedQuotes] = useState<Set<string>>(new Set());

  if (error) {
    return (
      <NoResults 
        type="error" 
        message={error}
        suggestion="Please try again later"
      />
    );
  }

  if (loading) {
    return <QuoteCardLoadingGrid count={6} />;
  }

  if (quotes.length === 0) {
    return (
      <NoResults 
        type="empty"
        message="No quotes found"
        suggestion="Try adjusting your search criteria"
      />
    );
  }

  const handleLike = (quoteId: string) => {
    setLikedQuotes(prev => {
      const next = new Set(prev);
      if (next.has(quoteId)) {
        next.delete(quoteId);
      } else {
        next.add(quoteId);
      }
      return next;
    });
  };

  const handleSave = (quoteId: string) => {
    setSavedQuotes(prev => {
      const next = new Set(prev);
      if (next.has(quoteId)) {
        next.delete(quoteId);
      } else {
        next.add(quoteId);
      }
      return next;
    });
  };

  const handleShare = (quote: Quote) => {
    if (navigator.share) {
      navigator.share({
        title: `Quote by ${quote.author.name}`,
        text: quote.content,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(quote.content)
        .then(() => alert('Quote copied to clipboard!'))
        .catch(console.error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {quotes.map(quote => (
        <QuoteCard
          key={quote.id}
          quote={quote}
          liked={likedQuotes.has(quote.id)}
          saved={savedQuotes.has(quote.id)}
          onLike={() => handleLike(quote.id)}
          onSave={() => handleSave(quote.id)}
          onShare={() => handleShare(quote)}
        />
      ))}
    </div>
  );
}