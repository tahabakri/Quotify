import React, { useEffect, useState } from 'react';
import { Quote, PointerIcon as PinterestIcon, Wand2, Sparkles, Sun, Moon } from 'lucide-react';
import { SearchSection } from './components/SearchSection/SearchSection';
import { ResultsGrid } from './components/ResultsSection/ResultsGrid';
import { SearchProvider } from './contexts/SearchContext';

function AppContent() {

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

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
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode ? 'bg-gradient-to-b from-dark-100 to-dark-900' : 'bg-gradient-to-b from-purple-50 to-white'
    }`}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className={`fixed top-4 right-4 p-3 rounded-full transition-all duration-300 ${
          darkMode 
            ? 'bg-dark-200 text-yellow-400 hover:bg-dark-100' 
            : 'bg-white text-gray-800 hover:bg-gray-100'
        } shadow-lg`}
      >
        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 md:py-24 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-pink-100/50 dark:from-purple-900/20 dark:to-pink-900/20 pointer-events-none" />
        
        <div className="text-center relative z-10">
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-purple-900'
          }`}>
            Turn Your Favorite Quotes into
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"> Stunning Art</span>
            <span className="block text-2xl md:text-3xl mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">in Seconds!</span>
          </h1>
          <p className={`text-xl mb-12 max-w-2xl mx-auto transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Find a book, pick or create a quote, and let AI design beautiful, shareable visuals tailored to you. Simple, fast, and free to start!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              Start Creating Free
            </button>
            <button className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 ${
              darkMode
                ? 'bg-dark-200 text-white hover:bg-dark-100'
                : 'bg-white text-purple-900 hover:bg-purple-50'
            } shadow-lg hover:shadow-xl`}>
              Explore Trending Books
            </button>
          </div>
          
          {/* Floating Pop-up Callout */}
          <div className={`inline-block py-2 px-4 rounded-full text-sm font-medium mb-8 transition-all duration-300 ${
            darkMode
              ? 'bg-dark-200 text-gray-300'
              : 'bg-white text-gray-600'
          } shadow-lg`}>
            <Sparkles className="w-4 h-4 inline-block mr-2 text-purple-500" />
            No sign-up required! Start creating immediately
          </div>
        </div>
      </header>

      {/* Search & Filter Section */}
      <SearchSection />

      {/* Results Section */}
      <section className="container mx-auto px-4 py-8">
        <ResultsGrid className="min-h-[400px]" />
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className={`text-3xl font-bold text-center mb-12 transition-colors duration-300 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Wand2 className="w-8 h-8 text-purple-600" />}
            title="AI-Generated Backgrounds"
            description="Create unique visuals that perfectly match your quotes using advanced AI technology."
            darkMode={darkMode}
          />
          <FeatureCard
            icon={<Quote className="w-8 h-8 text-purple-600" />}
            title="Beautiful Typography"
            description="Customize fonts, colors, and layouts to make your quotes stand out."
            darkMode={darkMode}
          />
          <FeatureCard
            icon={<PinterestIcon className="w-8 h-8 text-purple-600" />}
            title="One-Click Sharing"
            description="Post directly to Pinterest and other social platforms with a single click."
            darkMode={darkMode}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 transition-colors duration-300 ${
        darkMode ? 'bg-dark-100' : 'bg-purple-900'
      }`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to Transform Your Social Media?</h2>
          <p className={`mb-8 max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-purple-200'
          }`}>
            Join thousands of content creators who are automating their Pinterest presence with AI-powered quote images.
          </p>
          <button className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 ${
            darkMode 
              ? 'bg-purple-600 text-white hover:bg-purple-700' 
              : 'bg-white text-purple-900 hover:bg-purple-100'
          }`}>
            Start Creating Now
          </button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  darkMode 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  darkMode: boolean;
}) {
  return (
    <div className={`p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
      darkMode ? 'bg-dark-100 hover:bg-dark-200' : 'bg-white hover:bg-gray-50'
    }`}>
      <div className="mb-4">{icon}</div>
      <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>{title}</h3>
      <p className={`transition-colors duration-300 ${
        darkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>{description}</p>
    </div>
  );
}

export default App;