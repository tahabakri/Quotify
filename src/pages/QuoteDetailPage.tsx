import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { getImageUrl } from '../utils/imageHelpers';
import { getRandomQuotes } from '../api/quotes';
import { useCollectionsStore } from '../store/collections';
import type { QuotableQuote } from '../api/quotes';

const QuoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quote, setQuote] = useState<QuotableQuote | null>(null);
  const [relatedQuotes, setRelatedQuotes] = useState<QuotableQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { isLiked, toggleLike, isSaved, saveQuote, unsaveQuote } = useCollectionsStore();

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        setError(null);

        const quotes = await getRandomQuotes(5);
        if (quotes.length > 0) {
          setQuote(quotes[0]);
          setRelatedQuotes(quotes.slice(1));
        }
      } catch {
        setError('Failed to load quote. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(
      quote ? `"${quote.content}" — ${quote.author}` : window.location.href
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToggle = () => {
    if (!quote) return;
    if (isSaved(quote._id)) {
      unsaveQuote(quote._id);
    } else {
      saveQuote(quote);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-navy-deep">
        <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
          <div className="h-8 bg-muted rounded w-3/4 mb-4" />
          <div className="h-6 bg-muted rounded w-1/2 mb-8" />
          <div className="h-40 bg-muted rounded mb-8" />
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-cream dark:bg-navy-deep">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <ErrorMessage message={error || 'Quote not found'} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-deep">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Quote */}
        <article className="bg-white dark:bg-navy-card rounded-card shadow-lg overflow-hidden card-border-accent border border-border">
          <div className="p-8 md:p-12">
            <blockquote className="font-quote text-2xl md:text-3xl text-foreground leading-relaxed mb-8">
              &ldquo;{quote.content}&rdquo;
            </blockquote>

            {/* Tags */}
            {quote.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {quote.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary-500/10 text-primary-500 dark:text-primary-300 font-label text-xs uppercase tracking-wider rounded-pill"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-border pt-6">
              <Link
                to={`/authors/${quote.authorSlug}`}
                className="flex items-center group"
              >
                <img
                  src={getImageUrl('author', quote.author)}
                  alt={quote.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="font-heading text-sm tracking-wider text-foreground group-hover:text-primary-500 transition-colors uppercase">
                    {quote.author}
                  </h3>
                </div>
              </Link>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => toggleLike(quote._id)}
                  className={`p-2 rounded-pill transition-all ${
                    isLiked(quote._id)
                      ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                  aria-label={isLiked(quote._id) ? 'Unlike' : 'Like'}
                >
                  {isLiked(quote._id) ? '❤️' : '🤍'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveToggle}
                  className={`p-2 rounded-pill transition-all ${
                    isSaved(quote._id)
                      ? 'text-primary-500 bg-primary-500/10'
                      : 'text-muted-foreground hover:text-primary-500 hover:bg-primary-500/10'
                  }`}
                  aria-label={isSaved(quote._id) ? 'Unsave' : 'Save'}
                >
                  {isSaved(quote._id) ? '🔖' : '📑'}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 rounded-pill text-muted-foreground hover:text-primary-500 hover:bg-primary-500/10 transition-all"
                  aria-label="Copy quote"
                >
                  {copied ? '✓' : '📋'}
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Quotes */}
        {relatedQuotes.length > 0 && (
          <section className="mt-12">
            <h2 className="font-heading text-2xl text-foreground mb-6">More Quotes</h2>
            <div className="grid gap-4">
              {relatedQuotes.map((rq) => (
                <div
                  key={rq._id}
                  className="bg-white dark:bg-navy-card rounded-card p-6 shadow-sm border border-border card-hover card-border-accent"
                >
                  <blockquote className="font-quote text-lg text-foreground mb-3">
                    &ldquo;{rq.content}&rdquo;
                  </blockquote>
                  <Link
                    to={`/authors/${rq.authorSlug}`}
                    className="font-label text-xs text-muted-foreground hover:text-primary-500 uppercase tracking-wider transition-colors"
                  >
                    — {rq.author}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default QuoteDetailPage;
