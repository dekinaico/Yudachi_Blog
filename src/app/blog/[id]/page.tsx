import { client } from "@/libs/client";
import Link from "next/link";

export const revalidate = 60;

type Props = {
  params: Promise<{ id: string }>;
};

async function getBlog(id: string) {
  const data = await client.get({
    endpoint: "blog",
    contentId: id,
  });
  return data;
}

export default async function BlogPage({ params }: Props) {
  const { id } = await params;
  const blog = await getBlog(id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* パンくず */}
      <nav className="text-sm text-[var(--color-text-light)] mb-4">
        <Link href="/" className="hover:text-[var(--color-primary)]">記事一覧</Link>
        <span className="mx-2">›</span>
        <span className="text-[var(--color-text)]">{blog.title}</span>
      </nav>

      {/* 記事カード */}
      <article className="bg-white rounded border border-[var(--color-border)]">
        {/* ヘッダー */}
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h1 className="text-xl font-bold text-[var(--color-text)] mb-2">
            {blog.title}
          </h1>
          <time className="text-sm text-[var(--color-text-light)]">
            {new Date(blog.publishedAt).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>

        {/* 本文 */}
        <div className="px-6 py-6">
          <div
            className="prose-simple"
            dangerouslySetInnerHTML={{ __html: blog.body }}
          />
        </div>
      </article>

      {/* 戻るリンク */}
      <div className="mt-6">
        <Link
          href="/"
          className="text-sm text-[var(--color-primary)] hover:underline"
        >
          ← 記事一覧に戻る
        </Link>
      </div>
    </div>
  );
}
