import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/search/SearchBar';
import { QuickFilters } from '../components/search/QuickFilters';
import { QuoteCard, QuoteCardSkeleton } from '../components/quote/QuoteCard';
import { ErrorMessage } from '../components/common/ErrorMessage';

interface SearchFilters {
  author?: string;
  book?: string;
  genre?: string;
  sortBy: 'recent' | 'popular';
}

interface SearchResult {
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

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({ sortBy: 'recent' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock results
        setResults([
          {
            text: "The future belongs to those who believe in the beauty of their dreams.",
            author: { id: '1', name: 'Eleanor Roosevelt' },
            book: { id: '1', title: 'You Learn by Living' }
          },
          {
            text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
            author: { id: '2', name: 'Winston Churchill' }
          }
        ]);

      } catch (err) {
        setError('Failed to load search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams, filters]);

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sticky search header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10">
        <div className="container mx-auto px-4 py-4">
          <SearchBar />
          <div className="mt-4">
            <QuickFilters />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Filters sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-32 space-y-6 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Filters
                </h3>
                
                {/* Author filter */}
                <div className="mb-4">
                  <label 
                    htmlFor="author-filter"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Author
                  </label>
                  <select
                    id="author-filter"
                    aria-label="Filter quotes by author"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
                    value={filters.author}
                    onChange={(e) => handleFilterChange({ author: e.target.value })}
                  >
                    <option value="">All Authors</option>
                    {/* Add author options here */}
                  </select>
                </div>

                {/* Genre filter */}
                <div className="mb-4">
                  <label 
                    htmlFor="genre-filter"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Genre
                  </label>
                  <select
                    id="genre-filter"
                    aria-label="Filter quotes by genre"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
                    value={filters.genre}
                    onChange={(e) => handleFilterChange({ genre: e.target.value })}
                  >
                    <option value="">All Genres</option>
                    {/* Add genre options here */}
                  </select>
                </div>

                {/* Sort by */}
                <div>
                  <label 
                    htmlFor="sort-by"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Sort By
                  </label>
                  <select
                    id="sort-by"
                    aria-label="Sort quotes by"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange({ sortBy: e.target.value as 'recent' | 'popular' })}
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="lg:col-span-9 mt-8 lg:mt-0">
            {error ? (
              <ErrorMessage message={error} />
            ) : (
              <>
                {loading ? (
                  <div className="grid gap-6">
                    <QuoteCardSkeleton />
                    <QuoteCardSkeleton />
                    <QuoteCardSkeleton />
                  </div>
                ) : (
                  <>
                    {results.length > 0 ? (
                      <div className="grid gap-6">
                        {results.map((quote, index) => (
                          <QuoteCard
                            key={index}
                            text={quote.text}
                            author={quote.author}
                            book={quote.book}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-xl text-gray-600 dark:text-gray-400">
                          No results found
                        </h3>
                        <p className="mt-2 text-gray-500 dark:text-gray-500">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;