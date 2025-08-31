"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Shield, Zap, TestTube, Code, AlertTriangle, CheckCircle } from "lucide-react"

interface AnalyticsDashboardProps {
  data: {
    totalAnalyses: number
    quantumReadyProjects: number
    criticalIssuesFixed: number
    testsCoverage: number
    languageDistribution: Array<{ name: string; value: number }>
    vulnerabilityTrends: Array<{ month: string; critical: number; high: number; medium: number }>
    securityMetrics: {
      quantumVulnerable: number
      deprecated: number
      implementationFlaws: number
      secure: number
    }
  }
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const securityScore = Math.round(
    (data.securityMetrics.secure /
      (data.securityMetrics.secure +
        data.securityMetrics.quantumVulnerable +
        data.securityMetrics.deprecated +
        data.securityMetrics.implementationFlaws)) *
      100 || 0,
  )

  const quantumReadinessRate = Math.round((data.quantumReadyProjects / data.totalAnalyses) * 100) || 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalAnalyses}</div>
            <p className="text-xs text-muted-foreground">Code files processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quantum Ready</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.quantumReadyProjects}</div>
            <p className="text-xs text-muted-foreground">{quantumReadinessRate}% of projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues Fixed</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.criticalIssuesFixed}</div>
            <p className="text-xs text-muted-foreground">Critical vulnerabilities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Coverage</CardTitle>
            <TestTube className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.testsCoverage}%</div>
            <p className="text-xs text-muted-foreground">Average coverage</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Score</CardTitle>
            <CardDescription>Overall quantum-readiness assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Security Score</span>
              <Badge variant={securityScore >= 80 ? "default" : securityScore >= 60 ? "secondary" : "destructive"}>
                {securityScore}%
              </Badge>
            </div>
            <Progress value={securityScore} className="w-full" />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Secure
                </div>
                <span>{data.securityMetrics.secure}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Quantum Vulnerable
                </div>
                <span>{data.securityMetrics.quantumVulnerable}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Deprecated
                </div>
                <span>{data.securityMetrics.deprecated}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  Implementation Flaws
                </div>
                <span>{data.securityMetrics.implementationFlaws}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Language Distribution</CardTitle>
            <CardDescription>Code analysis by programming language</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.languageDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.languageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vulnerability Trends</CardTitle>
          <CardDescription>Security issues detected over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.vulnerabilityTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="critical" stackId="a" fill="#ef4444" name="Critical" />
              <Bar dataKey="high" stackId="a" fill="#f97316" name="High" />
              <Bar dataKey="medium" stackId="a" fill="#eab308" name="Medium" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
