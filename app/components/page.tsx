import type { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";
import { UikitCatalog } from "@/components/uikit-catalog";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Components | Design System",
  description:
    "汎用デザインシステムのコンポーネントカタログ。Buttons / Forms / Tables / Tabs を Figma Variables ベースの shadcn/ui で描画。各テナントは xxx-scope の中で同じカタログを使い回す。",
};

/**
 * /components — 汎用 Components カタログ。
 *
 * 共有の <UikitCatalog /> を、ブランド固有色を載せないニュートラルな
 * セマンティック層のまま描画する。同じカタログは /xxx/components でも使われ、
 * そちらは xxx-scope で navy primary に切り替わる。
 */
export default function UikitPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 ease-out">
      <ScrollToTop />
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
        <header className="mb-8 max-w-3xl">
          <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
            Components
          </p>
          <h1 className="mt-2 text-display-3 font-semibold tracking-tight sm:text-display-2">
            汎用コンポーネントセット
          </h1>
          <p className="mt-3 text-body text-muted-foreground sm:text-body-lg">
            Figma Variables (162 colors / 13 sizes) を反映した shadcn/ui (new-york) コンポーネント。
            ここに並ぶ Button / Input / Table 等は、テナント側でも同じカタログがそのまま使われ、
            色だけが各社の navy / primary に差し替わります。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary">162 color tokens</Badge>
            <Badge variant="secondary">13 size tokens</Badge>
            <Badge variant="outline">Light / Dark 両対応</Badge>
          </div>
        </header>

        <UikitCatalog />
      </main>
    </div>
  );
}
