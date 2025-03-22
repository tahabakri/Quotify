import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface LayoutAnimationProps {
  children: ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className }: LayoutAnimationProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const FadeInOut = ({ children, className }: LayoutAnimationProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const AnimateList = ({ children, className }: LayoutAnimationProps) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={{
      animate: {
        transition: {
          staggerChildren: 0.1
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const AnimateScale = ({ children, className }: LayoutAnimationProps) => (
  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.95, opacity: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const WithLayoutAnimation = ({ children }: { children: ReactNode }) => (
  <AnimatePresence mode="wait">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      {children}
    </motion.div>
  </AnimatePresence>
);