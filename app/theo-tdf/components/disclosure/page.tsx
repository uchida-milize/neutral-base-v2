import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { DisclosureSection } from "@/components/theo-tdf/theo-catalog";
import { Section, SectionHeading, ComponentSnippet } from "@/components/guidelines/theo-tdf-shared";
export const metadata: Metadata = { title: "開示・折り畳み | Components | THEO × T&Dファイナンシャル" };
export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <Link href="/theo-tdf/components" className="inline-flex items-center gap-1 text-caption text-muted-foreground hover:text-primary mb-6"><ChevronLeft className="size-3.5" />コンポーネント一覧</Link>
      <header className="mb-10 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">Components</p>
        <h1 className="mt-2 text-display-3 font-semibold tracking-tight">開示・折り畳み</h1>
        <p className="mt-3 text-body text-muted-foreground">AccordionDropdown / NumberedDisclosureItem / AgreeItem。右端は実際に開閉できるインタラクティブ版。</p>
      </header>
      <div className="mb-14 overflow-x-auto"><DisclosureSection /></div>
      <Section>
        <SectionHeading eyebrow="Props Reference" title="使い方早見表" description="折り畳みコンポーネントの props 一覧。" audience="developer" />
        <div className="space-y-6">
          <ComponentSnippet name="AccordionDropdown" desc="汎用アコーディオン（タイトル＋展開コンテンツ）"
            props={[
              { name: "title",    type: "string",    required: true },
              { name: "open",     type: "boolean",   required: false },
              { name: "onToggle", type: "() => void", required: false },
              { name: "children", type: "ReactNode", required: false },
            ]}
            code={`const [open, setOpen] = useState(false);\n<AccordionDropdown title="クレジットカードのお支払いについて"\n  open={open} onToggle={() => setOpen(!open)}>\n  詳細内容\n</AccordionDropdown>`} />
          <ComponentSnippet name="NumberedDisclosureItem" desc="番号付き開示項目（重要事項確認リスト用）"
            props={[
              { name: "n",        type: "number",    required: true },
              { name: "title",    type: "string",    required: true },
              { name: "open",     type: "boolean",   required: false },
              { name: "onToggle", type: "() => void", required: false },
              { name: "children", type: "ReactNode", required: false },
            ]}
            code={`<NumberedDisclosureItem n={1} title="申込に関する注意事項の確認"\n  open={open} onToggle={toggle}>\n  注意事項の内容\n</NumberedDisclosureItem>`} />
          <ComponentSnippet name="AgreeItem" desc="重要事項・事前同意事項の確認項目（チェック＋開閉、item.blocks を自動描画）"
            props={[
              { name: "num",     type: "string",         required: true },
              { name: "item",    type: "AgreeItemData",  required: true },
              { name: "open",    type: "boolean",        required: false },
              { name: "onToggle", type: "() => void",    required: false },
              { name: "checked", type: "boolean",        required: false },
              { name: "onCheck", type: "() => void",     required: false },
              { name: "children", type: "ReactNode",     required: false },
            ]}
            code={`<AgreeItem num="①" item={AGREE_ITEMS[0]}\n  open={open} onToggle={toggle}\n  checked={checked} onCheck={() => setChecked(!checked)} />`} />
        </div>
      </Section>
    </main>
  );
}
