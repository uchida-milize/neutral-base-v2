import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { FormsSection } from "@/components/theo-tdf/theo-catalog";
import { Section, SectionHeading, ComponentSnippet } from "@/components/guidelines/theo-tdf-shared";
export const metadata: Metadata = { title: "フォーム入力 | Components | THEO × T&Dファイナンシャル" };
export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <Link href="/theo-tdf/components" className="inline-flex items-center gap-1 text-caption text-muted-foreground hover:text-primary mb-6"><ChevronLeft className="size-3.5" />コンポーネント一覧</Link>
      <header className="mb-10 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">Components</p>
        <h1 className="mt-2 text-display-3 font-semibold tracking-tight">フォーム入力</h1>
        <p className="mt-3 text-body text-muted-foreground">Field / DatePicker / LockedField / Select / SegmentedToggle / GenderField / AgreeCheckbox。</p>
      </header>
      <div className="mb-14 overflow-x-auto"><FormsSection /></div>
      <Section>
        <SectionHeading eyebrow="Props Reference" title="使い方早見表" description="フォーム入力コンポーネントの props 一覧。" audience="developer" />
        <div className="flex flex-wrap gap-2 mt-2 mb-6">
          <span className="text-caption text-muted-foreground self-center">Storybook で詳細を確認：</span>
          <a href="https://neutral-base-storybook.vercel.app/?path=/docs/theo-tdf-form-field--docs" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md border border-[#FF4785]/30 bg-[#FF4785]/5 px-2.5 py-1 text-[11px] font-medium text-[#FF4785] hover:bg-[#FF4785]/10 transition-colors"><svg viewBox="0 -4 24 28" className="h-3 w-3 shrink-0" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M17 -4h4v9l-2-1.5-2 1.5V-4z"/><rect width="24" height="24" rx="3.5" fill="#FF4785"/><path d="M16 7C16 5 7.5 5 7.5 9C7.5 13 16.5 13 16.5 17C16.5 21 8 21 8 19" stroke="white" strokeWidth="2.4" strokeLinecap="round" fill="none"/></svg>Field</a>
        </div>
        <div className="space-y-6">
          <ComponentSnippet name="Field" desc="テキスト入力（4 状態: default / filled / error / disabled）"
            props={[
              { name: "label",       type: "string",  required: true },
              { name: "placeholder", type: "string",  required: false },
              { name: "required",    type: "boolean", required: false },
              { name: "value",       type: "string",  required: false },
              { name: "error",       type: "string",  required: false },
              { name: "errMode",     type: '"inline"', required: false, default: '"inline"' },
              { name: "disabled",    type: "boolean", required: false },
            ]}
            code={`<Field label="姓" placeholder="山田" required />\n<Field label="姓" value="山田" required />\n<Field label="姓" error="入力してください" errMode="inline" required />\n<Field label="生年月日" value="1990/01/01" disabled />`} />
          <ComponentSnippet name="DatePicker" desc="日付入力フィールド（カレンダーアイコン付き）"
            props={[
              { name: "label",    type: "string",  required: true },
              { name: "required", type: "boolean", required: false },
              { name: "error",    type: "string",  required: false },
              { name: "errMode",  type: '"inline"', required: false },
              { name: "disabled", type: "boolean", required: false },
            ]}
            code={`<DatePicker label="生年月日" required />\n<DatePicker label="生年月日" required error="生年月日を選択してください" />`} />
          <ComponentSnippet name="LockedField" desc="読み取り専用フィールド（変更不可）"
            props={[
              { name: "label", type: "string", required: true },
              { name: "value", type: "string", required: true },
            ]}
            code={`<LockedField label="生年月日" value="1990 / 01 / 01" />`} />
          <ComponentSnippet name="Select" desc="セレクトボックス（3 状態）"
            props={[
              { name: "label",    type: "string",   required: true },
              { name: "options",  type: "string[]", required: true },
              { name: "required", type: "boolean",  required: false },
              { name: "error",    type: "string",   required: false },
              { name: "errMode",  type: '"inline"', required: false },
              { name: "disabled", type: "boolean",  required: false },
            ]}
            code={`<Select label="都道府県" options={PREFS} required />`} />
          <ComponentSnippet name="SegmentedToggle" desc="セグメントトグル（性別など二択）"
            props={[
              { name: "options",  type: "string[]",         required: true },
              { name: "value",    type: "string",           required: true },
              { name: "onChange", type: "(v: string) => void", required: true },
              { name: "error",    type: "boolean",          required: false },
            ]}
            code={`<SegmentedToggle options={["男性","女性"]} value={gender} onChange={setGender} />`} />
          <ComponentSnippet name="AgreeCheckbox" desc="同意チェックボックス"
            props={[
              { name: "checked",  type: "boolean",           required: true },
              { name: "onChange", type: "(v: boolean) => void", required: true },
              { name: "children", type: "ReactNode",         required: false },
            ]}
            code={`<AgreeCheckbox checked={agreed} onChange={setAgreed}>\n  上記の事前同意事項を確認し、同意します\n</AgreeCheckbox>`} />
        </div>
      </Section>
    </main>
  );
}
