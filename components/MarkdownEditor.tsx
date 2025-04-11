'use client';

import * as React from "react"
import ReactMarkdown from "react-markdown"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Textarea } from "./ui/textarea"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your article in Markdown...",
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = React.useState("write")

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="mt-2">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[500px] font-mono"
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-2">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{value}</ReactMarkdown>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 