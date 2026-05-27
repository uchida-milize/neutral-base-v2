"use client";

import { useLayoutEffect, useEffect } from "react";

/**
 * ページマウント時に最上部までスクロールするユーティリティ。
 *
 * ブラウザの scrollRestoration や、ページ内コンポーネントの autoFocus
 * (cmdk の CommandInput 等) が起こす意図しない中程スクロールを打ち消す。
 * Components ページのように縦長で、対話的要素が多いページで使用。
 *
 * 三段構えで確実に top に戻す:
 *   1. history.scrollRestoration を "manual" にしてブラウザ側の自動復元を無効化
 *   2. useLayoutEffect (paint 前) で scrollTo(0, 0)
 *   3. 念のため useEffect (paint 後) でもう一度 scrollTo(0, 0)
 */
export function ScrollToTop() {
  // useLayoutEffect: DOM commit 後 paint 前。autoFocus 系より早い段階で実行。
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // useEffect: paint 後にもう一度。Radix/cmdk の autoFocus が paint 後に走る場合の保険。
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  return null;
}
