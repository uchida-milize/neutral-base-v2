"use client";

import * as React from "react";

import { FLOW } from "@/components/aaa/flow-screens";

// `.aaa-flow` でスコープされた screen のスタイル。
import "@/components/aaa/flow.css";

/* =================================================================
 * iPhone ベゼル — flow-prototype.jsx 由来。
 *
 * 単独でも使えるが、本ファイルでは FlowPrototype の中だけで使用。
 * 外側 401 × 860 / 内側 375 × 834 (Dynamic Island モデル準拠)。
 * ================================================================= */

function IPhoneBezel({
  children,
  scale = 1,
}: {
  children: React.ReactNode;
  scale?: number;
}) {
  return (
    <div
      style={{
        width: 416 * scale,
        height: 860 * scale,
        background: "#0a0a0a",
        borderRadius: 56 * scale,
        padding: 13 * scale,
        boxShadow:
          "0 30px 80px -30px rgba(15, 23, 42, 0.45), 0 0 0 2px #1a1a1a inset",
        position: "relative",
        flex: "0 0 auto",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#fff",
          borderRadius: 44 * scale,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Dynamic island */}
        <div
          style={{
            position: "absolute",
            top: 11 * scale,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120 * scale,
            height: 34 * scale,
            background: "#0a0a0a",
            borderRadius: 20 * scale,
            zIndex: 30,
          }}
        />
        {/* Inner scroll viewport */}
        <div
          data-phone-viewport
          style={{
            width: "100%",
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0,0,0,0.15) transparent",
          }}
        >
          {/* Status bar spacer */}
          <div
            style={{
              height: 50 * scale,
              background: "transparent",
              position: "sticky",
              top: 0,
              zIndex: 25,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: `${17 * scale}px ${28 * scale}px 0 ${36 * scale}px`,
                fontSize: 14 * scale,
                fontWeight: 600,
                color: "#0f172a",
              }}
            >
              <span>9:41</span>
              <span style={{ display: "inline-flex", gap: 6 * scale, alignItems: "center" }}>
                <svg width={16 * scale} height={11 * scale} viewBox="0 0 19 12">
                  <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill="#0f172a" />
                  <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill="#0f172a" />
                  <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill="#0f172a" />
                  <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill="#0f172a" />
                </svg>
                <svg width={22 * scale} height={11 * scale} viewBox="0 0 27 13">
                  <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="#0f172a" strokeOpacity="0.4" fill="none" />
                  <rect x="2" y="2" width="20" height="9" rx="2" fill="#0f172a" />
                </svg>
              </span>
            </div>
          </div>
          {/* `.aaa-flow` でスコープした CSS を効かせる */}
          <div className="aaa-flow">{children}</div>
          {/* Home indicator bottom space */}
          <div style={{ height: 40 * scale }} />
        </div>
        {/* Home indicator bar */}
        <div
          style={{
            position: "absolute",
            bottom: 8 * scale,
            left: "50%",
            transform: "translateX(-50%)",
            width: 134 * scale,
            height: 5 * scale,
            borderRadius: 3 * scale,
            background: "#0a0a0a",
            opacity: 0.85,
            zIndex: 28,
          }}
        />
      </div>
    </div>
  );
}

/* =================================================================
 * 静的版 — Canvas (俯瞰) 用に 1 画面を非インタラクティブに描画する
 * ================================================================= */

/**
 * iPhone フレームに入れた版。`scale` 指定で縮小可能。
 * 並列比較で実機イメージを残したい場合に使う。
 */
export function TdfFlowStaticFrame({
  index,
  scale = 0.5,
}: {
  index: number;
  scale?: number;
}) {
  const step = FLOW[index];
  if (!step) return null;
  const noop = () => {};
  const Comp = step.Component;
  return (
    <IPhoneBezel scale={scale}>
      <Comp onNext={noop} onBack={noop} />
    </IPhoneBezel>
  );
}

/**
 * フレームなしの素の画面。`.phone` はpx 幅 / 高さは中身に追従。
 * 左右に並べるキャンバスで使う想定。
 */
export function TdfFlowScreenStatic({ index }: { index: number }) {
  const step = FLOW[index];
  if (!step) return null;
  const noop = () => {};
  const Comp = step.Component;
  return (
    <div
      className="aaa-flow"
      style={{
        // .phone がpx 幅なのに合わせて見やすく整える
        borderRadius: 18,
        overflow: "hidden",
        border: "1px solid var(--border-default, #e0e4ec)",
        boxShadow:
          "0 12px 28px -8px rgba(15, 23, 42, 0.16), 0 8px 16px -8px rgba(15, 23, 42, 0.06)",
        background: "var(--background-1, #f9fafc)",
      }}
    >
      <Comp onNext={noop} onBack={noop} />
    </div>
  );
}

