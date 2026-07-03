import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { StatusSection } from "@/components/theo-tdf/theo-catalog";
import { Section, SectionHeading, ComponentSnippet } from "@/components/guidelines/theo-tdf-shared";
export const metadata: Metadata = { title: "アイコン | Components | THEO × T&Dファイナンシャル" };
export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <Link href="/theo-tdf/components" className="inline-flex items-center gap-1 text-caption text-muted-foreground hover:text-primary mb-6"><ChevronLeft className="size-3.5" />コンポーネント一覧</Link>
      <header className="mb-10 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">Components</p>
        <h1 className="mt-2 text-display-3 font-semibold tracking-tight">アイコン</h1>
        <p className="mt-3 text-body text-muted-foreground">StatusIcon（6状態）/ アイコン画像 / デコレーション SVG。</p>
      </header>
      <div className="mb-14 overflow-x-auto"><StatusSection /></div>
      <Section>
        <SectionHeading eyebrow="Props Reference" title="使い方早見表" description="アイコン系コンポーネントの props 一覧。" audience="developer" />
        <ComponentSnippet name="StatusIcon" desc="処理結果アイコン（6 状態）"
          props={[
            { name: "state", type: '"Success" | "Loading" | "Error" | "Maintenance" | "Cancelled" | "Locked"', required: false, default: '"Success"' },
            { name: "className", type: "string", required: false },
          ]}
          code={`<StatusIcon state="Success" />\n<StatusIcon state="Loading" />\n<StatusIcon state="Error" />\n<StatusIcon state="Maintenance" />\n<StatusIcon state="Cancelled" />\n<StatusIcon state="Locked" />`} />
      </Section>
    </main>
  );
}
