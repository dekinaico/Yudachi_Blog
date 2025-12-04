import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Yudachi Blog",
  description: "技術ブログ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-[family-name:var(--font-noto)]`}>
        {/* ヘッダー */}
        <header className="bg-white border-b border-[var(--color-border)]">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold text-[var(--color-primary)]">
              Yudachi Blog
            </Link>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* フッター */}
        <footer className="bg-white border-t border-[var(--color-border)] mt-12">
          <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-[var(--color-text-light)]">
            © {new Date().getFullYear()} Yudachi Blog
          </div>
        </footer>
      </body>
    </html>
  );
}
