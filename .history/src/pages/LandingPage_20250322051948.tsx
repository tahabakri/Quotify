import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { SearchSection } from '../components/SearchSection';
import { TrendingQuotes } from '../components/TrendingQuotes/TrendingQuotes';
import { FeaturedCollections } from '../components/FeaturedCollections/FeaturedCollections';
import { Book, Quote as QuoteIcon, Sun, Moon, Menu, X } from 'lucide-react';
import { FiHome, FiSearch, FiBookmark, FiSettings, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Stats with animated counters
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  
  const targetUsers = 1234;
  const targetQuotes = 1000000;
  const targetBooks = 10000;

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Animate counters on load
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const interval = 50; // update every 50ms
    const steps = duration / interval;
    
    // Simulate loading and potentially error state
    const loadTimer = setTimeout(() => {
      setLoading(false);
      
      // Uncomment to test error state
      // setError(true);
      
      if (!error) {
        let step = 0;
        
        const counter = setInterval(() => {
          step++;
          const progress = step / steps;
          
          setActiveUsers(Math.floor(targetUsers * progress));
          setTotalQuotes(Math.floor(targetQuotes * progress));
          setTotalBooks(Math.floor(targetBooks * progress));
          
          if (step >= steps) {
            clearInterval(counter);
            setActiveUsers(targetUsers);
            setTotalQuotes(targetQuotes);
            setTotalBooks(targetBooks);
          }
        }, interval);
      }
    }, 500);
    
    return () => clearTimeout(loadTimer);
  }, [error]);

  // Array of trending topics
  const trendingTopics = [
    { name: '🔥 Trending', path: '/search?filter=trending' },
    { name: 'Recent', path: '/search?sort=recent' },
    { name: 'Popular', path: '/search?sort=popular' },
    { name: 'For You', path: '/search?personalized=true' }
  ];

  const categories = [
    { name: 'History', icon: '📜', path: '/search?genre=history' },
    { name: 'Fantasy', icon: '🧙', path: '/search?genre=fantasy' },
    { name: 'Sci-Fi', icon: '🚀', path: '/search?genre=sci-fi' },
    { name: 'Science', icon: '🔬', path: '/search?genre=science' }
  ];

  return (
    <div className="min-h-screen">
      {/* Sticky Header Navigation */}
      <header className="bg-white/95 dark:bg-gray-800/95 shadow-sm backdrop-blur-sm fixed w-full z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Book className="h-6 w-6" />
              <span>QuoteVault</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FiHome className="h-5 w-5" />
                <span>Home</span>
              </Link>
              
              <Link
                to="/search"
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FiSearch className="h-5 w-5" />
                <span>Search</span>
              </Link>
              
              <Link
                to="/collections"
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FiBookmark className="h-5 w-5" />
                <span>Collections</span>
              </Link>

              <Link
                to="/preferences"
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="User preferences"
              >
                <FiSettings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button 
                onClick={toggleDarkMode} 
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Sign In Button */}
              <button
                className="hidden md:flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => navigate('/signin')}
              >
                <FiUser className="h-4 w-4" />
                <span>Sign In</span>
              </button>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="md:hidden pt-4 pb-3 border-t border-gray-200 dark:border-gray-700 mt-3">
              <Link
                to="/"
                className="block py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/search"
                className="block py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Search
              </Link>
              <Link
                to="/collections"
                className="block py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Collections
              </Link>
              <Link
                to="/preferences"
                className="block py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </Link>
              <Link
                to="/signin"
                className="block py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="block py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 mb-16 pb-8">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-xl transform -rotate-12 opacity-60"></div>
          <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-xl opacity-60"></div>
          <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-xl opacity-40"></div>
        </div>

        <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-6">
              <Book className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Discover Inspiring Literary Quotes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
              Search millions of quotes from your favorite books, authors, and genres
            </p>
          </div>

          {/* Main Search */}
          {loading ? (
            <div className="w-full max-w-3xl mx-auto">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              <div className="flex gap-4 mt-4 justify-center">
                <div className="h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ) : error ? (
            <div className="w-full max-w-3xl mx-auto text-center py-8 px-4 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Quotes are being updated. Check back soon!
              </p>
              <button 
                onClick={() => setError(false)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="w-full max-w-3xl mx-auto">
              <SearchSection />
              
              {/* Trending Topics */}
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                {trendingTopics.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(topic.path)}
                    className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {topic.name}
                  </button>
                ))}
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-3 justify-center mt-4">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(category.path)}
                    className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Key Metrics Display */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mt-16">
            <div className="text-center">
              <span className="block text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {totalQuotes.toLocaleString()}+
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Quotes</span>
            </div>
            <div className="hidden md:block w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
            <div className="text-center">
              <span className="block text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {totalBooks.toLocaleString()}+
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Books</span>
            </div>
            <div className="hidden md:block w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
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

      {/* Quote Highlights Section */}
      <div className="container mx-auto px-4 pb-16">
        {/* Quote of the Day */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Quote of the Day
          </h2>
          
          {loading ? (
            <div className="h-60 bg-white dark:bg-gray-800 rounded-2xl shadow-sm animate-pulse"></div>
          ) : error ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm text-center">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Quotes are being updated. Check back soon!
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
              <blockquote className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 italic mb-6 leading-relaxed">
                "It is only with the heart that one can see rightly; what is essential is invisible to the eye."
              </blockquote>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Antoine de Saint-Exupéry</p>
                  <p className="text-gray-600 dark:text-gray-400">The Little Prince</p>
                </div>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => navigate('/quote/123')}
                >
                  View Details
                </button>
              </div>
            </div>
          )}
        </section>
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Recently Added Quotes */}
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

          {/* Popular Authors */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {!loading && !error && Array(4).fill(0).map((_, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-2">
                    <img 
                      src={`https://i.pravatar.cc/150?img=${idx + 10}`} 
                      alt="Author" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {["Jane Austen", "F. Scott Fitzgerald", "J.K. Rowling", "George Orwell"][idx]}
                  </p>
                </div>
              ))}
              {loading && Array(4).fill(0).map((_, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Featured Collections */}
        <section className="mb-16">
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

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
              © 2025 QuoteVault. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a 
                href="#" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                About
              </a>
              <a 
                href="#" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Privacy
              </a>
              <a 
                href="#" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}