export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  height?: number | string;
  width?: number | string;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({ 
  className = '',
  variant = 'rectangular',
  height,
  width,
  animation = 'pulse'
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
    none: ''
  };

  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full'
  };

  const style = {
    height: height ?? (variant === 'text' ? '1em' : undefined),
    width: width
  };

  return (
    <div 
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${animationClasses[animation]}
        ${className}
      `}
      style={style}
      role="presentation"
      aria-hidden="true"
      data-testid="skeleton"
    />
  );
}