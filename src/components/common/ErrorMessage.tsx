import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ErrorMessageProps {
  message: string;
  className?: string;
  variant?: 'inline' | 'block';
}

export function ErrorMessage({
  message,
  className = '',
  variant = 'block'
}: ErrorMessageProps) {
  if (variant === 'inline') {
    return (
      <span
        role="alert"
        className={cn("inline-flex items-center text-sm text-red-600 dark:text-red-400", className)}
      >
        <span className="mr-1" aria-hidden="true">⚠</span>
        {message}
      </span>
    );
  }

  return (
    <motion.div
      role="alert"
      className={cn(
        "rounded-card bg-red-50 dark:bg-red-900/20",
        "border border-red-200 dark:border-red-800",
        "p-6",
        className
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <div className="flex items-center">
        <span className="h-5 w-5 text-red-500 mr-3" aria-hidden="true">⚠</span>
        <span className="font-body text-red-700 dark:text-red-300">{message}</span>
      </div>
    </motion.div>
  );
}
