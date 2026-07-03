import type { Metadata } from "next";
import Link from "next/link";
import {
  ImageIcon, LayoutTemplate, Square, Tag, FormInput,
  LayoutGrid, CreditCard, ChevronDown, CircleCheck, Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Components | THEO × T&Dファイナンシャル 組込",
  description: "theo-tdf 固有コンポーネントカタログ。カテゴリ別にビジュアルプレビューとprops早見表を掲載。",
};

const CATEGORIES = [
  { slug: "brand",       icon: ImageIcon,      title: "ブランドアセット",   desc: "Logo / 背景画像 / アイコン / デコレーション SVG / Phone UI Chrome" },
  { slug: "navigation",  icon: LayoutTemplate, title: "ナビゲーション",     desc: "AppBar / Steps" },
  { slug: "buttons",     icon: Square,         title: "ボタン",             desc: "Btn — cta / button / outline / ghost / danger" },
  { slug: "labels",      icon: Tag,            title: "ラベル・バッジ",      desc: "Badge / ReqBadge / ErrText / SelectedPlanBadge" },
  { slug: "forms",       icon: FormInput,      title: "フォーム入力",       desc: "Field / DatePicker / LockedField / Select / SegmentedToggle / GenderField / AgreeCheckbox" },
  { slug: "cards",       icon: LayoutGrid,     title: "セクション",          desc: "NumberedSectionHeading / CardHeader / StepSection" },
  { slug: "plan",        icon: CreditCard,     title: "カード・プラン選択", desc: "GroupCard / ConfirmCard / PremiumSimulationCard / PlanCard など" },
  { slug: "disclosure",  icon: ChevronDown,    title: "開示・折り畳み",     desc: "AccordionDropdown / NumberedDisclosureItem" },
  { slug: "status",      icon: CircleCheck,    title: "アイコン",           desc: "StatusIcon / アイコン画像 / デコレーション SVG" },
  { slug: "action",      icon: Zap,            title: "アクション",         desc: "ActionBar — normal / solid" },
];

export default function ComponentsHubPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <header className="mb-10 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">Components</p>
        <h1 className="mt-2 text-display-3 font-semibold tracking-tight sm:text-display-2">
          コンポーネントセット
        </h1>
        <p className="mt-3 text-body text-muted-foreground sm:text-body-lg">
          <code>screens.tsx</code> で定義された THEO × T&amp;D 固有コンポーネント。
          カテゴリを選択するとビジュアルプレビューと props 早見表を確認できます。
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {CATEGORIES.map(({ slug, icon: Icon, title, desc }) => (
          <Link key={slug} href={`/theo-tdf/components/${slug}`} className="group block">
            <Card className="h-full shadow-sm transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-accent/30 group-hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <span className="grid size-9 place-items-center rounded-md bg-accent text-accent-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <CardTitle className="text-h4 transition-colors group-hover:text-primary">{title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-body text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
