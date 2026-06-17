import * as React from "react";

import { SiteHeader } from "@/components/site-header";
import { ForceLight } from "@/components/theo-tdf/force-light";

// theo-tdf 専用トークンを読み込む。.theo-tdf-scope 配下でのみ shadcn セマンティック層が
// Ink Blue primary / THEO Blue button-color / Coral secondary / warm に切り替わる。
import "@/components/theo-tdf/tokens.css";

/**
 * /theo-tdf/* 全ページ共通のラッパー。
 *
 * - <div className="theo-tdf-scope"> でラップすることで、子孫の shadcn 系
 *   コンポーネントが自動的に theo-tdf 色 (Ink Blue primary 等) を吸い込む
 * - SiteHeader もこのラッパー内に置くので、ヘッダーの primary 色も
 *   theo-tdf 仕様に追従する
 * - 保険商品のため常時ライト固定 (<ForceLight /> がマウント時に dark を解除)
 * - 顧客視点: theo-tdf 担当者には /theo-tdf/ 配下の URL だけを案内し、
 *   ヘッダーには汎用 (/components /guidelines /prototype) への動線を出さない
 *   (site-header.tsx が path 判定して theo-tdf ナビセットだけを出す)
 */
export default function TheoTdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theo-tdf-scope min-h-screen bg-background text-foreground transition-colors duration-300 ease-out">
      <ForceLight />
      <SiteHeader />
      {children}
    </div>
  );
}
