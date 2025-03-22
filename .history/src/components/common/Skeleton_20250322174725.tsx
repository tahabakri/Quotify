import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  height?: number | string;
  width?: number | string;
  animation?: 'pulse' | 'wave' | 'shimmer' | 'none';
}

export function Skeleton({ 
  className = '',
  variant = 'rectangular',
  height,
  width,
  animation = 'shimmer'
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded-md',
    rectangular: 'rounded-xl',
    circular: 'rounded-full'
  };

  const heightClass = variant === 'text' ? 'h-[1em]' : height ? `h-[${height}${typeof height === 'number' ? 'px' : ''}]` : '';
  const widthClass = width ? `w-[${width}${typeof width === 'number' ? 'px' : ''}]` : '';

  const animations = {
    pulse: {
      opacity: [0.5, 0.8, 0.5],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut"
      }
    },
    wave: {
      x: ['0%', '100%', '0%'],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut"
      }
    },
    shimmer: {
      backgroundPosition: ['200% 0', '0% 0', '200% 0'],
      transition: {
        repeat: Infinity,
        duration: 2.5,
        ease: "easeInOut"
      }
    },
    none: {}
  };

  return (
    <motion.div 
      className={cn(
        "relative overflow-hidden backdrop-blur-sm",
        animation !== 'none' && "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700",
        "bg-[length:200%_100%]",
        variantClasses[variant],
        "shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        heightClass,
        widthClass,
        className
      )}
      animate={animations[animation]}
      role="presentation"
      aria-hidden="true"
      data-testid="skeleton"
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent dark:from-white/5 opacity-50" />
      
      {/* Shimmer effect */}
      {animation === 'shimmer' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full" />
      )}
    </motion.div>
  );
}