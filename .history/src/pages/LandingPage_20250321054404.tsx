import { useNavigate } from 'react-router-dom';
import { SearchSection } from '../components/SearchSection';
import { TrendingQuotes } from '../components/TrendingQuotes/TrendingQuotes';
import { FeaturedCollections } from '../components/FeaturedCollections/FeaturedCollections';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section with Search */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Discover Inspiring Quotes
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Search millions of quotes from books, explore trending content, or create your own collections.
            </p>
          </div>
          <SearchSection />
        </section>

        {/* Trending Quotes Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Trending Quotes
            </h2>
            <button
              className="text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => navigate('/search?sort=trending')}
            >
              View All
            </button>
          </div>
          <TrendingQuotes />
        </section>

        {/* Featured Collections */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Featured Collections
            </h2>
            <button
              className="text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => navigate('/collections')}
            >
              View All
            </button>
          </div>
          <FeaturedCollections />
        </section>
      </main>
    </div>
  );
}