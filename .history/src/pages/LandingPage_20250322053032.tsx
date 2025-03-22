import React, { useEffect, useState } from 'react';
import { Header } from '../components/Layout/Header';
import { HeroSection } from '../components/sections/HeroSection';
import { QuoteCard, QuoteCardSkeleton } from '../components/quote/QuoteCard';
import { AuthorCard } from '../components/Author/AuthorCard';
import { CollectionCard } from '../components/Collection/CollectionCard';
import { ErrorMessage } from '../components/common/ErrorMessage';

// Mock data types (should match your actual types)
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

interface Collection {
  id: string;
  name: string;
  description: string;
  curator: {
    id: string;
    name: string;
    imageUrl?: string;
  };
  quoteCount: number;
  theme?: {
    backgroundColor: string;
    textColor: string;
  };
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

        setFeaturedCollections([
          {
            id: '1',
            name: 'Stoic Wisdom',
            description: 'Ancient wisdom for modern life',
            curator: {
              id: '1',
              name: 'Philosophy Guide',
              imageUrl: '/curators/phil-guide.jpg'
            },
            quoteCount: 100,
            theme: {
              backgroundColor: '#2c3e50',
              textColor: '#ecf0f1'
            }
          },
          {
            id: '2',
            name: 'Literary Classics',
            description: 'Timeless quotes from classic literature',
            curator: {
              id: '2',
              name: 'Book Lover',
              imageUrl: '/curators/book-lover.jpg'
            },
            quoteCount: 150,
            theme: {
              backgroundColor: '#8e44ad',
              textColor: '#f5f6fa'
            }
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
                <AuthorCard.Skeleton />
                <AuthorCard.Skeleton />
                <AuthorCard.Skeleton />
                <AuthorCard.Skeleton />
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