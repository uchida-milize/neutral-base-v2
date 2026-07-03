import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { LabelsSection } from "@/components/theo-tdf/theo-catalog";
import { Section, SectionHeading, ComponentSnippet } from "@/components/guidelines/theo-tdf-shared";
export const metadata: Metadata = { title: "ラベル・バッジ | Components | THEO × T&Dファイナンシャル" };
export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <Link href="/theo-tdf/components" className="inline-flex items-center gap-1 text-caption text-muted-foreground hover:text-primary mb-6"><ChevronLeft className="size-3.5" />コンポーネント一覧</Link>
      <header className="mb-10 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">Components</p>
        <h1 className="mt-2 text-display-3 font-semibold tracking-tight">ラベル・バッジ</h1>
        <p className="mt-3 text-body text-muted-foreground">Badge / 必須マーク（ReqBadge）/ インラインエラー（ErrText）/ 選択プランバッジ（SelectedPlanBadge）。</p>
      </header>
      <div className="mb-14 overflow-x-auto"><LabelsSection /></div>
      <Section>
        <SectionHeading eyebrow="Props Reference" title="使い方早見表" description="各バッジ・ラベルコンポーネントの props。" audience="developer" />
        <div className="flex flex-wrap gap-2 mt-2 mb-6">
          <span className="text-caption text-muted-foreground self-center">Storybook で詳細を確認：</span>
          <a href="https://neutral-base-storybook.vercel.app/?path=/docs/theo-tdf-atoms-badge--docs" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md border border-[#FF4785]/30 bg-[#FF4785]/5 px-2.5 py-1 text-[11px] font-medium text-[#FF4785] hover:bg-[#FF4785]/10 transition-colors"><svg viewBox="0 -4 24 28" className="h-3 w-3 shrink-0" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M17 -4h4v9l-2-1.5-2 1.5V-4z"/><rect width="24" height="24" rx="3.5" fill="#FF4785"/><path d="M16 7C16 5 7.5 5 7.5 9C7.5 13 16.5 13 16.5 17C16.5 21 8 21 8 19" stroke="white" strokeWidth="2.4" strokeLinecap="round" fill="none"/></svg>Badge</a>
        </div>
        <div className="space-y-6">
          <ComponentSnippet name="Badge" desc="ラベル・タグ（tone で色変更）"
            props={[{ name: "tone", type: '"secondary" | "primary" | "warm"', required: false, default: '"secondary"' }]}
            code={`<Badge tone="secondary">がん保障型</Badge>\n<Badge tone="primary">告知</Badge>\n<Badge tone="warm">選択中</Badge>`} />
          <ComponentSnippet name="ReqBadge" desc="必須マーク（label の末尾に inline で置く）"
            props={[]} code={`<span>姓<ReqBadge /></span>`} />
          <ComponentSnippet name="ErrText" desc="インラインエラーテキスト"
            props={[{ name: "children", type: "ReactNode", required: true }]}
            code={`<ErrText>入力内容を確認してください</ErrText>`} />
          <ComponentSnippet name="SelectedPlanBadge" desc="選択中プランを示すバッジ"
            props={[
              { name: "planType",      type: "string",  required: false },
              { name: "deathCoverage", type: "boolean", required: false },
            ]}
            code={`<SelectedPlanBadge planType="がん保障型" deathCoverage />`} />
        </div>
      </Section>
    </main>
  );
}
