import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Create a stylized editorial illustration that represents ${prompt}. The image should feel like a modern magazine article visual, symbolic and clean.`,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    });

    return response.data[0].url || '';
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image');
  }
}

export async function rewriteArticle(content: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an investigative journalist writing for an independent digital outlet. Rewrite the following article completely in your own words. Preserve the facts and structure but do not copy any sentence or mention the original source. Make it sound natural, professional, and journalistic.',
        },
        {
          role: 'user',
          content,
        },
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('Error rewriting article:', error);
    throw new Error('Failed to rewrite article');
  }
} 