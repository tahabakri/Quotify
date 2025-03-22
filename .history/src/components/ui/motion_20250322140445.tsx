import { HTMLMotionProps, motion } from "framer-motion"
import { forwardRef } from "react"
import { Button } from "./button"

type MotionButtonProps = HTMLMotionProps<"button"> & React.ComponentProps<typeof Button>

export const MotionButton = motion(Button)

export const AnimatedButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <MotionButton
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17
        }}
        {...props}
      >
        {children}
      </MotionButton>
    )
  }
)

AnimatedButton.displayName = "AnimatedButton"