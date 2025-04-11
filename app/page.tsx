import Link from 'next/link';
import { format } from 'date-fns';
import { prisma } from '../lib/prisma';

async function getArticles() {
  return prisma.article.findMany({
    where: { isDraft: false },
    orderBy: { publishedAt: 'desc' },
    take: 10,
    include: { author: true },
  });
}

async function getWarningOfTheMonth() {
  return prisma.article.findFirst({
    where: {
      category: 'Scam',
      isDraft: false,
    },
    orderBy: { publishedAt: 'desc' },
    include: { author: true },
  });
}

export default async function HomePage() {
  const [articles, warningOfTheMonth] = await Promise.all([
    getArticles(),
    getWarningOfTheMonth(),
  ]);

  const [heroArticle, ...otherArticles] = articles;

  return (
    <div className="container mx-auto py-8">
      {heroArticle && (
        <section className="mb-12">
          <Link
            href={`/articles/${heroArticle.slug}`}
            className="group block overflow-hidden rounded-lg border"
          >
            {heroArticle.imageUrl && (
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={heroArticle.imageUrl}
                  alt={heroArticle.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-6">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <span>{heroArticle.category}</span>
                <span>•</span>
                <time dateTime={heroArticle.publishedAt.toISOString()}>
                  {format(heroArticle.publishedAt, 'MMMM d, yyyy')}
                </time>
              </div>
              <h1 className="mb-4 text-3xl font-bold group-hover:text-primary">
                {heroArticle.title}
              </h1>
              {heroArticle.summary && (
                <p className="text-lg text-muted-foreground">
                  {heroArticle.summary}
                </p>
              )}
            </div>
          </Link>
        </section>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-6 text-2xl font-bold">Latest Articles</h2>
          <div className="space-y-8">
            {otherArticles.map((article) => (
              <article
                key={article.id}
                className="group rounded-lg border p-6 hover:bg-muted/50"
              >
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{article.category}</span>
                  <span>•</span>
                  <time dateTime={article.publishedAt.toISOString()}>
                    {format(article.publishedAt, 'MMMM d, yyyy')}
                  </time>
                </div>
                <Link href={`/articles/${article.slug}`}>
                  <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">
                    {article.title}
                  </h3>
                </Link>
                {article.summary && (
                  <p className="text-muted-foreground">{article.summary}</p>
                )}
              </article>
            ))}
          </div>
        </div>

        <aside>
          {warningOfTheMonth && (
            <div className="rounded-lg border bg-destructive/5 p-6">
              <h2 className="mb-4 text-xl font-bold text-destructive">
                Warning of the Month
              </h2>
              <Link
                href={`/articles/${warningOfTheMonth.slug}`}
                className="group block"
              >
                <h3 className="mb-2 font-semibold group-hover:text-primary">
                  {warningOfTheMonth.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {format(warningOfTheMonth.publishedAt, 'MMMM d, yyyy')}
                </p>
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
} 