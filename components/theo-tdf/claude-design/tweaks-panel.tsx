"use client";

import * as React from "react";

/* ============================================================
   THEO 組込保険 — Tweaks パネル (TD 組込1.4)
   ============================================================
   Claude Design 出力の tweaks-panel.jsx を Cowork / Vercel 用に移植。
   元版は Claude Design エディタの host protocol (postMessage で
   __activate_edit_mode を受けて開く) 前提だったが、Vercel 単体では
   host が無く開けないため、ランチャー (歯車ボタン) で開閉する
   自己完結型に作り替えてある。表示パターン (A/B) や申込フォームの
   2 ページ分割といった検討用トグルをプロトタイプ上で切り替えられる。
   ============================================================ */

export function useTweaks<T extends Record<string, unknown>>(
  defaults: T,
): [T, (key: keyof T, value: unknown) => void] {
  const [tw, setTw] = React.useState<T>(defaults);
  const setTweak = React.useCallback((key: keyof T, value: unknown) => {
    setTw((prev) => ({
      ...prev,
      [key]: typeof value === "function" ? (value as (p: unknown) => unknown)(prev[key]) : value,
    }));
  }, []);
  return [tw, setTweak];
}

export function TweakSection({ label }: { label: string }) {
  return (
    <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-neutral-400 mt-3 first:mt-0 mb-1">
      {label}
    </p>
  );
}

export function TweakToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 py-1.5 cursor-pointer">
      <span className="text-caption text-neutral-700 leading-snug">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${value ? "bg-primary" : "bg-warm-300"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : ""}`}
        />
      </button>
    </label>
  );
}

export function TweaksPanel({
  title = "表示オプション",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="w-[390px]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full bg-white border border-warm-200 px-4 h-9 text-caption font-medium text-neutral-600 shadow-sm hover:border-warm-300"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        {title}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="mt-2 rounded-2xl border border-warm-200 bg-white shadow-lg p-4 fade-in">
          {children}
        </div>
      )}
    </div>
  );
}
