import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SearchBar } from '../components/search/SearchBar';
import { QuoteCard, QuoteCardSkeleton } from '../components/quote/QuoteCard';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { useSearchStore } from '../store/search';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {
    query,
    searchType,
    quoteResults,
    authorResults,
    loading,
    error,
    hasMore,
    setQuery,
    setSearchType,
    search,
    loadMore,
  } = useSearchStore();

  useEffect(() => {
    const q = searchParams.get('q') || '';
    if (q && q !== query) {
      setQuery(q);
    }
  }, [searchParams, query, setQuery]);

  useEffect(() => {
    search();
  }, [query, searchType, search]);

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-deep">
      <div className="sticky top-20 bg-white/80 dark:bg-navy-card/80 backdrop-blur-xl border-b border-border shadow-sm z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <SearchBar />
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => setSearchType('quotes')}
              className={`px-5 py-2 rounded-pill font-label text-xs uppercase tracking-wider transition-all ${
                searchType === 'quotes'
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                  : 'bg-white/60 dark:bg-navy-card/60 border border-border text-muted-foreground hover:border-primary-500/40'
              }`}
            >
              Quotes
            </button>
            <button
              onClick={() => setSearchType('authors')}
              className={`px-5 py-2 rounded-pill font-label text-xs uppercase tracking-wider transition-all ${
                searchType === 'authors'
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                  : 'bg-white/60 dark:bg-navy-card/60 border border-border text-muted-foreground hover:border-primary-500/40'
              }`}
            >
              Authors
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {error ? (
          <ErrorMessage message={error} />
        ) : loading && quoteResults.length === 0 && authorResults.length === 0 ? (
          <div className="grid gap-6">
            <QuoteCardSkeleton />
            <QuoteCardSkeleton />
            <QuoteCardSkeleton />
          </div>
        ) : searchType === 'quotes' ? (
          <>
            {quoteResults.length > 0 ? (
              <div className="grid gap-6">
                {quoteResults.map((quote) => (
                  <QuoteCard
                    key={quote._id}
                    content={quote.content}
                    author={{ id: quote.authorSlug, name: quote.author }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="font-heading text-2xl text-foreground mb-2">No quotes found</h3>
                <p className="font-body text-muted-foreground">Try adjusting your search</p>
              </div>
            )}
          </>
        ) : (
          <>
            {authorResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {authorResults.map((author) => (
                  <Link
                    key={author._id}
                    to={`/authors/${author.slug}`}
                    className="bg-white dark:bg-navy-card rounded-card p-6 shadow-sm card-hover card-border-accent border border-border group"
                  >
                    <h3 className="font-heading text-lg text-foreground group-hover:text-primary-500 transition-colors">
                      {author.name}
                    </h3>
                    <p className="font-label text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                      {author.quoteCount} quotes
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="font-heading text-2xl text-foreground mb-2">No authors found</h3>
                <p className="font-body text-muted-foreground">Try adjusting your search</p>
              </div>
            )}
          </>
        )}

        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-pill font-label text-xs uppercase tracking-wider disabled:opacity-50 transition-all btn-magnetic"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
