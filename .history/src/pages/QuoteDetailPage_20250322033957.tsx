import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QuoteWithContext } from '../types/quote';
import QuoteDetailSkeleton from '../components/QuoteDetail/QuoteDetailSkeleton';
import ErrorMessage from '../components/common/ErrorMessage';

const QuoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quote, setQuote] = useState<QuoteWithContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Replace with actual API call
        const response = await new Promise<QuoteWithContext>((resolve) =>
          setTimeout(() => resolve({
            id: id || '1',
            content: "All we have to decide is what to do with the time that is given us.",
            authorId: '1',
            author: {
              id: '1',
              name: 'J.R.R. Tolkien',
              imageUrl: '/author-placeholder.jpg',
              bio: 'English writer, poet, and professor',
              birthDate: '1892-01-03',
              deathDate: '1973-09-02',
            },
            book: {
              id: '1',
              title: 'The Fellowship of the Ring',
              imageUrl: '/book-placeholder.jpg',
            },
            tags: ['inspiration', 'fantasy', 'literature'],
            likes: 1234,
            shares: 567,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            relatedQuotes: [],
          }), 1500)
        );
        setQuote(response);
      } catch (err) {
        setError('Failed to load quote. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [id]);

  if (loading) return <QuoteDetailSkeleton />;
  if (error) return <ErrorMessage message={error} />;
  if (!quote) return <ErrorMessage message="Quote not found" />;

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        {/* Quote Display Section */}
        <div className="text-center mb-8">
          <blockquote className="text-3xl font-serif italic text-gray-800 mb-4">
            "{quote.text}"
          </blockquote>
          <div className="text-gray-600">
            <a href={quote.author.profileUrl} className="hover:text-blue-600 font-semibold">
              {quote.author.name}
            </a>
            {quote.book && (
              <>
                <span className="mx-2">·</span>
                <a href={quote.book.url} className="hover:text-blue-600">
                  {quote.book.title}
                </a>
              </>
            )}
          </div>
        </div>

        {/* AI Generated Image */}
        <div className="mb-8">
          <img
            src={quote.imageUrl}
            alt="AI visualization of the quote"
            className="w-full rounded-lg shadow-md"
          />
        </div>

        {/* Interaction Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Like</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>Share</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>Save</span>
          </button>
        </div>

        {/* Comments Section */}
        <div className="border-t pt-8">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          {/* Comment Form */}
          <div className="mb-6">
            <textarea
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Share your thoughts..."
            ></textarea>
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Post Comment
            </button>
          </div>
          
          {/* Sample Comments */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <img
                  src="/avatar-placeholder.jpg"
                  alt="User avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <div className="font-semibold">John Doe</div>
                  <div className="text-sm text-gray-500">2 hours ago</div>
                </div>
              </div>
              <p className="text-gray-700">
                This quote really resonates with me. It reminds us that we are in control of our destiny.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default QuoteDetailPage;