import { client } from "@/libs/client";
import Link from "next/link";

// ISR設定
export const revalidate = 60;

type Blog = {
  id: string;
  title: string;
  body: string;
  publishedAt: string; // 日付も使うので定義に追加
};

async function getBlogs() {
  const data = await client.get({ endpoint: "blog" });
  return data.contents;
}

export default async function Home() {
  const blogs = await getBlogs();

  return (
    // 全体の中央寄せと余白
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">MicroCMS Blog</h1>
      
      {/* グリッドレイアウト: スマホで1列、タブレット以上で3列 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog: Blog) => (
          <li key={blog.id} className="list-none">
            <Link 
              href={`/blog/${blog.id}`} 
              className="block p-6 border rounded-lg shadow-sm hover:shadow-lg hover:border-blue-500 transition duration-300 bg-white"
            >
              <h2 className="text-xl font-bold mb-2 line-clamp-2">{blog.title}</h2>
              <p className="text-gray-500 text-sm">
                {new Date(blog.publishedAt).toLocaleDateString()}
              </p>
            </Link>
          </li>
        ))}
      </div>
    </main>
  );
}