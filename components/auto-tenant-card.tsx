"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";

/**
 * AutoTenantCard — 汎用 TOP「ブランド別の運用」の各テナントカード。
 *
 * このコンポーネントは「テナントの tokens.css の値を自動で読み取って表示」する:
 *   - BrandDots (3 色の真円) は `bg: var(--primary-color-500)` 等で描画
 *   - 説明文末尾の hex 表示 (#xxxxxx + #yyyyyy + ...) は getComputedStyle() で取得
 *
 * したがって new-tenant.sh からは「色情報を含まない最小限のエントリ」を
 * 追加するだけで、表示は自動で正しい色になる。
 *
 * 動作の前提: root layout で `@/components/<tenant>/tokens.css` が import されている
 *   こと (各 tokens は `.<tenant>-scope` でスコープ済みなので global import しても
 *   他に漏れない)。
 */

export type TenantCardData = {
  /** scope クラスの prefix。例: "td-financial" は `.td-financial-scope` を当てる */
  id: string;
  /** Badge のラベル (テナント名)。例: "T&Dファイナンシャル生命" */
  label: string;
  /** カードタイトル。例: "T&Dファイナンシャル生命 ガイドライン" */
  title: string;
  /** 本文 (色言及を除いた説明)。色は自動で末尾に追記される。 */
  description: string;
  /** リンク先 (ガイドライン or テナント TOP) */
  href: string;
  /** 表示する URL パス (モノスペース) */
  path: string;
};

function parseRgb(s: string): [number, number, number] | null {
  const m = s.match(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function rgbToHex(rgb: string): string {
  const t = parseRgb(rgb);
  if (!t) return "";
  return (
    "#" +
    t.map((n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0")).join("")
  );
}

export function AutoTenantCard({
  id,
  label,
  title,
  description,
  href,
  path,
}: TenantCardData) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [hex, setHex] = React.useState<{ primary: string; secondary: string; button: string; cta: string }>({
    primary: "",
    secondary: "",
    button: "",
    cta: "",
  });

  React.useEffect(() => {
    const recompute = () => {
      const el = ref.current;
      if (!el) return;
      const cs = getComputedStyle(el);
      const read = (n: string) => rgbToHex(cs.getPropertyValue(n).trim());
      setHex({
        primary: read("--primary-color-500"),
        secondary: read("--secondary-color-500"),
        button: read("--button-color-500"),
        cta: read("--cta-color-500"),
      });
    };
    recompute();
    // light/dark テーマ切替に追従
    const obs = new MutationObserver(recompute);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg border border-border bg-card p-6 text-card-foreground transition-colors duration-300 hover:border-primary"
    >
      {/* tokens.css の CSS var を解決できるようスコープを被せる */}
      <div ref={ref} className={`${id}-scope`}>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="gap-1.5">
            <Building2 className="size-3" />
            {label}
          </Badge>
          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
        <h3 className="mt-3 flex items-center gap-2 text-h4 font-semibold">
          <BrandDots />
          {title}
        </h3>
        <p className="mt-2 text-body text-muted-foreground">
          {description}
          {hex.primary ? (
            <>
              {" "}
              <span className="block pt-1">
                Primary <code className="font-mono">{hex.primary}</code> · Secondary{" "}
                <code className="font-mono">{hex.secondary}</code> · Button{" "}
                <code className="font-mono">{hex.button}</code> · CTA{" "}
                <code className="font-mono">{hex.cta}</code>
              </span>
            </>
          ) : null}
        </p>
        <p className="mt-3 font-mono text-caption text-primary">{path}</p>
      </div>
    </Link>
  );
}

/**
 * BrandDots — テナントの 3 色を CSS var で描画する真円。
 * 親要素に `.<tenant>-scope` が当たっていれば自動で正しい色になる。
 */
function BrandDots() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1" aria-hidden>
      <span
        className="inline-block size-3 rounded-full ring-1 ring-border/40"
        style={{ background: "var(--primary-color-500)" }}
      />
      <span
        className="inline-block size-3 rounded-full ring-1 ring-border/40"
        style={{ background: "var(--secondary-color-500)" }}
      />
      <span
        className="inline-block size-3 rounded-full ring-1 ring-border/40"
        style={{ background: "var(--button-color-500)" }}
      />
    </span>
  );
}
