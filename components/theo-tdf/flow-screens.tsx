"use client";

import * as React from "react";

import { FLOW_META, type FlowStepMeta } from "@/components/theo-tdf/flow-meta";

/**
 * THEO × T&Dファイナンシャル 申込フロー — 画像ベース画面実装。
 *
 * 一次ソース: uploads/組込申込画面.xlsx Sheet1「汎用_画面案」の埋め込み画像
 *   抽出: /sessions/.../outputs/extracted-images/ から theo-tdf/screens/ へ配置
 *   配置先: public/assets/theo-tdf/screens/01-lp.png 〜 07-complete.png
 *
 * 設計方針:
 *   - 各画面は本来 React コンポーネントで再現すべきだが、まずは原本 PNG を
 *     iPhone フレーム内にそのまま表示することで、お客様提示の鮮度を最優先する。
 *   - 後日 Claude Design 等で TSX 化したら、この ScreenImg を React 実装に
 *     置き換える (置き換え単位はファイル単位、FLOW 配列の Component を差し替え)。
 *   - CTA ボタンはオーバーレイで上書きする余地があるが、現時点は画像クリックで
 *     onNext / onBack を発火させ「タップ可能なホットゾーン」のみ React で重ねる。
 */

export type ScreenProps = {
  onNext: () => void;
  onBack: () => void;
};

/* ===============================================================
 * ScreenImg — 共通の画像表示コンポーネント
 *
 * iPhone フレーム内側 (375px) に幅合わせで表示。画像は本来の比率を保つ。
 * 縦長コンテンツは flow-prototype 側の viewport で自動スクロール。
 * =============================================================== */

function ScreenImg({
  src,
  alt,
  onNext,
  onBack,
}: {
  src: string;
  alt: string;
} & ScreenProps) {
  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        background: "#fff",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element --
          プロトタイプ画面は本来の縦長アスペクトを保ったまま 375px viewport に
          width: 100% で流し込むため、次元固定が必要な next/image より生 img が適している。
          実装が React 化されたら本来の <Component /> に置き換えるので暫定。 */}
      <img
        src={src}
        alt={alt}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          userSelect: "none",
        }}
        draggable={false}
      />
      {/* 画面下端の透明ホットゾーン — クリックで次へ */}
      <button
        type="button"
        aria-label={`${alt} の次へ進む`}
        onClick={onNext}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 88,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          appearance: "none",
        }}
      />
      {/* 画面左上の透明ホットゾーン — クリックで戻る */}
      <button
        type="button"
        aria-label={`${alt} の前へ戻る`}
        onClick={onBack}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 80,
          height: 64,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          appearance: "none",
        }}
      />
    </div>
  );
}

/* ===============================================================
 * Flow definition
 * =============================================================== */

export type FlowStep = FlowStepMeta & {
  Component: React.ComponentType<ScreenProps>;
};

const ASSET_BASE = "/assets/theo-tdf/screens";

export const FLOW: FlowStep[] = FLOW_META.map((m) => ({
  ...m,
  Component: (props: ScreenProps) => (
    <ScreenImg
      src={`${ASSET_BASE}/${m.image}`}
      alt={m.label}
      {...props}
    />
  ),
}));
