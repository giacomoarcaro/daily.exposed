'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MarkdownEditor } from '@/components/MarkdownEditor';

interface ArticleRewriterProps {
  initialContent?: string;
  onContentChange: (content: string) => void;
  className?: string;
}

export function ArticleRewriter({
  initialContent = '',
  onContentChange,
  className = '',
}: ArticleRewriterProps) {
  const [content, setContent] = useState(initialContent);
  const [isRewriting, setIsRewriting] = useState(false);

  const handleRewrite = async () => {
    if (!content) return;

    setIsRewriting(true);
    try {
      const response = await fetch('/api/rewrite-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to rewrite article');
      }

      const data = await response.json();
      setContent(data.content);
      onContentChange(data.content);
    } catch (error) {
      console.error('Error rewriting article:', error);
      alert('Failed to rewrite article. Please try again.');
    } finally {
      setIsRewriting(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-end">
        <Button
          onClick={handleRewrite}
          disabled={isRewriting || !content}
          className="w-full sm:w-auto"
        >
          {isRewriting ? 'Rewriting...' : 'Rewrite with AI'}
        </Button>
      </div>

      <MarkdownEditor
        value={content}
        onChange={(value) => {
          setContent(value);
          onContentChange(value);
        }}
      />
    </div>
  );
} 