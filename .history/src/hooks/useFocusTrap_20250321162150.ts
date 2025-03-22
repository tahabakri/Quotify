import { useEffect, RefObject } from 'react';

export function useFocusTrap(ref: RefObject<HTMLElement>, isActive: boolean = true) {
  useEffect(() => {
    if (!isActive) return;

    const element = ref.current;
    if (!element) return;

    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableContent = element.querySelectorAll(focusableElements);
    
    const firstFocusable = focusableContent[0] as HTMLElement;
    const lastFocusable = focusableContent[focusableContent.length - 1] as HTMLElement;

    function handleFocus(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    }

    element.addEventListener('keydown', handleFocus);

    // Focus first element when trap is activated
    firstFocusable?.focus();

    return () => {
      element.removeEventListener('keydown', handleFocus);
    };
  }, [ref, isActive]);
}