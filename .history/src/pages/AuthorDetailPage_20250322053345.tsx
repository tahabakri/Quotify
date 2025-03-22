import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QuoteCard } from '../components/quote/QuoteCard';
import { ErrorMessage } from '../components/common/ErrorMessage';

interface Book {
  id: string;
  title: string;
  coverUrl?: string;
  description: string;
  publicationYear: number;
}

interface Author {
  id: string;
  name: string;
  imageUrl?: string;
  bio: string;
  birthYear?: number;
  deathYear?: number;
  nationality?: string;
  quotes: {
    id: string;
    text: string;
    book?: {
      id: string;
      title: string;
    };
  }[];
  books: Book[];
}

const AuthorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data
        setAuthor({
          id: id || '1',
          name: 'Oscar Wilde',
          imageUrl: '/authors/oscar-wilde.jpg',
          bio: "Oscar Wilde was an Irish poet and playwright. After writing in different forms throughout the 1880s, he became one of London's most popular playwrights in the early 1890s.",
          birthYear: 1854,
          deathYear: 1900,
          nationality: 'Irish',
          quotes: [
            {
              id: '1',
              text: "Be yourself; everyone else is already taken.",
              book: { id: '1', title: 'Personal Letters' }
            },
            {
              id: '2',
              text: "To live is the rarest thing in the world. Most people exist, that is all.",
              book: { id: '2', title: 'The Soul of Man Under Socialism' }
            }
          ],
          books: [
            {
              id: '1',
              title: 'The Picture of Dorian Gray',
              coverUrl: '/books/dorian-gray.jpg',
              description: 'A philosophical novel that deals with the nature of art and beauty.',
              publicationYear: 1890
            },
            {
              id: '2',
              title: 'The Importance of Being Earnest',
              coverUrl: '/books/earnest.jpg',
              description: 'A trivial comedy for serious people.',
              publicationYear: 1895
            }
          ]
        });

      } catch (err) {
        setError('Failed to load author details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAuthor();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8 animate-pulse">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-8 mb-8">
              <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              </div>
            </div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded mb-8" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message={error || 'Author not found'} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Author Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
              {author.imageUrl && (
                <img
                  src={author.imageUrl}
                  alt={author.name}
                  className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0"
                />
              )}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {author.name}
                </h1>
                {(author.birthYear || author.deathYear) && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {author.birthYear} - {author.deathYear || 'Present'}
                    {author.nationality && ` • ${author.nationality}`}
                  </p>
                )}
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  {author.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Books Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Books
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {author.books.map((book) => (
                <Link
                  key={book.id}
                  to={`/books/${book.id}`}
                  className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-w-2 aspect-h-3 bg-gray-100 dark:bg-gray-700">
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                        No Cover
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {book.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {book.publicationYear}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Quotes Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Popular Quotes
            </h2>
            <div className="grid gap-6">
              {author.quotes.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  text={quote.text}
                  author={{ id: author.id, name: author.name }}
                  book={quote.book}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AuthorDetailPage;