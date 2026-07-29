import type { Metadata } from "next";
import Link from "next/link";
import {
  LayoutGrid,
  BookOpen,
  ArrowRight,
  FileTextIcon,
  LayersIcon,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { OverviewSection } from "@/components/overview-section";
import { Badge } from "@/components/ui/badge";
import { JpText } from "@/components/jp-text";
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

      {/* Hero: 全幅 banner (site-header と同じ max-w-[1400px]) */}
      <div className="mx-auto max-w-[1400px] px-4 pt-10 sm:px-6 lg:pt-14">
        <Hero />
      </div>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-12 sm:px-6">
        <TenantsSection />
        <OverviewSection />
        <CoreSection />
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
      {/* かなり薄いブルー → 微かに薄いブルー のグラデーション (左下 → 右上) */}
      {/* 内側コンテンツは max-w-5xl 中央揃え (= h2 以降と左端を揃える) */}
      <div className="mx-auto relative max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <Badge variant="secondary" className="gap-1.5">
          <LayersIcon className="size-3" />
          Common Design System
        </Badge>
        <h1 className="mt-4 text-display-2 font-semibold leading-tight tracking-tight sm:text-display-1">
          <JpText>どのブランドにも先に通すべき、共通の土台。</JpText>
        </h1>
        <p className="mt-4 max-w-[940px] text-body leading-[1.8] text-muted-foreground sm:text-body-lg">
          <JpText>
            色とロゴを差し替えるだけで、顧客ごとの UI/UX を同じ品質で立ち上げられる、保険・金融プロダクト向けの共通基盤です。デザイナーと開発者が同じトークンを見ながら設計から実装まで歩調を合わせ、ワイヤーフレームから顧客レビュー用 URL までを最短数日で繋ぎます。アクセシビリティと運用ルールを土台に組み込んであるので、ブランドが増えても判断のブレが生まれません。
          </JpText>
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
    <section className="mt-30">
      <div className="mb-6 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
          Pages
        </p>
        <h2 className="mt-2 text-h2 font-semibold tracking-tight">
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
          テナント別の運用
        </h2>
        <p className="mt-3 text-body text-muted-foreground">
          各テナント (顧客企業) には、共通システムを土台にしたうえで primary / secondary / button / cta の 4 スケールを上書きした「専用ツリー」を用意します。
          顧客には{" "}
          <code className="text-foreground">/&lt;テナント名&gt;/</code>{" "}
          の URL だけを案内します。各カードの色見本と hex は tokens.css から自動取得しています。
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {TENANT_CARDS.map((card) => (
          <AutoTenantCard key={card.id} {...card} />
        ))}

        {/* HANDOFF.md への導線 — テナント追加手順 */}
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
          <h3 className="mt-3 text-h4 font-semibold text-foreground">
            他社テナントの追加方法
          </h3>
          <p className="mt-2 text-body">
            <code>./scripts/new-tenant.sh &lt;name&gt;</code> でテナントを 1 コマンド作成。
            この TenantsSection への追加も自動で行われます。詳細は HANDOFF.md を参照。
          </p>
          <p className="mt-3 font-mono text-caption text-primary">
            github.com/.../HANDOFF.md
          </p>
        </a>
      </div>
    </section>
  );
}
