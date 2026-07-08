import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  SparklesIcon,
  PaletteIcon,
  EyeIcon,
  AccessibilityIcon,
  TypeIcon,
  RulerIcon,
  LayoutTemplateIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JpText } from "@/components/jp-text";
import { SectionHeading, Section } from "@/components/guidelines/theo-tdf-shared";

/* =================================================================
 * /theo-tdf/guidelines — THEO × T&Dファイナンシャル 組込デザインガイドライン
 *
 * THEO「つみたて安心ほけん」(T&Dファイナンシャル生命) の組込申込フロー向け。
 * 色トークンは components/theo-tdf/tokens.css を一次ソースとする。
 *
 * カラートークン (anchor):
 *   --primary-color-500   #1aa5dc — Sky Blue (ブランド基調 / ヘッダー / ヒーロー)
 *   --secondary-color-500 #ff748d — Coral (アクセント / 重要バッジ / リンク)
 *   --button-color-500    var(--primary-color-500) — 通常ボタン (前進。実機は青グラデ #1aa5dc→#7fd0f0)
 *   --cta-color-500       var(--primary-color-500) — 申込確定 (実機は青グラデ #1aa5dc→#7fd0f0)
 *   --warm-50             — premium / featured surface
 *
 * 設計の特徴:
 *   - Primary は Sky Blue。ブランド基調を担う。
 *   - 通常ボタン / 前進 / 申込確定はすべて同じ Sky Blue (button-color・cta-color は primary-color のエイリアス)。
 *   - 純赤 (secondary-color-700 系) はアラート・エラー・必須表示専用。CTA や通常の装飾には使わない。
 *   - 保険商品のため常時ライト固定 (ダークモードは廃止)。
 * ================================================================= */

export const metadata: Metadata = {
  title: "ガイドライン | THEO × T&Dファイナンシャル 組込",
  description:
    "THEO「つみたて安心ほけん」(T&Dファイナンシャル生命) の組込申込フローのブランドアイデンティティ (信頼・誠実・モダン・クリーン) と Embedded Insurance トークンに基づくカラー・タイポグラフィ・アクセシビリティのガイドライン。",
};

export default function TdGuidelinesPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <HeroSection />
      <BrandPillars />
      <SubpageNav />
      <Footer />
    </main>
  );
}

/* ---------------------------------------------------------------- */
/* 1. ヒーロー                                                       */
/* ---------------------------------------------------------------- */

function HeroSection() {
  return (
    <header className="mb-8 max-w-3xl">
      <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
        Guidelines
      </p>
      <h1 className="mt-2 text-display-3 font-semibold tracking-tight sm:text-display-2">
        デザインガイドライン
      </h1>
      <p className="mt-3 text-body text-muted-foreground sm:text-body-lg">
        THEO「つみたて安心ほけん」の組込申込フローは、金融・保険領域で求められる
        <strong className="text-foreground">「誠実さ」</strong>と、
        現代の Web / アプリに求められる
        <strong className="text-foreground">「クリーンさ」</strong>を両立させます。
        本ガイドラインは <code>tokens.css</code> と
        申込フロー画面の運用を、実装に落とすためのルールです。
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="secondary" className="gap-1.5">
          <ShieldCheck className="size-3" />
          THEO × T&amp;Dファイナンシャル · Embedded Insurance
        </Badge>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------- */
/* 2. ブランドの 4 つの柱                                              */
/* ---------------------------------------------------------------- */

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "信頼 (Trust)",
    body: "Primary は Sky Blue (#1aa5dc)。揺るぎない情報密度で誤読を防ぎ、保険・金融プロダクトに不可欠な「読み違えゼロ」を最優先する。",
  },
  {
    icon: SparklesIcon,
    title: "誠実 (Sincerity)",
    body: "誇張・煽り表現は使わない。純赤 (secondary-color-700 系) はアラート・エラー・必須表示専用とし、申込確定を含む通常のボタン・コピー・配色では使わない。",
  },
  {
    icon: PaletteIcon,
    title: "モダン (Modern)",
    body: "Figma Variables ベースのトークン駆動。tenant override は --secondary-color-* と --primary-color-* に集約され、semantic 層は触らない。",
  },
  {
    icon: EyeIcon,
    title: "クリーン (Clean)",
    body: "余白とグレースケールで階層を作る。warm (#fafaf9) は premium 面に限定し、装飾色は持ち込まない。",
  },
];

function BrandPillars() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Design Direction"
        title="デザインの方向性"
        description="申込フローのすべてのデザイン判断はこの 4 つの方向性に照らして妥当性を確認します。迷ったら最も保守的な選択を採ります。"
        audience="both"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {PILLARS.map(({ icon: Icon, title, body }) => (
          <Card key={title} className="shadow-none transition-colors duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-md bg-accent text-accent-foreground">
                  <Icon className="size-4" aria-hidden />
                </span>
                <CardTitle className="text-h4">{title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-body text-muted-foreground">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* 3. サブページナビカード                                             */
/* ---------------------------------------------------------------- */

const SUBPAGES = [
  {
    href: "/theo-tdf/guidelines/color",
    icon: PaletteIcon,
    title: "カラー",
    description: "Sky Blue (Primary/Button/CTA 共通) / Coral / アラート専用の純赤と、token → Tailwind 対応表。",
  },
  {
    href: "/theo-tdf/guidelines/typography",
    icon: TypeIcon,
    title: "タイポグラフィ",
    description: "9 段フォントスケール（34px〜12px）と日本語・数字フォントファミリーのルール。",
  },
  {
    href: "/theo-tdf/guidelines/button-form",
    icon: RulerIcon,
    title: "スタイル",
    description: "4px スペーシンググリッド・角丸の 6 段階スケール・シャドウ 5 段階の運用ルール。",
  },
  {
    href: "/theo-tdf/guidelines/components",
    icon: LayoutTemplateIcon,
    title: "カスタムコンポーネント",
    description: "申込フロー固有コンポーネント（AppBar / Steps / Btn / PlanCard 等）の props 一覧とコードスニペット。",
  },
  {
    href: "/theo-tdf/guidelines/accessibility",
    icon: AccessibilityIcon,
    title: "アクセシビリティ",
    description: "WCAG 2.2 AA 準拠・コントラスト比・フォントサイズ・Tone & Content ルール。",
  },
];

function SubpageNav() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Sections"
        title="各ガイドラインセクション"
        description="詳細は各サブページを参照してください。上部のナビゲーションからも移動できます。"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {SUBPAGES.map(({ href, icon: Icon, title, description }) => (
          <Link key={href} href={href} className="group block">
            <Card className="h-full shadow-sm transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-accent/30 group-hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <span className="grid size-9 place-items-center rounded-md bg-accent text-accent-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <CardTitle className="text-h4 transition-colors group-hover:text-primary">
                    {title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-body text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* Footer                                                            */
/* ---------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="mt-30 border-t border-border pt-8 transition-colors duration-300">
      <div className="flex flex-col gap-3 text-caption text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © THEO × T&amp;Dファイナンシャル 組込 · 一次ソース:{" "}
          <code>tokens.css</code> + <code>claude-design/screens.tsx</code>
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/theo-tdf/components">Components を見る</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/theo-tdf/prototype">Prototype を試す</Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href="/theo-tdf">theo-tdf 入口へ</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
