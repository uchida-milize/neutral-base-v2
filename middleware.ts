/**
 * Basic Authentication middleware
 *
 * neutral-base はプレビュー用のサイト (顧客レビュー Space) なので、
 * 公開検索エンジン等にインデックスされたくない・URL を知っている人だけに
 * 見せたい。Vercel Hobby プランでは Deployment Protection (Pro 限定機能)
 * が使えないため、Next.js Middleware で Basic Auth を被せる。
 *
 * 認証情報の設定 (Vercel 側):
 *   1. https://vercel.com/ → neutral-base プロジェクト
 *   2. Settings → Environment Variables
 *   3. 以下を追加 (Production / Preview / Development すべてにチェック)
 *      - BASIC_AUTH_USER  例: "client"
 *      - BASIC_AUTH_PASS  例: 任意の強めの文字列
 *   4. Save → 自動で再デプロイされる (もしくは何か commit して push)
 *
 * ローカル開発 (`pnpm dev`) では認証をスキップするので、毎回ダイアログが出ない。
 *
 * NOTE: next/server を import せず純粋な Web 標準 API を使用。
 * これにより Next.js (x-middleware-next ヘッダーで pass-through を判定) と
 * Vercel 静的デプロイ (Storybook 等) の両方で同じファイルが動作する。
 * __dirname 等の Node.js グローバルへの依存を排除する目的もある。
 */

const REALM = "neutral-base preview";

// 認証バイパスするパス (Next.js 内部の静的アセット類)
// matcher 側でも除外しているが、二重防御のため。
const PUBLIC_PATHS = [
  "/_next/",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
];

/** pass-through レスポンス。NextResponse.next() と等価。 */
function next(): Response {
  return new Response(null, { headers: { "x-middleware-next": "1" } });
}

export function middleware(_req: Request) {
  // neutral-base-v2: 認証なしで全公開
  return next();
}

/**
 * matcher: middleware を発火させる URL パターン
 *
 * 除外:
 *   - _next/static/*  — Next.js のビルド成果物 (JS/CSS/フォント)
 *   - _next/image/*   — next/image の最適化済み画像
 *   - favicon.ico     — ブラウザ自動取得分
 *   - robots.txt, sitemap.xml — SEO 用 (空にしておくのが安全)
 *
 * 上記以外のすべてのパス (アプリページ、API、_next/data など) に Basic Auth を適用。
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
  ],
};
