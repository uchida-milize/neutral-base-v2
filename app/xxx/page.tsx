import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, LayoutGrid, BookOpen, Smartphone, Grid3x3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "XXX Design System",
  description:
    "XXX社 (サンプル架空企業)の Embedded Insurance プロダクト向けデザインシステム。TOP / Guidelines / Components を一望できるポータル。",
};

/**
 * /xxx — XXX 専用デザインシステムの入口。
 * 顧客 (XXX 担当者) はこの URL から下の 4 ページにアクセスする。
 */
export default function XxxHome() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      {/* ヒーロー */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-[#0f766e] p-8 text-white transition-colors duration-300 sm:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(217, 119, 6, 0.35),transparent_55%)]"
        />
        <Badge
          variant="secondary"
          className="gap-1.5 bg-white/10 text-caption text-white"
        >
          <ShieldCheck className="size-3" />
          XXX · Embedded Insurance
        </Badge>
        <h1 className="mt-4 text-h4 font-semibold tracking-tight sm:text-h3">
          信頼を、もっと触れる距離に。
        </h1>
        <p className="mt-4 max-w-2xl text-body text-white/80 sm:text-body-lg">
          金融・保険領域に求められる<strong className="text-white">「誠実さ」</strong>と、
          現代の Web / アプリに求められる<strong className="text-white">「クリーンさ」</strong>を両立する、
          XXX 専用のデザインシステムです。
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild className="bg-[#d97706] text-white hover:bg-[#b45309]">
            <Link href="/xxx/components">Components を見る</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/xxx/guidelines">ガイドラインを開く</Link>
          </Button>
        </div>
      </section>

      {/* 4 ページのナビゲーション */}
      <section className="mt-12">
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
            href="/xxx/components"
            icon={LayoutGrid}
            title="Components"
            desc="XXX 仕様で描画された Buttons / Forms / Tables / Badges 等のコンポーネントカタログ。"
          />
          <NavCard
            href="/xxx/guidelines"
            icon={BookOpen}
            title="Guidelines"
            desc="ブランドの 4 つの柱、カラー運用 (navy / cta-amber / warm)、ボタン 5 種類、タイポグラフィ、アクセシビリティ方針。"
          />
          <NavCard
            href="/xxx/prototype"
            icon={Smartphone}
            title="Prototype · 画面遷移"
            desc="iPhone フレーム内で Portal の 4 画面 (Dashboard / Contracts / 詳細 / Settings) をタップ操作で遷移。"
          />
          <NavCard
            href="/xxx/windows"
            icon={Grid3x3}
            title="Prototype · 俯瞰"
            desc="同じ 4 画面を iPhone フレームに入れたまま 2×2 グリッドで並列表示。Figma キャンバス風。"
          />
        </div>
      </section>
    </main>
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
