import { client } from "@/libs/client";
export const revalidate = 60;

// URLのパラメータを受け取る型
// params は Promise (非同期) で渡ってくる仕様になりました（Next.js 15以降）
// ※ Next.js 14以下の場合は書き方が少し違いますが、一旦最新の書き方で案内します
type Props = {
  params: Promise<{ id: string }>;
};

// 1つの記事だけ取得する関数
async function getBlog(id: string) {
  const data = await client.get({
    endpoint: "blog",
    contentId: id, // ここでIDを指定して絞り込む
  });
  return data;
}

export default async function BlogPage({ params }: Props) {
  // params から id を取り出す（非同期処理）
  const { id } = await params;
  
  const blog = await getBlog(id);

  return (
    <main style={{ padding: "20px" }}>
      <h1>{blog.title}</h1>
      <p style={{ color: "gray" }}>{blog.publishedAt}</p>
      {/* リッチエディタのHTMLを表示する特別な書き方 */}
      <div dangerouslySetInnerHTML={{ __html: blog.body }} />
    </main>
  );
}