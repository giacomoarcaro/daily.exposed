'use client';

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { MarkdownEditor } from "./MarkdownEditor"
import { ImageUploader } from "./ImageUploader"
import { slugify } from "../lib/utils"
import { useState } from "react"

export function ArticleForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = React.useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    image: "",
    category: "",
    tags: "",
    status: "draft"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
        }),
      })

      if (!response.ok) throw new Error("Failed to save article")

      const data = await response.json()
      router.push(`/articles/${data.slug}`)
    } catch (error) {
      console.error("Error saving article:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleScrape = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formData.sourceUrl }),
      })

      if (!response.ok) throw new Error("Failed to scrape article")

      const data = await response.json()
      setFormData((prev) => ({
        ...prev,
        title: data.title,
        content: data.content,
        summary: data.summary,
      }))
    } catch (error) {
      console.error("Error scraping article:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRewrite = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: formData.content }),
      })

      if (!response.ok) throw new Error("Failed to rewrite article")

      const data = await response.json()
      setFormData((prev) => ({
        ...prev,
        content: data.content,
      }))
    } catch (error) {
      console.error("Error rewriting article:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true)
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Create a stylized editorial illustration that represents ${formData.title}. The image should feel like a modern magazine article visual, symbolic and clean.`,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate image")

      const data = await response.json()
      setFormData((prev) => ({
        ...prev,
        imageUrl: data.imageUrl,
      }))
    } catch (error) {
      console.error("Error generating image:", error)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={10}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          name="image"
          type="url"
          value={formData.image}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          <option value="news">News</option>
          <option value="investigation">Investigation</option>
          <option value="scam">Scam</option>
          <option value="technology">Technology</option>
          <option value="politics">Politics</option>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="e.g. technology, scam, warning"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </Select>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleScrape}
          disabled={isLoading}
        >
          Scrape URL
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleRewrite}
          disabled={isLoading}
        >
          Rewrite with AI
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Article"}
        </Button>
      </div>
    </form>
  )
} 