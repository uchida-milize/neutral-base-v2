"use client";
/* eslint-disable @next/next/no-img-element --
   Claude Design 出力のプロトタイプ。<img> は logo / chart / アイコンの静的アセット用。 */
/* eslint-disable @typescript-eslint/no-unused-expressions --
   `onInput && onInput()` 等のパターンが多数あり、Claude Design 由来のスタイル維持のため許容。 */
/* eslint-disable @typescript-eslint/no-unused-vars --
   AppBar の `title` 等、将来用に予約済みの prop / ローカルがある。 */
/* eslint-disable @typescript-eslint/no-explicit-any --
    scroll バインドの DOM 参照 / 動的 __bound プロパティへ any キャスト。 */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect --
   DateDrumSheet が「シートを開いた時に value へ同期」「月変更時に日をクランプ」
   する目的で effect 内 setState を使用 (Claude Design 由来の意図的パターン)。 */

import * as React from "react";
import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

/* ============================================================
   THEO 組込保険 — Screens + shared wireframe atoms
   ============================================================
   Claude Design (claude.ai/design) 出力からポート。
   原典: TD 組込1.4-handoff (kumikomi.html 単一ファイル版を正) (2026-06-16 全刷新取り込み)

   ★ shadcn ラッパー方針 (HANDOFF §11.4):
     共通 atom (Btn / Badge / Field / LockedField / GroupCard) は
     components/ui の shadcn primitive (Button / Badge / Input / Label / Card)
     へ委譲するアダプタ層。screens 側の呼び出し (<Btn> 等) は不変。
   ★ タイポ: Claude Design のコンパクトスケール text-h{2-7} (h7=16px) を
     repo の UI Heading スケール text-h{1-6} へ変換済み (globals.css 準拠)。
   ★ Select はネイティブ <select> 維持、AppBar / Steps / DateDrumSheet /
     WheelCol / PlanCard / ExtBar 等のモバイル UI 固有部品も独自実装維持。

   画面 (8 index / 5 番号ステップ + パターンB 統合画面 ScreenCombined):
     0 商品概要 / 1 プラン選択 / 2 PIN認証 / 3 申込フォーム /
     4 内容確認 / 5-6 カード承認(外部GMO) / 7 完了
   ============================================================ */

export type Plan = {
  id: string;
  name: string;
  price: string;
  lead: string;
  feat: string[];
  tag?: string;
  death?: boolean;
  tooltip?: { sections: { head: string; body: string }[] };
  disclosure?: AgreeBlock[];
};

export type AgreeBlock = {
  p?: string;
  ul?: string[];
  link?: string;
  download?: string;
  note?: string;
  table?: string[][];
  head?: string;
  strong?: string;
};

export type AgreeItemData = {
  t: string;
  blocks: AgreeBlock[];
  kind?: string;
  id?: string;
};

type Go = (n: number) => void;

/* ============================================================
   THEO 組込保険 — Screens + shared wireframe atoms
   ============================================================ */

