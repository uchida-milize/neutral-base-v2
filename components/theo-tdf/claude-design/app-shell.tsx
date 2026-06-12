"use client";

import * as React from "react";

import {
  Ic,
  ScreenOverview,
  ScreenStep2,
  ScreenPin,
  ScreenForm,
  ScreenStep4,
  ScreenCardInput,
  ScreenCardConfirm,
  ScreenDone,
} from "@/components/theo-tdf/claude-design/screens";

/* ============================================================
   THEO 組込保険 — App shell (flow rail + phone frame)
   Claude Design 出力 app.jsx からポート (2026-06-08 更新)

   画面構成 (8 画面 / 5 ステップ):
   - Steps: PIN認証 と カード承認(外部) は番号なし → 5 numbered steps total
   - scr 0: 商品概要 (STEP1)
   - scr 1: プラン選択 (STEP2)
   - scr 2: PINコード認証 (番号なし)
   - scr 3: 申込フォーム (STEP3)
   - scr 4: 内容確認・お支払い (STEP4)
   - scr 5-6: クレジットカード承認 (外部 GMO、2 画面 / 番号なし)
   - scr 7: 完了 (STEP5)
   ============================================================ */

type FlowEntry = {
  key: string;
  label: string;
  en: string;
  scr: number[];
  ext?: boolean;
  noNum?: boolean;
  subs?: string[];
};

/* Steps: PIN認証 と カード承認(外部) は番号なし → 5 numbered steps total. */
const FLOW: FlowEntry[] = [
  { key: "overview", label: "商品概要",            en: "Product",          scr: [0] },
  { key: "step2",    label: "プラン選択",          en: "Plan / Coverage",  scr: [1] },
  { key: "pin",      label: "PINコード認証",        en: "PIN Verify",       noNum: true, scr: [2] },
  { key: "form",     label: "申込フォーム",        en: "Application",      scr: [3] },
  { key: "step4",    label: "内容確認",            en: "Confirm",          scr: [4] },
  { key: "card",     label: "クレジットカード承認", en: "Card Auth (外部)", ext: true, noNum: true, scr: [5, 6] },
  { key: "done",     label: "完了",                en: "Complete",         scr: [7] },
];

// step number for each FLOW entry (null for non-numbered ext step)
const STEP_NUMS = (() => {
  let c = 0;
  return FLOW.map((f) => (f.noNum ? null : ++c));
})();
const TOTAL_STEPS = STEP_NUMS.filter((n) => n != null).length;

// Which FLOW step owns a given screen index
const stepOfScreen = (scr: number) => FLOW.findIndex((f) => f.scr.includes(scr));

