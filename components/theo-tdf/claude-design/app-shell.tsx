"use client";

import * as React from "react";

import {
  Ic,
  ScreenOverview,
  ScreenCombined,
  ScreenStep2,
  ScreenPin,
  ScreenForm,
  ScreenStep4,
  ScreenCardInput,
  ScreenCardConfirm,
  ScreenDone,
  ScreenEnded,
  HEADER_GRAD_STATUS,
  deathFromSel,
} from "@/components/theo-tdf/claude-design/screens";
import {
  useTweaks,
  TweaksSidebar,
  TweakSection,
  TweakToggle,
  TweakSelect,
} from "@/components/theo-tdf/claude-design/tweaks-panel";

/* ============================================================
   THEO 組込保険 — App shell (flow rail + phone frame)
   Claude Design 出力 (TD 組込1.4 / kumikomi.html) からポート。
   2026-06-16 全刷新取り込み。

   画面構成 (8 index / 5 番号ステップ):
   - scr 0: 商品概要 (STEP1) — パターンB 時は ScreenCombined に差し替え
   - scr 1: プラン選択 (STEP2)
   - scr 2: PINコード認証 (番号なし) — メール認証
   - scr 3: 申込フォーム (STEP3) — formSplit 時は 2 ページ
   - scr 4: 内容確認・お支払い (STEP4)
   - scr 5-6: クレジットカード承認 (外部 GMO、番号なし)
   - scr 7: 完了 (STEP5)

   tweaks: patternB (商品概要+プラン選択統合) / simFirst (積立金額・保障期間をプランより先に) / formSplit (フォーム2ページ分割)
           / errMode (入力エラー表示方式: none/inline/top/float) / benSameAddr (受取人住所: same/diff)
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

/* patternB 固定（商品概要+プラン選択統合）→ プラン選択は独立ステップとして表示しない。
   PIN認証は STEP2 として番号付き、カード承認(外部) は番号なし → 5 numbered steps total. */
const FLOW: FlowEntry[] = [
  { key: "overview", label: "商品概要",            en: "Product",          scr: [0] },
  { key: "pin",      label: "PINコード認証",        en: "PIN Verify",                    scr: [2] },
  { key: "form",     label: "申込フォーム",        en: "Application",      scr: [3] },
  { key: "step4",    label: "内容確認",            en: "Confirm",          scr: [4] },
  { key: "card",     label: "クレジットカード承認", en: "Card Auth (外部)", ext: true, noNum: true, scr: [5, 6] },
  { key: "done",     label: "完了",                en: "Complete",         scr: [7] },
];

const STEP_NUMS: (number | null)[] = (() => {
  let c = 0;
  return FLOW.map((f) => (f.noNum ? null : ++c));
})();
const TOTAL_STEPS = STEP_NUMS.filter((n) => n != null).length;

const stepOfScreen = (scr: number) => FLOW.findIndex((f) => f.scr.includes(scr));

