import { type HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover" | "pulse"
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const baseClasses = "neon-card p-6"

    const variants = {
      default: "",
      hover: "hover:shadow-neon-mixed hover:border-neon-cyan/50",
      pulse: "neon-pulse",
    }

    return (
      <div className={cn(baseClasses, variants[variant], className)} ref={ref} {...props}>
        {children}
      </div>
    )
  },
)

GlassCard.displayName = "GlassCard"

export { GlassCard }
