import { RouteObject } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CollectionsPage from './pages/CollectionsPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage />,
    index: true
  },
  {
    path: '/collections',
    element: <CollectionsPage />
  },
  {
    path: '/collections/:id',
    // TODO: Create and import CollectionDetailPage
    element: <div>Collection Detail Page (Coming Soon)</div>
  },
  {
    path: '/authors',
    // TODO: Create and import AuthorsPage
    element: <div>Authors Page (Coming Soon)</div>
  },
  {
    path: '/authors/:id',
    // TODO: Create and import AuthorDetailPage
    element: <div>Author Detail Page (Coming Soon)</div>
  },
  {
    path: '/search',
    // TODO: Create and import SearchResultsPage
    element: <div>Search Results Page (Coming Soon)</div>
  },
  {
    path: '*',
    element: (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            404: Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The page you're looking for doesn't exist.
          </p>
        </div>
      </div>
    )
  }
];