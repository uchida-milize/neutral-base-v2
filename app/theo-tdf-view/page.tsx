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
 * /theo-tdf-view?s=N
 *
 * 画面番号 s (0–7) を受け取り、その画面をフレームなしでベア描画する。
 * ブラウザ幅 390px で正しく見える。
 * プロトタイプ画面の「HTMLで開く」ボタンからリンクされる。
 *
 * s=0  商品概要
 * s=1  プラン選択
 * s=2  PINコード認証
 * s=3  申込フォーム
 * s=4  内容確認・お支払い
 * s=5  クレジットカード入力（外部）
 * s=6  クレジットカード確認（外部）
 * s=7  完了
 */
function ViewContent() {
  const params = useSearchParams();
  const raw = parseInt(params.get("s") ?? "0", 10);
  const noop = () => {};

  const screens: React.ReactNode[] = [
    <ScreenOverview key="0" go={noop} />,
    <ScreenStep2
      key="1"
      go={noop}
      sel="cancer_d"
      setSel={noop}
      m={10000}
      setM={noop}
      y={15}
      setY={noop}
    />,
    <ScreenPin key="2" go={noop} />,
    <ScreenForm
      key="3"
      go={noop}
      sel="cancer_d"
      m={10000}
      setM={noop}
      y={15}
      setY={noop}
      initialDisclosureOpen={false}
    />,
    <ScreenStep4 key="4" go={noop} sel="cancer_d" m={10000} y={15} />,
    <ScreenCardInput key="5" go={noop} />,
    <ScreenCardConfirm key="6" go={noop} />,
    <ScreenDone key="7" go={noop} />,
  ];

  const idx = Math.max(0, Math.min(screens.length - 1, isNaN(raw) ? 0 : raw));
  return <div className="flex flex-col min-h-screen">{screens[idx]}</div>;
}

export default function TheoTdfViewPage() {
  return (
    <React.Suspense>
      <ViewContent />
    </React.Suspense>
  );
}
