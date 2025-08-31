import { type NextRequest, NextResponse } from "next/server"
import { TestGenerator } from "@/lib/test-generator"
import { TestExecutionEngine } from "@/lib/test-execution-engine"
import { CodeRefactorEngine } from "@/lib/refactor-engine"

export async function POST(request: NextRequest) {
  try {
    const { code, execute = false } = await request.json()

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Code is required and must be a string" }, { status: 400 })
    }

    const testGenerator = new TestGenerator()
    const testExecutor = new TestExecutionEngine()
    const engine = new CodeRefactorEngine()

    // Detect language
    const language = engine.detectLanguage(code)

    // Generate test suite
    const testSuite = testGenerator.generateTests(code, language)

    let testResults = null
    let testReport = null

    // Execute tests if requested
    if (execute) {
      testResults = await testExecutor.executeTests(testSuite, language)
      testReport = testExecutor.generateTestReport(testResults)
    }

    const result = {
      language,
      testSuite,
      testResults,
      testReport,
      metadata: {
        testCount: testResults?.totalTests || 0,
        coverage: testResults?.coverage || 0,
        successRate: testResults ? (testResults.passedTests / testResults.totalTests) * 100 : 0,
        duration: testResults?.duration || 0,
      },
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Test API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error during test generation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
