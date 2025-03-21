import { UserContextProvider } from './contexts/UserContext.tsx';
import { NotificationProvider } from './contexts/NotificationContext';
import { ImageGenerationProvider } from './contexts/ImageGenerationContext';
import { ResultsSection } from './components/ResultsSection/ResultsSection';
import { SearchSection } from './components/SearchSection/SearchSection';
import { useSearch, SearchProvider } from './contexts/useSearch';
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

function AppContent() {
  const { results, loading, hasMore, loadMore, searchType } = useSearch();
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    document.documentElement.classList.toggle('dark', darkMode);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <main className={`min-h-screen transition-colors duration-500 ${
      darkMode ? 'bg-gradient-to-b from-dark-100 to-dark-900' : 'bg-gradient-to-b from-gray-50 to-gray-100'
    }`}>
      <header className={`sticky top-0 z-50 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm transition-all duration-300 ${
        scrolled ? 'shadow-md py-3' : 'py-5'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Quote Explorer
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Discover inspiring quotes from literature
            </p>
          </div>
          
          <nav className="flex items-center space-x-6">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-all duration-300 ${
                darkMode 
                  ? 'bg-dark-200 text-yellow-400 hover:bg-dark-100' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">Home</a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">Collections</a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">Authors</a>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors">
                Sign In
              </button>
            </div>
            
            <button className="md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <section className="mb-10 md:mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Find Your Perfect <span className="text-blue-600 dark:text-blue-400">Quote</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Search and discover inspiring quotes from your favorite books, authors, and categories
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl">
              <SearchSection />
            </div>
          </div>
          
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <ResultsSection
                results={results}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={loadMore}
                type={searchType}
              />
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16 py-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quote Explorer</h4>
              <p className="text-gray-600 dark:text-gray-400">Your source for literary inspiration</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} Quote Explorer</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function App() {
  return (
    <UserContextProvider>
      <NotificationProvider>
        <ImageGenerationProvider>
          <SearchProvider>
            <AppContent />
          </SearchProvider>
        </ImageGenerationProvider>
      </NotificationProvider>
    </UserContextProvider>
  );
}

export default App;