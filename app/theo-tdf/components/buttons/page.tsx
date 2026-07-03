import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ButtonsSection } from "@/components/theo-tdf/theo-catalog";
import { Section, SectionHeading, ComponentSnippet } from "@/components/guidelines/theo-tdf-shared";
export const metadata: Metadata = { title: "ボタン | Components | THEO × T&Dファイナンシャル" };
export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <Link href="/theo-tdf/components" className="inline-flex items-center gap-1 text-caption text-muted-foreground hover:text-primary mb-6"><ChevronLeft className="size-3.5" />コンポーネント一覧</Link>
      <header className="mb-10 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">Components</p>
        <h1 className="mt-2 text-display-3 font-semibold tracking-tight">ボタン</h1>
        <p className="mt-3 text-body text-muted-foreground">5種類 × 通常/Disabled。申込確定のみ CTA（純赤）、通常前進は button（THEO Blue）。</p>
      </header>
      <div className="mb-14 overflow-x-auto"><ButtonsSection /></div>
      <Section>
        <SectionHeading eyebrow="Props Reference" title="使い方早見表" description="Btn コンポーネントの props 一覧。" audience="developer" />
        <ComponentSnippet name="Btn" desc="5 種 × full / disabled 対応ボタン"
          props={[
            { name: "kind",     type: '"cta" | "button" | "outline" | "ghost" | "danger"', required: true },
            { name: "full",     type: "boolean", required: false, default: "true" },
            { name: "disabled", type: "boolean", required: false, default: "false" },
          ]}
          code={`<Btn kind="cta">申込を確定する</Btn>
<Btn kind="button" full={false}>確認する</Btn>
<Btn kind="outline" full={false}>戻る</Btn>
<Btn kind="ghost"   full={false}>スキップ</Btn>
<Btn kind="danger"  full={false}>解約する</Btn>
<Btn kind="cta" disabled>申込む（disabled）</Btn>`} />
      </Section>
    </main>
  );
}
