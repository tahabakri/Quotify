import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        gradient: "text-white bg-gradient-to-r from-primary via-primary/80 to-primary-foreground hover:brightness-110",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md text-sm",
        lg: "h-11 px-8 rounded-md text-base",
        icon: "h-10 w-10",
      },
      glow: {
        true: "glow-effect",
        false: "",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: false,
      rounded: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  glow?: boolean
  rounded?: "default" | "full" | "none"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    glow,
    rounded,
    asChild = false,
    isLoading,
    loadingText,
    leftIcon,
    rightIcon,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : motion.button

    // Framer Motion animation variants
    const buttonAnimations = {
      tap: { scale: 0.98 },
      hover: { 
        scale: 1.02,
        transition: { duration: 0.2 }
      }
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, glow, rounded, className }),
          isLoading && "cursor-progress"
        )}
        ref={ref}
        disabled={props.disabled || isLoading}
        whileTap="tap"
        whileHover="hover"
        variants={buttonAnimations}
        {...props}
      >
        {/* Glow effect container */}
        {glow && (
          <div 
            className="absolute inset-0 -z-10 blur-lg opacity-50 transition-opacity group-hover:opacity-75"
            style={{
              background: 'radial-gradient(circle at center, var(--glow-color, rgb(var(--primary))), transparent 70%)'
            }}
          />
        )}

        {/* Loading spinner */}
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}

        {/* Left icon */}
        {!isLoading && leftIcon && (
          <span className="mr-2 flex items-center">{leftIcon}</span>
        )}

        {/* Button content */}
        <span>
          {isLoading && loadingText ? loadingText : children}
        </span>

        {/* Right icon */}
        {!isLoading && rightIcon && (
          <span className="ml-2 flex items-center">{rightIcon}</span>
        )}

        {/* Ripple effect */}
        <span className="ripple-container" />
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }