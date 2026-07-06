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
/* eslint-disable react-hooks/refs --
   ScreenForm の setFieldRef は ref コールバック (ref={setFieldRef(id)}) で、
   .current への代入はコミット時に走る正規パターン。React Compiler ルールの誤検知を抑制。 */
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
   原典: TD 組込1.5-handoff (8) (kumikomi.html 単一ファイル版を正) (2026-06-29 取り込み)

   ★ shadcn ラッパー方針 (HANDOFF §11.4):
     共通 atom (Btn / Badge / Field / LockedField / GroupCard) は
     components/ui の shadcn primitive (Button / Badge / Input / Label / Card)
     へ委譲するアダプタ層。screens 側の呼び出し (<Btn> 等) は不変。
   ★ タイポ: Claude Design のコンパクトスケール text-h{2-7} (h7=16px) を
     repo の UI Heading スケール text-h{1-6} へ変換済み (globals.css 準拠)。
   ★ Select はネイティブ <select> 維持、AppBar / Steps / DateDrumSheet /
     WheelCol / PlanCard / ExtBar 等のモバイル UI 固有部品も独自実装維持。

   画面 (9 index / 5 番号ステップ + パターンB 統合画面 ScreenCombined):
     0 商品概要 / 1 プラン選択 / 2 PIN認証 / 3 電話認証(SMS) / 4 申込フォーム /
     5 内容確認 / 6-7 カード承認(外部GMO) / 8 完了
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
  cat?: string;
  checks?: string[];
  linkBtn?: { label: string; href: string };
  bulletLinks?: { text: string; url: string }[];
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
    <UIBadge variant="secondary" className={`rounded-full border-transparent px-3 py-1 text-caption font-medium ${tint[tone]}`}>
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
  // グラデーション: cta / button = ブルー, danger = レッド (TD 組込1.4)
  const gradStyle: React.CSSProperties | undefined =
    (kind === "cta" || kind === "button")
      ? { backgroundImage: "linear-gradient(135deg, #1aa5dc 0%, #7fd0f0 100%)" }
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
      className={`h-16 md:h-16 rounded-xl gap-2 px-4 text-h6 font-bold active:scale-[.99] ${tint[kind]} ${full ? "w-full" : ""}`}
    >
      {children}
    </Button>
  );
}

// Phone app bar (THEO header)
// 共有グラデーション: ステータスバー(33px)+ヘッダー(56px) を1枚の連続グラデとして描画
export const HEADER_GRAD_CSS: React.CSSProperties = {
  backgroundImage: "linear-gradient(135deg, #1aa5dc 0%, #7fd0f0 100%)",
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
        <span className="w-10 shrink-0" />
        <div className={`flex items-center gap-2 min-w-0 transition-opacity duration-200 ${brandVisible ? "opacity-100" : "opacity-0"}`}>
          <span className="font-en font-semibold tracking-[0.1em] text-h6">XXX</span>
          <span className="text-h6 font-medium truncate">つみたて安心ほけん</span>
          <span className="font-en text-[10px] font-medium opacity-75 shrink-0">&lt;XXX&gt;</span>
        </div>
        <span className="w-10 shrink-0" />
      </div>
    </div>
  );
}