function Rail({ scr, go }: { scr: number; go: (n: number) => void }) {
  const curStep = stepOfScreen(scr);
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 py-10 pr-8">
      <p className="font-mono text-caption tracking-[0.14em] uppercase text-neutral-400">
        Embedded Insurance
      </p>
      <h1 className="mt-1 text-h4 font-bold text-neutral-800">THEO 組込保険</h1>
      <p className="text-caption text-neutral-400 mt-0.5">
        ワイヤーフレーム / 全{TOTAL_STEPS}ステップ
      </p>
      <nav className="mt-8 space-y-1">
        {FLOW.map((f, i) => {
          const active = i === curStep;
          const done = i < curStep;
          return (
            <div key={f.key}>
              <button
                onClick={() => go(f.scr[0])}
                className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left transition ${
                  active ? "bg-white shadow-sm" : "hover:bg-white/60"
                }`}
              >
                <span
                  className={`grid place-items-center w-6 h-6 rounded-full text-caption font-en font-semibold shrink-0
                    ${f.noNum
                      ? active
                        ? "bg-primary/15 text-primary-600"
                        : "bg-warm-200 text-neutral-400"
                      : active
                        ? "bg-primary text-white"
                        : done
                          ? "bg-primary-10 text-primary-600"
                          : "bg-warm-200 text-neutral-400"
                    }`}
                >
                  {f.noNum ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  ) : (
                    STEP_NUMS[i]
                  )}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block text-h6 leading-tight flex items-center gap-1.5 ${
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
              {/* sub-screens for combined steps — only when active */}
              {active && f.subs && (
                <div className="ml-[1.85rem] mt-1 mb-1 space-y-0.5 border-l border-warm-200 pl-3">
                  {f.subs.map((s, j) => {
                    const sActive = f.scr[j] === scr;
                    return (
                      <button
                        key={j}
                        onClick={() => go(f.scr[j])}
                        className="flex items-center gap-2 w-full text-left py-1 group"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${sActive ? "bg-primary" : "bg-warm-300 group-hover:bg-warm-400"}`} />
                        <span className={`text-caption ${sActive ? "text-primary-700 font-medium" : "text-neutral-500"}`}>{s}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
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
  heroTop,
}: {
  children: React.ReactNode;
  external?: boolean;
  heroTop?: boolean;
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
          {heroTop ? (
            /* status bar — hero 画面では絶対配置・透明背景でヒーロー画像に重ねる */
            <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 pt-2.5 pb-1 text-caption font-en font-medium text-neutral-800">
              <span>9:41</span>
              <div className={`absolute left-1/2 -translate-x-1/2 top-2 w-28 h-6 rounded-full ${notch}`} />
              <span className="flex items-center gap-1"><span>5G</span><span>100%</span></span>
            </div>
          ) : (
            /* status bar — 通常画面では固定高さブロック */
            <div className={`shrink-0 flex items-center justify-between px-6 pt-2.5 pb-1 text-caption font-en font-medium ${status}`}>
              <span>9:41</span>
              <div className={`absolute left-1/2 -translate-x-1/2 top-2 w-28 h-6 rounded-full ${notch}`} />
              <span className="flex items-center gap-1"><span>5G</span><span>100%</span></span>
            </div>
          )}
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
  const [scr, setScr] = React.useState(0);
  const [sel, setSel] = React.useState("a");
  const [simM, setSimM] = React.useState(10000); // 毎月の積立金額（共有）
  const [simY, setSimY] = React.useState(15);    // 保障期間（共有）
  const NSCR = 8;
  const go = (n: number) => setScr(Math.max(0, Math.min(NSCR - 1, n)));

  const curStep = stepOfScreen(scr);
  const external = !!(FLOW[curStep] && FLOW[curStep].ext);
  const curStepNo = STEP_NUMS[curStep];

  const screens = [
    <ScreenOverview key="overview" go={go} />,
    <ScreenStep2 key="step2" go={go} sel={sel} setSel={setSel} m={simM} setM={setSimM} y={simY} setY={setSimY} />,
    <ScreenPin key="pin" go={go} />,
    <ScreenForm key="form" go={go} sel={sel} m={simM} setM={setSimM} y={simY} setY={setSimY} />,
    <ScreenStep4 key="step4" go={go} sel={sel} m={simM} y={simY} />,
    <ScreenCardInput key="card" go={go} />,
    <ScreenCardConfirm key="cardconf" go={go} />,
    <ScreenDone key="done" go={go} />,
  ];

  return (
    <div className="theo-tdf-cd font-jp min-h-screen w-full bg-warm-100 transition-colors duration-300">
      <div className="mx-auto max-w-[1100px] px-6 flex items-start justify-center gap-4">
        <Rail scr={scr} go={go} />
        <main className="py-10 flex flex-col items-center gap-4">
          <Phone external={external} heroTop={scr === 0 || scr === 7}>{screens[scr]}</Phone>
          {/* prev / next outside the phone */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => go(scr - 1)}
              disabled={scr === 0}
              className="flex items-center gap-1 rounded-full bg-white border border-warm-200 px-4 h-10 text-caption font-medium text-neutral-600 shadow-sm disabled:opacity-40 hover:border-warm-300"
            >
              <Ic.chevL className="w-4 h-4" />
              前の画面
            </button>
            <span className="font-mono text-caption text-neutral-400 px-2">
              {external
                ? "外部サイト（GMO）"
                : curStepNo == null
                  ? FLOW[curStep]?.label ?? ""
                  : `STEP ${curStepNo} / ${TOTAL_STEPS}`}
            </span>
            <button
              onClick={() => go(scr + 1)}
              disabled={scr === NSCR - 1}
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
