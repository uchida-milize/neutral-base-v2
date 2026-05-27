import * as React from "react";

import { SiteHeader } from "@/components/site-header";

// TDF 専用トークンを読み込む。.tdf-scope 配下でのみ shadcn セマンティック層が
// navy / cta-red / warm に切り替わる。
import "@/components/tdf/tokens.css";

/**
 * /tdf/* 全ページ共通のラッパー。
 *
 * - <div className="tdf-scope"> でラップすることで、子孫の shadcn 系
 *   コンポーネントが自動的に TDF 色 (navy primary 等) を吸い込む
 * - SiteHeader もこのラッパー内に置くので、ヘッダーの primary 色も
 *   TDF 仕様に追従する
 * - 顧客視点: TDF 担当者には /tdf/ 配下の URL だけを案内し、
 *   ヘッダーには汎用 (/components /guidelines /prototype) への動線を出さない
 *   (site-header.tsx が path 判定して TDF ナビセットだけを出す)
 */
export default function TdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="tdf-scope min-h-screen bg-background text-foreground transition-colors duration-300 ease-out">
      <SiteHeader />
      {children}
    </div>
  );
}
