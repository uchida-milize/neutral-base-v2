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

   TD 組込1.5-handoff (2): TweakSelect を追加 (errMode 4択 / benSameAddr)。
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

export function TweakSection({ label }: { label: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] tracking-[0.14em] uppercase mt-3 first:mt-0 mb-1 font-semibold" style={{ color: "var(--color-link, #0066d1)" }}>
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

export function TweakSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 py-1">
      <span className="text-caption text-neutral-500 leading-snug">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 rounded-lg border border-warm-200 bg-white px-2 text-caption text-neutral-700 focus:outline-none focus:ring-1 focus:ring-primary-300"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

/** 右カラム固定サイドバー版（3カラムレイアウト用） */
export function TweaksSidebar({
  title = "表示オプション",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="hidden xl:flex flex-col w-56 shrink-0 py-10">
      <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-neutral-400 mb-3 px-1">
        {title}
      </p>
      <div className="rounded-2xl border border-warm-200 bg-white shadow-sm p-4 space-y-0.5">
        {children}
      </div>
    </aside>
  );
}
