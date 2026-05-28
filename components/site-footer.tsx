import * as React from "react";

/**
 * SiteFooter — サイト共通のミニフッター。
 *
 * 薄い muted 色 + tiny サイズで控えめにコピーライト表示。
 * 全テナント / 全ページに layout 経由で適用される。
 * コンテンツ幅 (max-w-5xl) の左端に揃えて表示する。
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full pb-10 pt-12">
      {/* コンテンツ幅 (max-w-5xl) と完全に同じ container を内側に持たせ、
          body の flex 挙動に左右されずに main と同じ左端揃えを保証する */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="text-left text-tiny text-muted-foreground/70">
          © {year} MILIZE. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
