import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, type MotionProps } from "framer-motion"
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
        true: "glow-effect before:absolute before:inset-0 before:-z-10 before:blur-lg before:opacity-50 before:transition-opacity before:bg-[radial-gradient(circle_at_center,var(--glow-color,rgb(var(--primary))),transparent_70%)] hover:before:opacity-75",
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

type ButtonVariantProps = VariantProps<typeof buttonVariants>

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonVariantProps>,
    ButtonVariantProps {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const MotionButton = motion.button

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
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const [isPressed, setIsPressed] = React.useState(false)
    
    const content = (
      <>
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
      </>
    )

    const buttonProps = {
      ref,
      className: cn(
        buttonVariants({ variant, size, glow, rounded, className }),
        isLoading && "cursor-progress"
      ),
      disabled: props.disabled || isLoading,
      onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsHovered(true)
        onMouseEnter?.(e)
      },
      onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsHovered(false)
        setIsPressed(false)
        onMouseLeave?.(e)
      },
      onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsPressed(true)
        onMouseDown?.(e)
      },
      onMouseUp: (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsPressed(false)
        onMouseUp?.(e)
      },
      ...props,
    }

    if (asChild) {
      return <Slot {...buttonProps}>{content}</Slot>
    }

    const scale = props.disabled ? 1 : isPressed ? 0.98 : isHovered ? 1.02 : 1

    return (
      <MotionButton
        {...buttonProps}
        animate={{ scale }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </MotionButton>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }