import type { Metadata } from "next";
import Link from "next/link";
import {
  LayoutGrid,
  BookOpen,
  Building2,
  ArrowRight,
  FileTextIcon,
  LayersIcon,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { OverviewSection } from "@/components/overview-section";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Design System",
  description:
    "Figma Variables (162 colors / 13 sizes) を反映した shadcn/ui ベースの汎用デザインシステム。各テナント (XXX など) は本システムを土台に、tenant override で色とロゴだけを差し替えて運用する。",
};

/**
 * / — 汎用デザインシステムの入口ランディング。
 *
 * - 役割: デザインシステムの "土台" の意義を説明し、TOP / Guidelines / Components の 3 ページに案内する
 * - 同時に「テナント別の運用」が存在することも示し、XXX など各社向けの入口リンクを掲示する
 *   (顧客 XXX 担当者には /xxx/ URL を直接渡す前提なので、この入口を経由する想定はしない)
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 ease-out">
      <SiteHeader />

      {/* Hero: 全幅 banner (site-header と同じ max-w-[1400px]) */}
      <div className="mx-auto max-w-[1400px] px-4 pt-10 sm:px-6 lg:pt-14">
        <Hero />
      </div>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-12 sm:px-6">
        <OverviewSection />
        <CoreSection />
        <TenantsSection />
      </main>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Hero                                                              */
/* ---------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card text-card-foreground transition-colors duration-300">
      {/* かなり薄いブルー → 微かに薄いブルー の横方向グラデーション */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#bfdbfe,#f0f9ff)] dark:bg-[linear-gradient(to_right,rgba(96,165,250,0.18),rgba(96,165,250,0.04))]"
      />
      {/* 内側コンテンツは max-w-5xl 中央揃え (= h2 以降と左端を揃える) */}
      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <Badge variant="secondary" className="gap-1.5">
          <LayersIcon className="size-3" />
          Common Design System
        </Badge>
        <h1 className="mt-4 text-h2 font-semibold tracking-tight sm:text-h1">
          どのブランドにも先に通すべき、共通の土台。
        </h1>
        <p className="mt-4 max-w-2xl text-body text-muted-foreground sm:text-body-lg">
          Figma Variables から生成された 162 色 + 13 サイズのトークンを単一情報源として、
          shadcn/ui (new-york) を Tailwind v4 で組み立てた汎用デザインシステム。
          各導入先 (XXX など) はここを土台に、{" "}
          <code>--secondary-color-*</code> と <code>--primary-color-*</code> の{" "}
          2 系統 + ロゴだけを差し替えて運用します。
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 汎用 3 ページへの導線                                              */
/* ---------------------------------------------------------------- */

function CoreSection() {
  return (
    <section className="mt-20">
      <div className="mb-6 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
          Pages
        </p>
        <h2 className="mt-2 text-h5 font-semibold tracking-tight">
          汎用システムの 2 ページ
        </h2>
        <p className="mt-3 text-body text-muted-foreground">
          ブランド固有色を載せる前の「ニュートラルな」デザインシステム本体。
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <CoreCard
          href="/guidelines"
          icon={BookOpen}
          title="Guidelines"
          desc="設計原則 4 つ、セマンティックトークン、タイポ 11 段、WCAG 2.2 AA 最低ライン。"
        />
        <CoreCard
          href="/components"
          icon={LayoutGrid}
          title="Components"
          desc="Buttons / Forms / Tables / Tabs などのコンポーネントカタログ。"
        />
      </div>
    </section>
  );
}

function CoreCard({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: typeof LayersIcon;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-border bg-card p-5 text-card-foreground transition-colors duration-300 hover:border-primary"
    >
      <div className="flex items-center justify-between">
        <span className="grid size-9 place-items-center rounded-md bg-accent text-accent-foreground">
          <Icon className="size-4" aria-hidden />
        </span>
        <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
      <h3 className="mt-3 text-h7 font-semibold">{title}</h3>
      <p className="mt-2 text-body text-muted-foreground">{desc}</p>
    </Link>
  );
}

/* ---------------------------------------------------------------- */
/* テナント (各社専用) への導線                                        */
/* ---------------------------------------------------------------- */

function TenantsSection() {
  return (
    <section className="mt-20">
      <div className="mb-6 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
          Tenants
        </p>
        <h2 className="mt-2 text-h5 font-semibold tracking-tight">
          ブランド別の運用
        </h2>
        <p className="mt-3 text-body text-muted-foreground">
          各テナント (顧客企業) には、共通システムを土台にしたうえで navy / cta-red / warm などのブランド固有色を上書きした「専用ツリー」を用意します。
          顧客には{" "}
          <code className="text-foreground">/&lt;テナント名&gt;/</code>{" "}
          の URL だけを案内します。
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/td-financial/guidelines"
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-lg border border-border bg-card p-6 text-card-foreground transition-colors duration-300 hover:border-primary"
        >
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="gap-1.5">
              <Building2 className="size-3" />
              T&amp;Dファイナンシャル生命
            </Badge>
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
          <h3 className="mt-3 text-h7 font-semibold">
            T&amp;Dファイナンシャル生命 ガイドライン
          </h3>
          <p className="mt-2 text-body text-muted-foreground">
            コーポレートカラー Navy <code>#003388</code> + Red <code>#db0034</code>、
            通常ボタン Blue <code>#344a9c</code>、CTA Red <code>#db0034</code> 構成。
            組込ページ向け デザイン資料 (Guidelines / Components / Prototype / Windows)。
          </p>
          <p className="mt-3 font-mono text-caption text-primary">/td-financial/guidelines</p>
        </Link>

        <Link
          href="/xxx"
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-lg border border-border bg-card p-6 text-card-foreground transition-colors duration-300 hover:border-primary"
        >
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="gap-1.5">
              <Building2 className="size-3" />
              XXX
            </Badge>
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
          <h3 className="mt-3 text-h7 font-semibold">
            XXX社 (サンプル架空企業)
          </h3>
          <p className="mt-2 text-body text-muted-foreground">
            primary を navy <code>#1b3157</code> に差し替え、CTA に朱色 <code>#c8242f</code> を追加。
            Embedded Insurance Portal の 4 画面付き (Dashboard / Contracts / 詳細 / Settings)。
          </p>
          <p className="mt-3 font-mono text-caption text-primary">/xxx/</p>
        </Link>

        <a
          href="https://github.com/uchida-milize/neutral-base/blob/main/HANDOFF.md"
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-lg border border-dashed border-border p-6 text-muted-foreground transition-colors duration-300 hover:border-primary hover:text-foreground"
        >
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="gap-1.5">
              <FileTextIcon className="size-3" />
              HANDOFF.md
            </Badge>
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
          <h3 className="mt-3 text-h7 font-semibold text-foreground">
            他社テナントの追加方法
          </h3>
          <p className="mt-2 text-body">
            新しい導入先が増えるたびに、<code>app/&lt;会社名&gt;/</code> と{" "}
            <code>components/&lt;会社名&gt;/</code> をテンプレートから複製して追加します。
            手順は HANDOFF.md を参照してください。
          </p>
          <p className="mt-3 font-mono text-caption text-primary">
            github.com/.../HANDOFF.md
          </p>
        </a>
      </div>
    </section>
  );
}
