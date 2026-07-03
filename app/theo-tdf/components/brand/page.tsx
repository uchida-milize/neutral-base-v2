import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BrandSection } from "@/components/theo-tdf/theo-catalog";

export const metadata: Metadata = {
  title: "ブランドアセット | Components | THEO × T&Dファイナンシャル",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <Link href="/theo-tdf/components" className="inline-flex items-center gap-1 text-caption text-muted-foreground hover:text-primary mb-6">
        <ChevronLeft className="size-3.5" />コンポーネント一覧
      </Link>
      <header className="mb-10 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">Components</p>
        <h1 className="mt-2 text-display-3 font-semibold tracking-tight">ブランドアセット</h1>
        <p className="mt-3 text-body text-muted-foreground">
          Logo コンポーネント・ロゴ画像・背景ヒーロー画像・アイコン・デコレーション SVG・Phone UI Chrome の一覧。
        </p>
      </header>
      <div className="overflow-x-auto">
        <BrandSection />
      </div>
    </main>
  );
}
