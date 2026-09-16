import type { Metadata } from "next";
import Link from "next/link";
import {
  LayoutGrid,
  BookOpen,
  ArrowRight,
  LayersIcon,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { OverviewSection } from "@/components/overview-section";
import { AutoTenantCard, type TenantCardData } from "@/components/auto-tenant-card";

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
        <CoreSection />
        <TenantsSection />
        <OverviewSection />
      </main>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 汎用 3 ページへの導線                                              */
/* ---------------------------------------------------------------- */

function CoreSection() {
  return (
    <section>
      <div className="mb-6 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
          Pages
        </p>
        <h2 className="mt-2 text-h2 font-semibold tracking-tight">
          汎用システム
        </h2>
        <p className="mt-3 text-body text-muted-foreground">
          ブランド固有色を載せる前の「ニュートラルな」デザインシステム本体。
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <CoreCard
          href="/guidelines"
          icon={BookOpen}
          title="ガイドライン"
          desc="設計原則 4 つ、セマンティックトークン、タイポ 11 段、WCAG 2.2 AA 最低ライン。"
        />
        <CoreCard
          href="/components"
          icon={LayoutGrid}
          title="コンポーネント"
          desc="Buttons / Forms / Tables / Tabs などのコンポーネントカタログ。"
        />
      </div>
    </section>
  );
}

// BrandDots は components/auto-tenant-card.tsx 内に CSS var ベースで実装済み。
// 各テナントの tokens.css を直接読むため、props 渡しの旧 BrandDots は削除した。

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
      <h3 className="mt-3 text-h4 font-semibold">{title}</h3>
      <p className="mt-2 text-body text-muted-foreground">{desc}</p>
    </Link>
  );
}

/* ---------------------------------------------------------------- */
/* テナント (各社専用) への導線                                        */
/*                                                                  */
/* TENANT_CARDS は new-tenant.sh が編集する配列。色情報は持たず、     */
/* AutoTenantCard が getComputedStyle() で tokens.css から取得する。  */
/* 新規テナント追加時は `// 新規テナントはここに追加` アンカーの      */
/* 直前に新エントリを挿入する (順序が新しい→古いとなる)。            */
/* ---------------------------------------------------------------- */

const TENANT_CARDS: TenantCardData[] = [
  {
    id: "theo-tdf",
    label: "THEO × T&Dファイナンシャル",
    title: "THEO「つみたて安心ほけん」",
    description:
      "THEO Blue を primary、Coral を secondary、純赤を CTA に置いた組込申込フロー (LP → 情報入力 → シミュレーション → メアド → カード → 注意事項 → 完了)。",
    href: "/theo-tdf",
    path: "/theo-tdf/",
  },
  // 新規テナントはここに追加 (new-tenant.sh で自動挿入)
];

function TenantsSection() {
  return (
    <section className="mt-30">
      <div className="mb-6 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
          Tenants
        </p>
        <h2 className="mt-2 text-h2 font-semibold tracking-tight">
          テナント
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {TENANT_CARDS.map((card) =>
          card.id === "theo-tdf" ? (
            <Link
              key={card.id}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center rounded-lg border border-border bg-card p-6 transition-colors duration-300 hover:border-primary"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/theo-tdf/logo_td_financial.png"
                alt={card.label}
                className="h-10 w-auto"
              />
            </Link>
          ) : (
            <AutoTenantCard key={card.id} {...card} />
          ),
        )}
      </div>
    </section>
  );
}
