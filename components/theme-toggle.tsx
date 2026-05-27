"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * 簡易テーマトグル
 *
 * - クリック時に `<html>` の `dark` クラスを add/remove し、同時に React state を更新
 * - useEffect での DOM 同期は行わない（クリックハンドラだけが状態を変える）
 * - SSR 不整合を避けるため、初期表示は常にライト（月アイコン）でレンダリング
 * - 永続化は無し
 */
export function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(false);

  const handleClick = React.useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      // 第2引数 force でテーマと state を確実に同期させる
      document.documentElement.classList.toggle("dark", next);
      // 念のため data-theme も付与（将来 [data-theme] CSS を使うときに便利）
      document.documentElement.dataset.theme = next ? "dark" : "light";
      return next;
    });
  }, []);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleClick}
      aria-label={isDark ? "ライトモードに切り替え" : "ダークモードに切り替え"}
      aria-pressed={isDark}
      className="transition-colors duration-300 ease-out"
    >
      {isDark ? (
        <Sun className="size-5" aria-hidden />
      ) : (
        <Moon className="size-5" aria-hidden />
      )}
    </Button>
  );
}
