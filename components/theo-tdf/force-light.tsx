"use client";

import { useEffect } from "react";

/**
 * theo-tdf（保険商品）は常時ライト固定。
 *
 * ThemeToggle は theo-tdf 配下では非表示にしているが、他テナント/汎用ページで
 * ダークに切り替えたまま client 遷移してくると <html> に `dark` クラス +
 * data-theme="dark" が残る。マウント時に必ずライトへ戻して取りこぼしを防ぐ。
 */
export function ForceLight() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.dataset.theme = "light";
  }, []);
  return null;
}
