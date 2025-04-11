import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { scrapeArticle } from '@/lib/scraper';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { url } = await request.json();
    if (!url) {
      return new NextResponse('URL is required', { status: 400 });
    }

    const article = await scrapeArticle(url);
    return NextResponse.json(article);
  } catch (error) {
    console.error('Error in scrape route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 