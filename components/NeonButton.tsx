import { type ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
}

const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseClasses =
      "btn-neon font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:ring-opacity-50"

    const variants = {
      primary: "btn-neon",
      secondary:
        "bg-neon-bg-surface text-neon-text-primary border border-neon-purple/30 hover:border-neon-purple/50 hover:shadow-neon-purple",
      outline:
        "bg-transparent text-neon-cyan border border-neon-cyan hover:bg-neon-cyan hover:text-white hover:shadow-neon-cyan",
    }

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    }

    return (
      <button className={cn(baseClasses, variants[variant], sizes[size], className)} ref={ref} {...props}>
        {children}
      </button>
    )
  },
)

NeonButton.displayName = "NeonButton"

export { NeonButton }
