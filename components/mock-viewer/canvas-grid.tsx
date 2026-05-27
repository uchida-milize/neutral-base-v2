import * as React from "react";

import { IphoneFrame } from "./iphone-frame";

/**
 * Figma キャンバス風の俯瞰グリッド。
 *
 * 複数の画面を iPhone フレームに入れたまま並べて、
 * 「情報要素」と「画面遷移の流れ」を一目で見せるためのレイアウト。
 *
 * 各フレームの上部に「1. ログイン画面」のような番号付きタイトルを添える。
 * scale を下げることで横にたくさん並べることも縦に積むこともできる。
 */
export type CanvasScreen = {
  /** 表示順 (1 始まり) */
  index: number;
  /** タイトル — フレーム上に大きめに表示 */
  title: string;
  /** 説明 — 任意。情報要素や遷移の意図を補足 */
  description?: string;
  /** 中身 (画面の React ノード) */
  content: React.ReactNode;
};

export type CanvasGridProps = {
  screens: CanvasScreen[];
  /** iPhone フレームの倍率 — 既定 0.55 (2×2 で見やすいサイズ) */
  scale?: number;
  /** グリッドの列数 — 既定 2 */
  columns?: 1 | 2 | 3 | 4;
  /** 画面サイズ (デフォルト 375×812) */
  width?: number;
  height?: number;
};

const COLUMNS_CLASS: Record<NonNullable<CanvasGridProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4",
};

export function CanvasGrid({
  screens,
  scale = 0.55,
  columns = 2,
  width = 375,
  height = 812,
}: CanvasGridProps) {
  return (
    <div
      className={`grid gap-x-10 gap-y-14 ${COLUMNS_CLASS[columns]}`}
      aria-label="Screens overview canvas"
    >
      {screens.map((s) => (
        <ScreenCell
          key={s.index}
          screen={s}
          scale={scale}
          width={width}
          height={height}
        />
      ))}
    </div>
  );
}

function ScreenCell({
  screen,
  scale,
  width,
  height,
}: {
  screen: CanvasScreen;
  scale: number;
  width: number;
  height: number;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <header className="w-full max-w-[var(--label-w,360px)] text-center">
        <p className="text-caption font-mono text-muted-foreground">
          {String(screen.index).padStart(2, "0")}
        </p>
        <h3 className="mt-1 text-h7 font-semibold">{screen.title}</h3>
        {screen.description ? (
          <p className="mt-1 text-caption text-muted-foreground">
            {screen.description}
          </p>
        ) : null}
      </header>
      <IphoneFrame width={width} height={height} scale={scale}>
        {screen.content}
      </IphoneFrame>
    </div>
  );
}
