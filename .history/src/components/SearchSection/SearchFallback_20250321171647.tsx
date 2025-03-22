import { useEffect, useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { TrendingQuote } from '../../types/quote';
import { ErrorMessage } from '../common/ErrorMessage';

interface SearchFallbackProps {
  className?: string;
}

export function SearchFallback({ className = '' }: SearchFallbackProps) {
  const [cachedQuotes] = useLocalStorage<TrendingQuote[]>('cached_trending_quotes', []);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline && cachedQuotes.length === 0) {
    return (
      <ErrorMessage
        message="You're offline"
        variant="block"
        className={className}
      />
    );
  }

  if (!isOnline) {
    return (
      <ErrorMessage
        message="You're viewing cached content while offline"
        variant="inline"
        className={`${className} mb-4`}
      />
    );
  }

  return null;
}