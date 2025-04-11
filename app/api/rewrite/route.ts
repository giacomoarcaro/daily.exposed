import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { rewriteArticle } from '@/lib/openai';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return new NextResponse('Content is required', { status: 400 });
    }

    const rewrittenContent = await rewriteArticle(content);
    return NextResponse.json({ content: rewrittenContent });
  } catch (error) {
    console.error('Error rewriting article:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 