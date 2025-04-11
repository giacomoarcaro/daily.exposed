import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'admin') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { title, content, summary, category, imageUrl, isDraft, userId } = await request.json();

    if (!title || !content || !summary || !category || !userId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug: slugify(title),
        content,
        summary,
        category,
        imageUrl,
        isDraft,
        authorId: userId,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'admin') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { id, title, content, summary, category, imageUrl, isDraft, userId } = await request.json();

    if (!id || !title || !content || !summary || !category || !userId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        slug: slugify(title),
        content,
        summary,
        category,
        imageUrl,
        isDraft,
        authorId: userId,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'admin') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: {},
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.article.count(),
    ]);

    return NextResponse.json({
      articles,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 