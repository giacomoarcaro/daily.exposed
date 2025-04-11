import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { generateImage } from '@/lib/openai';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'admin') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return new NextResponse('Prompt is required', { status: 400 });
    }

    const imageUrl = await generateImage(prompt);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 