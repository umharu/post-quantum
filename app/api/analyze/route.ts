import { type NextRequest, NextResponse } from "next/server"
import { CryptoAnalyzer } from "@/lib/crypto-analyzer"
import { CodeRefactorEngine } from "@/lib/refactor-engine"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Code is required and must be a string" }, { status: 400 })
    }

    const analyzer = new CryptoAnalyzer()
    const engine = new CodeRefactorEngine()

    // Detect language
    const language = engine.detectLanguage(code)

    // Analyze vulnerabilities
    const vulnerabilities = analyzer.analyzeCode(code, language)

    // Generate security report
    const securityReport = analyzer.generateSecurityReport(vulnerabilities)

    // Calculate metrics
    const criticalCount = vulnerabilities.filter((v) => v.severity === "critical").length
    const highCount = vulnerabilities.filter((v) => v.severity === "high").length
    const mediumCount = vulnerabilities.filter((v) => v.severity === "medium").length
    const lowCount = vulnerabilities.filter((v) => v.severity === "low").length

    const quantumVulnerable = vulnerabilities.filter((v) => v.type === "quantum_vulnerable").length
    const deprecated = vulnerabilities.filter((v) => v.type === "deprecated").length
    const implementationFlaws = vulnerabilities.filter((v) => v.type === "implementation_flaw").length

    const result = {
      language,
      vulnerabilities,
      securityReport,
      summary: {
        totalIssues: vulnerabilities.length,
        criticalCount,
        highCount,
        mediumCount,
        lowCount,
        quantumVulnerable,
        deprecated,
        implementationFlaws,
        quantumReady: criticalCount === 0 && highCount === 0,
        riskLevel: criticalCount > 0 ? "critical" : highCount > 0 ? "high" : mediumCount > 0 ? "medium" : "low",
      },
      recommendations: [
        ...(quantumVulnerable > 0 ? ["Immediate migration to post-quantum cryptography required"] : []),
        ...(deprecated > 0 ? ["Replace deprecated cryptographic functions"] : []),
        ...(implementationFlaws > 0 ? ["Fix implementation security flaws"] : []),
        ...(vulnerabilities.length === 0 ? ["Code appears to be quantum-ready"] : []),
      ],
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Analysis API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error during analysis",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
