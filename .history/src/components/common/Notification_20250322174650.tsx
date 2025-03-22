import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  InformationCircleIcon, 
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
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

  const icons = {
    success: <CheckCircleIcon className="h-5 w-5 text-emerald-500" aria-hidden="true" />,
    error: <XCircleIcon className="h-5 w-5 text-rose-500" aria-hidden="true" />,
    info: <InformationCircleIcon className="h-5 w-5 text-sky-500" aria-hidden="true" />,
    warning: <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" aria-hidden="true" />,
  };

  const typeStyles = {
    success: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 before:bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15),transparent_70%)]",
    error: "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 before:bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.15),transparent_70%)]",
    info: "bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/30 before:bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.15),transparent_70%)]",
    warning: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 before:bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15),transparent_70%)]"
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 25 
          }}
          className={cn(
            "flex items-center gap-3 p-4",
            "rounded-lg border",
            "backdrop-blur-sm",
            "relative max-w-md w-full",
            "shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1),0_5px_15px_-3px_rgba(0,0,0,0.05)] shadow-gray-950/5",
            "before:absolute before:inset-0 before:rounded-lg before:opacity-40 before:blur-xl before:-z-10",
            typeStyles[type]
          )}
        >
          {icons[type]}
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 flex-1">{message}</p>
          <button
            onClick={handleDismiss}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Dismiss notification"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};