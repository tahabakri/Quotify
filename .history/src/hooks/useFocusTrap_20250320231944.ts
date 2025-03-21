import { useEffect, useRef, useCallback } from 'react';

export function useFocusTrap(active = true) {
  const elementRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  
  const handleFocus = useCallback((event: KeyboardEvent) => {
    if (!elementRef.current || !active) return;

    const focusableElements = elementRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // If no focusable elements exist, focus the container itself
    if (!firstFocusable) {
      elementRef.current.focus();
      event.preventDefault();
      return;
    }

    const isTabPressed = event.key === 'Tab';
    if (!isTabPressed) return;

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        event.preventDefault();
      }
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;

    // Store the current active element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the first focusable element in the trap
    if (elementRef.current) {
      const focusableElements = elementRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length) {
        focusableElements[0].focus();
      } else {
        elementRef.current.focus();
      }
    }

    // Add event listener
    document.addEventListener('keydown', handleFocus);

    return () => {
      document.removeEventListener('keydown', handleFocus);
      // Restore focus when unmounting
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [active, handleFocus]);

  return elementRef;
}