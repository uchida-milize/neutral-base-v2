"use client";

import * as React from "react";

/**
 * <ClientOnly> children
 *
 * children を mount 後 (= client-side) にのみ描画するラッパー。
 * SSR では fallback (デフォルト null) を出すので、SSR/CSR の出力が完全一致し、
 * Hydration mismatch を構造的に避けられる。
 *
 * Tooltip / Dialog / Portal 系のような Radix 内部 useId に依存するコンポーネントを
 * 並べる場合の「最後の手段」として有効。
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return <>{fallback}</>;
  return <>{children}</>;
}
