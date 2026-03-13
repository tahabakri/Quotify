import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { getImageUrl } from '../utils/imageHelpers';
import { getAuthorBySlug, getQuotesByAuthor } from '../api/authors';
import { searchBooks } from '../api/books';
import type { QuotableAuthor } from '../api/authors';
import type { QuotableQuote } from '../api/quotes';
import type { OpenLibraryBook } from '../api/books';

const AuthorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [author, setAuthor] = useState<QuotableAuthor | null>(null);
  const [quotes, setQuotes] = useState<QuotableQuote[]>([]);
  const [books, setBooks] = useState<OpenLibraryBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);

        const authorData = await getAuthorBySlug(id);
        setAuthor(authorData);

        const [quotesData, booksData] = await Promise.all([
          getQuotesByAuthor(authorData.slug, 1, 10),
          searchBooks(authorData.name, 0, 4).catch(() => ({ books: [], hasMore: false, totalItems: 0 })),
        ]);

        setQuotes(quotesData.quotes);
        setBooks(booksData.books);
      } catch {
        setError('Failed to load author details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-navy-deep">
        <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
          <div className="flex items-center space-x-8 mb-8">
            <div className="w-32 h-32 rounded-full bg-muted" />
            <div className="flex-1">
              <div className="h-8 bg-muted rounded w-1/2 mb-4" />
              <div className="h-4 bg-muted rounded w-1/4" />
            </div>
          </div>
          <div className="h-24 bg-muted rounded mb-8" />
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-cream dark:bg-navy-deep">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <ErrorMessage message={error || 'Author not found'} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-deep">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Author Header */}
        <div className="bg-white dark:bg-navy-card rounded-card shadow-sm border border-border p-8 mb-10 card-border-accent">
          <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
            <img
              src={getImageUrl('author', author.name)}
              alt={author.name}
              className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="font-heading text-4xl text-foreground mb-2 uppercase">
                {author.name}
              </h1>
              <p className="font-label text-xs text-muted-foreground uppercase tracking-wider mb-3">
                {author.quoteCount} quotes
              </p>
              {author.bio && (
                <p className="font-body text-lg text-muted-foreground leading-relaxed">
                  {author.bio}
                </p>
              )}
              {author.link && (
                <a
                  href={author.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 font-label text-xs text-primary-500 hover:text-primary-600 uppercase tracking-wider transition-colors"
                >
                  Wikipedia →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Books Section */}
        {books.length > 0 && (
          <section className="mb-12">
            <h2 className="font-heading text-2xl text-foreground mb-6 uppercase">Books</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <a
                  key={book.id}
                  href={book.infoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white dark:bg-navy-card rounded-card shadow-sm overflow-hidden card-hover border border-border"
                >
                  <div className="aspect-[2/3] bg-muted">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-sm text-foreground group-hover:text-primary-500 line-clamp-2 transition-colors uppercase">
                      {book.title}
                    </h3>
                    {book.publishedYear && (
                      <p className="font-label text-xs text-muted-foreground mt-1">
                        {book.publishedYear}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Quotes Section */}
        <section>
          <h2 className="font-heading text-2xl text-foreground mb-6 uppercase">Quotes</h2>
          {quotes.length > 0 ? (
            <div className="grid gap-4">
              {quotes.map((quote) => (
                <div
                  key={quote._id}
                  className="bg-white dark:bg-navy-card rounded-card p-6 shadow-sm border border-border card-hover card-border-accent"
                >
                  <blockquote className="font-quote text-lg text-foreground mb-2">
                    &ldquo;{quote.content}&rdquo;
                  </blockquote>
                  {quote.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {quote.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-primary-500/10 text-primary-500 font-label text-xs uppercase tracking-wider rounded-pill"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-muted-foreground">No quotes found for this author.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default AuthorDetailPage;
