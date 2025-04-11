import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ArticleForm } from '../../components/ArticleForm'

export default function AdminPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">🛠️ Daily Exposed Admin</h1>
      <ArticleForm />
    </main>
  );
} 