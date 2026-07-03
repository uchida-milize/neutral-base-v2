import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ActionSection } from "@/components/theo-tdf/theo-catalog";
import { Section, SectionHeading, ComponentSnippet } from "@/components/guidelines/theo-tdf-shared";
export const metadata: Metadata = { title: "アクション | Components | THEO × T&Dファイナンシャル" };
export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <Link href="/theo-tdf/components" className="inline-flex items-center gap-1 text-caption text-muted-foreground hover:text-primary mb-6"><ChevronLeft className="size-3.5" />コンポーネント一覧</Link>
      <header className="mb-10 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">Components</p>
        <h1 className="mt-2 text-display-3 font-semibold tracking-tight">アクション</h1>
        <p className="mt-3 text-body text-muted-foreground">画面下部に固定される ActionBar。normal（白帯）と solid（ブルー帯）の 2 種類。</p>
      </header>
      <div className="mb-14 overflow-x-auto"><ActionSection /></div>
      <Section>
        <SectionHeading eyebrow="Props Reference" title="使い方早見表" description="ActionBar の props 一覧。" audience="developer" />
        <ComponentSnippet name="ActionBar" desc="画面下部スティッキーバー"
          props={[
            { name: "solid",    type: "boolean",   required: false, default: "false" },
            { name: "children", type: "ReactNode", required: true },
          ]}
          code={`{/* 通常（白帯） */}\n<ActionBar>\n  <Btn kind="cta">次へ進む</Btn>\n</ActionBar>\n\n{/* solid（ブルー帯）*/}\n<ActionBar solid>\n  <Btn kind="cta">申込む</Btn>\n  <Btn kind="ghost" full={false}>キャンセル</Btn>\n</ActionBar>`} />
      </Section>
    </main>
  );
}
