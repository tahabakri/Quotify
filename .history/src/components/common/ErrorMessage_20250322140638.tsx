import { FiAlertCircle } from 'react-icons/fi';
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
  const fadeInVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 }
  };

  if (variant === 'inline') {
    return (
      <motion.span
        role="alert"
        className={cn(
          "inline-flex items-center text-sm text-red-600 dark:text-red-400",
          className
        )}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeInVariants}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <FiAlertCircle className="mr-1" aria-hidden="true" />
        </motion.div>
        {message}
      </motion.span>
    );
  }

  return (
    <motion.div
      role="alert"
      className={cn(
        "rounded-lg bg-red-50 dark:bg-red-900/20",
        "border border-red-200 dark:border-red-800",
        "p-4",
        className
      )}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeInVariants}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      layout
    >
      <motion.div
        className="flex items-center"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <FiAlertCircle
            className="h-5 w-5 text-red-600 dark:text-red-400 mr-2"
            aria-hidden="true"
          />
        </motion.div>
        <motion.span
          className="text-red-800 dark:text-red-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}