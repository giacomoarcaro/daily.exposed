'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArticleRewriter } from '@/components/ArticleRewriter';
import { ImageUploader } from '@/components/ImageUploader';

interface ArticleFormProps {
  initialData?: {
    id?: string;
    title?: string;
    content?: string;
    summary?: string;
    category?: string;
    imageUrl?: string;
    isDraft?: boolean;
  };
  userId: string;
}

export function ArticleForm({ initialData, userId }: ArticleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    summary: initialData?.summary || '',
    category: initialData?.category || 'News',
    imageUrl: initialData?.imageUrl || '',
    isDraft: initialData?.isDraft ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/articles', {
        method: initialData?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: initialData?.id,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save article');
      }

      const data = await response.json();
      router.push(`/admin/articles/${data.id}`);
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Failed to save article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="summary">Summary</Label>
          <Input
            id="summary"
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="News">News</SelectItem>
              <SelectItem value="Investigation">Investigation</SelectItem>
              <SelectItem value="Scam">Scam</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Politics">Politics</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Image</Label>
          <ImageUploader
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          />
        </div>

        <div>
          <Label>Content</Label>
          <ArticleRewriter
            initialContent={formData.content}
            onContentChange={(content) => setFormData({ ...formData, content })}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setFormData({ ...formData, isDraft: !formData.isDraft })}
        >
          {formData.isDraft ? 'Mark as Ready' : 'Save as Draft'}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Article'}
        </Button>
      </div>
    </form>
  );
} 