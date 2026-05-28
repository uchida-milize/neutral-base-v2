"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * AutoColorScale — テナントの tokens.css の値を **自動で読み取って表示** する
 * スケールブロック。
 *
 * 従来 (ScaleBlock):
 *   - 各 step の hex 文字列をハードコードして props で渡す必要があった
 *   - tokens.css を更新しても表示は古いまま (4 テナント × 5 スケール × 9 step を手動更新)
 *
 * AutoColorScale:
 *   - 各 swatch は `background: var(--{prefix}-{step})` で描画
 *   - マウント後に getComputedStyle() で実際の RGB を取得 → hex 文字列にして表示
 *   - 文字色 (白 / 黒) は背景の相対輝度から自動判定 (WCAG 相当)
 *   - anchor (= 500 段) の右上に小ドットを表示
 *
 * 使い方:
 *   <AutoColorScale prefix="primary-color" title="primary-color"
 *     subtitle="コーポレートカラー1 · ブランド主要色 / ヘッダー / sidebar" />
 *
 * これで /xxx, /aaa, /td-financial, /theo-tdf すべての guidelines ページが
 * 各テナントの tokens.css を見て自動で色を反映する。
 */

const DEFAULT_STEPS = ["10", "50", "100", "200", "300", "400", "500", "600", "700"] as const;
const WARM_STEPS = ["50", "100", "200", "300"] as const;

type ScaleSteps = readonly string[];

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
    t
      .map((n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0"))
      .join("")
  );
}

function relativeLuminance(rgb: string): number {
  const t = parseRgb(rgb);
  if (!t) return 0.5;
  const [r, g, b] = t.map((c) => {
    const cn = c / 255;
    return cn <= 0.03928 ? cn / 12.92 : Math.pow((cn + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function AutoColorScale({
  prefix,
  title,
  subtitle,
  steps = DEFAULT_STEPS,
  anchorStep = "500",
}: {
  /** CSS 変数の prefix。例: "primary-color" は `--primary-color-{step}` を参照 */
  prefix: string;
  /** 表示タイトル。多くは prefix と同じだが明示できる (例: "warm") */
  title: string;
  /** 副題。"コーポレートカラー1 · primary 主要色" 等の説明テキスト */
  subtitle: string;
  /** スケールの step 配列。warm は ["50","100","200","300"] を渡す */
  steps?: ScaleSteps;
  /** anchor (基準色) の step。デフォルトは "500" */
  anchorStep?: string;
}) {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = React.useState<Record<string, string>>({});

  // マウント後 (および window resize / theme 切替時) に再計算
  React.useEffect(() => {
    const recompute = () => {
      const grid = gridRef.current;
      if (!grid) return;
      const next: Record<string, string> = {};
      for (const step of steps) {
        const el = grid.querySelector<HTMLDivElement>(`[data-step="${step}"]`);
        if (!el) continue;
        next[step] = getComputedStyle(el).backgroundColor;
      }
      setResolved(next);
    };
    recompute();
    // テーマ切替 (light/dark) で var の解決値が変わる可能性に追従
    const obs = new MutationObserver(recompute);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, [steps]);

  return (
    <Card className="overflow-hidden transition-colors duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-h7 font-mono">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          ref={gridRef}
          className="grid overflow-hidden rounded-md border border-border"
          style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        >
          {steps.map((step) => {
            const rgb = resolved[step] || "";
            const hex = rgbToHex(rgb);
            const inv = rgb ? relativeLuminance(rgb) < 0.5 : false;
            return (
              <div
                key={step}
                data-step={step}
                className="relative flex flex-col items-center justify-center py-3 text-[10px] leading-none"
                style={{
                  background: `var(--${prefix}-${step})`,
                  color: inv ? "#fff" : "#0f172a",
                }}
                title={`--${prefix}-${step}${hex ? ` · ${hex}` : ""}`}
              >
                <span className="font-semibold">{step}</span>
                <span className="mt-1 font-mono opacity-80">
                  {hex || `--${step}`}
                </span>
                {step === anchorStep ? (
                  <span className="absolute right-1 top-1 size-1.5 rounded-full bg-current opacity-70" />
                ) : null}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/** warm スケール (50/100/200/300) 専用の AutoColorScale エイリアス */
export function AutoWarmScale({
  title = "warm",
  subtitle = "無彩色 (背景・区切り線)",
  anchorStep = "50",
}: {
  title?: string;
  subtitle?: string;
  anchorStep?: string;
} = {}) {
  return (
    <AutoColorScale
      prefix="warm"
      title={title}
      subtitle={subtitle}
      steps={WARM_STEPS}
      anchorStep={anchorStep}
    />
  );
}
