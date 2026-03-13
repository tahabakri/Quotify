import { Variants } from "framer-motion"

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

export const scaleUp: Variants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 }
}

export const slideInFromLeft: Variants = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 }
}

export const slideInFromRight: Variants = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 }
}

export const buttonHover: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.03 },
  tap: { scale: 0.97 }
}

// Scroll-triggered animations
export const scrollFadeUp: Variants = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
}

export const scrollFadeLeft: Variants = {
  initial: { opacity: 0, x: -30 },
  whileInView: { opacity: 1, x: 0 },
}

export const scrollFadeRight: Variants = {
  initial: { opacity: 0, x: 30 },
  whileInView: { opacity: 1, x: 0 },
}

export const cardHover: Variants = {
  initial: { y: 0 },
  hover: { y: -4, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export const magneticButton: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
  tap: { scale: 0.97 },
}

export const staggerContainer: Variants = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const viewportConfig = {
  once: true,
  margin: "-100px" as const,
  amount: 0.2 as const,
}

export const premiumTransition = {
  type: "tween" as const,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
  duration: 0.6,
}

export const transitions = {
  spring: {
    type: "spring",
    stiffness: 200,
    damping: 20
  },
  smooth: {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3
  },
  premium: premiumTransition,
}
