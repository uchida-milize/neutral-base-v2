"use client";

import * as React from "react";

import {
  ScreenIntro,
  ScreenPlans,
  ScreenCoverage,
  ScreenEmail,
  ScreenForm,
  ScreenConfirm,
  ScreenPayment,
  ScreenCardInput,
  ScreenCardConfirm,
  ScreenDone,
} from "@/components/theo-tdf/claude-design/screens";

/**
 * /theo-tdf/windows
 *
 * Claude Design 出力の 10 画面を 390px 幅で左から右に並べたキャンバス。
 * 高さは内容に応じて可変。画面解像度に合わせて flex-wrap で自動折り返し。
 * 実際にタップで動かしたい場合は /theo-tdf/prototype を参照。
 *
 * Server Component から呼べないため "use client" (各 Screen が useState を持つため)。
 */

type ScreenDef = {
  key: string;
  label: string;
  el: React.ReactNode;
};

function StaticScreen({
  label,
  index,
  total,
  children,
}: {
  label: string;
  index: number;
  total: number;
  children: React.ReactNode;
}) {
  return (
    <figure className="flex flex-col items-start gap-3" style={{ width: 390 }}>
      <figcaption>
        <p className="font-mono text-caption text-muted-foreground">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <h3 className="mt-1 text-h7 font-semibold">{label}</h3>
      </figcaption>
      <div
        className="theo-tdf-cd font-jp rounded-2xl border border-warm-200 bg-warm-50 overflow-hidden shadow-sm transition-colors duration-300"
        style={{ width: 390 }}
      >
        <div className="flex flex-col" style={{ minHeight: 600 }}>
          {children}
        </div>
      </div>
    </figure>
  );
}

export default function TheoTdfWindowsPage() {
  const noop = () => {};

  const screens: ScreenDef[] = [
    { key: "intro",    label: "イントロ",         el: <ScreenIntro go={noop} /> },
    { key: "plans",    label: "プラン選択",       el: <ScreenPlans go={noop} sel="c" setSel={noop} /> },
    { key: "coverage", label: "補償内容",         el: <ScreenCoverage go={noop} sel="c" m={10000} setM={noop} y={15} setY={noop} /> },
    { key: "email",    label: "メール送信",       el: <ScreenEmail go={noop} /> },
    { key: "form",     label: "申込フォーム",     el: <ScreenForm go={noop} sel="c" m={10000} setM={noop} y={15} setY={noop} /> },
    { key: "confirm",  label: "内容確認",         el: <ScreenConfirm go={noop} sel="c" m={10000} y={15} /> },
    { key: "payment",  label: "お支払い登録",     el: <ScreenPayment go={noop} /> },
    { key: "card",     label: "カード入力 (外部)", el: <ScreenCardInput go={noop} /> },
    { key: "cardconf", label: "カード確認 (外部)", el: <ScreenCardConfirm go={noop} /> },
    { key: "done",     label: "完了",             el: <ScreenDone go={noop} /> },
  ];

  return (
    <main className="mx-auto max-w-[1700px] px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <div className="mx-auto mb-10 max-w-5xl">
        <header className="max-w-3xl">
          <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
            Screens
          </p>
          <h1 className="mt-2 text-h3 font-semibold tracking-tight sm:text-h2">
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
          <StaticScreen key={s.key} label={s.label} index={i} total={screens.length}>
            {s.el}
          </StaticScreen>
        ))}
      </div>
    </main>
  );
}
