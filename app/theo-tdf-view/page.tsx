"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

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
 * /theo-tdf-view
 *
 * クエリパラメータ:
 *   s              画面番号 0–7
 *   planCardStyle  "card" | "accordion"
 *   planOpenId     初期展開プランID（accordion時）
 *   simFirst       "1" で積立金額・保障期間をプランより先に
 *   errMode        "none" | "inline" | "top" | "float"
 *   errStep        フローティングエラーの初期ステップ（0–3）
 *   kokuchiPattern 告知パターン（care_d / care_n / cancer_d / ... / tc_n）
 *   disclosure     "1" で告知モーダル（DisclosureSheet）を開いた状態で表示
 *   editKiyaku     "1" で契約者情報編集展開
 *   editJuushin    "1" で保険金受取人編集展開
 *   benSameAddr    "0" で受取人住所を個別入力
 */
function ViewContent() {
  const params = useSearchParams();

  const s            = parseInt(params.get("s") ?? "0", 10);
  const planCardStyle = params.get("planCardStyle") ?? "card";
  const planOpenId   = params.get("planOpenId") ?? undefined;
  const simFirst     = params.get("simFirst") === "1";
  const errMode      = params.get("errMode") ?? "none";
  const errStep      = params.get("errStep") ? parseInt(params.get("errStep")!, 10) : 0;
  const kokuchiPat   = params.get("kokuchiPattern") ?? "auto";
  const disclosure   = params.get("disclosure") === "1";
  const editKiyaku   = params.get("editKiyaku") === "1";
  const editJuushin  = params.get("editJuushin") === "1";
  const benSameAddr  = params.get("benSameAddr") !== "0";

  const noop = () => {};

  const screens: React.ReactNode[] = [
    /* 0 商品概要 */
    <ScreenOverview key="0" go={noop} />,

    /* 1 プラン選択 */
    <ScreenStep2
      key="1"
      go={noop} sel="cancer_d" setSel={noop}
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
      go={noop} sel="cancer_d"
      m={10000} setM={noop} y={15} setY={noop}
      initialDisclosureOpen={disclosure}
      errMode={errMode}
      initialErrStep={errStep}
      kokuchiPattern={kokuchiPat}
    />,

    /* 4 内容確認・お支払い */
    <ScreenStep4
      key="4"
      go={noop} sel="cancer_d" m={10000} y={15}
      benSameAddr={benSameAddr}
      initialEditKiyaku={editKiyaku}
      initialEditJuushin={editJuushin}
    />,

    /* 5 クレジットカード入力（外部） */
    <ScreenCardInput key="5" go={noop} />,

    /* 6 クレジットカード確認（外部） */
    <ScreenCardConfirm key="6" go={noop} />,

    /* 7 完了 */
    <ScreenDone key="7" go={noop} />,
  ];

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
