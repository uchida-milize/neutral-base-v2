import * as React from "react";

/**
 * SiteFooter — サイト共通のミニフッター。
 *
 * 薄い muted 色 + tiny サイズで控えめにコピーライト表示。
 * 汎用 / XXX / T&D など、すべての TOP の末尾に置く。
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mx-auto max-w-5xl px-4 pb-10 pt-12 sm:px-6">
      <p className="text-center text-tiny text-muted-foreground/70">
        © {year} MILIZE. All rights reserved.
      </p>
    </footer>
  );
}
