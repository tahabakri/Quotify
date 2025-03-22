import { useNavigate } from 'react-router-dom';
import { SearchSection } from '../components/SearchSection';
import { TrendingQuotes } from '../components/TrendingQuotes/TrendingQuotes';
import { FeaturedCollections } from '../components/FeaturedCollections/FeaturedCollections';
import { Quote as QuoteIcon } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  const activeUsers = 1234; // TODO: Replace with real-time data
  const totalQuotes = 1000000; // TODO: Replace with actual count

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 mb-16 pb-8">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-xl transform -rotate-12 opacity-60"></div>
          <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-xl opacity-60"></div>
          <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-xl opacity-40"></div>
        </div>

        <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-6">
              <QuoteIcon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Discover Inspiring<br />Literary Quotes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
              Search millions of quotes from your favorite books, authors, and genres
            </p>
          </div>

          <SearchSection />
          
          {/* Key Metrics Display */}
          <div className="flex justify-center items-center gap-12 mt-16">
            <div className="text-center">
              <span className="block text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {totalQuotes.toLocaleString()}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Quotes</span>
            </div>
            <div className="w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
            <div className="text-center">
              <span className="block text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {activeUsers.toLocaleString()}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Readers</span>
            </div>
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-white dark:bg-gray-900">
          <svg className="absolute bottom-0 w-full h-16 fill-current text-white dark:text-gray-900" preserveAspectRatio="none" viewBox="0 0 1440 54">
            <path d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"></path>
          </svg>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quote of the Day Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Quote of the Day
            </h2>
            <TrendingQuotes featured={true} limit={1} />
          </section>

          {/* Recently Added Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
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
        </div>

        {/* Featured Collections */}
        <section className="mt-8">
          <div className="flex justify-between items-center mb-6">
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
          <FeaturedCollections filter="featured" limit={4} />
        </section>
      </div>

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