import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { rewriteArticle } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { content } = await request.json();
    if (!content) {
      return new NextResponse('Content is required', { status: 400 });
    }

    const rewrittenContent = await rewriteArticle(content);
    return NextResponse.json({ content: rewrittenContent });
  } catch (error) {
    console.error('Error in rewrite route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 