import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthorWithStats } from '../types/author';
import { Quote } from '../types/quote';
import AuthorDetailSkeleton from '../components/Author/AuthorDetailSkeleton';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { QuoteCard } from '../components/QuoteCard/QuoteCard';

const AuthorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [author, setAuthor] = useState<AuthorWithStats | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Replace with actual API call
        const response = await new Promise<AuthorWithStats>((resolve) =>
          setTimeout(() => resolve({
            id: id || '1',
            name: 'J.R.R. Tolkien',
            imageUrl: '/author-placeholder.jpg',
            bio: 'John Ronald Reuel Tolkien was an English writer, poet, philologist, and academic. He was the author of the high fantasy works The Hobbit and The Lord of the Rings.',
            notableWorks: [
              {
                id: '1',
                title: 'The Lord of the Rings',
                year: 1954,
                imageUrl: '/book1-placeholder.jpg',
              },
              {
                id: '2',
                title: 'The Hobbit',
                year: 1937,
                imageUrl: '/book2-placeholder.jpg',
              },
            ],
            birthDate: '1892-01-03',
            deathDate: '1973-09-02',
            nationality: 'English',
            genres: ['Fantasy', 'Poetry', 'Academic'],
            followers: 15420,
            quotesCount: 247,
            worksCount: 12,
            website: 'https://www.tolkienestate.com',
            wikipediaUrl: 'https://en.wikipedia.org/wiki/J._R._R._Tolkien',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            topGenres: [
              { name: 'Fantasy', count: 156 },
              { name: 'Literature', count: 45 },
              { name: 'Poetry', count: 32 }
            ],
            monthlyQuotes: [
              { month: '2025-02', count: 12 },
              { month: '2025-03', count: 15 }
            ],
            mostQuotedWork: {
              id: '1',
              title: 'The Lord of the Rings',
              quotesCount: 156
            }
          }), 1500)
        );
        setAuthor(response);

        // Fetch quotes
        const quotesResponse = await new Promise<Quote[]>((resolve) =>
          setTimeout(() => resolve([
            {
              id: '1',
              content: "All we have to decide is what to do with the time that is given us.",
              authorId: id || '1',
              author: response,
              tags: ['inspiration', 'wisdom'],
              likes: 1234,
              shares: 567,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: '2',
              content: "Not all those who wander are lost.",
              authorId: id || '1',
              author: response,
              tags: ['journey', 'wisdom'],
              likes: 987,
              shares: 432,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ]), 1000)
        );
        setQuotes(quotesResponse);
      } catch (err) {
        setError('Failed to load author details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [id]);

  const handleFollowClick = () => {
    // TODO: Implement actual follow/unfollow API call
    setIsFollowing(!isFollowing);
  };

  if (loading) return <AuthorDetailSkeleton />;
  if (error) return <ErrorMessage message={error} />;
  if (!author) return <ErrorMessage message="Author not found" />;

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Author Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Author Image */}
          <img
            src={author.imageUrl || '/default-author.jpg'}
            alt={author.name}
            className="w-48 h-48 rounded-full object-cover shadow-md"
          />
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{author.name}</h1>
                {author.nationality && (
                  <div className="text-gray-600 mb-4">{author.nationality}</div>
                )}
              </div>
              <button
                onClick={handleFollowClick}
                className={`px-6 py-2 rounded-full text-sm font-semibold ${
                  isFollowing
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>

            {/* Bio */}
            {author.bio && (
              <p className="text-gray-700 mb-6 leading-relaxed">
                {author.bio}
              </p>
            )}

            {/* Stats */}
            <div className="flex gap-6 text-center">
              <div className="bg-gray-50 px-4 py-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {author.followers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
              <div className="bg-gray-50 px-4 py-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {author.quotesCount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Quotes</div>
              </div>
              <div className="bg-gray-50 px-4 py-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {author.worksCount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Works</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Books Section */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Notable Works</h2>
            <div className="space-y-6">
              {author.notableWorks?.map((book) => (
                <Link
                  key={book.id}
                  to={`/book/${book.id}`}
                  className="flex gap-4 group"
                >
                  <img
                    src={book.imageUrl || '/default-book.jpg'}
                    alt={book.title}
                    className="w-16 h-24 object-cover rounded shadow group-hover:shadow-md transition-shadow"
                  />
                  <div>
                    <h3 className="font-medium group-hover:text-blue-600 transition-colors">
                      {book.title}
                    </h3>
                    {book.year && (
                      <div className="text-sm text-gray-600">{book.year}</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Links */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Learn More</h3>
              <div className="space-y-2">
                {author.wikipediaUrl && (
                  <a
                    href={author.wikipediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                    Wikipedia
                  </a>
                )}
                {author.website && (
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM8.5 7h7a1.5 1.5 0 0 1 0 3h-7a1.5 1.5 0 0 1 0-3zm0 4h7a1.5 1.5 0 0 1 0 3h-7a1.5 1.5 0 0 1 0-3zm0 4h7a1.5 1.5 0 0 1 0 3h-7a1.5 1.5 0 0 1 0-3z"/>
                    </svg>
                    Official Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quotes Section */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Popular Quotes</h2>
            <div className="space-y-6">
              {quotes.map((quote) => (
                <QuoteCard key={quote.id} quote={quote} />
              ))}
            </div>
            {quotes.length === 0 && (
              <div className="text-center py-8 text-gray-600">
                No quotes found for this author.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AuthorDetailPage;