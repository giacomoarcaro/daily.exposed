import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { scrapeArticle } from '@/lib/scraper';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return new NextResponse('URL is required', { status: 400 });
    }

    const article = await scrapeArticle(url);
    return NextResponse.json(article);
  } catch (error) {
    console.error('Error scraping article:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 