// step progress dots — 既出（到達済み）ステップは押下でその画面へ遷移
export const STEP_TO_SCREEN: Record<number, number> = { 1: 0, 2: 1, 3: 3, 4: 4, 5: 7 };
export function Steps({ n, of = 5, go }: { n: number; of?: number; go?: Go }) {
  return (
    <div className="flex justify-center items-center gap-0 px-6 py-2 bg-white border-b border-warm-200">
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
              className={`grid place-items-center w-8 h-8 rounded-full border-2 shrink-0 font-en text-[10px] font-bold transition-colors ${
                active ? "border-primary bg-primary text-white" : 
                filled ? "border-primary bg-white text-primary" : 
                "border-warm-300 bg-white text-neutral-400"
              } ${clickable ? "cursor-pointer hover:shadow-md" : "cursor-default"}`}>
              {stepNo}
            </button>
            {/* Line between circles */}
            {i < of - 1 && (
              <div className={`w-8 h-[2px] transition-colors ${
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
      <div className="flex items-center gap-3 px-6 py-4 bg-primary-10 border-b border-primary-100">
        {iconSrc ? (
          <img src={iconSrc} alt="" className="w-8 h-8 shrink-0" />
        ) : Icon ? (
          <Icon className="w-8 h-8 text-primary shrink-0" />
        ) : null}
        <div className="min-w-0">
          <p className="text-h4 font-bold text-neutral-800 leading-tight">{title}</p>
          {sub && <p className="text-[11px] text-neutral-500 leading-tight">{sub}</p>}
        </div>
      </div>
      <CardContent className="p-6 space-y-6">{children}</CardContent>
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
  const base = "sticky bottom-0 z-20 backdrop-blur border-t px-6 py-3 space-y-2 transition-colors duration-300";
  return (
    <div className={`${base} ${bg ? "" : (solid ? "bg-primary-10 border-primary-100" : "bg-white/95 border-warm-200")}`}
      style={bg ? { background: bg, borderTopColor: "rgba(15,23,42,0.06)" } : undefined}>
      {children}
    </div>
  );
}

// 必須マーク（赤字アスタリスク）
export function ReqBadge() {
  return (
    <span className="ml-0.5 inline-flex items-center align-middle font-bold leading-none" style={{ color: 'var(--color-attention)' }}>*</span>
  );
}

// インラインのエラーメッセージ（小さめ・赤字・アイコン付き）
export function ErrText({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-start gap-1 font-medium leading-snug" style={{ fontSize: '12px', color: 'var(--color-attention)' }}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mt-px shrink-0"><path d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12C1.25 6.072 6.072 1.25 12 1.25C17.928 1.25 22.75 6.072 22.75 12C22.75 17.928 17.928 22.75 12 22.75ZM12 2.75C6.899 2.75 2.75 6.899 2.75 12C2.75 17.101 6.899 21.25 12 21.25C17.101 21.25 21.25 17.101 21.25 12C21.25 6.899 17.101 2.75 12 2.75ZM12.75 16.5V11.929C12.75 11.515 12.414 11.179 12 11.179C11.586 11.179 11.25 11.515 11.25 11.929V16.5C11.25 16.914 11.586 17.25 12 17.25C12.414 17.25 12.75 16.914 12.75 16.5ZM13.02 8.5C13.02 7.948 12.573 7.5 12.02 7.5H12.01C11.458 7.5 11.0149 7.948 11.0149 8.5C11.0149 9.052 11.468 9.5 12.02 9.5C12.572 9.5 13.02 9.052 13.02 8.5Z"/></svg>
      <span>{children}</span>
    </span>
  );
}

// エラー状態の入力枠スタイル（border赤＋薄赤背景。レイアウトずれ防止に border幅は1pxのまま）
export const ERR_INPUT_CLS = "text-neutral-800";
export const errInputStyle = { borderColor: 'var(--color-attention)', background: '#FFF5F5', boxShadow: '0 0 0 1px var(--color-attention)' };

// Wireframe form field
export function Field({ label, placeholder, required, hint, value, onChange, disabled, error, errMode, anchorRef }: { label: string; placeholder?: string; required?: boolean; hint?: string; value?: string; onChange?: React.ChangeEventHandler<HTMLInputElement>; disabled?: boolean; error?: string; errMode?: string; anchorRef?: any }) {
  // shadcn <Label> + <Input> へ委譲。error/errMode は Claude Design のインライン検証用 (1.5(1))。
  const id = React.useId();
  const invalid = !!error && !!errMode && errMode !== "none";
  return (
    <div className="flex flex-col gap-2" ref={anchorRef}>
      <Label htmlFor={id} className="text-caption font-medium text-neutral-600">
        {label}{required && <span className="text-[color:var(--secondary-color-700)] ml-[2px]">*</span>}
      </Label>
      <Input
        id={id}
        placeholder={placeholder}
        defaultValue={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        style={invalid ? errInputStyle : undefined}
        className={`fld h-12 rounded-lg border px-3 text-h6 placeholder:text-neutral-400 ${disabled ? "border-warm-200 bg-warm-200/60 text-neutral-400 cursor-not-allowed" : invalid ? `border-[color:var(--color-attention)] ${ERR_INPUT_CLS}` : "border-warm-300 bg-white text-neutral-800"}`}
      />
      {errMode === "inline" && error && <ErrText>{error}</ErrText>}
      {hint && <span className="text-caption text-neutral-400">{hint}</span>}
    </div>
  );
}

// Read-only / locked display field（入力済み・変更不可）
export function LockedField({ label, value }: { label: string; value: string }) {
  // shadcn <Label> + 無効化した <Input> へ委譲 (表示専用)。
  return (
    <div className="flex flex-col gap-2">
      <Label className="flex items-center gap-2 text-caption font-medium text-neutral-600">
        {label}
        <span className="inline-flex items-center gap-1 rounded-full bg-warm-200 px-2 py-[2px] text-[10px] font-medium text-neutral-500">変更不可</span>
      </Label>
      <div className="relative">
        <Input
          value={value}
          readOnly
          disabled
          className="fld h-12 rounded-lg border border-warm-200 bg-warm-200/60 px-3 pr-10 text-h6 text-neutral-500"
        />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
      </div>
    </div>
  );
}

// Wireframe select (dropdown)
export function Select({ label, required, hint, value, onChange, options = [], disabled, error, errMode, anchorRef }: { label: string; required?: boolean; hint?: string; value?: string; onChange?: React.ChangeEventHandler<HTMLSelectElement>; options?: string[]; disabled?: boolean; error?: string; errMode?: string; anchorRef?: any }) {
  const invalid = !!error && errMode && errMode !== 'none';
  const showText = invalid && errMode === 'inline';
  return (
    <label ref={anchorRef} className="flex flex-col gap-2">
      <span className="text-caption font-medium text-neutral-600">
        {label}{required && <ReqBadge />}
      </span>
      <div className="relative">
        <select defaultValue={value} onChange={onChange} disabled={disabled}
          style={invalid ? errInputStyle : undefined}
          className={`fld appearance-none w-full h-12 rounded-lg border px-3 pr-10 text-h6 ${disabled ? "border-warm-200 bg-[#EFEFEF] text-neutral-400 cursor-not-allowed" : invalid ? `border-[color:var(--color-attention)] ${ERR_INPUT_CLS}` : "border-warm-300 bg-white text-neutral-800"}`}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"><path d="M6 9l6 6 6-6"/></svg>
      </div>
      {showText && <ErrText>{error}</ErrText>}
      {!showText && hint && <span className="text-caption text-neutral-400">{hint}</span>}
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
        <div className="px-6 pt-6 pb-8" style={{ backgroundImage: "url('/assets/theo-tdf/hero_bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <img src="/assets/theo-tdf/dammy_logo_cyan.svg" alt="くみこみ安心ほけん" className="h-8 mb-6" />
          <p className="font-en text-caption tracking-[0.18em] uppercase text-neutral-500">Embedded Insurance</p>
          <h1 className="mt-2 text-h2 font-bold leading-snug text-neutral-800">信頼を、もっと<br/>触れる距離に。</h1>
          <p className="mt-3 text-h6 leading-relaxed text-neutral-700">XXX の資産運用に、<br/>もしものときの備えをひとつに。</p>
          <div className="mt-4"><Badge>重要</Badge></div>
        </div>

        <div className="px-4 py-6 space-y-6" style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #F2FBFE 100%)" }}>
          {/* hook card */}
          <div className="rounded-2xl border border-warm-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="font-mono text-caption tracking-[0.14em] uppercase text-neutral-400">このアプリだけの備え</p>
              <img src="/assets/theo-tdf/logo_td.png" alt="T&Dフィナンシャル生命" className="h-4 shrink-0" />
            </div>
            <div className="mb-2 px-1">
              <p className="text-[11px] text-neutral-400 leading-none mb-0.5">保険名称</p>
              <p className="text-[11px] text-neutral-600 leading-relaxed">無配当特定疾病障害介護保障保険（団体型）</p>
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
                  <v.i className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-h6 font-bold text-neutral-800">{v.t}</p>
                  <p className="text-caption text-neutral-500 leading-relaxed">{v.d}</p>
                </div>
              </div>
            ))}
          </div>

          {/* premium teaser */}
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
  { p: "ご契約にあたっては、過去の傷病歴（傷病名・治療期間等）、現在の健康状態、身体の障がい状態、職業歴とうについて「告知書」で当社がおたずねすることについて、事実をありのままに正確にもれなくお知らせ（告知）ください" },
  { p: "ご契約（責任開始期）前に生じた病気やケガにより、支払事由が生じた場合には、保険金・給付金はお支払い出来ません。（事例）契約前より高血圧・脂質異常で定期的に服薬中の場合\n以下告知項目に該当しませんが、契約3ヶ月後に直接的な原因により脳梗塞が発症した場合などはお支払い出来ないことがあります。" },
  { p: "※ただし、以下のような場合には責任開始期以後発生した原因によるものとみなし、保険金・給付金をお支払いします。" },
  { ul: [
    "責任開始期から2年を経過した後で支払事由が生じた場合",
    "責任開始期以降、その疾病やケガによって医師の診察を受けたことがなく、かつ診断等による異常な指摘も受けていない場合。ただし、その原因となった病気やケガによる症状について被保険者が認識または自覚していた場合を除きます。",
  ] },
];

/* ── 告知項目テンプレート（取り込み用PPTXの4区分）──
   死亡用 / がん用 / 三大疾病用 / 障害・介護用 を、プラン×死亡保障で組み合わせて出し分ける。 */
export const DISCLOSURE_HEAD = [
  { head: "告知重要事項" },
  { p: "各項目をご確認のうえ、以下の内容にご回答ください。" },
];
// 最近の健康状態（全パターン共通・先頭に1度だけ）
export const G_RECENT = [
  { cat: "最近の健康状態" },
  { p: "最近3ヶ月以内に、医師より検査・入院・手術を勧められたことがありますか。（検査には、健康診断、人間ドック、歯科検査、アレルギー検査を含みません）" },
];
// 別表（病気・ケガ）— 死亡用・障害介護用で使用。目の行だけ差し替え
export const BETSU_TOP = [
  ["心臓・血液", "狭心症、心筋梗塞、心臓弁膜症、不整脈、心筋症、心不全、大動脈瘤"],
  ["脳", "脳卒中（脳出血、脳梗塞、くも膜下出血）、脳動脈瘤、脳しゅよう"],
  ["精神・神経", "認知症、うつ病、統合失調症、アルコール依存症、てんかん、パーキンソン病、脊髄小脳変性症、多系統萎縮症、筋萎縮性側索硬化症、多発性硬化症"],
  ["肝臓・腎臓・膵臓", "慢性肝炎、肝硬変、慢性腎炎、ネフローゼ、腎不全、すい炎"],
  ["肺", "肺気腫、閉塞性肺疾患、間質性肺炎、誤嚥性肺炎"],
];
export const BETSU_BOTTOM = [
  ["悪性新生物", "がん、肉腫、悪性の腫瘍、白血病、悪性リンパ腫、骨髄腫、骨髄異形成症候群"],
  ["その他", "合併症を伴う糖尿病、膠原病（関節リウマチ、全身性エリテマトーデス（SLE）、強皮症、多発性筋炎、結節性多発動脈周囲炎）"],
];
export const TABLE_CARE = [...BETSU_TOP, ["目", "緑内障、加齢黄斑変性症、網膜色素変性症"], ...BETSU_BOTTOM];
export const TABLE_DEATH = [...BETSU_TOP, ["目", "—"], ...BETSU_BOTTOM];

// ── 告知項目（ノックアウト告知）：取り込み用PPTXの4区分を、プラン×死亡保障で組み合わせて1つに ──
// paras は { t:本文, sub?:別表 } の配列。別表は対応する設問の直後に表示する。
export const RECENT_ROW = { k: "最近の健康状態", paras: [{ t: "最近3ヶ月以内に、医師より検査・入院・手術を勧められたことがありますか。（検査には、健康診断、人間ドック、歯科検査、アレルギー検査を含みません）" }] };
// 死亡用
export const KO_DEATH = [
  RECENT_ROW,
  { k: "病気・ケガについて", paras: [{ t: "過去5年以内に別表の病気で、医師による診療・検査・治療・薬の処方を受けたことがありますか。", sub: TABLE_DEATH }] },
];
// 障害・介護用
export const KO_CARE = [
  RECENT_ROW,
  { k: "病気・ケガについて", paras: [{ t: "過去5年以内に別表の病気で、医師による診療・検査・治療・薬の処方を受けたことがありますか。", sub: TABLE_CARE }] },
  { k: "身体の障がい・介護状態について", paras: [
    { t: "つぎのいずれか1つでも該当することはありますか。" },
    { t: "●今までに、公的介護保険制度の要介護または要支援の認定を受けていたこと、もしくは、認定申請をしたことがある（40歳未満の方は該当しません）" },
    { t: "●現在、つぎの1〜5の日常生活のいずれかにおいて、他の方の介助またはご自身で補助具を必要とすることがある。＊骨折中などにより現在一時的に必要とする場合も含みます。＜1.歩行 2.衣服の着替え 3.入浴 4.食事 5.排泄＞" },
  ] },
];
// がん用
export const KO_CANCER = [
  RECENT_ROW,
  { k: "病気・ケガについて", paras: [{ t: "過去5年以内に、病気で継続して7日以上の入院をしたことまたは手術を受けたことがありますか。（新型コロナウイルスによる入院は含みません。）" }] },
  { k: "がんについて", paras: [{ t: "今までに、がん（上皮内がんを含みます）・肉腫・悪性リンパ腫・白血病にかかったこと、または上皮内異形成になったことがありますか。" }] },
  { k: "健康診断・人間ドックについて", paras: [{ t: "過去2年以内に健康診断・人間ドックにおいて、以下の検査を受けて、異常の指摘を受けたことがありますか。" }, { t: "異常とは、要再検査・要精密検査・要治療をいいます。ただし、再検査・精密検査の結果、「異常なし」と診断された場合を除きます。" }], checks: ["『内視鏡検査・便潜血検査・マンモグラフィ検査』", "『しゅようマーカー（CEA、AFP、CA19-9、PSA）』"] },
];
// 三大疾病用
export const KO_THREE = [
  RECENT_ROW,
  { k: "病気・ケガについて", paras: [{ t: "過去5年以内に、病気で継続して7日以上の入院をしたことまたは手術を受けたことがありますか。（新型コロナウイルスによる入院は含みません。）" }] },
  { k: "がんについて", paras: [{ t: "今までに、がん（上皮内がんを含みます）・肉腫・悪性リンパ腫・白血病にかかったこと、または上皮内異形成になったことがありますか。" }] },
  { k: "健康診断・人間ドックについて", paras: [{ t: "過去2年以内に健康診断・人間ドックにおいて、以下の検査を受けて、異常の指摘を受けたことがありますか。" }, { t: "異常とは、要再検査・要精密検査・要治療をいいます。ただし、再検査・精密検査の結果、「異常なし」と診断された場合を除きます。" }], checks: ["『心電図検査・内視鏡検査・便潜血検査・マンモグラフィ検査』", "『しゅようマーカー（CEA、AFP、CA19-9、PSA）』"] },
  { k: "女性の方", paras: [{ t: "現在妊娠していますか。" }] },
];
export const KO_ORDER = ["最近の健康状態", "病気・ケガについて", "がんについて", "健康診断・人間ドックについて", "身体の障がい・介護状態について", "女性の方"];

// プラン×死亡保障 → ノックアウト告知（同一区分はマージし重複本文はまとめる。対応表どおりの組み合わせ）
export function koTableFor(planId: string, death: boolean) {
  const map = {
    cancer:      death ? [KO_DEATH, KO_CANCER] : [KO_CANCER],
    three:       death ? [KO_DEATH, KO_THREE]  : [KO_THREE],
    care:        [KO_CARE],
    cancer_care: [KO_CARE, KO_CANCER],
    three_care:  [KO_CARE, KO_THREE],
  };
  const blocks: any[] = ((map as Record<string, any[]>)[planId] || [KO_CANCER]);
  const byKey: Record<string, any> = {};
  for (const block of blocks) {
    for (const row of block) {
      if (!byKey[row.k]) byKey[row.k] = { k: row.k, paras: [], checks: [] };
      const tgt = byKey[row.k];
      (row.paras || []).forEach((p: any) => { if (!tgt.paras.some((q: any) => q.t === p.t)) tgt.paras.push(p); });
      (row.checks || []).forEach((c: any) => { if (!tgt.checks.includes(c)) tgt.checks.push(c); });
    }
  }
  return KO_ORDER.filter((k) => byKey[k]).map((k) => byKey[k]);
}

// 告知項目プレビュー用パターン（プラン×死亡保障の全10通り）— Tweaks「告知項目パターン」で切替
export const KOKUCHI_PATTERNS = [
  { key: 'care_d',   plan: 'care',        death: true,  label: '① 障害・介護プラン（死亡あり）' },
  { key: 'care_n',   plan: 'care',        death: false, label: '② 障害・介護プラン' },
  { key: 'cancer_d', plan: 'cancer',      death: true,  label: '③ がんプラン（死亡あり）' },
  { key: 'cancer_n', plan: 'cancer',      death: false, label: '④ がんプラン' },
  { key: 'cc_d',     plan: 'cancer_care', death: true,  label: '⑤ がん・障害介護プラン（死亡あり）' },
  { key: 'cc_n',     plan: 'cancer_care', death: false, label: '⑥ がん・障害介護プラン' },
  { key: 'three_d',  plan: 'three',       death: true,  label: '⑦ 三大疾病プラン（死亡あり）' },
  { key: 'three_n',  plan: 'three',       death: false, label: '⑧ 三大疾病プラン' },
  { key: 'tc_d',     plan: 'three_care',  death: true,  label: '⑨ 三大疾病・障害介護プラン（死亡あり）' },
  { key: 'tc_n',     plan: 'three_care',  death: false, label: '⑩ 三大疾病・障害介護プラン' },
];

export const PLANS: Plan[] = [
  { id: "cancer", name: "がん保障型", price: "¥980", death: true,
    lead: "がんと診断された場合に、給付金が支払われます",
    feat: ["診断給付金：最大 ¥1,000,000（逓減給付型）", "保険期間：1年（自動更新）", "告知のみ・診査不要"],
    tooltip: { sections: [
      { head: "「がん」とは", body: "がん（悪性新生物）を指します。\n前がん状態の病変、境界悪性、上皮内がんは、保障対象とはなりません。したがって子宮筋腫のような良性新生物、大腸の粘膜内がんなどの上皮内がんは、保障対象とはなりません。" },
    ] } },
  { id: "three", name: "三大疾病保障型", price: "¥1,180", death: true,
    lead: "がん・急性心筋梗塞・脳卒中と診断された場合に、給付金が支払われます",
    feat: ["診断給付金：最大 ¥1,000,000（逓減給付型）", "保険期間：1年（自動更新）", "告知のみ・診査不要"],
    tooltip: { sections: [
      { head: "三大疾病とは", body: "以下の病気を指します。\n・がん（悪性新生物）\n・急性心筋梗塞\n・脳卒中\nがん（悪性新生物）について、前がん状態の病変、境界悪性、上皮内がんは、保障対象とはなりません。したがって子宮筋腫のような良性新生物、大腸の粘膜内がんなどの上皮内がんは、保障対象とはなりません。" },
    ] } },
  { id: "care", name: "障害介護保障型", price: "¥680", death: true,
    lead: "障害・介護状態になった場合に、給付金が支払われます",
    feat: ["給付：月額 最大 ¥50,000", "保険期間：1年（自動更新）", "告知のみ・診査不要"],
    tooltip: { sections: [
      { head: "障害・介護状態とは", body: "以下の状態を指します。\n・障害等級2級以上の状態\n・要介護2以上の状態" },
    ] } },
  { id: "cancer_care", name: "がん・障害介護保障型", price: "¥1,480", death: true,
    lead: "がんと診断された場合、または障害・介護状態になった場合に、給付金が支払われます",
    feat: ["がん診断給付金：最大 ¥1,000,000", "障害・介護：月額 最大 ¥50,000", "保険期間：1年（自動更新）"],
    tooltip: { sections: [
      { head: "「がん」とは", body: "がん（悪性新生物）を指します。\n前がん状態の病変、境界悪性、上皮内がんは、保障対象とはなりません。したがって子宮筋腫のような良性新生物、大腸の粘膜内がんなどの上皮内がんは、保障対象とはなりません。" },
      { head: "障害・介護状態とは", body: "以下の状態を指します。\n・障害等級2級以上の状態\n・要介護2以上の状態" },
    ] } },
  { id: "three_care", name: "三大疾病・障害介護保障型", price: "¥1,780", death: true,
    lead: "三大疾病と診断された場合、または障害・介護状態になった場合に、給付金が支払われます",
    feat: ["三大疾病給付金：最大 ¥1,000,000", "障害・介護：月額 最大 ¥50,000", "保険期間：1年（自動更新）"],
    tooltip: { sections: [
      { head: "三大疾病とは", body: "以下の病気を指します。\n・がん（悪性新生物）\n・急性心筋梗塞\n・脳卒中\n※がん（悪性新生物）について、前がん状態の病変、境界悪性、上皮内がんは、保障対象とはなりません。したがって子宮筋腫のような良性新生物、大腸の粘膜内がんなどの上皮内がんは、保障対象とはなりません。" },
      { head: "障害・介護状態とは", body: "以下の状態を指します。\n・障害等級2級以上の状態\n・要介護2以上の状態" },
    ] } },
];

// 10枚カード（プラン×死亡保障）
export const PLAN_CARDS: (Plan & { planId: string })[] = PLANS.flatMap((p) => [
  { ...p, id: p.id + '_d', planId: p.id, death: true,  name: p.name + '　死亡保障あり' },
  { ...p, id: p.id + '_n', planId: p.id, death: false, name: p.name + '　死亡保障なし' },
]);
export function planIdFromSel(sel: string) { return sel ? sel.replace(/_[dn]$/, '') : 'cancer'; }
export function deathFromSel(sel: string)  { return !sel || !sel.endsWith('_n'); }

/* 告知項目（ノックアウト告知）— 区分はラベル（太字・改行）＋本文のリスト形式。別表は内側の表組みのまま */
export function KoTable({ rows }: { rows: any[] }) {
  return (
    <div className="rounded-xl border border-warm-200 bg-white divide-y divide-warm-200">
      {rows.map((r, i) => (
        <div key={i} className="px-4 py-3 space-y-2">
          <p className="text-h6 font-bold text-neutral-800 leading-snug">{r.k}</p>
          {r.paras.map((p: any, j: number) => (
            <div key={j} className="space-y-2">
              <p className="text-caption text-neutral-700 leading-relaxed whitespace-pre-line">{p.t}</p>
              {p.sub && (
                <div className="rounded-lg border border-warm-200 overflow-hidden">
                  {p.sub.map((row: any, k: number) => (
                    <div key={k} className={`grid grid-cols-[88px_1fr] ${k > 0 ? "border-t border-warm-200" : ""}`}>
                      <div className="bg-warm-100 px-2 py-2 flex items-center border-r border-warm-200">
                        <span className="text-[11px] font-bold text-neutral-600 leading-snug">{row[0]}</span>
                      </div>
                      <div className="px-2 py-2 text-[11px] text-neutral-700 leading-relaxed">{row[1]}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {r.checks && r.checks.length > 0 && (
            <div className="space-y-1 pt-[2px]">
              {r.checks.map((c: any, j: number) => (
                <p key={j} className="text-caption font-bold text-neutral-800 leading-relaxed">{c}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* 告知項目モーダル — プラン選択画面のツールチップ押下で表示 */
/* 各セクション（r.k）を1枚のカードにまとめて表示 */
export function DisclosureQCard({ row, idx }: { row: any; idx: number }) {
  return (
    <div className="rounded-xl border border-warm-200 bg-white overflow-hidden">
      <div className="px-3 pt-3 pb-3 space-y-2">
        {row.paras.map((p: any, j: number) => {
          // 問いかけ文を太字化：文全体が短い問いかけ（改行なし）なら全文bold、それ以外は末尾のありますか/ていますか以降をbold
          const isShortQ = /(?:ありますか|ていますか)[。。。]?(?:（[^（）]*）|\([^()]*\))?[。。。]?\s*$/.test(p.t) && !p.t.includes('\n');
          const parts = isShortQ ? [p.t] : p.t.split(/((?:ありますか|ていますか)[。。。][^\n]*)/);
          return (
            <div key={j}>
              <p className="text-caption leading-relaxed text-neutral-700">
                {parts.map((seg: string, k: number) =>
                  isShortQ || /(?:ありますか|ていますか)/.test(seg)
                    ? <strong key={k} className="font-bold text-neutral-900 text-[14px]">{seg}</strong>
                    : <span key={k}>{seg}</span>
                )}
              </p>
              {p.sub && (
                <div className="mt-2 rounded-lg border border-warm-200 overflow-hidden">
                  {p.sub.map((srow: any, sk: number) => (
                    <div key={sk} className={`grid grid-cols-[88px_1fr] ${sk > 0 ? 'border-t border-warm-200' : ''}`}>
                      <div className="bg-warm-100 px-2 py-2 flex items-center border-r border-warm-200">
                        <span className="text-[11px] font-bold text-neutral-600 leading-snug">{srow[0]}</span>
                      </div>
                      <div className="px-2 py-2 text-[11px] text-neutral-700 leading-relaxed">{srow[1]}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {row.checks && row.checks.length > 0 && (
          <div className="space-y-1 pt-[2px]">
            {row.checks.map((c: any, j: number) => (
              <p key={j} className="text-caption font-bold text-neutral-800">{c}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function DisclosureModal({ plan, death = true, onClose, confirm, onConfirm, onCancel }: { plan: Plan | null; death?: boolean; onClose: () => void; confirm?: boolean; onConfirm?: () => void; onCancel?: () => void }) {
  const [askExit, setAskExit] = React.useState(false);
  if (!plan) return null;
  const koRows = koTableFor(plan.id, death);
  // 1セクション（r）= 1枚のカード
  const qCards: React.ReactNode[] = [];
  koRows.forEach((r, i) => {
    qCards.push(
      <p key={`h-${r.k}`} className="text-[11px] font-bold text-neutral-500 pt-1 pb-[2px] border-b border-warm-200">{r.k}</p>
    );
    qCards.push(<DisclosureQCard key={i} idx={i + 1} row={r} />);
  });
  return (
    <div className="absolute inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 fade-in" onClick={onClose} />
      <div className="sheet-up absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-xl max-h-[88%] flex flex-col">
        <div className="flex items-center justify-between gap-2 px-6 pt-4 pb-3 border-b border-warm-200">
          <h3 className="flex items-center gap-2 text-h6 font-bold text-neutral-800 min-w-0">
            <span className="grid place-items-center w-6 h-6 rounded-full shrink-0 text-white" style={{ background: 'var(--color-attention)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="w-3 h-3"><path d="M12 6v8"/><path d="M12 18v.01"/></svg>
            </span>
            <span>{plan.name}　死亡保障{death ? 'あり' : 'なし'}の告知項目</span>
          </h3>
          <button onClick={onClose} className="grid place-items-center w-8 h-8 rounded-full bg-warm-100 text-neutral-500 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto no-sb px-4 py-4 space-y-3">
          <AgreeBlocks blocks={DISCLOSURE_INTRO} />
          <div className="rounded-xl px-4 py-3 flex items-start gap-2" style={{ background: '#F0F7FF', border: '1px solid #C8DCFA' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 shrink-0 mt-[2px]" style={{ color: 'var(--color-primary)' }}><circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><path d="M12 16v.01"/></svg>
            <p className="text-caption leading-relaxed" style={{ color: '#1AA5DC' }}>各質問に対して<strong>「はい」に当てはまる場合はお申し込みいただけません。</strong></p>
          </div>
          <div className="space-y-3">
            <div className="pt-8">
              <p className="text-h5 font-bold text-neutral-800 leading-snug">告知重要事項</p>
              <p className="text-caption text-neutral-600 leading-relaxed mt-1">各項目をご確認のうえ、以下の内容にご回答ください。</p>
            </div>
            {qCards}
          </div>
        </div>
        <div className="px-6 py-3 border-t border-warm-200">
          {confirm ? (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-x-3 gap-y-6">
                <button onClick={onCancel ? () => setAskExit(true) : onClose}
                  className="flex flex-col items-center justify-center gap-[2px] rounded-xl py-3 font-bold border-2 transition-colors"
                  style={{ borderColor: 'var(--color-attention)', color: 'var(--color-attention)', background: '#FFF5F5' }}>
                  <span className="flex items-center gap-2 text-h6 font-bold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    はい
                  </span>
                  <span className="text-[10px] font-medium leading-tight" style={{ color: 'var(--color-attention)' }}>１つでも存在する</span>
                </button>
                <button onClick={onConfirm || onClose}
                  className="flex flex-col items-center justify-center gap-[2px] rounded-xl py-3 font-bold border-2 transition-colors"
                  style={{ borderColor: '#16A34A', color: '#16A34A', background: '#F0FDF4' }}>
                  <span className="flex items-center gap-2 text-h6 font-bold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4"><path d="M5 12l5 5L19 7"/></svg>
                    いいえ
                  </span>
                  <span className="text-[10px] font-medium leading-tight" style={{ color: '#16A34A' }}>すべていいえ</span>
                </button>
              </div>
              <p className="text-center text-[11px] text-neutral-400">すべての項目が「いいえ」の場合に進めます</p>
            </div>
          ) : (
            <Btn kind="button" onClick={onClose}>閉じる</Btn>
          )}
        </div>
      </div>

      {/* 終了確認アラート */}
      {askExit && (
        <div className="absolute inset-0 z-[60] grid place-items-center px-8">
          <div className="absolute inset-0 bg-black/45 fade-in" onClick={() => setAskExit(false)} />
          <div className="sheet-pop relative w-full max-w-[300px] rounded-2xl bg-white shadow-xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 text-center">
              <p className="text-h6 font-bold text-neutral-800 leading-relaxed">お申し込みが出来ません。<br/>終了してよいですか？</p>
            </div>
            <div className="grid grid-cols-2 border-t border-warm-200">
              <button onClick={() => setAskExit(false)} className="py-3 text-h6 font-medium text-neutral-500 border-r border-warm-200">キャンセル</button>
              <button onClick={() => { setAskExit(false); onCancel && onCancel(); }} className="py-3 text-h6 font-bold" style={{ color: 'var(--color-link)' }}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PlanCard({ p, selected, onSelect, initialTtOpen }: { p: Plan; selected: boolean; onSelect: () => void; initialTtOpen?: boolean }) {
  const death = p.death;
  const [ttOpen, setTtOpen] = React.useState(initialTtOpen ?? false);
  return (
    <div onClick={onSelect} role="button" style={{ boxShadow: '0 0 8px rgba(27,49,87,0.08)' }} className={`w-full text-left rounded-2xl border bg-white overflow-hidden transition cursor-pointer ${selected ? "border-primary-300" : "border-warm-200"}`}>
      <div className={`flex items-center justify-between gap-3 px-4 py-3 border-b transition-colors ${selected ? "bg-primary-10 border-primary-100" : "bg-[#EFEFEF] border-warm-200"}`}>
        <div className="flex items-center gap-2">
          <span className={`grid place-items-center w-6 h-6 rounded-full border-2 shrink-0 ${selected ? "border-primary bg-primary text-white" : "border-warm-300 bg-white"}`}>
            {selected && <Ic.check className="w-3 h-3" />}
          </span>
          <span className="text-h6 font-bold text-neutral-800">{p.name}</span>
          {p.tooltip && (
            <button type="button" onClick={(e) => { e.stopPropagation(); setTtOpen((o) => !o); }}
              className={`grid place-items-center w-6 h-6 rounded-full border text-[11px] font-bold leading-none shrink-0 transition-colors ${ttOpen ? "border-primary bg-primary-10 text-primary-600" : "border-neutral-300 bg-white text-neutral-400 hover:border-primary hover:text-primary-600"}`}>?</button>
          )}
        </div>
        {p.tag && <Badge tone="secondary">{p.tag}</Badge>}
      </div>
      {ttOpen && (
        <div className="mx-4 mt-3 p-4 rounded-xl bg-primary-10 border border-primary-100 space-y-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <span className="text-caption font-bold text-neutral-800">死亡保障</span>
            <span className={`text-h6 font-bold leading-none ${death ? "text-primary-600" : "text-neutral-400"}`}>{death ? "◯" : "✗"}</span>
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
        <ul className="mt-3 space-y-2 border-t border-warm-200 pt-3">
          {p.feat.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-caption text-neutral-600">
              <Ic.check className="w-4 h-4 text-primary shrink-0" />{f.replace(/¥([\d,]+)/g, "$1 円")}
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

// アコーディオン式プランカード
export function PlanCardAccordion({ p, selected, onSelect, open, onToggle, initialTtOpen }: { p: Plan; selected: boolean; onSelect: () => void; open: boolean; onToggle: () => void; initialTtOpen?: boolean }) {
  const death = p.death;
  const [ttOpen, setTtOpen] = React.useState(initialTtOpen ?? false);
  return (
    <div className={`w-full rounded-2xl border bg-white overflow-hidden transition ${selected ? "border-primary-300" : "border-warm-200"}`} style={{ boxShadow: '0 0 8px rgba(27,49,87,0.08)' }}>
      {/* ヘッダー：タップでアコーディオン開閉 */}
      <div onClick={onToggle} role="button" className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${selected ? "bg-primary-10" : "bg-[#EFEFEF]"}`}>
        <span
          role="radio"
          aria-checked={selected}
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className={`grid place-items-center w-6 h-6 rounded-full border-2 shrink-0 transition-colors ${selected ? "border-primary bg-primary text-white" : "border-warm-300 bg-white"}`}>
          {selected && <Ic.check className="w-3 h-3" />}
        </span>
        <span className="flex-1 text-h6 font-bold text-neutral-800 leading-snug">{p.name}</span>
        {p.tooltip && (
          <button type="button" onClick={(e) => { e.stopPropagation(); setTtOpen((o) => !o); }}
            className={`grid place-items-center w-6 h-6 rounded-full border text-[11px] font-bold leading-none shrink-0 transition-colors ${ttOpen ? "border-primary bg-primary-10 text-primary-600" : "border-neutral-300 bg-white text-neutral-400 hover:border-primary hover:text-primary-600"}`}>?</button>
        )}
        {p.tag && <Badge tone="secondary">{p.tag}</Badge>}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${open ? "rotate-90" : ""}`}>
          <path d="M9 6l6 6-6 6" />
        </svg>
      </div>
      {/* ツールチップ展開エリア */}
      {ttOpen && p.tooltip && (
        <div className="mx-4 mt-3 p-4 rounded-xl bg-primary-10 border border-primary-100 space-y-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <span className="text-caption font-bold text-neutral-800">死亡保障</span>
            <span className={`text-h6 font-bold leading-none ${death ? "text-primary-600" : "text-neutral-400"}`}>{death ? "◯" : "✗"}</span>
          </div>
          {p.tooltip?.sections.map((s, i) => (
            <div key={i} className="space-y-1">
              <p className="text-caption font-bold text-neutral-800 leading-snug">{s.head}</p>
              <p className="text-caption text-neutral-700 leading-relaxed whitespace-pre-line">{s.body}</p>
            </div>
          ))}
        </div>
      )}
      {/* リード文：常に表示 */}
      <div onClick={onToggle} className="px-4 py-3 cursor-pointer">
        <p className="text-caption text-neutral-500 leading-relaxed">{p.lead}</p>
      </div>
      {/* 詳細：展開時のみ */}
      {open && (
        <div className="px-4 pb-4 border-t border-warm-200">
          <ul className="mt-3 space-y-2">
            {p.feat.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-caption text-neutral-600">
                <Ic.check className="w-4 h-4 text-primary shrink-0" />{f.replace(/¥([\d,]+)/g, "$1 円")}
              </li>
            ))}
          </ul>
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            className={`mt-4 w-full rounded-xl py-3 text-caption font-bold transition-colors ${selected ? "bg-primary text-white" : "border border-primary text-primary-600 bg-primary-10 hover:bg-primary hover:text-white"}`}>
            {selected ? "✓ 選択中" : "このプランを選択"}
          </button>
        </div>
      )}
    </div>
  );
}

// プランリスト（card / accordion モード切替）
export function PlanList({ sel, setSel, mode = 'card', initialTipIdx, initialOpenId }: { sel: string; setSel: React.Dispatch<React.SetStateAction<string>>; mode?: string; initialTipIdx?: number; initialOpenId?: string }) {
  const [openIds, setOpenIds] = React.useState<Set<string>>(() => new Set(initialOpenId ? [initialOpenId] : []));
  const toggleOpen = (id: string) => setOpenIds((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  if (mode === 'accordion') {
    return (
      <div className="flex flex-col" style={{ gap: '16px' }}>
        {PLAN_CARDS.map((p, i) => (
          <PlanCardAccordion key={p.id} p={p}
            selected={sel === p.id} onSelect={() => setSel(p.id)}
            open={openIds.has(p.id)} onToggle={() => toggleOpen(p.id)} />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col" style={{ gap: '16px' }}>
      {PLAN_CARDS.map((p, i) => (
        <PlanCard key={p.id} p={p} selected={sel === p.id} onSelect={() => setSel(p.id)} initialTtOpen={i === initialTipIdx} />
      ))}
    </div>
  );
}

/* Divider used inside combined (multi-section) pages */
export function StepSection({ label, n, big, className, children }: { label?: string; n?: number; big?: boolean; className?: string; children: React.ReactNode }) {
  if (big) {
    return (
      <section className={`space-y-4 ${className || ""}`}>
        <div className="flex items-center gap-3">
          {n != null && (
            <span className="grid place-items-center w-8 h-8 rounded-full bg-primary text-white font-en text-h5 font-bold shrink-0">{n}</span>
          )}
          <h2 className="text-h4 font-bold text-neutral-800">{label}</h2>
        </div>
        {children}
      </section>
    );
  }
  return (
    <section className="space-y-6">
      {label && (
        <div className="flex items-center gap-3">
          {n != null && (
            <span className="grid place-items-center w-8 h-8 rounded-full bg-primary text-white font-en text-h5 font-bold shrink-0">{n}</span>
          )}
          <span className="font-mono text-caption tracking-[0.14em] uppercase text-primary-600 whitespace-nowrap">{label}</span>
          <span className="flex-1 h-px bg-warm-200" />
        </div>
      )}
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
              <span className="shrink-0 w-6 pl-1 text-caption text-neutral-500 font-medium">年</span>
            </div>
            <div className="flex items-center" style={{ flex: 1 }}>
              <WheelCol items={months.map((v) => `${v}`)} index={mIdx} onChange={(i) => setMm(months[i])} align="end" />
              <span className="shrink-0 w-6 pl-1 text-caption text-neutral-500 font-medium">月</span>
            </div>
            <div className="flex items-center" style={{ flex: 1 }}>
              <WheelCol items={days.map((v) => `${v}`)} index={dIdx} onChange={(i) => setDd(days[i])} align="end" />
              <span className="shrink-0 w-6 pl-1 text-caption text-neutral-500 font-medium">日</span>
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
export function ScreenOverview({ go, initialHeigaiOpen }: { go: Go; initialHeigaiOpen?: boolean }) {
  const heroRef = useRef<any>(null);
  const heroBgRef = useRef<any>(null);
  const [solid, setSolid] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [formPage, setFormPage] = useState(1);
  const [heigaiOpen, setHeigaiOpen] = useState(initialHeigaiOpen ?? false);
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
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 pt-3 pb-1 text-caption font-en font-medium text-neutral-800 pointer-events-none">
        <span>9:41</span><span className="flex items-center gap-1"><span>5G</span><span>100%</span></span>
      </div>
      <div ref={bindScroll} className="flex-1 overflow-y-auto no-sb">
        {/* ---- ヒーロー（ステータスバー含む、背景画像でスクロール） ---- */}
        {/* ---- ヒーロー: img で自然な高さ、コンテンツを絶対配置でオーバーレイ ---- */}
        <div ref={heroRef} style={{ position: 'relative', height: '620px', overflow: 'hidden' }}>
          <img ref={heroBgRef} src="/assets/theo-tdf/hero_bg.png" alt="" style={{ width: '100%', display: 'block', willChange: 'transform', transformOrigin: 'top center' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
          {/* フェイクステータスバー（プレースホルダー：Phone側は非表示、固定オーバーレイを上に描画） */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1 text-caption font-en font-medium text-transparent" aria-hidden="true">
            <span>9:41</span>
            <span className="flex items-center gap-1"><span>5G</span><span>100%</span></span>
          </div>
          {/* インラインAppBar - スクロール後にsolid化 */}
          <div className="sticky top-0 z-20 transition-colors duration-200"
               style={solid ? HEADER_GRAD_APPBAR : { background: 'transparent' }}>
            <div className="flex items-center justify-between px-3 h-14">
              <span className="w-10 shrink-0" />
              <div className={`flex items-center gap-2 min-w-0 transition-opacity duration-200 ${solid ? "opacity-100" : "opacity-0"}`}>
                <span className="font-en font-semibold tracking-[0.1em] text-h6 text-white">XXX</span>
                <span className="text-h6 font-medium truncate text-white">くみこみ安心ほけん</span>
              </div>
              <span className="w-10 shrink-0" />
            </div>
          </div>
          {/* ロゴ：絶対配置（上左・ステータスバー直下） */}
          <img src="/assets/theo-tdf/dammy_logo_white.svg" alt="くみこみ安心ほけん"
            style={{ position: 'absolute', top: '48px', left: '18px', height: '1.52rem' }} />
          {/* テキスト：絶対配置 */}
          <div style={{ position: 'absolute', top: '440px', left: '20px', right: '20px' }}>
            <p className="font-en text-caption tracking-[0.18em] uppercase" style={{ marginLeft: '4px', color: '#fff' }}>Embedded Insurance</p>
            <h1 className="mt-1 font-bold leading-snug" style={{ fontSize: "31px", lineHeight: 1.3, marginLeft: '-2px', color: '#fff' }}>つみたてながら、<br/>もしもに備える。</h1>
            <p className="mt-2 text-h7 leading-relaxed" style={{ color: '#fff' }}>将来に向けた資産形成のためのほけん</p>
          </div>
          </div>{/* /absolute overlay */}
          {/* 逆角丸：heroの下側を角丸に見せる白いノッチ */}
          <img src="/assets/theo-tdf/hero-notch.svg" alt="" aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: -1, width: '100%', display: 'block', pointerEvents: 'none' }} />
        </div>{/* /relative img wrapper */}

        {/* ステッパー直上：hero高さで確定するためスペーサーは不要 */}
        {/* progress — sticks to top once the blue hero scrolls out of view */}
        <div>
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
                <div className="inline-flex items-center px-4 py-2 rounded-full font-bold text-white" style={{ backgroundColor: '#1aa5dc', fontSize: '0.82rem' }}>
                  XXX のお客様限定
                </div>
              </div>
              <div className="mt-4 flex flex-col items-center gap-4">
                <img src="/assets/theo-tdf/dammy_logo_cyan.svg" alt="くみこみ安心ほけん" className="h-[42px]" />
                <div className="w-full grid grid-cols-3 gap-3">
                {[
                  { svg: <img src="/assets/theo-tdf/activity-heart-circle.svg" alt="積立もあんしんに" className="w-12 h-12" />, t: "積立も\nあんしんに" },
                  { svg: <img src="/assets/theo-tdf/graduation-cap.svg" alt="学資保険の代わりにも" className="w-12 h-12" />, t: "学資保険\nの代わりにも" },
                  { svg: <img src="/assets/theo-tdf/hand-holding-heart.svg" alt="もしもの備えに" className="w-12 h-12" />, t: "もしもの\n備えに" },
                ].map((f, k) => (
                  <div key={k} className="flex flex-col items-center text-center gap-2">
                    <div className="text-primary" style={{width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#065FE3'}}>{f.svg}</div>
                    <p className="text-caption font-bold text-neutral-700 leading-snug whitespace-pre-line">{f.t}</p>
                  </div>
                ))}
                </div>
              </div>
              <div className="mt-6 overflow-hidden rounded-[16px] border border-warm-200">
                <img src="/assets/theo-tdf/chart_savings.png" alt="就業不能時も将来の積立金額を保障するイメージ図" className="w-full block" />
              </div>

              {/* 商品概要（図版の下） */}
              <div className="mt-6 space-y-6 mb-0">
                <div className="text-left">
                  <a className="inline-flex items-start gap-1.5 font-bold text-h7 cursor-pointer underline-offset-2 hover:underline" style={{ color: "var(--color-link)", fontSize: "14px" }}>
                    <img src="/assets/theo-tdf/info-circle.svg" alt="" className="w-3.5 h-3.5" style={{ paddingTop: '4px' }} />
                    詳細なサービス内容はこちら
                  </a>
                </div>
                <div className="text-left">
                  <span className="inline-block text-h6 font-bold text-neutral-800 py-0.5 rounded">保障期間</span>
                  <p className="mt-2 text-h7 text-neutral-700">5年〜40年（最大）</p>
                  <p className="mt-1 text-caption text-neutral-500 leading-relaxed">*保険期間は契約日（更新日）から1年であり、保障期間満了まで1年ごとの更新となります。</p>
                </div>
                <div className="text-left">
                  <button onClick={() => setHeigaiOpen(true)} className="inline-flex items-start gap-1.5 font-bold text-h7 cursor-pointer underline-offset-2 hover:underline text-left" style={{ color: "var(--color-link)", fontSize: "14px" }}>
                    <img src="/assets/theo-tdf/info-circle.svg" alt="" className="w-3.5 h-3.5" style={{ paddingTop: '4px' }} />
                    ご案内にあたりご確認・同意いただきたいこと
                  </button>
                </div>
              </div>
            </div>

            {/* ▼ 誘導ブロック: フルブリードのブルー帯 — CTAと地続きにして同一グループと認識させる */}
            <div className="-mx-4 mt-8 bg-primary-10 px-5 pt-10 pb-[18px]">
              <div className="mb-12">
                <div className="text-center">
                  <span className="inline-block text-h3 font-bold text-neutral-900 px-2 py-[2px] rounded">必要書類</span>
                  <p className="mt-2 text-h6 text-neutral-500">お手続きの際に必要となる書類を<br/>ご準備ください</p>
                </div>
                <div className="mt-2 flex flex-col items-center gap-1 px-4">
                  <Ic.cardArt className="w-20 h-auto text-primary-500" />
                  <span className="text-[14px] font-medium text-neutral-600">ご本人名義のクレジットカード</span>
                </div>
              </div>
              <div className="border-t border-primary-100 mb-[45px]"></div>
              <div className="text-center mb-6">
                <h2 className="text-h3 font-bold text-neutral-900 leading-snug text-balance">5つのプランから選ぶだけ</h2>
                <p className="mt-2 text-h6 text-neutral-500 leading-relaxed text-balance">最短10分で、お申し込みが完了します。</p>
              </div>
              <div>
                <div className="flex flex-col items-center text-center gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-caption font-bold shadow-sm" style={{ color: "var(--color-emphasis)" }}><Ic.check className="w-4 h-4" />いつでも見直し・解約OK</span>
                </div>
              </div>
              <div className="mt-8 flex flex-col items-center gap-[2px]">
                <p className="text-caption font-bold text-primary-500">まずはプランを選んでみましょう</p>
                <Ic.chevD className="w-6 h-6 text-primary-500 animate-bounce" />
              </div>
            </div>

          </div>
        </div>
      </div>

      <HeigaiModal open={heigaiOpen} onClose={() => setHeigaiOpen(false)} onAgree={() => setHeigaiOpen(false)} />
      <ActionBar bg={atBottom ? "#E9F2FE" : undefined}>
        <div style={{ marginBottom: '8px' }}>
          <p style={{ fontSize: '12px', lineHeight: '1.2', color: '#9ca3af' }} className="font-mono tracking-[0.14em] uppercase">保険名称</p>
          <p style={{ fontSize: '12px', lineHeight: '1.2' }} className="text-neutral-700">無配当特定疾病障害介護保障保険（団体型）</p>
        </div>
        <Btn kind="cta" onClick={() => go(1)}>プランを選ぶ<Ic.chevR className="w-4 h-4" /></Btn>
      </ActionBar>
    </>
  );
}

export function NoticeUl({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-caption text-neutral-600 leading-relaxed">
      {items.map((t: string, i: number) => (
        <li key={i} className="flex gap-2"><span className="text-neutral-400 shrink-0">・</span><span>{t}</span></li>
      ))}
    </ul>
  );
}

/* 重要事項・事前同意事項モーダルの本文（プラン選択／TOP統合案で共通） */
export function NoticeContent() {
  const sections = [
    {
      head: "この保険について",
      items: [
        "この保険は、●●を保険契約者（加入勧奨者）とし、保険契約者の総合取引口座にて投資信託の毎月同額つみたて契約の利用者を被保険者とする団体保険です。",
        "保険期間中に被保険者が所定の状態に該当した場合、または死亡した場合、給付金等が支払われます。給付金額は、保険対象積立金額（毎月の積立金額×12）に基づき計算され、加入時の保険対象積立金額が基準となります。なお、保険料は毎年更新されます。",
      ],
    },
    {
      head: "保障内容および給付について",
      items: [
        "がん給付金は、加入者ごとの責任開始日から、その日を含めて91日目より保障を開始します。責任開始日から一定期間は保障がありませんのでご注意ください。",
        "被保険者が所定の状態に該当し給付金等をお支払いした場合、その後、別の所定の状態に該当しても給付金等のお支払いはありません。",
        "つみたてシミュレーションにおける目標金額や運用利益は保証されません。また、運用による損失を補填するものではありません。",
      ],
    },
    {
      head: "お申込みにあたっての注意事項",
      items: [
        "お申込・告知内容は、必ず被保険者ご本人様がご入力ください。",
        "お申込みは、日本国内に在住し、ご自身で日本語の契約内容を理解できることが条件です。死亡保険金受取人についても同様の条件となります。",
        "ご加入の成立には審査があります。審査の結果、ご加入をお引き受けできない場合があります。",
        "ご加入には健康告知が必要です。告知事項に該当する場合は、お申込みいただけません。",
        "保険金受取人は、被保険者から見た続柄が「配偶者および2親等内の血族」まで指定できます。内縁、婚約者、同性パートナー等、法律上の血縁関係にない方は指定できません。",
        "この保険には解約払戻金はありません。",
        "この保険はクーリング・オフ制度の対象外です。",
        "投信口座の解約や積立投資の中止をされた場合、保険契約は解約いただくか、更新できませんのでご注意ください。また、保険証券を請求する権利および保険契約を解約する権利は、原則として●●が有します。",
      ],
    },
    {
      head: "保障開始および更新について",
      items: [
        "この契約は、申込み日の翌々月の1日（午前0時）より保障が開始されます。",
        "満期日までにご加入者から更新しない旨のお申出がない場合、団体の取り決めにより、原則として自動更新されます。",
      ],
    },
    {
      head: "電子交付の承諾について",
      items: [
        "当社は、保険業法施行規則第234条第4項に基づき、同条第1項第8号および第9号に定める書面に代えて、当該書面に記載すべき事項を電磁的方法により提供します。",
        "お客様には、当社Webサイト上で内容をご確認いただき、電磁的方法による提供にご同意いただきます。",
        "提供された内容は、お申込み手続完了後も、当社ホームページまたはマイページ等で閲覧・ダウンロードできます。",
        "電磁的方法による提供に同意されない場合は、お問合せフォームよりご連絡ください。",
      ],
    },
    {
      head: "個人情報のお取り扱いについて",
      items: [
        "保険契約者（団体）は、加入対象者（被保険者）の個人情報（氏名、性別、生年月日、健康状態等）を、本保険の引受け、維持・管理、保険金・給付金のお支払い、その他保険に関連する業務のために利用し、引受保険会社へ提供します。",
        "個人情報に変更が生じた場合も、同様に取り扱います。",
        "保健医療等の機微（センシティブ）情報は、保険業法その他関係法令に基づき、適切に取り扱います。",
        "個人番号および特定個人情報は、法令で定められた目的のみに利用します。その範囲を超えて利用または第三者提供は行いません。",
      ],
      bulletLinks: [
        { text: "個人情報の開示、訂正、利用停止等のお申し出、その他のお問い合わせは、以下よりご連絡ください。", url: "https://is.tdf-life.co.jp/www7/kumikomi_hoken/form1-entry.php" },
        { text: "最新の内容は、T&Dフィナンシャル生命ホームページにてご確認ください。", url: "https://www.tdf-life.co.jp" },
      ],
    },
  ] as { head: string; items: string[]; bulletLinks?: { text: string; url: string }[] }[];
  return (
    <div className="space-y-6">
      {sections.map((sec, si) => (
        <section key={si} className="space-y-2">
          <p className="text-caption font-bold text-neutral-800 leading-snug">{sec.head}</p>
          <ul className="space-y-2 text-caption text-neutral-600 leading-relaxed">
            {sec.items.map((t, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="text-neutral-400 shrink-0">・</span>
                <span>{t}</span>
              </li>
            ))}
            {sec.bulletLinks && sec.bulletLinks.map((item, i) => (
              <li key={`bl${i}`} className="flex gap-1.5">
                <span className="text-neutral-400 shrink-0">・</span>
                <span>
                  <span>{item.text}</span><br/>
                  <a href={item.url} target="_blank" rel="noreferrer" className="break-all underline text-caption" style={{ color: 'var(--color-link)' }}>{item.url}</a>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function ScreenStep2({ go, sel, setSel, deathOpt = true, m, setM, y, setY, initialNoticeOpen, initialAgree, initialSimOpen, initialShowSend, initialTipIdx, initialBirth, emailVerified, simFirst, planCardStyle = "card", initialPlanOpenId }: { go: Go; sel: string; setSel: React.Dispatch<React.SetStateAction<string>>; deathOpt?: boolean; m: number; setM: React.Dispatch<React.SetStateAction<number>>; y: number; setY: React.Dispatch<React.SetStateAction<number>>; initialNoticeOpen?: boolean; initialAgree?: boolean; initialSimOpen?: boolean; initialShowSend?: boolean; initialTipIdx?: number; initialBirth?: string; emailVerified?: boolean; simFirst?: boolean; planCardStyle?: string; initialPlanOpenId?: string }) {
  const plan = PLANS.find((p) => p.id === planIdFromSel(sel)) || PLANS[0];
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
            <div style={{ width: "100%" }} className="space-y-6">
              <div>
                <h3 className="text-h6 font-medium text-neutral-800 leading-snug">生年月日・性別</h3>
                <p className="text-caption text-neutral-500 mt-1">お客様情報。保険料の算出に使用します。</p>
              </div>
              <div style={{ width: "100%" }} className="flex flex-col gap-2">
                <span className="text-caption font-medium text-neutral-600">生年月日<ReqBadge /></span>
                <button type="button" onClick={() => setPickerOpen(true)} style={{ width: "100%" }}
                  className={`fld flex items-center justify-between gap-2 h-12 rounded-lg border border-warm-300 bg-white px-3 text-h6 text-left ${birth ? "text-neutral-800" : "text-neutral-400"}`}>
                  <span className="truncate">{birth ? fmtBirth(birth) : "選択してください"}</span>
                  <img src="/assets/theo-tdf/calendar.svg" alt="" className="w-6 h-6 shrink-0" />
                </button>
              </div>
              <div style={{ width: "100%" }} className="flex flex-col gap-2">
                <span className="text-caption font-medium text-neutral-600">性別<ReqBadge /></span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", width: "100%" }}>
                  {["男性", "女性"].map((g) => (
                    <button key={g} onClick={() => setGender(g)}
                      className={`h-12 rounded-lg border text-h6 transition-colors ${gender === g ? "border-primary bg-primary-10 text-primary-700 font-bold" : "border-warm-300 bg-white text-neutral-600"}`}>{g}</button>
                  ))}
                </div>
              </div>
            </div>
  );
  return (
    <>
      <AppBar title="保険" onBack={() => go(0)} />
      <div ref={bindScroll} className="flex-1 overflow-y-auto no-sb">
        <div>
          <Steps n={2} go={go} />
        </div>
        <div className="px-6 pt-6 pb-12 space-y-6" style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #F2FBFE 100%)" }}>
          {/* ---- お客様情報（生年月日・性別） ---- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-caption text-primary-700 px-1">
              <Ic.shield className="w-4 h-4 shrink-0" />XXX 口座情報の一部を自動入力しています。
            </div>
            {birthGenderFields}
          </div>

          {/* ---- プラン選択 ---- */}
          <div>
          <StepSection label="プランを選ぶ" n={1} big>
          <div>
            <p className="text-caption text-neutral-500">ご希望の保障プランをご選択ください</p>
          </div>
          <div className="flex flex-col" style={{ gap: '16px' }}>
            {PLANS.map((p) => (
              <button key={p.id} onClick={() => setSel(p.id)} className={`w-full text-left rounded-2xl border bg-white overflow-hidden transition ${sel === p.id ? "border-primary ring-2 ring-primary/30" : "border-warm-200"}`}>
                <div className={`flex items-center justify-between gap-3 px-4 py-3 border-b transition-colors ${sel === p.id ? "bg-primary-10 border-primary-100" : "bg-warm-50 border-warm-200"}`}>
                  <div className="flex items-center gap-2">
                    <span className={`grid place-items-center w-5 h-5 rounded-full border-2 ${sel === p.id ? "border-primary bg-primary text-white" : "border-warm-300"}`}>
                      {sel === p.id && <Ic.check className="w-3 h-3" />}
                    </span>
                    <span className="text-h6 font-bold text-neutral-800">{p.name}</span>
                  </div>
                  {p.tag && <Badge tone="secondary">{p.tag}</Badge>}
                </div>
                <div className="p-4">
                  <p className="text-caption text-neutral-500">{p.lead}</p>
                  <div className="mt-3 flex items-baseline justify-end gap-1 text-neutral-800">
                    <span className="font-en text-h4 font-semibold tabular-nums">{p.price.replace("¥", "")}</span><span className="text-caption"> 円 / 月</span>
                  </div>
                  <ul className="mt-3 space-y-1.5 border-t border-warm-200 pt-3">
                    {p.feat.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-caption text-neutral-600">
                        <Ic.check className="w-3.5 h-3.5 text-primary shrink-0" />{f.replace(/¥([\d,]+)/g, "$1 円")}
                      </li>
                    ))}
                  </ul>
                </div>
              </button>
            ))}
          </div>
          <p className="text-caption text-neutral-500 leading-relaxed px-1">
            ※ 保険料は年齢・性別により変動します。
          </p>
        </StepSection>
        </div>

        {/* ---- 保険料シミュレーション ---- */}
        <div className="-mx-6 px-6 py-6 relative" style={{ background: "var(--warm-100)" }}>
        <StepSection label="保険料シミュレーション" n={2} big className="mt-8">
          <Simulator m={m} setM={setM} y={y} setY={setY} initialSimOpen={initialSimOpen} planName={sel ? PLANS.find((p) => p.id === sel)?.name : null} plan={PLANS.find((p) => p.id === sel)} startAge={ageFromBirth(birth)} />
        </StepSection>
        </div>

        {/* ---- 申し込みをする（2ステップ） ---- */}
        <div className="-mx-6 px-6 py-6" style={{ background: "#e7edf7" }}>
        <StepSection label="申し込みをする" n={3} big className="mt-8">
          {/* STEP 1 — メールアドレスのご入力 */}
          <div className="rounded-2xl border border-warm-200 bg-white p-6 space-y-4">
            <h3 className="text-h6 font-bold text-neutral-800">メールアドレスのご入力</h3>
            <p className="text-caption text-neutral-600 leading-relaxed">
              ご入力されたメールアドレス宛にPINコード送信とご案内URLをお送りします。メールアドレスをご入力ください。
            </p>
            <Field label="メールアドレス" placeholder="samplename@sample.co.jp" required />
          </div>

          {/* STEP 2 — 事前同意事項のご確認 */}
          <div ref={sendSecRef} className="rounded-2xl border border-warm-200 bg-white p-6 space-y-4">
            <h3 className="text-h6 font-bold text-neutral-800">事前同意事項のご確認</h3>
            <p className="text-caption text-neutral-600 leading-relaxed">お申し込み前に、下記より重要事項・事前同意事項を必ずご確認ください。</p>
            <button onClick={() => setNoticeOpen(true)}
              className="flex items-center justify-between w-full rounded-xl border-2 border-[color:var(--secondary-color-200)] bg-[color:var(--secondary-color-10)] px-4 py-4 text-left transition hover:border-[color:var(--secondary-color-300)]">
              <span className="flex items-center gap-3 min-w-0">
                <span className="rounded-full bg-[color:var(--secondary-color-600)] text-white px-2 py-[2px] text-[11px] font-bold leading-none shrink-0">重要</span>
                <span className="text-h6 font-bold text-neutral-800">重要事項・事前同意事項を確認する</span>
              </span>
              <Ic.chevR className="w-6 h-6 text-[color:var(--secondary-color-600)] shrink-0" />
            </button>
            <div className={`flex items-start gap-3 w-full text-left pt-1 transition-opacity ${agree ? "" : "opacity-40 pointer-events-none"}`}>
              <span className={`grid place-items-center w-6 h-6 mt-[2px] rounded border-2 shrink-0 ${agree ? "border-primary bg-primary text-white" : "border-warm-300 bg-white"}`}>
                {agree && <Ic.check className="w-3 h-3" />}
              </span>
              <span className="text-caption text-neutral-700 leading-relaxed">上記の事前同意事項を確認し、同意します</span>
            </div>
          </div>
        </StepSection>
        </div>
        </div>
      </div>

      <ActionBar bg={showSend ? "#e7edf7" : undefined}>
        <div className="flex items-start gap-2 px-1 text-caption text-neutral-600 leading-relaxed">
          <Ic.doc className="w-4 h-4 mt-[2px] text-neutral-400 shrink-0" />
          申込みには、ご本人様名義のクレジットカードが必要です
        </div>
        {emailVerified && showSend && (
          <div className="fade-in flex items-center gap-2 rounded-xl bg-primary-10 border border-primary-100 px-4 py-3">
            <Ic.check className="w-4 h-4 text-primary-600 shrink-0" />
            <span className="text-caption text-primary-700">メールアドレスの認証は完了しています</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <button onClick={() => go(0)} className="text-caption font-medium shrink-0 px-1" style={{ color: 'var(--color-link)' }}>← 戻る</button>
          {showSend && (
            <div className="flex-1">
              <Btn kind="cta" onClick={() => emailVerified ? go(3) : go(2)} disabled={!agree}>
                {emailVerified ? <>申込フォームへ進む<Ic.chevR className="w-4 h-4" /></> : "PINコードを送信"}
              </Btn>
            </div>
          )}
        </div>
        {!agree && showSend && <p className="text-center text-caption text-neutral-400">同意いただくと送信できます</p>}
        {agree && (
          <div className="flex justify-end" style={{ marginTop: "24px", marginBottom: "16px" }}>
            <a href="https://faq-moneydesign.tdf-life.co.jp/" target="_blank" rel="noopener" className="inline-flex items-center gap-2 font-bold text-h6 cursor-pointer underline-offset-2 hover:underline" style={{ color: "var(--color-link)", fontSize: "14px" }}>
              <img src="/assets/theo-tdf/info-circle.svg" alt="" className="w-3.5 h-3.5" style={{ marginTop: '-2px' }} />
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
            <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-warm-200">
              <h3 className="flex items-center gap-2 text-h5 font-bold text-neutral-800">
                <span className="rounded-full bg-[color:var(--secondary-color-10)] text-[color:var(--secondary-color-700)] px-2 py-[2px] text-[11px] font-bold leading-none">重要</span>
                重要事項・事前同意事項
              </h3>
              <button onClick={() => setNoticeOpen(false)} className="grid place-items-center w-8 h-8 rounded-full bg-warm-100 text-neutral-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="px-6 py-4 overflow-y-auto no-sb space-y-6">
              <p className="text-caption text-neutral-500 leading-relaxed">
                お申込み前に、以下の内容を必ずご確認ください。
              </p>

              <div className="space-y-6">
                <p className="flex items-center gap-2 text-h6 font-bold text-neutral-800">
                  <span className="rounded-full bg-primary-10 text-primary-700 px-2 py-[2px] text-[11px] font-bold leading-none">事前同意</span>
                  事前同意事項
                </p>
                <NoticeContent />
              </div>
            </div>
            <div className="px-6 py-3 border-t border-warm-200">
              <Btn kind="button" onClick={() => { setAgree(true); setNoticeOpen(false); }}>確認同意しました</Btn>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export function ScreenPin({ go, onVerified, backScr = 1, initialPin }: { go: Go; onVerified?: () => void; backScr?: number; initialPin?: string }) {
  const [pin, setPin] = useState(initialPin ?? "");
  const [show, setShow] = useState(false);
  return (
    <>
      <AppBar title="保険" onBack={() => go(backScr)} />
      <div className="flex-1 overflow-y-auto no-sb">
        <Steps n={2} go={go} />
        <div className="px-6 pt-10 pb-[88px] flex flex-col items-center text-center" style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #F2FBFE 100%)" }}>
          <img src="/assets/theo-tdf/dammy_logo_cyan.svg" alt="くみこみ安心ほけん" className="h-8 mb-6" />
          <img src="/assets/theo-tdf/icon_lock.svg" alt="ロック" className="w-16 h-16 mb-6" />
          <h1 className="text-h3 font-bold text-neutral-800">PINコード認証</h1>
          <p className="mt-3 text-h6 text-neutral-600 leading-relaxed text-left">
            ご登録のメールアドレスに、認証用のPINコードをお送りしました。メールに記載のPINコードを入力してください。
          </p>

          <div className="mt-8 w-full max-w-[280px] relative">
            <input
              type={show ? "text" : "password"}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
              inputMode="numeric"
              placeholder=""
              autoComplete="one-time-code"
              className="fld w-full h-14 rounded-xl border border-warm-300 bg-white text-center font-en font-semibold text-h3 tracking-[0.2em] text-neutral-800 pr-12"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors p-1">
              {show
                ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>

          <button className="mt-4 text-caption underline underline-offset-2" style={{ color: 'var(--color-link)' }}>PINコードを再送する</button>
        </div>
      </div>
      <ActionBar>
        <p className="text-caption text-neutral-500 leading-relaxed px-1">
          本お手続きは「XXX くみこみ安心ほけん」のお申し込みです。<br/>
          <span className="text-[10px] text-neutral-400">引受保険会社：T&Dフィナンシャル生命保険株式会社</span>
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => go(backScr)} className="text-caption font-medium shrink-0 px-1" style={{ color: 'var(--color-link)' }}>← 戻る</button>
          <div style={{ width: '100%', maxWidth: '260px' }}>
            <Btn kind="cta" onClick={() => { if(onVerified) onVerified(); go(3); }} disabled={pin.length < 1}>認証する</Btn>
          </div>
        </div>
        {pin.length < 1 && <p className="text-center text-caption text-neutral-400">PINコードを入力してください</p>}
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

// divベースのカスタムスライダー（Figmaキャプチャ対応・ネイティブinput[range]の代替）
function DivSlider({ min, max, step, value, onChange }: {
  min: number; max: number; step: number; value: number;
  onChange: (val: number) => void;
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const pct = ((value - min) / (max - min)) * 100;
  const calc = (clientX: number) => {
    const rect = trackRef.current!.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = min + ratio * (max - min);
    const stepped = Math.round(raw / step) * step;
    onChange(Math.max(min, Math.min(max, stepped)));
  };
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    calc(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons & 1) calc(e.clientX);
  };
  return (
    <div ref={trackRef} className="relative w-full h-5 flex items-center cursor-pointer mt-2 select-none"
      onPointerDown={onPointerDown} onPointerMove={onPointerMove}>
      {/* トラック（背景） */}
      <div className="absolute inset-x-0 h-[6px] rounded-full bg-warm-200" />
      {/* フィル（進行部分） */}
      <div className="absolute left-0 h-[6px] rounded-full"
        style={{ width: `${pct}%`, backgroundColor: "var(--primary-color-500)" }} />
      {/* サム（つまみ） */}
      <div className="absolute w-[18px] h-[18px] rounded-full bg-white shadow-md border-2"
        style={{ left: `calc(${pct}% - 9px)`, borderColor: "var(--primary-color-500)" }} />
    </div>
  );
}

// Shared積立スライダー（Simulator と 申込フォームの修正シートで共用）
export function SimSliders({ m, setM, y, setY, onInput }: { m: number; setM: React.Dispatch<React.SetStateAction<number>>; y: number; setY: React.Dispatch<React.SetStateAction<number>>; onInput?: () => void }) {
  const yen = (v: number) => v.toLocaleString("ja-JP");
  const onM = (val: number) => { setM(val); onInput && onInput(); };
  const onY = (val: number) => { setY(val); onInput && onInput(); };
  // 数字直接入力（スライダーと連動。入力中は自由、blurで上下限・ステップにスナップ）
  const onMText = (e: React.ChangeEvent<HTMLInputElement>) => { const d = e.target.value.replace(/[^0-9]/g, ""); setM(d === "" ? 0 : +d); onInput && onInput(); };
  const onMBlur = () => { let v = Math.round((m || 0) / 1000) * 1000; v = Math.min(150000, Math.max(5000, v || 5000)); setM(v); };
  const onYText = (e: React.ChangeEvent<HTMLInputElement>) => { const d = e.target.value.replace(/[^0-9]/g, ""); setY(d === "" ? 0 : +d); onInput && onInput(); };
  const onYBlur = () => { const v = Math.min(30, Math.max(5, Math.round(y || 0) || 5)); setY(v); };
  return (
    <>
      <div className="mb-6">
        <div className="flex items-start justify-between gap-2">
          <span className="text-h6 font-medium text-neutral-800 leading-snug">毎月の積立金額<br/><span className="text-caption text-neutral-500">（ご希望給付額）</span></span>
          <span className="flex items-baseline gap-1 text-neutral-800">
            <input type="text" inputMode="numeric" value={yen(m)} onChange={onMText} onBlur={onMBlur} aria-label="毎月の積立金額"
              className="num-input text-h3 font-semibold text-primary-600 tabular-nums text-right" style={{ width: "5.5em", fontFamily: "var(--font-inter)" }} />
            <span className="text-caption"> 円</span>
          </span>
        </div>
        <DivSlider min={5000} max={150000} step={1000} value={m} onChange={onM} />
        <div className="flex justify-between font-mono text-[12px] text-neutral-400 mt-1">
          <span>5,000円</span><span>150,000円</span>
        </div>
      </div>

      <div className="mb-1">
        <div className="flex items-baseline justify-between">
          <span className="text-h6 font-medium text-neutral-800">保障期間</span>
          <span className="flex items-baseline gap-1 text-neutral-800">
            <input type="text" inputMode="numeric" value={y} onChange={onYText} onBlur={onYBlur} aria-label="保障期間"
              className="num-input text-h3 font-semibold text-primary-600 tabular-nums text-right" style={{ width: "2.4em", fontFamily: "var(--font-inter)" }} />
            <span className="text-caption"> 年</span>
          </span>
        </div>
        <DivSlider min={5} max={30} step={1} value={y} onChange={onY} />
        <div className="flex justify-between font-mono text-[12px] text-neutral-400 mt-1">
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
        <span className="text-caption font-medium text-primary-700">最大給付金額</span>
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
                  <th key={h} className="font-medium text-center px-3 py-2 whitespace-pre-line align-middle text-[14px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.n} className={`border-t border-warm-200 ${r.n === 0 ? "bg-primary-10/60 text-neutral-900" : "text-neutral-700"}`}>
                  <td className="px-3 py-2 whitespace-nowrap align-middle text-center">{r.n}年</td>
                  <td className="px-3 py-2 whitespace-nowrap align-middle text-center">{r.age}歳</td>
                  <td className="px-3 py-2 whitespace-nowrap align-middle text-right font-bold">{yen(r.premium)}円</td>
                  <td className="px-3 py-2 whitespace-nowrap align-middle text-right">{man(r.benefit)}万円</td>
                  <td className="px-3 py-2 whitespace-nowrap align-middle text-right">{man(r.cum)}万円</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-2 text-[12px] text-neutral-400 leading-relaxed">
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
    <div className="rounded-2xl border border-warm-200 bg-white p-6">
      <div className="flex flex-col gap-2 mb-6">
        {shouldShowLabel && (
          <span className="inline-flex flex-col rounded-lg bg-[#EFEFEF] px-3 py-2 leading-tight self-start">
            <span className="text-[14px] font-bold text-neutral-800">選択プラン</span>
            <span className="text-[14px] font-bold text-primary-600 mt-1">{planName}</span>
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
            <p key={i} className="flex items-start gap-2 text-caption font-bold leading-relaxed" style={{ color: 'var(--color-attention)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4 shrink-0 mt-[2px]" style={{ color: 'var(--color-attention)' }}><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01" strokeLinecap="round"/></svg>
              <span>{e}</span>
            </p>
          ))}
        </div>
      ) : (<>
      {/* 初年度保険料の表示（テーブルが閉じているときも常に表示） */}
      {plan && (
        <div className="mt-4 pt-4 border-t border-warm-200 flex items-center justify-between">
          <span className="text-caption font-medium text-neutral-500">初年度の月払保険料</span>
          <span className="text-primary-600">
            <span className="font-en text-h2 font-semibold tabular-nums">{(parseInt((plan.price||'0').replace(/[^0-9]/g,''),10)*1).toLocaleString('ja-JP')}</span>
            <span className="text-h6"> 円</span>
          </span>
        </div>
      )}
      <button onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full mt-3 pt-3 border-t border-warm-200 text-left">
        <span className="text-h6 font-bold text-neutral-800">保険料テーブルをみる</span>
        <span className={`grid place-items-center w-8 h-8 rounded-full bg-warm-100 text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`}>
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
export function ScreenForm({ go, sel, deathOpt = true, m, setM, y, setY, initialEditOpen, initialSheetRes, initialSame, backScr = 1, formSplit = false, errMode = 'none', onTerminate, kokuchiPattern = 'auto', initialFormPage = 1, initialDisclosureOpen, initialErrStep = 0, initialKokuchiAgreed }: { go: Go; sel: string; deathOpt?: boolean; m: number; setM: React.Dispatch<React.SetStateAction<number>>; y: number; setY: React.Dispatch<React.SetStateAction<number>>; initialEditOpen?: boolean; initialSheetRes?: boolean; initialSame?: boolean; backScr?: number; formSplit?: boolean; errMode?: string; onTerminate?: () => void; kokuchiPattern?: string; initialFormPage?: number; initialDisclosureOpen?: boolean; initialErrStep?: number; initialKokuchiAgreed?: boolean }) {
  const plan = PLANS.find((p) => p.id === planIdFromSel(sel)) || PLANS[0];
  // 告知項目パターン（Tweaks）が指定されていれば、そのプラン×死亡保障で告知モーダルを表示
  const kokuchiPat = KOKUCHI_PATTERNS.find((p: any) => p.key === kokuchiPattern);
  const modalPlan = kokuchiPat ? (PLANS.find((p) => p.id === kokuchiPat.plan) || plan) : plan;
  const modalDeath = kokuchiPat ? kokuchiPat.death : deathOpt;
  // 告知ボタン押下でモーダルを表示（ページ表示時は非表示）
  const [infoPlan, setInfoPlan] = useState<Plan | null>(initialDisclosureOpen ? (modalPlan ?? null) : null);
  const [kokuchiAgreed, setKokuchiAgreed] = useState(initialKokuchiAgreed ?? false);
  const [same, setSame] = useState(initialSame ?? true);
  const [editOpen, setEditOpen] = useState(initialEditOpen ?? false);
  const [sheetRes, setSheetRes] = useState(initialSheetRes ?? false);
  const yen = (v: number) => v.toLocaleString("ja-JP");
  const man = (v: number) => Math.round(v / 10000).toLocaleString("ja-JP");
  // 積立内容修正モーダル用バリデーション（シミュレーション画面と同ロジック）
  const formStartAge = ageFromBirth("1990-01-01"); // 契約者生年月日
  const editErrors = simErrors(m, y, formStartAge);

  // ===== 入力エラー表示デモ =====================================
  // 「確認する」を押した時点で必須項目が未入力だった想定。errMode（Tweaks）で表示方法を切替。
  const showErr = errMode && errMode !== 'none';
  const scrollerRef = useRef<any>(null);
  const fieldRefs = useRef<Record<string, any>>({});
  const setFieldRef = (id: string) => (el: any) => { if (el) fieldRefs.current[id] = el; };
  const [errStep, setErrStep] = useState(initialErrStep);
  // どのページに出るか（2ページ分割時のフィルタ用）
  const ERR_DEFS = [
    { id: 'tel',       page: 1, label: '契約者 電話番号', msg: '電話番号を入力してください' },
    { id: 'benBirth',  page: 2, label: '受取人 生年月日', msg: '生年月日を選択してください' },
    { id: 'benGender', page: 2, label: '受取人 性別',     msg: '性別を選択してください' },
    { id: 'rel',       page: 2, label: '受取人 続柄',     msg: '続柄を選択してください' },
  ];
  const errMap: Record<string, string> = showErr ? Object.fromEntries(ERR_DEFS.map((e) => [e.id, e.msg])) : {};
  const scrollToField = (id: string) => {
    const c = scrollerRef.current, el = fieldRefs.current[id];
    if (!c || !el) return;
    const top = c.scrollTop + (el.getBoundingClientRect().top - c.getBoundingClientRect().top) - 20;
    c.scrollTo({ top, behavior: 'smooth' });
  };
  const jumpNext = (list: typeof ERR_DEFS) => {
    if (!list.length) return;
    scrollToField(list[errStep % list.length].id);
    setErrStep((s) => s + 1);
  };

  // 契約者住所（受取人「契約者と同じ」でコピーされる値。初期値はTHEO口座から自動入力）
  const [holder, setHolder] = useState({ zip: "100-0001", pref: "東京都", city: "千代田区", town: "丸の内１丁目", addr: "1-1", bldg: "丸の内ビル 10F" });
  const setH = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setHolder((h: any) => ({ ...h, [k]: e.target.value }));

  // 保険金受取人 生年月日・性別
  const [benBirth, setBenBirth] = useState("");
  const [benGender, setBenGender] = useState("");
  const [benPickerOpen, setBenPickerOpen] = useState(false);
  // エラーデモ用：契約者電話番号・受取人続柄（入力で解消できるよう state 化）
  const [tel, setTel] = useState("");
  const [rel, setRel] = useState("");

  // ページ下部到達で CTA ブロックを薄ブルーに
  const [atBottom, setAtBottom] = useState(false);
  const [formPage, setFormPage] = useState(initialFormPage ?? 1);
  const bindScroll = (el: any) => {
    if (!el) return;
    scrollerRef.current = el;
    if (el.__bound) return;
    el.__bound = true;
    el.addEventListener("scroll", () => {
      setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 48);
    }, { passive: true });
  };

  const onBack = formSplit && formPage === 2 ? () => setFormPage(1) : () => go(backScr);
  // 現在の未入力状態（入力されると解消）
  const errState: Record<string, boolean> = showErr ? { tel: !tel, benBirth: !benBirth, benGender: !benGender, rel: !rel } : {};
  const errOf = (id: string) => (errState[id] ? errMap[id] : undefined);
  // 現在のページに表示中で、かつ未入力のエラー項目
  const visibleErrs = showErr ? ERR_DEFS.filter((e) => errState[e.id] && (!formSplit || e.page === formPage)) : [];

  return (
    <>
      <AppBar title={formSplit && formPage === 2 ? "お申込み (2/2)" : "お申込み"} onBack={onBack} />
      <div key={formPage} ref={bindScroll} className="flex-1 overflow-y-auto no-sb px-4 pt-6 pb-[72px] space-y-6" style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #F2FBFE 100%)" }}>
        <div className="-mx-4 -mt-6"><Steps n={3} go={go} /></div>

        {/* ② 上部サマリー：クリックで該当入力へスクロール */}
        {errMode === 'top' && visibleErrs.length > 0 && (
          <div className="rounded-xl border-2 px-4 py-4 fade-in" style={{ borderColor: 'var(--color-attention)', background: '#FFF5F5' }}>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0" style={{ color: 'var(--color-attention)' }}><path d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12C1.25 6.072 6.072 1.25 12 1.25C17.928 1.25 22.75 6.072 22.75 12C22.75 17.928 17.928 22.75 12 22.75ZM12 2.75C6.899 2.75 2.75 6.899 2.75 12C2.75 17.101 6.899 21.25 12 21.25C17.101 21.25 21.25 17.101 21.25 12C21.25 6.899 17.101 2.75 12 2.75ZM12.75 16.5V11.929C12.75 11.515 12.414 11.179 12 11.179C11.586 11.179 11.25 11.515 11.25 11.929V16.5C11.25 16.914 11.586 17.25 12 17.25C12.414 17.25 12.75 16.914 12.75 16.5ZM13.02 8.5C13.02 7.948 12.573 7.5 12.02 7.5H12.01C11.458 7.5 11.0149 7.948 11.0149 8.5C11.0149 9.052 11.468 9.5 12.02 9.5C12.572 9.5 13.02 9.052 13.02 8.5Z"/></svg>
              <p className="text-h6 font-bold" style={{ color: 'var(--color-attention)' }}>{visibleErrs.length}件の未入力項目があります</p>
            </div>
            <ul className="mt-3 space-y-2">
              {visibleErrs.map((e) => (
                <li key={e.id}>
                  <button onClick={() => scrollToField(e.id)}
                    className="flex items-center gap-2 text-caption font-medium text-left underline underline-offset-2 decoration-from-font"
                    style={{ color: 'var(--color-attention)' }}>
                    <Ic.chevR className="w-4 h-4 shrink-0" />
                    <span>{e.label}：{e.msg}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(!formSplit || formPage === 1) && (<>
        <h2 className="text-h5 font-bold text-center" style={{ color: '#1AA5DC', marginTop: '32px', marginBottom: '32px' }}>加入手続き</h2>

        {/* 告知をする */}
        <div className="rounded-2xl border border-warm-200 bg-[#EFEFEF] p-6 space-y-3 mb-6">
          <h3 className="text-h6 font-bold text-neutral-800">告知をする</h3>
          <p className="text-caption text-neutral-600 leading-relaxed">お申し込みにあたり、現在の健康状態などについてご告知いただく必要があります。下記ボタンより告知事項をご確認ください。</p>
          <button onClick={() => { setInfoPlan(modalPlan); setKokuchiAgreed(true); }}
            className="flex items-center justify-between w-full rounded-xl border-2 border-[color:var(--secondary-color-200)] bg-[color:var(--secondary-color-10)] px-4 py-4 text-left transition hover:border-[color:var(--secondary-color-300)]">
            <span className="flex items-center gap-3 min-w-0">
              <span className="rounded-full bg-[color:var(--secondary-color-600)] text-white px-2 py-[2px] text-[11px] font-bold leading-none shrink-0">告知</span>
              <span className="text-h6 font-bold text-neutral-800">告知事項を確認する</span>
            </span>
            <Ic.chevR className="w-6 h-6 text-[color:var(--secondary-color-600)] shrink-0" />
          </button>
          <div className="flex items-start gap-3 w-full text-left pt-1 cursor-pointer"
            onClick={() => setKokuchiAgreed((a) => !a)}>
            <span className={`grid place-items-center w-5 h-5 mt-0.5 rounded border-2 shrink-0 ${kokuchiAgreed ? "border-primary bg-primary text-white" : "border-warm-300 bg-white"}`}>
              {kokuchiAgreed && <Ic.check className="w-3 h-3" />}
            </span>
            <span className="text-caption text-neutral-700 leading-relaxed">上記の事前同意事項を確認し、同意します</span>
          </div>
        </div>

        <div className="px-1 flex items-center gap-2 text-caption text-primary-700">
          <Ic.shield className="w-4 h-4 shrink-0" />XXX 口座情報の一部を自動入力しています。
        </div>

        {/* 契約者情報グループ */}
        <GroupCard title="契約者情報" sub="ご契約者ご本人さまの情報" iconSrc="/assets/theo-tdf/person-heart.svg" className="-mt-6">
          <div className="px-1 -mt-5 flex items-center gap-2 text-caption text-primary-700">
            <Ic.shield className="w-4 h-4 shrink-0" />XXX 口座情報の一部を自動入力しています。
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-6">
            <Field label="姓" placeholder="山田" required />
            <Field label="名" placeholder="太郎" required />
            <Field label="セイ" placeholder="ヤマダ" required />
            <Field label="メイ" placeholder="タロウ" required />
          </div>
          <LockedField label="生年月日" value="1990 / 01 / 01" />
          <LockedField label="性別" value="男性" />

          <Field label="郵便番号" placeholder="100-0001" required hint="郵便番号から住所を自動入力します" value={holder.zip} onChange={setH("zip")} />
          <Select label="都道府県" required value={holder.pref} options={PREFS} hint="郵便番号で自動入力" onChange={setH("pref")} />
          <Field label="市区町村" placeholder="千代田区" required hint="郵便番号で自動入力" value={holder.city} onChange={setH("city")} />
          <Field label="町名" placeholder="丸の内１丁目" required value={holder.town} onChange={setH("town")} />
          <Field label="番地など" placeholder="1丁目1番地1号" required value={holder.addr} onChange={setH("addr")} />
          <Field label="建物名／部屋番号" placeholder="〇〇ビル 101号室" value={holder.bldg} onChange={setH("bldg")} />
          <Field label="電話番号" placeholder="090-0000-0000" required value={tel} onChange={(e) => setTel(e.target.value)} error={errOf('tel')} errMode={errMode} anchorRef={setFieldRef('tel')} />
        </GroupCard>

        {/* 団体特定コード（パターンB：分割時は契約者情報の後） */}
        {formSplit && (
        <GroupCard title="団体特定コード" icon={Ic.tag}>
          <Field label="団体特定コード" placeholder="1234567891234567" />
          <span className="text-caption text-neutral-400">任意コード：0000000000000000<br/>団体からご案内のコードを入力してください</span>
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
          <div className="grid grid-cols-2 gap-x-3 gap-y-6">
            <Field label="姓" placeholder="山田" required />
            <Field label="名" placeholder="花子" required />
            <Field label="セイ" placeholder="ヤマダ" required />
            <Field label="メイ" placeholder="ハナコ" required />
          </div>

          {/* 受取人 生年月日・性別 */}
          <div ref={setFieldRef('benBirth')} className="flex flex-col gap-2">
            <span className="text-caption font-medium text-neutral-600">生年月日<ReqBadge /></span>
            <button type="button" onClick={() => setBenPickerOpen(true)}
              style={errState.benBirth ? errInputStyle : undefined}
              className={`fld flex items-center justify-between gap-2 h-12 rounded-lg border px-3 text-h6 text-left ${errState.benBirth ? "border-[color:var(--color-attention)]" : "border-warm-300 bg-white"} ${benBirth ? "text-neutral-800" : "text-neutral-400"}`}>
              <span className="truncate">{benBirth ? fmtBirth(benBirth) : "選択してください"}</span>
              <img src="/assets/theo-tdf/calendar.svg" alt="" className="w-6 h-6 shrink-0" />
            </button>
            {errMode === 'inline' && errState.benBirth && <ErrText>{errMap.benBirth}</ErrText>}
          </div>
          <div ref={setFieldRef('benGender')} className="flex flex-col gap-2">
            <span className="text-caption font-medium text-neutral-600">性別<ReqBadge /></span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {["男性", "女性"].map((g) => (
                <button key={g} onClick={() => setBenGender(g)}
                  style={errState.benGender ? errInputStyle : undefined}
                  className={`h-12 rounded-lg border text-h6 transition-colors ${benGender === g ? "border-primary bg-primary-10 text-primary-700 font-bold" : errState.benGender ? "border-[color:var(--color-attention)] text-neutral-600" : "border-warm-300 bg-white text-neutral-600"}`}>{g}</button>
              ))}
            </div>
            {errMode === 'inline' && errState.benGender && <ErrText>{errMap.benGender}</ErrText>}
          </div>

          <button onClick={() => setSame((s) => !s)} className="flex items-center gap-3 w-full text-left pt-1">
            <span className={`grid place-items-center w-6 h-6 rounded border-2 shrink-0 ${same ? "border-primary bg-primary text-white" : "border-warm-300 bg-white"}`}>
              {same && <Ic.check className="w-3 h-3" />}
            </span>
            <span className="text-caption text-neutral-700">住所は契約者と同じ</span>
          </button>

          {!same && (
          <div className="space-y-6">
            <Field label="郵便番号" placeholder="100-0001" />
            <Select label="都道府県" value="都道府県を選択" options={PREFS} />
            <Field label="市区町村" placeholder="千代田区" />
            <Field label="町名" placeholder="丸の内１丁目" />
            <Field label="番地など" placeholder="1丁目1番地1号" />
            <Field label="建物名／部屋番号" placeholder="〇〇ビル 101号室" />
          </div>
          )}

          <Select label="続柄" required value={rel || "続柄を選択"} onChange={(e) => setRel(e.target.value === "続柄を選択" ? "" : e.target.value)} options={["続柄を選択", "配偶者", "子", "父母", "兄弟姉妹", "孫", "祖父母"]} error={errOf('rel')} errMode={errMode} anchorRef={setFieldRef('rel')} />
          <Field label="電話番号" placeholder="090-0000-0000" />
        </GroupCard>

        {/* 団体特定コード（最下部） */}
        {!formSplit && (
        <GroupCard title="団体特定コード" icon={Ic.tag}>
          <Field label="団体特定コード" placeholder="TDF-0000-0000" hint="団体からご案内のコードを入力してください" />
        </GroupCard>
        )}
        </>)}

      </div>

      <ActionBar bg={atBottom ? "#F2FBFE" : undefined}>
        {/* ③ 下部フローティング（提案）：未入力の必須項目数を親指元に表示し、順にジャンプ */}
        {errMode === 'float' && visibleErrs.length > 0 && (
          <button onClick={() => jumpNext(visibleErrs)}
            className="w-full flex items-center justify-between gap-2 rounded-xl px-4 py-3 fade-in active:scale-[.99] transition-transform"
            style={{ background: 'var(--color-attention)', color: '#fff' }}>
            <span className="flex items-center gap-3 text-left">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0"><path d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12C1.25 6.072 6.072 1.25 12 1.25C17.928 1.25 22.75 6.072 22.75 12C22.75 17.928 17.928 22.75 12 22.75ZM12 2.75C6.899 2.75 2.75 6.899 2.75 12C2.75 17.101 6.899 21.25 12 21.25C17.101 21.25 21.25 17.101 21.25 12C21.25 6.899 17.101 2.75 12 2.75ZM12.75 16.5V11.929C12.75 11.515 12.414 11.179 12 11.179C11.586 11.179 11.25 11.515 11.25 11.929V16.5C11.25 16.914 11.586 17.25 12 17.25C12.414 17.25 12.75 16.914 12.75 16.5ZM13.02 8.5C13.02 7.948 12.573 7.5 12.02 7.5H12.01C11.458 7.5 11.0149 7.948 11.0149 8.5C11.0149 9.052 11.468 9.5 12.02 9.5C12.572 9.5 13.02 9.052 13.02 8.5Z"/></svg>
              <span className="flex flex-col leading-tight font-bold">
                <span className="text-caption">未入力の必須項目が</span>
                <span className="text-h6"><span className="text-h4 tabular-nums">{visibleErrs.length}</span>件あります</span>
              </span>
            </span>
            <span className="flex items-center gap-1 text-caption font-medium whitespace-nowrap rounded-full bg-white/20 px-3 py-1"><span className="font-mono tabular-nums">{errStep % visibleErrs.length + 1}/{visibleErrs.length}</span>&#8194;次の項目へ<Ic.chevR className="w-4 h-4" /></span>
          </button>
        )}
        <div className={`rounded-xl border px-4 py-2 transition-colors ${atBottom ? "border-primary-100 bg-white/70" : "border-warm-200 bg-white"}`}>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-neutral-400">保険内容</span>
            <button onClick={() => setEditOpen(true)} className="flex items-center gap-1 text-caption font-medium" style={{ color: 'var(--color-link)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
              修正
            </button>
          </div>
          <div className="mt-[2px] flex items-center flex-wrap gap-x-2 gap-y-[2px] text-caption">
            <span className="font-bold text-neutral-800">{PLAN_CARDS.find((p) => p.id === sel)?.name || plan.name}</span>
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
            <div className="flex items-center justify-between px-6 pt-4 pb-3">
              <h3 className="text-h5 font-bold text-neutral-800">積立内容を修正</h3>
              <button onClick={() => setEditOpen(false)} className="grid place-items-center w-8 h-8 rounded-full bg-warm-100 text-neutral-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="px-6 overflow-y-auto no-sb pb-2">
              {/* 選択プラン＋説明 */}
              <div className="flex flex-col gap-2 mb-4 pt-1">
                <span className="inline-flex flex-col rounded-lg bg-[#EFEFEF] px-3 py-2 leading-tight self-start">
                  <span className="text-[14px] font-bold text-neutral-800">選択プラン</span>
                  <span className="text-[14px] font-bold text-primary-600 mt-1">{PLAN_CARDS.find((p) => p.id === sel)?.name || plan.name}</span>
                </span>
                <p className="text-caption text-neutral-600 leading-relaxed">保障する積立金額や保障期間を選択して、毎月の保険料を確認してみましょう。</p>
              </div>
              <SimSliders m={m} setM={setM} y={y} setY={setY} onInput={() => setSheetRes(true)} />

              {/* シミュレーション結果（エラー時はテーブル非表示・赤字エラー） */}
              {editErrors.length > 0 ? (
                <div className="mt-2 pt-4 border-t border-warm-200 space-y-2">
                  {editErrors.map((e, i) => (
                    <p key={i} className="flex items-start gap-2 text-caption font-bold leading-relaxed" style={{ color: 'var(--color-attention)' }}>
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0 mt-[2px]" style={{ color: 'var(--color-attention)' }}><path d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12C1.25 6.072 6.072 1.25 12 1.25C17.928 1.25 22.75 6.072 22.75 12C22.75 17.928 17.928 22.75 12 22.75ZM12 2.75C6.899 2.75 2.75 6.899 2.75 12C2.75 17.101 6.899 21.25 12 21.25C17.101 21.25 21.25 17.101 21.25 12C21.25 6.899 17.101 2.75 12 2.75ZM12.75 16.5V11.929C12.75 11.515 12.414 11.179 12 11.179C11.586 11.179 11.25 11.515 11.25 11.929V16.5C11.25 16.914 11.586 17.25 12 17.25C12.414 17.25 12.75 16.914 12.75 16.5ZM13.02 8.5C13.02 7.948 12.573 7.5 12.02 7.5H12.01C11.458 7.5 11.0149 7.948 11.0149 8.5C11.0149 9.052 11.468 9.5 12.02 9.5C12.572 9.5 13.02 9.052 13.02 8.5Z"/></svg>
                      <span>{e}</span>
                    </p>
                  ))}
                </div>
              ) : (<>
              {plan && (
                <div className="mt-2 pt-4 border-t border-warm-200 flex items-center justify-between">
                  <span className="text-caption font-medium text-neutral-500">初年度の月払保険料</span>
                  <span className="text-primary-600">
                    <span className="font-en text-h2 font-semibold tabular-nums">{(parseInt((plan.price||'0').replace(/[^0-9]/g,''),10)*1).toLocaleString('ja-JP')}</span>
                    <span className="text-h6"> 円</span>
                  </span>
                </div>
              )}
              <button onClick={() => setSheetRes((o) => !o)}
                className="flex items-center justify-between w-full mt-3 pt-3 border-t border-warm-200 text-left">
                <span className="text-h6 font-bold text-neutral-800">保険料テーブルをみる</span>
                <span className={`grid place-items-center w-8 h-8 rounded-full bg-warm-100 text-neutral-500 transition-transform ${sheetRes ? "rotate-180" : ""}`}>
                  <Ic.chevR className="w-4 h-4 rotate-90" />
                </span>
              </button>
              <div style={{ maxHeight: sheetRes ? "1600px" : "0px", opacity: sheetRes ? 1 : 0, marginTop: sheetRes ? "16px" : "0px" }}
                className="overflow-hidden transition-all duration-300 ease-out">
                <BenefitTable m={m} y={y} plan={plan} startAge={formStartAge} />
              </div>
              </>)}
            </div>
            <div className="px-6 py-3 border-t border-warm-200">
              <Btn kind="button" onClick={() => setEditOpen(false)} disabled={editErrors.length > 0}>この内容で更新</Btn>
            </div>
          </div>
        </div>
      )}

      {/* 告知項目モーダル（ページ表示時に選択プランで強制表示） */}
      <DisclosureModal plan={infoPlan} death={modalDeath} confirm onClose={() => setInfoPlan(null)} onConfirm={() => setInfoPlan(null)} onCancel={onTerminate} />

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
// 重要事項（3項目に簡略化）
export const AGREE_ITEMS: AgreeItemData[] = [
  {
    id: "kiyaku",
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
    id: "juuyou",
    t: "重要事項説明の確認",
    blocks: [
      { p: "以下の重要事項説明書をご確認ください。" },
      { download: "重要事項説明書" },
    ],
  },
  {
    id: "mykiyaku",
    t: "マイページの利用規約",
    blocks: [
      { p: "マイページのご利用にあたっては、以下の利用規約をご確認ください。" },
      { linkBtn: { label: "マイページの利用規約", href: "https://is.tdf-life.co.jp/tdcustomer/index.html#/terms" } },
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
              <li key={j} className="flex gap-2 text-caption text-neutral-600 leading-relaxed">
                <span className="text-neutral-400 shrink-0">・</span><span className="whitespace-pre-line">{t}</span>
              </li>
            ))}
          </ul>
        );
        if (b.bulletLinks) return (
          <div key={i} className="space-y-3">
            {b.bulletLinks.map((item, j) => (
              <div key={j} className="flex gap-1.5">
                <span className="text-neutral-400 shrink-0">・</span>
                <span>
                  <span className="text-caption text-neutral-600 leading-relaxed">{item.text}</span><br/>
                  <a href={item.url} target="_blank" rel="noreferrer"
                    className="text-caption underline break-all leading-relaxed"
                    style={{ color: 'var(--color-link)' }}>{item.url}</a>
                </span>
              </div>
            ))}
          </div>
        );
        if (b.link) return <a key={i} href={b.link} target="_blank" rel="noreferrer" className="block text-caption underline break-all leading-relaxed" style={{ color: 'var(--color-link)' }}>{b.link}</a>;
        if (b.download) return (
          <a key={i} href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-2 text-caption font-medium underline underline-offset-2" style={{ color: 'var(--color-link)' }}>
            {b.download}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 3v12m0 0l-4-4m4 4l4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>
          </a>
        );
        if (b.linkBtn) return (
          <a key={i} href={b.linkBtn.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-caption font-medium underline underline-offset-2" style={{ color: 'var(--color-link)' }}>
            {b.linkBtn.label}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/></svg>
          </a>
        );
        if (b.checks) return (
          <div key={i} className="rounded-lg border border-warm-200 overflow-hidden">
            {b.checks.map((c, j) => (
              <div key={j} className={`text-caption text-neutral-700 px-3 py-2 leading-relaxed ${j > 0 ? "border-t border-warm-200" : ""}`}>{c}</div>
            ))}
          </div>
        );
        if (b.cat) return <div key={i} className="rounded-lg border border-primary-100 bg-primary-10 px-4 py-3"><p className="text-caption font-bold text-neutral-800 leading-snug">{b.cat}</p></div>;
        if (b.note) return <div key={i} className="rounded-lg border border-warm-200 bg-warm-50 p-3 text-caption text-neutral-700 leading-relaxed whitespace-pre-line">{b.note}</div>;
        if (b.table) return (
          <div key={i} className="rounded-lg border border-warm-200 overflow-hidden">
            <table className="w-full">
              <tbody>
                {b.table.map((r, j) => (
                  <tr key={j} className="border-b border-warm-200 last:border-0 align-top">
                    <th className="bg-warm-50 text-left font-medium text-caption text-neutral-600 px-3 py-2 w-[88px] align-top leading-relaxed">{r[0]}</th>
                    <td className="text-caption text-neutral-600 px-3 py-2 leading-relaxed">{r[1]}</td>
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
      <div className="flex items-center gap-3 px-3 py-3">
        {onCheck && (
          <button onClick={onCheck} aria-label="同意チェック"
            className={`grid place-items-center w-6 h-6 rounded border-2 shrink-0 ${checked ? "border-primary bg-primary text-white" : "border-warm-300 bg-white"}`}>
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
        <div className="px-3 pt-3 pb-4 border-t border-warm-200 max-h-80 overflow-y-auto no-sb space-y-3">
          <AgreeBlocks blocks={item.blocks} />
          {children}
        </div>
      </div>
    </div>
  );
}

export function ScreenStep4({ go, sel, deathOpt = true, m, y, initialOpenIdx, initialChecks, initialAcctOpen, benSameAddr = true, initialEditKiyaku, initialEditJuushin }: { go: Go; sel: string; deathOpt?: boolean; m: number; y: number; initialOpenIdx?: number; initialChecks?: boolean[]; initialAcctOpen?: boolean; benSameAddr?: boolean; initialEditKiyaku?: boolean; initialEditJuushin?: boolean }) {
  const plan = PLANS.find((p) => p.id === planIdFromSel(sel)) || PLANS[0];
  const yen = (v: number) => (v || 0).toLocaleString("ja-JP");
  const [openIdx, setOpenIdx] = useState(initialOpenIdx ?? -1);
  const [payIdx, setPayIdx] = useState(initialAcctOpen ? 0 : -1);
  const [agreed, setAgreed] = useState(Array.isArray(initialChecks) ? initialChecks.every(Boolean) : false);
  const [ikoAgree, setIkoAgree] = useState(false);
  const [nat, setNat] = useState("jp");
  const [jpLang, setJpLang] = useState("");
  // ご意向文のプラン種別部分（太字表示する中央部分。プラン×死亡保障の全10通り）
  const IKO = {
    cancer:      { d: "がん、死亡", n: "がん" },
    three:       { d: "三大疾病、死亡", n: "三大疾病" },
    care:        { d: "障害・介護状態、死亡", n: "障害・介護状態" },
    cancer_care: { d: "がん、障害・介護状態、死亡", n: "がん、障害・介護状態" },
    three_care:  { d: "三大疾病、障害介護状態、死亡", n: "三大疾病、障害介護状態" },
  };
  const ikoMid = ((IKO as Record<string, any>)[planIdFromSel(sel)] || IKO.cancer)[deathOpt ? "d" : "n"];
  const [editKiyaku, setEditKiyaku] = useState(initialEditKiyaku ?? false);
  const [editJuushin, setEditJuushin] = useState(initialEditJuushin ?? false);
  // 受取人住所：編集中の「契約者と同じ」チェック状態（編集開始時に benSameAddr で初期化）
  const [benEditSame, setBenEditSame] = useState(benSameAddr);
  const openJuushinEdit = () => { setBenEditSame(benSameAddr); setEditJuushin(true); };
  // 受取人固有の住所（「契約者と異なる」場合に表示）
  const BEN_ADDR = { zip: "150-0002", pref: "東京都", city: "渋谷区", town: "渋谷２丁目", addr: "2-1", bldg: "渋谷フラット 305", line1: "東京都渋谷区渋谷２丁目", line2: "渋谷フラット 305" };
  const agreeItems = AGREE_ITEMS;
  const CIRC = "①②③④⑤⑥⑦⑧⑨";
  const confirmNums = agreeItems.map((it, i) => (it.kind === "agree" ? null : CIRC[i])).filter(Boolean).join("");
  const agreeNums = agreeItems.map((it, i) => (it.kind === "agree" ? CIRC[i] : null)).filter(Boolean).join("");
  return (
    <>
      <AppBar title="内容確認・お支払い" onBack={() => go(3)} />
      <div className="flex-1 overflow-y-auto no-sb px-4 pt-6 pb-[72px] space-y-8" style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #F2FBFE 100%)" }}>
        <div className="-mx-4 -mt-6"><Steps n={4} go={go} /></div>
        <h2 className="text-h4 font-bold text-center" style={{ color: '#1AA5DC' }}>内容確認</h2>
        <StepSection>
        <h2 className="text-h4 font-bold text-neutral-800">お申込み内容</h2>

        <div className="rounded-2xl border border-warm-200 bg-[#EFEFEF] p-6">
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="font-mono text-caption tracking-[0.14em] uppercase text-neutral-900">積立内容</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-warm-200 px-2 py-[2px] text-[10px] font-medium text-neutral-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3 h-3"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
              変更不可
            </span>
          </div>
          <Row k="契約プラン" v={PLAN_CARDS.find((p) => p.id === sel)?.name || plan.name} strong />
          <Row k="毎月の積立金額（希望給付額）" v={`${yen(m)} 円`} strong />
          <Row k="保障期間" v={`${y} 年`} strong />
          <Row k="保険料（月額）" v={`${plan.price.replace("¥", "")} 円 / 月`} strong />
          <Row k="保険期間" v="1年（自動更新）" strong />
          {/* ご意向の再確認（プランにより文言が変化） */}
          <div className="mt-1">
            <span className="text-caption text-neutral-500">ご意向の確認</span>
            <p className="text-h6 text-neutral-700 leading-relaxed mt-1">積立期間中における<strong className="font-bold text-neutral-900">{ikoMid}</strong>にそなえたい</p>
          </div>
        </div>

        <div className={`rounded-2xl border bg-white p-6 transition-colors ${editKiyaku ? "border-primary-300" : "border-warm-200"}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-caption tracking-[0.14em] uppercase text-neutral-900">契約者情報</p>
            {!editKiyaku && (
              <button onClick={() => setEditKiyaku(true)} className="flex items-center gap-1 text-caption font-medium text-primary-600 hover:text-primary transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
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
              <Field label="郵便番号" value="100-0001" hint="郵便番号から住所を自動入力します" />
              <Select label="都道府県" value="東京都" options={PREFS} />
              <Field label="市区町村" value="千代田区" />
              <Field label="町名" value="丸の内１丁目" />
              <Field label="番地など" value="1-1" />
              <Field label="建物名／部屋番号" value="丸の内ビル 10F" />
              <Field label="電話番号" value="090-0000-0000" />
              <Field label="メールアドレス" value="samplename@sample.co.jp" />
            </div>
          ) : (
            <>
              <Row k="氏名" v="山田 太郎" />
              <Row k="フリガナ" v="ヤマダ タロウ" />
              <Row k="生年月日" v="1990 / 01 / 01" />
              <Row k="性別" v="男性" />
              <div className="flex flex-col gap-[2px] py-3 border-b border-warm-200">
                <span className="text-caption text-neutral-500">住所</span>
                <span className="text-h6 text-neutral-700 leading-relaxed">〒100-0001<br/>東京都千代田区丸の内１丁目 丸の内ビル 10F</span>
              </div>
              <Row k="電話番号" v="090-0000-0000" />
              <Row k="メールアドレス" v="samplename@sample.co.jp" />
            </>
          )}
        </div>

        <div className={`rounded-2xl border bg-white p-6 transition-colors ${editJuushin ? "border-primary-300" : "border-warm-200"}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-caption tracking-[0.14em] uppercase text-neutral-900">保険金受取人</p>
            {!editJuushin && (
              <button onClick={openJuushinEdit} className="flex items-center gap-1 text-caption font-medium text-primary-600 hover:text-primary transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
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
              <Field label="フリガナ" value="ヤマダ ハナコ" />
              <Field label="生年月日" value="1992 / 05 / 15" />
              <Field label="性別" value="女性" />
              <Field label="続柄" value="配偶者" />
              {/* 住所：「契約者と同じ」チェック。外すと住所入力欄が出現 */}
              <div className="flex flex-col gap-2">
                <span className="text-caption font-medium text-neutral-600">住所</span>
                <button type="button" onClick={() => setBenEditSame((s) => !s)} className="flex items-center gap-3 text-left">
                  <span className={`grid place-items-center w-6 h-6 rounded border-2 shrink-0 ${benEditSame ? "border-primary bg-primary text-white" : "border-warm-300 bg-white"}`}>
                    {benEditSame && <Ic.check className="w-3 h-3" />}
                  </span>
                  <span className="text-caption text-neutral-700">住所は契約者と同じ</span>
                </button>
                {!benEditSame && (
                  <div className="space-y-2 mt-1 fade-in">
                    <Field label="郵便番号" value={BEN_ADDR.zip} hint="郵便番号から住所を自動入力します" />
                    <Select label="都道府県" value={BEN_ADDR.pref} options={PREFS} />
                    <Field label="市区町村" value={BEN_ADDR.city} />
                    <Field label="町名" value={BEN_ADDR.town} />
                    <Field label="番地など" value={BEN_ADDR.addr} />
                    <Field label="建物名／部屋番号" value={BEN_ADDR.bldg} />
                  </div>
                )}
              </div>
              <Field label="電話番号" value="090-0000-0000" />
            </div>
          ) : (
            <>
              <Row k="氏名" v="山田 花子" />
              <Row k="フリガナ" v="ヤマダ ハナコ" />
              <Row k="生年月日" v="1992 / 05 / 15" />
              <Row k="性別" v="女性" />
              <Row k="続柄" v="配偶者" />
              {benSameAddr ? (
                <Row k="住所" v="契約者と同じ" />
              ) : (
                <div className="flex flex-col gap-[2px] py-3 border-b border-warm-200">
                  <span className="text-caption text-neutral-500">住所</span>
                  <span className="text-h6 text-neutral-700 leading-relaxed">〒{BEN_ADDR.zip}<br/>{BEN_ADDR.line1} {BEN_ADDR.line2}</span>
                </div>
              )}
              <Row k="電話番号" v="090-0000-0000" />
            </>
          )}
        </div>

        <div className="rounded-2xl border border-warm-200 bg-white p-6">
          <SectionLabel>団体特定コード</SectionLabel>
          <Row k="コード" v="1234567891234567" />
        </div>

        </StepSection>

        <StepSection>
          <h2 className="text-h4 font-bold text-neutral-800">保険料のお支払いについて</h2>
          <p className="text-caption text-neutral-600 leading-relaxed">クレジットカードによる保険料払込における各種注意点を確認のうえ、お手続きください。</p>

          <div>
            <h3 className="text-h6 font-bold text-neutral-800">クレジットカード払の重要事項の確認</h3>
            <p className="mt-2 text-caption text-neutral-600 leading-relaxed">「クレジットカードのお支払いについて」を確認いただいたうえで、カード番号や有効期限などを入力いただきます。</p>
          </div>

          {/* accordion ⑥ クレジットカードのお支払いについて */}
          <div className="rounded-2xl border border-warm-200 bg-white overflow-hidden">
            <button onClick={() => setPayIdx((o) => (o === 0 ? -1 : 0))} className="flex items-center justify-between w-full px-4 py-4 text-left">
              <h4 className="text-h6 font-bold text-neutral-800">クレジットカードのお支払いについて</h4>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 text-primary shrink-0 transition-transform duration-300 ${payIdx === 0 ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <div style={{ maxHeight: payIdx === 0 ? "2000px" : "0px", opacity: payIdx === 0 ? 1 : 0 }} className="overflow-hidden transition-all duration-300 ease-out">
              <div className="px-4 pb-4 border-t border-warm-200 pt-3 space-y-3">
                <ul className="space-y-3">
                  <li className="flex gap-2 text-caption text-neutral-600 leading-relaxed"><span className="text-neutral-400 shrink-0">・</span><span>カード名義人は被保険者さま本人名義に限ります。</span></li>
                  <li className="text-caption text-neutral-600 leading-relaxed">
                    <span className="flex gap-2"><span className="text-neutral-400 shrink-0">・</span><span>以下のマークのあるクレジットカードをご指定いただけます。</span></span>
                    <div className="flex flex-wrap gap-2 mt-2 ml-4">
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
                    <li key={i} className="flex gap-2 text-caption text-neutral-600 leading-relaxed"><span className="text-neutral-400 shrink-0">・</span><span>{t}</span></li>
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
                <ul className="space-y-3">
                  {[
                    "私がT&Dフィナンシャル生命保険株式会社（以下「T&Dフィナンシャル生命」といいます。）と締結した生命保険契約の保険料は、私が指定する私名義のクレジットカード（以下「指定カード」といいます。）で指定カード発行会社の会員規約に基づいて支払います。",
                    "私がT&Dフィナンシャル生命に対し申し出をしない限り、保険料を前項と同様に指定カード発行会社の会員規約に基づいて、継続して支払います。",
                    "私は指定カード発行会社により、私が届け出た会員番号・有効期限が更新された場合であっても、保険料を異議なく支払います。",
                    "会員資格喪失等により、指定カード発行会社から指定カードによる保険料の支払いを停止されても異議はありません。",
                    "指定カードの会員番号や有効期限が変更となった場合、私に事前に通知することなく、新しい会員番号や有効期限が指定カード発行会社よりT&Dフィナンシャル生命に通知されても、異議はありません。",
                    "私は指定カードの会員番号や有効期限が変更となった場合、すみやかにT&Dフィナンシャル生命に通知します。",
                    "指定カードで支払った保険料については領収証は請求いたしません。",
                  ].map((t, i) => (
                    <li key={i} className="flex gap-2 text-caption text-neutral-600 leading-relaxed"><span className="text-neutral-400 shrink-0">・</span><span>{t}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </StepSection>

        <div className="rounded-2xl border border-[color:var(--secondary-color-100)] bg-[color:var(--secondary-color-10)] p-4">
          <div className="flex items-center gap-2 mb-3"><Badge>重要</Badge><span className="text-h5 font-bold text-neutral-800">重要事項をご確認ください</span></div>
          <div className="space-y-3">
            {agreeItems.map((it, i) => (
              <AgreeItem key={it.id || i} num={CIRC[i]} item={it} open={openIdx === i}
                onToggle={() => setOpenIdx((o) => (o === i ? -1 : i))}>
                {it.id === "insured" && (
                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-2 gap-3">
                      {[["jp", "日本国籍"], ["other", "日本国籍以外"]].map(([k, l]) => (
                        <button key={k} onClick={() => setNat(k)}
                          className={`h-11 rounded-lg border text-h6 transition-colors ${nat === k ? "border-primary bg-primary-10 text-primary-700 font-medium" : "border-warm-300 bg-warm-50 text-neutral-700 hover:border-primary-300"}`}>
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
                              className={`h-11 rounded-lg border text-h6 transition-colors ${jpLang === k ? "border-primary bg-primary-10 text-primary-700 font-medium" : "border-warm-300 bg-warm-50 text-neutral-700 hover:border-primary-300"}`}>
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
            <span className={`grid place-items-center w-6 h-6 mt-[2px] rounded border-2 shrink-0 ${agreed ? "border-primary bg-primary text-white" : "border-warm-300 bg-white"}`}>
              {agreed && <Ic.check className="w-3 h-3" />}
            </span>
            <span className="text-h7 text-neutral-700 leading-relaxed">①②を確認し、③の内容に同意する</span>
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 text-neutral-500 shrink-0"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
      <span className="flex-1 bg-white rounded-md px-3 py-1 text-caption text-neutral-600 truncate font-en">{url}</span>
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
      <div className="flex-1 overflow-y-auto no-sb bg-neutral-100 px-4 pt-6 pb-[72px] space-y-4">
        <h2 className="text-h5 font-bold text-neutral-800">クレジットカード設定（外部リンク）</h2>
        <div className="rounded-xl bg-white border border-neutral-200 p-4 space-y-4">
          <p className="flex items-center gap-2 text-h6 font-bold text-neutral-800">
            <span className="w-2 h-4 bg-[color:var(--success)] rounded-[1px]" />クレジットカード情報を入力ください
          </p>
          <Field label="カード番号" placeholder="1234 5678 9012 3456" required />
          <Field label="カード名義（半角ローマ字）" placeholder="TARO YAMADA" required />
          <div className="grid grid-cols-2 gap-x-3 gap-y-6">
            <Field label="有効期限（月／年）" placeholder="04 / 25" required />
            <Field label="セキュリティコード" placeholder="***" required />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-caption font-medium text-neutral-600">使用できるクレジットカード</span>
            <div className="flex flex-wrap gap-2">
              {CARD_BRANDS.map((b) => (
                <span key={b} className="rounded border border-neutral-300 bg-neutral-50 px-2 py-1 font-en text-[11px] font-medium text-neutral-600">{b}</span>
              ))}
            </div>
          </div>
          <ul className="space-y-2 border-t border-neutral-200 pt-3">
            {[
              "クレジットカードの名義人が保険契約者と同一のカードのみお取扱い可能です。",
              "クレジットカードの有効期限がお申込日の翌々月以降も有効なクレジットカードでお申込みください。",
              "クレジットカードでのお支払い方法は一回払いのみとなります。",
            ].map((t, i) => (
              <li key={i} className="flex gap-2 text-caption text-neutral-500 leading-relaxed">
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
      <div className="flex-1 overflow-y-auto no-sb bg-neutral-100 px-4 pt-6 pb-[72px] space-y-4">
        <h2 className="text-h5 font-bold text-neutral-800">お申込み内容の確認（外部リンク）</h2>
        <div className="rounded-xl bg-white border border-neutral-200 p-4 space-y-4">
          <p className="flex items-center gap-2 text-h6 font-bold text-neutral-800">
            <span className="w-2 h-4 bg-[color:var(--success)] rounded-[1px]" />ご登録内容
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
/* 完了画面の派生：処理中 / 処理エラー */
export function ScreenStatus({ variant, go }: { variant?: string; go: Go }) {
  const isErr = variant === 'error';
  const isMaint = variant === 'maint';
  const heading = isErr ? "処理エラー" : isMaint ? "メンテナンス中" : "処理中";
  const body = isErr
    ? "クレジットカード情報をご確認のうえ、再度操作をお願いいたします（E01260010）。"
    : isMaint
    ? "ただいまシステムメンテナンスを実施しております。ご迷惑をおかけしますが、しばらく経ってから再度お試しください。"
    : "お手続きを処理しています。\nこのまましばらくお待ちください。";
  return (
    <div className="screen-fixed-height flex flex-col relative" style={{ flex: '1 1 0%' }}>
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 pt-3 pb-1 text-caption font-en font-medium text-neutral-700 pointer-events-none">
        <span>9:41</span><span className="flex items-center gap-1"><span>5G</span><span>100%</span></span>
      </div>
      {/* 背景画像：上下中央揃え */}
      <img src="/assets/theo-tdf/status_bg.png" alt="" className="absolute left-0 right-0 top-1/2 -translate-y-1/2 w-full pointer-events-none select-none" style={{ zIndex: 0 }} />
      <div className="flex-1 flex flex-col items-center justify-center relative" style={{ zIndex: 1 }}>
        <div style={{ width: 300 }} className="text-center">
          <img src="/assets/theo-tdf/dammy_logo_cyan.svg" alt="くみこみ安心ほけん" className="h-8 mb-10 mx-auto block" />
          {isErr ? (
            <img src="/assets/theo-tdf/icon_error.png" className="w-16 h-16 mb-6 mx-auto block" alt="エラー" />
          ) : isMaint ? (
            <img src="/assets/theo-tdf/icon_maint.png" className="w-16 h-16 mb-6 mx-auto block" alt="メンテナンス中" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16 mb-6 animate-spin text-primary-600 mx-auto block"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2"/><path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          )}
          <h2 className="text-h4 font-bold text-neutral-800">{heading}</h2>
          <p className="mt-3 text-caption text-neutral-500 leading-relaxed whitespace-pre-line text-center">
            {body}
          </p>
        </div>
      </div>
      <ActionBar bg="#F2FBFE">
        <Btn kind="button" onClick={() => go(isErr ? 5 : 6)}>戻る</Btn>
      </ActionBar>
    </div>
  );
}

export function ScreenDone({ go, variant = 'done' }: { go: Go; variant?: string }) {
  const doneBgRef = useRef<any>(null);
  if (variant === 'ended') return <ScreenEnded onRestart={() => go(0)} />;
  if (variant !== 'done') return <ScreenStatus variant={variant} go={go} />;
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
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 pt-3 pb-1 text-caption font-en font-medium text-neutral-700 pointer-events-none">
        <span>9:41</span><span className="flex items-center gap-1"><span>5G</span><span>100%</span></span>
      </div>
      <div ref={bindDoneScroll} className="flex-1 overflow-y-auto no-sb">
        {/* ヒーロー（img＋絶対配置・パララックス） */}
        <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
          <img ref={doneBgRef} src="/assets/theo-tdf/hero_bg_done.png" alt="" style={{ width: '100%', display: 'block', willChange: 'transform', transformOrigin: 'top center' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          {/* フェイクステータスバー（プレースホルダー） */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1 text-caption font-en font-medium text-transparent" aria-hidden="true">
            <span>9:41</span>
            <span className="flex items-center gap-1"><span>5G</span><span>100%</span></span>
          </div>
          {/* ヒーローコンテンツ */}
          <div className="px-5 pt-4 pb-12 text-center">
            <img src="/assets/theo-tdf/dammy_logo_cyan.svg" alt="くみこみ安心ほけん" className="h-8 mx-auto mb-8" />
            <div className="mx-auto grid place-items-center w-16 h-16 rounded-full bg-white mb-6 shadow-sm">
              <Ic.check className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-h4 font-bold text-neutral-800">お申込が完了しました</h2>
            <p className="mt-2 text-caption text-neutral-500">申込番号　XXX-2026-000001</p>
          </div>
          </div>
        </div>

        {/* progress — sticks to top once the blue hero scrolls out of view */}
        <div className="sticky top-0 z-30">
          <Steps n={5} go={go} />
        </div>

        <div className="px-4 py-6 space-y-6">
          <div className="px-1">
            <p className="text-h7 font-bold text-neutral-800 leading-relaxed">XXX くみこみ安心ほけんのお申込が完了しました。</p>
            <p className="mt-2 text-caption text-neutral-600 leading-relaxed text-left">
              受付確認メールをご確認ください。<br/>
              査定結果は●日以内に再度ご登録のメールアドレス宛に連絡いたします。<br/>
              ※銀行のお取引状況等によっては、ご加入できない場合がございます。
            </p>
          </div>

          <div className="rounded-2xl border border-warm-200 bg-white p-6">
            <SectionLabel>このあとの流れ</SectionLabel>
            <div className="mt-1">
            {[
              ["1", "受付確認メール送信確認", "ご登録のメールアドレスをご確認ください。"],
              ["2", "査定・引受の確定", "通常1〜3営業日でマイページに反映されます。"],
              ["3", "初回保険料の引落し・保険開始", "翌月以降、XXX のご登録口座より。"],
            ].map(([n, t, d], idx, arr) => (
              <div key={n} className="flex gap-3">
                {/* 左：丸数字＋接続線 */}
                <div className="flex flex-col items-center" style={{ width: '28px', flexShrink: 0 }}>
                  <span className="grid place-items-center w-7 h-7 rounded-full bg-primary-10 text-primary-600 font-en font-semibold text-caption shrink-0">{n}</span>
                  {idx < arr.length - 1 && (
                    <div style={{ flex: 1, width: '2px', background: 'var(--primary-color-200)', minHeight: '24px', margin: '4px 0' }} />
                  )}
                </div>
                {/* 右：テキスト */}
                <div style={{ paddingBottom: idx < arr.length - 1 ? '0' : '4px' }}>
                  <p className="text-h7 font-bold text-neutral-800">{t}</p>
                  <p className="text-caption text-neutral-500 leading-relaxed">{d}</p>
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

/* ============================================================
   SCREEN — 終了しました（申込キャンセル時）
   ============================================================ */
export function ScreenEnded({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="screen-fixed-height flex flex-col relative" style={{ flex: '1 1 0%' }}>
      {/* 固定ステータスバー */}
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 pt-3 pb-1 text-caption font-en font-medium text-neutral-700 pointer-events-none">
        <span>9:41</span><span className="flex items-center gap-1"><span>5G</span><span>100%</span></span>
      </div>
      {/* 背景画像：上下中央揃え */}
      <img src="/assets/theo-tdf/status_bg.png" alt="" className="absolute left-0 right-0 top-1/2 -translate-y-1/2 w-full pointer-events-none select-none" style={{ zIndex: 0 }} />
      <div className="flex-1 flex flex-col" style={{ position: 'relative', zIndex: 1 }}>
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div style={{ width: 300 }} className="text-center">
            <img src="/assets/theo-tdf/dammy_logo_cyan.svg" alt="くみこみ安心ほけん" className="h-8 mb-10 mx-auto block" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-16 h-16 mb-6 text-neutral-400 mx-auto block"><path d="M18 6L6 18M6 6l12 12"/></svg>
            <h2 className="text-h4 font-bold text-neutral-800">お申し込みを<br/>終了しました</h2>
            <p className="mt-3 text-caption text-neutral-500 leading-relaxed text-center">今回のお申し込みは受付されていません。再度お申し込みいただく場合は、はじめからやり直してください。</p>
          </div>
        </div>
        <div className="px-5 pb-6">
          <div className="rounded-xl bg-warm-100 p-4 text-caption text-neutral-500 leading-relaxed text-left">
            ご不明な点は XXX サポートまでお問い合わせください。
          </div>
        </div>
      </div>
      <ActionBar bg="#F2FBFE">
        <Btn kind="button" onClick={onRestart}>はじめの画面に戻る</Btn>
      </ActionBar>
    </div>
  );
}

// Export everything app.jsx depends on. Ic in particular MUST be on window —
// app.jsx references it, and relying on cross-<script> const sharing is fragile
// (a single missing binding throws and blanks the entire UI).


export const HEIGAI_BLOCKS = [
  { sec: "1．お客さまに関する情報のお取扱いについて" },
  { p: "(1) 当行はお客さまへの保険商品のご提案にあたり、当行とお客さまとの取引時に知り得た、また今後知り得るお客さまの取引に関する情報（預金の残高・入出金・満期、融資の使途・残高、為替・金融商品取引等の内容や運用・検討状況に関する情報等、資産・収支・業務の状況等）を、対面・郵便・電話・インターネット等を用いたコンサルティングのために利用することがございます。" },
  { p: "(2) 保険商品の取扱いにあたり、お客さまのご契約内容等知り得た情報（保険商品のご提案内容やご契約内容に関する情報の他家族構成等に関する情報）を、対面・郵便・電話・インターネット等を用いて預金・為替・融資等のお取引、金融商品のご案内、各種サービスのご提供等の業務に利用することがございます。" },
  { p: "(3) 上記お客さまの情報については、お客さまから特段のお申し出がない限り利用させていただきますが、利用停止をご希望の場合には、当行の本支店窓口へお申し出いただくか、以下の窓口までご連絡ください。" },
  { note: "お申し出窓口：●●　●●●●-●●-●●\n受付時間：9:00〜17:30（但し、銀行休業日を除きます）" },
  { sec: "2．引受保険会社からの情報提供" },
  { p: "お客様の保険契約に関し、今回お申し込みいただく保険会社から提供を受けた契約の維持・管理の為に有するご契約情報（契約者の情報、保険金額、保険料などの保険契約の情報および積立金・配当・解約金などの保険契約に関連付随する情報【健康・医療情報を除く】）を当行がお客様に提供させていただく各種サービス（預金、他の金融商品のご案内等）に利用することがあります。" },
  { sec: "3．保険商品のご購入のご検討に際して" },
  { p: "保険募集に係る当行とお客様とのお取り引きが、当行におけるお客様の他のお取り引きに影響を与えることはありません。" },
  { p: "保険商品は保険会社を引受とする保険商品であり預金とは異なります。したがって、預金と違い元本保証はありません。また預金保険制度の対象外です。" },
  { p: "保険契約はお客様と保険会社の間で締結されます。当行は、生命保険契約について契約締結の媒介を行っており、保険契約の代理権はありません。したがって、契約の成立は保険会社による承諾後となります。" },
  { p: "保険商品にお申込みいただいても、引受保険会社による審査や法令等により、お引き受けできない場合があります。" },
  { p: "既にご契約いただいている保険契約を今回見直される場合、新規契約の承諾や保障開始日（がん保険であれば90日経過後）を確認のうえ、旧契約の解約を行っていただきますよう、ご留意ください。" },
  { p: "当行が保険の募集を行う場合、当該保険募集を株式会社FFGほけんサービスと共同で行います。" },
  { p: "この場合当該保険募集を通じて知りえた情報（お客様のご契約内容、申込書記載事項等）および当行とのお取り引きに関する情報を株式会社FFGほけんサービスに提供し、当行ならびに株式会社FFGほけんサービスが共同で保険契約の募集・維持・管理に活用させていただきます。" },
  { note: "代理店名 ●●●●\n所在地 ●●●●●●\n電話番号 ●●●●-●●-●●" },
  { sec: "4．保険募集制限先等の確認について" },
  { p: "当行取扱いの保険商品（除く、個人年金保険・長期火災保険・個人契約の一時払終身保険）の募集にあたって、お客さまが以下に該当される方である場合には、法令等の定めによってご契約のお申込みをいただけない場合がございます。誠に恐れ入りますが、この点につきまして予めご了承いただきますよう、お願い申しあげます。" },
  { p: "① 当行の事業資金のご融資先である法人・その代表者および個人事業主の方" },
  { p: "② 当行の事業性資金のご融資先である法人（代表者に対するご融資を含みます）および個人事業主のうち、従業員数が50名以下の事業所に常時勤務されている従業員および役員（代表者除く）の方" },
  { note: "※パート・アルバイト等の方で、2ヶ月を超えて勤務されており、かつ正社員と概ね同等の勤務形態の場合は「従業員」とします。" },
  { p: "③ 現在、当行に事業資金融資をお申込みいただいている期間中である" },
  { sec: "5．ご確認いただきたいこと" },
  { sub: "1．当行の「特定関係法人※1」に該当する企業・団体に勤務されているお客さまへ" },
  { p: "当行の「特定関係法人※1」に該当する企業・団体に勤務されているお客さまに対しては、当行は医療保険・がん保険・傷害保険に限り募集を行うことができます。" },
  { sub: "2．当行に事業性資金等のご融資を申込み中のお客さまへ" },
  { p: "お客さま※2が当行に事業性資金等のご融資※3をお申込み中の間は、当行はお客さまに対して、医療保険、その他一部の保険商品の募集を行いません。" },
  { sub: "3．法人代表者、個人事業主のお客さまへ" },
  { p: "当行が事業性資金等のご融資※3を行っているお客さまに対して、医療保険、その他一部の保険商品の募集は原則として行いません。" },
  { sub: "4．会社役員（代表者を除きます）、従業員のお客さまへ" },
  { p: "当行が事業性資金等のご融資を行っている、常時使用する従業員数※4が50名以下の事業者にお勤めのお客さまに対して、医療保険、その他一部の保険商品の募集は原則として行いません。" },
  { note: "※1 「特定関係法人」とは、当行の関連会社・団体をはじめとする出資関係か人的関係等により、当行と密接な関係がある法人を指します。「特定関係法人」に勤務されているお客さまは、当行では医療保険・がん保険に限りお申込いただけます。\n※2 お客さまが法人の代表者である場合の当該法人、またはお客さまが法人である場合の当該法人の代表者を含みます。\n※3 「事業性資金等のご融資」には事業に必要なご資金のほか、事業として賃貸しているアパート・マンションの建築資金のご融資を含みます。\n※4 通常の従業員と概ね同様な勤務形態で、2ヶ月を超えて勤務されているパート、アルバイト、派遣社員の方を含みます。" },
];

export function HeigaiModal({ open, onClose, onAgree }: { open: boolean; onClose: () => void; onAgree?: () => void }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 fade-in" onClick={onClose} />
      <div className="sheet-up absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-xl max-h-[88%] flex flex-col">
        <div className="flex items-center justify-between gap-2 px-6 pt-4 pb-3 border-b border-warm-200">
          <h3 className="text-h6 font-bold text-neutral-800 leading-snug">ご案内にあたりご確認・同意いただきたいこと</h3>
          <button onClick={onClose} className="grid place-items-center w-8 h-8 rounded-full bg-warm-100 text-neutral-500 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto no-sb px-4 py-4 space-y-3">
          {(HEIGAI_BLOCKS as any[]).map((b: any, i: number) => (
            b.sec ? <p key={i} className="text-h6 font-bold text-neutral-800 pt-2">{b.sec}</p>
            : b.sub ? <p key={i} className="text-caption font-bold text-neutral-800 pt-1">{b.sub}</p>
            : b.note ? <p key={i} className="text-[11px] text-neutral-500 leading-relaxed whitespace-pre-line">{b.note}</p>
            : <p key={i} className="text-caption text-neutral-600 leading-relaxed">{b.p}</p>
          ))}
        </div>
        <div className="px-6 py-3 border-t border-warm-200">
          <div className="flex gap-3 items-center">
            <button onClick={onClose} className="text-caption font-medium shrink-0 px-1" style={{ color: 'var(--color-link)' }}>キャンセル</button>
            <div className="flex-1"><Btn kind="button" onClick={onAgree || onClose}>確認して同意します</Btn></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScreenCombined({ go, sel, setSel, deathOpt = true, m, setM, y, setY, emailVerified, simFirst, planCardStyle = "card", initialAgree, initialShowSend, initialTipIdx, initialPlanOpenId }: { go: Go; sel: string; setSel: React.Dispatch<React.SetStateAction<string>>; deathOpt?: boolean; m: number; setM: React.Dispatch<React.SetStateAction<number>>; y: number; setY: React.Dispatch<React.SetStateAction<number>>; emailVerified?: boolean; simFirst?: boolean; planCardStyle?: string; initialAgree?: boolean; initialShowSend?: boolean; initialTipIdx?: number; initialPlanOpenId?: string }) {
  const plan = PLANS.find((p) => p.id === planIdFromSel(sel)) || PLANS[0];
  const [agree, setAgree] = useState(initialAgree ?? false);
  const [heigaiOpen, setHeigaiOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const sendSecRef = useRef<any>(null);
  const [showSend, setShowSend] = useState(initialShowSend ?? false);
  const heroBgRef = useRef<any>(null);
  const heroRef = useRef<any>(null);
  const [solid, setSolid] = useState(false);
  const bindScroll = (el: any) => {
    if (!el || el.__bound) return;
    el.__bound = true;
    el.addEventListener("scroll", () => {
      const scrollY = el.scrollTop;
      if (heroBgRef.current) heroBgRef.current.style.transform = "translateY(" + (scrollY * 0.4) + "px)";
      const h = heroRef.current;
      setSolid(scrollY >= (h ? h.offsetHeight - 16 : 220));
      const sec = sendSecRef.current;
      if (sec) { const secTop = sec.getBoundingClientRect().top; const contBottom = el.getBoundingClientRect().bottom; setShowSend(secTop < contBottom - 64); }
    }, { passive: true });
  };
  const birthGenderFields = (
          <div style={{ width: "100%" }} className="space-y-6">
            <div>
              <h3 className="text-h6 font-medium text-neutral-800 leading-snug">生年月日・性別</h3>
              <p className="text-caption text-neutral-500 mt-1">お客様情報。保険料の算出に使用します。</p>
            </div>
            <div style={{ width: "100%" }} className="flex flex-col gap-2">
              <span className="text-caption font-medium text-neutral-600">生年月日<ReqBadge /></span>
              <button type="button" onClick={() => setPickerOpen(true)} style={{ width: "100%" }}
                className={"fld flex items-center justify-between gap-2 h-12 rounded-lg border border-warm-300 bg-white px-3 text-h6 text-left " + (birth ? "text-neutral-800" : "text-neutral-400")}>
                <span className="truncate">{birth ? fmtBirth(birth) : "選択してください"}</span>
                <img src="/assets/theo-tdf/calendar.svg" alt="" className="w-6 h-6 shrink-0" />
              </button>
            </div>
            <div style={{ width: "100%" }} className="flex flex-col gap-2">
              <span className="text-caption font-medium text-neutral-600">性別<ReqBadge /></span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", width: "100%" }}>
                {["男性", "女性"].map((g) => (
                  <button key={g} onClick={() => setGender(g)}
                    className={"h-12 rounded-lg border text-h6 transition-colors " + (gender === g ? "border-primary bg-primary-10 text-primary-700 font-bold" : "border-warm-300 bg-white text-neutral-600")}>{g}</button>
                ))}
              </div>
            </div>
          </div>
  );
  return (
    <>
      {/* \u56fa\u5b9a\u30b9\u30c6\u30fc\u30bf\u30b9\u30d0\u30fc\uff08\u30d1\u30e9\u30e9\u30c3\u30af\u30b9\u3068\u4e00\u7dd2\u306b\u52d5\u304b\u306a\u3044\uff09 */}
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 pt-3 pb-1 text-caption font-en font-medium text-neutral-800 pointer-events-none">
        <span>9:41</span><span className="flex items-center gap-1"><span>5G</span><span>100%</span></span>
      </div>
      <div ref={bindScroll} className="flex-1 overflow-y-auto no-sb">
        {/* Hero */}
        <div ref={heroRef} style={{ position: 'relative', height: '620px', overflow: 'hidden' }}>
          <img ref={heroBgRef} src="/assets/theo-tdf/hero_bg.png" alt="" style={{ width: '100%', display: 'block', willChange: 'transform', transformOrigin: 'top center' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
          <div className="flex items-center justify-between px-6 pt-3 pb-1 text-caption font-en font-medium text-transparent" aria-hidden="true">
            <span>9:41</span>
            <span className="flex items-center gap-1"><span>5G</span><span>100%</span></span>
          </div>
          <div className="sticky top-0 z-20 transition-colors duration-200"
               style={solid ? HEADER_GRAD_APPBAR : { background: 'transparent' }}>
            <div className="flex items-center justify-between px-3 h-14">
              <span className="w-10 shrink-0" />
              <div className={"flex items-center gap-2 min-w-0 transition-opacity duration-200 " + (solid ? "opacity-100" : "opacity-0")}>
                <span className="font-en font-semibold tracking-[0.1em] text-h6 text-white">XXX</span>
                <span className="text-h6 font-medium truncate text-white">くみこみ安心ほけん</span>
              </div>
              <span className="w-10 shrink-0" />
            </div>
          </div>
          <img src="/assets/theo-tdf/dammy_logo_white.svg" alt="くみこみ安心ほけん"
            style={{ position: 'absolute', top: '48px', left: '18px', height: '1.52rem' }} />
          <div style={{ position: 'absolute', top: '440px', left: '20px', right: '20px' }}>
            <p className="font-en text-caption tracking-[0.18em] uppercase" style={{ marginLeft: '4px', color: '#fff' }}>Embedded Insurance</p>
            <h1 className="mt-1 font-bold leading-snug" style={{ fontSize: "31px", lineHeight: 1.3, marginLeft: '-2px', color: '#fff' }}>つみたてながら、<br/>もしもに備える。</h1>
            <p className="mt-2 text-h7 leading-relaxed" style={{ color: '#fff' }}>将来に向けた資産形成のためのほけん</p>
          </div>
          </div>{/* /absolute overlay */}
          <img src="/assets/theo-tdf/hero-notch.svg" alt="" aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: -1, width: '100%', display: 'block', pointerEvents: 'none' }} />
        </div>
        {/* ステッパー */}
        <Steps n={1} go={go} />
        {/* 商品概要コンパクト */}
        <div className="px-6 pt-4 pb-3 space-y-2">
          {/* 引受保険会社：右寄せ */}
          <div className="flex items-center justify-end gap-2">
            <span className="text-[9px] text-neutral-400 whitespace-nowrap">引受保険会社</span>
            <img src="/assets/theo-tdf/logo_td.png" alt="T&Dフィナンシャル生命" className="h-4" />
          </div>
          {/* バッジ：中央配置 */}
          <div className="flex justify-center" style={{ marginTop: '48px' }}>
            <span className="text-[14px] font-bold text-white px-3 py-1 rounded-full" style={{ backgroundColor: '#1aa5dc' }}>XXX のお客様限定</span>
          </div>
          {/* ロゴ：中央配置 */}
          <div className="flex items-center justify-center" style={{ marginTop: '16px' }}>
            <img src="/assets/theo-tdf/dammy_logo_cyan.svg" alt="くみこみ安心ほけん" className="h-[33.6px]" />
          </div>
          <div style={{ paddingTop: '48px', paddingBottom: '16px' }}>
          <div className="grid grid-cols-3 gap-2">
            {[
              { src: "/assets/theo-tdf/activity-heart-circle.svg", t: "積立も\nあんしんに" },
              { src: "/assets/theo-tdf/graduation-cap.svg", t: "学資保険\nの代わりにも" },
              { src: "/assets/theo-tdf/hand-holding-heart.svg", t: "もしもの\n備えに" },
            ].map((f, k) => (
              <div key={k} className="flex flex-col items-center text-center gap-1">
                <img src={f.src} alt="" style={{ width: '40px', height: '40px' }} />
                <p className="text-[16px] font-bold text-neutral-700 leading-snug whitespace-pre-line">{f.t}</p>
              </div>
            ))}
          </div>
          {/* 図版 + 商品概要 */}
          <div style={{ marginTop: '64px' }} className="overflow-hidden rounded-[16px] border border-warm-200">
            <img src="/assets/theo-tdf/chart_savings.png" alt="就業不能時も将来の積立金額を保障イメージ図" className="w-full block" />
          </div>
          <div className="space-y-4 mt-4">
            <div className="text-right">
              <a className="inline-flex items-center gap-2 font-bold text-h6 cursor-pointer underline-offset-2 hover:underline" style={{ color: "var(--color-link)", fontSize: "14px" }}>
                <img src="/assets/theo-tdf/info-circle.svg" alt="" className="w-3.5 h-3.5" style={{ marginTop: '-2px' }} />
                詳細なサービス内容はこちら
              </a>
            </div>
            <div className="text-left">
              <span className="inline-block text-h5 font-bold text-neutral-800 py-[2px] rounded">保障期間</span>
              <p className="mt-2 text-h6 text-neutral-700">5年～40年（最大）</p>
              <p className="mt-1 text-caption text-neutral-500 leading-relaxed">*保険期間は契約日（更新日）から１年であり、保障期間満了まで１年ごとの更新となります。</p>
            </div>
          </div>
          <div className="text-right mt-3">
            <button onClick={() => setHeigaiOpen(true)} className="inline-flex items-center gap-2 font-bold text-h6 cursor-pointer underline-offset-2 hover:underline" style={{ color: "var(--color-link)", fontSize: "14px" }}>
              <img src="/assets/theo-tdf/info-circle.svg" alt="" className="w-3.5 h-3.5" style={{ marginTop: '-2px' }} />
              ご案内にあたりご確認・同意いただきたいこと
            </button>
          </div>
        </div>
        </div>{/* /px-6 pt-4 pb-3 */}
        {/* 橋渡しバナー */}
        <div style={{ height: '60px' }} />
        <div className="px-4 pt-6 pb-4" style={{ background: "#FFFFFF", borderTopLeftRadius: "24px", borderTopRightRadius: "24px" }}>
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-h3 font-bold text-center" style={{ color: '#1AA5DC' }}>プランシミュレーション</h2>
          </div>
        </div>
        <div className="px-4 pt-6 pb-12 space-y-8" style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #F2FBFE 100%)" }}>
          {/* 生年月日・性別 */}
          {!simFirst && birthGenderFields}
          {!simFirst && (<>
          {/* プランを選ぶ */}
          <div style={{ marginTop: '48px' }}>
          <StepSection label="プランを選ぶ" n={1} big>
            <p className="text-caption text-neutral-500">ご希望の保障プランをご選択ください</p>
            <PlanList sel={sel} setSel={setSel} mode={planCardStyle} initialTipIdx={initialTipIdx} initialOpenId={initialPlanOpenId} />
          </StepSection>
          </div>
          {/* 保険料シミュレーション */}
          <div className="-mx-4 px-4 pt-6 pb-14 relative" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F2FBFE 100%)" }}>
            <StepSection label="保険料シミュレーション" n={2} big className="mt-10">
              <Simulator m={m} setM={setM} y={y} setY={setY} planName={sel ? PLAN_CARDS.find((p) => p.id === sel)?.name : null} plan={plan} startAge={ageFromBirth(birth)} />
            </StepSection>
          </div>
          </>)}
          {simFirst && (<>
          {/* 積立金額・保障期間を選ぶ（生年月日・性別を含む） */}
          <div style={{ marginTop: '24px' }}>
          <StepSection label="積立金額・保障期間を選ぶ" n={1} big>
            {birthGenderFields}
            <div className="sim-noborder">
              <p className="text-caption text-neutral-600 leading-relaxed mb-4">保障する積立金額と保障期間を選択してください。</p>
               <SimSliders m={m} setM={setM} y={y} setY={setY} />
            </div>
          </StepSection>
          </div>
          {/* プランを選ぶ */}
          <div className="-mx-4 px-4 py-6 relative" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F2FBFE 100%)" }}>
            <StepSection label="プランを選ぶ" n={2} big className="mt-10">
              <p className="text-caption text-neutral-500">ご希望の保障プランをご選択ください</p>
              {PLAN_CARDS.map((p, i) => (
                <PlanCard key={p.id} p={p} selected={sel === p.id} onSelect={() => setSel(p.id)} initialTtOpen={i === initialTipIdx} />
              ))}
            </StepSection>
          </div>
          {/* 給付予想額 */}
          <StepSection label="保険料テーブル" n={3} big className="mt-10">
            <div className="rounded-2xl border border-warm-200 bg-white p-6">
              <p className="text-caption text-neutral-600 leading-relaxed mb-4">選択した内容にもとづく給付予想額です。</p>
              <BenefitTable m={m} y={y} plan={plan} />
            </div>
          </StepSection>
          </>)}
          {/* 申し込みをする */}
          <div className={`-mx-4 px-4 py-6 ${!simFirst ? '-mt-8' : ''}`} style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F2FBFE 100%)" }}>
            <StepSection label="申し込みをする" n={simFirst ? 4 : 3} big className="mt-10">
              {/* 必要書類のご確認 */}
              <div className="rounded-2xl border border-warm-200 bg-white p-6 space-y-4">
                <h3 className="text-h6 font-bold text-neutral-800">必要書類のご確認</h3>
                <p className="text-caption text-neutral-600 leading-relaxed">お手続きの際に必要となる書類をご準備ください。</p>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-warm-50 border border-warm-200">
                  <Ic.cardArt className="w-10 h-auto text-primary-500 shrink-0" />
                  <span className="text-caption font-medium text-neutral-700">申込みは本人様名義のクレジットカードが必要です</span>
                </div>
              </div>
              {/* 事前同意事項のご確認 */}
              <div className="rounded-2xl border border-warm-200 bg-white p-6 space-y-4">
                <h3 className="text-h6 font-bold text-neutral-800">事前同意事項のご確認</h3>
                <p className="text-caption text-neutral-600 leading-relaxed">お申し込み前に、下記より重要事項・事前同意事項を必ずご確認ください。</p>
                <button onClick={() => setNoticeOpen(true)}
                  className="flex items-center justify-between w-full rounded-xl border-2 border-[color:var(--secondary-color-200)] bg-[color:var(--secondary-color-10)] px-4 py-4 text-left">
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="rounded-full bg-[color:var(--secondary-color-600)] text-white px-2 py-[2px] text-[11px] font-bold leading-none shrink-0">重要</span>
                    <span className="text-h6 font-bold text-neutral-800">重要事項・事前同意事項を確認する</span>
                  </span>
                  <Ic.chevR className="w-6 h-6 text-[color:var(--secondary-color-600)] shrink-0" />
                </button>
                <div className={"flex items-start gap-3 w-full text-left pt-1 transition-opacity " + (agree ? "" : "opacity-40 pointer-events-none")}>
                  <span className={"grid place-items-center w-6 h-6 mt-[2px] rounded border-2 shrink-0 " + (agree ? "border-primary bg-primary text-white" : "border-warm-300 bg-white")}>
                    {agree && <Ic.check className="w-3 h-3" />}
                  </span>
                  <span className="text-caption text-neutral-700 leading-relaxed">上記の事前同意事項を確認し、同意します</span>
                </div>
              </div>
              {/* メールアドレスのご入力 */}
              <div ref={sendSecRef} className="rounded-2xl border border-warm-200 bg-white p-6 space-y-4">
                <h3 className="text-h6 font-bold text-neutral-800">メールアドレスのご入力</h3>
                <p className="text-caption text-neutral-600 leading-relaxed">ご入力されたメールアドレス宛にPINコード送信とご案内URLをお送りします。</p>
                <Field label="メールアドレス" placeholder="samplename@sample.co.jp" required />
              </div>
              {agree && <div style={{ height: '80px' }} aria-hidden="true" />}
            </StepSection>
          </div>
        </div>
      </div>
      <ActionBar bg="#F2FBFE">
          <div className="fade-in space-y-2">
            <div style={{ marginBottom: '8px' }}>
              <p style={{ fontSize: '12px', lineHeight: '1.2', color: '#9ca3af' }} className="font-mono tracking-[0.14em] uppercase">保険名称</p>
              <p style={{ fontSize: '12px', lineHeight: '1.2' }} className="text-neutral-700">無配当特定疾病障害介護保障保険（団体型）</p>
            </div>
            {emailVerified ? (
              <>
                <div className="flex items-center gap-2 rounded-xl bg-primary-10 border border-primary-100 px-4 py-3">
                  <Ic.check className="w-4 h-4 text-primary-600 shrink-0" />
                  <span className="text-caption text-primary-700">メールアドレスの認証は完了しています</span>
                </div>
                <Btn kind="cta" onClick={() => go(3)} disabled={!agree}>申込フォームへ進む<Ic.chevR className="w-4 h-4" /></Btn>
              </>
            ) : (
              <Btn kind="cta" onClick={() => go(2)} disabled={!agree}>PINコードを送信</Btn>
            )}
            {!agree && <p className="text-center text-caption text-neutral-400">同意いただくと送信できます</p>}
            {agree && (
              <div className="flex justify-end" style={{ marginTop: "24px", marginBottom: "16px" }}>
                <a href="https://faq-moneydesign.tdf-life.co.jp/" target="_blank" rel="noopener" className="inline-flex items-center gap-2 font-bold text-h6 cursor-pointer underline-offset-2 hover:underline" style={{ color: "var(--color-link)", fontSize: "14px" }}>
                  <img src="/assets/theo-tdf/info-circle.svg" alt="" className="w-3.5 h-3.5" style={{ marginTop: '-2px' }} />
                  よくあるご質問
                </a>
              </div>
            )}
          </div>
      </ActionBar>
      <DateDrumSheet open={pickerOpen} value={birth} onClose={() => setPickerOpen(false)} onDone={(v) => { setBirth(v); setPickerOpen(false); }} />
      <HeigaiModal open={heigaiOpen} onClose={() => setHeigaiOpen(false)} onAgree={() => setHeigaiOpen(false)} />
      {noticeOpen && (
        <div className="absolute inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 fade-in" onClick={() => setNoticeOpen(false)} />
          <div className="sheet-up absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-xl max-h-[88%] flex flex-col">
            <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-warm-200">
              <h3 className="flex items-center gap-2 text-h5 font-bold text-neutral-800">
                <span className="rounded-full bg-[color:var(--secondary-color-10)] text-[color:var(--secondary-color-700)] px-2 py-[2px] text-[11px] font-bold leading-none">重要</span>
                重要事項・事前同意事項
              </h3>
              <button onClick={() => setNoticeOpen(false)} className="grid place-items-center w-8 h-8 rounded-full bg-warm-100 text-neutral-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="px-6 py-4 overflow-y-auto no-sb space-y-6">
              <p className="text-caption text-neutral-500 leading-relaxed">
                お申込み前に、以下の内容を必ずご確認ください。
              </p>

              <div className="space-y-6">
                <p className="flex items-center gap-2 text-h6 font-bold text-neutral-800">
                  <span className="rounded-full bg-primary-10 text-primary-700 px-2 py-[2px] text-[11px] font-bold leading-none">事前同意</span>
                  事前同意事項
                </p>
                <NoticeContent />
              </div>
            </div>
            <div className="px-6 py-3 border-t border-warm-200">
              <Btn kind="button" onClick={() => { setAgree(true); setNoticeOpen(false); }}>確認同意しました</Btn>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================================================================
   新規コンポーネント（Figma 🧩 Components ページ追加分）
================================================================ */

/* ---- StatusIcon ---- */
export function StatusIcon({ state = "Success", className }: {
  state?: "Success" | "Loading" | "Error" | "Maintenance" | "Cancelled" | "Locked";
  className?: string;
}) {
  const base = `relative flex items-center justify-center ${className ?? ""}`;
  if (state === "Error") {
    return (
      <div className={`${base} size-16`}>
        <img src="/assets/theo-tdf/icon_error.png" alt="エラー" className="w-full h-full object-contain" />
      </div>
    );
  }
  if (state === "Maintenance") {
    return (
      <div className={`${base} size-16`}>
        <img src="/assets/theo-tdf/icon_maint.png" alt="メンテナンス" className="w-full h-full object-contain" />
      </div>
    );
  }
  if (state === "Loading") {
    return (
      <div className={`${base} size-16 rounded-full`}>
        <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full animate-spin" fill="none">
          <circle cx="32" cy="32" r="26" stroke="#d6d3d1" strokeWidth="4" />
          <path d="M32 6 A26 26 0 0 1 58 32" stroke="#1aa5dc" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  if (state === "Cancelled") {
    return (
      <div className={`${base} size-16`}>
        <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" stroke="#b5b0ab" strokeWidth="2.5" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </div>
    );
  }
  if (state === "Locked") {
    return (
      <div className={`${base} size-[72px] rounded-[14px] bg-white border border-warm-200`}>
        <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9" stroke="#1aa5dc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          <circle cx="12" cy="16" r="1" fill="#1aa5dc" stroke="none" />
        </svg>
      </div>
    );
  }
  return (
    <div className={`${base} size-16 rounded-full bg-white shadow-sm`}>
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="#1aa5dc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

/* ---- AttentionNoticeCard ---- */
export function AttentionNoticeCard({ label, onClick }: {
  label?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-4 rounded-[14px] border-2 text-left transition-opacity hover:opacity-80"
      style={{ background: "#fff4f6", borderColor: "#ffaebd" }}
    >
      <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold text-white" style={{ background: "#ff3156" }}>重要</span>
      <span className="flex-1 text-h6 font-bold text-neutral-800 leading-snug">
        {label ?? "重要事項・事前同意事項を確認する"}
      </span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-neutral-400 shrink-0">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </button>
  );
}

/* ---- SegmentedToggle ---- */
export function SegmentedToggle({ options, value, onChange, error }: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => {
        const selected = opt === value;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 h-12 rounded-[10px] border text-h6 transition-colors ${
              error
                ? "border-[#d70027] bg-[#fff5f5] text-neutral-600"
                : selected
                  ? "border-primary bg-primary-10 text-primary-700 font-bold"
                  : "border-warm-300 bg-white text-neutral-600"
            }`}
            style={error ? { boxShadow: "0 0 0 1px #d70027" } : undefined}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

/* ---- AgreeCheckbox ---- */
export function AgreeCheckbox({ checked, onChange, children }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <span className="shrink-0 mt-0.5 grid place-items-center w-6 h-6 rounded-[4px] border-2 border-warm-300 bg-white transition-colors" style={checked ? { borderColor: "var(--color-primary)", background: "var(--color-primary)" } : undefined}>
        {checked && (
          <svg viewBox="0 0 12 10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-2.5">
            <path d="M1 5l3.5 3.5L11 1" />
          </svg>
        )}
      </span>
      <span className="text-caption text-neutral-700 leading-relaxed">
        {children ?? "上記の事前同意事項を確認し、同意します"}
      </span>
    </label>
  );
}

/* ---- NumberedStepCard ---- */
export type StepItem = { title: string; desc: string };

export function NumberedStepCard({ heading, steps }: {
  heading?: string;
  steps: StepItem[];
}) {
  return (
    <div className="w-full rounded-[16px] border border-warm-200 bg-white p-6">
      {heading && (
        <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-neutral-800 font-mono mb-3">{heading}</p>
      )}
      <div>
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center shrink-0 w-7">
                <span className="grid place-items-center w-7 h-7 rounded-full shrink-0 text-[13px] font-semibold" style={{ background: "#e9f2fe", color: "#054eba" }}>
                  {i + 1}
                </span>
                {!isLast && <div className="w-0.5 flex-1 min-h-6 my-1" style={{ background: "#62a0fb" }} />}
              </div>
              <div className={`flex-1 ${isLast ? "" : "pb-4"}`}>
                <p className="text-h6 font-bold text-neutral-800 leading-snug">{step.title}</p>
                <p className="mt-0.5 text-caption text-neutral-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- IconNoteCard ---- */
export function IconNoteCard({ iconSrc, children }: {
  iconSrc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] border border-warm-200 bg-white px-3 py-3.5">
      <img src={iconSrc} alt="" className="w-10 h-10 shrink-0 object-contain" />
      <p className="text-caption font-medium text-neutral-700 leading-relaxed">{children}</p>
    </div>
  );
}

/* ---- NoteBox ---- */
export function NoteBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] p-4" style={{ background: "#f5f5f4" }}>
      <p className="text-caption text-neutral-500 leading-relaxed">{children}</p>
    </div>
  );
}

/* ============================================================
   New Components — batch 2
   ============================================================ */

/* ---- Logo ---- */
export function Logo({ variant = "default", className }: {
  variant?: "default" | "blue";
  className?: string;
}) {
  const src = variant === "blue"
    ? "/assets/theo-tdf/dammy_logo_cyan.svg"
    : "/assets/theo-tdf/dammy_logo.svg";
  return (
    <img src={src} alt="くみこみ安心ほけん" className={`h-8 w-auto ${className ?? ""}`} />
  );
}

/* ---- PhoneStatusBar ---- */
export function PhoneStatusBar({ time = "9:41" }: { time?: string }) {
  return (
    <div className="flex items-center justify-between px-5 h-[37px] bg-white">
      <span className="text-[15px] font-semibold tracking-tight">{time}</span>
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 17 12" fill="none" className="w-4 h-3" aria-hidden>
          <rect x="0" y="6" width="3" height="6" rx="1" fill="currentColor" />
          <rect x="4.5" y="3.5" width="3" height="8.5" rx="1" fill="currentColor" />
          <rect x="9" y="1.5" width="3" height="10.5" rx="1" fill="currentColor" fillOpacity="0.35" />
          <rect x="13.5" y="0" width="3" height="12" rx="1" fill="currentColor" fillOpacity="0.35" />
        </svg>
        <svg viewBox="0 0 16 12" fill="none" className="w-4 h-3" aria-hidden>
          <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" fill="currentColor" />
          <path d="M4 6.5C5.5 5 6.7 4.5 8 4.5s2.5.5 4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M1 3.5C3 1.5 5.3.5 8 .5s5 1 7 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 25 12" fill="none" className="w-6 h-3" aria-hidden>
          <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="currentColor" strokeOpacity="0.35" />
          <rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor" />
          <path d="M23 4v4a2 2 0 0 0 0-4Z" fill="currentColor" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

/* ---- HomeIndicator ---- */
export function HomeIndicator() {
  return (
    <div className="flex justify-center items-end h-[23px] pb-1 bg-white">
      <div className="w-32 h-1 rounded-full bg-neutral-800 opacity-20" />
    </div>
  );
}

/* ---- DatePicker ---- */
export function DatePicker({ label, required, error, errMode = "inline", disabled }: {
  label: string;
  required?: boolean;
  error?: string;
  errMode?: "inline";
  disabled?: boolean;
}) {
  const hasError = !!error;
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-caption font-medium text-neutral-700">
        {label}{required && <ReqBadge />}
      </label>
      <div className={[
        "flex items-center h-[52px] rounded-[10px] border bg-white px-3.5 gap-2 transition-colors",
        hasError ? "border-[#d70027] shadow-[0_0_0_1px_#d70027]" : "border-warm-300",
        disabled ? "bg-warm-50 opacity-60 pointer-events-none" : "",
      ].join(" ")}>
        <span className="flex-1 text-h6 text-neutral-400">選択してください</span>
        <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 shrink-0 text-neutral-400" aria-hidden>
          <rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 2v4M13 2v4M3 9h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      {hasError && errMode === "inline" && <ErrText>{error}</ErrText>}
    </div>
  );
}

/* ---- NumberedSectionHeading ---- */
export function NumberedSectionHeading({ n, children }: {
  n: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="grid place-items-center w-6 h-6 rounded-full text-[13px] font-bold text-white shrink-0"
        style={{ backgroundImage: "linear-gradient(135deg, #075FE3 0%, #03CDFE 100%)" }}
      >
        {n}
      </span>
      <span className="text-h5 font-bold text-neutral-800">{children}</span>
    </div>
  );
}

/* ---- CardHeader ---- */
export type CardHeaderState = "Locked" | "Editable" | "Plain" | "Editing";

export function CardHeader({ title, state = "Plain", onEdit, onSave, onCancel }: {
  title: string;
  state?: CardHeaderState;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-h6 font-semibold text-neutral-800">{title}</span>
      {state === "Locked" && (
        <span className="flex items-center gap-1 text-caption text-neutral-400">
          <svg viewBox="0 0 14 16" fill="none" className="w-3.5 h-4" aria-hidden>
            <path d="M11 6V5a4 4 0 0 0-8 0v1H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1Z" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          変更不可
        </span>
      )}
      {state === "Editable" && (
        <button type="button" onClick={onEdit} className="flex items-center gap-1 text-caption font-medium text-primary">
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" aria-hidden>
            <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
          編集
        </button>
      )}
      {state === "Editing" && (
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCancel} className="text-caption text-neutral-500">キャンセル</button>
          <button type="button" onClick={onSave} className="text-caption font-semibold text-white px-3 py-1 rounded-full" style={{ background: "var(--color-primary)" }}>保存</button>
        </div>
      )}
    </div>
  );
}

/* ---- ConfirmRow ---- */
export function ConfirmRow({ label, children }: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-4 py-2.5 border-b border-warm-100 last:border-0">
      <span className="text-caption text-neutral-500 shrink-0" style={{ minWidth: 72 }}>{label}</span>
      <span className="text-caption font-medium text-neutral-800 flex-1 leading-relaxed">{children}</span>
    </div>
  );
}

