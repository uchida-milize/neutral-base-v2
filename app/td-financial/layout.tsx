import * as React from "react";

import { SiteHeader } from "@/components/site-header";

// XXX 専用トークンを読み込む。.td-financial-scope 配下でのみ shadcn セマンティック層が
// navy / button-color / warm に切り替わる。
import "@/components/td-financial/tokens.css";

/**
 * /td-financial/* 全ページ共通のラッパー。
 *
 * - <div className="td-financial-scope"> でラップすることで、子孫の shadcn 系
 *   コンポーネントが自動的に XXX 色 (teal primary 等) を吸い込む
 * - SiteHeader もこのラッパー内に置くので、ヘッダーの primary 色も
 *   XXX 仕様に追従する
 * - 顧客視点: XXX 担当者には /td-financial/ 配下の URL だけを案内し、
 *   ヘッダーには汎用 (/components /guidelines /prototype) への動線を出さない
 *   (site-header.tsx が path 判定して XXX ナビセットだけを出す)
 */
export default function XxxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="td-financial-scope min-h-screen bg-background text-foreground transition-colors duration-300 ease-out">
      <SiteHeader />
      {children}
    </div>
  );
}
