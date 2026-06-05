"use client";
/* eslint-disable @next/next/no-img-element --
   Claude Design 出力のプロトタイプ。<img> は logo / chart の静的アセット用で軽量。 */
/* eslint-disable @typescript-eslint/no-unused-expressions --
   `onInput && onInput()` パターンが多数あり、Claude Design 由来のスタイル維持のため許容。 */
/* eslint-disable @typescript-eslint/no-unused-vars --
   AppBar の `title` prop は将来用に予約済み。 */

import * as React from "react";
import { useState, useRef } from "react";

/* ============================================================
   THEO 組込保険 — Screens + shared wireframe atoms
   ============================================================
   Claude Design (claude.ai/design) 出力からポート。
   原典: TD 組込1-handoff.tar.gz / project/screens.jsx (2026-06-04 取り込み)

   2026-06-04 版での画面構成変更 (旧 10 画面 → 新 6 画面):
   - イントロ + プラン選択 + 補償内容 + メール送信 → ScreenStep2 (1ページ統合)
   - 内容確認 + お支払い登録 → ScreenStep4 (1ページ統合)
   - カード入力 / カード確認 (外部 GMO) は 2 画面のまま
   - ステッパーは全 4 ステップ (カード承認はステップ外)

   ポート時の変更点:
   - "use client"、ESM import (UMD React から)
   - text-h{2-7} → text-cd-h{2-7} に置換 (Claude Design の 16-34px scale)
   - アセットパス assets/... → /assets/theo-tdf/...
   - bg-success → bg-[color:var(--success)] (globals.css の theo-tdf-cd 区画で定義)
   - ローカル dark toggle は削除 (サイト共通 ThemeToggle が <html data-theme> を制御)
   - 最小限の inline 型付け
   ============================================================ */

/* ===================== 型定義 ===================== */
export type Plan = {
  id: string;
  name: string;
  price: string;
  lead: string;
  feat: string[];
  tag?: string;
};

export type AgreeBlock = {
  p?: string;
  ul?: string[];
  link?: string;
  note?: string;
  table?: string[][];
};

export type AgreeItemData = {
  t: string;
  blocks: AgreeBlock[];
};

type Go = (n: number) => void;
type SetNum = React.Dispatch<React.SetStateAction<number>>;
type SetStr = React.Dispatch<React.SetStateAction<string>>;

