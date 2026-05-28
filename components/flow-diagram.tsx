import * as React from "react";

/**
 * FlowDiagram — デザインから公開までのワークフローを可視化する Dify 風フロー図。
 *
 * 4 ステップ:
 *   01. デザイン入力 (Figma / Google AI Studio / Excel 仕様書 / VI 資料)
 *   02. Claude Design でデザイン作成
 *   03. Vercel に公開 (= 開発側との接続点)
 *   04. Figma 書き出し (任意) — (1) が Figma MCP の場合は Variables / Components を保って戻せる
 *
 * 視覚特徴:
 *   - 各ノードは rounded-xl のカード
 *   - 隣接ノード間は SVG ベジェ曲線で接続 (Dify-style)
 *   - Step 4 は破線ボーダー + 破線コネクタで "任意" を視覚化
 *   - レスポンシブ: desktop は横並び、mobile は縦並び
 */

type FlowStep = {
  n: string;
  icon: string;
  title: string;
  sub: string;
  desc: string;
  /** カード色のヒント (Dify 風に役割で色分け) */
  accent: "input" | "design" | "deploy" | "export";
  /** Step 4 のような任意ステップ */
  optional?: boolean;
};

const STEPS: FlowStep[] = [
  {
    n: "01",
    icon: "📥",
    title: "デザイン入力",
    sub: "Figma / AI Studio / Excel 仕様書 / VI 資料",
    desc: "Figma のデザインを MCP 経由 (Variables / Components ごと)、Google AI Studio のワイヤーフレーム、Excel 仕様書 (画面項目 + 埋め込みモック画像)、VI 資料 / ブランドガイド PDF (色・ロゴ・タイポ規定) のいずれか、あるいは複数を組み合わせて取り込み。",
    accent: "input",
  },
  {
    n: "02",
    icon: "✨",
    title: "Claude Design",
    sub: "claude.ai/design でデザイン化",
    desc: "顧客ブランドのカラー / iOS 風フレーム / Tailwind ベースの React コンポーネントとして成果物を生成。",
    accent: "design",
  },
  {
    n: "03",
    icon: "🚀",
    title: "Vercel に公開",
    sub: "main push で自動デプロイ",
    desc: "GitHub main 更新 → Vercel が再ビルド → 顧客レビュー URL に即時反映。ここで開発側と接続 (実装ファイルを共有する地点)。",
    accent: "deploy",
  },
  {
    n: "04",
    icon: "🎯",
    title: "Figma に書き出し (任意)",
    sub: "納品 / 顧客要望のタイミング",
    desc: "(1) で Figma MCP を使った場合は Variables / Components を保ったまま戻せる。納品契約で Figma ファイルが必要なときに発火。",
    accent: "export",
    optional: true,
  },
];

const ACCENT_CLASSES: Record<FlowStep["accent"], string> = {
  input:  "bg-[color:var(--secondary-color-10,#eff5ff)]",
  design: "bg-[color:var(--primary-color-10,#eef0f4)]",
  deploy: "bg-[color:var(--button-color-50,#eaecf5)]",
  export: "bg-muted/40",
};

export function FlowDiagram() {
  return (
    <div className="relative my-4">
      {/* Desktop: 4 ノードを横並び、間にベジェ曲線。items-stretch で高さ均一化 */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-x-1">
        <FlowNode step={STEPS[0]} />
        <CurveHorizontal />
        <FlowNode step={STEPS[1]} />
        <CurveHorizontal />
        <FlowNode step={STEPS[2]} />
        <CurveHorizontal optional />
        <FlowNode step={STEPS[3]} />
      </div>

      {/* Mobile: 縦並び */}
      <div className="flex flex-col items-stretch gap-2 md:hidden">
        <FlowNode step={STEPS[0]} />
        <CurveVertical />
        <FlowNode step={STEPS[1]} />
        <CurveVertical />
        <FlowNode step={STEPS[2]} />
        <CurveVertical optional />
        <FlowNode step={STEPS[3]} />
      </div>

      {/* "Figma MCP の場合は variables fit" の戻しループ説明 (常に縦表示) */}
      <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/30 p-4">
        <p className="text-caption font-medium text-foreground">
          🔄 (1) が Figma MCP 経由の場合の戻しループ
        </p>
        <p className="mt-1.5 text-body text-muted-foreground">
          Step 1 で Figma MCP からデザインを取り込んでいた場合、Step 4 の Figma 書き出しでは
          元の <strong className="text-foreground">Variables (色トークン) と Components (UI 部品)</strong>{" "}
          をそのまま使って書き戻せます。これにより、Figma ↔ Web の間で「同じトークン名」「同じコンポーネント構造」が保たれます。
        </p>
      </div>
    </div>
  );
}

function FlowNode({ step }: { step: FlowStep }) {
  const accentBg = ACCENT_CLASSES[step.accent];
  return (
    <div
      className={[
        "flex h-full flex-col rounded-xl p-5 text-card-foreground transition-colors duration-300",
        accentBg,
        step.optional
          ? "border-2 border-dashed border-border"
          : "border border-border",
      ].join(" ")}
    >
      {/* 大きな番号 — Chillax (Display フォント) で primary 色のアクセント */}
      <span className="font-chillax text-h3 font-bold leading-none tracking-tight text-primary/85">
        {step.n}
      </span>

      {/* タイトル */}
      <h3 className="mt-4 text-h7 font-semibold leading-tight">{step.title}</h3>

      {/* sub — 文頭にアイコンを文章サイズで添える */}
      <p className="mt-1 text-caption font-medium text-primary">
        <span className="mr-1" aria-hidden>{step.icon}</span>
        {step.sub}
      </p>

      {/* desc */}
      <p className="mt-2 text-body text-muted-foreground">{step.desc}</p>

      {/* optional badge は下部に押し出す (mt-auto で flex 残りスペースを埋める) */}
      {step.optional && (
        <div className="mt-auto pt-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-tiny font-medium text-muted-foreground">
            任意 (Optional)
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * 横方向のベジェ曲線コネクタ (Dify 風の波打ち)
 */
function CurveHorizontal({ optional = false }: { optional?: boolean }) {
  return (
    <svg
      width="48"
      height="80"
      viewBox="0 0 48 80"
      fill="none"
      aria-hidden
      className="text-muted-foreground/60"
    >
      <path
        d="M 4 40 C 16 12, 32 68, 44 40"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={optional ? "5 4" : undefined}
        fill="none"
      />
      {/* 矢印の頭 */}
      <path
        d="M 38 35 L 44 40 L 38 45"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * 縦方向のベジェ曲線コネクタ (mobile 用)
 */
function CurveVertical({ optional = false }: { optional?: boolean }) {
  return (
    <div className="flex justify-center">
      <svg
        width="64"
        height="40"
        viewBox="0 0 64 40"
        fill="none"
        aria-hidden
        className="text-muted-foreground/60"
      >
        <path
          d="M 32 4 C 8 12, 56 28, 32 36"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={optional ? "5 4" : undefined}
          fill="none"
        />
        <path
          d="M 27 30 L 32 36 L 37 30"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
