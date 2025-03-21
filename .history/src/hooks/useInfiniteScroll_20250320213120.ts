import { useEffect, useRef, useState } from 'react';

interface InfiniteScrollOptions {
  threshold?: number;
  enabled?: boolean;
}

interface InfiniteScrollResult {
  ref: (node: HTMLElement | null) => void;
  isIntersecting: boolean;
}

export function useInfiniteScroll(
  callback: () => void,
  options: InfiniteScrollOptions = {}
): InfiniteScrollResult {
  const { threshold = 0.8, enabled = true } = options;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const setRef = (node: HTMLElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node && enabled) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsIntersecting(entry.isIntersecting);
          if (entry.isIntersecting) {
            callback();
          }
        },
        { threshold }
      );

      observer.observe(node);
      observerRef.current = observer;
    }
  };

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    ref: setRef,
    isIntersecting
  };
}

export default useInfiniteScroll;