/* ---------------- ICONS (line / wireframe) ---------------- */
export const Ic = {
  chevL: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 18l-6-6 6-6"/></svg>,
  chevR: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 18l6-6-6-6"/></svg>,
  chevD: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 9l6 6 6-6"/></svg>,
  menu:  (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M3 12h18M3 6h18M3 18h18"/></svg>,
  shield:(p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z"/></svg>,
  chart: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 19V5M4 19h16M8 16v-4M13 16V9M18 16v-7"/></svg>,
  doc:   (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M9.5 13h6M9.5 16.5h6"/></svg>,
  check: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6L9 17l-5-5"/></svg>,
  heart: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 5.5c-1.8-1.7-4.6-1.5-6.3.3L12 6.5l-.7-.7C9.6 4 6.8 3.8 5 5.5c-2 1.9-2 5 0 7l7 6.8 7-6.8c2-2 2-5.1 0-7z"/></svg>,
  user:  (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  tag:   (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1"/></svg>,
  card:  (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
  heartHand: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 12.8C9.3 11 7.4 9.4 7.4 7.3c0-1.5 1.2-2.6 2.6-2.6.9 0 1.6.4 2 1 .4-.6 1.1-1 2-1 1.4 0 2.6 1.1 2.6 2.6 0 2.1-1.9 3.7-4.6 5.5z"/><path d="M3.6 16.4c1.3 2.5 4.4 3.9 8.4 3.9s7.1-1.4 8.4-3.9"/></svg>,
  featSavings: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="14" width="4" height="6" rx="1"/><rect x="10" y="9" width="4" height="11" rx="1"/><rect x="17" y="4" width="4" height="16" rx="1"/></svg>,
  featTuition: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 4L2.5 8.5 12 13l9.5-4.5L12 4z"/><path d="M6 10.5V15c0 1.4 2.7 2.7 6 2.7s6-1.3 6-2.7v-4.5"/><path d="M21.5 8.5v5"/></svg>,
  featCare: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 9.2c-1.5-1.6-3.9-1-3.9 1 0 1.6 2 3 3.9 4.3 1.9-1.3 3.9-2.7 3.9-4.3 0-2-2.4-2.6-3.9-1z"/><path d="M3 15.5l3.2-1.3a2 2 0 0 1 1.5 0l2.4 1a2 2 0 0 0 1.5 0L18 12.6a1.4 1.4 0 0 1 1.8.7 1.4 1.4 0 0 1-.6 1.8l-5.4 3.1a3 3 0 0 1-2.4.3L3 16.4"/><path d="M3 14v6"/></svg>,
  cardArt: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...p}><path d="M18 4.5H6C3.71 4.5 2.5 5.71 2.5 8V16C2.5 18.29 3.71 19.5 6 19.5H18C20.29 19.5 21.5 18.29 21.5 16V8C21.5 5.71 20.29 4.5 18 4.5ZM6 5.5H18C19.729 5.5 20.5 6.271 20.5 8V9.5H3.5V8C3.5 6.271 4.271 5.5 6 5.5ZM18 18.5H6C4.271 18.5 3.5 17.729 3.5 16V10.5H20.5V16C20.5 17.729 19.729 18.5 18 18.5ZM10.5 15C10.5 15.276 10.276 15.5 10 15.5H7C6.724 15.5 6.5 15.276 6.5 15C6.5 14.724 6.724 14.5 7 14.5H10C10.276 14.5 10.5 14.724 10.5 15Z"/></svg>,
};

/* ---------------- ATOMS ---------------- */
export function Badge({ children, tone = "secondary" }: { children: React.ReactNode; tone?: "secondary" | "primary" | "warm" }) {
  // shadcn <Badge> へ委譲。tone でブランド色の淡色面を当てる。
  const tint: Record<string, string> = {
    secondary: "bg-[color:var(--secondary-color-10)] text-[color:var(--secondary-color-700)]",
    primary: "bg-primary-10 text-primary-700",
    warm: "bg-warm-100 text-neutral-500",
  };
  return (
    <UIBadge variant="secondary" className={`rounded-full border-transparent px-2.5 py-1 text-caption font-medium ${tint[tone]}`}>
      {children}
    </UIBadge>
  );
}

export function PH({ className = "", label }: { className?: string; label: string }) {
  return <div className={`wf-ph rounded-lg text-caption ${className}`}>{label}</div>;
}

// Buttons — cta (申込/前進), button (通常), outline (罫線)
export function Btn({ kind = "button", children, onClick, disabled, full = true }: { kind?: "cta" | "button" | "danger" | "outline" | "ghost"; children: React.ReactNode; onClick?: () => void; disabled?: boolean; full?: boolean }) {
  // shadcn <Button> へ委譲。kind→variant + ブランド色 className。
  const tint: Record<string, string> = {
    cta: "text-white",
    button: "text-white",
    danger: "text-white",
    outline: "border border-button-600 bg-white text-button-600 hover:bg-button-10",
    ghost: "text-neutral-500 hover:text-neutral-800",
  };
  // グラデーション: cta / button = ブルー, danger = レッド (TD 組込1.4 で追加)
  const gradStyle: React.CSSProperties | undefined =
    (kind === "cta" || kind === "button")
      ? { backgroundImage: "linear-gradient(135deg, #075FE3 0%, #64B0F7 100%)" }
      : kind === "danger"
      ? { backgroundImage: "linear-gradient(135deg, #E83A3C 0%, #F66A6C 100%)" }
      : undefined;
  const variant = kind === "outline" ? "outline" : kind === "ghost" ? "ghost" : "default";
  return (
    <Button
      type="button"
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      style={gradStyle}
      className={`h-16 md:h-16 rounded-xl gap-1.5 px-4 text-h6 font-bold active:scale-[.99] ${tint[kind]} ${full ? "w-full" : ""}`}
    >
      {children}
    </Button>
  );
}

// Phone app bar (THEO header)
// 共有グラデーション: ステータスバー(33px)+ヘッダー(56px) を1枚の連続グラデとして描画
export const HEADER_GRAD_CSS: React.CSSProperties = {
  backgroundImage: "linear-gradient(135deg, #075FE3 0%, #64B0F7 100%)",
  backgroundSize: "100% 89px",
  backgroundRepeat: "no-repeat",
};
export const HEADER_GRAD_STATUS: React.CSSProperties = { ...HEADER_GRAD_CSS, backgroundPosition: "0 0" };
export const HEADER_GRAD_APPBAR: React.CSSProperties = { ...HEADER_GRAD_CSS, backgroundPosition: "0 -33px" };

export function AppBar({ title, onBack, brandVisible = true }: { title: string; onBack?: () => void; brandVisible?: boolean }) {
  // 完了画面は空のAppBar
  if (title === "お申込み完了") {
    return (
      <div className="sticky top-0 z-20 text-primary-foreground h-14" style={HEADER_GRAD_APPBAR} />
    );
  }
  return (
    <div className="sticky top-0 z-20 text-primary-foreground" style={HEADER_GRAD_APPBAR}>
      <div className="flex items-center justify-between px-3 h-14">
        <span className="w-9 shrink-0" />
        <div className={`flex items-center gap-1.5 min-w-0 transition-opacity duration-200 ${brandVisible ? "opacity-100" : "opacity-0"}`}>
          <span className="font-en font-semibold tracking-[0.1em] text-h6">THEO</span>
          <span className="text-h6 font-medium truncate">つみたて安心ほけん</span>
          <span className="font-en text-[10px] font-medium opacity-75 shrink-0">&lt;THEO&gt;</span>
        </div>
        <span className="w-9 shrink-0" />
      </div>
    </div>
  );
}

// step progress dots — 既出（到達済み）ステップは押下でその画面へ遷移
export const STEP_TO_SCREEN: Record<number, number> = { 1: 0, 2: 1, 3: 3, 4: 4, 5: 7 };
export function Steps({ n, of = 5, go }: { n: number; of?: number; go?: Go }) {
  return (
    <div className="flex justify-center items-center gap-0 px-5 py-2 bg-white border-b border-warm-200">
      {Array.from({ length: of }).map((_, i) => {
        const stepNo = i + 1;
        const filled = i < n;
        const active = i + 1 === n;
        const clickable = filled && typeof go === "function" && STEP_TO_SCREEN[stepNo] != null;
        return (
          <div key={i} className="flex items-center">
            {/* Step circle */}
            <button type="button" disabled={!clickable}
              onClick={clickable ? () => go(STEP_TO_SCREEN[stepNo]) : undefined}
              aria-label={`STEP ${stepNo}`}
              className={`grid place-items-center w-7 h-7 rounded-full border-2 shrink-0 font-en text-[10px] font-bold transition-colors ${
                active ? "border-primary bg-primary text-white" : 
                filled ? "border-primary bg-white text-primary" : 
                "border-warm-300 bg-white text-neutral-400"
              } ${clickable ? "cursor-pointer hover:shadow-md" : "cursor-default"}`}>
              {stepNo}
            </button>
            {/* Line between circles */}
            {i < of - 1 && (
              <div className={`w-8 h-0.5 transition-colors ${
                i + 1 < n ? "bg-primary" : "bg-warm-200"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-caption tracking-[0.14em] uppercase text-neutral-900 mb-2">{children}</p>;
}

// 入力グループの囲い（契約者情報 / 保険金受取人 など）
export function GroupCard({ title, sub, icon: Icon, children, className, iconSrc }: { title: string; sub?: string; icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode; className?: string; iconSrc?: string }) {
  // shadcn <Card> + <CardContent> へ委譲。ヘッダーはブランド淡色帯。
  return (
    <Card className={`gap-0 overflow-hidden rounded-2xl border-warm-200 bg-white py-0 shadow-sm ${className || ""}`}>
      <div className="flex items-center gap-3 px-5 py-3.5 bg-primary-10 border-b border-primary-100">
        {iconSrc ? (
          <img src={iconSrc} alt="" className="w-7 h-7 shrink-0" />
        ) : Icon ? (
          <Icon className="w-7 h-7 text-primary-600 shrink-0" />
        ) : null}
        <div className="min-w-0">
          <p className="text-h6 font-bold text-neutral-800 leading-tight">{title}</p>
          {sub && <p className="text-[11px] text-neutral-500 leading-tight">{sub}</p>}
        </div>
      </div>
      <CardContent className="p-5 space-y-3">{children}</CardContent>
    </Card>
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

// Bottom sticky action bar — `solid` turns the bar the same blue as the guidance band
export function ActionBar({ children, solid, bg }: { children: React.ReactNode; solid?: boolean; bg?: string }) {
  const base = "sticky bottom-0 z-20 backdrop-blur border-t px-5 py-3 space-y-2 transition-colors duration-300";
  return (
    <div className={`${base} ${bg ? "" : (solid ? "bg-primary-10 border-primary-100" : "bg-white/95 border-warm-200")}`}
      style={bg ? { background: bg, borderTopColor: "rgba(15,23,42,0.06)" } : undefined}>
      {children}
    </div>
  );
}

// Wireframe form field
export function Field({ label, placeholder, required, hint, value, onChange, disabled }: { label: string; placeholder?: string; required?: boolean; hint?: string; value?: string; onChange?: React.ChangeEventHandler<HTMLInputElement>; disabled?: boolean }) {
  // shadcn <Label> + <Input> へ委譲。
  const id = React.useId();
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-caption font-medium text-neutral-600">
        {label}{required && <span className="text-[color:var(--secondary-color-700)] ml-0.5">*</span>}
      </Label>
      <Input
        id={id}
        placeholder={placeholder}
        defaultValue={value}
        onChange={onChange}
        disabled={disabled}
        className={`fld h-11 rounded-lg border px-3 text-h6 placeholder:text-neutral-400 ${disabled ? "border-warm-200 bg-warm-200/60 text-neutral-400 cursor-not-allowed" : "border-warm-300 bg-white text-neutral-800"}`}
      />
      {hint && <span className="text-caption text-neutral-400">{hint}</span>}
    </div>
  );
}

// Read-only / locked display field（入力済み・変更不可）
export function LockedField({ label, value }: { label: string; value: string }) {
  // shadcn <Label> + 無効化した <Input> へ委譲 (表示専用)。
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="flex items-center gap-2 text-caption font-medium text-neutral-600">
        {label}
        <span className="inline-flex items-center gap-1 rounded-full bg-warm-200 px-2 py-0.5 text-[10px] font-medium text-neutral-500">変更不可</span>
      </Label>
      <div className="relative">
        <Input
          value={value}
          readOnly
          disabled
          className="fld h-11 rounded-lg border border-warm-200 bg-warm-200/60 px-3 pr-9 text-h6 text-neutral-500"
        />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
      </div>
    </div>
  );
}

// Wireframe select (dropdown)
export function Select({ label, required, hint, value, onChange, options = [], disabled }: { label: string; required?: boolean; hint?: string; value?: string; onChange?: React.ChangeEventHandler<HTMLSelectElement>; options?: string[]; disabled?: boolean }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-caption font-medium text-neutral-600">
        {label}{required && <span className="text-[color:var(--secondary-color-700)] ml-0.5">*</span>}
      </span>
      <div className="relative">
        <select defaultValue={value} onChange={onChange} disabled={disabled}
          className={`fld appearance-none w-full h-11 rounded-lg border px-3 pr-9 text-h6 ${disabled ? "border-warm-200 bg-[#EFEFEF] text-neutral-400 cursor-not-allowed" : "border-warm-300 bg-white text-neutral-800"}`}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"><path d="M6 9l6 6 6-6"/></svg>
      </div>
      {hint && <span className="text-caption text-neutral-400">{hint}</span>}
    </label>
  );
}

export const PREFS: string[] = ["都道府県を選択","北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"];

/* ============================================================
   SCREEN 1 — イントロ / ヒーロー
   ============================================================ */
export function ScreenIntro({ go }: { go: Go }) {
  return (
    <>
      <AppBar title="保険" />
      <div className="flex-1 overflow-y-auto no-sb">
        {/* hero */}
        <div className="px-5 pt-6 pb-8" style={{ backgroundImage: "url('/assets/theo-tdf/hero_bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <img src="/assets/theo-tdf/logo_theo_insurance_blue.svg" alt="THEO つみたて安心ほけん" className="h-7 mb-5" />
          <p className="font-en text-caption tracking-[0.18em] uppercase text-neutral-500">Embedded Insurance</p>
          <h1 className="mt-2 text-h2 font-bold leading-snug text-neutral-800">信頼を、もっと<br/>触れる距離に。</h1>
          <p className="mt-3 text-h6 leading-relaxed text-neutral-700">THEO の資産運用に、<br/>もしものときの備えをひとつに。</p>
          <div className="mt-4"><Badge>重要</Badge></div>
        </div>

        <div className="px-5 py-6 space-y-6">
          {/* hook card */}
          <div className="rounded-2xl border border-warm-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="font-mono text-caption tracking-[0.14em] uppercase text-neutral-400">このアプリだけの備え</p>
              <img src="/assets/theo-tdf/logo_td.png" alt="T&Dフィナンシャル生命" className="h-4 shrink-0" />
            </div>
            <p className="text-h5 font-bold text-neutral-800 leading-relaxed">
              働けなくなっても、<br/>つみたては止めない。
            </p>
            <p className="mt-2 text-caption text-neutral-500 leading-relaxed">
              就業不能時に、毎月の積立額を保険金として給付。資産形成の歩みを止めません。
            </p>
            <div className="mt-4 rounded-lg border border-warm-200 overflow-hidden bg-white">
              <img src="/assets/theo-tdf/hero-chart.png" alt="就業不能時も将来の積立金額を保障するイメージ図" className="w-full block" />
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
                  <p className="text-h6 font-bold text-neutral-800">{v.t}</p>
                  <p className="text-caption text-neutral-500 leading-relaxed">{v.d}</p>
                </div>
              </div>
            ))}
          </div>

          {/* premium teaser */}
          <div className="flex items-end justify-between rounded-xl bg-warm-100 px-5 py-4">
            <span className="text-caption text-neutral-500">保険料</span>
            <span className="text-neutral-800"><span className="font-en text-h1 font-semibold" style={{ color: '#065fe3' }}>480</span><span className="text-h6"> 円 / 月〜</span></span>
          </div>
        </div>
      </div>

      <ActionBar>
        <Btn kind="cta" onClick={() => go(1)}>つぎへ<Ic.chevR className="w-4 h-4" /></Btn>
        <p className="text-center text-caption text-neutral-400">引受保険会社 / 重要事項は申込前にご確認ください</p>
      </ActionBar>
    </>
  );
}

/* ============================================================
   SCREEN 2 — プラン選択
   ============================================================ */
/* 告知事項（健康告知）— 4プラン共通のベース項目。
   ※ 先進医療プランは告知不要。各プラン固有の告知文言は添付PPTX反映時に上書きします。 */
export const DISCLOSURE_INTRO = [
  { head: "告知に関する重要事項" },
  { p: "下記の内容をご確認のうえ、お申し込みください。" },
  { strong: "保険商品お申し込みの方へ" },
  { p: "募集用資料・告知書・告知説明資料等において、ご契約者や被保険者は健康状態等について告知をしていただく義務があります。" },
  { p: "生命保険は、多数の人々が公平に保険料を出し合い、相互に保険し合う制度です。したがって、初めから健康状態の良くない方や危険な職業に従事されている方等が無条件に契約されますと、保険料負担の公平性が保てません。" },
  { p: "このため、当社では、過去の傷病歴（傷病名・治療期間等）、現在の健康状態、職業、身体の障がい状況、危険な趣味などについて「告知書」をもって、おたずねすることになっております。事実をありのままに正確にもれなくお知らせ（告知）ください。" },
  { p: "ご加入（責任開始期）前に生じた病気やケガにより、支払事由が生じた場合には、保険金・給付金はお支払いできません。" },
  { p: "（事例）契約前より高血圧・脂質異常で定期的に服薬中の場合\n以下告知項目には該当しませんが、契約3ヶ月後に直接的な原因による脳梗塞を発症した場合などもお支払いできない場合があります。" },
  { p: "※ただし、以下のような場合には責任開始期以後発生した原因によるものとみなし、保険金・給付金をお支払いします。" },
  { ul: [
    "責任開始期から2年を経過した後で支払事由が生じた場合",
    "責任開始期以降、その疾病やケガによって医師の診察を受けたことがなく、かつ診断等による異常な指摘も受けていない場合。ただし、その原因となった病気やケガによる症状について被保険者が認識または自覚していた場合を除きます。",
  ] },
  { p: "※告知に、以下のような事実を故意または重大な過失によって告知されなかったり、事実と異なることを告知された場合には、保険・給付契約を解除させていただくことがあります。お気をつけください。" },
  { ul: [
    "責任開始期から2年を経過するまでに支払事由が生じた場合",
    "被保険者または契約者が、当社の担当者（生命保険募集人）に告知の際、事実を告げることを妨げられた場合、または事実と異なる告知をすることを勧められた場合などには、解除できないことがあります。ただし、その原因となった事実についてはこの限りではありません。",
    "なお、お客さまが告知されたことが事実と相違していても、当社の担当者がその相違を知り、または過失により知らなかった場合などには解除できないことがあります。",
  ] },
];

export const DISCLOSURE_BASE = [
  ...DISCLOSURE_INTRO,
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
];

export const PLANS: Plan[] = [
  { id: "cancer", name: "がん保障型", price: "¥980", death: true,
    lead: "がんと診断された場合に、給付金が支払われます",
    feat: ["診断給付金：最大 ¥1,000,000（逓減給付型）", "保険期間：1年（自動更新）", "告知のみ・診査不要"],
    tooltip: { sections: [
      { head: "「がん」とは", body: "がん（悪性新生物）を指します。\n前がん状態の病変、境界悪性、上皮内がんは、保障対象とはなりません。したがって子宮筋腫のような良性新生物、大腸の粘膜内がんなどの上皮内がんは、保障対象とはなりません。" },
    ] },
    disclosure: DISCLOSURE_BASE },
  { id: "three", name: "三大疾病保障型", price: "¥1,180", death: true,
    lead: "がん・急性心筋梗塞・脳卒中と診断された場合に、給付金が支払われます",
    feat: ["診断給付金：最大 ¥1,000,000（逓減給付型）", "保険期間：1年（自動更新）", "告知のみ・診査不要"],
    tooltip: { sections: [
      { head: "三大疾病とは", body: "以下の病気を指します。\n・がん（悪性新生物）\n・急性心筋梗塞\n・脳卒中\nがん（悪性新生物）について、前がん状態の病変、境界悪性、上皮内がんは、保障対象とはなりません。したがって子宮筋腫のような良性新生物、大腸の粘膜内がんなどの上皮内がんは、保障対象とはなりません。" },
    ] },
    disclosure: DISCLOSURE_BASE },
  { id: "care", name: "障害介護保障型", price: "¥680", death: true,
    lead: "障害・介護状態になった場合に、給付金が支払われます",
    feat: ["給付：月額 最大 ¥50,000", "保険期間：1年（自動更新）", "告知のみ・診査不要"],
    tooltip: { sections: [
      { head: "障害・介護状態とは", body: "以下の状態を指します。\n・障害等級2級以上の状態\n・要介護2以上の状態" },
    ] },
    disclosure: DISCLOSURE_BASE },
  { id: "cancer_care", name: "がん・障害介護保障型", price: "¥1,480", death: true,
    lead: "がんと診断された場合、または障害・介護状態になった場合に、給付金が支払われます",
    feat: ["がん診断給付金：最大 ¥1,000,000", "障害・介護：月額 最大 ¥50,000", "保険期間：1年（自動更新）"],
    tooltip: { sections: [
      { head: "「がん」とは", body: "がん（悪性新生物）を指します。\n前がん状態の病変、境界悪性、上皮内がんは、保障対象とはなりません。したがって子宮筋腫のような良性新生物、大腸の粘膜内がんなどの上皮内がんは、保障対象とはなりません。" },
      { head: "障害・介護状態とは", body: "以下の状態を指します。\n・障害等級2級以上の状態\n・要介護2以上の状態" },
    ] },
    disclosure: DISCLOSURE_BASE },
  { id: "three_care", name: "三大疾病・障害介護保障型", price: "¥1,780", death: true,
    lead: "三大疾病と診断された場合、または障害・介護状態になった場合に、給付金が支払われます",
    feat: ["三大疾病給付金：最大 ¥1,000,000", "障害・介護：月額 最大 ¥50,000", "保険期間：1年（自動更新）"],
    tooltip: { sections: [
      { head: "三大疾病とは", body: "以下の病気を指します。\n・がん（悪性新生物）\n・急性心筋梗塞\n・脳卒中\n※がん（悪性新生物）について、前がん状態の病変、境界悪性、上皮内がんは、保障対象とはなりません。したがって子宮筋腫のような良性新生物、大腸の粘膜内がんなどの上皮内がんは、保障対象とはなりません。" },
      { head: "障害・介護状態とは", body: "以下の状態を指します。\n・障害等級2級以上の状態\n・要介護2以上の状態" },
    ] },
    disclosure: DISCLOSURE_BASE },
];

/* 告知項目モーダル — プラン選択画面のツールチップ押下で表示 */
export function DisclosureModal({ plan, onClose, confirm, onConfirm }: { plan: Plan | null; onClose: () => void; confirm?: boolean; onConfirm?: () => void }) {
  if (!plan) return null;
  return (
    <div className="absolute inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 fade-in" onClick={onClose} />
      <div className="sheet-up absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-xl max-h-[88%] flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-warm-200">
          <h3 className="flex items-center gap-2 text-h5 font-bold text-neutral-800">
            <span className="rounded-full bg-primary-10 text-primary-700 px-2 py-0.5 text-[11px] font-bold leading-none">告知</span>
            {plan.name}の告知項目
          </h3>
          <button onClick={onClose} className="grid place-items-center w-8 h-8 rounded-full bg-warm-100 text-neutral-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto no-sb px-5 py-4 space-y-3">
          {plan.disclosure ? (
            <AgreeBlocks blocks={plan.disclosure} />
          ) : (
            <div className="rounded-lg border border-warm-200 bg-warm-50 p-4">
              <p className="text-caption text-neutral-700 leading-relaxed">本プランはご加入にあたっての健康告知が不要です。所定の条件を満たす方であれば、告知なしでお申し込みいただけます。</p>
            </div>
          )}
        </div>
        <div className="px-5 py-3 border-t border-warm-200">
          {confirm ? (
            <div className="flex gap-3">
              <div className="flex-1"><Btn kind="button" onClick={onClose}>キャンセル</Btn></div>
              <div className="flex-1"><Btn kind="button" onClick={onConfirm || onClose}>すべていいえ</Btn></div>
            </div>
          ) : (
            <Btn kind="button" onClick={onClose}>閉じる</Btn>
          )}
        </div>
      </div>
    </div>
  );
}

export function PlanCard({ p, selected, onSelect, initialTtOpen }: { p: Plan; selected: boolean; onSelect: () => void; initialTtOpen?: boolean }) {
  const [ttOpen, setTtOpen] = React.useState(initialTtOpen ?? false);
  return (
    <div onClick={onSelect} role="button" className={`w-full text-left rounded-2xl border bg-white overflow-hidden transition cursor-pointer ${selected ? "border-primary-300" : "border-warm-200"}`}>
      <div className={`flex items-center justify-between gap-3 px-4 py-3 border-b transition-colors ${selected ? "bg-primary-10 border-primary-100" : "bg-[#EFEFEF] border-warm-200"}`}>
        <div className="flex items-center gap-2">
          <span className={`grid place-items-center w-5 h-5 rounded-full border-2 shrink-0 ${selected ? "border-primary bg-primary text-white" : "border-warm-300 bg-white"}`}>
            {selected && <Ic.check className="w-3 h-3" />}
          </span>
          <span className="text-h6 font-bold text-neutral-800">{p.name}</span>
          {p.tooltip && (
            <button type="button" onClick={(e) => { e.stopPropagation(); setTtOpen((o) => !o); }}
              className={`grid place-items-center w-5 h-5 rounded-full border text-[11px] font-bold leading-none shrink-0 transition-colors ${ttOpen ? "border-primary bg-primary-10 text-primary-600" : "border-neutral-300 bg-white text-neutral-400 hover:border-primary hover:text-primary-600"}`}>?</button>
          )}
        </div>
        {p.tag && <Badge tone="secondary">{p.tag}</Badge>}
      </div>
      {ttOpen && (
        <div className="mx-4 mt-3 p-3.5 rounded-xl bg-primary-10 border border-primary-100 space-y-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <span className="text-caption font-bold text-neutral-800">死亡保障</span>
            <span className={`text-h6 font-bold leading-none ${p.death ? "text-primary-600" : "text-neutral-400"}`}>{p.death ? "◯" : "✗"}</span>
          </div>
          {p.tooltip?.sections.map((s, i) => (
            <div key={i} className="space-y-1">
              <p className="text-caption font-bold text-neutral-800 leading-snug">{s.head}</p>
              <p className="text-caption text-neutral-700 leading-relaxed whitespace-pre-line">{s.body}</p>
            </div>
          ))}
        </div>
      )}
      <div className="p-4">
        <p className="text-caption text-neutral-500">{p.lead}</p>
        <div className="mt-3 flex items-baseline justify-end gap-1 text-neutral-800">
          <span className="font-en text-h3 font-semibold tabular-nums">{p.price.replace("¥", "")}</span><span className="text-caption"> 円 / 月</span>
        </div>
        <ul className="mt-3 space-y-1.5 border-t border-warm-200 pt-3">
          {p.feat.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-caption text-neutral-600">
              <Ic.check className="w-3.5 h-3.5 text-primary shrink-0" />{f.replace(/¥([\d,]+)/g, "$1 円")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* Divider used inside combined (multi-section) pages */
export function StepSection({ label, n, big, className, children }: { label: string; n?: number; big?: boolean; className?: string; children: React.ReactNode }) {
  if (big) {
    return (
      <section className={`space-y-4 ${className || ""}`}>
        <div className="flex items-center gap-3">
          {n != null && (
            <span className="grid place-items-center w-8 h-8 rounded-full text-white font-en text-h5 font-bold shrink-0" style={{ backgroundImage: "linear-gradient(135deg, #075FE3 0%, #03CDFE 100%)" }}>{n}</span>
          )}
          <h2 className="text-h4 font-bold text-neutral-800">{label}</h2>
        </div>
        {children}
      </section>
    );
  }
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        {n != null && (
          <span className="grid place-items-center w-8 h-8 rounded-full text-white font-en text-h5 font-bold shrink-0" style={{ backgroundImage: "linear-gradient(135deg, #075FE3 0%, #03CDFE 100%)" }}>{n}</span>
        )}
        <span className="font-mono text-caption tracking-[0.14em] uppercase text-primary-600 whitespace-nowrap">{label}</span>
        <span className="flex-1 h-px bg-warm-200" />
      </div>
      {children}
    </section>
  );
}

/* ============================================================
   iOS風 ドラムロール 日付ピッカー（年・月・日）
   慣性スクロール＋中央スナップ＋選択行ハイライトを再現
   ============================================================ */
export const WHEEL_ITEM = 38;            // 各行の高さ(px)
export const WHEEL_VISIBLE = 5;          // 表示行数（奇数）
export const WHEEL_H = WHEEL_ITEM * WHEEL_VISIBLE;
export const WHEEL_PAD = (WHEEL_H - WHEEL_ITEM) / 2;

export function WheelCol({ items, index, onChange, flex, align }: { items: string[]; index: number; onChange: (v: number) => void; flex?: number; align?: string }) {
  const ref = useRef<any>(null);
  const [cur, setCur] = useState(index);
  const settle = useRef<any>(null);
  const programmatic = useRef(false);

  // 外部から index が変わったら、その行へスクロールを合わせる
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = index * WHEEL_ITEM;
    if (Math.abs(el.scrollTop - target) > 1) {
      programmatic.current = true;
      el.scrollTop = target;
      setCur(index);
      setTimeout(() => { programmatic.current = false; }, 60);
    }
  }, [index, items.length]);

  const handleScroll = () => {
    const el = ref.current;
    if (!el) return;
    const live = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / WHEEL_ITEM)));
    if (live !== cur) setCur(live);          // スクロール中もハイライトを追従
    if (programmatic.current) return;
    clearTimeout(settle.current);
    settle.current = setTimeout(() => {       // 指を離して止まったらスナップ＋確定
      const i = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / WHEEL_ITEM)));
      el.scrollTo({ top: i * WHEEL_ITEM, behavior: "smooth" });
      if (i !== index) onChange(i);
    }, 90);
  };

  return (
    <div ref={ref} onScroll={handleScroll}
      className="no-sb overflow-y-scroll"
      style={{
        height: WHEEL_H, flex: flex || 1, scrollSnapType: "y mandatory",
        WebkitOverflowScrolling: "touch",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 26%, #000 74%, transparent)",
        maskImage: "linear-gradient(to bottom, transparent, #000 26%, #000 74%, transparent)",
      }}>
      <div style={{ height: WHEEL_PAD }} />
      {items.map((it, i) => {
        const dist = Math.abs(i - cur);
        return (
          <div key={i} className="grid select-none"
            style={{
              height: WHEEL_ITEM, scrollSnapAlign: "center",
              alignItems: "center", justifyItems: align === "end" ? "end" : "center",
              paddingRight: align === "end" ? 2 : 0,
              fontSize: dist === 0 ? 19 : 17,
              fontWeight: dist === 0 ? 700 : 400,
              color: dist === 0 ? "var(--neutral-color-800, #1f2937)"
                   : dist === 1 ? "var(--neutral-color-500, #6b7280)"
                   : "var(--neutral-color-300, #cbd5e1)",
              opacity: dist >= 3 ? 0.4 : 1,
              transition: "font-size .12s, color .12s",
            }}>
            {it}
          </div>
        );
      })}
      <div style={{ height: WHEEL_PAD }} />
    </div>
  );
}

export function daysInMonth(y: number, m: number) { return new Date(y, m, 0).getDate(); } // m: 1-12

export function DateDrumSheet({ open, value, onClose, onDone }: { open: boolean; value: string; onClose: () => void; onDone: (v: string) => void }) {
  const NOW = new Date();
  const MIN_Y = 1925, MAX_Y = NOW.getFullYear();
  const years: number[] = []; for (let v = MAX_Y; v >= MIN_Y; v--) years.push(v); // 新しい年が上
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const init = value ? value.split("-").map(Number) : [1990, 1, 1];
  const [yy, setYy] = useState(init[0]);
  const [mm, setMm] = useState(init[1]);
  const [dd, setDd] = useState(init[2]);

  // シートを開くたびに現在値で初期化
  useEffect(() => {
    if (!open) return;
    const v = value ? value.split("-").map(Number) : [1990, 1, 1];
    setYy(v[0]); setMm(v[1]); setDd(v[2]);
  }, [open]);

  const dim = daysInMonth(yy, mm);
  const days = Array.from({ length: dim }, (_, i) => i + 1);
  // 月末日を超えたら丸める（例: 3/31 → 2月 で 2/28 に）
  useEffect(() => { if (dd > dim) setDd(dim); }, [yy, mm]);

  if (!open) return null;
  const yIdx = years.indexOf(yy);
  const mIdx = months.indexOf(mm);
  const dIdx = days.indexOf(dd);

  return (
    <div className="absolute inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 fade-in" onClick={onClose} />
      <div className="sheet-up absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-warm-200">
          <button onClick={onClose} className="text-h6 text-neutral-500 px-1 py-1">キャンセル</button>
          <span className="text-caption font-bold text-neutral-700">生年月日</span>
          <button onClick={() => onDone(`${yy}-${pad2(mm)}-${pad2(dd)}`)}
            className="text-h6 font-bold text-primary-600 px-1 py-1">完了</button>
        </div>
        <div className="relative px-3 py-2">
          {/* 中央の選択バンド */}
          <div className="pointer-events-none absolute left-3 right-3 rounded-lg bg-warm-100/70 border-y border-warm-200"
            style={{ top: WHEEL_PAD + 8, height: WHEEL_ITEM }} />
          <div className="relative flex">
            {/* 各列：数字ホイール（右寄せ）＋ 専用ラベル列。重なりを防止 */}
            <div className="flex items-center" style={{ flex: 1.5 }}>
              <WheelCol items={years.map((v) => `${v}`)} index={yIdx} onChange={(i) => setYy(years[i])} align="end" />
              <span className="shrink-0 w-5 pl-1 text-caption text-neutral-500 font-medium">年</span>
            </div>
            <div className="flex items-center" style={{ flex: 1 }}>
              <WheelCol items={months.map((v) => `${v}`)} index={mIdx} onChange={(i) => setMm(months[i])} align="end" />
              <span className="shrink-0 w-5 pl-1 text-caption text-neutral-500 font-medium">月</span>
            </div>
            <div className="flex items-center" style={{ flex: 1 }}>
              <WheelCol items={days.map((v) => `${v}`)} index={dIdx} onChange={(i) => setDd(days[i])} align="end" />
              <span className="shrink-0 w-5 pl-1 text-caption text-neutral-500 font-medium">日</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function pad2(n: number) { return String(n).padStart(2, "0"); }
export function fmtBirth(v: string) {
  if (!v) return "";
  const [y, m, d] = v.split("-").map(Number);
  return `${y}年 ${m}月 ${d}日`;
}

/* ============================================================
   STEP 2 — プラン選択 ＋ 補償内容 ＋ 不足分メール送信（1ページ）
   ============================================================ */
export function ScreenOverview({ go }: { go: Go }) {
  const heroRef = useRef<any>(null);
  const heroBgRef = useRef<any>(null);
  const [solid, setSolid] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [formPage, setFormPage] = useState(1);
  const bindScroll = (el: any) => {
    if (!el || el.__bound) return;
    el.__bound = true;
    el.addEventListener("scroll", () => {
      const h = heroRef.current;
      setSolid(el.scrollTop >= (h ? h.offsetHeight - 16 : 220));
      setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 48);
      if (heroBgRef.current) {
        heroBgRef.current.style.transform = `translateY(${el.scrollTop * 0.4}px)`;
      }
    }, { passive: true });
  };
  return (
    <>
      {/* 固定ステータスバー（パララックスと一緒に動かない） */}
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 pt-2.5 pb-1 text-caption font-en font-medium text-neutral-800 pointer-events-none">
        <span>9:41</span><span className="flex items-center gap-1"><span>5G</span><span>100%</span></span>
      </div>
      <div ref={bindScroll} className="flex-1 overflow-y-auto no-sb">
        {/* ---- ヒーロー（ステータスバー含む、背景画像でスクロール） ---- */}
        {/* ---- ヒーロー: img で自然な高さ、コンテンツを絶対配置でオーバーレイ ---- */}
        <div ref={heroRef} style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
          <img ref={heroBgRef} src="/assets/theo-tdf/hero_bg.png" alt="" style={{ width: '100%', display: 'block', willChange: 'transform', transformOrigin: 'top center' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
          {/* フェイクステータスバー（プレースホルダー：Phone側は非表示、固定オーバーレイを上に描画） */}
          <div className="flex items-center justify-between px-6 pt-2.5 pb-1 text-caption font-en font-medium text-transparent" aria-hidden="true">
            <span>9:41</span>
            <span className="flex items-center gap-1"><span>5G</span><span>100%</span></span>
          </div>
          {/* インラインAppBar - スクロール後にsolid化 */}
          <div className="sticky top-0 z-20 transition-colors duration-200"
               style={solid ? HEADER_GRAD_APPBAR : { background: 'transparent' }}>
            <div className="flex items-center justify-between px-3 h-14">
              <span className="w-9 shrink-0" />
              <div className={`flex items-center gap-1.5 min-w-0 transition-opacity duration-200 ${solid ? "opacity-100" : "opacity-0"}`}>
                <span className="font-en font-semibold tracking-[0.1em] text-h6 text-white">THEO</span>
                <span className="text-h6 font-medium truncate text-white">つみたて安心ほけん</span>
              </div>
              <span className="w-9 shrink-0" />
            </div>
          </div>
          {/* ロゴ：絶対配置（上左・ステータスバー直下） */}
          <img src="/assets/theo-tdf/logo_theo_insurance_blue.svg" alt="THEO つみたて安心ほけん"
            style={{ position: 'absolute', top: '48px', left: '15px', height: '1.9rem' }} />
          {/* テキスト：絶対配置 */}
          <div style={{ position: 'absolute', top: '182px', left: '20px', right: '20px' }}>
            <p className="font-en text-caption tracking-[0.18em] uppercase text-neutral-500" style={{ marginLeft: '4px' }}>Embedded Insurance</p>
            <h1 className="mt-1 font-bold leading-snug text-neutral-800" style={{ fontSize: "31px", lineHeight: 1.3, marginLeft: '-2px' }}>つみたてながら、<br/>もしもに備える。</h1>
            <p className="mt-2 text-h6 leading-relaxed text-neutral-700">将来に向けた<br/>資産形成のためのほけん</p>
          </div>
          </div>{/* /absolute overlay */}
        </div>{/* /relative img wrapper */}

        {/* ステッパー直上：hero高さで確定するためスペーサーは不要 */}
        {/* progress — sticks to top once the blue hero scrolls out of view */}
        <div className="sticky top-0 z-30" style={{ marginTop: '-10px' }}>
          <Steps n={1} go={go} />
        </div>

        <div className="px-5 pt-6" style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #F2FBFE 100%)" }}>
          {/* hook card */}
          <div className="space-y-6">
            <div className="-mx-1">
              <div className="flex items-center justify-end gap-3 mb-8">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[9px] text-neutral-400 leading-none whitespace-nowrap">引受保険会社</span>
                  <img src="/assets/theo-tdf/logo_td.png" alt="T&Dフィナンシャル生命" className="h-4" />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="inline-flex items-center px-3.5 py-1.5 rounded-full font-bold text-white" style={{ backgroundColor: '#065fe3', fontSize: '0.82rem' }}>
                  THEOのお客様限定
                </div>
              </div>
              <div className="mt-4 flex flex-col items-center gap-4">
                <img src="/assets/theo-tdf/logo_theo_insurance_blue.svg" alt="THEO つみたて安心 ほけん" className="h-[42px]" />
                <div className="w-full grid grid-cols-3 gap-3">
                {[
                  { svg: <img src="/assets/theo-tdf/activity-heart-circle.svg" alt="積立もあんしんに" className="w-9 h-9" />, t: "積立も\nあんしんに" },
                  { svg: <img src="/assets/theo-tdf/graduation-cap.svg" alt="学資保険の代わりにも" className="w-9 h-9" />, t: "学資保険\nの代わりにも" },
                  { svg: <img src="/assets/theo-tdf/hand-holding-heart.svg" alt="もしもの備えに" className="w-9 h-9" />, t: "もしもの\n備えに" },
                ].map((f, k) => (
                  <div key={k} className="flex flex-col items-center text-center gap-2">
                    <div className="text-primary" style={{width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#065FE3'}}>{f.svg}</div>
                    <p className="text-caption font-bold text-neutral-700 leading-snug whitespace-pre-line">{f.t}</p>
                  </div>
                ))}
                </div>
              </div>
              <div className="mt-6 overflow-hidden">
                <img src="/assets/theo-tdf/chart_savings.png" alt="就業不能時も将来の積立金額を保障するイメージ図" className="w-full block" />
              </div>

              {/* 商品概要（図版の下） */}
              <div className="mt-6 space-y-6 mb-9">
                <div className="text-right">
                  <a className="inline-flex items-center gap-1.5 font-bold text-h6 cursor-pointer underline-offset-2 hover:underline" style={{ color: "var(--color-link)", fontSize: "14px" }}>
                    <img src="/assets/theo-tdf/info-circle.svg" alt="" className="w-4 h-4" />
                    詳細なサービス内容はこちら
                  </a>
                </div>
                <div className="text-left">
                  <span className="inline-block text-h5 font-bold text-neutral-800 py-0.5 rounded">保険名称</span>
                  <p className="mt-2 text-h6 text-neutral-700">無配当特定疾病障害介護保障保険（団体型）</p>
                </div>
                <div className="text-left">
                  <span className="inline-block text-h5 font-bold text-neutral-800 py-0.5 rounded">保障期間</span>
                  <p className="mt-2 text-h6 text-neutral-700">5年〜40年（最大）</p>
                  <p className="mt-1 text-caption text-neutral-500 leading-relaxed">*保険期間は契約日（更新日）から1年であり、保障期間満了まで1年ごとの更新となります。</p>
                </div>
              </div>
            </div>

            {/* ▼ 誘導ブロック: フルブリードのブルー帯 — CTAと地続きにして同一グループと認識させる */}
            <div className="-mx-5 mt-8 bg-primary-10 px-5 pt-10 pb-[18px]">
              <div className="mb-12">
                <div className="text-center">
                  <span className="inline-block text-h3 font-bold text-neutral-900 px-2 py-0.5 rounded">必要書類</span>
                  <p className="mt-2 text-h6 text-neutral-500">お手続きの際に必要となる書類を<br/>ご準備ください</p>
                </div>
                <div className="mt-2 flex flex-col items-center gap-1 px-4">
                  <Ic.cardArt className="w-20 h-auto text-primary-500" />
                  <span className="text-[11px] font-medium text-neutral-600">ご本人名義のクレジットカード</span>
                </div>
              </div>
              <div className="border-t border-primary-100 mb-[45px]"></div>
              <div className="text-center mb-5">
                <h2 className="text-h3 font-bold text-neutral-900 leading-snug text-balance">5つのプランから選ぶだけ</h2>
                <p className="mt-2 text-h6 text-neutral-500 leading-relaxed text-balance">最短10分で、お申し込みが完了します。</p>
              </div>
              <div>
                <div className="flex flex-col items-center text-center gap-3">
                  <div>
                    <p className="text-caption text-neutral-500">保険料</p>
                    <p className="text-neutral-900"><span className="font-en text-h1 font-bold" style={{ color: "#065fe3" }}>480</span><span className="text-h6 font-bold"> 円 / 月〜</span></p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-caption font-bold shadow-sm" style={{ color: "var(--color-emphasis)" }}><Ic.check className="w-3.5 h-3.5" />いつでも見直し・解約OK</span>
                </div>
              </div>
              <div className="mt-7 flex flex-col items-center gap-0.5">
                <p className="text-caption font-bold text-primary-500">まずはプランを選んでみましょう</p>
                <Ic.chevD className="w-5 h-5 text-primary-500 animate-bounce" />
              </div>
            </div>

          </div>
        </div>
      </div>

      <ActionBar solid>
        <Btn kind="cta" onClick={() => go(1)}>プランを選ぶ<Ic.chevR className="w-4 h-4" /></Btn>
      </ActionBar>
    </>
  );
}

export function ScreenStep2({ go, sel, setSel, m, setM, y, setY, initialNoticeOpen, initialAgree, initialSimOpen, initialShowSend, initialTipIdx, initialBirth, emailVerified, simFirst }: { go: Go; sel: string; setSel: React.Dispatch<React.SetStateAction<string>>; m: number; setM: React.Dispatch<React.SetStateAction<number>>; y: number; setY: React.Dispatch<React.SetStateAction<number>>; initialNoticeOpen?: boolean; initialAgree?: boolean; initialSimOpen?: boolean; initialShowSend?: boolean; initialTipIdx?: number; initialBirth?: string; emailVerified?: boolean; simFirst?: boolean }) {
  const plan = PLANS.find((p) => p.id === sel) || PLANS[0];
  const [agree, setAgree] = useState(initialAgree ?? false);
  const [noticeOpen, setNoticeOpen] = useState(initialNoticeOpen ?? false);
  const [birth, setBirth] = useState(initialBirth ?? "");
  const [gender, setGender] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const sendSecRef = useRef<any>(null);
  const [showSend, setShowSend] = useState(initialShowSend ?? false);
  const bindScroll = (el: any) => {
    if (!el || el.__bound) return;
    el.__bound = true;
    el.addEventListener("scroll", () => {
      const sec = sendSecRef.current;
      if (sec) {
        const secTop = sec.getBoundingClientRect().top;
        const contBottom = el.getBoundingClientRect().bottom;
        setShowSend(secTop < contBottom - 64);
      }
    }, { passive: true });
  };
  const birthGenderFields = (
            <div className="space-y-4">
              <div>
                <h3 className="text-h6 font-medium text-neutral-800 leading-snug">生年月日・性別</h3>
                <p className="text-caption text-neutral-500 mt-1">お客様情報。保険料の算出に使用します。</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-caption font-medium text-neutral-600">生年月日<span className="text-[color:var(--secondary-color-700)] ml-0.5">*</span></span>
                <button type="button" onClick={() => setPickerOpen(true)}
                  className={`fld flex items-center justify-between gap-2 h-11 rounded-lg border border-warm-300 bg-white px-3 text-h6 text-left ${birth ? "text-neutral-800" : "text-neutral-400"}`}>
                  <span className="truncate">{birth ? fmtBirth(birth) : "選択してください"}</span>
                  <img src="/assets/theo-tdf/calendar.svg" alt="" className="w-5 h-5 shrink-0" />
                </button>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-caption font-medium text-neutral-600">性別<span className="text-[color:var(--secondary-color-700)] ml-0.5">*</span></span>
                <div className="flex gap-2">
                  {["男性", "女性"].map((g) => (
                    <button key={g} onClick={() => setGender(g)}
                      className={`flex-1 h-11 rounded-lg border text-h6 transition-colors ${gender === g ? "border-primary bg-primary-10 text-primary-700 font-bold" : "border-warm-300 bg-white text-neutral-600"}`}>{g}</button>
                  ))}
                </div>
              </div>
            </div>
  );
  return (
    <>
      <AppBar title="保険" onBack={() => go(0)} />
      <div ref={bindScroll} className="flex-1 overflow-y-auto no-sb">
        <div className="sticky top-0 z-30">
          <Steps n={2} go={go} />
        </div>
        <div className="px-5 pt-6 pb-0 space-y-8" style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #F2FBFE 100%)" }}>
          {/* ---- 受け止めコピー + お客様情報（生年月日・性別を先に入力） ---- */}
          <div className="space-y-5">
            <div>
              <h2 className="text-h3 font-bold text-neutral-900 leading-snug text-balance">さっそく、はじめましょう。</h2>
              <p className="mt-2 text-h6 text-neutral-600 leading-relaxed text-balance">ご入力はかんたん。まずは保険料の算出に必要な情報からどうぞ。</p>
            </div>
            {!simFirst && birthGenderFields}
          </div>

          {!simFirst && (<>
          {/* ---- プラン選択 ---- */}
          <div style={{ marginTop: '80px' }}>
          <StepSection label="プランを選ぶ" n={1} big>
          <div>
            <p className="text-caption text-neutral-500">ご希望の保障プランをご選択ください</p>
          </div>
          {PLANS.map((p, i) => (
            <PlanCard key={p.id} p={p} selected={sel === p.id} onSelect={() => setSel(p.id)} initialTtOpen={i === initialTipIdx} />
          ))}
          <p className="text-caption text-neutral-500 leading-relaxed px-1">
            ※ 保険料は年齢・性別により変動します。
          </p>
        </StepSection>
        </div>

        {/* ---- 保険料シミュレーション ---- */}
        <div className="-mx-5 px-5 pt-6 pb-14 relative" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F2FBFE 100%)" }}>
        <StepSection label="保険料シミュレーション" n={2} big className="mt-8">
          <Simulator m={m} setM={setM} y={y} setY={setY} initialSimOpen={initialSimOpen} planName={sel ? PLANS.find((p) => p.id === sel)?.name : null} plan={plan} startAge={ageFromBirth(birth)} />
        </StepSection>
        </div>
        </>)}

        {simFirst && (<>
        {/* ---- 積立金額・保障期間（プランより先） ---- */}
        <div style={{ marginTop: '80px' }}>
        <StepSection label="積立金額・保障期間を選ぶ" n={1} big>
          {birthGenderFields}
          <div className="sim-noborder">
            <p className="text-caption text-neutral-600 leading-relaxed mb-4">保障する積立金額と保障期間を選択してください。</p>
             <SimSliders m={m} setM={setM} y={y} setY={setY} />
          </div>
        </StepSection>
        </div>

        {/* ---- プラン選択 ---- */}
        <div className="-mx-5 px-5 py-6 relative" style={{ background: "#EAF9FE" }}>
        <StepSection label="プランを選ぶ" n={2} big className="mt-8">
          <div>
            <p className="text-caption text-neutral-500">ご希望の保障プランをご選択ください</p>
          </div>
          {PLANS.map((p, i) => (
            <PlanCard key={p.id} p={p} selected={sel === p.id} onSelect={() => setSel(p.id)} initialTtOpen={i === initialTipIdx} />
          ))}
          <p className="text-caption text-neutral-500 leading-relaxed px-1">※ 保険料は年齢・性別により変動します。</p>
        </StepSection>
        </div>

        {/* ---- 給付予想額 ---- */}
        <StepSection label="保険料テーブル" n={3} big className="mt-8">
          <div className="rounded-2xl border border-warm-200 bg-white p-5">
            <p className="text-caption text-neutral-600 leading-relaxed mb-4">選択した内容にもとづく給付予想額です。</p>
            <BenefitTable m={m} y={y} plan={plan} />
          </div>
        </StepSection>
        </>)}

        {/* ---- 申し込みをする（2ステップ） ---- */}
        <div className={`-mx-5 px-5 py-6 ${!simFirst ? '-mt-8' : ''}`} style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F2FBFE 100%)" }}>
        <StepSection label="申し込みをする" n={simFirst ? 4 : 3} big className="mt-8">
          {/* STEP 1 — メールアドレスのご入力 */}
          <div className="rounded-2xl border border-warm-200 bg-white p-5 space-y-3">
            <h3 className="text-h6 font-bold text-neutral-800">メールアドレスのご入力</h3>
            <p className="text-caption text-neutral-600 leading-relaxed">
              ご入力されたメールアドレス宛にPINコード送信とご案内URLをお送りします。メールアドレスをご入力ください。
            </p>
            <Field label="メールアドレス" placeholder="samplename@sample.co.jp" required />
          </div>

          {/* STEP 2 — 事前同意事項のご確認 */}
          <div ref={sendSecRef} className="rounded-2xl border border-warm-200 bg-white p-5 space-y-3">
            <h3 className="text-h6 font-bold text-neutral-800">事前同意事項のご確認</h3>
            <p className="text-caption text-neutral-600 leading-relaxed">お申し込み前に、下記より重要事項・事前同意事項を必ずご確認ください。</p>
            <button onClick={() => setNoticeOpen(true)}
              className="flex items-center justify-between w-full rounded-xl border-2 border-[color:var(--secondary-color-200)] bg-[color:var(--secondary-color-10)] px-4 py-4 text-left transition hover:border-[color:var(--secondary-color-300)]">
              <span className="flex items-center gap-2.5 min-w-0">
                <span className="rounded-full bg-[color:var(--secondary-color-600)] text-white px-2 py-0.5 text-[11px] font-bold leading-none shrink-0">重要</span>
                <span className="text-h6 font-bold text-neutral-800">重要事項・事前同意事項を確認する</span>
              </span>
              <Ic.chevR className="w-5 h-5 text-[color:var(--secondary-color-600)] shrink-0" />
            </button>
            <button onClick={() => setAgree((a) => !a)} className="flex items-start gap-3 w-full text-left pt-1">
              <span className={`grid place-items-center w-5 h-5 mt-0.5 rounded border-2 shrink-0 ${agree ? "border-primary bg-primary text-white" : "border-warm-300 bg-white"}`}>
                {agree && <Ic.check className="w-3 h-3" />}
              </span>
              <span className="text-caption text-neutral-700 leading-relaxed">上記の事前同意事項を確認し、同意します</span>
            </button>
          </div>
        </StepSection>
        </div>
        </div>
      </div>

      <ActionBar bg={showSend ? "#F2FBFE" : undefined}>
        <div className="flex items-start gap-2 px-1 text-caption text-neutral-600 leading-relaxed">
          <Ic.doc className="w-4 h-4 mt-0.5 text-neutral-400 shrink-0" />
          申込みは本人様名義のクレジットカードが必要です
        </div>
        {emailVerified && showSend && (
          <div className="fade-in flex items-center gap-2 rounded-xl bg-primary-10 border border-primary-100 px-3.5 py-2.5">
            <Ic.check className="w-4 h-4 text-primary-600 shrink-0" />
            <span className="text-caption text-primary-700">メールアドレスの認証は完了しています</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <button onClick={() => go(0)} className="text-caption font-medium shrink-0 px-1" style={{ color: 'var(--color-link)' }}>← 戻る</button>
          {showSend && (
            <div className="flex-1">
              <Btn kind="cta" onClick={() => emailVerified ? go(3) : go(2)} disabled={!agree}>
                {emailVerified ? <>申込フォームへ進む<Ic.chevR className="w-4 h-4" /></> : "上記に同意してメールを送信"}
              </Btn>
            </div>
          )}
        </div>
        {!agree && showSend && <p className="text-center text-caption text-neutral-400">同意いただくと送信できます</p>}
        {agree && (
          <div className="flex justify-end" style={{ marginTop: "24px", marginBottom: "16px" }}>
            <a className="inline-flex items-center gap-1.5 font-bold text-h6 cursor-pointer underline-offset-2 hover:underline" style={{ color: "var(--color-link)", fontSize: "14px" }}>
              <img src="/assets/theo-tdf/info-circle.svg" alt="" className="w-4 h-4" />
              よくあるご質問
            </a>
          </div>
        )}
      </ActionBar>

      {/* 生年月日ドラムロール（iOS風） */}
      <DateDrumSheet open={pickerOpen} value={birth}
        onClose={() => setPickerOpen(false)}
        onDone={(v) => { setBirth(v); setPickerOpen(false); }} />

      {/* 重要事項ボトムシート */}
      {noticeOpen && (
        <div className="absolute inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 fade-in" onClick={() => setNoticeOpen(false)} />
          <div className="sheet-up absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-xl max-h-[88%] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-warm-200">
              <h3 className="flex items-center gap-2 text-h5 font-bold text-neutral-800">
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

              <div className="space-y-5">
                <p className="flex items-center gap-2 text-h6 font-bold text-neutral-800">
                  <span className="rounded-full bg-primary-10 text-primary-700 px-2 py-0.5 text-[11px] font-bold leading-none">事前同意</span>
                  事前同意事項
                </p>
                <p className="text-caption text-neutral-500 leading-relaxed">お申し込み前にご確認ください。</p>
                <section className="space-y-1.5">
                  <h4 className="text-h6 font-bold text-neutral-800">この保険について</h4>
                  <ul className="space-y-1.5 text-caption text-neutral-600 leading-relaxed">
                    <li>・株式会社三菱ＵＦＪ銀行を団体契約者とし、Money Canvas会員の皆さま、会員のご家族を被保険者とする団体契約です。Money Canvas会員の資格を喪失された場合、保険契約は解約いただく、もしくは更新できませんので、ご注意ください。また、保険証券を請求する権利、保険契約を解約する権利等は原則として株式会社 三菱ＵＦＪ銀行が有します。</li>
                    <li>・この契約は、申込み日が17日までの場合は、翌月1日（0時）より補償が開始し、申込み日が18日から末日までの場合は、翌々月1日（0時）より補償が開始します。</li>
                    <li>・満期日までにご加入者から更新しない旨のお申出がなければ、団体の取り決めにより原則自動更新されます。</li>
                  </ul>
                </section>
                <section className="space-y-1.5">
                  <h4 className="text-h6 font-bold text-neutral-800">個人情報の取扱いについて</h4>
                  <ul className="space-y-1.5 text-caption text-neutral-600 leading-relaxed">
                    <li>・団体契約者である株式会社三菱ＵＦＪ銀行は、お客さまにご入力いただく個人情報を、以下の目的で利用させていただきます。</li>
                    <li>・お客さまに関する情報は、保険契約上必要な範囲で引受保険会社に提供し、契約の引受・維持管理、保険金等のお支払いの目的で利用させていただきます。</li>
                    <li>・法令に基づく場合を除き、ご本人の同意なく第三者へ提供することはありません。</li>
                  </ul>
                </section>
                {plan.death && (
                <section className="space-y-1.5">
                  <h4 className="text-h6 font-bold text-neutral-800">死亡保険金受取人について</h4>
                  <ul className="space-y-1.5 text-caption text-neutral-600 leading-relaxed">
                    <li>・本プランには死亡保障が含まれます。死亡保険金受取人は、日本国内に在住し、日本語による各種ご通知・お手続きへの対応が可能な方に限ります。</li>
                  </ul>
                </section>
                )}
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
   SCREEN — PINコード認証（メールのURLから遷移して入力）
   ============================================================ */
export function ScreenPin({ go, onVerified, backScr = 1, initialPin }: { go: Go; onVerified?: () => void; backScr?: number; initialPin?: string }) {
  const [pin, setPin] = useState(initialPin ?? "");
  return (
    <>
      <AppBar title="保険" onBack={() => go(backScr)} />
      <div className="flex-1 overflow-y-auto no-sb">
        <Steps n={3} go={go} />
        <div className="px-5 py-8 flex flex-col items-center text-center" style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #F2FBFE 100%)" }}>
          <img src="/assets/theo-tdf/logo_theo_insurance_blue.svg" alt="THEO つみたて安心ほけん" className="h-8 mb-6" />
          <div className="grid place-items-center w-16 h-16 rounded-full bg-primary-10 text-primary-600 mb-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
          </div>
          <h1 className="text-h3 font-bold text-neutral-800">PINコードの入力</h1>
          <p className="mt-3 text-h6 text-neutral-600 leading-relaxed">
            ご登録のメールアドレスに、認証用のPINコードをお送りしました。メールに記載の6桁のPINコードを入力してください。
          </p>

          <input
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
            inputMode="numeric"
            placeholder="______"
            className="fld mt-7 w-full max-w-[260px] h-14 rounded-xl border border-warm-300 bg-white text-center font-en font-semibold text-h1 tracking-[0.45em] text-neutral-800"
          />

          <button className="mt-4 text-caption underline underline-offset-2" style={{ color: 'var(--color-link)' }}>PINコードを再送する</button>
        </div>
      </div>
      <ActionBar>
        <p className="text-caption text-neutral-500 leading-relaxed px-1">
          本お手続きは「THEO つみたて安心ほけん」のお申し込みです。<br/>
          <span className="text-[10px] text-neutral-400">引受保険会社：T&Dフィナンシャル生命保険株式会社</span>
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => go(backScr)} className="text-caption font-medium shrink-0 px-1" style={{ color: 'var(--color-link)' }}>← 戻る</button>
          <div style={{ width: '100%', maxWidth: '260px' }}>
            <Btn kind="cta" onClick={() => { if(onVerified) onVerified(); go(3); }} disabled={pin.length < 6}>認証する</Btn>
          </div>
        </div>
        {pin.length < 6 && <p className="text-center text-caption text-neutral-400">6桁のPINコードを入力してください</p>}
      </ActionBar>
    </>
  );
}

/* ============================================================
   SCREEN 3 — 補償内容の確認
   ============================================================ */
export function Row({ k, v, strong }: { k: string; v: React.ReactNode; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-warm-200 last:border-0">
      <span className="text-caption text-neutral-500">{k}</span>
      <span className={`text-h6 ${strong ? "font-bold text-neutral-900" : "text-neutral-700"}`}>{v}</span>
    </div>
  );
}

// 補償項目の金額表示を「50,000 円」体裁（大きな数字＋円）に整形
export function FeatValue({ v }: { v: string }) {
  const m = (v || "").match(/^(.*?)¥([\d,]+)(.*)$/);
  if (!m) return <span className="text-h6 text-neutral-700">{v}</span>;
  const [, pre, num, post] = m;
  return (
    <span className="text-neutral-700 whitespace-nowrap">
      {pre && <span className="text-caption text-neutral-500">{pre}</span>}
      <span className="font-en text-h4 font-semibold text-primary-600 tabular-nums">{num}</span>
      <span className="text-caption"> 円{post}</span>
    </span>
  );
}

// Shared積立スライダー（Simulator と 申込フォームの修正シートで共用）
export function SimSliders({ m, setM, y, setY, onInput }: { m: number; setM: React.Dispatch<React.SetStateAction<number>>; y: number; setY: React.Dispatch<React.SetStateAction<number>>; onInput?: () => void }) {
  const yen = (v: number) => v.toLocaleString("ja-JP");
  const sliderStyle = { accentColor: "var(--primary-color-500)" };
  const onM = (e: React.ChangeEvent<HTMLInputElement>) => { setM(+e.target.value); onInput && onInput(); };
  const onY = (e: React.ChangeEvent<HTMLInputElement>) => { setY(+e.target.value); onInput && onInput(); };
  return (
    <>
      <div className="mb-5">
        <div className="flex items-start justify-between gap-2">
          <span className="text-h6 font-medium text-neutral-800 leading-snug">毎月の積立金額<br/><span className="text-caption text-neutral-500">（ご希望給付額）</span></span>
          <span className="text-neutral-800">
            <span className="font-en text-h4 font-semibold text-primary-600 tabular-nums">{yen(m)}</span>
            <span className="text-caption"> 円</span>
          </span>
        </div>
        <input type="range" min="5000" max="150000" step="1000" value={m} onChange={onM}
          style={sliderStyle} className="w-full mt-2 h-1.5 cursor-pointer" />
        <div className="flex justify-between font-mono text-[10px] text-neutral-400 mt-1">
          <span>5,000円</span><span>150,000円</span>
        </div>
      </div>

      <div className="mb-1">
        <div className="flex items-baseline justify-between">
          <span className="text-h6 font-medium text-neutral-800">保障期間</span>
          <span className="text-neutral-800">
            <span className="font-en text-h4 font-semibold text-primary-600 tabular-nums">{y}</span>
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

// 生年月日("YYYY-MM-DD")から加入年齢を算出。未入力時は30をデフォルト。
export function ageFromBirth(b: string) {
  if (!b) return 30;
  const d = new Date(b);
  if (isNaN(d.getTime())) return 30;
  const n = new Date();
  let a = n.getFullYear() - d.getFullYear();
  const md = n.getMonth() - d.getMonth();
  if (md < 0 || (md === 0 && n.getDate() < d.getDate())) a--;
  return a;
}

// シミュレーション上限チェック
export const SIM_MAX_BENEFIT = 40000000; // 4,000万円
export const SIM_MAX_MATURITY_AGE = 90;  // 加入年齢＋保障期間の上限
export function simErrors(m: number, y: number, startAge: number) {
  const errs: string[] = [];
  if (m * 12 * y > SIM_MAX_BENEFIT)
    errs.push("保障金額が上限を超えています。積立金額×12×保障期間が4,000万円以内となるよう設定ください");
  if (startAge + y > SIM_MAX_MATURITY_AGE)
    errs.push("保障満了が上限を超えています。加入年齢＋保障期間が90歳以下となるよう設定ください");
  return errs;
}

// 給付予想額テーブル（m, y から算出）
export function BenefitTable({ m, y, plan, startAge = 30 }: { m: number; y: number; plan: Plan | undefined; startAge?: number }) {
  const man = (v: number) => Math.round(v / 10000).toLocaleString("ja-JP");
  const yen = (v: number) => v.toLocaleString("ja-JP");
  const annual = m * 12;
  const maxBenefit = annual * y;
  const premiumPerMonth = plan && plan.price ? parseInt(plan.price.replace(/[^0-9]/g, ""), 10) : 0;
  const rows = [];
  for (let n = 0; n <= y; n++) {
    const age = startAge + n;
    const benefit = annual * (y - n);
    const cum = annual * n;
    rows.push({ n, age, premium: premiumPerMonth, benefit, cum });
  }
  return (
    <>
      <div className="flex items-center justify-between rounded-xl bg-primary-10 px-4 py-3">
        <span className="text-caption font-medium text-primary-700">最大給付金額　0年目</span>
        <span className="text-primary-600">
          <span className="font-en text-h2 font-semibold tabular-nums">{man(maxBenefit)}</span>
          <span className="text-h6"> 万円</span>
        </span>
      </div>
      <div className="mt-3 rounded-xl border border-warm-200 overflow-hidden">
        <div className="max-h-72 overflow-y-auto no-sb">
          <table className="w-full text-caption tabular-nums">
            <thead className="sticky top-0 bg-warm-100 text-neutral-500">
              <tr>
                {["経\n過", "年\n齢", "月払\n保険料", "給付\n金額", "合計\n積立"].map((h) => (
                  <th key={h} className="font-medium text-center px-2.5 py-1.5 whitespace-pre-line align-middle text-[12px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.n} className={`border-t border-warm-200 ${r.n === 0 ? "bg-primary-10/60 text-neutral-900" : "text-neutral-700"}`}>
                  <td className="px-2.5 py-2 whitespace-nowrap align-middle text-center">{r.n}年</td>
                  <td className="px-2.5 py-2 whitespace-nowrap align-middle text-center">{r.age}歳</td>
                  <td className="px-2.5 py-2 whitespace-nowrap align-middle text-right font-bold">{yen(r.premium)}円</td>
                  <td className="px-2.5 py-2 whitespace-nowrap align-middle text-right">{man(r.benefit)}万円</td>
                  <td className="px-2.5 py-2 whitespace-nowrap align-middle text-right">{man(r.cum)}万円</td>
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

export function Simulator({ m, setM, y, setY, initialSimOpen, infoSlot, planName, plan, startAge = 30 }: { m: number; setM: React.Dispatch<React.SetStateAction<number>>; y: number; setY: React.Dispatch<React.SetStateAction<number>>; initialSimOpen?: boolean; infoSlot?: React.ReactNode; planName?: string | null; plan: Plan | undefined; startAge?: number }) {
  const [open, setOpen] = useState(initialSimOpen ?? false);
  const shouldShowLabel = !!planName;
  const errors = simErrors(m, y, startAge);
  return (
    <div className="rounded-2xl border border-warm-200 bg-white p-5">
      <div className="flex items-center justify-start gap-3 mb-5">
        {shouldShowLabel && (
          <span className="flex flex-col items-center justify-center shrink-0 rounded-lg bg-[#EFEFEF] px-2.5 py-2 text-center leading-tight h-full">
            <span className="text-[9px] font-bold text-neutral-800">選択プラン</span>
            <span className="text-[11px] font-bold text-primary-600 mt-1">{planName}</span>
          </span>
        )}
        <p className="text-caption text-neutral-600 leading-relaxed">
          保障する積立金額や保障期間を選択して、毎月の保険料を確認してみましょう。
        </p>
      </div>

      {infoSlot}

      <SimSliders m={m} setM={setM} y={y} setY={setY} onInput={() => setOpen(true)} />

      {errors.length > 0 ? (
        <div className="mt-4 pt-4 border-t border-warm-200 space-y-2">
          {errors.map((e, i) => (
            <p key={i} className="text-caption font-bold leading-relaxed" style={{ color: 'var(--color-attention)' }}>{e}</p>
          ))}
        </div>
      ) : (<>
      <button onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full mt-4 pt-4 border-t border-warm-200 text-left">
        <span className="text-h6 font-bold text-neutral-800">保険料テーブルをみる</span>
        <span className={`grid place-items-center w-7 h-7 rounded-full bg-warm-100 text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`}>
          <Ic.chevR className="w-4 h-4 rotate-90" />
        </span>
      </button>

      <div style={{ maxHeight: open ? "1600px" : "0px", opacity: open ? 1 : 0, marginTop: open ? "16px" : "0px" }}
        className="overflow-hidden transition-all duration-300 ease-out">
        <BenefitTable m={m} y={y} plan={plan} startAge={startAge} />
      </div>
      </>)}
    </div>
  );
}

/* ============================================================
   SCREEN 4 — 申込フォーム
   ============================================================ */
export function ScreenForm({ go, sel, m, setM, y, setY, initialEditOpen, initialSheetRes, initialSame, backScr = 1, formSplit = false, initialFormPage = 1, initialDisclosureOpen }: { go: Go; sel: string; m: number; setM: React.Dispatch<React.SetStateAction<number>>; y: number; setY: React.Dispatch<React.SetStateAction<number>>; initialEditOpen?: boolean; initialSheetRes?: boolean; initialSame?: boolean; backScr?: number; formSplit?: boolean; initialFormPage?: number; initialDisclosureOpen?: boolean }) {
  const plan = PLANS.find((p) => p.id === sel) || PLANS[0];
  // ページ表示時に、選択プランの告知項目モーダルを強制表示
  const [infoPlan, setInfoPlan] = useState<Plan | null>(() => initialDisclosureOpen === false ? null : (plan ?? null));
  const [same, setSame] = useState(initialSame ?? true);
  const [editOpen, setEditOpen] = useState(initialEditOpen ?? false);
  const [sheetRes, setSheetRes] = useState(initialSheetRes ?? false);
  const yen = (v: number) => v.toLocaleString("ja-JP");
  const man = (v: number) => Math.round(v / 10000).toLocaleString("ja-JP");
  // 積立内容修正モーダル用バリデーション（シミュレーション画面と同ロジック）
  const formStartAge = ageFromBirth("1990-01-01"); // 契約者生年月日
  const editErrors = simErrors(m, y, formStartAge);

  // 契約者住所（受取人「契約者と同じ」でコピーされる値。初期値はTHEO口座から自動入力）
  const [holder, setHolder] = useState({ zip: "100-0001", pref: "東京都", town: "千代田区丸の内１丁目", addr: "1-1", bldg: "丸の内ビル 10F" });
  const setH = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setHolder((h: any) => ({ ...h, [k]: e.target.value }));

  // 保険金受取人 生年月日・性別
  const [benBirth, setBenBirth] = useState("");
  const [benGender, setBenGender] = useState("");
  const [benPickerOpen, setBenPickerOpen] = useState(false);

  // ページ下部到達で CTA ブロックを薄ブルーに
  const [atBottom, setAtBottom] = useState(false);
  const [formPage, setFormPage] = useState(initialFormPage ?? 1);
  const bindScroll = (el: any) => {
    if (!el || el.__bound) return;
    el.__bound = true;
    el.addEventListener("scroll", () => {
      setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 48);
    }, { passive: true });
  };

  const onBack = formSplit && formPage === 2 ? () => setFormPage(1) : () => go(backScr);

  return (
    <>
      <AppBar title={formSplit && formPage === 2 ? "お申込み (2/2)" : "お申込み"} onBack={onBack} />
      <Steps n={3} go={go} />
      <div key={formPage} ref={bindScroll} className="flex-1 overflow-y-auto no-sb px-5 py-5 space-y-6" style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #F2FBFE 100%)" }}>
        {(!formSplit || formPage === 1) && (<>
        <div>
          <h2 className="text-h3 font-bold text-neutral-900 leading-snug text-balance">認証が完了しました。</h2>
          <p className="mt-2 text-h6 text-neutral-600 leading-relaxed" style={{ textWrap: "pretty" }}>あと少しで、お申し込みは完了です。ご契約者さま・保険金受取人さまの情報をご入力ください。</p>
        </div>
        <h2 className="text-h4 font-bold text-neutral-800 pt-1">情報ご入力</h2>
        <div className="px-1 -mt-5 flex items-center gap-2 text-caption text-primary-700">
          <Ic.shield className="w-4 h-4 shrink-0" />THEO 口座情報の一部を自動入力しています。
        </div>

        {/* 契約者情報グループ */}
        <GroupCard title="契約者情報" sub="ご契約者ご本人さまの情報" iconSrc="/assets/theo-tdf/person-heart.svg" className="-mt-5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="姓" placeholder="山田" required />
            <Field label="名" placeholder="太郎" required />
            <Field label="セイ" placeholder="ヤマダ" required />
            <Field label="メイ" placeholder="タロウ" required />
          </div>
          <LockedField label="生年月日" value="1990 / 01 / 01" />
          <LockedField label="性別" value="男性" />

          <SubLabel>連絡先</SubLabel>
          <Field label="郵便番号" placeholder="100-0001" required hint="郵便番号から住所を自動入力します" value={holder.zip} onChange={setH("zip")} />
          <Select label="都道府県" required value={holder.pref} options={PREFS} hint="郵便番号で自動入力" onChange={setH("pref")} />
          <Field label="市区町村・町名" placeholder="千代田区丸の内１丁目" required hint="町名まで自動入力されます" value={holder.town} onChange={setH("town")} />
          <Field label="番地など" placeholder="1丁目1番地1号" required value={holder.addr} onChange={setH("addr")} />
          <Field label="建物名／部屋番号" placeholder="〇〇ビル 101号室" value={holder.bldg} onChange={setH("bldg")} />
          <Field label="電話番号" placeholder="090-0000-0000" required />
        </GroupCard>

        {/* 団体特定コード（パターンB：分割時は契約者情報の後） */}
        {formSplit && (
        <GroupCard title="団体特定コード" icon={Ic.tag}>
          <Field label="団体特定コード" placeholder="1234567891234567" hint="団体からご案内のコードを入力してください" />
        </GroupCard>
        )}

        </>)}
        {(!formSplit || formPage === 2) && (<>
        {formSplit && (
          <div>
            <h2 className="text-h3 font-bold text-neutral-900 leading-snug text-balance">保険金受取人情報</h2>
            <p className="mt-2 text-h6 text-neutral-600 leading-relaxed">保険金をお受け取りになる方の情報をご入力ください。</p>
          </div>
        )}

        {/* 保険金受取人グループ */}
        <GroupCard title="保険金受取人" sub="保険金をお受け取りになる方" iconSrc="/assets/theo-tdf/letter-heart-square.svg">
          <Field label="氏名" placeholder="山田 花子" />

          {/* 受取人 生年月日・性別 */}
          <div className="flex flex-col gap-1.5">
            <span className="text-caption font-medium text-neutral-600">生年月日<span style={{ color: 'var(--color-attention)' }} className="ml-0.5">*</span></span>
            <button type="button" onClick={() => setBenPickerOpen(true)}
              className={`fld flex items-center justify-between gap-2 h-11 rounded-lg border border-warm-300 bg-white px-3 text-h6 text-left ${benBirth ? "text-neutral-800" : "text-neutral-400"}`}>
              <span className="truncate">{benBirth ? fmtBirth(benBirth) : "選択してください"}</span>
              <img src="/assets/theo-tdf/calendar.svg" alt="" className="w-5 h-5 shrink-0" />
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-caption font-medium text-neutral-600">性別<span style={{ color: 'var(--color-attention)' }} className="ml-0.5">*</span></span>
            <div className="flex gap-2">
              {["男性", "女性"].map((g) => (
                <button key={g} onClick={() => setBenGender(g)}
                  className={`flex-1 h-11 rounded-lg border text-h6 transition-colors ${benGender === g ? "border-primary bg-primary-10 text-primary-700 font-bold" : "border-warm-300 bg-white text-neutral-600"}`}>{g}</button>
              ))}
            </div>
          </div>

          <button onClick={() => setSame((s) => !s)} className="flex items-center gap-2.5 w-full text-left pt-1">
            <span className={`grid place-items-center w-5 h-5 rounded border-2 shrink-0 ${same ? "border-primary bg-primary text-white" : "border-warm-300 bg-white"}`}>
              {same && <Ic.check className="w-3 h-3" />}
            </span>
            <span className="text-caption text-neutral-700">住所は契約者と同じ</span>
          </button>

          {!same && (
          <div className="space-y-3">
            <Field label="郵便番号" placeholder="100-0001" />
            <Select label="都道府県" value="都道府県を選択" options={PREFS} />
            <Field label="市区町村・町名" placeholder="千代田区丸の内１丁目" />
            <Field label="番地など" placeholder="1丁目1番地1号" />
            <Field label="建物名／部屋番号" placeholder="〇〇ビル 101号室" />
          </div>
          )}

          <Select label="続柄" required value="続柄を選択" options={["続柄を選択", "配偶者", "子", "父母", "兄弟姉妹", "孫", "祖父母"]} />
          <Field label="電話番号" placeholder="090-0000-0000" />
        </GroupCard>

        {/* 団体特定コード（パターンA：非分割時は保険金受取人の後） */}
        {!formSplit && (
        <GroupCard title="団体特定コード" icon={Ic.tag}>
          <Field label="団体特定コード" placeholder="1234567891234567" hint="団体からご案内のコードを入力してください" />
        </GroupCard>
        )}
        </>)}

      </div>

      <ActionBar bg={atBottom ? "#F2FBFE" : undefined}>
        <div className={`rounded-xl border px-3.5 py-2 transition-colors ${atBottom ? "border-primary-100 bg-white/70" : "border-warm-200 bg-white"}`}>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-neutral-400">保険内容</span>
            <button onClick={() => setEditOpen(true)} className="flex items-center gap-1 text-caption font-medium" style={{ color: 'var(--color-link)' }}>
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
        <div className="flex items-center justify-center gap-3">
          <button onClick={onBack} className="text-caption font-medium shrink-0 px-1" style={{ color: 'var(--color-link)' }}>← 戻る</button>
          <div style={{ width: '100%', maxWidth: '260px' }}>
            <Btn kind="button" onClick={formSplit && formPage === 1 ? () => setFormPage(2) : () => go(4)}>
              {formSplit && formPage === 1 ? <>保険金受取人情報へ<Ic.chevR className="w-4 h-4" /></> : <>入力内容を確認する<Ic.chevR className="w-4 h-4" /></>}
            </Btn>
          </div>
        </div>
      </ActionBar>

      {editOpen && (
        <div className="absolute inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 fade-in" onClick={() => setEditOpen(false)} />
          <div className="sheet-up absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-xl max-h-[88%] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <h3 className="text-h5 font-bold text-neutral-800">積立内容を修正</h3>
              <button onClick={() => setEditOpen(false)} className="grid place-items-center w-8 h-8 rounded-full bg-warm-100 text-neutral-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="px-5 overflow-y-auto no-sb pb-2">
              <SimSliders m={m} setM={setM} y={y} setY={setY} onInput={() => setSheetRes(true)} />

              {/* シミュレーション結果（エラー時はテーブル非表示・赤字エラー） */}
              {editErrors.length > 0 ? (
                <div className="mt-2 pt-4 border-t border-warm-200 space-y-2">
                  {editErrors.map((e, i) => (
                    <p key={i} className="text-caption font-bold leading-relaxed" style={{ color: 'var(--color-attention)' }}>{e}</p>
                  ))}
                </div>
              ) : (<>
              <button onClick={() => setSheetRes((o) => !o)}
                className="flex items-center justify-between w-full mt-2 pt-4 border-t border-warm-200 text-left">
                <span className="text-h6 font-bold text-neutral-800">保険料テーブルをみる</span>
                <span className={`grid place-items-center w-7 h-7 rounded-full bg-warm-100 text-neutral-500 transition-transform ${sheetRes ? "rotate-180" : ""}`}>
                  <Ic.chevR className="w-4 h-4 rotate-90" />
                </span>
              </button>
              <div style={{ maxHeight: sheetRes ? "1600px" : "0px", opacity: sheetRes ? 1 : 0, marginTop: sheetRes ? "16px" : "0px" }}
                className="overflow-hidden transition-all duration-300 ease-out">
                <BenefitTable m={m} y={y} plan={plan} startAge={formStartAge} />
              </div>
              </>)}
            </div>
            <div className="px-5 py-3 border-t border-warm-200">
              <Btn kind="button" onClick={() => setEditOpen(false)} disabled={editErrors.length > 0}>この内容で更新</Btn>
            </div>
          </div>
        </div>
      )}

      {/* 告知項目モーダル（ページ表示時に選択プランで強制表示） */}
      <DisclosureModal plan={infoPlan} confirm onClose={() => setInfoPlan(null)} onConfirm={() => setInfoPlan(null)} />

      {/* 受取人 生年月日ドラムロール */}
      <DateDrumSheet open={benPickerOpen} value={benBirth}
        onClose={() => setBenPickerOpen(false)}
        onDone={(v) => { setBenBirth(v); setBenPickerOpen(false); }} />
    </>
  );
}

/* ============================================================
   SCREEN 5 — 内容確認
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
    kind: "agree",
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
    kind: "agree",
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
    id: "insured",
    t: "被保険者の確認",
    blocks: [
      { p: "該当するいずれかにチェックを入れてください。" },
    ],
  },
  {
    t: "重要事項説明の確認",
    blocks: [
      { p: "以下の重要事項説明書をご確認ください。" },
      { download: "重要事項説明書" },
    ],
  },
  {
    t: "意向の確認",
    blocks: [
      { p: "シミュレーションをもとにT＆Dフィナンシャル生命が推定したお客さまのご意向は以下の通りです。" },
      { ul: [
        "がん保障型を選択した場合\n積立期間中のがんにそなえたい",
        "三大疾病保障型を選択した場合\n積立期間中のがん・急性心筋梗塞・脳卒中にそなえたい",
        "障害介護保障型を選択した場合\n積立期間中における障害・介護状態にそなえたい",
        "がん・障害介護保障型を選択した場合\n積立期間中のがん、および障害・介護状態にそなえたい",
        "三大疾病・障害介護保障型を選択した場合\n積立期間中のがん・急性心筋梗塞・脳卒中、および障害・介護状態にそなえたい",
      ] },
    ],
  },
  {
    t: "ほけん商品のお問い合わせについて",
    blocks: [
      { p: "本サービスはT＆Dフィナンシャル生命のほけん商品となります。詳細なほけん商品のお問い合わせについてはT＆Dフィナンシャル生命へお問い合わせください。" },
    ],
  },
];

export function AgreeBlocks({ blocks }: { blocks: AgreeBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.head) return <p key={i} className="text-h5 font-bold text-neutral-800 leading-snug pt-1">{b.head}</p>;
        if (b.strong) return <p key={i} className="text-caption font-bold text-neutral-800 leading-relaxed">{b.strong}</p>;
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
        if (b.link) return <a key={i} href={b.link} target="_blank" rel="noreferrer" className="block text-caption underline break-all leading-relaxed" style={{ color: 'var(--color-link)' }}>{b.link}</a>;
        if (b.download) return (
          <a key={i} href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1.5 text-caption font-medium underline underline-offset-2" style={{ color: 'var(--color-link)' }}>
            {b.download}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M12 3v12m0 0l-4-4m4 4l4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>
          </a>
        );
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

export function AgreeItem({ num, item, open, onToggle, checked, onCheck, children }: { num: string; item: AgreeItemData; open: boolean; onToggle: () => void; checked?: boolean; onCheck?: () => void; children?: React.ReactNode }) {
  return (
    <div className={`rounded-xl border bg-white overflow-hidden ${checked ? "border-primary-200" : "border-warm-200"}`}>
      <div className="flex items-center gap-2.5 px-3 py-3">
        {onCheck && (
          <button onClick={onCheck} aria-label="同意チェック"
            className={`grid place-items-center w-5 h-5 rounded border-2 shrink-0 ${checked ? "border-primary bg-primary text-white" : "border-warm-300 bg-white"}`}>
            {checked && <Ic.check className="w-3 h-3" />}
          </button>
        )}
        <button onClick={onToggle} className="flex-1 flex items-center justify-between gap-2 text-left">
          <span className="text-h6 font-bold text-neutral-800 leading-snug"><span className="text-primary-600 mr-1">{num}</span>{item.t}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            className={`w-4 h-4 text-primary shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>
      <div style={{ maxHeight: open ? "2600px" : "0px", opacity: open ? 1 : 0 }} className="overflow-hidden transition-all duration-300 ease-out">
        <div className="px-3 pt-3 pb-3.5 border-t border-warm-200 max-h-80 overflow-y-auto no-sb space-y-2.5">
          <AgreeBlocks blocks={item.blocks} />
          {children}
        </div>
      </div>
    </div>
  );
}

export function ScreenStep4({ go, sel, m, y, initialOpenIdx, initialChecks, initialAcctOpen, initialEditKiyaku, initialEditJuushin, initialNat }: { go: Go; sel: string; m: number; y: number; initialOpenIdx?: number; initialChecks?: boolean[]; initialAcctOpen?: boolean; initialEditKiyaku?: boolean; initialEditJuushin?: boolean; initialNat?: string }) {
  const plan = PLANS.find((p) => p.id === sel) || PLANS[0];
  const yen = (v: number) => (v || 0).toLocaleString("ja-JP");
  const [openIdx, setOpenIdx] = useState(initialOpenIdx ?? -1);
  const [payIdx, setPayIdx] = useState(initialAcctOpen ? 0 : -1);
  const [nat, setNat] = useState(initialNat ?? "jp");
  const [jpLang, setJpLang] = useState("");
  const [agreed, setAgreed] = useState(Array.isArray(initialChecks) ? initialChecks.every(Boolean) : false);
  const [editKiyaku, setEditKiyaku] = useState(initialEditKiyaku ?? false);
  const [editJuushin, setEditJuushin] = useState(initialEditJuushin ?? false);
  // 死亡保障がないプランでは「被保険者の確認」選択は不要
  const agreeItems = plan.death ? AGREE_ITEMS : AGREE_ITEMS.filter((it) => it.id !== "insured");
  const CIRC = "①②③④⑤⑥⑦⑧⑨";
  const confirmNums = agreeItems.map((it, i) => (it.kind === "agree" ? null : CIRC[i])).filter(Boolean).join("");
  const agreeNums = agreeItems.map((it, i) => (it.kind === "agree" ? CIRC[i] : null)).filter(Boolean).join("");
  return (
    <>
      <AppBar title="内容確認・お支払い" onBack={() => go(3)} />
      <Steps n={4} go={go} />
      <div className="flex-1 overflow-y-auto no-sb px-5 py-5 space-y-8" style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #F2FBFE 100%)" }}>
        <StepSection label="内容確認">
        <h2 className="text-h4 font-bold text-neutral-800">お申込み内容</h2>

        <div className="rounded-2xl border border-warm-200 bg-white p-5">
          <SectionLabel>積立内容</SectionLabel>
          <Row k="契約プラン" v={plan.name} strong />
          <Row k="毎月の積立金額（希望給付額）" v={`${yen(m)} 円`} strong />
          <Row k="保障期間" v={`${y} 年`} strong />
          <Row k="保険料（月額）" v={`${plan.price.replace("¥", "")} 円 / 月`} strong />
          <Row k="保険期間" v="1年（自動更新）" />
        </div>

        <div className={`rounded-2xl border bg-white p-5 transition-colors ${editKiyaku ? "border-primary-300" : "border-warm-200"}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-caption tracking-[0.14em] uppercase text-neutral-900">契約者情報</p>
            {!editKiyaku && (
              <button onClick={() => setEditKiyaku(true)} className="flex items-center gap-1 text-caption font-medium text-primary-600 hover:text-primary transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                編集
              </button>
            )}
            {editKiyaku && (
              <div className="flex items-center gap-2">
                <button onClick={() => setEditKiyaku(false)} className="text-caption text-neutral-500 hover:text-neutral-700">キャンセル</button>
                <button onClick={() => setEditKiyaku(false)} className="rounded-lg bg-primary px-3 py-1 text-caption text-white font-medium">保存</button>
              </div>
            )}
          </div>
          {editKiyaku ? (
            <div className="space-y-3 mt-1">
              <Field label="氏名" value="山田 太郎" />
              <Field label="フリガナ" value="ヤマダ タロウ" />
              <LockedField label="生年月日" value="1990 / 01 / 01" />
              <LockedField label="性別" value="男性" />
              <Field label="国籍" value="日本国籍" />
              <Field label="住所" value="〒100-0001 東京都千代田区丸の内１丁目 丸の内ビル 10F" />
              <Field label="電話番号" value="090-0000-0000" />
              <Field label="メールアドレス" value="samplename@sample.co.jp" />
            </div>
          ) : (
            <>
              <Row k="氏名" v="山田 太郎" />
              <Row k="フリガナ" v="ヤマダ タロウ" />
              <Row k="生年月日" v="1990 / 01 / 01" />
              <Row k="性別" v="男性" />
              <Row k="国籍" v="日本国籍" />
              <div className="flex flex-col gap-0.5 py-3 border-b border-warm-200">
                <span className="text-caption text-neutral-500">住所</span>
                <span className="text-h6 text-neutral-700 leading-relaxed">〒100-0001<br/>東京都千代田区丸の内１丁目 丸の内ビル 10F</span>
              </div>
              <Row k="電話番号" v="090-0000-0000" />
              <Row k="メールアドレス" v="samplename@sample.co.jp" />
            </>
          )}
        </div>

        <div className={`rounded-2xl border bg-white p-5 transition-colors ${editJuushin ? "border-primary-300" : "border-warm-200"}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-caption tracking-[0.14em] uppercase text-neutral-900">保険金受取人</p>
            {!editJuushin && (
              <button onClick={() => setEditJuushin(true)} className="flex items-center gap-1 text-caption font-medium text-primary-600 hover:text-primary transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                編集
              </button>
            )}
            {editJuushin && (
              <div className="flex items-center gap-2">
                <button onClick={() => setEditJuushin(false)} className="text-caption text-neutral-500 hover:text-neutral-700">キャンセル</button>
                <button onClick={() => setEditJuushin(false)} className="rounded-lg bg-primary px-3 py-1 text-caption text-white font-medium">保存</button>
              </div>
            )}
          </div>
          {editJuushin ? (
            <div className="space-y-3 mt-1">
              <Field label="氏名" value="山田 花子" />
              <Field label="生年月日" value="1992 / 05 / 15" />
              <Field label="性別" value="女性" />
              <Field label="続柄" value="配偶者" />
              <Field label="住所" value="契約者と同じ" />
              <Field label="電話番号" value="090-0000-0000" />
            </div>
          ) : (
            <>
              <Row k="氏名" v="山田 花子" />
              <Row k="生年月日" v="1992 / 05 / 15" />
              <Row k="性別" v="女性" />
              <Row k="続柄" v="配偶者" />
              <Row k="住所" v="契約者と同じ" />
              <Row k="電話番号" v="090-0000-0000" />
            </>
          )}
        </div>

        <div className="rounded-2xl border border-warm-200 bg-white p-5">
          <SectionLabel>団体特定コード</SectionLabel>
          <Row k="コード" v="1234567891234567" />
        </div>

        </StepSection>

        <StepSection label="お支払い">
          <h2 className="text-h4 font-bold text-neutral-800">保険料のお支払いについて</h2>
          <p className="text-caption text-neutral-600 leading-relaxed">クレジットカードによる保険料払込における各種注意点を確認のうえ、お手続きください。</p>

          <div>
            <h3 className="text-h6 font-bold text-neutral-800">クレジットカード払の重要事項の確認</h3>
            <p className="mt-1.5 text-caption text-neutral-600 leading-relaxed">「クレジットカードのお支払いについて」を確認いただいたうえで、カード番号や有効期限などを入力いただきます。</p>
          </div>

          {/* accordion ⑥ クレジットカードのお支払いについて */}
          <div className="rounded-2xl border border-warm-200 bg-white overflow-hidden">
            <button onClick={() => setPayIdx((o) => (o === 0 ? -1 : 0))} className="flex items-center justify-between w-full px-4 py-4 text-left">
              <h4 className="text-h6 font-bold text-neutral-800">クレジットカードのお支払いについて</h4>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 text-primary shrink-0 transition-transform duration-300 ${payIdx === 0 ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <div style={{ maxHeight: payIdx === 0 ? "2000px" : "0px", opacity: payIdx === 0 ? 1 : 0 }} className="overflow-hidden transition-all duration-300 ease-out">
              <div className="px-4 pb-4 border-t border-warm-200 pt-3 space-y-2.5">
                <ul className="space-y-2.5">
                  <li className="flex gap-1.5 text-caption text-neutral-600 leading-relaxed"><span className="text-neutral-400 shrink-0">・</span><span>カード名義人は被保険者さま本人名義に限ります。</span></li>
                  <li className="text-caption text-neutral-600 leading-relaxed">
                    <span className="flex gap-1.5"><span className="text-neutral-400 shrink-0">・</span><span>以下のマークのあるクレジットカードをご指定いただけます。</span></span>
                    <div className="flex flex-wrap gap-1.5 mt-2 ml-3.5">
                      {["VISA", "Mastercard", "JCB", "AMEX", "Diners"].map((c) => (
                        <span key={c} className="rounded border border-warm-300 bg-white px-2 py-1 text-[10px] font-en font-semibold tracking-wide text-neutral-600">{c}</span>
                      ))}
                    </div>
                  </li>
                  {[
                    "今後の保険料のお支払は、ご指定いただきましたクレジットカードの発行会社が定める会員規約に基づいて行われます。",
                    "クレジットカード支払につきましては、クレジットカード支払規定に基づいて行いますので、お申し込みの前に必ずご一読ください。",
                    "クレジットカード支払のお取扱い金額は、1契約1回あたり、10万円以下となっております。",
                    "クレジットカードの発行会社が保険料相当額をT&Dフィナンシャル生命に入金させ、ご加入者さまの利用口座から保険料相当額のお振り替えをおこなう仕組みになっております。したがって、ご契約の消滅（解約・死亡等）または、T&Dフィナンシャル生命にお払込みが完了された場合でも、翌月以降に保険料相当額の決済（クレジットカードの発行会社によるお振り替え）が発生することがあります。",
                    "保険料相当額の決済日はクレジットカードの発行会社によって異なります。決済日は、直接クレジットカードの発行会社にお問い合わせください。",
                    "ご利用のクレジットカード番号・カード有効期限等が変更された場合、すみやかに保険のマイページより変更ください。（ご指定いただきましたクレジットカードの発行会社によっては、クレジットカードによる保険料のお支払いができなくなる場合があります。）",
                  ].map((t, i) => (
                    <li key={i} className="flex gap-1.5 text-caption text-neutral-600 leading-relaxed"><span className="text-neutral-400 shrink-0">・</span><span>{t}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* accordion ⑦ クレジットカード支払規定 */}
          <div className="rounded-2xl border border-warm-200 bg-white overflow-hidden">
            <button onClick={() => setPayIdx((o) => (o === 1 ? -1 : 1))} className="flex items-center justify-between w-full px-4 py-4 text-left">
              <h4 className="text-h6 font-bold text-neutral-800">クレジットカード支払規定</h4>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 text-primary shrink-0 transition-transform duration-300 ${payIdx === 1 ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <div style={{ maxHeight: payIdx === 1 ? "2000px" : "0px", opacity: payIdx === 1 ? 1 : 0 }} className="overflow-hidden transition-all duration-300 ease-out">
              <div className="px-4 pb-4 border-t border-warm-200 pt-3">
                <ul className="space-y-2.5">
                  {[
                    "私がT&Dフィナンシャル生命保険株式会社（以下「T&Dフィナンシャル生命」といいます。）と締結した生命保険契約の保険料は、私が指定する私名義のクレジットカード（以下「指定カード」といいます。）で指定カード発行会社の会員規約に基づいて支払います。",
                    "私がT&Dフィナンシャル生命に対し申し出をしない限り、保険料を前項と同様に指定カード発行会社の会員規約に基づいて、継続して支払います。",
                    "私は指定カード発行会社により、私が届け出た会員番号・有効期限が更新された場合であっても、保険料を異議なく支払います。",
                    "会員資格喪失等により、指定カード発行会社から指定カードによる保険料の支払いを停止されても異議はありません。",
                    "指定カードの会員番号や有効期限が変更となった場合、私に事前に通知することなく、新しい会員番号や有効期限が指定カード発行会社よりT&Dフィナンシャル生命に通知されても、異議はありません。",
                    "私は指定カードの会員番号や有効期限が変更となった場合、すみやかにT&Dフィナンシャル生命に通知します。",
                    "指定カードで支払った保険料については領収証は請求いたしません。",
                  ].map((t, i) => (
                    <li key={i} className="flex gap-1.5 text-caption text-neutral-600 leading-relaxed"><span className="text-neutral-400 shrink-0">・</span><span>{t}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </StepSection>

        <div className="rounded-2xl border border-[color:var(--secondary-color-100)] bg-[color:var(--secondary-color-10)] p-4">
          <div className="flex items-center gap-2 mb-3"><Badge>重要</Badge><span className="text-h5 font-bold text-neutral-800">重要事項をご確認ください</span></div>
          <div className="space-y-2.5">
            {agreeItems.map((it, i) => (
              <AgreeItem key={it.id || i} num={CIRC[i]} item={it} open={openIdx === i}
                onToggle={() => setOpenIdx((o) => (o === i ? -1 : i))}>
                {it.id === "insured" && (
                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-2 gap-3">
                      {[["jp", "日本国籍"], ["other", "日本国籍以外"]].map(([k, l]) => (
                        <button key={k} onClick={() => setNat(k)}
                          className={`h-11 rounded-lg border text-h6 transition-colors ${nat === k ? "border-primary bg-primary-10 text-primary-700 font-medium" : "border-warm-300 bg-white text-neutral-700 hover:border-primary-300"}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                    {nat === "other" && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-caption font-medium text-neutral-600">日本国内に移住し、将来日本に永住する意思が確実であり、日本語の読み書きができる <span className="text-[color:var(--secondary-color-700)]">*</span></span>
                        <div className="grid grid-cols-2 gap-3">
                          {[["yes", "できる"], ["no", "できない"]].map(([k, l]) => (
                            <button key={k} onClick={() => setJpLang(k)}
                              className={`h-11 rounded-lg border text-h6 transition-colors ${jpLang === k ? "border-primary bg-primary-10 text-primary-700 font-medium" : "border-warm-300 bg-white text-neutral-700 hover:border-primary-300"}`}>
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </AgreeItem>
            ))}
          </div>

          {/* 単一の確認・同意チェック（重要事項エリア内下部） */}
          <button onClick={() => setAgreed((a) => !a)} className="flex items-start gap-3 w-full text-left rounded-xl bg-[color:var(--secondary-color-10)] p-4 mt-3 transition-colors">
            <span className={`grid place-items-center w-5 h-5 mt-0.5 rounded border-2 shrink-0 ${agreed ? "border-primary bg-primary text-white" : "border-warm-300 bg-white"}`}>
              {agreed && <Ic.check className="w-3 h-3" />}
            </span>
            <span className="text-h6 text-neutral-700 leading-relaxed">{confirmNums}について確認、{agreeNums}について同意する</span>
          </button>
        </div>
      </div>
      <ActionBar bg="#F2FBFE">
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => go(3)} className="text-caption font-medium shrink-0 px-1" style={{ color: 'var(--color-link)' }}>← 戻る</button>
          <div style={{ width: '100%', maxWidth: '260px' }}>
            <Btn kind="danger" onClick={() => go(5)} disabled={!agreed}>クレジットカード登録開始<Ic.chevR className="w-4 h-4" /></Btn>
          </div>
        </div>
        {!agreed && <p className="text-center text-caption text-neutral-400">上記に確認・同意すると進めます</p>}
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
        <h2 className="text-h5 font-bold text-neutral-800">クレジットカード設定（外部リンク）</h2>
        <div className="rounded-xl bg-white border border-neutral-200 p-4 space-y-4">
          <p className="flex items-center gap-2 text-h6 font-bold text-neutral-800">
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
        <Btn kind="button" onClick={() => go(6)}>確認画面へ進む<Ic.chevR className="w-4 h-4" /></Btn>
        <button onClick={() => go(4)} className="w-full text-center text-caption text-neutral-500">キャンセルして戻る</button>
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
        <h2 className="text-h5 font-bold text-neutral-800">お申込み内容の確認（外部リンク）</h2>
        <div className="rounded-xl bg-white border border-neutral-200 p-4 space-y-4">
          <p className="flex items-center gap-2 text-h6 font-bold text-neutral-800">
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
        <Btn kind="button" onClick={() => go(7)}>この内容で申込</Btn>
        <button onClick={() => go(5)} className="w-full text-center text-caption text-neutral-500">入力内容を修正する</button>
      </div>
    </>
  );
}

/* ============================================================
   SCREEN 6 — 完了
   ============================================================ */
export function ScreenDone({ go }: { go: Go }) {
  const doneBgRef = useRef<any>(null);
  const bindDoneScroll = (el: any) => {
    if (!el || el.__bound) return;
    el.__bound = true;
    el.addEventListener("scroll", () => {
      if (doneBgRef.current) {
        doneBgRef.current.style.transform = `translateY(${-el.scrollTop * 0.3}px)`;
      }
    }, { passive: true });
  };
  return (
    <>
      {/* 固定ステータスバー（パララックスと一緒に動かない） */}
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 pt-2.5 pb-1 text-caption font-en font-medium text-neutral-700 pointer-events-none">
        <span>9:41</span><span className="flex items-center gap-1"><span>5G</span><span>100%</span></span>
      </div>
      <div ref={bindDoneScroll} className="flex-1 overflow-y-auto no-sb">
        {/* ヒーロー（img＋絶対配置・パララックス） */}
        <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
          <img ref={doneBgRef} src="/assets/theo-tdf/hero_bg_done.png" alt="" style={{ width: '100%', display: 'block', willChange: 'transform', transformOrigin: 'top center' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          {/* フェイクステータスバー（プレースホルダー） */}
          <div className="flex items-center justify-between px-6 pt-2.5 pb-1 text-caption font-en font-medium text-transparent" aria-hidden="true">
            <span>9:41</span>
            <span className="flex items-center gap-1"><span>5G</span><span>100%</span></span>
          </div>
          {/* ヒーローコンテンツ */}
          <div className="px-5 pt-4 pb-12 text-center">
            <img src="/assets/theo-tdf/logo_theo_insurance_blue.svg" alt="THEO つみたて安心ほけん" className="h-8 mx-auto mb-8" />
            <div className="mx-auto grid place-items-center w-16 h-16 rounded-full bg-white mb-5 shadow-sm">
              <Ic.check className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-h3 font-bold text-neutral-800">お申込が完了しました</h2>
            <p className="mt-2 text-caption text-neutral-500">受付番号　THEO-2026-000482</p>
          </div>
          </div>
        </div>

        {/* progress — sticks to top once the blue hero scrolls out of view */}
        <div className="sticky top-0 z-30">
          <Steps n={5} go={go} />
        </div>

        <div className="px-5 py-6 space-y-5" style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #F2FBFE 100%)" }}>
          <div className="px-1">
            <p className="text-h6 font-bold text-neutral-800 leading-relaxed">THEO つみたて安心ほけんのお申込が完了しました。</p>
            <p className="mt-2 text-caption text-neutral-600 leading-relaxed">
              受付確認メールをご確認ください。<br/>
              査定結果は●日以内に再度ご登録のメールアドレス宛に連絡いたします。
            </p>
          </div>

          <div className="rounded-2xl border border-warm-200 bg-white p-5">
            <SectionLabel>このあとの流れ</SectionLabel>
            <div className="mt-1">
            {[
              ["1", "受付確認メール送信確認", "ご登録のメールアドレスをご確認ください。"],
              ["2", "査定・引受の確定", "通常1〜3営業日でマイページに反映されます。"],
              ["3", "初回保険料の引落し・保険開始", "翌月以降、THEO のご登録口座より。"],
            ].map(([n, t, d], idx, arr) => (
              <div key={n}>
                <div className="grid grid-cols-[1.75rem_1fr] gap-x-3">
                  <span className="grid place-items-center w-7 h-7 rounded-full bg-primary-10 text-primary-600 font-en font-semibold text-caption shrink-0">{n}</span>
                  <div className="pb-1">
                    <p className="text-h6 font-bold text-neutral-800">{t}</p>
                    <p className="text-caption text-neutral-500 leading-relaxed">{d}</p>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="flex justify-center items-center py-1.5 text-primary-300" style={{ marginTop: "-20px" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
            </div>
          </div>
          <div className="rounded-xl bg-warm-100 p-4 text-caption text-neutral-500 leading-relaxed">
            保険証券（電子）はマイページからいつでもご確認・ダウンロードいただけます。
          </div>
        </div>
      </div>
      <ActionBar bg="#F2FBFE">
        <Btn kind="button" onClick={() => go(0)}>マイページに戻る</Btn>
      </ActionBar>
    </>
  );
}

// Export everything app.jsx depends on. Ic in particular MUST be on window —
// app.jsx references it, and relying on cross-<script> const sharing is fragile
// (a single missing binding throws and blanks the entire UI).

export function ScreenCombined({ go, sel, setSel, m, setM, y, setY, emailVerified, simFirst, initialAgree, initialShowSend, initialTipIdx }: { go: Go; sel: string; setSel: React.Dispatch<React.SetStateAction<string>>; m: number; setM: React.Dispatch<React.SetStateAction<number>>; y: number; setY: React.Dispatch<React.SetStateAction<number>>; emailVerified?: boolean; simFirst?: boolean; initialAgree?: boolean; initialShowSend?: boolean; initialTipIdx?: number }) {
  const plan = PLANS.find((p) => p.id === sel) || PLANS[0];
  const [agree, setAgree] = useState(initialAgree ?? false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const sendSecRef = useRef<any>(null);
  const [showSend, setShowSend] = useState(initialShowSend ?? false);
  const heroBgRef = useRef<any>(null);
  const [solid, setSolid] = useState(false);
  const bindScroll = (el: any) => {
    if (!el || el.__bound) return;
    el.__bound = true;
    el.addEventListener("scroll", () => {
      const scrollY = el.scrollTop;
      if (heroBgRef.current) heroBgRef.current.style.transform = "translateY(" + (scrollY * 0.4) + "px)";
      setSolid(scrollY > 160);
      const sec = sendSecRef.current;
      if (sec) { const secTop = sec.getBoundingClientRect().top; const contBottom = el.getBoundingClientRect().bottom; setShowSend(secTop < contBottom - 64); }
    }, { passive: true });
  };
  const birthGenderFields = (
          <div className="space-y-4">
            <div>
              <h3 className="text-h6 font-medium text-neutral-800 leading-snug">生年月日・性別</h3>
              <p className="text-caption text-neutral-500 mt-1">お客様情報。保険料の算出に使用します。</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-caption font-medium text-neutral-600">生年月日<span style={{ color: 'var(--color-attention)' }} className="ml-0.5">*</span></span>
              <button type="button" onClick={() => setPickerOpen(true)}
                className={"fld flex items-center justify-between gap-2 h-11 rounded-lg border border-warm-300 bg-white px-3 text-h6 text-left " + (birth ? "text-neutral-800" : "text-neutral-400")}>
                <span className="truncate">{birth ? fmtBirth(birth) : "選択してください"}</span>
                <img src="/assets/theo-tdf/calendar.svg" alt="" className="w-5 h-5 shrink-0" />
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-caption font-medium text-neutral-600">性別<span style={{ color: 'var(--color-attention)' }} className="ml-0.5">*</span></span>
              <div className="flex gap-2">
                {["男性", "女性"].map((g) => (
                  <button key={g} onClick={() => setGender(g)}
                    className={"flex-1 h-11 rounded-lg border text-h6 transition-colors " + (gender === g ? "border-primary bg-primary-10 text-primary-700 font-bold" : "border-warm-300 bg-white text-neutral-600")}>{g}</button>
                ))}
              </div>
            </div>
          </div>
  );
  return (
    <>
      {/* \u56fa\u5b9a\u30b9\u30c6\u30fc\u30bf\u30b9\u30d0\u30fc\uff08\u30d1\u30e9\u30e9\u30c3\u30af\u30b9\u3068\u4e00\u7dd2\u306b\u52d5\u304b\u306a\u3044\uff09 */}
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 pt-2.5 pb-1 text-caption font-en font-medium text-neutral-800 pointer-events-none">
        <span>9:41</span><span className="flex items-center gap-1"><span>5G</span><span>100%</span></span>
      </div>
      <div ref={bindScroll} className="flex-1 overflow-y-auto no-sb">
        {/* Hero */}
        <div style={{ position: 'relative', height: '420px', overflow: 'hidden', boxShadow: '0 60px 60px 0 rgba(100,176,247,0.10)' }}>
          <img ref={heroBgRef} src="/assets/theo-tdf/hero_bg.png" alt="" style={{ width: '100%', display: 'block', willChange: 'transform', transformOrigin: 'top center' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
            <div className="flex items-center justify-between px-6 pt-2.5 pb-1 text-caption font-en font-medium text-transparent" aria-hidden="true">
              <span>9:41</span><span className="flex items-center gap-1"><span>5G</span><span>100%</span></span>
            </div>
            <div className="sticky top-0 z-20 transition-colors duration-200" style={solid ? HEADER_GRAD_APPBAR : { background: 'transparent' }}>
              <div className="flex items-center justify-between px-3 h-14">
                <span className="w-9 shrink-0" />
                <div className={"flex items-center gap-1.5 min-w-0 transition-opacity duration-200 " + (solid ? "opacity-100" : "opacity-0")}>
                  <span className="font-en font-semibold tracking-[0.1em] text-h6 text-white">THEO</span>
                  <span className="text-h6 font-medium truncate text-white">つみたて安心ほけん</span>
                </div>
                <span className="w-9 shrink-0" />
              </div>
            </div>
            <img src="/assets/theo-tdf/logo_theo_insurance_blue.svg" alt="THEO つみたて安心ほけん" style={{ position: 'absolute', top: '48px', left: '15px', height: '1.9rem' }} />
            <div style={{ position: 'absolute', top: '175px', left: '20px', right: '20px' }}>
              <p className="font-en text-caption tracking-[0.18em] uppercase text-neutral-500" style={{ marginLeft: '4px' }}>Embedded Insurance</p>
              <h1 className="mt-1 font-bold leading-snug text-neutral-800" style={{ fontSize: '31px', lineHeight: 1.3, marginLeft: '-2px' }}>つみたてながら、<br/>もしもに備える。</h1>
              <p className="mt-2 text-h6 leading-relaxed text-neutral-700">将来に向けた<br/>資産形成のためのほけん</p>
            </div>
          </div>
        </div>
        {/* 商品概要コンパクト */}
        <div className="px-5 pt-4 pb-3 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-bold text-white px-2.5 py-1 rounded-full" style={{ backgroundColor: '#065fe3' }}>THEOのお客様限定</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[9px] text-neutral-400 whitespace-nowrap">引受保険会社</span>
              <img src="/assets/theo-tdf/logo_td.png" alt="T&Dフィナンシャル生命" className="h-4" />
            </div>
          </div>
          <div style={{ paddingTop: '32px', paddingBottom: '24px' }}>
          <div className="grid grid-cols-3 gap-2">
            {[
              { src: "/assets/theo-tdf/activity-heart-circle.svg", t: "積立も\nあんしんに" },
              { src: "/assets/theo-tdf/graduation-cap.svg", t: "学資保険\nの代わりにも" },
              { src: "/assets/theo-tdf/hand-holding-heart.svg", t: "もしもの\n備えに" },
            ].map((f, k) => (
              <div key={k} className="flex flex-col items-center text-center gap-1">
                <img src={f.src} alt="" style={{ width: '32px', height: '32px' }} />
                <p className="text-[11px] font-bold text-neutral-700 leading-snug whitespace-pre-line">{f.t}</p>
              </div>
            ))}
          </div>
          {/* 図版 + 商品概要 */}
          <div className="mt-2 overflow-hidden">
            <img src="/assets/theo-tdf/chart_savings.png" alt="就業不能時も将来の積立金額を保障イメージ図" className="w-full block" />
          </div>
          <div className="space-y-4 mt-4">
            <div className="text-right">
              <a className="inline-flex items-center gap-1.5 font-bold text-h6 cursor-pointer underline-offset-2 hover:underline" style={{ color: "var(--color-link)", fontSize: "14px" }}>
                <img src="/assets/theo-tdf/info-circle.svg" alt="" className="w-4 h-4" />
                詳細なサービス内容はこちら
              </a>
            </div>
            <div className="text-left">
              <span className="inline-block text-h5 font-bold text-neutral-800 py-0.5 rounded">保険名称</span>
              <p className="mt-2 text-h6 text-neutral-700">無配当特定疾病障害介護保障保険（団体型）</p>
            </div>
            <div className="text-left">
              <span className="inline-block text-h5 font-bold text-neutral-800 py-0.5 rounded">保障期間</span>
              <p className="mt-2 text-h6 text-neutral-700">5年～40年（最大）</p>
              <p className="mt-1 text-caption text-neutral-500 leading-relaxed mb-6">*保険期間は契約日（更新日）から１年であり、保障期間満了まで１年ごとの更新となります。</p>
            </div>
          </div>
            <div className="flex flex-wrap items-center gap-4 py-3 px-4 rounded-xl bg-primary-10">
              <div>
              <p className="text-caption text-neutral-500">保険料</p>
              <p><span className="font-en text-h2 font-bold" style={{ color: '#065fe3' }}>480</span><span className="text-h6 font-bold text-neutral-800"> 円 / 月〜</span></p>
            </div>
            <span className="inline-flex items-center gap-1 text-caption font-bold" style={{ color: '#054EBA' }}><Ic.check className="w-3.5 h-3.5" />いつでも見直し・解約OK</span>
          </div>
        </div>
        </div>{/* /px-5 pt-4 pb-3 */}
        {/* 橋渡しバナー */}
        <div style={{ height: '60px' }} />
        <div className="px-5 py-4" style={{ backgroundImage: "linear-gradient(135deg, #075FE3 0%, #64B0F7 100%)" }}>
          <h2 className="text-h4 font-bold text-white text-center">さっそく、<br/>プランを選んでみましょう</h2>
          <p className="mt-1 text-caption text-white text-center" style={{ opacity: 0.8 }}>かんたん入力で保険料がすぐわかります</p>
        </div>
        <div className="px-5 pt-6 pb-0 space-y-8" style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #F2FBFE 100%)" }}>
          {/* 生年月日・性別 */}
          {!simFirst && birthGenderFields}
          {!simFirst && (<>
          {/* プランを選ぶ */}
          <div style={{ marginTop: '48px' }}>
          <StepSection label="プランを選ぶ" n={1} big>
            <p className="text-caption text-neutral-500">ご希望の保障プランをご選択ください</p>
            {PLANS.map((p, i) => (
              <PlanCard key={p.id} p={p} selected={sel === p.id} onSelect={() => setSel(p.id)} initialTtOpen={i === initialTipIdx} />
            ))}
          </StepSection>
          </div>
          {/* 保険料シミュレーション */}
          <div className="-mx-5 px-5 pt-6 pb-14 relative" style={{ background: "#EAF9FE" }}>
            <StepSection label="保険料シミュレーション" n={2} big className="mt-8">
              <Simulator m={m} setM={setM} y={y} setY={setY} planName={sel ? PLANS.find((p) => p.id === sel)?.name : null} plan={plan} startAge={ageFromBirth(birth)} />
            </StepSection>
          </div>
          </>)}
          {simFirst && (<>
          {/* 積立金額・保障期間を選ぶ（生年月日・性別を含む） */}
          <div style={{ marginTop: '48px' }}>
          <StepSection label="積立金額・保障期間を選ぶ" n={1} big>
            {birthGenderFields}
            <div className="sim-noborder">
              <p className="text-caption text-neutral-600 leading-relaxed mb-4">保障する積立金額と保障期間を選択してください。</p>
               <SimSliders m={m} setM={setM} y={y} setY={setY} />
            </div>
          </StepSection>
          </div>
          {/* プランを選ぶ */}
          <div className="-mx-5 px-5 py-6 relative" style={{ background: "#EAF9FE" }}>
            <StepSection label="プランを選ぶ" n={2} big className="mt-8">
              <p className="text-caption text-neutral-500">ご希望の保障プランをご選択ください</p>
              {PLANS.map((p, i) => (
                <PlanCard key={p.id} p={p} selected={sel === p.id} onSelect={() => setSel(p.id)} initialTtOpen={i === initialTipIdx} />
              ))}
            </StepSection>
          </div>
          {/* 給付予想額 */}
          <StepSection label="保険料テーブル" n={3} big className="mt-8">
            <div className="rounded-2xl border border-warm-200 bg-white p-5">
              <p className="text-caption text-neutral-600 leading-relaxed mb-4">選択した内容にもとづく給付予想額です。</p>
              <BenefitTable m={m} y={y} plan={plan} />
            </div>
          </StepSection>
          </>)}
          {/* 申し込みをする */}
          <div className={`-mx-5 px-5 py-6 ${!simFirst ? '-mt-8' : ''}`} style={{ background: "#e7edf7" }}>
            <StepSection label="申し込みをする" n={simFirst ? 4 : 3} big className="mt-8">
              {/* 必要書類のご確認 */}
              <div className="rounded-2xl border border-warm-200 bg-white p-5 space-y-3">
                <h3 className="text-h6 font-bold text-neutral-800">必要書類のご確認</h3>
                <p className="text-caption text-neutral-600 leading-relaxed">お手続きの際に必要となる書類をご準備ください。</p>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-warm-50 border border-warm-200">
                  <Ic.cardArt className="w-10 h-auto text-primary-500 shrink-0" />
                  <span className="text-caption font-medium text-neutral-700">申込みは本人様名義のクレジットカードが必要です</span>
                </div>
              </div>
              {/* メールアドレスのご入力 */}
              <div className="rounded-2xl border border-warm-200 bg-white p-5 space-y-3">
                <h3 className="text-h6 font-bold text-neutral-800">メールアドレスのご入力</h3>
                <p className="text-caption text-neutral-600 leading-relaxed">ご入力されたメールアドレス宛にPINコード送信とご案内URLをお送りします。</p>
                <Field label="メールアドレス" placeholder="samplename@sample.co.jp" required />
              </div>
              <div ref={sendSecRef} className="rounded-2xl border border-warm-200 bg-white p-5 space-y-3">
                <h3 className="text-h6 font-bold text-neutral-800">事前同意事項のご確認</h3>
                <p className="text-caption text-neutral-600 leading-relaxed">お申し込み前に、下記より重要事項・事前同意事項を必ずご確認ください。</p>
                <button onClick={() => setNoticeOpen(true)}
                  className="flex items-center justify-between w-full rounded-xl border-2 border-[color:var(--secondary-color-200)] bg-[color:var(--secondary-color-10)] px-4 py-4 text-left">
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className="rounded-full bg-[color:var(--secondary-color-600)] text-white px-2 py-0.5 text-[11px] font-bold leading-none shrink-0">重要</span>
                    <span className="text-h6 font-bold text-neutral-800">重要事項・事前同意事項を確認する</span>
                  </span>
                  <Ic.chevR className="w-5 h-5 text-[color:var(--secondary-color-600)] shrink-0" />
                </button>
                <button onClick={() => setAgree((a) => !a)} className="flex items-start gap-3 w-full text-left pt-1">
                  <span className={"grid place-items-center w-5 h-5 mt-0.5 rounded border-2 shrink-0 " + (agree ? "border-primary bg-primary text-white" : "border-warm-300 bg-white")}>
                    {agree && <Ic.check className="w-3 h-3" />}
                  </span>
                  <span className="text-caption text-neutral-700 leading-relaxed">上記の事前同意事項を確認し、同意します</span>
                </button>
              </div>
            </StepSection>
          </div>
        </div>
      </div>
      <ActionBar bg={showSend ? "#e7edf7" : undefined}>
        {showSend && (
          <div className="fade-in space-y-2">
            {emailVerified ? (
              <>
                <div className="flex items-center gap-2 rounded-xl bg-primary-10 border border-primary-100 px-3.5 py-2.5">
                  <Ic.check className="w-4 h-4 text-primary-600 shrink-0" />
                  <span className="text-caption text-primary-700">メールアドレスの認証は完了しています</span>
                </div>
                <Btn kind="cta" onClick={() => go(3)} disabled={!agree}>申込フォームへ進む<Ic.chevR className="w-4 h-4" /></Btn>
              </>
            ) : (
              <Btn kind="cta" onClick={() => go(2)} disabled={!agree}>上記に同意してメールを送信</Btn>
            )}
            {!agree && <p className="text-center text-caption text-neutral-400">同意いただくと送信できます</p>}
            {agree && (
              <div className="flex justify-end" style={{ marginTop: "24px", marginBottom: "16px" }}>
                <a className="inline-flex items-center gap-1.5 font-bold text-h6 cursor-pointer underline-offset-2 hover:underline" style={{ color: "var(--color-link)", fontSize: "14px" }}>
                  <img src="/assets/theo-tdf/info-circle.svg" alt="" className="w-4 h-4" />
                  よくあるご質問
                </a>
              </div>
            )}
          </div>
        )}
      </ActionBar>
      <DateDrumSheet open={pickerOpen} value={birth} onClose={() => setPickerOpen(false)} onDone={(v) => { setBirth(v); setPickerOpen(false); }} />
      {noticeOpen && (
        <div className="absolute inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 fade-in" onClick={() => setNoticeOpen(false)} />
          <div className="sheet-up absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-xl max-h-[88%] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-warm-200">
              <h3 className="flex items-center gap-2 text-h5 font-bold text-neutral-800">
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

              <div className="space-y-5">
                <p className="flex items-center gap-2 text-h6 font-bold text-neutral-800">
                  <span className="rounded-full bg-primary-10 text-primary-700 px-2 py-0.5 text-[11px] font-bold leading-none">事前同意</span>
                  事前同意事項
                </p>
                <p className="text-caption text-neutral-500 leading-relaxed">お申し込み前にご確認ください。</p>
                <section className="space-y-1.5">
                  <h4 className="text-h6 font-bold text-neutral-800">この保険について</h4>
                  <ul className="space-y-1.5 text-caption text-neutral-600 leading-relaxed">
                    <li>・株式会社三菱ＵＦＪ銀行を団体契約者とし、Money Canvas会員の皆さま、会員のご家族を被保険者とする団体契約です。Money Canvas会員の資格を喪失された場合、保険契約は解約いただく、もしくは更新できませんので、ご注意ください。また、保険証券を請求する権利、保険契約を解約する権利等は原則として株式会社 三菱ＵＦＪ銀行が有します。</li>
                    <li>・この契約は、申込み日が17日までの場合は、翌月1日（0時）より補償が開始し、申込み日が18日から末日までの場合は、翌々月1日（0時）より補償が開始します。</li>
                    <li>・満期日までにご加入者から更新しない旨のお申出がなければ、団体の取り決めにより原則自動更新されます。</li>
                  </ul>
                </section>
                <section className="space-y-1.5">
                  <h4 className="text-h6 font-bold text-neutral-800">個人情報の取扱いについて</h4>
                  <ul className="space-y-1.5 text-caption text-neutral-600 leading-relaxed">
                    <li>・団体契約者である株式会社三菱ＵＦＪ銀行は、お客さまにご入力いただく個人情報を、以下の目的で利用させていただきます。</li>
                    <li>・お客さまに関する情報は、保険契約上必要な範囲で引受保険会社に提供し、契約の引受・維持管理、保険金等のお支払いの目的で利用させていただきます。</li>
                    <li>・法令に基づく場合を除き、ご本人の同意なく第三者へ提供することはありません。</li>
                  </ul>
                </section>
                {plan.death && (
                <section className="space-y-1.5">
                  <h4 className="text-h6 font-bold text-neutral-800">死亡保険金受取人について</h4>
                  <ul className="space-y-1.5 text-caption text-neutral-600 leading-relaxed">
                    <li>・本プランには死亡保障が含まれます。死亡保険金受取人は、日本国内に在住し、日本語による各種ご通知・お手続きへの対応が可能な方に限ります。</li>
                  </ul>
                </section>
                )}
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
