"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatbotInterface } from "@/components/chatbot-interface"
import { FileUpload } from "@/components/file-upload"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { Download, Share, BarChart3 } from "lucide-react"

interface RefactorResult {
  refactoredCode: string
  changes: Array<{ before: string; after: string; reason: string }>
  summary: string
  testSuite: string
  testResults?: any
  language: "solidity" | "python" | "rust"
  securityReport?: string
  vulnerabilities?: any[]
  metadata?: any
}

export default function HomePage() {
  const [inputCode, setInputCode] = useState("")
  const [result, setResult] = useState<RefactorResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("refactor")

  // Mock analytics data
  const analyticsData = {
    totalAnalyses: 1247,
    quantumReadyProjects: 892,
    criticalIssuesFixed: 156,
    testsCoverage: 87,
    languageDistribution: [
      { name: "Solidity", value: 45 },
      { name: "Python", value: 35 },
      { name: "Rust", value: 20 },
    ],
    vulnerabilityTrends: [
      { month: "Jan", critical: 12, high: 23, medium: 45 },
      { month: "Feb", critical: 8, high: 19, medium: 38 },
      { month: "Mar", critical: 5, high: 15, medium: 32 },
      { month: "Apr", critical: 3, high: 12, medium: 28 },
      { month: "May", critical: 2, high: 8, medium: 22 },
      { month: "Jun", critical: 1, high: 5, medium: 18 },
    ],
    securityMetrics: {
      quantumVulnerable: 23,
      deprecated: 15,
      implementationFlaws: 8,
      secure: 156,
    },
  }

  const handleRefactor = async (code?: string) => {
    const codeToProcess = code || inputCode
    if (!codeToProcess.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/refactor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeToProcess, options: { executeTests: true } }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setResult(result)

      if (code) {
        setInputCode(code) // Update input if code came from chatbot
      }
    } catch (error) {
      console.error("Refactoring failed:", error)
      alert("Refactoring failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (content: string, filename: string) => {
    setInputCode(content)
  }

  const exportResults = () => {
    if (!result) return

    const exportData = {
      timestamp: new Date().toISOString(),
      language: result.language,
      summary: result.summary,
      refactoredCode: result.refactoredCode,
      changes: result.changes,
      testSuite: result.testSuite,
      securityReport: result.securityReport,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `refactor-results-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = async () => {
    if (!result) return

    const shareData = {
      title: "Quantum-Safe Code Refactoring Results",
      text: `Refactored ${result.language} code with ${result.changes.length} improvements including post-quantum cryptography upgrades.`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
      alert("Results copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-balance">Quantum-Safe Code Refactoring Tool</h1>
          <p className="text-muted-foreground text-lg">
            Refactor your code with post-quantum cryptography and comprehensive testing
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="refactor">Code Refactoring</TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="refactor" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Input Code</CardTitle>
                    <CardDescription>Paste your Solidity, Python, or Rust code here</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="// Paste your code here..."
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="min-h-[300px] font-mono text-sm"
                    />
                    <Button
                      onClick={() => handleRefactor()}
                      disabled={!inputCode.trim() || isLoading}
                      className="w-full"
                    >
                      {isLoading ? "Refactoring..." : "Refactor Code"}
                    </Button>
                  </CardContent>
                </Card>

                <FileUpload onFileUpload={handleFileUpload} />
              </div>

              <ChatbotInterface onRefactorRequest={handleRefactor} lastResult={result} isProcessing={isLoading} />
            </div>

            {/* Results Section */}
            {result && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle>Refactoring Results</CardTitle>
                      <Badge variant="outline">{result.language}</Badge>
                      {result.metadata && (
                        <Badge variant="secondary">{result.metadata.postQuantumUpgrades} PQ upgrades</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={exportResults}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" onClick={shareResults}>
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="code" className="w-full">
                    <TabsList className="grid w-full grid-cols-6">
                      <TabsTrigger value="code">Refactored Code</TabsTrigger>
                      <TabsTrigger value="changes">Changes</TabsTrigger>
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                      <TabsTrigger value="tests">Test Suite</TabsTrigger>
                      <TabsTrigger value="security">Security Report</TabsTrigger>
                      <TabsTrigger value="execution">Test Results</TabsTrigger>
                    </TabsList>

                    {/* Refactored Code */}
                    <TabsContent value="code" className="space-y-4">
                      <ScrollArea className="h-[400px]">
                        <pre className="bg-muted p-4 rounded text-sm font-mono overflow-x-auto">
                          {result.refactoredCode}
                        </pre>
                      </ScrollArea>
                    </TabsContent>

                    {/* Changes */}
                    <TabsContent value="changes" className="space-y-4">
                      <ScrollArea className="h-[400px]">
                        {result.changes.map((change, idx) => (
                          <div key={idx} className="border rounded p-4 mb-4">
                            <Badge className="mb-2">Change {idx + 1}</Badge>
                            <div className="space-y-2">
                              <div>
                                <strong className="text-destructive">Before:</strong>
                                <pre className="bg-muted p-2 rounded text-sm mt-1">{change.before}</pre>
                              </div>
                              <div>
                                <strong className="text-green-600">After:</strong>
                                <pre className="bg-muted p-2 rounded text-sm mt-1">{change.after}</pre>
                              </div>
                              <div>
                                <strong>Reason:</strong> {change.reason}
                              </div>
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                    </TabsContent>

                    {/* Summary */}
                    <TabsContent value="summary" className="space-y-4">
                      <div className="prose max-w-none">
                        <p>{result.summary}</p>
                        {result.metadata && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div className="text-center p-3 bg-muted rounded">
                              <div className="text-2xl font-bold">{result.metadata.originalLines}</div>
                              <div className="text-sm text-muted-foreground">Original Lines</div>
                            </div>
                            <div className="text-center p-3 bg-muted rounded">
                              <div className="text-2xl font-bold">{result.metadata.refactoredLines}</div>
                              <div className="text-sm text-muted-foreground">Refactored Lines</div>
                            </div>
                            <div className="text-center p-3 bg-muted rounded">
                              <div className="text-2xl font-bold">{result.metadata.securityIssues}</div>
                              <div className="text-sm text-muted-foreground">Security Issues</div>
                            </div>
                            <div className="text-center p-3 bg-muted rounded">
                              <div className="text-2xl font-bold">{result.metadata.criticalIssues}</div>
                              <div className="text-sm text-muted-foreground">Critical Issues</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    {/* Test Suite */}
                    <TabsContent value="tests" className="space-y-4">
                      <ScrollArea className="h-[400px]">
                        <pre className="bg-muted p-4 rounded text-sm font-mono overflow-x-auto">{result.testSuite}</pre>
                      </ScrollArea>
                    </TabsContent>

                    {/* Security Report */}
                    <TabsContent value="security" className="space-y-4">
                      <ScrollArea className="h-[400px]">
                        <div className="prose max-w-none">
                          <pre className="whitespace-pre-wrap text-sm">{result.securityReport}</pre>
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    {/* Test Execution Results */}
                    <TabsContent value="execution" className="space-y-4">
                      {result.testResults ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-muted rounded">
                              <div className="text-2xl font-bold text-green-600">{result.testResults.passedTests}</div>
                              <div className="text-sm text-muted-foreground">Passed</div>
                            </div>
                            <div className="text-center p-3 bg-muted rounded">
                              <div className="text-2xl font-bold text-red-600">{result.testResults.failedTests}</div>
                              <div className="text-sm text-muted-foreground">Failed</div>
                            </div>
                            <div className="text-center p-3 bg-muted rounded">
                              <div className="text-2xl font-bold">{result.testResults.coverage}%</div>
                              <div className="text-sm text-muted-foreground">Coverage</div>
                            </div>
                            <div className="text-center p-3 bg-muted rounded">
                              <div className="text-2xl font-bold">{result.testResults.duration}ms</div>
                              <div className="text-sm text-muted-foreground">Duration</div>
                            </div>
                          </div>
                          <ScrollArea className="h-[300px]">
                            <div className="space-y-2">
                              {result.testResults.results.map((test: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-3 border rounded">
                                  <span className="font-mono text-sm">{test.testName}</span>
                                  <Badge variant={test.status === "passed" ? "default" : "destructive"}>
                                    {test.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No test execution results available. Tests were not executed for this refactoring.
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard data={analyticsData} />
          </TabsContent>

          {/* Documentation */}
          <TabsContent value="docs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Documentation & Instructions</CardTitle>
                <CardDescription>How to use the Quantum-Safe Code Refactoring Tool</CardDescription>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <h2>Installation & Setup</h2>
                <p>
                  This is a web-based tool that runs entirely in your browser. No installation required! Simply paste
                  your code or upload files to get started.
                </p>

                <h2>Supported Languages</h2>
                <ul>
                  <li>
                    <strong>Solidity</strong> - Smart contract refactoring with post-quantum cryptography
                  </li>
                  <li>
                    <strong>Python</strong> - Python code analysis and quantum-safe upgrades
                  </li>
                  <li>
                    <strong>Rust</strong> - Rust code refactoring with security enhancements
                  </li>
                </ul>

                <h2>Chatbot Commands</h2>
                <ul>
                  <li>
                    <code>/refactor &lt;code&gt;</code> - Refactor code with post-quantum security
                  </li>
                  <li>
                    <code>/analyze &lt;code&gt;</code> - Analyze cryptographic vulnerabilities
                  </li>
                  <li>
                    <code>/explain</code> - Explain the last refactoring changes
                  </li>
                  <li>
                    <code>/test</code> - Show generated test suite
                  </li>
                  <li>
                    <code>/security</code> - Generate security report
                  </li>
                  <li>
                    <code>/recommend &lt;type&gt;</code> - Get post-quantum recommendations
                  </li>
                  <li>
                    <code>/help</code> - Show all available commands
                  </li>
                </ul>

                <h2>Example Usage</h2>
                <pre className="bg-muted p-4 rounded">
                  {`// Example Solidity contract
pragma solidity ^0.8.0;

contract Example {
    function hash(bytes memory data) public pure returns (bytes32) {
        return keccak256(data); // Will be upgraded to post-quantum
    }
}`}
                </pre>

                <h2>Post-Quantum Cryptography</h2>
                <p>
                  The tool automatically replaces classical cryptographic functions with quantum-resistant alternatives:
                </p>
                <ul>
                  <li>
                    <strong>Hash Functions</strong>: SHA-256, Keccak-256 → SPHINCS+ hash functions
                  </li>
                  <li>
                    <strong>Digital Signatures</strong>: ECDSA, RSA → Dilithium signature scheme
                  </li>
                  <li>
                    <strong>Key Exchange</strong>: ECDH, RSA → Kyber key encapsulation mechanism
                  </li>
                </ul>

                <h2>Security Features</h2>
                <ul>
                  <li>Comprehensive vulnerability analysis</li>
                  <li>Post-quantum cryptography upgrades</li>
                  <li>Automated test suite generation</li>
                  <li>Security report generation</li>
                  <li>Code coverage analysis</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
