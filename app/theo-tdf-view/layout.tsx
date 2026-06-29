import * as React from "react";
import { ForceLight } from "@/components/theo-tdf/force-light";
import "@/components/theo-tdf/tokens.css";

/**
 * /theo-tdf-view
 *
 * プロトタイプ画面をフレームなし・ヘッダーなしで描画するベアビュー。
 * ブラウザ幅を 390px にすると正しく見える。
 * app/theo-tdf/layout.tsx（SiteHeader 入り）とは独立したレイアウト。
 */
export default function TheoTdfViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theo-tdf-scope theo-tdf-cd font-jp min-h-screen bg-background text-foreground">
      <ForceLight />
      {children}
    </div>
  );
}
