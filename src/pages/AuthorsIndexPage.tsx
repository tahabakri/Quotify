import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuthors, searchAuthors } from '../api/authors';
import { getImageUrl } from '../utils/imageHelpers';
import { ErrorMessage } from '../components/common/ErrorMessage';
import type { QuotableAuthor } from '../api/authors';

const AuthorsIndexPage: React.FC = () => {
  const [authors, setAuthors] = useState<QuotableAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchAuthors = async (p: number, search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = search?.trim()
        ? await searchAuthors(search, p, 20)
        : await getAuthors(p, 20, 'quoteCount', 'desc');
      if (p === 1) {
        setAuthors(data.authors);
      } else {
        setAuthors((prev) => [...prev, ...data.authors]);
      }
      setHasMore(data.totalPages > p);
    } catch {
      setError('Failed to load authors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchAuthors(1, query);
  }, [query]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchAuthors(next, query);
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-deep">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="font-heading text-4xl text-foreground mb-6 uppercase">Authors</h1>
          <input
            type="text"
            placeholder="Search authors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full max-w-md px-5 py-3 rounded-pill border border-border bg-white/80 dark:bg-navy-card/80 backdrop-blur-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
          />
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {authors.map((author) => (
            <Link
              key={author._id}
              to={`/authors/${author.slug}`}
              className="bg-white dark:bg-navy-card rounded-card p-6 shadow-sm card-hover card-border-accent border border-border group"
            >
              <div className="flex items-center space-x-4 mb-3">
                <img
                  src={getImageUrl('author', author.name)}
                  alt={author.name}
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <h3 className="font-heading text-sm text-foreground group-hover:text-primary-500 transition-colors uppercase">
                    {author.name}
                  </h3>
                  <p className="font-label text-xs text-muted-foreground mt-0.5">
                    {author.quoteCount} quotes
                  </p>
                </div>
              </div>
              {author.description && (
                <p className="font-body text-sm text-muted-foreground line-clamp-2">
                  {author.description}
                </p>
              )}
            </Link>
          ))}
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-muted rounded-card h-32" />
            ))}
          </div>
        )}

        {hasMore && !loading && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={handleLoadMore}
              className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-pill font-label text-xs uppercase tracking-wider transition-all btn-magnetic"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorsIndexPage;
