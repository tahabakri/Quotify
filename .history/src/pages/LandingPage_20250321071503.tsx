import { useNavigate } from 'react-router-dom';
import { SearchSection } from '../components/SearchSection';
import { TrendingQuotes } from '../components/TrendingQuotes/TrendingQuotes';
import { FeaturedCollections } from '../components/FeaturedCollections/FeaturedCollections';
import { AuthorsGrid } from '../components/AuthorsGrid/AuthorsGrid';
import { Book } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  const activeUsers = 1234; // TODO: Replace with real-time data
  const totalQuotes = 1000000; // TODO: Replace with actual count

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 mb-16">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-8 relative z-10">
            <Book className="w-16 h-16 mx-auto mb-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Discover Inspiring Literary Quotes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              Search millions of quotes from your favorite books, authors, and genres
            </p>
          </div>
          <SearchSection />
          
          {/* Key Metrics Display */}
          <div className="flex justify-center items-center gap-8 mt-12 text-gray-600 dark:text-gray-400">
            <div className="text-center">
              <span className="block text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalQuotes.toLocaleString()}
              </span>
              <span className="text-sm">Total Quotes</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-blue-600 dark:text-blue-400">
                {activeUsers.toLocaleString()}
              </span>
              <span className="text-sm">Active Readers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Featured Quote of the Day */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Quote of the Day
              </h2>
              <TrendingQuotes featured={true} limit={1} />
            </section>

            {/* Popular Authors Grid */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Popular Authors
                </h2>
                <button
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => navigate('/authors')}
                >
                  View All
                </button>
              </div>
              <AuthorsGrid limit={8} />
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Recently Added Quotes */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Recently Added
                </h2>
                <button
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => navigate('/search?sort=recent')}
                >
                  View All
                </button>
              </div>
              <TrendingQuotes sort="recent" limit={3} />
            </section>

            {/* Genre-based Collections */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Collections by Genre
                </h2>
                <button
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => navigate('/collections')}
                >
                  View All
                </button>
              </div>
              <FeaturedCollections filter="genre" limit={4} />
            </section>
          </div>
        </div>
      </main>

      {/* Floating Get Started Button (Mobile Only) */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <button
          className="bg-blue-600 text-white rounded-full px-6 py-3 shadow-lg hover:bg-blue-700 transition-colors"
          onClick={() => navigate('/search')}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}