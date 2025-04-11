'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUploader({
  value,
  onChange,
  className = '',
}: ImageUploaderProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async () => {
    if (!prompt) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      onChange(data.imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label
          htmlFor="image-prompt"
          className="block text-sm font-medium text-gray-700"
        >
          Generate Image with DALL·E
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            id="image-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="block w-full flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Describe the image you want to generate..."
          />
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      {value && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={value}
            alt="Generated image"
            fill
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
} 