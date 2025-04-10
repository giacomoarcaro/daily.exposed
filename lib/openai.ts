import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const REWRITE_PROMPT = `You are an investigative journalist writing for an independent digital news outlet. 
Rewrite the following article completely in your own words. Do not copy any sentence directly. 
Keep the same structure, facts, and tone, but never reference the original source. 
Make it sound modern, professional, and journalistic.

Article to rewrite:`;

const IMAGE_PROMPT = `Create a stylized editorial illustration that visually represents the following article topic.
The style should be similar to magazine visuals, clean and symbolic.

Article topic:`;

export async function rewriteArticle(content: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: REWRITE_PROMPT,
        },
        {
          role: "user",
          content: content,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('Error rewriting article:', error);
    throw new Error('Failed to rewrite article');
  }
}

export async function generateImage(topic: string): Promise<string> {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${IMAGE_PROMPT}\n${topic}`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid",
    });

    return response.data[0].url || '';
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image');
  }
} 