/* ---- AddressRow ---- */
export function AddressRow({ label = "住所", postalCode, address }: {
  label?: string;
  postalCode: string;
  address: string;
}) {
  return (
    <div className="flex items-start gap-4 py-2.5 border-b border-warm-100 last:border-0">
      <span className="text-caption text-neutral-500 shrink-0" style={{ minWidth: 72 }}>{label}</span>
      <div className="flex-1">
        <p className="text-caption font-medium text-neutral-800">〒{postalCode}</p>
        <p className="text-caption font-medium text-neutral-800 leading-relaxed mt-0.5">{address}</p>
      </div>
    </div>
  );
}

/* ---- ConfirmCard ---- */
export function ConfirmCard({ title, state, children }: {
  title: string;
  state?: CardHeaderState;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full rounded-[16px] border border-warm-200 bg-white px-4 pt-2 pb-1">
      <CardHeader title={title} state={state ?? "Plain"} />
      <div>{children}</div>
    </div>
  );
}

/* ---- AccordionDropdown ---- */
export function AccordionDropdown({ title, children, open, onToggle }: {
  title: string;
  children?: React.ReactNode;
  open?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="w-full rounded-[14px] border border-warm-200 bg-white overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-4 text-left"
        onClick={onToggle}
      >
        <span className="text-h6 font-medium text-neutral-800">{title}</span>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 text-caption text-neutral-600 leading-relaxed border-t border-warm-100 pt-3">
          {children ?? <p className="text-neutral-400">コンテンツエリア</p>}
        </div>
      )}
    </div>
  );
}

