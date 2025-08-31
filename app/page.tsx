"use client"

import { useState } from "react"
import { GlassCard } from "@/components/GlassCard"
import { NeonButton } from "@/components/NeonButton"
import { BarChart3, Sparkles } from "lucide-react"

export default function HomePage() {
  const [inputCode, setInputCode] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = () => {
    if (!inputCode.trim()) return
    setIsAnalyzing(true)
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      window.location.href = "/analyzing"
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-neon-bg-primary p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-neon-text-primary text-balance">
            <span className="block">Post-Quantum</span>
            <span className="bg-neon-gradient bg-clip-text text-transparent block">
            Code Refactoring
            </span>
          </h1>
<p className="text-xl text-neon-text-muted max-w-2xl mx-auto text-balance">
  Transform your legacy cryptographic code into quantum-resistant implementations with AI-powered analysis
  and automated testing
</p>

          </div>

          <div className="flex items-center justify-center gap-2 text-neon-cyan">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">Powered by Post-Quantum Cryptography</span>
          </div>
        </div>

        {/* Main Input Section */}
        <GlassCard variant="hover" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-neon-text-primary">Analyze Your Code</h2>
            <p className="text-neon-text-muted">
              Paste your Solidity, Python, or Rust code below to get started with post-quantum refactoring
            </p>
          </div>

          <div className="space-y-4">
            <textarea
              className="input-neon w-full min-h-[300px] font-mono text-sm resize-none"
              placeholder="// Paste your code here..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />

            <div className="flex gap-4">
              <NeonButton onClick={handleAnalyze} disabled={!inputCode.trim() || isAnalyzing} className="flex-1">
                {isAnalyzing ? "Analyzing..." : "Analyze & Refactor"}
              </NeonButton>

              <NeonButton variant="outline" className="px-6">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </NeonButton>
            </div>
          </div>
        </GlassCard>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="text-center space-y-4">
            <div className="w-12 h-12 bg-neon-gradient rounded-lg mx-auto flex items-center justify-center">
              <span className="text-white font-bold text-xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold text-neon-text-primary">Post-Quantum Security</h3>
            <p className="text-neon-text-muted text-sm">
              Automatically replace vulnerable cryptographic functions with quantum-resistant alternatives
            </p>
          </GlassCard>

          <GlassCard className="text-center space-y-4">
            <div className="w-12 h-12 bg-neon-gradient rounded-lg mx-auto flex items-center justify-center">
              <span className="text-white font-bold text-xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-neon-text-primary">AI-Powered Analysis</h3>
            <p className="text-neon-text-muted text-sm">
              Advanced pattern recognition identifies security vulnerabilities and optimization opportunities
            </p>
          </GlassCard>

          <GlassCard className="text-center space-y-4">
            <div className="w-12 h-12 bg-neon-gradient rounded-lg mx-auto flex items-center justify-center">
              <span className="text-white font-bold text-xl">🧪</span>
            </div>
            <h3 className="text-lg font-semibold text-neon-text-primary">Automated Testing</h3>
            <p className="text-neon-text-muted text-sm">
              Generate comprehensive test suites with coverage analysis and security validation
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
