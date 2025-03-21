import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { QuoteDetailPage } from './pages/QuoteDetailPage';
import { AuthorPage } from './pages/AuthorPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { UserPreferencesPage } from './pages/UserPreferencesPage';

const NotFoundPage = () => (
  <div className="container mx-auto px-4 py-8 text-center">
    <h1 className="text-4xl font-bold mb-4">404: Page Not Found</h1>
    <p className="text-gray-600 dark:text-gray-400">
      The page you're looking for doesn't exist or has been moved.
    </p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><LandingPage /></Layout>,
  },
  {
    path: '/search',
    element: <Layout><SearchResultsPage /></Layout>,
  },
  {
    path: '/quote/:id',
    element: <Layout><QuoteDetailPage /></Layout>,
  },
  {
    path: '/author/:id',
    element: <Layout><AuthorPage /></Layout>,
  },
  {
    path: '/collections',
    element: <Layout><CollectionsPage /></Layout>,
  },
  {
    path: '/preferences',
    element: <Layout><UserPreferencesPage /></Layout>,
  },
  {
    path: '*',
    element: <Layout><NotFoundPage /></Layout>,
  },
]);