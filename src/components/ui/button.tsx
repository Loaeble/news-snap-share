import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:scale-105 hover:shadow-elegant active:scale-95 transition-all duration-200",
        destructive:
          "bg-destructive text-destructive-foreground hover:scale-105 hover:shadow-md active:scale-95 transition-all duration-200",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:scale-105 hover:shadow-card active:scale-95 transition-all duration-200",
        secondary:
          "bg-gradient-accent text-secondary-foreground hover:scale-105 hover:shadow-card active:scale-95 transition-all duration-200",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95 transition-all duration-200",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-gradient-success text-success-foreground hover:scale-105 hover:shadow-glow active:scale-95 transition-all duration-200 animate-pulse-glow",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-md px-4 py-2",
        lg: "h-14 rounded-lg px-8 py-4 text-base",
        icon: "h-12 w-12",
        xs: "h-8 rounded px-2 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
