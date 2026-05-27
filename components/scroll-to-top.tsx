"use client";

import { useEffect } from "react";

/**
 * ページマウント時に最上部までスクロールするユーティリティ。
 *
 * ブラウザの scrollRestoration や、ページ内コンポーネントの autoFocus
 * (cmdk の CommandInput 等) が起こす意図しない中程スクロールを打ち消す。
 * Components ページのように縦長で、対話的要素が多いページで使用。
 */
export function ScrollToTop() {
  useEffect(() => {
    // instant にして滑らかなアニメーションは入れない (ユーザーの最初の視界を確実に top に)
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);
  return null;
}
