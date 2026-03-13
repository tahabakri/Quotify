import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '../components/sections/HeroSection';
import { QuoteCard, QuoteCardSkeleton } from '../components/quote/QuoteCard';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { getRandomQuote, getRandomQuotes } from '../api/quotes';
import { getAuthors } from '../api/authors';
import { getImageUrl } from '../utils/imageHelpers';
import { Link } from 'react-router-dom';
import { scrollFadeUp, premiumTransition, viewportConfig } from '../lib/animations';
import type { QuotableQuote } from '../api/quotes';
import type { QuotableAuthor } from '../api/authors';

const LandingPage: React.FC = () => {
  const [quoteOfDay, setQuoteOfDay] = useState<QuotableQuote | null>(null);
  const [recentQuotes, setRecentQuotes] = useState<QuotableQuote[]>([]);
  const [popularAuthors, setPopularAuthors] = useState<QuotableAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [qod, recent, authorsData] = await Promise.all([
          getRandomQuote(),
          getRandomQuotes(4),
          getAuthors(1, 8, 'quoteCount', 'desc'),
        ]);

        setQuoteOfDay(qod);
        setRecentQuotes(recent);
        setPopularAuthors(authorsData.authors);
      } catch {
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen">
      <HeroSection />

      <main className="max-w-5xl mx-auto px-4 py-24 space-y-24">
        {/* Quote of the Day */}
        <motion.section
          variants={scrollFadeUp}
          initial="initial"
          whileInView="whileInView"
          viewport={viewportConfig}
          transition={premiumTransition}
        >
          <h2 className="font-heading text-3xl text-foreground mb-8">
            Quote of the Day
          </h2>
          {loading ? (
            <QuoteCardSkeleton />
          ) : (
            quoteOfDay && (
              <QuoteCard
                content={quoteOfDay.content}
                author={{ id: quoteOfDay.authorSlug, name: quoteOfDay.author }}
                isQuoteOfTheDay
              />
            )
          )}
        </motion.section>

        {/* Discover Quotes */}
        <motion.section
          variants={scrollFadeUp}
          initial="initial"
          whileInView="whileInView"
          viewport={viewportConfig}
          transition={premiumTransition}
        >
          <h2 className="font-heading text-3xl text-foreground mb-8">
            Discover Quotes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <>
                <QuoteCardSkeleton />
                <QuoteCardSkeleton />
              </>
            ) : (
              recentQuotes.map((quote) => (
                <QuoteCard
                  key={quote._id}
                  content={quote.content}
                  author={{ id: quote.authorSlug, name: quote.author }}
                />
              ))
            )}
          </div>
        </motion.section>

        {/* Popular Authors */}
        <motion.section
          variants={scrollFadeUp}
          initial="initial"
          whileInView="whileInView"
          viewport={viewportConfig}
          transition={premiumTransition}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-3xl text-foreground">
              Popular Authors
            </h2>
            <Link
              to="/authors"
              className="font-label text-primary-500 hover:text-primary-600 transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-muted rounded-card h-24" />
              ))
            ) : (
              popularAuthors.map((author) => (
                <Link
                  key={author._id}
                  to={`/authors/${author.slug}`}
                  className="bg-white dark:bg-navy-card rounded-card p-5 shadow-sm card-hover card-border-accent border border-border group"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={getImageUrl('author', author.name)}
                      alt={author.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-heading text-sm text-foreground group-hover:text-primary-500 transition-colors">
                        {author.name}
                      </h3>
                      <p className="font-label text-muted-foreground mt-0.5">
                        {author.quoteCount} quotes
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default LandingPage;
