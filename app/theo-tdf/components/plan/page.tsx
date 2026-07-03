import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PlanSection } from "@/components/theo-tdf/theo-catalog";
import { Section, SectionHeading, ComponentSnippet } from "@/components/guidelines/theo-tdf-shared";
export const metadata: Metadata = { title: "カード・プラン選択 | Components | THEO × T&Dファイナンシャル" };
export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <Link href="/theo-tdf/components" className="inline-flex items-center gap-1 text-caption text-muted-foreground hover:text-primary mb-6"><ChevronLeft className="size-3.5" />コンポーネント一覧</Link>
      <header className="mb-10 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">Components</p>
        <h1 className="mt-2 text-display-3 font-semibold tracking-tight">カード・プラン選択</h1>
        <p className="mt-3 text-body text-muted-foreground">GroupCard / ConfirmCard / PremiumSimulationCard / SliderField / PlanCard / PlanCardAccordion など。</p>
      </header>
      <div className="mb-14 overflow-x-auto"><PlanSection /></div>
      <Section>
        <SectionHeading eyebrow="Props Reference" title="使い方早見表" description="カード・プラン選択コンポーネントの props 一覧。" audience="developer" />
        <div className="flex flex-wrap gap-2 mt-2 mb-6">
          <span className="text-caption text-muted-foreground self-center">Storybook で詳細を確認：</span>
          <a href="https://neutral-base-storybook.vercel.app/?path=/docs/theo-tdf-plan-plancard--docs" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md border border-[#FF4785]/30 bg-[#FF4785]/5 px-2.5 py-1 text-[11px] font-medium text-[#FF4785] hover:bg-[#FF4785]/10 transition-colors"><svg viewBox="0 -4 24 28" className="h-3 w-3 shrink-0" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M17 -4h4v9l-2-1.5-2 1.5V-4z"/><rect width="24" height="24" rx="3.5" fill="#FF4785"/><path d="M16 7C16 5 7.5 5 7.5 9C7.5 13 16.5 13 16.5 17C16.5 21 8 21 8 19" stroke="white" strokeWidth="2.4" strokeLinecap="round" fill="none"/></svg>PlanCard</a>
        </div>
        <div className="space-y-6">
          <ComponentSnippet name="PremiumSimulationCard" desc="積立金額・保障期間スライダー＋保険料表示カード"
            props={[
              { name: "m",            type: "number",           required: true },
              { name: "setM",         type: "(v: number) => void", required: true },
              { name: "y",            type: "number",           required: true },
              { name: "setY",         type: "(v: number) => void", required: true },
              { name: "premium",      type: "number",           required: false, default: "980" },
              { name: "planType",     type: "string",           required: false },
              { name: "deathCoverage",type: "boolean",          required: false },
            ]}
            code={`const [m, setM] = useState(10000);\nconst [y, setY] = useState(15);\n<PremiumSimulationCard m={m} setM={setM} y={y} setY={setY}\n  planType="がん保障型" deathCoverage />`} />
          <ComponentSnippet name="PlanCard" desc="プラン選択カード（未選択/選択済/ツールチップ）"
            props={[
              { name: "p",           type: "PlanData", required: true },
              { name: "selected",    type: "boolean",  required: true },
              { name: "onSelect",    type: "() => void", required: true },
              { name: "initialTtOpen", type: "boolean", required: false, default: "false" },
            ]}
            code={`<PlanCard p={plan} selected={selected} onSelect={() => setSelected(plan.id)} />`} />
          <ComponentSnippet name="PlanCardAccordion" desc="アコーディオン式プランカード"
            props={[
              { name: "p",        type: "PlanData", required: true },
              { name: "selected", type: "boolean",  required: true },
              { name: "onSelect", type: "() => void", required: true },
              { name: "open",     type: "boolean",  required: true },
              { name: "onToggle", type: "() => void", required: true },
            ]}
            code={`<PlanCardAccordion p={plan} selected={sel} onSelect={onSel}\n  open={open} onToggle={toggle} />`} />
        </div>
      </Section>
    </main>
  );
}
