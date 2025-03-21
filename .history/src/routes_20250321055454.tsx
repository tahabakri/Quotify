import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { QuoteDetailPage } from './pages/QuoteDetailPage';

// Import placeholder components for routes we'll implement later
const AuthorPage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold mb-4">Author Page (Coming Soon)</h1>
  </div>
);

const CollectionsPage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold mb-4">Collections Page (Coming Soon)</h1>
  </div>
);

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
    path: '*',
    element: <Layout><NotFoundPage /></Layout>,
  },
]);