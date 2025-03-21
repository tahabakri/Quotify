import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { LandingPage } from './pages/LandingPage';

// Import placeholder components for routes we'll implement later
const SearchResults = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold mb-4">Search Results Page (Coming Soon)</h1>
  </div>
);

const QuoteDetail = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold mb-4">Quote Detail Page (Coming Soon)</h1>
  </div>
);

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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><LandingPage /></Layout>,
  },
  {
    path: '/search',
    element: <Layout><SearchResults /></Layout>,
  },
  {
    path: '/quote/:id',
    element: <Layout><QuoteDetail /></Layout>,
  },
  {
    path: '/author/:id',
    element: <Layout><AuthorPage /></Layout>,
  },
  {
    path: '/collections',
    element: <Layout><CollectionsPage /></Layout>,
  },
]);