/* ---------------- ICONS (line / wireframe) ---------------- */
export const Ic = {
  chevL: (p: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 18l-6-6 6-6"/></svg>,
  chevR: (p: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 18l6-6-6-6"/></svg>,
  menu: (p: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M3 12h18M3 6h18M3 18h18"/></svg>,
  shield: (p: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z"/></svg>,
  chart: (p: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 19V5M4 19h16M8 16v-4M13 16V9M18 16v-7"/></svg>,
  doc: (p: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M9.5 13h6M9.5 16.5h6"/></svg>,
  check: (p: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6L9 17l-5-5"/></svg>,
  heart: (p: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 5.5c-1.8-1.7-4.6-1.5-6.3.3L12 6.5l-.7-.7C9.6 4 6.8 3.8 5 5.5c-2 1.9-2 5 0 7l7 6.8 7-6.8c2-2 2-5.1 0-7z"/></svg>,
  user: (p: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  tag: (p: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1"/></svg>,
};

/* ---------------- ATOMS ---------------- */
export function Badge({ children, tone = "secondary" }: { children: React.ReactNode; tone?: "secondary" | "primary" | "warm" }) {
  const map = {
    secondary: "bg-[color:var(--secondary-color-10)] text-[color:var(--secondary-color-700)]",
    primary: "bg-primary-10 text-primary-700",
    warm: "bg-warm-100 text-neutral-500",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-caption font-medium ${map[tone]}`}>
      {children}
    </span>
  );
}

export function PH({ className = "", label }: { className?: string; label: string }) {
  return <div className={`wf-ph rounded-lg text-caption ${className}`}>{label}</div>;
}

// Buttons — cta (申込/前進), button (通常), outline (罫線)
export function Btn({
  kind = "button",
  children,
  onClick,
  disabled,
  full = true,
}: {
  kind?: "cta" | "button" | "outline" | "ghost";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  full?: boolean;
}) {
  const base = "inline-flex items-center justify-center gap-1.5 rounded-xl px-4 h-12 text-cd-h7 font-bold transition-colors active:scale-[.99]";
  const kinds = {
    cta: "bg-cta-500 text-white hover:bg-cta-600",
    button: "bg-button-500 text-white hover:bg-button-600",
    outline: "border border-button-500 bg-white text-button-500 hover:bg-button-10",
    ghost: "text-neutral-500 hover:text-neutral-800",
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ opacity: disabled ? 0.4 : 1 }}
      className={`${base} ${kinds[kind]} ${full ? "w-full" : ""} ${disabled ? "cursor-not-allowed" : ""}`}>
      {children}
    </button>
  );
}

// Phone app bar (THEO header)
export function AppBar({ title, onBack, brandVisible = true }: { title?: string; onBack?: () => void; brandVisible?: boolean }) {
  return (
    <div className="sticky top-0 z-20 bg-primary text-primary-foreground">
      <div className="flex items-center justify-between px-3 h-14">
        <button onClick={onBack} className="grid place-items-center w-9 h-9 -ml-1 rounded-full hover:bg-white/10">
          {onBack ? <Ic.chevL className="w-5 h-5" /> : <span className="w-5" />}
        </button>
        <div className={`flex items-center gap-1.5 min-w-0 transition-opacity duration-200 ${brandVisible ? "opacity-100" : "opacity-0"}`}>
          <span className="font-en font-semibold tracking-[0.1em] text-cd-h7">THEO</span>
          <span className="text-cd-h7 font-medium truncate">つみたて安心ほけん</span>
          <span className="font-en text-[10px] font-medium opacity-75 shrink-0">&lt;THEO&gt;</span>
        </div>
        <button className="grid place-items-center w-9 h-9 -mr-1 rounded-full hover:bg-white/10">
          <Ic.menu className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// step progress dots
export function Steps({ n, of = 4 }: { n: number; of?: number }) {
  return (
    <div className="flex items-center gap-1.5 px-5 py-3 bg-white border-b border-warm-200">
      {Array.from({ length: of }).map((_, i) => (
        <div key={i} className={`h-1 flex-1 rounded-full ${i < n ? "bg-primary" : "bg-warm-200"}`} />
      ))}
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-caption tracking-[0.14em] uppercase text-neutral-400 mb-2">{children}</p>;
}

// 入力グループの囲い（契約者情報 / 保険金受取人 など）
export function GroupCard({
  title,
  sub,
  icon: Icon,
  children,
}: {
  title: string;
  sub?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-warm-200 bg-white overflow-hidden shadow-sm">
      <div className="flex items-center gap-2.5 px-5 py-3.5 bg-warm-50 border-b border-warm-200">
        {Icon && <span className="grid place-items-center w-8 h-8 rounded-full bg-primary-10 text-primary-600 shrink-0"><Icon className="w-4 h-4" /></span>}
        <div className="min-w-0">
          <p className="text-cd-h7 font-bold text-neutral-800 leading-tight">{title}</p>
          {sub && <p className="text-[11px] text-neutral-400 leading-tight">{sub}</p>}
        </div>
      </div>
      <div className="p-5 space-y-3">{children}</div>
    </section>
  );
}

// グループ内の小見出し（区切り）
export function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-2 mt-1 border-t border-warm-200">
      <p className="font-mono text-caption tracking-[0.14em] uppercase text-neutral-400">{children}</p>
    </div>
  );
}

// Bottom sticky action bar
export function ActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur border-t border-warm-200 px-5 py-3 space-y-2">
      {children}
    </div>
  );
}

// Wireframe form field
export function Field({
  label,
  placeholder,
  required,
  hint,
  value,
  disabled,
}: {
  label: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  value?: string;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-caption font-medium text-neutral-600">
        {label}{required && <span className="text-[color:var(--secondary-color-700)] ml-0.5">*</span>}
      </span>
      <input
        placeholder={placeholder}
        defaultValue={value}
        disabled={disabled}
        className={`fld h-11 rounded-lg border px-3 text-cd-h7 placeholder:text-neutral-400 ${disabled ? "border-warm-200 bg-warm-200/60 text-neutral-400 cursor-not-allowed" : "border-warm-300 bg-warm-50 text-neutral-800"}`}
      />
      {hint && <span className="text-caption text-neutral-400">{hint}</span>}
    </label>
  );
}

// Read-only / locked display field（入力済み・変更不可）
export function LockedField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-center gap-2 text-caption font-medium text-neutral-600">
        {label}
        <span className="inline-flex items-center gap-1 rounded-full bg-warm-200 px-2 py-0.5 text-[10px] font-medium text-neutral-500">変更不可</span>
      </span>
      <div className="flex items-center justify-between h-11 rounded-lg border border-warm-200 bg-warm-200/60 px-3 text-cd-h7 text-neutral-500">
        <span>{value}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 text-neutral-400"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
      </div>
    </div>
  );
}

// Wireframe select (dropdown)
export function Select({
  label,
  required,
  hint,
  value,
  options = [],
  disabled,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  value?: string;
  options?: string[];
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-caption font-medium text-neutral-600">
        {label}{required && <span className="text-[color:var(--secondary-color-700)] ml-0.5">*</span>}
      </span>
      <div className="relative">
        <select defaultValue={value} disabled={disabled}
          className={`fld appearance-none w-full h-11 rounded-lg border px-3 pr-9 text-cd-h7 ${disabled ? "border-warm-200 bg-warm-200/60 text-neutral-400 cursor-not-allowed" : "border-warm-300 bg-warm-50 text-neutral-800"}`}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"><path d="M6 9l6 6 6-6"/></svg>
      </div>
      {hint && <span className="text-caption text-neutral-400">{hint}</span>}
    </label>
  );
}

export const PREFS = ["都道府県を選択","北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"];

/* ============================================================
   プラン定義
   ============================================================ */
export const PLANS: Plan[] = [
  { id: "a", name: "障害・介護", price: "¥480", lead: "障害・介護状態になった場合に、給付金が支払われます",
    feat: ["給付：月額 最大 ¥50,000", "保険期間：1年（自動更新）", "免責期間：60日"] },
  { id: "b", name: "がん", price: "¥980", lead: "初めてがんと診断された場合に、給付金が支払われます",
    feat: ["診断一時金：¥300,000", "保険期間：1年", "告知のみ・診査不要"] },
  { id: "c", name: "安心セット", tag: "おすすめ", price: "¥1,290", lead: "障害・介護状態になった場合、または初めてがんと診断された場合に、給付金が支払われます",
    feat: ["障害・介護：月額 最大 ¥50,000", "がん診断一時金：¥300,000", "保険期間：1年（自動更新）"] },
];

export function PlanCard({ p, selected, onSelect }: { p: Plan; selected: boolean; onSelect: () => void }) {
  return (
    <button onClick={onSelect} className={`w-full text-left rounded-2xl border bg-white p-4 transition ${selected ? "border-primary ring-2 ring-primary/30" : "border-warm-200"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`grid place-items-center w-5 h-5 rounded-full border-2 ${selected ? "border-primary bg-primary text-white" : "border-warm-300"}`}>
            {selected && <Ic.check className="w-3 h-3" />}
          </span>
          <span className="text-cd-h7 font-bold text-neutral-800">{p.name}</span>
        </div>
        {p.tag && <Badge tone="secondary">{p.tag}</Badge>}
      </div>
      <p className="mt-2 text-caption text-neutral-500">{p.lead}</p>
      <div className="mt-3 flex items-baseline justify-end gap-1 text-neutral-800">
        <span className="font-en text-cd-h4 font-semibold tabular-nums">{p.price.replace("¥", "")}</span><span className="text-caption"> 円 / 月</span>
      </div>
      <ul className="mt-3 space-y-1.5 border-t border-warm-200 pt-3">
        {p.feat.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-caption text-neutral-600">
            <Ic.check className="w-3.5 h-3.5 text-primary shrink-0" />{f.replace(/¥([\d,]+)/g, "$1 円")}
          </li>
        ))}
      </ul>
    </button>
  );
}

/* Divider used inside combined (multi-section) pages */
export function StepSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="font-mono text-caption tracking-[0.14em] uppercase text-primary-600 whitespace-nowrap">{label}</span>
        <span className="flex-1 h-px bg-warm-200" />
      </div>
      {children}
    </section>
  );
}

/* ============================================================
   共有部品 — 確認 Row / 金額体裁 / シミュレーション
   ============================================================ */
export function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-warm-200 last:border-0">
      <span className="text-caption text-neutral-500">{k}</span>
      <span className={`text-cd-h7 ${strong ? "font-bold text-neutral-900" : "text-neutral-700"}`}>{v}</span>
    </div>
  );
}

// 補償項目の金額表示を「50,000 円」体裁（大きな数字＋円）に整形
export function FeatValue({ v }: { v?: string }) {
  const m = (v || "").match(/^(.*?)¥([\d,]+)(.*)$/);
  if (!m) return <span className="text-cd-h7 text-neutral-700">{v}</span>;
  const [, pre, num, post] = m;
  return (
    <span className="text-neutral-700 whitespace-nowrap">
      {pre && <span className="text-caption text-neutral-500">{pre}</span>}
      <span className="font-en text-cd-h5 font-semibold text-primary-600 tabular-nums">{num}</span>
      <span className="text-caption"> 円{post}</span>
    </span>
  );
}

// Shared 積立スライダー（Simulator と 申込フォームの修正シートで共用）
export function SimSliders({
  m,
  setM,
  y,
  setY,
  onInput,
}: {
  m: number;
  setM: SetNum;
  y: number;
  setY: SetNum;
  onInput?: () => void;
}) {
  const yen = (v: number) => v.toLocaleString("ja-JP");
  const sliderStyle: React.CSSProperties = { accentColor: "var(--primary-color-500)" };
  const onM = (e: React.ChangeEvent<HTMLInputElement>) => { setM(+e.target.value); onInput && onInput(); };
  const onY = (e: React.ChangeEvent<HTMLInputElement>) => { setY(+e.target.value); onInput && onInput(); };
  return (
    <>
      <div className="mb-5">
        <div className="flex items-start justify-between gap-2">
          <span className="text-cd-h7 font-medium text-neutral-800 leading-snug">毎月の積立金額<br/><span className="text-caption text-neutral-500">（ご希望給付額）</span></span>
          <span className="text-neutral-800">
            <span className="font-en text-cd-h5 font-semibold text-primary-600 tabular-nums">{yen(m)}</span>
            <span className="text-caption"> 円</span>
          </span>
        </div>
        <input type="range" min="5000" max="50000" step="1000" value={m} onChange={onM}
          style={sliderStyle} className="w-full mt-2 h-1.5 cursor-pointer" />
        <div className="flex justify-between font-mono text-[10px] text-neutral-400 mt-1">
          <span>5,000円</span><span>50,000円</span>
        </div>
      </div>

      <div className="mb-1">
        <div className="flex items-baseline justify-between">
          <span className="text-cd-h7 font-medium text-neutral-800">保障期間</span>
          <span className="text-neutral-800">
            <span className="font-en text-cd-h5 font-semibold text-primary-600 tabular-nums">{y}</span>
            <span className="text-caption"> 年</span>
          </span>
        </div>
        <input type="range" min="5" max="30" step="1" value={y} onChange={onY}
          style={sliderStyle} className="w-full mt-2 h-1.5 cursor-pointer" />
        <div className="flex justify-between font-mono text-[10px] text-neutral-400 mt-1">
          <span>5年</span><span>30年</span>
        </div>
      </div>
    </>
  );
}

// 給付予想額テーブル（m, y から算出）
export function BenefitTable({ m, y }: { m: number; y: number }) {
  const startAge = 30;
  const man = (v: number) => Math.round(v / 10000).toLocaleString("ja-JP");
  const yen = (v: number) => v.toLocaleString("ja-JP");
  const annual = m * 12;
  const maxBenefit = annual * y;
  const rows: { n: number; age: number; premium: number; benefit: number; cum: number }[] = [];
  for (let n = 0; n <= y; n++) {
    const age = startAge + n;
    const benefit = annual * (y - n);
    const cum = annual * n;
    const premium = Math.round(benefit * 0.00025 * (1 + (age - startAge) * 0.01));
    rows.push({ n, age, premium, benefit, cum });
  }
  return (
    <>
      <div className="flex items-center justify-between rounded-xl bg-primary-10 px-4 py-3">
        <span className="text-caption font-medium text-primary-700">最大給付金額　0年目</span>
        <span className="text-primary-600">
          <span className="font-en text-cd-h3 font-semibold tabular-nums">{man(maxBenefit)}</span>
          <span className="text-cd-h7"> 万円</span>
        </span>
      </div>
      <div className="mt-3 rounded-xl border border-warm-200 overflow-hidden">
        <div className="max-h-72 overflow-y-auto no-sb">
          <table className="w-full text-caption tabular-nums">
            <thead className="sticky top-0 bg-warm-100 text-neutral-500">
              <tr>
                {["経過", "年齢", "月払保険料", "給付金額", "合計積立"].map((h) => (
                  <th key={h} className="font-medium text-left px-2.5 py-2 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.n} className={`border-t border-warm-200 ${r.n === 0 ? "bg-primary-10/60 font-medium text-neutral-900" : "text-neutral-700"}`}>
                  <td className="px-2.5 py-2 whitespace-nowrap">{r.n}年</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{r.age}歳</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{yen(r.premium)}円</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{man(r.benefit)}万円</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{man(r.cum)}万円</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-2 text-[10px] text-neutral-400 leading-relaxed">
        ※ 表示金額は試算であり、実際の保険料・給付額を保証するものではありません。
      </p>
    </>
  );
}

export function Simulator({ m, setM, y, setY, initialSimOpen }: { m: number; setM: SetNum; y: number; setY: SetNum; initialSimOpen?: boolean }) {
  const [open, setOpen] = useState(initialSimOpen ?? false);
  return (
    <div className="rounded-2xl border border-warm-200 bg-white p-5">
      <SectionLabel>保険料シミュレーション</SectionLabel>
      <p className="text-caption text-neutral-600 leading-relaxed mb-5">
        保障する積立金額や保障期間を選択して、毎月の保険料を確認してみましょう。
      </p>

      <SimSliders m={m} setM={setM} y={y} setY={setY} onInput={() => setOpen(true)} />

      <button onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full mt-4 pt-4 border-t border-warm-200 text-left">
        <span className="text-cd-h7 font-bold text-neutral-800">給付予想額をみる</span>
        <span className={`grid place-items-center w-7 h-7 rounded-full bg-warm-100 text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`}>
          <Ic.chevR className="w-4 h-4 rotate-90" />
        </span>
      </button>

      <div style={{ maxHeight: open ? "1600px" : "0px", opacity: open ? 1 : 0, marginTop: open ? "16px" : "0px" }}
        className="overflow-hidden transition-all duration-300 ease-out">
        <BenefitTable m={m} y={y} />
      </div>
    </div>
  );
}

/* ============================================================
   STEP 2 — プラン選択 ＋ 補償内容 ＋ 不足分メール送信（1ページ）
   ============================================================ */
export function ScreenStep2({
  go,
  sel,
  setSel,
  m,
  setM,
  y,
  setY,
  initialNoticeOpen,
  initialAgree,
  initialSimOpen,
}: {
  go: Go;
  sel: string;
  setSel: SetStr;
  m: number;
  setM: SetNum;
  y: number;
  setY: SetNum;
  initialNoticeOpen?: boolean;
  initialAgree?: boolean;
  initialSimOpen?: boolean;
}) {
  const plan = PLANS.find((p) => p.id === sel) || PLANS[0];
  const [agree, setAgree] = useState(initialAgree ?? false);
  const [noticeOpen, setNoticeOpen] = useState(initialNoticeOpen ?? false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [solid, setSolid] = useState(false);
  const bindScroll = (el: HTMLDivElement | null) => {
    const node = el as (HTMLDivElement & { __theoBound?: boolean }) | null;
    if (!node || node.__theoBound) return;
    node.__theoBound = true;
    node.addEventListener("scroll", () => {
      const h = heroRef.current;
      setSolid(node.scrollTop >= (h ? h.offsetHeight - 16 : 220));
    }, { passive: true });
  };
  return (
    <>
      <AppBar title="保険" brandVisible={solid} />
      <div ref={bindScroll} className="flex-1 overflow-y-auto no-sb">

        {/* ---- イントロ / ヒーロー ---- */}
        <div ref={heroRef} className="bg-primary text-primary-foreground px-5 pt-6 pb-8">
          <img src="/assets/theo-tdf/logo_theo_insurance.svg" alt="THEO つみたて安心ほけん" className="mb-5" style={{ height: "2.275rem" }} />
          <p className="font-en text-caption tracking-[0.18em] uppercase opacity-80">Embedded Insurance</p>
          <h1 className="mt-2 font-bold leading-snug" style={{ fontSize: "36.4px", lineHeight: 1.3 }}>つみたてながら、<br/>もしもに備える。</h1>
          <p className="mt-3 text-cd-h7 leading-relaxed opacity-90">THEO ご利用者さま向け、<br/>保険のお申込みページです。</p>
        </div>

        {/* progress — sticks to top once the blue hero scrolls out of view */}
        <div className="sticky top-0 z-30">
          <Steps n={1} />
        </div>

        <div className="px-5 py-6 space-y-8">
          {/* hook card */}
          <div className="space-y-6">
            <div className="-mx-1">
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="font-mono text-caption tracking-[0.14em] uppercase text-neutral-400">このアプリだけの備え</p>
                <img src="/assets/theo-tdf/logo_td.png" alt="T&Dフィナンシャル生命" className="h-4 shrink-0" />
              </div>
              <p className="text-cd-h5 font-bold text-neutral-800 leading-relaxed">
                働けなくなっても、<br/>つみたては止めない。
              </p>
              <p className="mt-2 text-cd-h7 text-neutral-500 leading-relaxed">
                就業不能時に、毎月の積立額を保険金として給付。資産形成の歩みを止めません。
              </p>
              <div className="mt-4 overflow-hidden">
                <img src="/assets/theo-tdf/chart_savings.png" alt="就業不能時も将来の積立金額を保障するイメージ図" className="w-full block" />
              </div>
            </div>

            {/* value points */}
            <div className="space-y-3">
              {[
                { i: Ic.shield, t: "申込みは10分", d: "クレジットカード払い。入力は最小限。" },
                { i: Ic.chart,  t: "マイページでかんたん運用管理", d: "保険料の変更、給付額の変更、ご請求、控除証明書。" },
                { i: Ic.heart,  t: "少額から、毎月", d: "月額数百円から。いつでも見直し可能。" },
              ].map((v, k) => (
                <div key={k} className="flex items-start gap-3 rounded-xl border border-warm-200 bg-white p-4">
                  <div className="grid place-items-center w-10 h-10 rounded-full bg-primary-10 text-primary-600 shrink-0">
                    <v.i className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-cd-h7 font-bold text-neutral-800">{v.t}</p>
                    <p className="text-caption text-neutral-500 leading-relaxed">{v.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---- プラン選択 ---- */}
        <StepSection label="プラン選択">
          <div>
            <h2 className="text-cd-h5 font-bold text-neutral-800">プランを選ぶ</h2>
            <p className="text-caption text-neutral-500 mt-1">ご希望の保障プランをご選択ください</p>
          </div>
          {PLANS.map((p) => (
            <PlanCard key={p.id} p={p} selected={sel === p.id} onSelect={() => setSel(p.id)} />
          ))}
          <p className="text-caption text-neutral-500 leading-relaxed px-1">
            ※ 保険料は年齢・性別により変動します。
          </p>
        </StepSection>

        {/* ---- 補償内容 ---- */}
        <StepSection label="補償内容">
          <div className="rounded-2xl border border-warm-200 bg-white p-5">
            <SectionLabel>補償項目</SectionLabel>
            <div className="py-3 border-b border-warm-200">
              <p className="text-caption text-neutral-500">保険名称</p>
              <p className="mt-0.5 text-cd-h7 font-medium text-neutral-900">無配当特定疾病障害介護保証保険（団体型）</p>
            </div>
            {plan.feat.map((f, i) => {
              const [k, v] = f.split("：");
              return (
                <div key={i} className="flex items-center justify-between py-3 border-b border-warm-200 last:border-0">
                  <span className="text-caption text-neutral-500">{k}</span>
                  <FeatValue v={v || "—"} />
                </div>
              );
            })}
            <div className="flex items-center justify-between py-3 border-b border-warm-200 last:border-0">
              <span className="text-caption text-neutral-500">保険料（月額）</span>
              <span className="text-neutral-800">
                <span className="font-en text-cd-h5 font-semibold text-primary-600 tabular-nums">{plan.price.replace("¥", "")}</span>
                <span className="text-caption"> 円 / 月</span>
              </span>
            </div>
          </div>

          <Simulator m={m} setM={setM} y={y} setY={setY} initialSimOpen={initialSimOpen} />

          <div className="rounded-2xl border border-warm-200 bg-white p-5">
            <SectionLabel>ご確認事項</SectionLabel>
            {["重要事項説明書（契約概要・注意喚起情報）", "ご契約のしおり・約款", "個人情報の取扱いについて"].map((t, i) => (
              <button key={i} className="flex items-center justify-between w-full py-3 border-b border-warm-200 last:border-0 text-left">
                <span className="flex items-center gap-2 text-cd-h7 text-neutral-700"><Ic.doc className="w-4 h-4 text-neutral-400" />{t}</span>
                <Ic.chevR className="w-4 h-4 text-neutral-400" />
              </button>
            ))}
          </div>
        </StepSection>

        {/* ---- 不足分メール送信 / 事前同意 ---- */}
        <StepSection label="不足分メール送信">
          <p className="text-cd-h7 text-neutral-700 leading-relaxed">
            ご入力されたメールアドレス宛に、お申し込み手続きのご案内URLをお送りします。メールアドレスをご入力ください。
          </p>

          <Field label="メールアドレス" placeholder="samplename@sample.co.jp" required />

          <div>
            <h3 className="text-cd-h6 font-bold text-neutral-800">事前同意事項</h3>
            <p className="text-caption text-neutral-500 mt-1">お申し込み前に、下記より重要事項・事前同意事項を必ずご確認ください。</p>

            <button onClick={() => setNoticeOpen(true)}
              className="mt-3 flex items-center justify-between w-full rounded-xl border-2 border-[color:var(--secondary-color-200)] bg-[color:var(--secondary-color-10)] px-4 py-4 text-left transition hover:border-[color:var(--secondary-color-300)]">
              <span className="flex items-center gap-2.5 min-w-0">
                <span className="rounded-full bg-[color:var(--secondary-color-600)] text-white px-2 py-0.5 text-[11px] font-bold leading-none shrink-0">重要</span>
                <span className="text-cd-h7 font-bold text-neutral-800">重要事項・事前同意事項を確認する</span>
              </span>
              <Ic.chevR className="w-5 h-5 text-[color:var(--secondary-color-600)] shrink-0" />
            </button>
          </div>

          <button onClick={() => setAgree((a) => !a)} className="flex items-start gap-3 w-full text-left">
            <span className={`grid place-items-center w-5 h-5 mt-0.5 rounded border-2 shrink-0 ${agree ? "border-primary bg-primary text-white" : "border-warm-300 bg-white"}`}>
              {agree && <Ic.check className="w-3 h-3" />}
            </span>
            <span className="text-caption text-neutral-700 leading-relaxed">上記の事前同意事項を確認し、同意します</span>
          </button>
        </StepSection>
        </div>
      </div>

      <ActionBar>
        <div className="flex items-start gap-2 px-1 text-caption text-neutral-600 leading-relaxed">
          <Ic.doc className="w-4 h-4 mt-0.5 text-neutral-400 shrink-0" />
          申込みには、ご本人様名義のクレジットカードが必要です
        </div>
        <Btn kind="cta" onClick={() => go(1)} disabled={!agree}>上記に同意してメールを送信</Btn>
        {!agree && <p className="text-center text-caption text-neutral-400">同意いただくと送信できます</p>}
      </ActionBar>

      {/* 重要事項ボトムシート */}
      {noticeOpen && (
        <div className="absolute inset-0 z-40">
          <div className="absolute inset-0 bg-black/40 fade-in" onClick={() => setNoticeOpen(false)} />
          <div className="sheet-up absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-xl max-h-[88%] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-warm-200">
              <h3 className="flex items-center gap-2 text-cd-h6 font-bold text-neutral-800">
                <span className="rounded-full bg-[color:var(--secondary-color-10)] text-[color:var(--secondary-color-700)] px-2 py-0.5 text-[11px] font-bold leading-none">重要</span>
                重要事項・事前同意事項
              </h3>
              <button onClick={() => setNoticeOpen(false)} className="grid place-items-center w-8 h-8 rounded-full bg-warm-100 text-neutral-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="px-5 py-4 overflow-y-auto no-sb space-y-5">
              <p className="text-caption text-neutral-500 leading-relaxed">
                お申込み前に、以下の内容を必ずご確認ください。
              </p>
              <section className="space-y-1.5">
                <h4 className="text-cd-h7 font-bold text-neutral-800">契約概要・注意喚起情報</h4>
                <ul className="space-y-1.5 text-caption text-neutral-600 leading-relaxed">
                  <li>・本保険は団体契約であり、所定の会員資格を喪失された場合、保険契約は解約となり、更新はできません。</li>
                  <li>・申込み日が17日までの場合は翌月1日（0時）より、18日から末日までの場合は翌々月1日（0時）より補償が開始します。</li>
                  <li>・満期日までに更新しない旨のお申し出がなければ、団体の取り決めにより原則自動更新されます。</li>
                  <li>・告知義務があります。事実と異なる告知をされた場合、ご契約が解除され保険金をお支払いできないことがあります。</li>
                </ul>
              </section>
              <section className="space-y-2">
                <h4 className="text-cd-h7 font-bold text-neutral-800">関連書類</h4>
                {["重要事項説明書（契約概要・注意喚起情報）", "ご契約のしおり・約款", "個人情報の取扱いについて"].map((t, i) => (
                  <button key={i} className="flex items-center justify-between w-full rounded-xl border border-warm-200 bg-warm-50 px-3.5 py-3 text-left">
                    <span className="flex items-center gap-2 text-cd-h7 text-neutral-700"><Ic.doc className="w-4 h-4 text-neutral-400" />{t}</span>
                    <Ic.chevR className="w-4 h-4 text-neutral-400" />
                  </button>
                ))}
              </section>

              <div className="border-t border-warm-200 pt-4 space-y-5">
                <p className="flex items-center gap-2 text-cd-h7 font-bold text-neutral-800">
                  <span className="rounded-full bg-primary-10 text-primary-700 px-2 py-0.5 text-[11px] font-bold leading-none">事前同意</span>
                  事前同意事項
                </p>
                <section className="space-y-1.5">
                  <h4 className="text-cd-h7 font-bold text-neutral-800">この保険について</h4>
                  <ul className="space-y-1.5 text-caption text-neutral-600 leading-relaxed">
                    <li>・本保険は団体契約であり、所定の会員資格を喪失された場合、保険契約は解約となり、更新はできませんのでご注意ください。</li>
                    <li>・この契約は、申込み日が17日までの場合は翌月1日（0時）より、18日から末日までの場合は翌々月1日（0時）より補償が開始します。</li>
                    <li>・満期日までに更新しない旨のお申し出がなければ、団体の取り決めにより原則自動更新されます。</li>
                  </ul>
                </section>
                <section className="space-y-1.5">
                  <h4 className="text-cd-h7 font-bold text-neutral-800">個人情報の取扱いについて</h4>
                  <ul className="space-y-1.5 text-caption text-neutral-600 leading-relaxed">
                    <li>・ご入力いただく個人情報は、保険契約上必要な範囲で引受保険会社に提供し、契約の引受・維持管理、保険金等のお支払いの目的で利用させていただきます。</li>
                    <li>・法令に基づく場合を除き、ご本人の同意なく第三者へ提供することはありません。</li>
                  </ul>
                </section>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-warm-200">
              <Btn kind="button" onClick={() => { setAgree(true); setNoticeOpen(false); }}>確認同意しました</Btn>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   STEP 3 — 申込フォーム
   ============================================================ */
export function ScreenForm({
  go,
  sel,
  m,
  setM,
  y,
  setY,
  initialEditOpen,
  initialSheetRes,
  initialSame,
}: {
  go: Go;
  sel: string;
  m: number;
  setM: SetNum;
  y: number;
  setY: SetNum;
  initialEditOpen?: boolean;
  initialSheetRes?: boolean;
  initialSame?: boolean;
}) {
  const plan = PLANS.find((p) => p.id === sel) || PLANS[0];
  const [nat, setNat] = useState("jp");
  const [same, setSame] = useState(initialSame ?? true);
  const [editOpen, setEditOpen] = useState(initialEditOpen ?? false);
  const [sheetRes, setSheetRes] = useState(initialSheetRes ?? false);
  const yen = (v: number) => v.toLocaleString("ja-JP");

  // 契約者住所（受取人「契約者と同じ」用の自動入力値）
  const holder = { zip: "100-0001", pref: "東京都", town: "千代田区丸の内１丁目", bldg: "丸の内ビル 10F" };

  return (
    <>
      <AppBar title="お申込み" onBack={() => go(0)} />
      <Steps n={2} />
      <div className="flex-1 overflow-y-auto no-sb px-5 py-5 space-y-6">
        <div className="flex items-start gap-3 px-1 pt-1">
          <span className="grid place-items-center w-6 h-6 mt-0.5 rounded-full bg-[color:var(--success)] text-white shrink-0">
            <Ic.check className="w-3.5 h-3.5" />
          </span>
          <p className="text-cd-h7 text-neutral-700 leading-relaxed">
            <span className="font-bold text-[color:var(--success)]">メールアドレスを認証しました。</span><br/>
            ご契約者さまと保険金受取人さまの情報入力をお願いします。
          </p>
        </div>
        <div className="rounded-xl bg-primary-10 px-4 py-3 flex items-center gap-2 text-caption text-primary-700">
          <Ic.shield className="w-4 h-4 shrink-0" />THEO 口座情報の一部を自動入力しています。
        </div>

        {/* 契約者情報グループ */}
        <GroupCard title="契約者情報" sub="ご契約者ご本人さまの情報" icon={Ic.user}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="姓" placeholder="山田" required />
            <Field label="名" placeholder="太郎" required />
            <Field label="セイ" placeholder="ヤマダ" required />
            <Field label="メイ" placeholder="タロウ" required />
          </div>
          <LockedField label="生年月日" value="1990 / 01 / 01" />
          <LockedField label="性別" value="男性" />
          <div className="flex flex-col gap-1.5">
            <span className="text-caption font-medium text-neutral-600">国籍 <span className="text-[color:var(--secondary-color-700)]">*</span></span>
            <div className="grid grid-cols-2 gap-3">
              {[["jp", "日本国籍"], ["other", "日本国籍以外"]].map(([k, l]) => (
                <button key={k} onClick={() => setNat(k)}
                  className={`h-11 rounded-lg border text-cd-h7 transition-colors ${nat === k ? "border-primary bg-primary-10 text-primary-700 font-medium" : "border-warm-300 bg-warm-50 text-neutral-700 hover:border-primary-300"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <SubLabel>連絡先</SubLabel>
          <Field label="郵便番号" placeholder="100-0001" required hint="郵便番号から住所を自動入力します" />
          <Select label="都道府県" required value="東京都" options={PREFS} hint="郵便番号で自動入力" />
          <Field label="市区町村・町名" placeholder="千代田区丸の内１丁目" required hint="町名まで自動入力されます" />
          <Field label="建物名／部屋番号" placeholder="〇〇ビル 101号室" />
          <Field label="電話番号" placeholder="090-0000-0000" required />
        </GroupCard>

        {/* 保険金受取人グループ */}
        <GroupCard title="保険金受取人" sub="保険金をお受け取りになる方" icon={Ic.heart}>
          <Field label="氏名" placeholder="山田 花子" />

          <button onClick={() => setSame((s) => !s)} className="flex items-center gap-2.5 w-full text-left pt-1">
            <span className={`grid place-items-center w-5 h-5 rounded border-2 shrink-0 ${same ? "border-primary bg-primary text-white" : "border-warm-300 bg-white"}`}>
              {same && <Ic.check className="w-3 h-3" />}
            </span>
            <span className="text-caption text-neutral-700">住所は契約者と同じ</span>
          </button>

          <div key={same ? "same" : "diff"} className="space-y-3">
            <Field label="郵便番号" placeholder="100-0001" value={same ? holder.zip : undefined} disabled={same} />
            <Select label="都道府県" value={same ? holder.pref : "都道府県を選択"} options={PREFS} disabled={same} />
            <Field label="市区町村・町名" placeholder="千代田区丸の内１丁目" value={same ? holder.town : undefined} disabled={same} />
            <Field label="建物名／部屋番号" placeholder="〇〇ビル 101号室" value={same ? holder.bldg : undefined} disabled={same} />
          </div>

          <Select label="続柄" required value="続柄を選択" options={["続柄を選択", "配偶者", "子", "父母", "兄弟姉妹", "孫", "祖父母", "その他"]} />
          <Field label="電話番号" placeholder="090-0000-0000" />
        </GroupCard>

        {/* 団体特定コード（最下部） */}
        <GroupCard title="団体特定コード" icon={Ic.tag}>
          <Field label="団体特定コード" placeholder="TDF-0000-0000" hint="団体からご案内のコードを入力してください" />
        </GroupCard>

      </div>

      <ActionBar>
        <div className="rounded-xl border border-warm-200 bg-warm-50 px-3.5 py-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-neutral-400">積立内容</span>
            <button onClick={() => setEditOpen(true)} className="flex items-center gap-1 text-caption font-medium text-button-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
              修正
            </button>
          </div>
          <div className="mt-0.5 flex items-center flex-wrap gap-x-2 gap-y-0.5 text-caption">
            <span className="font-bold text-neutral-800">{plan.name}</span>
            <span className="text-warm-300">|</span>
            <span className="text-neutral-700 tabular-nums">{yen(m)}円/月</span>
            <span className="text-warm-300">|</span>
            <span className="text-neutral-700 tabular-nums">{y}年</span>
          </div>
        </div>
        <Btn kind="button" onClick={() => go(2)}>入力内容を確認する<Ic.chevR className="w-4 h-4" /></Btn>
      </ActionBar>

      {/* 修正ボトムシート */}
      {editOpen && (
        <div className="absolute inset-0 z-40">
          <div className="absolute inset-0 bg-black/40 fade-in" onClick={() => setEditOpen(false)} />
          <div className="sheet-up absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-xl max-h-[88%] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <h3 className="text-cd-h6 font-bold text-neutral-800">積立内容を修正</h3>
              <button onClick={() => setEditOpen(false)} className="grid place-items-center w-8 h-8 rounded-full bg-warm-100 text-neutral-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="px-5 overflow-y-auto no-sb pb-2">
              <SimSliders m={m} setM={setM} y={y} setY={setY} onInput={() => setSheetRes(true)} />

              {/* シミュレーション結果（アコーディオン） */}
              <button onClick={() => setSheetRes((o) => !o)}
                className="flex items-center justify-between w-full mt-2 pt-4 border-t border-warm-200 text-left">
                <span className="text-cd-h7 font-bold text-neutral-800">給付予想額をみる</span>
                <span className={`grid place-items-center w-7 h-7 rounded-full bg-warm-100 text-neutral-500 transition-transform ${sheetRes ? "rotate-180" : ""}`}>
                  <Ic.chevR className="w-4 h-4 rotate-90" />
                </span>
              </button>
              <div style={{ maxHeight: sheetRes ? "1600px" : "0px", opacity: sheetRes ? 1 : 0, marginTop: sheetRes ? "16px" : "0px" }}
                className="overflow-hidden transition-all duration-300 ease-out">
                <BenefitTable m={m} y={y} />
              </div>
            </div>
            <div className="px-5 py-3 border-t border-warm-200">
              <Btn kind="button" onClick={() => setEditOpen(false)}>この内容で更新</Btn>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   STEP 4 — 内容確認 ＋ お支払い登録（1ページ）
   ============================================================ */
// 重要事項（5項目）— ①〜④は添付内容、⑤は契約のしおり・約款
export const AGREE_ITEMS: AgreeItemData[] = [
  {
    t: "申込に関する注意事項の確認",
    blocks: [
      { ul: [
        "お申し込み・告知内容は必ず被保険者ご本人さまがご入力ください。",
        "お申込は、日本国内に在住し、ご自身で日本語の契約内容を理解できることが条件となります。",
        "T&Dフィナンシャル生命のシステム上登録できない字体については、登録可能な漢字かカタカナでの登録となることをご了承ください。（保障内容やご契約後の諸手続き等に影響はありません）",
        "ご加入の成立には審査があります。審査の結果、ご加入をお引き受けできない場合があります。",
      ] },
    ],
  },
  {
    t: "個人情報のお取り扱いについて",
    blocks: [
      { ul: [
        "本保険のご加入手続き等について、保険契約者（団体）は加入対象者（被保険者）の個人情報（氏名、性別、生年月日、健康状態等）〔以下、個人情報〕を各種保険契約の引受け・継続・維持管理、給付金の支払い、その他保険に関連・付随する業務のために利用し、引受保険会社に前記目的の範囲内で提供します。今後個人情報に変更等が発生した際にも、それぞれ前記に準じ個人情報が取扱われます。",
        "保険医療等の機微（センシティブ）情報については、保険業法施行規則により、業務の適切な運営の確保その他必要と認められる目的に利用目的が限定されています。",
        "個人番号及び特定個人情報の取扱いについて\n個人番号及び特定個人情報については、「行政手続における特定の個人を識別するための番号の利用等に関する法律」第9条に基づき、団体保険、団体年金保険、および財形保険に関する支払い調書等作成事務に利用目的を限定しており、当該利用目的の範囲を超えた利用、第三者提供はいたしません。",
        "T&Dフィナンシャル生命では、お客さまの個人情報に関するお問い合わせ窓口を設けています。保有個人データの開示、訂正、利用停止などのご請求、その他個人情報に関するお問い合わせは下記までご連絡いただけますようお願いします。",
      ] },
      { link: "https://is.tdf-life.co.jp/www7/kumikomi_hoken/form1-entry.php" },
      { ul: ["最新の内容はT&Dフィナンシャル生命ホームページ（https://www.tdf-life.co.jp）にてご確認ください。"] },
    ],
  },
  {
    t: "ペーパーレス申込の同意",
    blocks: [
      { p: "ペーパーレス手続きとは、情報端末（以下「タブレット等」といいます）による生命保険契約のお申込み手続きです。" },
      { ul: [
        "お客さま自身によるペーパーレス手続きのお願い\nタブレット等の画面等でおこなう各種ご確認・入力は被保険者さま（以下「お客さま」といいます）ご自身によりおこなってください。",
        "セキュリティについて\n1. お客さまがタブレット等で確認・入力したすべての情報は、当社において電磁的記録（電子データ）によって保管します。\n2. タブレット等の情報端末内にお客さまの情報は保存しません。データの伝送についても、データを暗号化するなどのセキュリティ対策を講じます。",
      ] },
    ],
  },
  {
    t: "健康告知について",
    blocks: [
      { p: "下記の内容をご確認のうえ、お申し込みください。" },
      { p: "保険商品お申し込みの方へ" },
      { p: "ご加入にあたっては、被保険者の現在の健康状態等について告知をしていただく義務があります。" },
      { p: "ご加入にあたっては、過去の傷病歴（傷病名・治療期間等）、現在の健康状態、身体の障がい状況について「告知事項」で当社がおたずねすることについて、事実をありのままに正確にもれなくお知らせ（告知）ください。" },
      { p: "ご加入（責任開始期）前に生じた病気やケガにより、支払事由が生じた場合には、給付金はお支払いできません。" },
      { p: "（事例）加入前より高血圧・脂質異常で定期的に服薬中の場合\n以下告知項目には該当しませんが、加入3ヶ月後に直接的な原因による脳梗塞を発症した場合などもお支払いできないことがあります。" },
      { p: "※ただし、以下の場合には責任開始期以後発生した原因によるものとみなし、給付金をお支払いします。" },
      { ul: [
        "責任開始期から1年を経過した後で支払事由が生じた場合",
        "責任開始期以降、その疾病やケガによって医師の診察を受けたことがなくかつ診断等による異常な指摘も受けていないこと。ただし、その原因となった病気やケガによる症状について被保険者が認識または自覚していた場合を除きます。",
      ] },
      { note: "【告知事項】\n以下の質問についてすべて「いいえ」であることをご確認ください。1つでも「はい」があると、ご加入いただけません。" },
      { ul: [
        "最近3ヶ月以内に、医師より検査・入院・手術を勧められたことがありますか。（検査には、健康診断、人間ドック、歯科検査、アレルギー検査を含みません）",
        "過去2年以内に健康診断・人間ドックにおいて、以下の検査を受けて、異常の指摘を受けたことがありますか。異常とは、要再検査・要精密検査・要治療をいいます。ただし、再検査・精密検査の結果、「異常なし」と診断された場合を除きます。",
      ] },
      { table: [["検査名", "狭内視鏡検査・便潜血検査・マンモグラフィ検査・腫瘍マーカー（CEA、AFP、CA19-9、PSA）"]] },
      { ul: ["過去5年以内の病気について、以下に該当することはありますか。\n・病気で継続して7日以上の入院をしたことまたは手術を受けたことがありますか。（新型コロナウイルスによる入院は含みません。）\n・下記表の病気で、医師による診療・検査・治療・薬の処方を受けたことがありますか。"] },
      { table: [
        ["心臓・血液", "狭心症、心筋梗塞、心臓弁膜症、不整脈、心筋症、心不全、大動脈瘤"],
        ["脳", "脳卒中（脳出血、脳梗塞、くも膜下出血）、脳動脈瘤、脳しゅよう"],
        ["精神・神経", "認知症、うつ病、統合失調症、アルコール依存症、てんかん、パーキンソン病、脊髄小脳変性症、多系統萎縮症、筋萎縮性側索硬化症、多発性硬化症"],
        ["肝臓・腎臓・膵臓", "慢性肝炎、肝硬変、慢性腎炎、ネフローゼ、腎不全、すい炎"],
        ["肺", "肺気腫、閉塞性肺疾患、間質性肺炎、誤嚥性肺炎"],
        ["目", "緑内障、加齢黄斑変性症、網膜色素変性症"],
        ["その他", "合併症を伴う糖尿病、膠原病（関節リウマチ、全身性エリテマトーデス（SLE）、強皮症、多発性筋炎、結節性多発動脈周囲炎）"],
      ] },
      { ul: ["つぎのいずれか1つでも該当することはありますか。\n・今までに、がん（上皮内がん、肉腫、白血病、悪性リンパ腫、骨髄腫を含む）、高度異形成または骨髄異形成症候群になったことがある。\n・今までに、公的介護保険制度の要介護または要支援の認定を受けていたこと、もしくは、認定申請をしたことがある（40歳未満の方は該当しません）。\n・現在、つぎの1〜5の日常生活のいずれかにおいて、他の方の介助またはご自身で補助具を必要とすることがある。＊骨折などにより現在一時的に必要とする場合も含みます。（1.歩行 2.衣服の着替え 3.入浴 4.食事 5.排泄）"] },
    ],
  },
  {
    t: "ご契約のしおり・約款の確認",
    blocks: [
      { p: "ご契約のしおり・約款の内容を確認し、同意します。" },
      { ul: [
        "保障内容、保険期間、保険料、保険金等のお支払い・お支払いできない場合、解約・自動更新、クーリング・オフ等についてご確認ください。",
      ] },
      { note: "※本項目の正式な掲載文面は別途ご提供ください（仮テキスト）。" },
    ],
  },
];

export function AgreeBlocks({ blocks }: { blocks: AgreeBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.p) return <p key={i} className="text-caption text-neutral-600 leading-relaxed whitespace-pre-line">{b.p}</p>;
        if (b.ul) return (
          <ul key={i} className="space-y-2">
            {b.ul.map((t, j) => (
              <li key={j} className="flex gap-1.5 text-caption text-neutral-600 leading-relaxed">
                <span className="text-neutral-400 shrink-0">・</span><span className="whitespace-pre-line">{t}</span>
              </li>
            ))}
          </ul>
        );
        if (b.link) return <a key={i} href={b.link} target="_blank" rel="noreferrer" className="block text-caption text-button-500 underline break-all leading-relaxed">{b.link}</a>;
        if (b.note) return <div key={i} className="rounded-lg border border-warm-200 bg-warm-50 p-3 text-caption text-neutral-700 leading-relaxed whitespace-pre-line">{b.note}</div>;
        if (b.table) return (
          <div key={i} className="rounded-lg border border-warm-200 overflow-hidden">
            <table className="w-full">
              <tbody>
                {b.table.map((r, j) => (
                  <tr key={j} className="border-b border-warm-200 last:border-0 align-top">
                    <th className="bg-warm-50 text-left font-medium text-caption text-neutral-600 px-2.5 py-2 w-[88px] align-top leading-relaxed">{r[0]}</th>
                    <td className="text-caption text-neutral-600 px-2.5 py-2 leading-relaxed">{r[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        return null;
      })}
    </>
  );
}

export function AgreeItem({
  num,
  item,
  open,
  onToggle,
  checked,
  onCheck,
}: {
  num: string;
  item: AgreeItemData;
  open: boolean;
  onToggle: () => void;
  checked: boolean;
  onCheck: () => void;
}) {
  return (
    <div className={`rounded-xl border bg-white overflow-hidden ${checked ? "border-primary-200" : "border-warm-200"}`}>
      <div className="flex items-center gap-2.5 px-3 py-3">
        <button onClick={onCheck} aria-label="同意チェック"
          className={`grid place-items-center w-5 h-5 rounded border-2 shrink-0 ${checked ? "border-primary bg-primary text-white" : "border-warm-300 bg-white"}`}>
          {checked && <Ic.check className="w-3 h-3" />}
        </button>
        <button onClick={onToggle} className="flex-1 flex items-center justify-between gap-2 text-left">
          <span className="text-cd-h7 font-bold text-neutral-800 leading-snug"><span className="text-primary-600 mr-1">{num}</span>{item.t}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            className={`w-4 h-4 text-primary shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>
      <div style={{ maxHeight: open ? "2600px" : "0px", opacity: open ? 1 : 0 }} className="overflow-hidden transition-all duration-300 ease-out">
        <div className="px-3 pt-3 pb-3.5 border-t border-warm-200 max-h-80 overflow-y-auto no-sb space-y-2.5">
          <AgreeBlocks blocks={item.blocks} />
        </div>
      </div>
    </div>
  );
}

export function ScreenStep4({
  go,
  sel,
  m,
  y,
  initialOpenIdx,
  initialChecks,
  initialAcctOpen,
}: {
  go: Go;
  sel: string;
  m: number;
  y: number;
  initialOpenIdx?: number;
  initialChecks?: boolean[];
  initialAcctOpen?: boolean;
}) {
  const plan = PLANS.find((p) => p.id === sel) || PLANS[0];
  const yen = (v: number) => (v || 0).toLocaleString("ja-JP");
  const [checks, setChecks] = useState(initialChecks ?? [false, false, false, false, false]);
  const [openIdx, setOpenIdx] = useState(initialOpenIdx ?? -1);
  const [acctOpen, setAcctOpen] = useState(initialAcctOpen ?? false);
  const all = checks.every(Boolean);
  const toggleCheck = (i: number) => setChecks((a) => a.map((v, k) => (k === i ? !v : v)));
  return (
    <>
      <AppBar title="内容確認・お支払い登録" onBack={() => go(1)} />
      <Steps n={3} />
      <div className="flex-1 overflow-y-auto no-sb px-5 py-5 space-y-8">
        <StepSection label="内容確認">
        <h2 className="text-cd-h5 font-bold text-neutral-800">お申込み内容</h2>

        <div className="rounded-2xl border border-warm-200 bg-white p-5">
          <SectionLabel>積立内容</SectionLabel>
          <Row k="契約プラン" v={plan.name} strong />
          <Row k="毎月の積立金額（希望給付額）" v={`${yen(m)} 円`} />
          <Row k="保障期間" v={`${y} 年`} />
          <Row k="保険料（月額）" v={`${plan.price.replace("¥", "")} 円 / 月`} />
          <Row k="保険期間" v="1年（自動更新）" />
        </div>

        <div className="rounded-2xl border border-warm-200 bg-white p-5">
          <SectionLabel>契約者情報</SectionLabel>
          <Row k="氏名" v="山田 太郎" />
          <Row k="フリガナ" v="ヤマダ タロウ" />
          <Row k="生年月日" v="1990 / 01 / 01" />
          <Row k="性別" v="男性" />
          <Row k="国籍" v="日本国籍" />
          <div className="flex flex-col gap-0.5 py-3 border-b border-warm-200">
            <span className="text-caption text-neutral-500">住所</span>
            <span className="text-cd-h7 text-neutral-700 leading-relaxed">〒100-0001<br/>東京都千代田区丸の内１丁目 丸の内ビル 10F</span>
          </div>
          <Row k="電話番号" v="090-0000-0000" />
          <Row k="メールアドレス" v="samplename@sample.co.jp" />
        </div>

        <div className="rounded-2xl border border-warm-200 bg-white p-5">
          <SectionLabel>保険金受取人</SectionLabel>
          <Row k="氏名" v="山田 花子" />
          <Row k="続柄" v="配偶者" />
          <Row k="住所" v="契約者と同じ" />
          <Row k="電話番号" v="090-0000-0000" />
        </div>

        <div className="rounded-2xl border border-warm-200 bg-white p-5">
          <SectionLabel>団体特定コード</SectionLabel>
          <Row k="コード" v="TDF-0000-0000" />
        </div>

        <div className="rounded-2xl border border-[color:var(--secondary-color-100)] bg-[color:var(--secondary-color-10)] p-4">
          <div className="flex items-center gap-2 mb-3"><Badge>重要</Badge><span className="text-caption text-neutral-600">5項目すべてご確認・同意ください</span></div>
          <div className="space-y-2.5">
            {AGREE_ITEMS.map((it, i) => (
              <AgreeItem key={i} num={"①②③④⑤"[i]} item={it} open={openIdx === i}
                onToggle={() => setOpenIdx((o) => (o === i ? -1 : i))}
                checked={checks[i]} onCheck={() => toggleCheck(i)} />
            ))}
          </div>
          <p className="mt-3 text-caption text-neutral-500 text-right tabular-nums">{checks.filter(Boolean).length} / 5 確認済み</p>
        </div>
        </StepSection>

        <StepSection label="お支払い登録">
          <div className="rounded-2xl border border-warm-200 bg-white overflow-hidden">
            <button onClick={() => setAcctOpen((o) => !o)} className="flex items-center justify-between w-full px-5 py-4 text-left">
              <h3 className="text-cd-h6 font-bold text-neutral-800">引落口座設定</h3>
              <span className={`grid place-items-center w-7 h-7 rounded-full bg-warm-100 text-neutral-500 transition-transform ${acctOpen ? "rotate-180" : ""}`}>
                <Ic.chevR className="w-4 h-4 rotate-90" />
              </span>
            </button>
            <div style={{ maxHeight: acctOpen ? "600px" : "0px", opacity: acctOpen ? 1 : 0 }} className="overflow-hidden transition-all duration-300 ease-out">
              <div className="px-5 pb-5">
                <p className="text-caption text-neutral-600 leading-relaxed">
                  下記「クレジットカード登録開始」ボタンより、お客様の取引金融機関のWEB口座振替受付サービスサイトへリンクします。引落口座の設定手続きを開始してください。
                </p>
                <ul className="mt-3 space-y-2">
                  {[
                    "お客様と取引金融機関との間で、印鑑なしに直接口座振替の設定を行うことが可能です。",
                    "引落口座の設定が完了していない場合はつみたて購入を開始することができません。また、一部の地方銀行、信用組合、労働金庫等ではご利用することができませんので、ご注意ください。",
                  ].map((t, i) => (
                    <li key={i} className="flex gap-1.5 text-caption text-neutral-600 leading-relaxed">
                      <span className="text-neutral-400 shrink-0">・</span><span>{t}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-caption text-neutral-600 leading-relaxed">
                  登録できない金融機関一覧は<a className="text-button-500 underline font-medium">こちら</a>からご確認ください。
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-warm-100 p-4 text-caption text-neutral-500 leading-relaxed space-y-1">
            <p>※ 収納代行会社（GMOペイメントゲートウェイ）のサイトへ遷移します。</p>
            <p>※ 引落口座の設定を行った後、登録内容が表示されない場合は、<a className="text-button-500 underline">こちら</a>を押して画面を更新してください。</p>
          </div>
        </StepSection>
      </div>
      <ActionBar>
        <Btn kind="cta" onClick={() => go(3)} disabled={!all}>クレジットカード登録開始<Ic.chevR className="w-4 h-4" /></Btn>
        {!all && <p className="text-center text-caption text-neutral-400">5項目すべてチェックすると進めます</p>}
      </ActionBar>
    </>
  );
}

/* 外部サイト（GMO）共通の簡易ブラウザバー */
export function ExtBar({ url }: { url: string }) {
  return (
    <div className="shrink-0 bg-neutral-200 border-b border-neutral-300 px-3 py-2 flex items-center gap-2">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5 text-neutral-500 shrink-0"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
      <span className="flex-1 bg-white rounded-md px-2.5 py-1 text-caption text-neutral-600 truncate font-en">{url}</span>
      <span className="font-mono text-[10px] text-neutral-500 shrink-0">外部</span>
    </div>
  );
}

export const CARD_BRANDS = ["VISA", "Mastercard", "JCB", "AMEX", "Diners", "DC", "NICOS", "UC"];

/* ============================================================
   SCREEN — 外部: クレジットカード情報入力（GMO）
   ============================================================ */
export function ScreenCardInput({ go }: { go: Go }) {
  return (
    <>
      <ExtBar url="payment.gmo-pg.com" />
      <div className="flex-1 overflow-y-auto no-sb bg-neutral-100 px-4 py-5 space-y-4">
        <h2 className="text-cd-h6 font-bold text-neutral-800">クレジットカード設定（外部リンク）</h2>
        <div className="rounded-xl bg-white border border-neutral-200 p-4 space-y-4">
          <p className="flex items-center gap-2 text-cd-h7 font-bold text-neutral-800">
            <span className="w-1.5 h-3.5 bg-[color:var(--success)] rounded-[1px]" />クレジットカード情報を入力ください
          </p>
          <Field label="カード番号" placeholder="1234 5678 9012 3456" required />
          <Field label="カード名義（半角ローマ字）" placeholder="TARO YAMADA" required />
          <div className="grid grid-cols-2 gap-3">
            <Field label="有効期限（月／年）" placeholder="04 / 25" required />
            <Field label="セキュリティコード" placeholder="***" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-caption font-medium text-neutral-600">使用できるクレジットカード</span>
            <div className="flex flex-wrap gap-1.5">
              {CARD_BRANDS.map((b) => (
                <span key={b} className="rounded border border-neutral-300 bg-neutral-50 px-2 py-1 font-en text-[11px] font-medium text-neutral-600">{b}</span>
              ))}
            </div>
          </div>
          <ul className="space-y-1.5 border-t border-neutral-200 pt-3">
            {[
              "クレジットカードの名義人が保険契約者と同一のカードのみお取扱い可能です。",
              "クレジットカードの有効期限がお申込日の翌々月以降も有効なクレジットカードでお申込みください。",
              "クレジットカードでのお支払い方法は一回払いのみとなります。",
            ].map((t, i) => (
              <li key={i} className="flex gap-1.5 text-caption text-neutral-500 leading-relaxed">
                <span className="text-neutral-400 shrink-0">・</span><span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="sticky bottom-0 z-20 bg-neutral-100 border-t border-neutral-300 px-4 py-3 space-y-2">
        <Btn kind="button" onClick={() => go(4)}>確認画面へ進む<Ic.chevR className="w-4 h-4" /></Btn>
        <button onClick={() => go(2)} className="w-full text-center text-caption text-neutral-500">キャンセルして戻る</button>
      </div>
    </>
  );
}

/* ============================================================
   SCREEN — 外部: カード情報の確認（GMO）
   ============================================================ */
export function ScreenCardConfirm({ go }: { go: Go }) {
  return (
    <>
      <ExtBar url="payment.gmo-pg.com" />
      <div className="flex-1 overflow-y-auto no-sb bg-neutral-100 px-4 py-5 space-y-4">
        <h2 className="text-cd-h6 font-bold text-neutral-800">お申込み内容の確認（外部リンク）</h2>
        <div className="rounded-xl bg-white border border-neutral-200 p-4 space-y-4">
          <p className="flex items-center gap-2 text-cd-h7 font-bold text-neutral-800">
            <span className="w-1.5 h-3.5 bg-[color:var(--success)] rounded-[1px]" />ご登録内容
          </p>
          <div>
            <Row k="カード番号" v="**** **** **** 3456" />
            <Row k="カード名義" v="TARO YAMADA" />
            <Row k="有効期限" v="04 / 25" />
            <Row k="お支払い方法" v="一回払い" />
            <Row k="保険金の受取人" v="山田 花子様" />
          </div>
          <p className="rounded-lg bg-neutral-50 border border-neutral-200 p-3 text-caption text-neutral-500 leading-relaxed">
            上記の内容で申込します。「この内容で申込」を押すと、お申込みが確定し、初回のお支払い手続きが行われます。
          </p>
        </div>
      </div>
      <div className="sticky bottom-0 z-20 bg-neutral-100 border-t border-neutral-300 px-4 py-3 space-y-2">
        <Btn kind="button" onClick={() => go(5)}>この内容で申込</Btn>
        <button onClick={() => go(3)} className="w-full text-center text-caption text-neutral-500">入力内容を修正する</button>
      </div>
    </>
  );
}

/* ============================================================
   SCREEN 6 — 完了
   ============================================================ */
export function ScreenDone({ go }: { go: Go }) {
  return (
    <>
      <AppBar title="お申込み完了" />
      <div className="flex-1 overflow-y-auto no-sb">
        <div className="bg-primary text-primary-foreground px-5 pt-8 pb-10 text-center">
          <img src="/assets/theo-tdf/logo_theo_insurance.svg" alt="THEO つみたて安心ほけん" className="h-10 mx-auto mb-7 opacity-95" />
          <div className="mx-auto grid place-items-center w-16 h-16 rounded-full bg-white/15 mb-4">
            <Ic.check className="w-8 h-8" />
          </div>
          <h2 className="text-cd-h4 font-bold">お申込が完了しました</h2>
          <p className="mt-2 text-caption opacity-90">受付番号　THEO-2026-000482</p>
        </div>

        {/* progress — sticks to top once the blue hero scrolls out of view */}
        <div className="sticky top-0 z-30">
          <Steps n={4} />
        </div>

        <div className="px-5 py-6 space-y-5">
          <div className="px-1">
            <p className="text-cd-h7 font-bold text-neutral-800 leading-relaxed">THEO つみたて安心ほけんのお申込が完了しました。</p>
            <p className="mt-2 text-caption text-neutral-600 leading-relaxed">
              受付確認メールをご確認ください。<br/>
              初回の保険料引き落とし開始と保険開始までの流れは下記となります。
            </p>
          </div>

          <div className="rounded-2xl border border-warm-200 bg-white p-5">
            <SectionLabel>このあとの流れ</SectionLabel>
            <div className="mt-1">
            {[
              ["1", "受付確認メール送信確認", "ご登録のメールアドレスをご確認ください。"],
              ["2", "審査・引受の確定", "通常1〜3営業日でマイページに反映されます。"],
              ["3", "初回保険料の引落し", "翌月以降、THEO のご登録口座より。"],
            ].map(([n, t, d], idx, arr) => (
              <div key={n}>
                <div className="flex items-start gap-3">
                  <span className="grid place-items-center w-7 h-7 rounded-full bg-primary-10 text-primary-600 font-en font-semibold text-caption shrink-0">{n}</span>
                  <div>
                    <p className="text-cd-h7 font-bold text-neutral-800">{t}</p>
                    <p className="text-caption text-neutral-500 leading-relaxed">{d}</p>
                  </div>
                </div>
                {idx < arr.length - 1 && (
                  <div className="flex pl-[0.6rem] py-2 text-primary-300">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>
          <div className="rounded-xl bg-warm-100 p-4 text-caption text-neutral-500 leading-relaxed">
            保険証券（電子）はマイページからいつでもご確認・ダウンロードいただけます。
          </div>
        </div>
      </div>
      <ActionBar>
        <Btn kind="button" onClick={() => go(0)}>マイページに戻る</Btn>
      </ActionBar>
    </>
  );
}
