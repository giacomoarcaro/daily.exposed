import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { MarkdownEditor } from '@/components/MarkdownEditor';

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()),
  imageUrl: z.string().optional(),
  isDraft: z.boolean().default(true),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface ArticleFormProps {
  onSubmit: (data: ArticleFormData) => Promise<void>;
  initialData?: Partial<ArticleFormData>;
}

export function ArticleForm({ onSubmit, initialData }: ArticleFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [sourceUrl, setSourceUrl] = useState('');

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      category: initialData?.category || 'MLM',
      tags: initialData?.tags || [],
      imageUrl: initialData?.imageUrl,
      isDraft: initialData?.isDraft ?? true,
    },
  });

  const handleScrape = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: sourceUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to scrape article');
      }

      const data = await response.json();
      form.reset(data);
      toast({
        title: 'Article scraped successfully',
        description: 'The content has been imported and can now be edited.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to scrape article. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: ArticleFormData) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
      toast({
        title: 'Success',
        description: 'Article saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save article. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
      <div className="flex items-center gap-4">
        <Input
          placeholder="BehindMLM URL"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
        />
        <Button
          type="button"
          onClick={handleScrape}
          disabled={isLoading || !sourceUrl}
        >
          Scrape
        </Button>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Title"
          {...form.register('title')}
          error={form.formState.errors.title?.message}
        />

        <Select
          options={[
            { value: 'MLM', label: 'MLM' },
            { value: 'Crypto', label: 'Crypto' },
            { value: 'Scam', label: 'Scam' },
            { value: 'AI', label: 'AI' },
          ]}
          {...form.register('category')}
          error={form.formState.errors.category?.message}
        />

        <div className="h-[500px]">
          <MarkdownEditor
            value={form.watch('content')}
            onChange={(value) => form.setValue('content', value)}
          />
        </div>

        <Input
          placeholder="Image URL"
          {...form.register('imageUrl')}
        />

        <div className="flex items-center space-x-2">
          <Switch
            checked={form.watch('isDraft')}
            onCheckedChange={(checked) => form.setValue('isDraft', checked)}
          />
          <span>Draft</span>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Saving...' : 'Save Article'}
        </Button>
      </div>
    </form>
  );
} 