/* ---- NumberedDisclosureItem ---- */
export function NumberedDisclosureItem({ n, title, children, open, onToggle }: {
  n: number;
  title: string;
  children?: React.ReactNode;
  open?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="w-full rounded-[14px] border border-warm-200 bg-white overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
        onClick={onToggle}
      >
        <span
          className="grid place-items-center w-6 h-6 rounded-full text-[13px] font-bold text-neutral-700 shrink-0"
          style={{ background: "#cccccc" }}
        >
          {n}
        </span>
        <span className="flex-1 text-h6 font-medium text-neutral-800">{title}</span>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 text-caption text-neutral-600 leading-relaxed border-t border-warm-100 pt-3">
          {children ?? <p className="text-neutral-400">コンテンツエリア</p>}
        </div>
      )}
    </div>
  );
}

/* ---- GenderField ---- */
export function GenderField({ value, onChange, required, error }: {
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-caption font-medium text-neutral-700">
        性別{required && <ReqBadge />}
      </label>
      <SegmentedToggle options={["男性", "女性"]} value={value} onChange={onChange} error={error} />
    </div>
  );
}

/* ---- BirthDateGenderBlock ---- */
export function BirthDateGenderBlock({ birthDateError, genderValue = "", genderError, onGenderChange }: {
  birthDateError?: string;
  genderValue?: string;
  genderError?: boolean;
  onGenderChange?: (v: string) => void;
}) {
  return (
    <div className="w-full rounded-[16px] border border-warm-200 bg-white px-4 py-5">
      <h3 className="text-h5 font-bold text-neutral-800">生年月日・性別</h3>
      <p className="text-caption text-neutral-500 mt-0.5 mb-4">お客様情報。保険料の算出に使用します。</p>
      <div className="flex flex-col gap-4">
        <DatePicker label="生年月日" required error={birthDateError} />
        <GenderField value={genderValue} onChange={onGenderChange ?? (() => {})} required error={genderError} />
      </div>
    </div>
  );
}

