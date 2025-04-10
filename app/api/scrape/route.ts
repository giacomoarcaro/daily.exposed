import { NextResponse } from 'next/server';
import { scrapeBehindMLM } from '@/lib/scraper';
import { rewriteArticle, generateImage } from '@/lib/openai';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // 1. Scrape the article
    const scrapedArticle = await scrapeBehindMLM(url);

    // 2. Check if article already exists
    const existingArticle = await prisma.article.findFirst({
      where: {
        sourceUrl: url,
      },
    });

    if (existingArticle) {
      return NextResponse.json(
        { error: 'Article already exists' },
        { status: 409 }
      );
    }

    // 3. Rewrite the content
    const rewrittenContent = await rewriteArticle(scrapedArticle.content);

    // 4. Generate an image
    const imageUrl = await generateImage(scrapedArticle.title);

    // 5. Create the article
    const article = await prisma.article.create({
      data: {
        title: scrapedArticle.title,
        slug: scrapedArticle.title.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .trim(),
        content: rewrittenContent,
        imageUrl,
        category: scrapedArticle.category,
        tags: scrapedArticle.tags,
        sourceUrl: url,
        authorId: '1', // Default admin user
        isDraft: false,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error in scrape route:', error);
    return NextResponse.json(
      { error: 'Failed to process article' },
      { status: 500 }
    );
  }
} 