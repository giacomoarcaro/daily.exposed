import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [tab, setTab] = useState<'write' | 'preview'>('write');

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as 'write' | 'preview')}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="write">Write</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="write" className="mt-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[400px] font-mono"
          placeholder="Write your article in Markdown..."
        />
      </TabsContent>
      <TabsContent value="preview" className="mt-4">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{value}</ReactMarkdown>
        </div>
      </TabsContent>
    </Tabs>
  );
} 