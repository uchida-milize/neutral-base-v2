import * as React from "react";

/**
 * iPhone 14 Pro 風のベゼル。
 *
 * - 外殻: 黒のチタン色 + 立体感のあるシャドウ
 * - 内側: 既定 375 × 812 のスクリーン (rounded で角丸)
 * - ノッチ: Dynamic Island 風の横長ピル
 * - サイドボタン (音量 / ミュート / 電源) を擬似的に配置
 *
 * 俯瞰グリッドで縮小して並べるケースもあるため、`width` / `height` /
 * `scale` を props で差し替え可能。デフォルトは「単独表示」向け実寸。
 */
export type IphoneFrameProps = {
  children: React.ReactNode;
  /** 内側スクリーン幅 (px) — 既定 375 */
  width?: number;
  /** 内側スクリーン高さ (px) — 既定 812 */
  height?: number;
  /** 全体倍率 — 既定 1。0.6 等で俯瞰グリッドに並べやすくなる */
  scale?: number;
  /** 補足ラベル (任意) — フレーム下に表示 */
  label?: string;
};

export function IphoneFrame({
  children,
  width = 375,
  height = 812,
  scale = 1,
  label,
}: IphoneFrameProps) {
  return (
    <figure className="inline-flex flex-col items-center gap-3">
      <div
        className="relative shrink-0"
        style={{
          width: width * scale + 28, // ベゼル padding 14px × 2
          height: height * scale + 28,
        }}
      >
        {/* 立体感を出すための薄い影 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 translate-y-6 rounded-[3.2rem] bg-black/30 blur-2xl"
        />

        {/* 外殻 (ベゼル) — transform-origin top-left で scale 適用 */}
        <div
          className="
            absolute left-0 top-0
            origin-top-left
            rounded-[3rem]
            bg-zinc-950
            p-[14px]
            shadow-[0_30px_60px_-15px_rgba(0,0,0,0.55),0_0_0_2px_rgba(255,255,255,0.04)_inset,0_1px_0_rgba(255,255,255,0.08)_inset]
            ring-1 ring-black/60
          "
          style={{ transform: `scale(${scale})` }}
        >
          {/* サイドボタン (左: 音量・ミュート / 右: 電源) */}
          <span
            aria-hidden
            className="absolute left-[-3px] top-[110px] h-9 w-[3px] rounded-l-sm bg-zinc-800"
          />
          <span
            aria-hidden
            className="absolute left-[-3px] top-[170px] h-14 w-[3px] rounded-l-sm bg-zinc-800"
          />
          <span
            aria-hidden
            className="absolute left-[-3px] top-[240px] h-14 w-[3px] rounded-l-sm bg-zinc-800"
          />
          <span
            aria-hidden
            className="absolute right-[-3px] top-[180px] h-20 w-[3px] rounded-r-sm bg-zinc-800"
          />

          {/* 内側スクリーン */}
          <div
            className="
              relative
              overflow-hidden
              rounded-[2.25rem]
              bg-background
              transition-colors duration-300 ease-out
            "
            style={{ width, height }}
          >
            {/* Dynamic Island */}
            <div
              aria-hidden
              className="
                pointer-events-none
                absolute left-1/2 top-2 z-20
                h-[30px] w-[110px]
                -translate-x-1/2 rounded-full bg-black
              "
            />

            {/* スクリーン本体 (スクロール可能) */}
            <div className="h-full overflow-y-auto">{children}</div>
          </div>
        </div>
      </div>

      {label ? (
        <figcaption className="text-center text-xs text-muted-foreground">
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}
