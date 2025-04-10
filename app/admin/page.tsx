import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ArticleForm } from '@/components/ArticleForm';
import prisma from '@/lib/prisma';

export default async function AdminPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/api/auth/signin');
  }

  const articles = await prisma.article.findMany({
    orderBy: {
      publishedAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      publishedAt: true,
      isDraft: true,
    },
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Create New Article</h2>
          <ArticleForm
            onSubmit={async (data) => {
              'use server';
              await prisma.article.create({
                data: {
                  ...data,
                  authorId: session.user.id,
                },
              });
            }}
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Articles</h2>
          <div className="space-y-4">
            {articles.map((article) => (
              <div
                key={article.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{article.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      article.isDraft
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {article.isDraft ? 'Draft' : 'Published'}
                  </span>
                  <a
                    href={`/admin/articles/${article.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 