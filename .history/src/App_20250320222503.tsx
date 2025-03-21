import { UserContextProvider } from './contexts/UserContext.tsx';
import { NotificationProvider } from './contexts/NotificationContext';
import { ImageGenerationProvider } from './contexts/ImageGenerationContext';
import { ResultsSection } from './components/ResultsSection/ResultsSection';
import { SearchSection } from './components/SearchSection/SearchSection';
import { useSearch } from './contexts/useSearch';

function AppContent() {
  const { results, loading, hasMore, loadMore, searchType } = useSearch();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quote Explorer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search and discover inspiring quotes from your favorite books
          </p>
        </header>

        <div className="space-y-8">
          <SearchSection />
          
          <ResultsSection
            results={results}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            type={searchType}
          />
        </div>
      </div>
    </main>
  );
}

function App() {
  return (
    <UserContextProvider>
      <NotificationProvider>
        <ImageGenerationProvider>
          <AppContent />
        </ImageGenerationProvider>
      </NotificationProvider>
    </UserContextProvider>
  );
}

export default App;