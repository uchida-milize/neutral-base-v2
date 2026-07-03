import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { NavigationSection } from "@/components/theo-tdf/theo-catalog";
import { Section, SectionHeading, ComponentSnippet } from "@/components/guidelines/theo-tdf-shared";
export const metadata: Metadata = { title: "ナビゲーション | Components | THEO × T&Dファイナンシャル" };
export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <Link href="/theo-tdf/components" className="inline-flex items-center gap-1 text-caption text-muted-foreground hover:text-primary mb-6"><ChevronLeft className="size-3.5" />コンポーネント一覧</Link>
      <header className="mb-10 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">Components</p>
        <h1 className="mt-2 text-display-3 font-semibold tracking-tight">ナビゲーション</h1>
        <p className="mt-3 text-body text-muted-foreground">画面上部の固定ヘッダー（AppBar）と STEP インジケーター（Steps）。</p>
      </header>
      <div className="mb-14 overflow-x-auto"><NavigationSection /></div>
      <Section>
        <SectionHeading eyebrow="Props Reference" title="使い方早見表" description="AppBar と Steps の props 一覧とコードスニペット。" audience="developer" />
        <div className="space-y-6">
          <ComponentSnippet name="AppBar" desc="画面上部の固定ヘッダー"
            props={[{ name: "title", type: "string", required: true }]}
            code={`<AppBar title="保険" />\n<AppBar title="お申込み完了" />`} />
          <ComponentSnippet name="Steps" desc="STEP インジケーター（現在の進捗を表示）"
            props={[
              { name: "n",  type: "number",   required: true, default: undefined },
              { name: "of", type: "number",   required: true, default: undefined },
              { name: "go", type: "() => void", required: true, default: undefined },
            ]}
            code={`<Steps n={2} of={5} go={() => router.back()} />`} />
        </div>
      </Section>
    </main>
  );
}
