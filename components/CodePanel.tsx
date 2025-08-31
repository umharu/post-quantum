import { type HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"
import { GlassCard } from "./GlassCard"

interface CodePanelProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  code: string
  language?: string
}

const CodePanel = forwardRef<HTMLDivElement, CodePanelProps>(
  ({ className, title, code, language = "javascript", ...props }, ref) => {
    return (
      <GlassCard className={cn("space-y-4", className)} ref={ref} {...props}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neon-text-primary">{title}</h3>
          {language && (
            <span className="px-2 py-1 text-xs font-mono bg-neon-gradient text-white rounded">{language}</span>
          )}
        </div>
        <div className="frame-soft">
          <pre className="p-4 overflow-x-auto text-sm font-mono text-neon-text-primary bg-neon-bg-primary/50 rounded-lg">
            <code>{code}</code>
          </pre>
        </div>
      </GlassCard>
    )
  },
)

CodePanel.displayName = "CodePanel"

export { CodePanel }
