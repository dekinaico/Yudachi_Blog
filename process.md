承知しました。これまでのトラブルシューティング（HTTPSへの切り替えや、Upstream設定など）も含めた、**完全版の実装ログ**を作成しました。

これを保存しておけば、次回また同じ構成で作る時に「手順書」としてそのまま使えます。

-----

# 📘 ヘッドレスCMS構築ログ (Next.js + microCMS + Vercel)

**目標:** モダンな構成でブログサイトを構築し、ISR（自動更新）対応で完全無料デプロイを行う。

## 🏗 技術スタック

  * **CMS:** microCMS (コンテンツ管理)
  * **Frontend:** Next.js App Router (Reactフレームワーク)
  * **Hosting:** Vercel (サーバー)
  * **Version Control:** GitHub

-----

## 1\. microCMS のセットアップ

1.  **サービス作成:** 任意のIDでサービスを作成。
2.  **API作成:**
      * API名: `ブログ`
      * エンドポイント: `blog`
3.  **APIスキーマ定義:**
      * `title`: テキストフィールド
      * `body`: リッチエディタ
4.  **APIキーの確認:**
      * 管理画面「API設定」または「権限管理」から `サービスドメイン` と `APIキー` を取得。

-----

## 2\. 開発環境の構築

ターミナルで以下のコマンドを実行。

```bash
# プロジェクト作成 (TypeScript, Tailwind, App Router等 すべてYes推奨)
npx create-next-app@latest my-blog

# ディレクトリ移動
cd my-blog

# SDKのインストール
npm install microcms-js-sdk
```

-----

## 3\. コーディング（API連携）

### 3-1. 環境変数の設定

プロジェクト直下（`package.json`と同じ階層）に `.env.local` を作成。
**注意:** このファイルはGitHubにはアップロードしない（`.gitignore`対象）。

```env
MICROCMS_SERVICE_DOMAIN=あなたのサービスID
MICROCMS_API_KEY=あなたのAPIキー
```

### 3-2. microCMSクライアント作成

`src/libs/client.ts` を作成。

```typescript
import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN || '',
  apiKey: process.env.MICROCMS_API_KEY || '',
});
```

### 3-3. 記事一覧ページ (ISR対応)

`src/app/page.tsx`

```tsx
import { client } from "@/libs/client";
import Link from "next/link";

// ISR設定: 60秒ごとにサーバー側で再生成
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

### 3-4. 記事詳細ページ (動的ルーティング)

`src/app/blog/[id]/page.tsx`

```tsx
import { client } from "@/libs/client";

// 詳細ページもISR設定
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
      {/* HTMLをそのまま表示するための記述 */}
      <div dangerouslySetInnerHTML={{ __html: blog.body }} />
    </main>
  );
}
```

-----

## 4\. GitHub へのプッシュ

### リポジトリの初期化とリモート設定

HTTPS接続を使用する場合（アカウント切り替えが容易なため推奨）。

```bash
git add .
git commit -m "Initial commit"

# リモートリポジトリを追加
git remote add origin https://github.com/ユーザー名/リポジトリ名.git

# ※もしSSHエラーが出た場合はURLをHTTPSに上書き
# git remote set-url origin https://github.com/ユーザー名/リポジトリ名.git

# 初回プッシュ（upstream設定を含む）
git push --set-upstream origin main
```

-----

## 5\. Vercel でのデプロイ

1.  **Project Import:** GitHubリポジトリを選択してインポート。
2.  **Environment Variables (重要):**
    以下の2つを設定しないとビルドエラーになる。
      * `MICROCMS_SERVICE_DOMAIN`
      * `MICROCMS_API_KEY`
3.  **Deploy:** デプロイ実行。

### ISR（自動更新）の確認

1.  microCMSで記事を更新。
2.  設定した時間（60秒）待機。
3.  本番URLをリロードして反映を確認。

-----

## ✅ 現在のステータス

  * [x] サイトの表示・遷移 OK
  * [x] 本番環境への公開 OK
  * [x] 記事更新の自動反映 (ISR) OK

-----

これでここまでの工程が完璧にドキュメント化されました。
このメモをご自身のNotionやメモ帳に保存しておくと良いでしょう。

さて、この完璧な土台を使って、次はどうしますか？

1.  **見た目をプロっぽく整える**（Tailwind CSSの実践）
2.  **今回はここで完了とし、卒業クイズを受ける**

どちらに進むか教えてください！