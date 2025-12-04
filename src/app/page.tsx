import { client } from "@/libs/client"; // さっき作った接続部品を読み込む
import Link from "next/link"; //
export const revalidate = 60;

// 記事の型定義（レシピの設計図）
// TypeScriptなので「どんなデータが来るか」を教えてあげます
type Blog = {
  id: string;
  title: string;
  body: string;
};

// データを取得する関数
async function getBlogs() {
  const data = await client.get({
    endpoint: "blog", // microCMSで決めたエンドポイント名
  });
  return data.contents;
}

// 画面を作るコンポーネント（メインの関数）
export default async function Home() {
  const blogs = await getBlogs(); // データを取ってくる

  return (
    <main style={{ padding: "20px" }}>
      <h1>ブログ一覧</h1>
      <ul>
        {/* 記事の数だけ繰り返し表示する（map関数） */}
        {blogs.map((blog: Blog) => (
          <li key={blog.id}>
            <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}