import { useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  loading?: boolean;
}

export function useInfiniteScroll({ threshold = 100, loading = false }: UseInfiniteScrollOptions = {}) {
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentTarget = targetRef.current;

    if (!currentTarget || loading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore) {
          // Signal that we need to load more items
          setHasMore(false);
        }
      },
      {
        rootMargin: `${threshold}px`,
      }
    );

    observerRef.current.observe(currentTarget);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, loading, hasMore]);

  const resetHasMore = () => {
    setHasMore(true);
  };

  return {
    targetRef,
    hasMore,
    resetHasMore,
  };
}