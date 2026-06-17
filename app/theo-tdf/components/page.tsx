import type { Metadata } from "next";

import { UikitCatalog } from "@/components/uikit-catalog";
import { ScrollToTop } from "@/components/scroll-to-top";
import { BrandGradients } from "@/components/theo-tdf/brand-gradients";

export const metadata: Metadata = {
  title: "Components | THEO × T&Dファイナンシャル 組込",
  description:
    "theo-tdf 仕様 (Ink Blue primary / THEO Blue button-color / Coral secondary / warm) で描画されたコンポーネントカタログ。同じカタログを汎用版と比較すると、テナント差し替え点が一目で分かる。",
};

/**
 * /theo-tdf/components — theo-tdf 専用 Components カタログ。
 *
 * 汎用版 (/components) と同じ <UikitCatalog /> を使い、theo-tdf-scope (layout で適用済み)
 * の中で描画することで shadcn セマンティック層が自動で theo-tdf 色に切り替わる。
 */
export default function XxxComponentsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <ScrollToTop />
      {/* ページヘッダー */}
      <header className="mb-8 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
          Components
        </p>
        <h1 className="mt-2 text-display-3 font-semibold tracking-tight sm:text-display-2">
          コンポーネントセット
        </h1>
        <p className="mt-3 text-body text-muted-foreground sm:text-body-lg">
          ここに並ぶ shadcn コンポーネントは <code>.theo-tdf-scope</code> 配下にあるため、
          primary は Ink Blue <code>#065fe3</code>、accent / ring も Ink Blue 系となります。
          汎用 Components と比較すると、theo-tdf のブランドに合わせて自動的に色だけが差し替わっていることが分かります。
        </p>
      </header>

      {/* TD 組込1.4 — プロトタイプ固有のグラデーション & 中立面 */}
      <section className="mb-12">
        <h2 className="text-h3 font-semibold tracking-tight">
          グラデーション &amp; 中立面（申込フロー固有）
        </h2>
        <p className="mb-5 mt-2 max-w-3xl text-body text-muted-foreground">
          下の shadcn カタログはセマンティック層（単色）の見本です。申込フロー画面では、
          ボタン・ステッパー番号バッジ・ヘッダーに青系グラデーションを、無効フィールドやプラン帯などの中立面に
          <code> #EFEFEF</code> を使います（値は <code>claude-design/screens.tsx</code> と一致）。
        </p>
        <BrandGradients />
      </section>

      <UikitCatalog />
    </main>
  );
}
