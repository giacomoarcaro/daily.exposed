import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import prisma from '@/lib/prisma';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

async function getArticle(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!article || article.isDraft) {
    return null;
  }

  return article;
}

async function getRelatedArticles(category: string, currentSlug: string) {
  return prisma.article.findMany({
    where: {
      category,
      slug: { not: currentSlug },
      isDraft: false,
    },
    select: {
      title: true,
      slug: true,
      publishedAt: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 3,
  });
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const article = await getArticle(params.slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: article.title,
    description: article.summary || article.content.slice(0, 160),
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.category, params.slug);

  return (
    <article className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>By {article.author.name}</span>
          <span>•</span>
          <time dateTime={article.publishedAt.toISOString()}>
            {format(article.publishedAt, 'MMMM d, yyyy')}
          </time>
          <span>•</span>
          <span>{article.category}</span>
        </div>
      </header>

      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full aspect-video object-cover rounded-lg mb-8"
        />
      )}

      <div className="prose prose-lg max-w-none dark:prose-invert">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>

      {article.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-muted rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {relatedArticles.length > 0 && (
        <aside className="mt-16">
          <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((related) => (
              <a
                key={related.slug}
                href={`/articles/${related.slug}`}
                className="block group"
              >
                <h3 className="font-medium group-hover:text-primary transition-colors">
                  {related.title}
                </h3>
                <time
                  dateTime={related.publishedAt.toISOString()}
                  className="text-sm text-muted-foreground"
                >
                  {format(related.publishedAt, 'MMMM d, yyyy')}
                </time>
              </a>
            ))}
          </div>
        </aside>
      )}
    </article>
  );
} 