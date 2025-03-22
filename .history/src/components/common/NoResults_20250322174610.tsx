import { FiSearch, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface NoResultsProps {
  message?: string;
  suggestion?: string;
  type?: 'search' | 'error' | 'empty';
  className?: string;
}

export function NoResults({
  message = 'No results found',
  suggestion = 'Try adjusting your search criteria',
  type = 'search',
  className = ''
}: NoResultsProps) {
  const icons = {
    search: FiSearch,
    error: FiAlertCircle,
    empty: FiAlertCircle
  };

  const Icon = icons[type];

  const iconColors = {
    search: 'text-sky-500 dark:text-sky-400',
    error: 'text-rose-500 dark:text-rose-400',
    empty: 'text-amber-500 dark:text-amber-400'
  };

  return (
    <motion.div 
      className={cn(
        "relative overflow-hidden",
        "rounded-2xl border border-gray-200/50 dark:border-gray-700/50",
        "backdrop-blur-sm bg-white/90 dark:bg-gray-800/90",
        "flex flex-col items-center justify-center p-8 text-center",
        "transform-gpu transition-all duration-200",
        "shadow-[0_8px_32px_rgba(0,0,0,0.1)] shadow-gray-900/5",
        "before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      role="status"
      aria-live="polite"
    >
      {/* Glass overlay */}
      <div 
        className={cn(
          "absolute inset-0 rounded-2xl opacity-50 z-0",
          "bg-gradient-to-br from-white/20 to-white/5"
        )}
      />

      <div className="relative z-10">
        <motion.div 
          className="mb-4"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            delay: 0.1
          }}
        >
          <div className={cn(
            "p-4 rounded-full",
            "bg-gray-100/80 dark:bg-gray-700/80",
            "ring-2 ring-offset-2 ring-gray-200/50 dark:ring-gray-700/50"
          )}>
            <Icon 
              className={cn(
                "w-12 h-12",
                iconColors[type]
              )}
              aria-hidden="true"
            />
          </div>
        </motion.div>
        
        <motion.h3 
          className="text-lg font-medium text-gray-900 dark:text-white mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.h3>
        
        {suggestion && (
          <motion.p 
            className="text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {suggestion}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}