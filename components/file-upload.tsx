"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, File, X } from "lucide-react"

interface FileUploadProps {
  onFileContent: (content: string, filename: string) => void
}

export function FileUpload({ onFileContent }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0])
      }
    },
    [onFileContent],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0])
      }
    },
    [onFileContent],
  )

  const handleFile = (file: File) => {
    const validExtensions = [".sol", ".py", ".rs", ".js", ".ts", ".txt"]
    const fileExtension = file.name.substring(file.name.lastIndexOf("."))

    if (!validExtensions.includes(fileExtension)) {
      alert("Please upload a valid code file (.sol, .py, .rs, .js, .ts, .txt)")
      return
    }

    if (file.size > 1024 * 1024) {
      // 1MB limit
      alert("File size must be less than 1MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      onFileContent(content, file.name)
      setUploadedFile({ name: file.name, size: file.size })
    }
    reader.readAsText(file)
  }

  const clearFile = () => {
    setUploadedFile(null)
    onFileContent("", "")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          File Upload
        </CardTitle>
        <CardDescription>Upload your code files for analysis and refactoring</CardDescription>
      </CardHeader>
      <CardContent>
        {uploadedFile ? (
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted">
            <div className="flex items-center gap-3">
              <File className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={clearFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Drop your code file here</p>
            <p className="text-muted-foreground mb-4">or click to browse</p>
            <input
              type="file"
              accept=".sol,.py,.rs,.js,.ts,.txt"
              onChange={handleChange}
              className="hidden"
              id="file-upload"
            />
            <Button asChild variant="outline">
              <label htmlFor="file-upload" className="cursor-pointer">
                Choose File
              </label>
            </Button>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <Badge variant="outline">.sol</Badge>
              <Badge variant="outline">.py</Badge>
              <Badge variant="outline">.rs</Badge>
              <Badge variant="outline">.js</Badge>
              <Badge variant="outline">.ts</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
