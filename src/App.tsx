import React, { useEffect, useState } from 'react';
import { ImageIcon, Quote, PointerIcon as PinterestIcon, Wand2, Calendar, Sparkles, Sun, Moon } from 'lucide-react';

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
      <header className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-purple-900'
          }`}>
            Transform Quotes into
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"> AI-Powered Art</span>
          </h1>
          <p className={`text-xl mb-8 max-w-2xl mx-auto transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Automatically generate beautiful AI images with quotes and share them directly to Pinterest. Perfect for content creators and social media managers.
          </p>
          <button className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            Get Started Free
          </button>
        </div>
      </header>

      {/* Feature Preview */}
      <section className="container mx-auto px-4 py-16">
        <div className={`rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300 ${
          darkMode ? 'bg-dark-100' : 'bg-white'
        }`}>
          <div className="aspect-video relative">
            <img
              src="https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=1200&q=80"
              alt="Workspace with quote"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-center">
              <p className="text-white text-3xl font-serif max-w-lg text-center px-4">
                "The future belongs to those who believe in the beauty of their dreams."
              </p>
            </div>
          </div>
        </div>
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