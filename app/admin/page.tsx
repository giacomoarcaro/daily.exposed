import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ArticleForm } from '@/components/ArticleForm';
import { prisma } from '@/lib/prisma';
import AdminGuard from '@/components/AdminGuard';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      publishedAt: true,
      isDraft: true,
    },
  });

  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Create New Article</h2>
            <ArticleForm userId={session.user.id} />
          </div>
          <div>
            <h2 className="mb-4 text-xl font-semibold">Recent Articles</h2>
            <div className="space-y-4">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="rounded-lg border p-4 shadow-sm"
                >
                  <h3 className="font-medium">{article.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(article.publishedAt).toLocaleDateString()}
                    {article.isDraft && ' (Draft)'}
                  </p>
                  <a
                    href={`/admin/articles/${article.id}`}
                    className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
} 