/* =================================================================
 * FlowPrototype — チップでジャンプ + iPhone 内で 11 画面を進む/戻る
 * ================================================================= */

export function TdfFlowPrototype() {
  const [idx, setIdx] = React.useState(0);
  const viewportRef = React.useRef<HTMLDivElement>(null);

  // ステップ切替で iPhone 内スクロールを top に戻す
  React.useEffect(() => {
    const vp = viewportRef.current?.querySelector(
      "[data-phone-viewport]"
    ) as HTMLDivElement | null;
    if (vp) vp.scrollTop = 0;
  }, [idx]);

  const goNext = React.useCallback(() => {
    setIdx((i) => Math.min(i + 1, FLOW.length - 1));
  }, []);
  const goBack = React.useCallback(() => {
    setIdx((i) => Math.max(i - 1, 0));
  }, []);
  const reset = React.useCallback(() => setIdx(0), []);
  const jumpTo = React.useCallback((i: number) => setIdx(i), []);

  const step = FLOW[idx];
  const ScreenComp = step.Component;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        padding: "32px 24px 48px",
        background:
          "linear-gradient(180deg, var(--background-warm, #fafaf9) 0%, #fff 100%)",
        borderRadius: 24,
        border: "1px solid var(--border-warm, #f3e6d2)",
      }}
    >
      {/* Step jumper (chip row) */}
      <div
        style={{
          width: "100%",
          maxWidth: 920,
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          justifyContent: "center",
        }}
      >
        {FLOW.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => jumpTo(i)}
            style={{
              height: 28,
              padding: "0 12px",
              borderRadius: 999,
              border:
                i === idx
                  ? "1.5px solid var(--primary-color-500, #0f766e)"
                  : "1px solid var(--border-default, #e0e4ec)",
              background:
                i === idx ? "var(--primary-color-500, #0f766e)" : "#fff",
              color: i === idx ? "#fff" : "var(--text-sub, #475569)",
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                marginRight: 6,
                opacity: 0.7,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            {s.label}
          </button>
        ))}
      </div>

      {/* iPhone */}
      <div
        ref={viewportRef}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <IPhoneBezel>
          <ScreenComp onNext={goNext} onBack={goBack} />
        </IPhoneBezel>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--text-muted, #6b7280)",
          }}
        >
          {String(idx + 1).padStart(2, "0")} / {String(FLOW.length).padStart(2, "0")} ·{" "}
          {step.label}
        </div>
      </div>

      {/* Control bar */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          background: "#fff",
          border: "1px solid var(--border-default, #e0e4ec)",
          borderRadius: 999,
          padding: "6px 8px",
          boxShadow: "0 1px 3px 0 rgba(15, 23, 42, 0.06)",
        }}
      >
        <button
          type="button"
          onClick={goBack}
          disabled={idx === 0}
          style={{
            height: 36,
            padding: "0 16px",
            borderRadius: 999,
            border: "none",
            background: "transparent",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 600,
            color:
              idx === 0
                ? "var(--text-disabled, #c4cad8)"
                : "var(--text-main, #0f172a)",
            cursor: idx === 0 ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          前へ
        </button>
        <button
          type="button"
          onClick={reset}
          style={{
            height: 36,
            width: 36,
            borderRadius: "50%",
            border: "1px solid var(--border-default, #e0e4ec)",
            background: "#fff",
            cursor: "pointer",
            color: "var(--text-sub, #475569)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="最初に戻る"
          aria-label="最初に戻る"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 4v5h5" />
          </svg>
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={idx >= FLOW.length - 1}
          style={{
            height: 36,
            padding: "0 16px",
            borderRadius: 999,
            border: "none",
            background:
              idx >= FLOW.length - 1
                ? "var(--background-2, #f3f5f8)"
                : "var(--button-color-500, #d97706)",
            color:
              idx >= FLOW.length - 1
                ? "var(--text-disabled, #c4cad8)"
                : "#fff",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 700,
            cursor: idx >= FLOW.length - 1 ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          次へ
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div
        style={{
          fontSize: 11,
          color: "var(--text-muted, #6b7280)",
          textAlign: "center",
          maxWidth: 480,
          lineHeight: 1.7,
        }}
      >
        画面内の{" "}
        <strong style={{ color: "var(--button-color-500, #d97706)" }}>
          赤いボタン
        </strong>{" "}
        をタップすると次画面へ進みます。
        <br />
        上部のチップをクリックすると任意の画面に直接ジャンプできます。
      </div>
    </div>
  );
}
