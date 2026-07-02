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
  title: "THEO × T&Dファイナンシャル | つみたて安心ほけん",
  description:
    "THEO「つみたて安心ほけん」(引受: T&Dファイナンシャル生命) 組込申込ページのデザインシステム。TOP / ガイドライン / コンポーネント / プロトタイプ / スクリーン を一望できるポータル。",
};

/**
 * /theo-tdf — THEO × T&Dファイナンシャル 専用デザインシステムの入口。
 * 顧客担当者はこの URL から下の 4 ページにアクセスする。
 */
export default function TheoTdfHome() {
  return (
    <>
      {/* Hero: 全幅 banner (site-header と同じ max-w-[1400px]) */}
      <div className="mx-auto max-w-[1400px] px-4 pt-10 sm:px-6 lg:pt-14">
        <section className="relative overflow-hidden rounded-2xl bg-primary-500 text-white transition-colors duration-300">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,116,141,0.40),transparent_55%)]"
          />
          {/* 内側コンテンツは max-w-5xl 中央揃え (= h2 以降と左端を揃える) */}
          <div className="mx-auto relative max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <Badge
              variant="secondary"
              className="gap-1.5 bg-white/10 text-caption text-white"
            >
              <ShieldCheck className="size-3" />
              THEO × T&Dファイナンシャル · 組込申込
            </Badge>
            <h1 className="mt-4 text-display-2 font-semibold leading-tight tracking-tight sm:text-display-1">
              <JpText>申込フロー 設計・開発リファレンス</JpText>
            </h1>
            <p className="mt-4 max-w-2xl text-body text-white/80 sm:text-body-lg">
              THEO「つみたて安心ほけん」（引受：<strong className="text-white">T&Dファイナンシャル生命</strong>）の組込申込フロー全画面と、カラートークン・コンポーネント・Tailwindクラス対応表をまとめたポータルです。
            </p>
          </div>
        </section>
      </div>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-12 sm:px-6">
        <OverviewSection
          guidelinesHref="/theo-tdf/guidelines"
          tenant="THEO × T&Dファイナンシャル"
        />

        {/* 4 ページのナビゲーション */}
        <section className="mt-30">
          <div className="mb-6">
            <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
              Pages
            </p>
            <h2 className="mt-2 text-h2 font-semibold tracking-tight">
              このシステムの 4 つのページ
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <NavCard
              href="/theo-tdf/guidelines"
              icon={BookOpen}
              title="ガイドライン"
              desc="デザインの方向性、カラートークン・Tailwindクラス対応表 (開発ハンドオフ)、ボタン体系、タイポグラフィ、アクセシビリティ方針。"
            />
            <NavCard
              href="/theo-tdf/components"
              icon={LayoutGrid}
              title="コンポーネント"
              desc="THEO × T&D 仕様で描画された Buttons / Forms / Tables / Badges 等のコンポーネントカタログ。"
            />
            <NavCard
              href="/theo-tdf/prototype"
              icon={Smartphone}
              title="プロトタイプ"
              desc="iPhone フレーム内で つみたて安心ほけん の申込フロー 7 画面 (TOP → 情報入力 → シミュレーション → メアド → カード → 注意事項 → 完了) をタップで遷移。"
            />
            <NavCard
              href="/theo-tdf/windows"
              icon={Grid3x3}
              title="スクリーン"
              desc="同じ 7 画面を 375px 幅で左から右に並べたキャンバス。画面間の流れと情報量を一目で俯瞰。"
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
              <CardTitle className="text-h4">{title}</CardTitle>
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