function Rail({ scr, go }: { scr: number; go: (n: number) => void }) {
  const curStep = stepOfScreen(scr);
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 py-10 pr-8">
      <p className="font-mono text-caption tracking-[0.14em] uppercase text-neutral-400">
        Embedded Insurance
      </p>
      <h1 className="mt-1 text-h4 font-bold text-neutral-800">XXX 組込保険</h1>
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
  overviewMode,
  screenKey,
}: {
  children: React.ReactNode;
  external?: boolean;
  overviewMode?: boolean;
  screenKey?: number;
}) {
  const bezel = external ? "bg-neutral-400" : "bg-neutral-900";
  const notch = external ? "bg-neutral-500" : "bg-neutral-900";
  const status = external
    ? "bg-neutral-600 text-white"
    : overviewMode
      ? "text-neutral-800"
      : "text-primary-foreground";
  // ステータスバーは AppBar と連続する1枚グラデの上段 (TD 組込1.4)
  const statusStyle = (!external && !overviewMode) ? HEADER_GRAD_STATUS : undefined;
  return (
    <div className="relative">
      <div className={`w-[390px] h-[820px] rounded-[44px] ${bezel} p-3 shadow-2xl transition-colors duration-300`}>
        <div className="relative w-full h-full rounded-[34px] overflow-hidden flex flex-col" style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #F2FBFE 100%)" }}>
          {/* Notch pill — always visible */}
          <div className={`absolute left-1/2 -translate-x-1/2 top-2 w-28 h-6 rounded-full ${notch} z-30 pointer-events-none`} />
          {/* Status bar: hidden for overview (screen provides its own inside scroll) */}
          {!overviewMode && (
            <div className={`shrink-0 flex items-center justify-between px-6 pt-3 pb-1 text-caption font-en font-medium ${status}`} style={statusStyle}>
              <span>9:41</span>
              <span className="flex items-center gap-1"><span>5G</span><span>100%</span></span>
            </div>
          )}
          <div key={screenKey} className="screen-enter flex flex-col flex-1 min-h-[812px]">
            {children}
          </div>
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

const TWEAK_DEFAULTS = {
  // patternB は常に true（商品概要+プラン選択統合）— UI非表示
  patternB: true,
  simFirst: false,
  planCardStyle: "card" as string,
  errMode: "inline" as string,
  benSameAddr: true,
  kokuchiPattern: "auto" as string,
  doneVariant: "done" as string,
};

export function TheoTdfClaudeDesignShell() {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [scr, setScr] = React.useState(0);
  const [sel, setSel] = React.useState("cancer_d");
  const [simM, setSimM] = React.useState(10000); // 毎月の積立金額（共有）
  const [simY, setSimY] = React.useState(15);    // 保障期間（共有）
  const deathOpt = deathFromSel(sel); // 死亡保障あり/なし（selから導出）
  const [emailVerified, setEmailVerified] = React.useState(false);
  const [terminated, setTerminated] = React.useState(false); // 申込キャンセル→終了画面
  const NSCR = 8;

  const patternB = tw.patternB;

  const go = (n: number) => {
    let target = Math.max(0, Math.min(NSCR - 1, n));
    // scr=1 (ScreenStep2) は patternB 常時 ON のため非表示 — スキップ
    if (target === 1) target = n > scr ? 2 : 0;
    setTerminated(false);
    setScr(target);
  };

  const curStep = stepOfScreen(scr);
  const external = !!(FLOW[curStep] && FLOW[curStep].ext);
  const curStepNo = STEP_NUMS[curStep];
  const overviewMode = (scr === 0 || scr === 7) || terminated;

  const screens = [
    patternB ? (
      <ScreenCombined key="combined" go={go} sel={sel} setSel={setSel} deathOpt={deathOpt} m={simM} setM={setSimM} y={simY} setY={setSimY} emailVerified={emailVerified} simFirst={tw.simFirst} planCardStyle={tw.planCardStyle} />
    ) : (
      <ScreenOverview key="overview" go={go} />
    ),
    <ScreenStep2 key="step2" go={go} sel={sel} setSel={setSel} deathOpt={deathOpt} m={simM} setM={setSimM} y={simY} setY={setSimY} emailVerified={emailVerified} simFirst={tw.simFirst} planCardStyle={tw.planCardStyle} />,
    <ScreenPin key="pin" go={go} onVerified={() => setEmailVerified(true)} backScr={patternB ? 0 : 1} />,
    <ScreenForm key="form" go={go} sel={sel} deathOpt={deathOpt} m={simM} setM={setSimM} y={simY} setY={setSimY} backScr={emailVerified ? (patternB ? 0 : 1) : 2} errMode={tw.errMode} onTerminate={() => setTerminated(true)} kokuchiPattern={tw.kokuchiPattern} />,
    <ScreenStep4 key="step4" go={go} sel={sel} deathOpt={deathOpt} m={simM} y={simY} benSameAddr={tw.benSameAddr} />,
    <ScreenCardInput key="card" go={go} />,
    <ScreenCardConfirm key="cardconf" go={go} />,
    <ScreenDone key="done" go={go} variant={tw.doneVariant} />,
  ];

  return (
    <div className="theo-tdf-cd font-jp min-h-screen w-full bg-warm-100 transition-colors duration-300">
      <div className="mx-auto max-w-[1400px] px-6 flex items-start gap-4">
        <Rail scr={scr} go={go} />
        <main className="flex-1 py-10 flex flex-col items-center gap-4">
          <Phone external={external} overviewMode={overviewMode} screenKey={terminated ? -1 : scr}>
            {terminated
              ? <ScreenEnded onRestart={() => { setTerminated(false); go(0); }} />
              : screens[scr]}
          </Phone>
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
        <TweaksSidebar>
          <TweakSection label="積立金額・保障期間を選ぶ" />
          <TweakToggle label="積立金額・保障期間をプランより先に" value={tw.simFirst} onChange={(v) => setTweak("simFirst", v)} />
          <TweakSection label="プラン選択" />
          <TweakSelect
            label="プランカード表示"
            value={tw.planCardStyle}
            onChange={(v) => setTweak("planCardStyle", v)}
            options={[
              { value: "card",      label: "現行カード（10枚並べ）" },
              { value: "accordion", label: "アコーディオン（提案）" },
            ]}
          />
          <TweakSection label="申込フォーム" />
          <TweakSelect
            label="入力エラー表示"
            value={tw.errMode}
            onChange={(v) => setTweak("errMode", v)}
            options={[
              { value: "none",   label: "エラーなし" },
              { value: "inline", label: "① 各入力の下に赤字" },
              { value: "top",    label: "② 上部にまとめて（クリックで移動）" },
              { value: "float",  label: "③ 下部フローティング（提案）" },
            ]}
          />
          <TweakSelect
            label="告知項目パターン"
            value={tw.kokuchiPattern}
            onChange={(v) => setTweak("kokuchiPattern", v)}
            options={[
              { value: "auto",     label: "自動（選択中のプラン）" },
              { value: "care_d",   label: "① 障害・介護プラン（死亡あり）" },
              { value: "care_n",   label: "② 障害・介護プラン" },
              { value: "cancer_d", label: "③ がんプラン（死亡あり）" },
              { value: "cancer_n", label: "④ がんプラン" },
              { value: "cc_d",     label: "⑤ がん・障害介護プラン（死亡あり）" },
              { value: "cc_n",     label: "⑥ がん・障害介護プラン" },
              { value: "three_d",  label: "⑦ 三大疾病プラン（死亡あり）" },
              { value: "three_n",  label: "⑧ 三大疾病プラン" },
              { value: "tc_d",     label: "⑨ 三大疾病・障害介護プラン（死亡あり）" },
              { value: "tc_n",     label: "⑩ 三大疾病・障害介護プラン" },
            ]}
          />
          <TweakSection label="内容確認画面" />
          <TweakSelect
            label="保険金受取人の住所"
            value={tw.benSameAddr ? "same" : "diff"}
            onChange={(v) => setTweak("benSameAddr", v === "same")}
            options={[
              { value: "same", label: "契約者と同じ（チェック）" },
              { value: "diff", label: "別住所を入力" },
            ]}
          />
          <TweakSection label="完了画面" />
          <TweakSelect
            label="表示状態"
            value={tw.doneVariant}
            onChange={(v) => setTweak("doneVariant", v)}
            options={[
              { value: "done",       label: "完了" },
              { value: "processing", label: "処理中" },
              { value: "error",      label: "処理エラー" },
              { value: "maint",      label: "メンテナンス中" },
              { value: "ended",      label: "申込みキャンセル" },
            ]}
          />
        </TweaksSidebar>
      </div>
    </div>
  );
}
