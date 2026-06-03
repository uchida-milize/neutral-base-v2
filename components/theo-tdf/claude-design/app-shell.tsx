"use client";

import * as React from "react";

import {
  Ic,
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

/* ============================================================
   THEO 組込保険 — App shell (flow rail + phone frame)
   Claude Design 出力 app.jsx からポート (2026-06-03)
   ============================================================ */

const FLOW = [
  { key: "intro",    label: "イントロ",       en: "Intro" },
  { key: "plans",    label: "プラン選択",     en: "Plans" },
  { key: "coverage", label: "補償内容",       en: "Coverage" },
  { key: "email",    label: "メール送信",     en: "Email" },
  { key: "form",     label: "申込フォーム",   en: "Application" },
  { key: "confirm",  label: "内容確認",       en: "Confirm" },
  { key: "payment",  label: "お支払い登録",   en: "Payment" },
  { key: "card",     label: "カード入力",     en: "Card (外部)",    ext: true },
  { key: "cardconf", label: "カード確認",     en: "Card 確認 (外部)", ext: true },
  { key: "done",     label: "完了",           en: "Complete" },
];

function Rail({ step, go }: { step: number; go: (n: number) => void }) {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 py-10 pr-8">
      <p className="font-mono text-caption tracking-[0.14em] uppercase text-neutral-400">
        Embedded Insurance
      </p>
      <h1 className="mt-1 text-cd-h5 font-bold text-neutral-800">THEO 組込保険</h1>
      <p className="text-caption text-neutral-400 mt-0.5">
        ワイヤーフレーム / 全{FLOW.length}画面
      </p>
      <nav className="mt-8 space-y-1">
        {FLOW.map((f, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <button
              key={f.key}
              onClick={() => go(i)}
              className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left transition ${
                active ? "bg-white shadow-sm" : "hover:bg-white/60"
              }`}
            >
              <span
                className={`grid place-items-center w-6 h-6 rounded-full text-caption font-en font-semibold shrink-0
                  ${active
                    ? "bg-primary text-white"
                    : done
                      ? "bg-primary-10 text-primary-600"
                      : "bg-warm-200 text-neutral-400"
                  }`}
              >
                {i + 1}
              </span>
              <span className="min-w-0">
                <span
                  className={`block text-cd-h7 leading-tight flex items-center gap-1.5 ${
                    active ? "font-bold text-neutral-800" : "text-neutral-600"
                  }`}
                >
                  {f.label}
                  {f.ext && (
                    <span className="font-mono text-[9px] tracking-wide rounded bg-neutral-200 text-neutral-500 px-1 py-0.5">
                      外部
                    </span>
                  )}
                </span>
                <span className="block font-mono text-[10px] tracking-wide uppercase text-neutral-400">
                  {f.en}
                </span>
              </span>
            </button>
          );
        })}
      </nav>
      <button
        onClick={() => go(0)}
        className="mt-8 self-start text-caption text-neutral-400 hover:text-neutral-700 underline underline-offset-2"
      >
        最初からやり直す
      </button>
    </aside>
  );
}

function Phone({
  children,
  external,
}: {
  children: React.ReactNode;
  external?: boolean;
}) {
  const bezel = external ? "bg-neutral-400" : "bg-neutral-900";
  const notch = external ? "bg-neutral-500" : "bg-neutral-900";
  const status = external
    ? "bg-neutral-600 text-white"
    : "bg-primary text-primary-foreground";
  return (
    <div className="relative">
      <div
        className={`w-[390px] h-[820px] rounded-[44px] ${bezel} p-3 shadow-2xl transition-colors duration-300`}
      >
        <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-warm-50 flex flex-col">
          <div
            className={`shrink-0 flex items-center justify-between px-6 pt-2.5 pb-1 text-caption font-en font-medium ${status}`}
          >
            <span>9:41</span>
            <div
              className={`absolute left-1/2 -translate-x-1/2 top-2 w-28 h-6 rounded-full ${notch}`}
            />
            <span className="flex items-center gap-1">
              <span>5G</span>
              <span>100%</span>
            </span>
          </div>
          {children}
        </div>
      </div>
      {external && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-neutral-700 text-white text-[10px] font-mono tracking-wide px-3 py-1 shadow-md whitespace-nowrap">
          外部サイト（GMO ペイメント）
        </div>
      )}
    </div>
  );
}

export function TheoTdfClaudeDesignShell() {
  const [step, setStep] = React.useState(0);
  const [sel, setSel] = React.useState("a");
  const [simM, setSimM] = React.useState(10000);
  const [simY, setSimY] = React.useState(15);
  const go = (n: number) => setStep(Math.max(0, Math.min(FLOW.length - 1, n)));

  const screens = [
    <ScreenIntro key="intro" go={go} />,
    <ScreenPlans key="plans" go={go} sel={sel} setSel={setSel} />,
    <ScreenCoverage key="coverage" go={go} sel={sel} m={simM} setM={setSimM} y={simY} setY={setSimY} />,
    <ScreenEmail key="email" go={go} />,
    <ScreenForm key="form" go={go} sel={sel} m={simM} setM={setSimM} y={simY} setY={setSimY} />,
    <ScreenConfirm key="confirm" go={go} sel={sel} m={simM} y={simY} />,
    <ScreenPayment key="payment" go={go} />,
    <ScreenCardInput key="card" go={go} />,
    <ScreenCardConfirm key="cardconf" go={go} />,
    <ScreenDone key="done" go={go} />,
  ];

  return (
    <div className="font-jp min-h-screen w-full bg-warm-100">
      <div className="mx-auto max-w-[1100px] px-6 flex items-start justify-center gap-4">
        <Rail step={step} go={go} />
        <main className="py-10 flex flex-col items-center gap-4">
          <Phone external={FLOW[step] && FLOW[step].ext}>{screens[step]}</Phone>
          <div className="flex items-center gap-2">
            <button
              onClick={() => go(step - 1)}
              disabled={step === 0}
              className="flex items-center gap-1 rounded-full bg-white border border-warm-200 px-4 h-10 text-caption font-medium text-neutral-600 shadow-sm disabled:opacity-40 hover:border-warm-300"
            >
              <Ic.chevL className="w-4 h-4" />
              前の画面
            </button>
            <span className="font-mono text-caption text-neutral-400 px-2">
              {step + 1} / {FLOW.length}
            </span>
            <button
              onClick={() => go(step + 1)}
              disabled={step === FLOW.length - 1}
              className="flex items-center gap-1 rounded-full bg-white border border-warm-200 px-4 h-10 text-caption font-medium text-neutral-600 shadow-sm disabled:opacity-40 hover:border-warm-300"
            >
              次の画面
              <Ic.chevR className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
