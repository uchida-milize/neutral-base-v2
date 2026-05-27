import type { Metadata } from "next";

import { UikitCatalog } from "@/components/uikit-catalog";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Components | TDF Design System",
  description:
    "TDF 仕様 (navy primary / cta-red / warm) で描画されたコンポーネントカタログ。同じカタログを汎用版と比較すると、テナント差し替え点が一目で分かる。",
};

/**
 * /tdf/components — TDF 専用 Components カタログ。
 *
 * 汎用版 (/components) と同じ <UikitCatalog /> を使い、tdf-scope (layout で適用済み)
 * の中で描画することで shadcn セマンティック層が自動で TDF 色に切り替わる。
 */
export default function TdfUikitPage() {
  return (
    <main className="mx-auto max-w-[1400px] px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      {/* ページヘッダー */}
      <header className="mb-8 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
          TDF Components
        </p>
        <h1 className="mt-2 text-h5 font-semibold tracking-tight sm:text-h4">
          TDF 仕様のコンポーネント
        </h1>
        <p className="mt-3 text-body text-muted-foreground sm:text-body-lg">
          ここに並ぶ shadcn コンポーネントは <code>.tdf-scope</code> 配下にあるため、
          primary は navy <code>#1b3157</code>、accent は navy-50、ring も navy となります。
          汎用 Components と比較すると、TDF のブランドに合わせて自動的に色だけが差し替わっていることが分かります。
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary">primary = navy</Badge>
          <Badge variant="outline">cta = vermilion #c8242f</Badge>
          <Badge variant="outline">warm = #fdfaf6</Badge>
        </div>
      </header>

      <UikitCatalog />
    </main>
  );
}
