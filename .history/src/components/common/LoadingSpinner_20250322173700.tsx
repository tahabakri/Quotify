import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  label?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'medium', 
  label = 'Loading...', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-4 w-4 border',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-2'
  };

  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 1
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className="relative" role="status" aria-label={label}>
        {/* Outer spinner with gradient */}
        <motion.div
          className={cn(
            sizeClasses[size],
            "absolute rounded-full",
            "bg-gradient-to-r from-blue-500 to-purple-500"
          )}
          animate={{ rotate: 360 }}
          transition={spinTransition}
          style={{
            filter: "blur(4px)",
            opacity: 0.2
          }}
        />

        {/* Main spinner */}
        <motion.div
          className={cn(
            sizeClasses[size],
            "rounded-full",
            "border-current border-r-transparent",
            "bg-white/10 dark:bg-gray-800/10",
            "backdrop-blur-sm",
            "relative",
            "text-gray-900 dark:text-white"
          )}
          animate={{ rotate: 360 }}
          transition={spinTransition}
          style={{
            boxShadow: `
              0 0 10px rgba(59, 130, 246, 0.1),
              0 0 20px rgba(147, 51, 234, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1)
            `
          }}
        />

        {/* Inner spinner (smaller) */}
        <motion.div
          className={cn(
            "absolute inset-0",
            "border-2 border-current border-l-transparent border-b-transparent",
            "rounded-full",
            "m-[2px]"
          )}
          animate={{ rotate: -360 }}
          transition={{
            ...spinTransition,
            duration: 1.5
          }}
        />

        <span className="sr-only">{label}</span>
      </div>
      
      {/* Loading text with fade animation */}
      <motion.p
        className="text-sm text-gray-600 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }}
      >
        {label}
      </motion.p>
    </div>
  );
}