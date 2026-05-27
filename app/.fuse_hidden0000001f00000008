import type { Metadata } from "next";
import Link from "next/link";
import {
  LayoutGrid,
  BookOpen,
  Sparkles,
  Building2,
  ArrowRight,
  LayersIcon,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
        <Hero />
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
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-card-foreground transition-colors duration-300 sm:p-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,theme(colors.primary/12),transparent_60%)]"
      />
      <Badge variant="secondary" className="gap-1.5">
        <LayersIcon className="size-3" />
        Common Design System
      </Badge>
      <h1 className="mt-4 text-h4 font-semibold tracking-tight sm:text-h3">
        どのブランドにも先に通すべき、共通の土台。
      </h1>
      <p className="mt-4 max-w-2xl text-body text-muted-foreground sm:text-body-lg">
        Figma Variables から生成された 162 色 + 13 サイズのトークンを単一情報源として、
        shadcn/ui (new-york) を Tailwind v4 で組み立てた汎用デザインシステム。
        各導入先 (XXX など) はここを土台に、{" "}
        <code>--primary-blue-*</code> と <code>--navigation-navy-*</code> の{" "}
        2 系統 + ロゴだけを差し替えて運用します。
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/components">Components を見る</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/prototype">Prototype を開く</Link>
        </Button>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 汎用 3 ページへの導線                                              */
/* ---------------------------------------------------------------- */

function CoreSection() {
  return (
    <section className="mt-16">
      <div className="mb-6 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
          Pages
        </p>
        <h2 className="mt-2 text-h5 font-semibold tracking-tight">
          汎用システムの 3 ページ
        </h2>
        <p className="mt-3 text-body text-muted-foreground">
          ブランド固有色を載せる前の「ニュートラルな」デザインシステム本体。
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <CoreCard
          href="/components"
          icon={LayoutGrid}
          title="Components"
          desc="Buttons / Forms / Tables / Tabs などのコンポーネントカタログ。"
        />
        <CoreCard
          href="/guidelines"
          icon={BookOpen}
          title="Guidelines"
          desc="設計原則 4 つ、セマンティックトークン、タイポ 11 段、WCAG 2.2 AA 最低ライン。"
        />
        <CoreCard
          href="/prototype"
          icon={Sparkles}
          title="Prototype"
          desc="全コンポーネントを縦長 1 ページで眺める、汎用ショーケース。"
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
    <section className="mt-16">
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
          href="/xxx"
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

        <div className="rounded-lg border border-dashed border-border p-6 text-muted-foreground transition-colors duration-300">
          <Badge variant="outline">Coming soon</Badge>
          <h3 className="mt-3 text-h7 font-semibold text-foreground">
            他社テナント
          </h3>
          <p className="mt-2 text-body">
            新しい導入先が増えるたびに、<code>app/&lt;会社名&gt;/</code> と{" "}
            <code>components/&lt;会社名&gt;/</code> をテンプレートから複製して追加します。
          </p>
        </div>
      </div>
    </section>
  );
}
