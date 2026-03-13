import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import LandingPage from './pages/LandingPage';
import SearchResultsPage from './pages/SearchResultsPage';
import QuoteDetailPage from './pages/QuoteDetailPage';
import AuthorDetailPage from './pages/AuthorDetailPage';
import AuthorsIndexPage from './pages/AuthorsIndexPage';
import CollectionsPage from './pages/CollectionsPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import SettingsPage from './pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'search',
        element: <SearchResultsPage />,
      },
      {
        path: 'quotes/:id',
        element: <QuoteDetailPage />,
      },
      {
        path: 'authors',
        children: [
          {
            index: true,
            element: <AuthorsIndexPage />,
          },
          {
            path: ':id',
            element: <AuthorDetailPage />,
          },
        ],
      },
      {
        path: 'collections',
        children: [
          {
            index: true,
            element: <CollectionsPage />,
          },
          {
            path: ':id',
            element: <CollectionDetailPage />,
          },
        ],
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: (
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                404: Page Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                The page you&apos;re looking for doesn&apos;t exist.
              </p>
            </div>
          </div>
        ),
      },
    ],
  },
]);
