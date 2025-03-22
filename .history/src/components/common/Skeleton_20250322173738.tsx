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
  const baseClasses = cn(
    "relative overflow-hidden",
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200",
    "dark:from-gray-700 dark:via-gray-600 dark:to-gray-700",
    "backdrop-blur-sm"
  );

  const variantClasses = {
    text: 'rounded-md',
    rectangular: 'rounded-xl',
    circular: 'rounded-full'
  };

  const style = {
    height: height ?? (variant === 'text' ? '1em' : undefined),
    width: width,
    background: animation === 'none' ? undefined : `
      linear-gradient(
        90deg,
        var(--tw-gradient-from) 0%,
        var(--tw-gradient-via) 50%,
        var(--tw-gradient-to) 100%
      )
    `,
    backgroundSize: '200% 100%'
  };

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
        baseClasses,
        variantClasses[variant],
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        className
      )}
      style={{
        ...style,
        boxShadow: `
          0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -2px rgba(0, 0, 0, 0.1),
          inset 0 0 0 1px rgba(255, 255, 255, 0.05)
        `
      }}
      animate={animations[animation]}
      role="presentation"
      aria-hidden="true"
      data-testid="skeleton"
    >
      {/* Glass effect overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent dark:from-white/5"
        style={{ opacity: 0.5 }}
      />
      
      {/* Shimmer effect */}
      {animation === 'shimmer' && (
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                90deg,
                transparent 0%,
                rgba(255, 255, 255, 0.1) 50%,
                transparent 100%
              )
            `,
            transform: 'translateX(-100%)'
          }}
        />
      )}
    </motion.div>
  );
}