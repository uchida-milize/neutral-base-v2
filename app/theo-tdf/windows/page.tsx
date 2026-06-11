"use client";

import * as React from "react";

import {
  ScreenOverview,
  ScreenStep2,
  ScreenPin,
  ScreenForm,
  ScreenStep4,
  ScreenCardInput,
  ScreenCardConfirm,
  ScreenDone,
} from "@/components/theo-tdf/claude-design/screens";

/**
 * /theo-tdf/windows
 *
 * Claude Design 出力の 6 画面 (4 ステップ + 外部カード承認 2 画面) を
 * 390px 幅で左から右に並べたキャンバス。高さは内容に応じて可変。
 * 画面解像度に合わせて flex-wrap で自動折り返し。
 * 実際にタップで動かしたい場合は /theo-tdf/prototype を参照。
 *
 * Server Component から呼べないため "use client" (各 Screen が useState を持つため)。
 */

type ScreenDef = {
  key: string;
  label: string;
  el: React.ReactNode;
  /** 状態バリアント (ボトムシート等) は 820px 固定高さで描画 */
  height?: number;
};

function StaticScreen({
  label,
  index,
  total,
  height,
  children,
}: {
  label: string;
  index: number;
  total: number;
  /** ボトムシート等 absolute 配置の状態バリアントは 820px 固定にする */
  height?: number;
  children: React.ReactNode;
}) {
  return (
    <figure className="flex flex-col items-start gap-3" style={{ width: 390 }}>
      <figcaption>
        <p className="font-mono text-caption text-muted-foreground">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <h3 className="mt-1 text-h4 font-semibold">{label}</h3>
      </figcaption>
      <div
        className="theo-tdf-cd font-jp relative rounded-2xl border border-warm-200 bg-warm-50 overflow-hidden shadow-sm transition-colors duration-300"
        style={{ width: 390, height }}
      >
        <div
          className="flex flex-col"
          style={height ? { height: "100%" } : { minHeight: 600 }}
        >
          {children}
        </div>
      </div>
    </figure>
  );
}

export default function TheoTdfWindowsPage() {
  const noop = () => {};

  const screens: ScreenDef[] = [
    { key: "overview", label: "商品概要",                el: <ScreenOverview go={noop} /> },
    { key: "step2",    label: "プラン選択",              el: <ScreenStep2 go={noop} sel="c" setSel={noop} m={10000} setM={noop} y={15} setY={noop} /> },
    { key: "pin",      label: "PINコード認証",            el: <ScreenPin go={noop} /> },
    { key: "form",     label: "申込フォーム",            el: <ScreenForm go={noop} sel="c" m={10000} setM={noop} y={15} setY={noop} /> },
    { key: "step4",    label: "内容確認・お支払い",       el: <ScreenStep4 go={noop} sel="c" m={10000} y={15} /> },
    { key: "card",     label: "カード入力 (外部)",        el: <ScreenCardInput go={noop} /> },
    { key: "cardconf", label: "カード確認 (外部)",        el: <ScreenCardConfirm go={noop} /> },
    { key: "done",     label: "完了",                    el: <ScreenDone go={noop} /> },
    // ---- 状態バリアント (モーダル / アコーディオン展開状態の Figma 書き出し用) ----
    { key: "st-notice",  label: "状態① プラン選択 / 重要事項ボトムシート",       height: 820, el: <ScreenStep2 go={noop} sel="c" setSel={noop} m={10000} setM={noop} y={15} setY={noop} initialNoticeOpen /> },
    { key: "st-sim",     label: "状態② プラン選択 / 給付予想額アコーディオン",   el: <ScreenStep2 go={noop} sel="c" setSel={noop} m={10000} setM={noop} y={15} setY={noop} initialSimOpen /> },
    { key: "st-edit",    label: "状態③ 申込フォーム / 積立修正シート＋給付予想額", height: 820, el: <ScreenForm go={noop} sel="c" m={10000} setM={noop} y={15} setY={noop} initialEditOpen initialSheetRes /> },
    { key: "st-agree",   label: "状態④ 内容確認 / 重要事項①展開＋全チェック",    el: <ScreenStep4 go={noop} sel="c" m={10000} y={15} initialOpenIdx={0} initialChecks={[true, true, true, true, true, true, true, true]} /> },
    { key: "st-acct",    label: "状態⑤ 内容確認 / お支払い詳細 展開",            el: <ScreenStep4 go={noop} sel="c" m={10000} y={15} initialAcctOpen /> },
  ];

  return (
    <main className="mx-auto max-w-[1700px] px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <div className="mx-auto mb-10 max-w-5xl">
        <header className="max-w-3xl">
          <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
            Screens
          </p>
          <h1 className="mt-2 text-display-3 font-semibold tracking-tight sm:text-display-2">
            スクリーン
          </h1>
          <p className="mt-3 text-body text-muted-foreground sm:text-body-lg">
            各画面は <strong className="text-foreground">390px 幅</strong> · 高さは内容に応じて可変。
            画面解像度に合わせて自動的に折り返します。実際にタップして動かしたい場合は{" "}
            <a
              href="/theo-tdf/prototype"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              プロトタイプ
            </a>
            {" "}を参照してください。
          </p>
        </header>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-x-8 gap-y-12">
        {screens.map((s, i) => (
          <StaticScreen key={s.key} label={s.label} index={i} total={screens.length} height={s.height}>
            {s.el}
          </StaticScreen>
        ))}
      </div>
    </main>
  );
}
