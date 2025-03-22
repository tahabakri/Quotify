import { useEffect, useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { TrendingQuote } from '../../types/quote';
import { ErrorMessage } from '../common/ErrorMessage';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FiWifi, FiWifiOff } from 'react-icons/fi';

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

  return (
    <AnimatePresence mode="wait">
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn("relative", className)}
        >
          {cachedQuotes.length === 0 ? (
            <motion.div
              layout
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <ErrorMessage
                message="You're offline"
                variant="block"
              />
            </motion.div>
          ) : (
            <div className="relative">
              <ErrorMessage
                message="You're viewing cached content while offline"
                variant="inline"
                className="mb-4"
              />
              <motion.div
                className="absolute right-2 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FiWifiOff className="h-4 w-4 text-red-500" />
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
      {isOnline && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          <FiWifi className="h-4 w-4 text-green-500" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}