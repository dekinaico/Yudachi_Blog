import { client } from "@/libs/client";

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
    <main className="max-w-3xl mx-auto p-6">
      {/* タイトル周り */}
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-500 mb-8 border-b pb-4">
        {new Date(blog.publishedAt).toLocaleDateString()}
      </p>

      {/* 本文エリア */}
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.body }} 
      />
    </main>
  );
}