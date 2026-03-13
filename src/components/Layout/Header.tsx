import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../store/ui';

const NavItem = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className="font-body text-foreground/70 hover:text-foreground px-4 py-2 text-sm transition-colors hover:-translate-y-[1px] inline-block"
  >
    {children}
  </Link>
);

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const cycleTheme = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = next === 'dark' || (next === 'system' && prefersDark);
    root.classList.toggle('dark', shouldBeDark);
  };

  const themeIcon = theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '💻';

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl">
      <nav className="bg-white/70 dark:bg-navy/70 backdrop-blur-xl rounded-pill border border-white/20 dark:border-white/5 shadow-lg px-6">
        <div className="h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-0.5 group">
            <span className="font-heading text-xl text-foreground group-hover:text-primary-500 transition-colors">
              Quot
            </span>
            <span className="font-quote text-xl text-primary-500">
              ify
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavItem to="/search">Search</NavItem>
            <NavItem to="/collections">Collections</NavItem>
            <NavItem to="/authors">Authors</NavItem>
            <NavItem to="/settings">Settings</NavItem>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={cycleTheme}
              className="p-2 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
              aria-label={`Theme: ${theme}`}
              title={`Theme: ${theme}`}
            >
              <span className="w-5 h-5 block text-center text-sm">{themeIcon}</span>
            </button>

            <button
              type="button"
              className="md:hidden p-2 text-foreground/70 hover:text-foreground transition-colors"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="w-5 h-5 block text-sm">{menuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border py-3 space-y-1 flex flex-col">
            <NavItem to="/search" onClick={() => setMenuOpen(false)}>Search</NavItem>
            <NavItem to="/collections" onClick={() => setMenuOpen(false)}>Collections</NavItem>
            <NavItem to="/authors" onClick={() => setMenuOpen(false)}>Authors</NavItem>
            <NavItem to="/settings" onClick={() => setMenuOpen(false)}>Settings</NavItem>
          </div>
        )}
      </nav>
    </header>
  );
};
