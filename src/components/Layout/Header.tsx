import { Link } from 'react-router-dom';

const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-4 py-2 text-sm font-medium transition-colors"
  >
    {children}
  </Link>
);

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              QuoteVault
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-4">
            <NavItem to="/search">Search</NavItem>
            <NavItem to="/collections">Collections</NavItem>
            <NavItem to="/authors">Authors</NavItem>
            <NavItem to="/about">About</NavItem>
          </div>

          {/* Mobile Menu Button - Just a placeholder for now */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-5">☰</div>
          </button>

          {/* Placeholder for ThemeToggle - Will be integrated once dependencies are installed */}
          <div className="hidden md:block">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              <div className="w-5 h-5 text-gray-600 dark:text-gray-300">🌓</div>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};