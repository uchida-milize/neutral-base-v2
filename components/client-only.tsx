"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * SSR をスキップしてマウント後に描画するラッパー。
 * Radix Portal などハイドレーション差分を起こしやすい子要素に使う。
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <>{mounted ? children : fallback}</>;
}