/* ---- SelectedPlanBadge ---- */
export function SelectedPlanBadge({ planType, deathCoverage }: {
  planType?: string;
  deathCoverage?: boolean;
}) {
  return (
    <div className="inline-flex items-start gap-2 rounded-[10px] border border-warm-200 bg-white px-3 py-2">
      <span className="text-caption text-neutral-500 shrink-0">選択プラン</span>
      <div className="flex flex-wrap gap-1.5">
        {planType && <span className="text-caption font-semibold text-neutral-800">{planType}</span>}
        {deathCoverage && <span className="text-caption font-semibold text-neutral-800">死亡保障あり</span>}
      </div>
    </div>
  );
}

/* ---- SliderField ---- */
export function SliderField({ label, value, min, max, step = 1, onChange, formatValue, minLabel, maxLabel }: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange?: (v: number) => void;
  formatValue?: (v: number) => string;
  minLabel?: string;
  maxLabel?: string;
}) {
  const fv = formatValue ?? ((v: number) => v.toLocaleString());
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-caption font-medium text-neutral-700">{label}</span>
        <span className="text-h5 font-bold" style={{ color: "var(--color-primary)" }}>{fv(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange ? (e) => onChange(Number(e.target.value)) : undefined}
        readOnly={!onChange}
        className="w-full h-1 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: "var(--color-primary)" }}
      />
      {(minLabel || maxLabel) && (
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px] text-neutral-400">{minLabel}</span>
          <span className="text-[11px] text-neutral-400">{maxLabel}</span>
        </div>
      )}
    </div>
  );
}

