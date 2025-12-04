import { client } from "@/libs/client";
import Link from "next/link";

export const revalidate = 60;

type Blog = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
};

async function getBlogs() {
  const data = await client.get({ endpoint: "blog" });
  return data.contents;
}

export default async function Home() {
  const blogs = await getBlogs();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-[var(--color-text)] mb-6">記事一覧</h1>
      
      {blogs.length === 0 ? (
        <p className="text-[var(--color-text-light)]">記事がありません</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blogs.map((blog: Blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.id}`}
              className="block bg-white rounded border border-[var(--color-border)] p-4 hover:border-[var(--color-primary)] transition-colors"
            >
              <h2 className="font-medium text-[var(--color-text)] mb-2 line-clamp-2">
                {blog.title}
              </h2>
              <time className="text-sm text-[var(--color-text-light)]">
                {new Date(blog.publishedAt).toLocaleDateString('ja-JP')}
              </time>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
