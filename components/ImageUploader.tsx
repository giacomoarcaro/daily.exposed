'use client';

import * as React from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  onGenerate: () => Promise<void>
  isGenerating?: boolean
}

export function ImageUploader({
  value,
  onChange,
  onGenerate,
  isGenerating = false,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = React.useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      onChange(data.url)
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image">Article Image</Label>
        <div className="flex gap-2">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={onGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate with DALL·E"}
          </Button>
        </div>
      </div>

      {value && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <img
            src={value}
            alt="Article cover"
            className="object-cover"
          />
        </div>
      )}
    </div>
  )
} 