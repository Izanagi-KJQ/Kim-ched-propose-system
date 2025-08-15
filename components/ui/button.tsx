"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        action:
          "bg-white text-black border-2 border-black hover:bg-black hover:text-white dark:bg-black dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black transition-colors",
        altAction:
          "bg-black text-white border-2 border-black hover:bg-white hover:text-black dark:bg-white dark:text-black dark:border-white dark:hover:bg-black dark:hover:text-white transition-colors",
        purple:
          [
            // Light mode
            "border-2 border-purple-600 text-purple-700 bg-white",
            "hover:bg-purple-600 hover:text-white hover:border-purple-600",
            // Dark mode (softer, easier on the eyes)
            "dark:bg-purple-900/30 dark:text-purple-200 dark:border-purple-500/40",
            "dark:hover:bg-purple-700/70 dark:hover:text-white dark:hover:border-purple-400",
            // Motion/contrast adjustments
            "shadow-sm hover:shadow-lg dark:shadow-purple-950/20 dark:hover:shadow-purple-950/30",
            // Gentler transitions and focus ring override to purple
            "transition-colors transition-shadow duration-200 focus-visible:ring-purple-500/40 dark:focus-visible:ring-purple-400/40"
          ].join(" ") ,
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
    // Subscribe to theme changes so the component re-renders when theme toggles
    const { resolvedTheme } = useTheme()

    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        // Reference resolvedTheme to ensure re-render on theme change
        data-theme={resolvedTheme}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
