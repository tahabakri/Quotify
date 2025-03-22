import { FiHeart, FiShare2, FiBookmark } from 'react-icons/fi';
import { motion } from 'framer-motion';
import type { Quote } from '../../types';
import { QuoteCardStyleProps } from './index';
import { cn } from '../../lib/utils';

export interface QuoteCardProps extends QuoteCardStyleProps {
  quote: Quote;
  onLike?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  liked?: boolean;
  saved?: boolean;
}

export function QuoteCard({
  quote,
  className = '',
  variant = 'default',
  interactive = true,
  theme = {},
  onLike,
  onShare,
  onSave,
  liked = false,
  saved = false
}: QuoteCardProps) {
  const variantClasses = {
    default: 'p-6 space-y-4',
    compact: 'p-4 space-y-3',
    featured: 'p-8 space-y-6'
  };

  const buttonBaseClasses = 
    "p-2 rounded-full transition-all duration-200 transform-gpu";
  
  const buttonClasses = interactive
    ? cn(
        buttonBaseClasses,
        "hover:scale-110 active:scale-95",
        "hover:shadow-lg hover:bg-white dark:hover:bg-gray-700"
      )
    : cn(buttonBaseClasses, "cursor-default");

  // Convert theme colors to CSS variables
  const style = theme.backgroundColor || theme.textColor ? {
    '--card-bg': theme.backgroundColor || 'transparent',
    '--card-text': theme.textColor || 'currentColor',
    '--accent-color': theme.accentColor || 'currentColor'
  } as React.CSSProperties : undefined;

  return (
    <motion.div 
      className={cn(
        "relative overflow-hidden backdrop-blur-sm",
        "bg-[var(--card-bg,transparent)] text-[var(--card-text,currentColor)]",
        "rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50",
        "transform-gpu transition-all duration-200",
        "shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(255,255,255,0.1)]",
        interactive && "hover:scale-[1.02] hover:shadow-xl",
        variantClasses[variant],
        className
      )}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      {/* Glass overlay */}
      <div className={cn(
        "absolute inset-0 rounded-2xl opacity-50 z-0",
        "bg-gradient-to-br from-white/20 to-white/5"
      )} />
      
      <div className="relative z-10">
        {/* Quote content */}
        <motion.blockquote
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className={cn(
            "font-medium leading-relaxed",
            variant === 'featured' ? 'text-xl' : 'text-lg'
          )}>
            "{quote.content}"
          </p>
        </motion.blockquote>

        {/* Author and metadata */}
        <motion.div 
          className="flex items-center justify-between mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              {quote.author.imageUrl ? (
                <img 
                  src={quote.author.imageUrl} 
                  alt={quote.author.name}
                  className={cn(
                    "rounded-full object-cover ring-2 ring-offset-2",
                    "ring-gray-200 dark:ring-gray-700",
                    variant === 'compact' ? 'w-8 h-8' : 'w-10 h-10'
                  )}
                />
              ) : (
                <div className={cn(
                  "rounded-full bg-gray-200 dark:bg-gray-700",
                  variant === 'compact' ? 'w-8 h-8' : 'w-10 h-10'
                )} />
              )}
            </motion.div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {quote.author.name}
              </p>
              {quote.book && variant !== 'compact' && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {quote.book.title}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            <motion.button
              onClick={interactive ? onLike : undefined}
              className={cn(
                buttonClasses,
                liked && "bg-red-50 dark:bg-red-900/20"
              )}
              whileHover={{ scale: interactive ? 1.1 : 1 }}
              whileTap={{ scale: interactive ? 0.95 : 1 }}
              aria-label={liked ? "Unlike quote" : "Like quote"}
              disabled={!interactive}
            >
              <FiHeart 
                className={cn(
                  "w-5 h-5",
                  liked ? "fill-current text-[var(--accent-color,#ef4444)] text-red-500" : "text-gray-500"
                )}
              />
            </motion.button>
            <motion.button
              onClick={interactive ? onShare : undefined}
              className={buttonClasses}
              whileHover={{ scale: interactive ? 1.1 : 1 }}
              whileTap={{ scale: interactive ? 0.95 : 1 }}
              aria-label="Share quote"
              disabled={!interactive}
            >
              <FiShare2 className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={interactive ? onSave : undefined}
              className={cn(
                buttonClasses,
                saved && "bg-blue-50 dark:bg-blue-900/20"
              )}
              whileHover={{ scale: interactive ? 1.1 : 1 }}
              whileTap={{ scale: interactive ? 0.95 : 1 }}
              aria-label={saved ? "Remove from saved" : "Save quote"}
              disabled={!interactive}
            >
              <FiBookmark 
                className={cn(
                  "w-5 h-5",
                  saved ? "fill-current text-[var(--accent-color,#3b82f6)] text-blue-500" : "text-gray-500"
                )}
              />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}