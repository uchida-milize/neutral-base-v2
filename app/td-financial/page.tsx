import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, LayoutGrid, BookOpen, Smartphone, Grid3x3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OverviewSection } from "@/components/overview-section";
import { JpText } from "@/components/jp-text";

export const metadata: Metadata = {
  title: "T&Dファイナンシャル生命 Design System",
  description:
    "T&Dファイナンシャル生命の Embedded Insurance プロダクト向けデザインシステム。TOP / Guidelines / Components を一望できるポータル。",
};

/**
 * /td-financial — T&Dファイナンシャル生命 専用デザインシステムの入口。
 * 顧客 (T&Dファイナンシャル生命 担当者) はこの URL から下の 4 ページにアクセスする。
 */
export default function TdFinancialHome() {
  return (
    <>
      {/* Hero: 全幅 banner (site-header と同じ max-w-[1400px]) */}
      <div className="mx-auto max-w-[1400px] px-4 pt-10 sm:px-6 lg:pt-14">
        <section className="relative overflow-hidden rounded-2xl bg-[#003388] text-white transition-colors duration-300">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(219,0,52,0.35),transparent_55%)]"
          />
          {/* 内側コンテンツは max-w-5xl 中央揃え (= h2 以降と左端を揃える) */}
          <div className="mx-auto relative max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <Badge
              variant="secondary"
              className="gap-1.5 bg-white/10 text-caption text-white"
            >
              <ShieldCheck className="size-3" />
              T&amp;Dファイナンシャル生命 · Embedded Insurance
            </Badge>
            <h1 className="mt-4 text-h2 font-semibold leading-tight tracking-tight sm:text-h1">
              <JpText>TDF 組込ページ向け デザイン資料</JpText>
            </h1>
            <p className="mt-4 max-w-2xl text-body text-white/80 sm:text-body-lg">
              金融・保険領域に求められる<strong className="text-white">「誠実さ」</strong>と、
              現代の Web / アプリに求められる<strong className="text-white">「クリーンさ」</strong>を両立する、
              T&amp;Dファイナンシャル生命 専用のデザインシステムです。
            </p>
          </div>
        </section>
      </div>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-12 sm:px-6">
        <OverviewSection
          guidelinesHref="/td-financial/guidelines"
          tenant="T&Dファイナンシャル生命"
        />

        {/* 4 ページのナビゲーション */}
        <section className="mt-20">
          <div className="mb-6">
            <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
              Pages
            </p>
            <h2 className="mt-2 text-h5 font-semibold tracking-tight">
              このシステムの 4 つのページ
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <NavCard
              href="/td-financial/guidelines"
              icon={BookOpen}
              title="Guidelines"
              desc="ブランドの 4 つの柱、カラー運用 (navy primary / red secondary / blue CTA)、ボタン 5 種類、タイポグラフィ、アクセシビリティ方針。"
            />
            <NavCard
              href="/td-financial/components"
              icon={LayoutGrid}
              title="Components"
              desc="T&Dファイナンシャル生命 仕様で描画された Buttons / Forms / Tables / Badges 等のコンポーネントカタログ。"
            />
            <NavCard
              href="/td-financial/prototype"
              icon={Smartphone}
              title="Prototype"
              desc="iPhone フレーム内で Portal の 4 画面 (Dashboard / Contracts / 詳細 / Settings) をタップ操作で遷移。"
            />
            <NavCard
              href="/td-financial/windows"
              icon={Grid3x3}
              title="Windows"
              desc="同じ 4 画面を iPhone フレームに入れたまま 2×2 グリッドで並列表示。Figma キャンバス風。"
            />
          </div>
        </section>
      </main>
    </>
  );
}

function NavCard({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: typeof ShieldCheck;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-border bg-card p-5 text-card-foreground transition-colors duration-300 hover:border-primary"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <Card className="border-0 bg-transparent p-0 shadow-none">
            <CardHeader className="p-0">
              <CardTitle className="text-h7">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <CardDescription className="text-body">{desc}</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </Link>
  );
}
