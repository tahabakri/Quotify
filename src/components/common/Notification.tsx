import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
  onDismiss: (id: string) => void;
}

export const Notification = ({
  id,
  type,
  message,
  duration = 5000,
  onDismiss,
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        const exitTimer = setTimeout(() => onDismiss(id), 300);
        return () => clearTimeout(exitTimer);
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [duration, id, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(id), 300);
  };

  const icons: Record<string, string> = {
    success: '\u2714',
    error: '\u2716',
    info: '\u2139',
    warning: '\u26A0',
  };

  const typeStyles = {
    success: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30",
    error: "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30",
    info: "bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/30",
    warning: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30"
  };

  const iconColors: Record<string, string> = {
    success: 'text-emerald-500',
    error: 'text-rose-500',
    info: 'text-sky-500',
    warning: 'text-amber-500',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={cn(
            "flex items-center gap-3 p-4",
            "rounded-card border",
            "backdrop-blur-sm",
            "relative max-w-md w-full",
            "shadow-sm",
            typeStyles[type]
          )}
        >
          <span className={cn("text-lg", iconColors[type])} aria-hidden="true">
            {icons[type]}
          </span>
          <p className="font-body text-sm text-foreground flex-1">{message}</p>
          <button
            type="button"
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss notification"
          >
            <span className="text-lg">{'\u2716'}</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
