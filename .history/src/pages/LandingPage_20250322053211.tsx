import React, { useEffect, useState } from 'react';
import { Header } from '../components/Layout/Header';
import { HeroSection } from '../components/sections/HeroSection';
import { QuoteCard, QuoteCardSkeleton } from '../components/quote/QuoteCard';
import { AuthorCard } from '../components/Author/AuthorCard';
import { CollectionCard, CollectionCardSkeleton } from '../components/Collection/CollectionCard';
import { ErrorMessage } from '../components/common/ErrorMessage';
import type { Collection } from '../types/collection';

interface Quote {
  id: string;
  text: string;
  author: {
    id: string;
    name: string;
  };
  book?: {
    id: string;
    title: string;
  };
}

interface Author {
  id: string;
  name: string;
  imageUrl?: string;
  quotesCount: number;
  booksCount: number;
}

const LandingPage: React.FC = () => {
  const [quoteOfDay, setQuoteOfDay] = useState<Quote | null>(null);
  const [recentQuotes, setRecentQuotes] = useState<Quote[]>([]);
  const [popularAuthors, setPopularAuthors] = useState<Author[]>([]);
  const [featuredCollections, setFeaturedCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API calls
        await Promise.all([
          // Simulate API calls with setTimeout
          new Promise(resolve => setTimeout(resolve, 1000))
        ]);

        // Mock data
        setQuoteOfDay({
          id: '1',
          text: "Life is what happens while you're busy making other plans.",
          author: { id: '1', name: 'John Lennon' }
        });

        setRecentQuotes([
          {
            id: '2',
            text: "The only way to do great work is to love what you do.",
            author: { id: '2', name: 'Steve Jobs' },
            book: { id: '1', title: 'The Innovation Secrets' }
          },
          {
            id: '3',
            text: "Be the change you wish to see in the world.",
            author: { id: '3', name: 'Mahatma Gandhi' }
          }
        ]);

        setPopularAuthors([
          {
            id: '1',
            name: 'Marcus Aurelius',
            imageUrl: '/authors/marcus-aurelius.jpg',
            quotesCount: 150,
            booksCount: 3
          },
          {
            id: '2',
            name: 'Jane Austen',
            imageUrl: '/authors/jane-austen.jpg',
            quotesCount: 200,
            booksCount: 6
          }
        ]);

        // Mock featured collections with complete Collection type data
        setFeaturedCollections([
          {
            id: '1',
            name: 'Stoic Wisdom',
            description: 'Ancient wisdom for modern life',
            curatorId: '1',
            curator: {
              id: '1',
              name: 'Philosophy Guide',
              imageUrl: '/curators/phil-guide.jpg'
            },
            isPublic: true,
            isFeatured: true,
            quotes: [],
            quoteCount: 100,
            followers: 1500,
            tags: ['philosophy', 'stoicism', 'wisdom'],
            theme: {
              backgroundColor: 'blue',
              textColor: 'white'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Literary Classics',
            description: 'Timeless quotes from classic literature',
            curatorId: '2',
            curator: {
              id: '2',
              name: 'Book Lover',
              imageUrl: '/curators/book-lover.jpg'
            },
            isPublic: true,
            isFeatured: true,
            quotes: [],
            quoteCount: 150,
            followers: 2000,
            tags: ['literature', 'classics', 'books'],
            theme: {
              backgroundColor: 'purple',
              textColor: 'white'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]);

        setLoading(false);
      } catch (err) {
        setError('Failed to load content. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <HeroSection />

      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Quote of the Day */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Quote of the Day
          </h2>
          {loading ? (
            <QuoteCardSkeleton />
          ) : (
            quoteOfDay && (
              <QuoteCard
                text={quoteOfDay.text}
                author={quoteOfDay.author}
                book={quoteOfDay.book}
                isQuoteOfTheDay
              />
            )
          )}
        </section>

        {/* Recently Added Quotes */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recently Added
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <>
                <QuoteCardSkeleton />
                <QuoteCardSkeleton />
              </>
            ) : (
              recentQuotes.map(quote => (
                <QuoteCard
                  key={quote.id}
                  text={quote.text}
                  author={quote.author}
                  book={quote.book}
                />
              ))
            )}
          </div>
        </section>

        {/* Popular Authors */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Popular Authors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <>
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32" />
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32" />
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32" />
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32" />
              </>
            ) : (
              popularAuthors.map(author => (
                <AuthorCard key={author.id} {...author} />
              ))
            )}
          </div>
        </section>

        {/* Featured Collections */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Featured Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <>
                <CollectionCardSkeleton />
                <CollectionCardSkeleton />
                <CollectionCardSkeleton />
              </>
            ) : (
              featuredCollections.map(collection => (
                <CollectionCard key={collection.id} collection={collection} />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;