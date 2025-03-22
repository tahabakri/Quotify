import { SearchBar } from '../search/SearchBar';
import { QuickFilters } from '../search/QuickFilters';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[500px] flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800" />
      
      {/* Content */}
      <div className="relative max-w-4xl mx-auto w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
            Discover Timeless Wisdom
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore thousands of inspiring quotes from literature's greatest minds
          </p>
        </div>

        {/* Search section */}
        <div className="space-y-6">
          <SearchBar />
          <QuickFilters />
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              100K+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Quotes
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              10K+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Books
            </div>
          </div>
          <div className="text-center col-span-2 md:col-span-1">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              50K+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Active Readers
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50" />
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50" />
    </section>
  );
};