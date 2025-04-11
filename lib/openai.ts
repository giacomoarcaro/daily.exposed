import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateImage(prompt: string): Promise<string> {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    style: 'natural',
  });

  const imageUrl = response.data[0].url;
  if (!imageUrl) {
    throw new Error('Failed to generate image');
  }

  return imageUrl;
}

export async function rewriteArticle(content: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a professional investigative journalist. Your task is to rewrite the provided article while:
1. Maintaining the same meaning and facts
2. Improving clarity and readability
3. Using a more engaging and professional tone
4. Adding relevant context where needed
5. Ensuring proper journalistic style and formatting`,
      },
      {
        role: 'user',
        content,
      },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  return response.choices[0].message.content || content;
} 