// Advanced cryptographic analysis and vulnerability detection

export interface CryptoVulnerability {
  type: "quantum_vulnerable" | "deprecated" | "weak_parameters" | "implementation_flaw"
  severity: "critical" | "high" | "medium" | "low"
  description: string
  recommendation: string
  location: { line: number; column: number }
}

export class CryptoAnalyzer {
  private quantumVulnerablePatterns = [
    // Classical cryptographic patterns vulnerable to quantum attacks
    { pattern: /keccak256|sha256|sha3/gi, algorithm: "hash", vulnerability: "Grover's algorithm reduces security" },
    { pattern: /ecrecover|ecdsa|secp256k1/gi, algorithm: "signature", vulnerability: "Shor's algorithm breaks ECDSA" },
    { pattern: /rsa|dh|ecdh/gi, algorithm: "key_exchange", vulnerability: "Shor's algorithm breaks RSA/DH" },
    {
      pattern: /aes(?!.*256)|des|3des/gi,
      algorithm: "symmetric",
      vulnerability: "Insufficient key length for quantum era",
    },
  ]

  private postQuantumPatterns = [
    { pattern: /sphincs|dilithium|kyber|falcon|ntru/gi, algorithm: "post_quantum", secure: true },
    { pattern: /lattice|hash_based|code_based|multivariate/gi, algorithm: "post_quantum_family", secure: true },
  ]

  analyzeCode(code: string, language: "solidity" | "python" | "rust"): CryptoVulnerability[] {
    const vulnerabilities: CryptoVulnerability[] = []
    const lines = code.split("\n")

    lines.forEach((line, lineIndex) => {
      // Check for quantum-vulnerable patterns
      this.quantumVulnerablePatterns.forEach((pattern) => {
        const matches = line.matchAll(pattern.pattern)
        for (const match of matches) {
          if (match.index !== undefined) {
            vulnerabilities.push({
              type: "quantum_vulnerable",
              severity: this.getSeverity(pattern.algorithm),
              description: `${pattern.algorithm.toUpperCase()} algorithm detected: ${pattern.vulnerability}`,
              recommendation: this.getRecommendation(pattern.algorithm),
              location: { line: lineIndex + 1, column: match.index + 1 },
            })
          }
        }
      })

      // Check for deprecated or weak implementations
      this.checkDeprecatedPatterns(line, lineIndex, vulnerabilities)

      // Check for implementation flaws
      this.checkImplementationFlaws(line, lineIndex, vulnerabilities, language)
    })

    return vulnerabilities
  }

  private getSeverity(algorithm: string): "critical" | "high" | "medium" | "low" {
    const severityMap: Record<string, "critical" | "high" | "medium" | "low"> = {
      signature: "critical", // Digital signatures are critical for authentication
      key_exchange: "critical", // Key exchange is critical for confidentiality
      hash: "high", // Hash functions are important for integrity
      symmetric: "medium", // Symmetric encryption with sufficient key length
    }
    return severityMap[algorithm] || "low"
  }

  private getRecommendation(algorithm: string): string {
    const recommendations: Record<string, string> = {
      hash: "Replace with SPHINCS+ hash functions or SHAKE-256 for quantum resistance",
      signature: "Migrate to Dilithium or Falcon post-quantum signature schemes",
      key_exchange: "Implement Kyber key encapsulation mechanism for quantum-safe key exchange",
      symmetric: "Use AES-256 with post-quantum key derivation functions",
    }
    return recommendations[algorithm] || "Consider post-quantum alternatives"
  }

  private checkDeprecatedPatterns(line: string, lineIndex: number, vulnerabilities: CryptoVulnerability[]): void {
    const deprecatedPatterns = [
      { pattern: /md5|sha1/gi, reason: "Cryptographically broken hash functions" },
      { pattern: /rc4|des(?!.*3)/gi, reason: "Deprecated symmetric encryption algorithms" },
      { pattern: /ssl(?!.*3)|tls.*1\.[01]/gi, reason: "Deprecated protocol versions" },
    ]

    deprecatedPatterns.forEach((deprecated) => {
      const matches = line.matchAll(deprecated.pattern)
      for (const match of matches) {
        if (match.index !== undefined) {
          vulnerabilities.push({
            type: "deprecated",
            severity: "high",
            description: `Deprecated cryptographic function detected: ${deprecated.reason}`,
            recommendation: "Replace with modern, quantum-resistant alternatives",
            location: { line: lineIndex + 1, column: match.index + 1 },
          })
        }
      }
    })
  }

  private checkImplementationFlaws(
    line: string,
    lineIndex: number,
    vulnerabilities: CryptoVulnerability[],
    language: "solidity" | "python" | "rust",
  ): void {
    // Language-specific implementation flaw detection
    switch (language) {
      case "solidity":
        this.checkSolidityFlaws(line, lineIndex, vulnerabilities)
        break
      case "python":
        this.checkPythonFlaws(line, lineIndex, vulnerabilities)
        break
      case "rust":
        this.checkRustFlaws(line, lineIndex, vulnerabilities)
        break
    }
  }

