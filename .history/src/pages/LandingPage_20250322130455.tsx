import React, { useEffect, useState } from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { QuoteCard, QuoteCardSkeleton } from '../components/quote/QuoteCard';
import { AuthorCard } from '../components/Author/AuthorCard';
import { CollectionCard, CollectionCardSkeleton } from '../components/Collection/CollectionCard';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { BookSelection } from '../components/Book/BookSelection';
import { BriefPage } from './BriefPage';
import type { Collection } from '../types/collection';
import type { Book } from '../types/book';
import type { Author } from '../types/author';

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

const LandingPage: React.FC = () => {
  const [quoteOfDay, setQuoteOfDay] = useState<Quote | null>(null);
  const [recentQuotes, setRecentQuotes] = useState<Quote[]>([]);
  const [popularAuthors, setPopularAuthors] = useState<Author[]>([]);
  const [featuredCollections, setFeaturedCollections] = useState<Collection[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
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

        const mockAuthors: Author[] = [
          {
            id: '1',
            name: 'Marcus Aurelius',
            imageUrl: '/authors/marcus-aurelius.jpg',
            quotesCount: 150,
            worksCount: 3,
            followers: 5000,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Jane Austen',
            imageUrl: '/authors/jane-austen.jpg',
            quotesCount: 200,
            worksCount: 6,
            followers: 7500,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];

        setPopularAuthors(mockAuthors);

        // Mock featured collections
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

        // Mock books data
        setBooks([
          {
            id: '1',
            title: 'Meditations',
            author: mockAuthors[0],
            coverUrl: '/books/meditations.jpg',
            category: 'Philosophy',
            description: 'Personal writings of the Roman Emperor Marcus Aurelius',
            publishedYear: 180,
            quotesCount: 75
          },
          {
            id: '2',
            title: 'Pride and Prejudice',
            author: mockAuthors[1],
            coverUrl: '/books/pride-and-prejudice.jpg',
            category: 'Fiction',
            description: 'A classic of English literature',
            publishedYear: 1813,
            quotesCount: 100
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

  if (selectedBook) {
    return (
      <BriefPage
        book={selectedBook}
        onGenerateAnother={() => {
          // In a real implementation, this would generate a new quote
          // For now, we'll just reset the selection to trigger a new quote
          const book = selectedBook;
          setSelectedBook(null);
          setTimeout(() => setSelectedBook(book), 0);
        }}
        onBack={() => setSelectedBook(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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

        {/* Book Selection */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Select a Book
          </h2>
          <BookSelection
            books={books}
            loading={loading}
            onBookSelect={setSelectedBook}
          />
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