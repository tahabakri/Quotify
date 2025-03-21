import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';

// Import placeholder components for routes we'll implement later
const SearchResults = () => <div>Search Results Page (Coming Soon)</div>;
const QuoteDetail = () => <div>Quote Detail Page (Coming Soon)</div>;
const AuthorPage = () => <div>Author Page (Coming Soon)</div>;
const CollectionsPage = () => <div>Collections Page (Coming Soon)</div>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/search',
    element: <SearchResults />,
  },
  {
    path: '/quote/:id',
    element: <QuoteDetail />,
  },
  {
    path: '/author/:id',
    element: <AuthorPage />,
  },
  {
    path: '/collections',
    element: <CollectionsPage />,
  },
]);