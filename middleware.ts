import { NextRequest, NextResponse } from "next/server";

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

export function middleware(req: NextRequest) {
  // ローカル開発はバイパス
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  // 静的アセットはバイパス
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const expectedUser = process.env.BASIC_AUTH_USER;
  const expectedPass = process.env.BASIC_AUTH_PASS;

  // env 未設定なら fail closed (誤って全公開しないため)
  if (!expectedUser || !expectedPass) {
    return new NextResponse(
      "Basic Auth credentials are not configured on this deployment. " +
        "Set BASIC_AUTH_USER and BASIC_AUTH_PASS in Vercel project environment variables.",
      { status: 500 },
    );
  }

  // リクエストヘッダーの Authorization を検証
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    try {
      const encoded = auth.slice("Basic ".length);
      // Edge Runtime は atob/btoa を Web 標準として提供
      const decoded = atob(encoded);
      const sepIdx = decoded.indexOf(":");
      if (sepIdx >= 0) {
        const user = decoded.slice(0, sepIdx);
        const pass = decoded.slice(sepIdx + 1);
        if (user === expectedUser && pass === expectedPass) {
          return NextResponse.next();
        }
      }
    } catch {
      // base64 decode 失敗 → 401 にフォールスルー
    }
  }

  // 認証チャレンジ
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
    },
  });
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
