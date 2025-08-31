"use client"
import { GlassCard } from "@/components/GlassCard"
import { NeonButton } from "@/components/NeonButton"
import { CodePanel } from "@/components/CodePanel"
import { ArrowLeft, Download, Share, CheckCircle, AlertTriangle } from "lucide-react"

export default function ComparePage() {
  const originalCode = `pragma solidity ^0.8.0;

contract Example {
    mapping(address => uint256) public balances;
    
    function hash(bytes memory data) public pure returns (bytes32) {
        return keccak256(data);
    }
    
    function verify(bytes32 hash, bytes memory signature) public pure returns (address) {
        return ecrecover(hash, v, r, s);
    }
}`

  const refactoredCode = `pragma solidity ^0.8.0;

contract Example {
    mapping(address => uint256) public balances;
    
    // Post-quantum hash function using SPHINCS+
    function hash(bytes memory data) public pure returns (bytes32) {
        return postQuantumHash(data);
    }
    
    // Post-quantum signature verification using Dilithium
    function verify(bytes32 hash, bytes memory signature) public pure returns (address) {
        return dilithiumVerify(hash, signature);
    }
    
    // Enhanced security with reentrancy protection
    modifier nonReentrant() {
        require(!locked, "ReentrancyGuard: reentrant call");
        locked = true;
        _;
        locked = false;
    }
    
    bool private locked;
}`

  const handleDownload = () => {
    const blob = new Blob([refactoredCode], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "refactored-contract.sol"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-neon-bg-primary p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <NeonButton variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </NeonButton>
            <div>
              <h1 className="text-3xl font-bold text-neon-text-primary">Refactoring Complete</h1>
              <p className="text-neon-text-muted">
                Your code has been successfully upgraded with post-quantum security
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <NeonButton variant="outline" onClick={() => {}}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </NeonButton>
            <NeonButton onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download Refactored Code
            </NeonButton>
          </div>
        </div>

        {/* Summary Stats */}
        <GlassCard className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-neon-cyan">3</div>
            <div className="text-sm text-neon-text-muted">Vulnerabilities Fixed</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-neon-purple">2</div>
            <div className="text-sm text-neon-text-muted">Functions Upgraded</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-green-400">95%</div>
            <div className="text-sm text-neon-text-muted">Security Score</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-neon-cyan">100%</div>
            <div className="text-sm text-neon-text-muted">Quantum Ready</div>
          </div>
        </GlassCard>

        {/* Code Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CodePanel title="Original Code" code={originalCode} language="solidity" className="border-red-500/20" />

          <CodePanel
            title="Refactored Code"
            code={refactoredCode}
            language="solidity"
            className="border-green-500/20"
          />
        </div>

        {/* Changes Summary */}
        <GlassCard className="space-y-6">
          <h2 className="text-2xl font-semibold text-neon-text-primary">Key Improvements</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-neon-text-primary">Post-Quantum Hash Function</h3>
                <p className="text-neon-text-muted text-sm">
                  Replaced <code className="bg-neon-bg-surface px-1 rounded">keccak256()</code> with
                  <code className="bg-neon-bg-surface px-1 rounded ml-1">postQuantumHash()</code> using SPHINCS+
                  algorithm
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-neon-text-primary">Quantum-Safe Signatures</h3>
                <p className="text-neon-text-muted text-sm">
                  Upgraded <code className="bg-neon-bg-surface px-1 rounded">ecrecover()</code> to
                  <code className="bg-neon-bg-surface px-1 rounded ml-1">dilithiumVerify()</code> for quantum resistance
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-neon-text-primary">Reentrancy Protection</h3>
                <p className="text-neon-text-muted text-sm">
                  Added <code className="bg-neon-bg-surface px-1 rounded">nonReentrant</code> modifier to prevent
                  reentrancy attacks
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
