"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/GlassCard"
import { NeonButton } from "@/components/NeonButton"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function AnalyzingPage() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("Initializing analysis...")

  const steps = [
    "Initializing analysis...",
    "Parsing code structure...",
    "Identifying cryptographic functions...",
    "Analyzing quantum vulnerabilities...",
    "Generating post-quantum alternatives...",
    "Creating test suite...",
    "Finalizing security report...",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            window.location.href = "/compare"
          }, 1000)
          return 100
        }

        const stepIndex = Math.floor((newProgress / 100) * steps.length)
        setCurrentStep(steps[stepIndex] || steps[steps.length - 1])

        return newProgress
      })
    }, 800)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-neon-bg-primary p-6 flex items-center justify-center">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-neon-text-primary">Analyzing Your Algorithm</h1>
          <p className="text-neon-text-muted text-lg">Please wait while we perform quantum-safe analysis...</p>
        </div>

        <GlassCard variant="pulse" className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-neon-cyan/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-24 h-24 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-neon-cyan animate-pulse" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <p className="text-neon-text-primary font-medium">{currentStep}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neon-text-muted">Progress</span>
                <span className="text-neon-cyan font-mono">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-neon-bg-surface rounded-full h-2">
                <div
                  className="bg-neon-gradient h-2 rounded-full transition-all duration-300 shadow-neon-cyan"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-neon-cyan">3</div>
              <div className="text-xs text-neon-text-muted">Vulnerabilities Found</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-neon-purple">7</div>
              <div className="text-xs text-neon-text-muted">Functions Analyzed</div>
            </div>
          </div>
        </GlassCard>

        <div className="text-center">
          <NeonButton variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </NeonButton>
        </div>
      </div>
    </div>
  )
}
