"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Bot, User, Terminal, Code, TestTube, FileText, Zap } from "lucide-react"
import { CryptoAnalyzer } from "@/lib/crypto-analyzer"
import { PostQuantumMock } from "@/lib/post-quantum-mock"

interface ChatMessage {
  id: string
  type: "user" | "bot" | "system"
  message: string
  timestamp: Date
  command?: string
  metadata?: {
    language?: string
    vulnerabilities?: number
    changes?: number
  }
}

interface ChatbotProps {
  onRefactorRequest: (code: string) => void
  lastResult: any
  isProcessing: boolean
}

export function ChatbotInterface({ onRefactorRequest, lastResult, isProcessing }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "system",
      message: "Welcome to the Quantum-Safe Code Refactoring Assistant! Available commands:",
      timestamp: new Date(),
    },
    {
      id: "commands",
      type: "bot",
      message: `• /refactor <code> - Refactor code with post-quantum security
• /analyze <code> - Analyze cryptographic vulnerabilities  
• /explain - Explain the last refactoring changes
• /test - Show generated test suite
• /security - Generate security report
• /recommend <algorithm_type> - Get post-quantum recommendations
• /help - Show all available commands`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const addMessage = (message: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const simulateTyping = async (response: string, metadata?: ChatMessage["metadata"]) => {
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsTyping(false)
    addMessage({ type: "bot", message: response, metadata })
  }

  const handleCommand = async (command: string) => {
    addMessage({ type: "user", message: command, command })

    const [cmd, ...args] = command.trim().split(" ")
    const argument = args.join(" ")

    switch (cmd.toLowerCase()) {
      case "/refactor":
        if (!argument) {
          await simulateTyping("Please provide code to refactor. Usage: /refactor <your_code>")
          return
        }
        await simulateTyping("Processing your code for refactoring with post-quantum security...")
        onRefactorRequest(argument)
        break

      case "/analyze":
        if (!argument) {
          await simulateTyping("Please provide code to analyze. Usage: /analyze <your_code>")
          return
        }
        await analyzeCode(argument)
        break

      case "/explain":
        if (!lastResult) {
          await simulateTyping("No recent refactoring results to explain. Please refactor some code first.")
          return
        }
        await simulateTyping(
          `Last refactoring summary: ${lastResult.summary}\n\nKey improvements:\n${lastResult.changes
            .slice(0, 3)
            .map((c: any, i: number) => `${i + 1}. ${c.reason}`)
            .join("\n")}`,
          { changes: lastResult.changes.length, language: lastResult.language },
        )
        break

      case "/test":
        if (!lastResult) {
          await simulateTyping("No test suite available. Please refactor some code first to generate tests.")
          return
        }
        await simulateTyping(
          `Generated ${lastResult.language} test suite with comprehensive coverage:\n\n\`\`\`${lastResult.language}\n${lastResult.testSuite.substring(0, 300)}...\n\`\`\`\n\nFull test suite is available in the Test Suite tab.`,
        )
        break

      case "/security":
        if (!lastResult) {
          await simulateTyping("No security analysis available. Please analyze or refactor some code first.")
          return
        }
        const analyzer = new CryptoAnalyzer()
        const vulnerabilities = analyzer.analyzeCode(lastResult.refactoredCode, lastResult.language)
        const report = analyzer.generateSecurityReport(vulnerabilities)
        await simulateTyping(
          `Security Analysis Complete:\n\n${report.substring(0, 500)}...\n\nFull report available in the Summary tab.`,
          { vulnerabilities: vulnerabilities.length },
        )
        break

      case "/recommend":
        const useCase = argument.toLowerCase()
        if (!["hash", "signature", "encryption"].includes(useCase)) {
          await simulateTyping(
            "Please specify algorithm type: hash, signature, or encryption.\nUsage: /recommend <hash|signature|encryption>",
          )
          return
        }
        const recommendation = PostQuantumMock.recommendAlgorithm(useCase as "hash" | "signature" | "encryption")
        await simulateTyping(`Post-Quantum Recommendation for ${useCase}:\n\n${recommendation}`)
        break

      case "/help":
        await simulateTyping(`Available Commands:

🔧 **Code Operations**
• /refactor <code> - Refactor with post-quantum security
• /analyze <code> - Analyze cryptographic vulnerabilities

📊 **Analysis & Reports**  
• /explain - Explain last refactoring changes
• /test - Show generated test suite
• /security - Generate detailed security report

🛡️ **Security Guidance**
• /recommend <type> - Get post-quantum algorithm recommendations
• /help - Show this help message

💡 **Tips:**
- Paste code directly after commands
- Use /analyze before /refactor for best results
- Check /security report for quantum readiness assessment`)
        break

      default:
        await simulateTyping(
          `Unknown command: ${cmd}\n\nType /help to see available commands or try:\n• /refactor <code>\n• /analyze <code>\n• /explain`,
        )
    }

    setInput("")
    inputRef.current?.focus()
  }

  const analyzeCode = async (code: string) => {
    const analyzer = new CryptoAnalyzer()

    // Detect language
    const language = code.includes("pragma solidity") ? "solidity" : code.includes("def ") ? "python" : "rust"

    const vulnerabilities = analyzer.analyzeCode(code, language)
    const criticalCount = vulnerabilities.filter((v) => v.severity === "critical").length
    const highCount = vulnerabilities.filter((v) => v.severity === "high").length

    let response = `Code Analysis Complete for ${language.toUpperCase()}:\n\n`

    if (vulnerabilities.length === 0) {
      response += "✅ No cryptographic vulnerabilities detected!\nYour code appears to be quantum-ready."
    } else {
      response += `⚠️ Found ${vulnerabilities.length} cryptographic issues:\n`
      response += `• Critical: ${criticalCount}\n• High: ${highCount}\n• Medium: ${vulnerabilities.filter((v) => v.severity === "medium").length}\n\n`

      if (criticalCount > 0) {
        response += "🚨 **CRITICAL**: Quantum-vulnerable algorithms detected!\n"
        response += "Recommendation: Immediate migration to post-quantum cryptography required.\n\n"
      }

      response += "Use /refactor to automatically upgrade to post-quantum security."
    }

    await simulateTyping(response, {
      language,
      vulnerabilities: vulnerabilities.length,
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) {
        handleCommand(input)
      }
    }
  }

  const formatMessage = (message: string) => {
    // Simple markdown-like formatting
    return message
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 rounded text-sm">$1</code>')
      .replace(/\n/g, "<br />")
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Quantum-Safe AI Assistant
        </CardTitle>
        <CardDescription>Interactive code analysis and post-quantum cryptography guidance</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        <ScrollArea className="flex-1 h-[400px] pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  {msg.type === "user" ? (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  ) : msg.type === "bot" ? (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Terminal className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={msg.type === "user" ? "default" : msg.type === "bot" ? "secondary" : "outline"}>
                      {msg.type === "user" ? "You" : msg.type === "bot" ? "Assistant" : "System"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{msg.timestamp.toLocaleTimeString()}</span>
                    {msg.metadata && (
                      <div className="flex gap-1">
                        {msg.metadata.language && (
                          <Badge variant="outline" className="text-xs">
                            {msg.metadata.language}
                          </Badge>
                        )}
                        {msg.metadata.vulnerabilities !== undefined && (
                          <Badge variant="destructive" className="text-xs">
                            {msg.metadata.vulnerabilities} issues
                          </Badge>
                        )}
                        {msg.metadata.changes !== undefined && (
                          <Badge variant="default" className="text-xs">
                            {msg.metadata.changes} changes
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.message) }}
                  />

                  {msg.command && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Terminal className="h-3 w-3" />
                      Command: {msg.command.split(" ")[0]}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <Badge variant="secondary">Assistant</Badge>
                  <div className="text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <span className="ml-2">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder="Type a command (e.g., /help, /refactor, /analyze)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isProcessing || isTyping}
              className="flex-1"
            />
            <Button
              onClick={() => input.trim() && handleCommand(input)}
              disabled={!input.trim() || isProcessing || isTyping}
              size="icon"
            >
              <Zap className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setInput("/help")} disabled={isProcessing || isTyping}>
              <FileText className="h-3 w-3 mr-1" />
              Help
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("/analyze ")}
              disabled={isProcessing || isTyping}
            >
              <Code className="h-3 w-3 mr-1" />
              Analyze
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("/test")}
              disabled={isProcessing || isTyping || !lastResult}
            >
              <TestTube className="h-3 w-3 mr-1" />
              Tests
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
