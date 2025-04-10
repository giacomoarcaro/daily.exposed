import Link from 'next/link';
import { format } from 'date-fns';
import prisma from '@/lib/prisma';

async function getArticles() {
  return prisma.article.findMany({
    where: {
      isDraft: false,
    },
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
    take: 10,
  });
}

async function getWarningOfTheMonth() {
  return prisma.article.findFirst({
    where: {
      isDraft: false,
      category: 'Scam',
    },
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
  });
}

export default async function HomePage() {
  const [articles, warning] = await Promise.all([
    getArticles(),
    getWarningOfTheMonth(),
  ]);

  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  return (
    <div className="container mx-auto py-8">
      {/* Hero Article */}
      {featuredArticle && (
        <div className="mb-16">
          <Link href={`/articles/${featuredArticle.slug}`}>
            <div className="group relative">
              {featuredArticle.imageUrl && (
                <img
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.title}
                  className="w-full aspect-[2/1] object-cover rounded-lg"
                />
              )}
              <div className="mt-4">
                <h1 className="text-4xl font-bold group-hover:text-primary transition-colors">
                  {featuredArticle.title}
                </h1>
                <div className="mt-2 flex items-center gap-4 text-muted-foreground">
                  <span>By {featuredArticle.author.name}</span>
                  <span>•</span>
                  <time dateTime={featuredArticle.publishedAt.toISOString()}>
                    {format(featuredArticle.publishedAt, 'MMMM d, yyyy')}
                  </time>
                  <span>•</span>
                  <span>{featuredArticle.category}</span>
                </div>
                {featuredArticle.summary && (
                  <p className="mt-4 text-lg text-muted-foreground">
                    {featuredArticle.summary}
                  </p>
                )}
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Warning of the Month */}
      {warning && (
        <div className="mb-16 bg-destructive/10 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-destructive mb-4">
            ⚠️ Warning of the Month
          </h2>
          <Link href={`/articles/${warning.slug}`}>
            <div className="group">
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {warning.title}
              </h3>
              {warning.summary && (
                <p className="mt-2 text-muted-foreground">{warning.summary}</p>
              )}
            </div>
          </Link>
        </div>
      )}

      {/* Recent Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {otherArticles.map((article) => (
          <Link key={article.slug} href={`/articles/${article.slug}`}>
            <article className="group">
              {article.imageUrl && (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full aspect-video object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <time dateTime={article.publishedAt.toISOString()}>
                  {format(article.publishedAt, 'MMMM d, yyyy')}
                </time>
                <span>•</span>
                <span>{article.category}</span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
} 