import type { Metadata } from "next";

import { UikitCatalog } from "@/components/uikit-catalog";
import { ScrollToTop } from "@/components/scroll-to-top";

export const metadata: Metadata = {
  title: "Components | XXX Design System",
  description:
    "XXX 仕様 (teal primary / button-color / warm) で描画されたコンポーネントカタログ。同じカタログを汎用版と比較すると、テナント差し替え点が一目で分かる。",
};

/**
 * /xxx/components — XXX 専用 Components カタログ。
 *
 * 汎用版 (/components) と同じ <UikitCatalog /> を使い、xxx-scope (layout で適用済み)
 * の中で描画することで shadcn セマンティック層が自動で XXX 色に切り替わる。
 */
export default function XxxComponentsPage() {
  return (
    <main className="max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <ScrollToTop />
      {/* ページヘッダー */}
      <header className="mb-8 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
          Components
        </p>
        <h1 className="mt-2 text-h3 font-semibold tracking-tight sm:text-h2">
          コンポーネントセット
        </h1>
        <p className="mt-3 text-body text-muted-foreground sm:text-body-lg">
          ここに並ぶ shadcn コンポーネントは <code>.xxx-scope</code> 配下にあるため、
          primary は teal <code>#0f766e</code>、accent は teal-50、ring も teal となります。
          汎用 Components と比較すると、XXX のブランドに合わせて自動的に色だけが差し替わっていることが分かります。
        </p>
      </header>

      <UikitCatalog />
    </main>
  );
}
