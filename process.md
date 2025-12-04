もちろんです！これまでの流れを整理すると、立派な技術ドキュメントになりますね。
復習や今後の参照用に使いやすいよう、Markdown形式でまとめました。

-----

# 🚀 Next.js + microCMS + Vercel 構築ロードマップ

モダンなヘッドレスCMS構成でのWebサイト制作、デプロイ、そしてISR（自動更新）の実装までの全手順まとめです。

## 🏗 全体構成（アーキテクチャ）

  * **CMS (データ管理):** microCMS
  * **Frontend (表示):** Next.js (App Router / React)
  * **Hosting (公開):** Vercel
  * **Version Control (保存):** GitHub

-----

## 1\. microCMS の準備（データ元）

1.  **サービス作成:** サービスIDなどを設定。
2.  **API作成:**
      * エンドポイント名: `blog`
      * APIスキーマ: `title` (テキスト), `body` (リッチエディタ)
3.  **コンテンツ登録:** 記事を書いて「公開」する。
4.  **キー取得:** 「API設定」から `APIキー` と `サービスドメイン` を控える。

-----

## 2\. Next.js プロジェクトの作成

ターミナルで実行。

```bash
# プロジェクト作成（設定は全てYes推奨）
npx create-next-app@latest my-blog

# フォルダへ移動
cd my-blog

# SDKのインストール
npm install microcms-js-sdk
```

-----

## 3\. 接続設定（API連携）

### 環境変数の設定

プロジェクト直下に `.env.local` を作成（GitHubには上げない！）。

```env
MICROCMS_SERVICE_DOMAIN=あなたのサービスID
MICROCMS_API_KEY=あなたのAPIキー
```

### クライアント作成

`src/libs/client.ts` を作成。

```typescript
import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN || '',
  apiKey: process.env.MICROCMS_API_KEY || '',
});
```

-----

## 4\. ページ実装（コーディング）

### トップページ（記事一覧）

`src/app/page.tsx`

```tsx
import { client } from "@/libs/client";
import Link from "next/link";

// ISR設定（60秒ごとに更新）
export const revalidate = 60;

type Blog = {
  id: string;
  title: string;
  body: string;
};

async function getBlogs() {
  const data = await client.get({ endpoint: "blog" });
  return data.contents;
}

export default async function Home() {
  const blogs = await getBlogs();

  return (
    <main style={{ padding: "20px" }}>
      <h1>ブログ一覧</h1>
      <ul>
        {blogs.map((blog: Blog) => (
          <li key={blog.id}>
            <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

### 記事詳細ページ（動的ルーティング）

`src/app/blog/[id]/page.tsx`

```tsx
import { client } from "@/libs/client";

// ISR設定
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
    <main style={{ padding: "20px" }}>
      <h1>{blog.title}</h1>
      <p style={{ color: "gray" }}>{blog.publishedAt}</p>
      <div dangerouslySetInnerHTML={{ __html: blog.body }} />
    </main>
  );
}
```

-----

## 5\. デプロイ（Web公開）

### GitHub へ Push

```bash
git add .
git commit -m "Initial commit"

# リモートリポジトリの登録（HTTPS推奨）
git remote add origin https://github.com/ユーザー名/リポジトリ名.git

git push -u origin main
```

### Vercel 設定

1.  GitHubリポジトリをインポート。
2.  **Environment Variables（環境変数）** を設定（超重要）。
      * `MICROCMS_SERVICE_DOMAIN`
      * `MICROCMS_API_KEY`
3.  **Deploy** ボタンをクリック。

-----

## ✅ 達成したこと

  * [x] ヘッドレスCMSの概念理解
  * [x] Next.js (App Router) の基礎構築
  * [x] APIを通じたデータの取得
  * [x] 動的ルーティング (`[id]`) の実装
  * [x] Vercelへの本番デプロイ
  * [x] ISR（インクリメンタル・静的・再生成）による自動更新設定

-----

こちらが現在地です！
非常に順調に進んでいます。もしこのメモで不明な点があれば、いつでも聞いてくださいね。

**ISRの動作確認（60秒待ってリロード）は上手くいきましたか？**
確認できたら、このトピックの総仕上げに入りましょう！