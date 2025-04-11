import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { prisma } from '../../../lib/prisma';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

async function getArticle(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { author: true },
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
    orderBy: { publishedAt: 'desc' },
    take: 3,
    include: { author: true },
  });
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const article = await getArticle(params.slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.summary,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const relatedArticles = await getRelatedArticles(article.category, article.slug);

  return (
    <article className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">{article.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
        <div className="mb-8 aspect-video w-full overflow-hidden rounded-lg">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg mx-auto dark:prose-invert">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>

      {article.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-3 py-1 text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {relatedArticles.length > 0 && (
        <aside className="mt-12 border-t pt-8">
          <h2 className="mb-4 text-2xl font-semibold">Related Articles</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedArticles.map((article) => (
              <a
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group rounded-lg border p-4 hover:bg-muted/50"
              >
                <h3 className="font-medium group-hover:text-primary">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {format(article.publishedAt, 'MMMM d, yyyy')}
                </p>
              </a>
            ))}
          </div>
        </aside>
      )}
    </article>
  );
} 