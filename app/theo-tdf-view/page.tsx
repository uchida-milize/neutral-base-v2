"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

import {
  ScreenIntro,
  ScreenOverview,
  ScreenCombined,
  ScreenStep2,
  ScreenPin,
  ScreenForm,
  ScreenStep4,
  ScreenCardInput,
  ScreenCardConfirm,
  ScreenDone,
  ScreenStatus,
  ScreenEnded,
  deathFromSel,
} from "@/components/theo-tdf/claude-design/screens";

/**
 * /theo-tdf-view
 *
 * クエリパラメータ:
 *   intro          "1" でイントロ画面（ScreenIntro）を表示
 *   s              画面番号 0–7
 *   patternB       "1" でパターンB（ScreenCombined）
 *   planCardStyle  "card" | "accordion"
 *   planOpenId     初期展開プランID（accordion時）
 *   simFirst       "1" で積立金額・保障期間をプランより先に
 *   showSend       "1" でCTAエリアを表示済み状態（ページ下部まで到達済み）
 *   agree          "1" で同意チェック済み状態（CTA活性）
 *   errMode        "none" | "inline" | "top" | "float"
 *   errStep        フローティングエラーの初期ステップ（0–3）
 *   kokuchiPattern 告知パターン（care_d / care_n / cancer_d / ... / tc_n）
 *   disclosure     "1" で告知モーダルを開いた状態で表示
 *   kokuchiAgree   "1" で告知事項同意チェック済み状態
 *   editKiyaku     "1" で契約者情報編集展開
 *   editJuushin    "1" で保険金受取人編集展開
 *   benSameAddr    "0" で受取人住所を個別入力
 *   doneVariant    "done" | "processing" | "error" | "maint"
 */
function ViewContent() {
  const params = useSearchParams();

  const intro        = params.get("intro") === "1";
  const s            = parseInt(params.get("s") ?? "0", 10);
  const patternB     = params.get("patternB") === "1";
  const planCardStyle = params.get("planCardStyle") ?? "card";
  const planOpenId   = params.get("planOpenId") ?? undefined;
  const simFirst     = params.get("simFirst") === "1";
  const showSend     = params.get("showSend") === "1";
  const agree        = params.get("agree") === "1";
  const errMode      = params.get("errMode") ?? "none";
  const errStep      = params.get("errStep") ? parseInt(params.get("errStep")!, 10) : 0;
  const kokuchiPat   = params.get("kokuchiPattern") ?? "auto";
  const disclosure     = params.get("disclosure") === "1";
  const kokuchiAgree   = params.get("kokuchiAgree") === "1";
  const editKiyaku   = params.get("editKiyaku") === "1";
  const editJuushin  = params.get("editJuushin") === "1";
  const benSameAddr  = params.get("benSameAddr") !== "0";
  const doneVariant  = params.get("doneVariant") ?? "done";

  const noop = () => {};
  const sel = "cancer_d";
  const deathOpt = deathFromSel(sel);

  /* 完了画面: doneVariant が processing/error/maint の場合は ScreenStatus、ended の場合は ScreenEnded */
  const doneScreen = doneVariant === "done"
    ? <ScreenDone key="7" go={noop} />
    : doneVariant === "ended"
    ? <ScreenEnded key="7e" onRestart={noop} />
    : <ScreenStatus key="7s" variant={doneVariant as "processing" | "error" | "maint"} go={noop} />;

  const screens: React.ReactNode[] = [
    /* 0 商品概要 — patternB=1 の場合は ScreenCombined */
    patternB
      ? <ScreenCombined key="0b" go={noop} sel={sel} setSel={noop} deathOpt={deathOpt}
          m={10000} setM={noop} y={15} setY={noop} simFirst={simFirst} planCardStyle={planCardStyle}
          initialShowSend={showSend} initialAgree={agree} />
      : <ScreenOverview key="0" go={noop} />,

    /* 1 プラン選択 */
    <ScreenStep2
      key="1"
      go={noop} sel={sel} setSel={noop}
      m={10000} setM={noop} y={15} setY={noop}
      planCardStyle={planCardStyle}
      simFirst={simFirst}
      initialPlanOpenId={planOpenId}
    />,

    /* 2 PINコード認証 */
    <ScreenPin key="2" go={noop} />,

    /* 3 申込フォーム */
    <ScreenForm
      key="3"
      go={noop} sel={sel}
      m={10000} setM={noop} y={15} setY={noop}
      initialDisclosureOpen={disclosure}
      initialKokuchiAgreed={kokuchiAgree}
      errMode={errMode}
      initialErrStep={errStep}
      kokuchiPattern={kokuchiPat}
    />,

    /* 4 内容確認・お支払い */
    <ScreenStep4
      key="4"
      go={noop} sel={sel} m={10000} y={15}
      benSameAddr={benSameAddr}
      initialEditKiyaku={editKiyaku}
      initialEditJuushin={editJuushin}
    />,

    /* 5 クレジットカード入力（外部） */
    <ScreenCardInput key="5" go={noop} />,

    /* 6 クレジットカード確認（外部） */
    <ScreenCardConfirm key="6" go={noop} />,

    /* 7 完了 / 処理中 / エラー / メンテナンス */
    doneScreen,
  ];

  /* intro=1 の場合は ScreenIntro を優先表示 */
  if (intro) {
    return <div className="flex flex-col min-h-screen"><ScreenIntro go={noop} /></div>;
  }

  const idx = Math.max(0, Math.min(screens.length - 1, isNaN(s) ? 0 : s));
  return <div className="flex flex-col min-h-screen">{screens[idx]}</div>;
}

export default function TheoTdfViewPage() {
  return (
    <React.Suspense>
      <ViewContent />
    </React.Suspense>
  );
}
