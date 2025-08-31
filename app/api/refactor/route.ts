import { type NextRequest, NextResponse } from "next/server"
import { CodeRefactorEngine } from "@/lib/refactor-engine"
import { PostQuantumReplacer } from "@/lib/post-quantum-replacer"
import { TestGenerator } from "@/lib/test-generator"
import { CryptoAnalyzer } from "@/lib/crypto-analyzer"
import { TestExecutionEngine } from "@/lib/test-execution-engine"

export async function POST(request: NextRequest) {
  try {
    const { code, options = {} } = await request.json()

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Code is required and must be a string" }, { status: 400 })
    }

    const engine = new CodeRefactorEngine()
    const quantumReplacer = new PostQuantumReplacer()
    const testGenerator = new TestGenerator()
    const analyzer = new CryptoAnalyzer()
    const testExecutor = new TestExecutionEngine()

    // Detect language
    const language = engine.detectLanguage(code)

    // Analyze vulnerabilities
    const vulnerabilities = analyzer.analyzeCode(code, language)
    const securityReport = analyzer.generateSecurityReport(vulnerabilities)

    // Refactor code
    const refactored = engine.refactorCode(code, language)

    // Apply post-quantum replacements
    const quantumSecure = quantumReplacer.replaceClassicalCrypto(refactored.code, language)

    // Generate changes list
    const changes = [...refactored.changes, ...quantumSecure.changes]

    // Generate test suite
    const testSuite = testGenerator.generateTests(quantumSecure.code, language)

    // Execute tests if requested
    let testResults = null
    if (options.executeTests) {
      testResults = await testExecutor.executeTests(testSuite, language)
    }

    const result = {
      refactoredCode: quantumSecure.code,
      changes,
      summary: `Refactored ${language} code with ${changes.length} improvements including post-quantum cryptography upgrades. Security analysis found ${vulnerabilities.length} issues that have been addressed.`,
      testSuite,
      testResults,
      language,
      securityReport,
      vulnerabilities,
      metadata: {
        originalLines: code.split("\n").length,
        refactoredLines: quantumSecure.code.split("\n").length,
        securityIssues: vulnerabilities.length,
        criticalIssues: vulnerabilities.filter((v) => v.severity === "critical").length,
        postQuantumUpgrades: quantumSecure.changes.length,
      },
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Refactoring API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error during refactoring",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