/* ---- PremiumSimulationCard ---- */
export function PremiumSimulationCard({ m, setM, y, setY, premium = 980, planType, deathCoverage }: {
  m: number;
  setM: (v: number) => void;
  y: number;
  setY: (v: number) => void;
  premium?: number;
  planType?: string;
  deathCoverage?: boolean;
}) {
  const [tableOpen, setTableOpen] = React.useState(false);
  return (
    <div className="w-full rounded-[16px] border border-warm-200 bg-white p-5">
      {(planType || deathCoverage) && (
        <div className="mb-4">
          <SelectedPlanBadge planType={planType} deathCoverage={deathCoverage} />
        </div>
      )}
      <p className="text-caption text-neutral-500 mb-5 leading-relaxed">
        保障する積立金額や保障期間を選択して、毎月の保険料を確認してみましょう。
      </p>
      <div className="flex flex-col gap-6">
        <SliderField
          label="毎月の積立金額"
          value={m}
          min={5000}
          max={150000}
          step={1000}
          onChange={setM}
          formatValue={(v) => `${v.toLocaleString()}円`}
          minLabel="5,000円"
          maxLabel="150,000円"
        />
        <SliderField
          label="保障期間"
          value={y}
          min={5}
          max={30}
          step={1}
          onChange={setY}
          formatValue={(v) => `${v}年`}
          minLabel="5年"
          maxLabel="30年"
        />
      </div>
      <div className="mt-5 pt-4 border-t border-warm-100 flex items-baseline justify-between">
        <span className="text-caption text-neutral-500">初年度の月払保険料</span>
        <span className="font-bold leading-none" style={{ color: "var(--color-primary)", fontSize: 28 }}>
          {premium.toLocaleString()}<span className="text-h6 font-semibold">円</span>
        </span>
      </div>
      <div className="mt-3">
        <AccordionDropdown
          title="保険料テーブルをみる"
          open={tableOpen}
          onToggle={() => setTableOpen(!tableOpen)}
        >
          <p className="text-neutral-400">保険料テーブルの内容がここに表示されます。</p>
        </AccordionDropdown>
      </div>
    </div>
  );
}
