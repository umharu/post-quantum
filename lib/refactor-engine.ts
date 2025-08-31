export interface RefactorChange {
  before: string
  after: string
  reason: string
}

export interface RefactorResult {
  code: string
  changes: RefactorChange[]
}

export class CodeRefactorEngine {
  detectLanguage(code: string): "solidity" | "python" | "rust" {
    if (
      code.includes("pragma solidity") ||
      code.includes("contract ") ||
      (code.includes("function ") && code.includes("public"))
    ) {
      return "solidity"
    }
    if (code.includes("def ") || (code.includes("import ") && code.includes("from "))) {
      return "python"
    }
    if (code.includes("fn ") || code.includes("use ") || code.includes("struct ")) {
      return "rust"
    }
    return "solidity" // default
  }

  refactorCode(code: string, language: "solidity" | "python" | "rust"): RefactorResult {
    const changes: RefactorChange[] = []
    const refactoredCode = code

    switch (language) {
      case "solidity":
        return this.refactorSolidity(code)
      case "python":
        return this.refactorPython(code)
      case "rust":
        return this.refactorRust(code)
      default:
        return { code, changes }
    }
  }

  private refactorSolidity(code: string): RefactorResult {
    const changes: RefactorChange[] = []
    let refactoredCode = code

    // Add SPDX license identifier if missing
    if (!code.includes("SPDX-License-Identifier")) {
      const before = code.split("\n")[0]
      const after = "// SPDX-License-Identifier: MIT\n" + code
      refactoredCode = after
      changes.push({
        before,
        after: "// SPDX-License-Identifier: MIT",
        reason: "Added SPDX license identifier for compliance",
      })
    }

    // Improve function visibility
    refactoredCode = refactoredCode.replace(/function\s+(\w+)\s*\(/g, (match, funcName) => {
      if (
        !match.includes("public") &&
        !match.includes("private") &&
        !match.includes("internal") &&
        !match.includes("external")
      ) {
        changes.push({
          before: match,
          after: `function ${funcName}() external`,
          reason: "Added explicit visibility modifier for security",
        })
        return `function ${funcName}() external`
      }
      return match
    })

    // Add reentrancy guard pattern
    if (code.includes("external") && !code.includes("nonReentrant")) {
      const guardImport = 'import "@openzeppelin/contracts/security/ReentrancyGuard.sol";\n'
      refactoredCode = guardImport + refactoredCode
      changes.push({
        before: "contract without reentrancy protection",
        after: "contract with ReentrancyGuard import",
        reason: "Added reentrancy protection for security",
      })
    }

    return { code: refactoredCode, changes }
  }

  private refactorPython(code: string): RefactorResult {
    const changes: RefactorChange[] = []
    let refactoredCode = code

    // Add type hints
    refactoredCode = refactoredCode.replace(/def\s+(\w+)\s*$$([^)]*)$$:/g, (match, funcName, params) => {
      if (!match.includes(":") || !match.includes("->")) {
        const newFunc = `def ${funcName}(${params}) -> None:`
        changes.push({
          before: match,
          after: newFunc,
          reason: "Added type hints for better code clarity",
        })
        return newFunc
      }
      return match
    })

    // Add docstrings
    refactoredCode = refactoredCode.replace(/def\s+\w+$$[^)]*$$[^:]*:\s*\n/g, (match) => {
      if (!refactoredCode.includes('"""')) {
        changes.push({
          before: match,
          after: match + '    """Function docstring."""\n',
          reason: "Added docstring for documentation",
        })
        return match + '    """Function docstring."""\n'
      }
      return match
    })

    return { code: refactoredCode, changes }
  }

  private refactorRust(code: string): RefactorResult {
    const changes: RefactorChange[] = []
    let refactoredCode = code

    // Add error handling
    refactoredCode = refactoredCode.replace(/fn\s+(\w+)$$[^)]*$$\s*{/g, (match, funcName) => {
      if (!match.includes("Result<")) {
        const newFunc = match.replace("{", "-> Result<(), Box<dyn std::error::Error>> {")
        changes.push({
          before: match,
          after: newFunc,
          reason: "Added Result type for proper error handling",
        })
        return newFunc
      }
      return match
    })

    // Add derive traits
    refactoredCode = refactoredCode.replace(/struct\s+(\w+)/g, (match, structName) => {
      if (!code.includes("#[derive(")) {
        const newStruct = "#[derive(Debug, Clone)]\n" + match
        changes.push({
          before: match,
          after: newStruct,
          reason: "Added derive traits for better functionality",
        })
        return newStruct
      }
      return match
    })

    return { code: refactoredCode, changes }
  }
}