  private checkSolidityFlaws(line: string, lineIndex: number, vulnerabilities: CryptoVulnerability[]): void {
    // Check for weak randomness
    if (line.includes("block.timestamp") || line.includes("block.difficulty")) {
      vulnerabilities.push({
        type: "implementation_flaw",
        severity: "critical",
        description: "Weak randomness source detected - blockchain parameters are predictable",
        recommendation: "Use commit-reveal schemes or oracle-based randomness with post-quantum signatures",
        location: { line: lineIndex + 1, column: 0 },
      })
    }

    // Check for missing access controls on crypto functions
    if (line.includes("function") && line.includes("public") && /keccak|sha|sign/i.test(line)) {
      vulnerabilities.push({
        type: "implementation_flaw",
        severity: "medium",
        description: "Public cryptographic function without access controls",
        recommendation: "Add proper access modifiers and consider post-quantum alternatives",
        location: { line: lineIndex + 1, column: 0 },
      })
    }
  }

  private checkPythonFlaws(line: string, lineIndex: number, vulnerabilities: CryptoVulnerability[]): void {
    // Check for hardcoded secrets
    if (/secret|key|password.*=.*["'][^"']+["']/i.test(line)) {
      vulnerabilities.push({
        type: "implementation_flaw",
        severity: "critical",
        description: "Hardcoded cryptographic secret detected",
        recommendation: "Use environment variables or secure key management systems",
        location: { line: lineIndex + 1, column: 0 },
      })
    }

    // Check for weak random number generation
    if (line.includes("random.random()") || line.includes("random.randint")) {
      vulnerabilities.push({
        type: "implementation_flaw",
        severity: "high",
        description: "Weak random number generator for cryptographic use",
        recommendation: "Use secrets module or post-quantum secure random number generation",
        location: { line: lineIndex + 1, column: 0 },
      })
    }
  }

  private checkRustFlaws(line: string, lineIndex: number, vulnerabilities: CryptoVulnerability[]): void {
    // Check for unsafe cryptographic operations
    if (line.includes("unsafe") && /crypto|hash|sign/i.test(line)) {
      vulnerabilities.push({
        type: "implementation_flaw",
        severity: "high",
        description: "Unsafe block in cryptographic code",
        recommendation: "Avoid unsafe operations in cryptographic contexts, use safe post-quantum libraries",
        location: { line: lineIndex + 1, column: 0 },
      })
    }

    // Check for unwrap() in cryptographic operations
    if (line.includes(".unwrap()") && /crypto|hash|sign/i.test(line)) {
      vulnerabilities.push({
        type: "implementation_flaw",
        severity: "medium",
        description: "Panic-prone error handling in cryptographic code",
        recommendation: "Use proper error handling with Result types for cryptographic operations",
        location: { line: lineIndex + 1, column: 0 },
      })
    }
  }

  // Generate security report
  generateSecurityReport(vulnerabilities: CryptoVulnerability[]): string {
    const criticalCount = vulnerabilities.filter((v) => v.severity === "critical").length
    const highCount = vulnerabilities.filter((v) => v.severity === "high").length
    const mediumCount = vulnerabilities.filter((v) => v.severity === "medium").length
    const lowCount = vulnerabilities.filter((v) => v.severity === "low").length

    return `
# Cryptographic Security Analysis Report

## Summary
- **Critical Issues**: ${criticalCount}
- **High Severity**: ${highCount}
- **Medium Severity**: ${mediumCount}
- **Low Severity**: ${lowCount}

## Quantum Readiness Assessment
${criticalCount + highCount > 0 ? "❌ **NOT QUANTUM READY** - Critical vulnerabilities detected" : "✅ **QUANTUM READY** - No critical vulnerabilities found"}

## Post-Quantum Migration Priority
1. **Immediate**: Replace quantum-vulnerable signatures (ECDSA → Dilithium)
2. **High**: Upgrade key exchange mechanisms (DH/ECDH → Kyber)
3. **Medium**: Enhance hash functions (SHA-256 → SPHINCS+/SHAKE-256)
4. **Low**: Update symmetric encryption key lengths

## Detailed Findings
${vulnerabilities
  .map(
    (v, i) => `
### Issue ${i + 1}: ${v.description}
- **Severity**: ${v.severity.toUpperCase()}
- **Type**: ${v.type.replace("_", " ").toUpperCase()}
- **Location**: Line ${v.location.line}, Column ${v.location.column}
- **Recommendation**: ${v.recommendation}
`,
  )
  .join("")}
`
  }
}
