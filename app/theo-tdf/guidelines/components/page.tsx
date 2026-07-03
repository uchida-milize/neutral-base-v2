import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Section, SectionHeading } from "@/components/guidelines/theo-tdf-shared";

export const metadata: Metadata = {
  title: "カスタムコンポーネント | ガイドライン | THEO × T&Dファイナンシャル 組込",
  description: "screens.tsx で定義されたカスタムコンポーネントのビジュアルプレビューと props 早見表。",
};

const CATEGORIES = [
  { slug: "brand",      title: "ブランドアセット",  desc: "Logo / 背景画像 / アイコン / デコレーション SVG" },
  { slug: "navigation", title: "ナビゲーション",    desc: "AppBar / Steps" },
  { slug: "buttons",    title: "ボタン",            desc: "Btn — cta / button / outline / ghost / danger" },
  { slug: "labels",     title: "ラベル・バッジ",    desc: "Badge / ReqBadge / ErrText / SelectedPlanBadge" },
  { slug: "forms",      title: "フォーム入力",      desc: "Field / DatePicker / LockedField / Select / SegmentedToggle / AgreeCheckbox" },
  { slug: "cards",      title: "セクション・カード", desc: "GroupCard / StepSection / ConfirmCard / NoteBox など" },
  { slug: "plan",       title: "プラン選択",        desc: "PremiumSimulationCard / PlanCard / PlanCardAccordion" },
  { slug: "disclosure", title: "開示・折り畳み",    desc: "AccordionDropdown / NumberedDisclosureItem" },
  { slug: "status",     title: "ステータス",        desc: "StatusIcon — 6 状態" },
  { slug: "action",     title: "アクション",        desc: "ActionBar — normal / solid" },
];

export default function ComponentsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <Section id="components-handoff">
        <SectionHeading
          eyebrow="Components"
          title="カスタムコンポーネント 早見表"
          description="ビジュアルプレビューと props 早見表はカテゴリ別のコンポーネントページに移動しました。以下のリンクから各カテゴリにアクセスできます。"
          audience="both"
        />
        <div className="grid gap-3 md:grid-cols-2">
          {CATEGORIES.map(({ slug, title, desc }) => (
            <Link
              key={slug}
              href={`/theo-tdf/components/${slug}`}
              className="group flex items-start justify-between gap-4 rounded-xl border border-border bg-white px-4 py-3.5 transition-colors hover:border-primary/40 hover:bg-accent/30"
            >
              <div>
                <p className="text-h6 font-semibold text-foreground group-hover:text-primary transition-colors">{title}</p>
                <p className="mt-0.5 text-caption text-muted-foreground">{desc}</p>
              </div>
              <ExternalLink className="size-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}
