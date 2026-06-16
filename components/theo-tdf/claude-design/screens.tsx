"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import * as React from "react";
import { useState, useRef, useEffect } from "react";

/* ============================================================
   THEO 組込保険 — Screens + shared wireframe atoms
   原典: TD 組込1.4-handoff (2026-06-16 取り込み)
   ============================================================ */

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
  download?: string;
  note?: string;
  table?: string[][];
};

export type AgreeItemData = {
  t: string;
  blocks: AgreeBlock[];
};

type Go = (n: number) => void;

/* ============================================================
   ICONS
   ============================================================ */
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

/* ============================================================
   ATOMS
   ============================================================ */
export function Badge({ children, tone = "secondary" }: { children: React.ReactNode; tone?: "secondary" | "primary" | "warm" }) {
  const map: Record<string, string> = {
    secondary: "bg-[color:var(--secondary-color-10)] text-[color:var(--secondary-color-700)]",
    primary: "bg-primary-10 text-primary-700",
    warm: "bg-warm-100 text-neutral-500",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-caption font-medium ${map[tone] ?? map.secondary}`}>
      {children}
    </span>
  );
}

export function PH({ className = "", label }: { className?: string; label: string }) {
  return <div className={`rounded-xl bg-warm-100 flex items-center justify-center text-neutral-400 text-caption border border-warm-200 ${className}`}>{label}</div>;
}

export function Btn({ kind = "button", children, onClick, disabled, full = true }: {
  kind?: "cta" | "button" | "danger" | "outline" | "ghost";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  full?: boolean;
}) {
  const base = "inline-flex items-center justify-center gap-1.5 rounded-xl px-4 h-16 text-h7 font-bold transition-colors active:scale-[.99]";
  const kinds: Record<string, string> = {
    cta:     "bg-button-500 text-white hover:bg-button-600",
    button:  "bg-button-500 text-white hover:bg-button-600",
    danger:  "bg-cta-500 text-white hover:bg-cta-600",
    outline: "border border-button-500 bg-white text-button-500 hover:bg-button-10",
    ghost:   "text-neutral-500 hover:text-neutral-800",
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ opacity: disabled ? 0.4 : 1 }}
      className={`${base} ${kinds[kind]} ${full ? "w-full" : ""} ${disabled ? "cursor-not-allowed" : ""}`}>
      {children}
    </button>
  );
}

export function AppBar({ title, onBack, brandVisible = true }: { title: string; onBack?: () => void; brandVisible?: boolean }) {
  if (title === "お申込み完了") {
    return <div className="sticky top-0 z-20 bg-primary text-primary-foreground h-14" />;
  }
  return (
    <div className="sticky top-0 z-20 bg-primary text-primary-foreground">
      <div className="flex items-center justify-between px-3 h-14">
        <button onClick={onBack} className="grid place-items-center w-9 h-9 -ml-1 rounded-full hover:bg-white/10">
          {onBack ? <Ic.chevL className="w-5 h-5" /> : <span className="w-5" />}
        </button>
        <div className={`flex items-center gap-1.5 min-w-0 transition-opacity duration-200 ${brandVisible ? "opacity-100" : "opacity-0"}`}>
          <span className="font-en font-semibold tracking-[0.1em] text-h7">THEO</span>
          <span className="text-h7 font-medium truncate">つみたて安心ほけん</span>
          <span className="font-en text-[10px] font-medium opacity-75 shrink-0">&lt;THEO&gt;</span>
        </div>
        <span className="w-9 shrink-0" />
      </div>
    </div>
  );
}

const STEP_TO_SCREEN: Record<number, number> = { 1: 0, 2: 1, 3: 3, 4: 4, 5: 7 };
export function Steps({ n, of: total = 5, go }: { n: number; of?: number; go?: Go }) {
  return (
    <div className="flex justify-center items-center gap-0 px-5 py-2 bg-white border-b border-warm-200">
      {Array.from({ length: total }).map((_, i) => {
        const stepNo = i + 1;
        const filled = i < n;
        const active = i + 1 === n;
        const clickable = filled && typeof go === "function" && STEP_TO_SCREEN[stepNo] != null;
        return (
          <div key={i} className="flex items-center">
            <button type="button" disabled={!clickable}
              onClick={clickable ? () => go!(STEP_TO_SCREEN[stepNo]) : undefined}
              aria-label={`STEP ${stepNo}`}
              className={`grid place-items-center w-7 h-7 rounded-full border-2 shrink-0 font-en text-[10px] font-bold transition-colors
                ${active ? "border-primary bg-primary text-white" : filled ? "border-primary bg-white text-primary" : "border-warm-300 bg-white text-neutral-400"}
                ${clickable ? "cursor-pointer hover:shadow-md" : "cursor-default"}`}>
              {stepNo}
            </button>
            {i < total - 1 && (
              <div className={`w-8 h-0.5 transition-colors ${i + 1 < n ? "bg-primary" : "bg-warm-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-neutral-400 mb-2">{children}</p>;
}

export function GroupCard({ title, sub, icon, iconSrc, children, className }: {
  title: string;
  sub?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconSrc?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const Icon = icon;
  return (
    <div className={`rounded-2xl border border-warm-200 bg-white overflow-hidden ${className ?? ""}`}>
      <div className="flex items-center gap-3 px-5 py-4 border-b border-warm-100 bg-warm-50">
        {iconSrc && <img src={iconSrc.replace("assets/", "/assets/theo-tdf/")} alt="" className="w-7 h-7" />}
        {Icon && <div className="grid place-items-center w-7 h-7 rounded-full bg-primary-10 text-primary-600"><Icon className="w-4 h-4" /></div>}
        <div>
          <p className="text-h7 font-bold text-neutral-800">{title}</p>
          {sub && <p className="text-caption text-neutral-500">{sub}</p>}
        </div>
      </div>
      <div className="px-5 py-4 space-y-3">{children}</div>
    </div>
  );
}

export function SubLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-caption font-bold text-neutral-500 pt-2 border-t border-warm-100">{children}</p>;
}

export function ActionBar({ children, bg, solid }: { children: React.ReactNode; bg?: string; solid?: boolean }) {
  return (
    <div className="sticky bottom-0 z-20 border-t border-warm-200 px-5 py-3 space-y-2.5 transition-colors"
      style={{ background: bg ?? (solid ? "white" : "white") }}>
      {children}
    </div>
  );
}

export function Field({ label, placeholder, required, hint, value, onChange, disabled }: {
  label: string; placeholder?: string; required?: boolean; hint?: string;
  value?: string; onChange?: React.ChangeEventHandler<HTMLInputElement>; disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-caption font-medium text-neutral-600">
        {label}{required && <span className="text-[color:var(--secondary-color-700)] ml-0.5">*</span>}
      </span>
      <input defaultValue={value} onChange={onChange} disabled={disabled} placeholder={placeholder}
        className="fld h-11 rounded-lg border border-warm-300 bg-warm-50 px-3 text-h7 text-neutral-800 placeholder:text-neutral-400 disabled:opacity-60" />
      {hint && <p className="text-[10px] text-neutral-400 leading-relaxed">{hint}</p>}
    </div>
  );
}

export function LockedField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-warm-200 bg-warm-50/60 px-3 h-11">
      <span className="text-caption text-neutral-500">{label}</span>
      <span className="flex items-center gap-1.5 text-h7 text-neutral-700 font-medium">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-neutral-400">
          <rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
        </svg>
        {value}
      </span>
    </div>
  );
}

export const PREFS = ["都道府県を選択","北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"];

export function Select({ label, required, value, options, hint, onChange, disabled }: {
  label: string; required?: boolean; value?: string;
  options?: string[]; hint?: string; onChange?: React.ChangeEventHandler<HTMLSelectElement>; disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-caption font-medium text-neutral-600">
        {label}{required && <span className="text-[color:var(--secondary-color-700)] ml-0.5">*</span>}
      </span>
      <select value={value} onChange={onChange} disabled={disabled}
        className="fld h-11 rounded-lg border border-warm-300 bg-warm-50 px-3 text-h7 text-neutral-800 disabled:opacity-60 appearance-none">
        {(options ?? PREFS).map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {hint && <p className="text-[10px] text-neutral-400 leading-relaxed">{hint}</p>}
    </div>
  );
}

export function StepSection({ label, n, big, className, children }: {
  label: string; n?: number; big?: boolean; className?: string; children: React.ReactNode;
}) {
  if (big) {
    return (
      <section className={`space-y-4 ${className ?? ""}`}>
        <div className="flex items-center gap-3">
          {n != null && (
            <span className="grid place-items-center w-8 h-8 rounded-full bg-primary text-white font-en text-h6 font-bold shrink-0">{n}</span>
          )}
          <h2 className="text-h5 font-bold text-neutral-800">{label}</h2>
        </div>
        {children}
      </section>
    );
  }
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        {n != null && (
          <span className="grid place-items-center w-8 h-8 rounded-full bg-primary text-white font-en text-h6 font-bold shrink-0">{n}</span>
        )}
        <span className="font-mono text-caption tracking-[0.14em] uppercase text-primary-600 whitespace-nowrap">{label}</span>
        <span className="flex-1 h-px bg-warm-200" />
      </div>
      {children}
    </section>
  );
}

/* ============================================================
   DRUM-ROLL DATE PICKER
   ============================================================ */
const WHEEL_ITEM = 38;
const WHEEL_VISIBLE = 5;
const WHEEL_H = WHEEL_ITEM * WHEEL_VISIBLE;
const WHEEL_PAD = (WHEEL_H - WHEEL_ITEM) / 2;

function WheelCol({ items, index, onChange, flex, align }: {
  items: string[]; index: number; onChange: (i: number) => void;
  flex?: number; align?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [cur, setCur] = useState(index);
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const programmatic = useRef(false);

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
    if (live !== cur) setCur(live);
    if (programmatic.current) return;
    if (settle.current != null) clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      const i = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / WHEEL_ITEM)));
      el.scrollTo({ top: i * WHEEL_ITEM, behavior: "smooth" });
      if (i !== index) onChange(i);
    }, 90);
  };

  return (
    <div ref={ref} onScroll={handleScroll} className="no-sb overflow-y-scroll"
      style={{
        height: WHEEL_H, flex: flex ?? 1, scrollSnapType: "y mandatory",
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

function daysInMonth(y: number, m: number) { return new Date(y, m, 0).getDate(); }
function pad2(n: number) { return String(n).padStart(2, "0"); }
export function fmtBirth(v: string) {
  if (!v) return "";
  const [y, m, d] = v.split("-").map(Number);
  return `${y}年 ${m}月 ${d}日`;
}

function DateDrumSheet({ open, value, onClose, onDone }: {
  open: boolean; value: string;
  onClose: () => void; onDone: (v: string) => void;
}) {
  const NOW = new Date();
  const MIN_Y = 1925, MAX_Y = NOW.getFullYear();
  const years: number[] = [];
  for (let v = MAX_Y; v >= MIN_Y; v--) years.push(v);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const init = value ? value.split("-").map(Number) : [1990, 1, 1];
  const [yy, setYy] = useState(init[0]);
  const [mm, setMm] = useState(init[1]);
  const [dd, setDd] = useState(init[2]);

  useEffect(() => {
    if (!open) return;
    const v = value ? value.split("-").map(Number) : [1990, 1, 1];
    setYy(v[0]); setMm(v[1]); setDd(v[2]);
  }, [open]);

  const dim = daysInMonth(yy, mm);
  const days = Array.from({ length: dim }, (_, i) => i + 1);
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
          <button onClick={onClose} className="text-h7 text-neutral-500 px-1 py-1">キャンセル</button>
          <span className="text-caption font-bold text-neutral-700">生年月日</span>
          <button onClick={() => onDone(`${yy}-${pad2(mm)}-${pad2(dd)}`)}
            className="text-h7 font-bold text-primary-600 px-1 py-1">完了</button>
        </div>
        <div className="relative px-3 py-2">
          <div className="pointer-events-none absolute left-3 right-3 rounded-lg bg-warm-100/70 border-y border-warm-200"
            style={{ top: WHEEL_PAD + 8, height: WHEEL_ITEM }} />
          <div className="relative flex">
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

/* ============================================================
   PLANS
   ============================================================ */
export const PLANS: Plan[] = [
  { id: "a", name: "障害・介護", price: "¥480", lead: "障害・介護状態になった場合に、給付金が支払われます",
    feat: ["給付：月額 最大 ¥50,000", "保険期間：1年（自動更新）", "免責期間：60日"] },
  { id: "b", name: "がん", price: "¥980", lead: "初めてがんと診断された場合に、給付金が支払われます",
    feat: ["診断一時金：¥300,000", "保険期間：1年", "告知のみ・診査不要"] },
  { id: "c", name: "安心セット", tag: "おすすめ", price: "¥1,290", lead: "障害・介護状態になった場合、または初めてがんと診断された場合に、給付金が支払われます",
    feat: ["障害・介護：月額 最大 ¥50,000", "がん診断一時金：¥300,000", "保険期間：1年（自動更新）"] },
];

function PlanCard({ p, selected, onSelect }: { p: Plan; selected: boolean; onSelect: () => void }) {
  return (
    <button onClick={onSelect} className={`w-full text-left rounded-2xl border bg-white overflow-hidden transition ${selected ? "border-primary ring-2 ring-primary/30" : "border-warm-200"}`}>
      <div className={`flex items-center justify-between gap-3 px-4 py-3 border-b transition-colors ${selected ? "bg-primary-10 border-primary-100" : "bg-warm-50 border-warm-200"}`}>
        <div className="flex items-center gap-2">
          <span className={`grid place-items-center w-5 h-5 rounded-full border-2 ${selected ? "border-primary bg-primary text-white" : "border-warm-300"}`}>
            {selected && <Ic.check className="w-3 h-3" />}
          </span>
          <span className="text-h7 font-bold text-neutral-800">{p.name}</span>
        </div>
        {p.tag && <Badge tone="secondary">{p.tag}</Badge>}
      </div>
      <div className="p-4">
        <p className="text-caption text-neutral-500">{p.lead}</p>
        <div className="mt-3 flex items-baseline justify-end gap-1 text-neutral-800">
          <span className="font-en text-h4 font-semibold tabular-nums">{p.price.replace("¥", "")}</span>
          <span className="text-caption"> 円 / 月</span>
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
  );
}

/* ============================================================
   SIMULATOR (shared between ScreenStep2 and ScreenForm sheet)
   ============================================================ */
function SimSliders({ m, setM, y, setY, onInput }: {
  m: number; setM: React.Dispatch<React.SetStateAction<number>>;
  y: number; setY: React.Dispatch<React.SetStateAction<number>>;
  onInput?: () => void;
}) {
  const yen = (v: number) => v.toLocaleString("ja-JP");
  const sliderStyle = { accentColor: "var(--primary-color-500)" };
  const onM = (e: React.ChangeEvent<HTMLInputElement>) => { setM(+e.target.value); onInput?.(); };
  const onY = (e: React.ChangeEvent<HTMLInputElement>) => { setY(+e.target.value); onInput?.(); };
  return (
    <>
      <div className="mb-5">
        <div className="flex items-start justify-between gap-2">
          <span className="text-h7 font-medium text-neutral-800 leading-snug">毎月の積立金額<br/><span className="text-caption text-neutral-500">（ご希望給付額）</span></span>
          <span className="text-neutral-800">
            <span className="font-en text-h5 font-semibold text-primary-600 tabular-nums">{yen(m)}</span>
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
          <span className="text-h7 font-medium text-neutral-800">保障期間</span>
          <span className="text-neutral-800">
            <span className="font-en text-h5 font-semibold text-primary-600 tabular-nums">{y}</span>
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

function BenefitTable({ m, y, plan }: { m: number; y: number; plan: Plan | undefined }) {
  const startAge = 30;
  const man = (v: number) => Math.round(v / 10000).toLocaleString("ja-JP");
  const yen = (v: number) => v.toLocaleString("ja-JP");
  const annual = m * 12;
  const maxBenefit = annual * y;
  const premiumPerMonth = plan?.price ? parseInt(plan.price.replace(/[^0-9]/g, ""), 10) : 0;
  const rows = Array.from({ length: y + 1 }, (_, n) => ({
    n, age: startAge + n, premium: premiumPerMonth,
    benefit: annual * (y - n), cum: annual * n,
  }));
  return (
    <>
      <div className="flex items-center justify-between rounded-xl bg-primary-10 px-4 py-3">
        <span className="text-caption font-medium text-primary-700">最大給付金額　0年目</span>
        <span className="text-primary-600">
          <span className="font-en text-h3 font-semibold tabular-nums">{man(maxBenefit)}</span>
          <span className="text-h7"> 万円</span>
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

function Simulator({ m, setM, y, setY, initialSimOpen, infoSlot, planName, plan }: {
  m: number; setM: React.Dispatch<React.SetStateAction<number>>;
  y: number; setY: React.Dispatch<React.SetStateAction<number>>;
  initialSimOpen?: boolean; infoSlot?: React.ReactNode;
  planName?: string | null; plan: Plan | undefined;
}) {
  const [open, setOpen] = useState(initialSimOpen ?? false);
  const shouldShowLabel = planName && ["安心セット", "がん", "障害・介護"].includes(planName);
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
      <button onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full mt-4 pt-4 border-t border-warm-200 text-left">
        <span className="text-h7 font-bold text-neutral-800">給付予想額をみる</span>
        <span className={`grid place-items-center w-7 h-7 rounded-full bg-warm-100 text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`}>
          <Ic.chevR className="w-4 h-4 rotate-90" />
        </span>
      </button>
      <div style={{ maxHeight: open ? "1600px" : "0px", opacity: open ? 1 : 0, marginTop: open ? "16px" : "0px" }}
        className="overflow-hidden transition-all duration-300 ease-out">
        <BenefitTable m={m} y={y} plan={plan} />
      </div>
    </div>
  );
}

/* ============================================================
   SCREEN — Intro (新追加: 導入画面)
   ============================================================ */
export function ScreenIntro({ go }: { go: Go }) {
  return (
    <>
      <AppBar title="保険" />
      <div className="flex-1 overflow-y-auto no-sb">
        <div className="bg-primary text-primary-foreground px-5 pt-6 pb-8">
          <img src="/assets/theo-tdf/logo_theo_insurance.svg" alt="THEO つみたて安心ほけん" className="h-7 mb-5" />
          <p className="font-en text-caption tracking-[0.18em] uppercase opacity-80">Embedded Insurance</p>
          <h1 className="mt-2 text-h3 font-bold leading-snug">信頼を、もっと<br/>触れる距離に。</h1>
          <p className="mt-3 text-h7 leading-relaxed opacity-90">THEO の資産運用に、<br/>もしものときの備えをひとつに。</p>
          <div className="mt-4"><Badge>重要</Badge></div>
        </div>
        <div className="px-5 py-6 space-y-6">
          <div className="rounded-2xl border border-warm-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="font-mono text-caption tracking-[0.14em] uppercase text-neutral-400">このアプリだけの備え</p>
              <img src="/assets/theo-tdf/logo_td.png" alt="T&Dフィナンシャル生命" className="h-4 shrink-0" />
            </div>
            <p className="text-h6 font-bold text-neutral-800 leading-relaxed">
              働けなくなっても、<br/>つみたては止めない。
            </p>
            <p className="mt-2 text-caption text-neutral-500 leading-relaxed">
              就業不能時に、毎月の積立額を保険金として給付。資産形成の歩みを止めません。
            </p>
            <div className="mt-4 rounded-lg border border-warm-200 overflow-hidden bg-white">
              <img src="/assets/theo-tdf/hero-chart.png" alt="就業不能時も将来の積立金額を保障するイメージ図" className="w-full block" />
            </div>
          </div>
          <div className="space-y-3">
            {([
              { i: Ic.shield, t: "申込みは10分", d: "クレジットカード払い。入力は最小限。" },
              { i: Ic.chart,  t: "マイページでかんたん運用管理", d: "保険料の変更、給付額の変更、ご請求、控除証明書。" },
              { i: Ic.heart,  t: "少額から、毎月", d: "月額数百円から。いつでも見直し可能。" },
            ] as const).map((v, k) => (
              <div key={k} className="flex items-start gap-3 rounded-xl border border-warm-200 bg-white p-4">
                <div className="grid place-items-center w-10 h-10 rounded-full bg-primary-10 text-primary-600 shrink-0">
                  <v.i className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-h7 font-bold text-neutral-800">{v.t}</p>
                  <p className="text-caption text-neutral-500 leading-relaxed">{v.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-end justify-between rounded-xl bg-warm-100 px-5 py-4">
            <span className="text-caption text-neutral-500">保険料</span>
            <span className="text-neutral-800">
              <span className="font-en text-h2 font-semibold">480</span>
              <span className="text-h7"> 円 / 月〜</span>
            </span>
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
   SCREEN 1 — 商品概要 (ScreenOverview)
   ============================================================ */
export function ScreenOverview({ go }: { go: Go }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [solid, setSolid] = useState(false);
  const bindScroll = (el: (HTMLDivElement & { __bound?: boolean }) | null) => {
    if (!el || el.__bound) return;
    el.__bound = true;
    el.addEventListener("scroll", () => {
      const h = heroRef.current;
      setSolid(el.scrollTop >= (h ? h.offsetHeight - 16 : 220));
    }, { passive: true });
  };
  return (
    <>
      <AppBar title="保険" brandVisible={solid} />
      <div ref={bindScroll} className="flex-1 overflow-y-auto no-sb">
        <div ref={heroRef} className="bg-primary text-primary-foreground px-5 pt-6 pb-8">
          <img src="/assets/theo-tdf/logo_theo_insurance.svg" alt="THEO つみたて安心ほけん" className="mb-5" style={{ height: "2.275rem" }} />
          <p className="font-en text-caption tracking-[0.18em] uppercase opacity-80">Embedded Insurance</p>
          <h1 className="mt-2 font-bold leading-snug" style={{ fontSize: "36.4px", lineHeight: 1.3 }}>つみたてながら、<br/>もしもに備える。</h1>
          <p className="mt-3 text-h7 leading-relaxed opacity-90">将来に向けた資産形成のためのほけん</p>
        </div>

        <div className="sticky top-0 z-30">
          <Steps n={1} go={go} />
        </div>

        <div className="px-5 pt-6">
          <div className="space-y-6">
            <div className="-mx-1">
              <div className="flex items-center justify-end gap-3 mb-4">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[9px] text-neutral-400 leading-none whitespace-nowrap">引受保険会社</span>
                  <img src="/assets/theo-tdf/logo_td.png" alt="T&Dフィナンシャル生命" className="h-4" />
                </div>
              </div>
              <p className="text-h5 font-bold text-neutral-800 leading-relaxed">
                資産形成中の「もしも」に<br/>そなえる保障がTHEOで新登場！
              </p>
              <div className="mt-10 flex flex-col items-center gap-4">
                <img src="/assets/theo-tdf/logo_theo_insurance_blue.svg" alt="THEO つみたて安心 ほけん" className="h-[42px]" />
                <div className="w-full grid grid-cols-3 gap-3">
                  {[
                    { src: "/assets/theo-tdf/activity-heart-circle.svg", t: "積立も\nあんしんに" },
                    { src: "/assets/theo-tdf/graduation-cap.svg", t: "学資保険\nの代わりにも" },
                    { src: "/assets/theo-tdf/hand-holding-heart.svg", t: "もしもの\n備えに" },
                  ].map((f, k) => (
                    <div key={k} className="flex flex-col items-center text-center gap-2">
                      <img src={f.src} alt="" className="w-9 h-9" />
                      <p className="text-caption font-bold text-neutral-700 leading-snug whitespace-pre-line">{f.t}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 overflow-hidden">
                <img src="/assets/theo-tdf/chart_savings.png" alt="就業不能時も将来の積立金額を保障するイメージ図" className="w-full block" />
              </div>
              <div className="mt-6 space-y-6 mb-9">
                <div className="text-right">
                  <a className="inline-flex items-center gap-1.5 font-bold text-h7 cursor-pointer" style={{ color: "#054EBA" }}>
                    <img src="/assets/theo-tdf/info-circle.svg" alt="" className="w-4 h-4" />
                    詳細なサービス内容はこちら
                  </a>
                </div>
                <div className="text-left">
                  <span className="inline-block text-h6 font-bold text-neutral-800 py-0.5 rounded">保険名称</span>
                  <p className="mt-2 text-h7 text-neutral-700">無配当特定疾病障害介護保障保険（団体型）</p>
                </div>
                <div className="text-left">
                  <span className="inline-block text-h6 font-bold text-neutral-800 py-0.5 rounded">保障期間</span>
                  <p className="mt-2 text-h7 text-neutral-700">5年〜40年（最大）</p>
                  <p className="mt-1 text-caption text-neutral-500 leading-relaxed">*保険期間は契約日（更新日）から1年であり、保障期間満了まで1年ごとの更新となります。</p>
                </div>
              </div>
            </div>

            <div className="-mx-5 mt-8 bg-primary-10 px-5 pt-10 pb-[18px]">
              <div className="mb-12">
                <div className="text-center">
                  <span className="inline-block text-h4 font-bold text-neutral-900 px-2 py-0.5 rounded">必要書類</span>
                  <p className="mt-2 text-h7 text-neutral-500">お手続きの際に必要となる書類を<br/>ご準備ください</p>
                </div>
                <div className="mt-2 flex flex-col items-center gap-1 px-4">
                  <Ic.cardArt className="w-20 h-auto text-primary-500" />
                  <span className="text-[11px] font-medium text-neutral-600">ご本人名義のクレジットカード</span>
                </div>
              </div>
              <div className="border-t border-primary-100 mb-[45px]" />
              <div className="text-center mb-5">
                <h2 className="text-h4 font-bold text-neutral-900 leading-snug text-balance">3つのプランから選ぶだけ</h2>
                <p className="mt-2 text-h7 text-neutral-500 leading-relaxed text-balance">最短10分で、お申し込みが完了します。</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div>
                  <p className="text-caption text-neutral-500">保険料</p>
                  <p className="text-neutral-900">
                    <span className="font-en text-h2 font-bold" style={{ color: "#054EBA" }}>480</span>
                    <span className="text-h7 font-bold"> 円 / 月〜</span>
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-caption font-bold shadow-sm" style={{ color: "#054EBA" }}>
                  <Ic.check className="w-3.5 h-3.5" />いつでも見直し・解約OK
                </span>
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

/* ============================================================
   SCREEN 2 — プラン選択
   ============================================================ */
export function ScreenStep2({ go, sel, setSel, m, setM, y, setY, initialNoticeOpen, initialAgree, initialSimOpen, initialShowSend }: {
  go: Go; sel: string; setSel: React.Dispatch<React.SetStateAction<string>>;
  m: number; setM: React.Dispatch<React.SetStateAction<number>>;
  y: number; setY: React.Dispatch<React.SetStateAction<number>>;
  initialNoticeOpen?: boolean; initialAgree?: boolean; initialSimOpen?: boolean; initialShowSend?: boolean;
}) {
  const plan = PLANS.find((p) => p.id === sel) ?? PLANS[0];
  const [agree, setAgree] = useState(initialAgree ?? false);
  const [noticeOpen, setNoticeOpen] = useState(initialNoticeOpen ?? false);
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const sendSecRef = useRef<HTMLDivElement>(null);
  const [showSend, setShowSend] = useState(initialShowSend ?? false);
  const bindScroll = (el: (HTMLDivElement & { __bound?: boolean }) | null) => {
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

  return (
    <>
      <AppBar title="保険" onBack={() => go(0)} />
      <div ref={bindScroll} className="flex-1 overflow-y-auto no-sb">
        <div className="sticky top-0 z-30"><Steps n={2} go={go} /></div>
        <div className="px-5 pt-6 pb-0 space-y-8">
          {/* 生年月日・性別 */}
          <div className="space-y-5">
            <div>
              <h2 className="text-h4 font-bold text-neutral-900 leading-snug text-balance">さっそく、はじめましょう。</h2>
              <p className="mt-2 text-h7 text-neutral-600 leading-relaxed text-balance">ご入力はかんたん。まずは保険料の算出に必要な情報からどうぞ。</p>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-h7 font-medium text-neutral-800 leading-snug">生年月日・性別</h3>
                <p className="text-caption text-neutral-500 mt-1">お客様情報。保険料の算出に使用します。</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-caption font-medium text-neutral-600">生年月日<span className="text-[color:var(--secondary-color-700)] ml-0.5">*</span></span>
                <button type="button" onClick={() => setPickerOpen(true)}
                  className={`fld flex items-center justify-between gap-2 h-11 rounded-lg border border-warm-300 bg-warm-50 px-3 text-h7 text-left ${birth ? "text-neutral-800" : "text-neutral-400"}`}>
                  <span className="truncate">{birth ? fmtBirth(birth) : "選択してください"}</span>
                  <Ic.chevR className="w-4 h-4 shrink-0 text-neutral-400 rotate-90" />
                </button>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-caption font-medium text-neutral-600">性別<span className="text-[color:var(--secondary-color-700)] ml-0.5">*</span></span>
                <div className="flex gap-2">
                  {["男性", "女性"].map((g) => (
                    <button key={g} onClick={() => setGender(g)}
                      className={`flex-1 h-11 rounded-lg border text-h7 transition-colors ${gender === g ? "border-primary bg-primary-10 text-primary-700 font-bold" : "border-warm-300 bg-warm-50 text-neutral-600"}`}>{g}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* プラン選択 */}
          <StepSection label="プランを選ぶ" n={1} big className="mt-8">
            <p className="text-caption text-neutral-500">ご希望の保障プランをご選択ください</p>
            {PLANS.map((p) => (
              <PlanCard key={p.id} p={p} selected={sel === p.id} onSelect={() => setSel(p.id)} />
            ))}
            <p className="text-caption text-neutral-500 leading-relaxed px-1">※ 保険料は年齢・性別により変動します。</p>
          </StepSection>

          {/* シミュレーション */}
          <div className="-mx-5 px-5 py-6 relative" style={{ background: "var(--warm-100)" }}>
            <StepSection label="保険料シミュレーション" n={2} big className="mt-8">
              <Simulator m={m} setM={setM} y={y} setY={setY} initialSimOpen={initialSimOpen}
                planName={sel ? PLANS.find((p) => p.id === sel)?.name ?? null : null} plan={plan} />
            </StepSection>
          </div>

          {/* 申し込みをする */}
          <div className="-mx-5 px-5 py-6" style={{ background: "#e7edf7" }}>
            <StepSection label="申し込みをする" n={3} big className="mt-8">
              <div className="rounded-2xl border border-warm-200 bg-white p-5 space-y-3">
                <h3 className="text-h7 font-bold text-neutral-800">メールアドレスのご入力</h3>
                <p className="text-caption text-neutral-600 leading-relaxed">
                  ご入力されたメールアドレス宛に、お申し込み手続きのご案内URLをお送りします。
                </p>
                <Field label="メールアドレス" placeholder="samplename@sample.co.jp" required />
              </div>
              <div ref={sendSecRef} className="rounded-2xl border border-warm-200 bg-white p-5 space-y-3">
                <h3 className="text-h7 font-bold text-neutral-800">事前同意事項のご確認</h3>
                <p className="text-caption text-neutral-600 leading-relaxed">お申し込み前に、下記より重要事項・事前同意事項を必ずご確認ください。</p>
                <button onClick={() => setNoticeOpen(true)}
                  className="flex items-center justify-between w-full rounded-xl border-2 border-[color:var(--secondary-color-200)] bg-[color:var(--secondary-color-10)] px-4 py-4 text-left">
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className="rounded-full bg-[color:var(--secondary-color-600)] text-white px-2 py-0.5 text-[11px] font-bold leading-none shrink-0">重要</span>
                    <span className="text-h7 font-bold text-neutral-800">重要事項・事前同意事項を確認する</span>
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

      <ActionBar bg={showSend ? "#e7edf7" : undefined}>
        <div className="flex items-start gap-2 px-1 text-caption text-neutral-600 leading-relaxed">
          <Ic.doc className="w-4 h-4 mt-0.5 text-neutral-400 shrink-0" />
          申込みには、ご本人様名義のクレジットカードが必要です
        </div>
        {showSend && (
          <div className="fade-in space-y-2">
            <Btn kind="cta" onClick={() => go(2)} disabled={!agree}>上記に同意してメールを送信</Btn>
            {!agree && <p className="text-center text-caption text-neutral-400">同意いただくと送信できます</p>}
          </div>
        )}
      </ActionBar>

      {/* 生年月日ドラムロール */}
      <DateDrumSheet open={pickerOpen} value={birth}
        onClose={() => setPickerOpen(false)}
        onDone={(v) => { setBirth(v); setPickerOpen(false); }} />

      {/* 重要事項ボトムシート */}
      {noticeOpen && (
        <div className="absolute inset-0 z-40">
          <div className="absolute inset-0 bg-black/40 fade-in" onClick={() => setNoticeOpen(false)} />
          <div className="sheet-up absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-xl max-h-[88%] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-warm-200">
              <h3 className="flex items-center gap-2 text-h6 font-bold text-neutral-800">
                <span className="rounded-full bg-[color:var(--secondary-color-10)] text-[color:var(--secondary-color-700)] px-2 py-0.5 text-[11px] font-bold leading-none">重要</span>
                重要事項・事前同意事項
              </h3>
              <button onClick={() => setNoticeOpen(false)} className="grid place-items-center w-8 h-8 rounded-full bg-warm-100 text-neutral-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="px-5 py-4 overflow-y-auto no-sb space-y-5">
              <p className="text-caption text-neutral-500 leading-relaxed">お申込み前に、以下の内容を必ずご確認ください。</p>
              <div className="space-y-5">
                <p className="flex items-center gap-2 text-h7 font-bold text-neutral-800">
                  <span className="rounded-full bg-primary-10 text-primary-700 px-2 py-0.5 text-[11px] font-bold leading-none">事前同意</span>
                  事前同意事項
                </p>
                <section className="space-y-1.5">
                  <h4 className="text-h7 font-bold text-neutral-800">この保険について</h4>
                  <ul className="space-y-1.5 text-caption text-neutral-600 leading-relaxed">
                    <li>・株式会社三菱ＵＦＪ銀行を団体契約者とし、Money Canvas会員の皆さま、会員のご家族を被保険者とする団体契約です。Money Canvas会員の資格を喪失された場合、保険契約は解約いただく、もしくは更新できませんので、ご注意ください。また、保険証券を請求する権利、保険契約を解約する権利等は原則として株式会社 三菱ＵＦＪ銀行が有します。</li>
                    <li>・この契約は、申込み日が17日までの場合は、翌月1日（0時）より補償が開始し、申込み日が18日から末日までの場合は、翌々月1日（0時）より補償が開始します。</li>
                    <li>・満期日までにご加入者から更新しない旨のお申出がなければ、団体の取り決めにより原則自動更新されます。</li>
                  </ul>
                </section>
                <section className="space-y-1.5">
                  <h4 className="text-h7 font-bold text-neutral-800">個人情報の取扱いについて</h4>
                  <ul className="space-y-1.5 text-caption text-neutral-600 leading-relaxed">
                    <li>・団体契約者である株式会社三菱ＵＦＪ銀行は、お客さまにご入力いただく個人情報を、以下の目的で利用させていただきます。</li>
                    <li>・お客さまに関する情報は、保険契約上必要な範囲で引受保険会社に提供し、契約の引受・維持管理、保険金等のお支払いの目的で利用させていただきます。</li>
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
   SCREEN — PINコード認証
   ============================================================ */
export function ScreenPin({ go, initialPin }: { go: Go; initialPin?: string }) {
  const [pin, setPin] = useState(initialPin ?? "");
  return (
    <>
      <AppBar title="保険" onBack={() => go(1)} />
      <div className="flex-1 overflow-y-auto no-sb">
        <Steps n={3} go={go} />
        <div className="px-5 py-8 flex flex-col items-center text-center">
          <img src="/assets/theo-tdf/logo_theo_insurance_blue.svg" alt="THEO つみたて安心ほけん" className="h-8 mb-6" />
          <div className="grid place-items-center w-16 h-16 rounded-full bg-primary-10 text-primary-600 mb-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
              <rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
            </svg>
          </div>
          <h1 className="text-h4 font-bold text-neutral-800">PINコードの入力</h1>
          <p className="mt-3 text-h7 text-neutral-600 leading-relaxed">
            ご登録のメールアドレスに、認証用のPINコードをお送りしました。メールに記載の6桁のPINコードを入力してください。
          </p>
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
            inputMode="numeric"
            placeholder="______"
            className="fld mt-7 w-full max-w-[260px] h-14 rounded-xl border border-warm-300 bg-warm-50 text-center font-en font-semibold text-h2 tracking-[0.45em] text-neutral-800"
          />
          <button className="mt-4 text-caption text-button-500 underline underline-offset-2">PINコードを再送する</button>
        </div>
      </div>
      <ActionBar>
        <p className="text-caption text-neutral-500 leading-relaxed px-1">
          本お手続きは「THEO つみたて安心ほけん」のお申し込みです。<br/>
          <span className="text-[10px] text-neutral-400">引受保険会社：T&Dフィナンシャル生命保険株式会社</span>
        </p>
        <Btn kind="cta" onClick={() => go(3)} disabled={pin.length < 6}>認証する</Btn>
        {pin.length < 6 && <p className="text-center text-caption text-neutral-400">6桁のPINコードを入力してください</p>}
      </ActionBar>
    </>
  );
}

/* ============================================================
   SCREEN 3 — 申込フォーム (ScreenForm)
   ============================================================ */
function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-warm-200 last:border-0">
      <span className="text-caption text-neutral-500">{k}</span>
      <span className={`text-h7 ${strong ? "font-bold text-neutral-900" : "text-neutral-700"}`}>{v}</span>
    </div>
  );
}

export function ScreenForm({ go, sel, m, setM, y, setY, initialEditOpen, initialSheetRes, initialSame }: {
  go: Go; sel: string;
  m: number; setM: React.Dispatch<React.SetStateAction<number>>;
  y: number; setY: React.Dispatch<React.SetStateAction<number>>;
  initialEditOpen?: boolean; initialSheetRes?: boolean; initialSame?: boolean;
}) {
  const plan = PLANS.find((p) => p.id === sel) ?? PLANS[0];
  const [same, setSame] = useState(initialSame ?? true);
  const [editOpen, setEditOpen] = useState(initialEditOpen ?? false);
  const [sheetRes, setSheetRes] = useState(initialSheetRes ?? false);
  const yen = (v: number) => v.toLocaleString("ja-JP");
  const [holder, setHolder] = useState({ zip: "100-0001", pref: "東京都", town: "千代田区丸の内１丁目", bldg: "丸の内ビル 10F" });
  const setH = (k: keyof typeof holder) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setHolder((h) => ({ ...h, [k]: e.target.value }));
  const [atBottom, setAtBottom] = useState(false);
  const bindScroll = (el: (HTMLDivElement & { __bound?: boolean }) | null) => {
    if (!el || el.__bound) return;
    el.__bound = true;
    el.addEventListener("scroll", () => {
      setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 48);
    }, { passive: true });
  };

  return (
    <>
      <AppBar title="お申込み" onBack={() => go(2)} />
      <Steps n={3} go={go} />
      <div ref={bindScroll} className="flex-1 overflow-y-auto no-sb px-5 py-5 space-y-6">
        <div>
          <h2 className="text-h4 font-bold text-neutral-900 leading-snug text-balance">認証が完了しました。</h2>
          <p className="mt-2 text-h7 text-neutral-600 leading-relaxed" style={{ textWrap: "pretty" as React.CSSProperties["textWrap"] }}>あと少しで、お申し込みは完了です。ご契約者さま・保険金受取人さまの情報をご入力ください。</p>
        </div>
        <h2 className="text-h5 font-bold text-neutral-800 pt-1">情報ご入力</h2>
        <div className="px-1 -mt-5 flex items-center gap-2 text-caption text-primary-700">
          <Ic.shield className="w-4 h-4 shrink-0" />THEO 口座情報の一部を自動入力しています。
        </div>

        <GroupCard title="契約者情報" sub="ご契約者ご本人さまの情報" iconSrc="assets/person-heart.svg" className="-mt-5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="姓" placeholder="山田" required />
            <Field label="名" placeholder="太郎" required />
            <Field label="セイ" placeholder="ヤマダ" required />
            <Field label="メイ" placeholder="タロウ" required />
          </div>
          <LockedField label="生年月日" value="1990 / 01 / 01" />
          <LockedField label="性別" value="男性" />
          <SubLabel>連絡先</SubLabel>
          <Field label="郵便番号" placeholder="100-0001" required hint="郵便番号から住所を自動入力します" value={holder.zip} onChange={setH("zip") as React.ChangeEventHandler<HTMLInputElement>} />
          <Select label="都道府県" required value={holder.pref} options={PREFS} hint="郵便番号で自動入力" onChange={setH("pref") as React.ChangeEventHandler<HTMLSelectElement>} />
          <Field label="市区町村・町名" placeholder="千代田区丸の内１丁目" required hint="町名まで自動入力されます" value={holder.town} onChange={setH("town") as React.ChangeEventHandler<HTMLInputElement>} />
          <Field label="建物名／部屋番号" placeholder="〇〇ビル 101号室" value={holder.bldg} onChange={setH("bldg") as React.ChangeEventHandler<HTMLInputElement>} />
          <Field label="電話番号" placeholder="090-0000-0000" required />
        </GroupCard>

        <GroupCard title="保険金受取人" sub="保険金をお受け取りになる方" iconSrc="assets/letter-heart-square.svg">
          <Field label="氏名" placeholder="山田 花子" />
          <button onClick={() => setSame((s) => !s)} className="flex items-center gap-2.5 w-full text-left pt-1">
            <span className={`grid place-items-center w-5 h-5 rounded border-2 shrink-0 ${same ? "border-primary bg-primary text-white" : "border-warm-300 bg-white"}`}>
              {same && <Ic.check className="w-3 h-3" />}
            </span>
            <span className="text-caption text-neutral-700">住所は契約者と同じ</span>
          </button>
          <div key={same ? `same-${holder.zip}-${holder.pref}-${holder.town}-${holder.bldg}` : "diff"} className="space-y-3">
            <Field label="郵便番号" placeholder="100-0001" value={same ? holder.zip : undefined} disabled={same} />
            <Select label="都道府県" value={same ? holder.pref : "都道府県を選択"} options={PREFS} disabled={same} />
            <Field label="市区町村・町名" placeholder="千代田区丸の内１丁目" value={same ? holder.town : undefined} disabled={same} />
            <Field label="建物名／部屋番号" placeholder="〇〇ビル 101号室" value={same ? holder.bldg : undefined} disabled={same} />
          </div>
          <Select label="続柄" required value="続柄を選択" options={["続柄を選択", "配偶者", "子", "父母", "兄弟姉妹", "孫", "祖父母"]} />
          <Field label="電話番号" placeholder="090-0000-0000" />
        </GroupCard>

        <GroupCard title="団体特定コード" icon={Ic.tag}>
          <Field label="団体特定コード" placeholder="TDF-0000-0000" hint="団体からご案内のコードを入力してください" />
        </GroupCard>
      </div>

      <ActionBar bg={atBottom ? "#e7edf7" : undefined}>
        <div className={`rounded-xl border px-3.5 py-2 transition-colors ${atBottom ? "border-primary-100 bg-white/70" : "border-warm-200 bg-warm-50"}`}>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-neutral-400">保険内容</span>
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
        <Btn kind="button" onClick={() => go(4)}>入力内容を確認する<Ic.chevR className="w-4 h-4" /></Btn>
      </ActionBar>

      {/* 修正ボトムシート */}
      {editOpen && (
        <div className="absolute inset-0 z-40">
          <div className="absolute inset-0 bg-black/40 fade-in" onClick={() => setEditOpen(false)} />
          <div className="sheet-up absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-xl max-h-[88%] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <h3 className="text-h6 font-bold text-neutral-800">積立内容を修正</h3>
              <button onClick={() => setEditOpen(false)} className="grid place-items-center w-8 h-8 rounded-full bg-warm-100 text-neutral-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="px-5 overflow-y-auto no-sb pb-2">
              <SimSliders m={m} setM={setM} y={y} setY={setY} onInput={() => setSheetRes(true)} />
              <button onClick={() => setSheetRes((o) => !o)}
                className="flex items-center justify-between w-full mt-2 pt-4 border-t border-warm-200 text-left">
                <span className="text-h7 font-bold text-neutral-800">給付予想額をみる</span>
                <span className={`grid place-items-center w-7 h-7 rounded-full bg-warm-100 text-neutral-500 transition-transform ${sheetRes ? "rotate-180" : ""}`}>
                  <Ic.chevR className="w-4 h-4 rotate-90" />
                </span>
              </button>
              <div style={{ maxHeight: sheetRes ? "1600px" : "0px", opacity: sheetRes ? 1 : 0, marginTop: sheetRes ? "16px" : "0px" }}
                className="overflow-hidden transition-all duration-300 ease-out">
                <BenefitTable m={m} y={y} plan={plan} />
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
   SCREEN 4 — 内容確認・お支払い (ScreenStep4)
   ============================================================ */
const AGREE_ITEMS: AgreeItemData[] = [
  {
    t: "申込に関する注意事項の確認",
    blocks: [{ ul: [
      "お申し込み・告知内容は必ず被保険者ご本人さまがご入力ください。",
      "お申込は、日本国内に在住し、ご自身で日本語の契約内容を理解できることが条件となります。",
      "T&Dフィナンシャル生命のシステム上登録できない字体については、登録可能な漢字かカタカナでの登録となることをご了承ください。（保障内容やご契約後の諸手続き等に影響はありません）",
      "ご加入の成立には審査があります。審査の結果、ご加入をお引き受けできない場合があります。",
    ]}],
  },
  {
    t: "個人情報のお取り扱いについて",
    blocks: [
      { ul: [
        "本保険のご加入手続き等について、保険契約者（団体）は加入対象者（被保険者）の個人情報（氏名、性別、生年月日、健康状態等）〔以下、個人情報〕を各種保険契約の引受け・継続・維持管理、給付金の支払い、その他保険に関連・付随する業務のために利用し、引受保険会社に前記目的の範囲内で提供します。今後個人情報に変更等が発生した際にも、それぞれ前記に準じ個人情報が取扱われます。",
        "保険医療等の機微（センシティブ）情報については、保険業法施行規則により、業務の適切な運営の確保その他必要と認められる目的に利用目的が限定されています。",
      ]},
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
      ]},
    ],
  },
  {
    t: "健康告知について",
    blocks: [
      { p: "下記の内容をご確認のうえ、お申し込みください。" },
      { note: "【告知事項】\n以下の質問についてすべて「いいえ」であることをご確認ください。1つでも「はい」があると、ご加入いただけません。" },
      { ul: [
        "最近3ヶ月以内に、医師より検査・入院・手術を勧められたことがありますか。",
        "過去2年以内に健康診断・人間ドックにおいて、以下の検査を受けて、異常の指摘を受けたことがありますか。",
        "過去5年以内の病気について、以下に該当することはありますか。\n・病気で継続して7日以上の入院をしたことまたは手術を受けたことがありますか。",
      ]},
    ],
  },
  {
    t: "被保険者の確認",
    blocks: [{ p: "該当するいずれかにチェックを入れてください。" }],
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
    blocks: [{ ul: [
      "障害・介護プランを選択した場合\n積立期間中における障害・介護状態にそなえたい",
      "がんプランを選択した場合\n積立期間中におけるがんにそなえたい",
      "安心セットを選択した場合\n積立期間中における障害・介護状態、がんにそなえたい",
    ]}],
  },
  {
    t: "ほけん商品のお問い合わせについて",
    blocks: [{ p: "本サービスはT＆Dフィナンシャル生命のほけん商品となります。詳細なほけん商品のお問い合わせについてはT＆Dフィナンシャル生命へお問い合わせください。" }],
  },
];

function AgreeBlocks({ blocks }: { blocks: AgreeBlock[] }) {
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
        if (b.download) return (
          <a key={i} href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1.5 text-caption font-medium text-button-500 underline underline-offset-2">
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

function AgreeItem({ num, item, open, onToggle, children }: {
  num: string; item: AgreeItemData; open: boolean; onToggle: () => void; children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white overflow-hidden border-warm-200">
      <div className="flex items-center gap-2.5 px-3 py-3">
        <button onClick={onToggle} className="flex-1 flex items-center justify-between gap-2 text-left">
          <span className="text-h7 font-bold text-neutral-800 leading-snug">
            <span className="text-primary-600 mr-1">{num}</span>{item.t}
          </span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            className={`w-4 h-4 text-primary shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
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

export function ScreenStep4({ go, sel, m, y, initialOpenIdx, initialChecks, initialAcctOpen, initialNat }: {
  go: Go; sel: string; m: number; y: number;
  initialOpenIdx?: number; initialChecks?: boolean[]; initialAcctOpen?: boolean; initialNat?: string;
}) {
  const plan = PLANS.find((p) => p.id === sel) ?? PLANS[0];
  const yen = (v: number) => (v || 0).toLocaleString("ja-JP");
  const [openIdx, setOpenIdx] = useState(initialOpenIdx ?? -1);
  const [payIdx, setPayIdx] = useState(initialAcctOpen ? 0 : -1);
  const [nat, setNat] = useState(initialNat ?? "jp");
  const [jpLang, setJpLang] = useState("");
  const [agreed, setAgreed] = useState(Array.isArray(initialChecks) ? initialChecks.every(Boolean) : false);

  return (
    <>
      <AppBar title="内容確認・お支払い" onBack={() => go(3)} />
      <Steps n={4} go={go} />
      <div className="flex-1 overflow-y-auto no-sb px-5 py-5 space-y-8">
        <StepSection label="内容確認">
          <h2 className="text-h5 font-bold text-neutral-800">お申込み内容</h2>
          <div className="rounded-2xl border border-warm-200 bg-white p-5">
            <SectionLabel>積立内容</SectionLabel>
            <Row k="契約プラン" v={plan.name} strong />
            <Row k="毎月の積立金額（希望給付額）" v={`${yen(m)} 円`} strong />
            <Row k="保障期間" v={`${y} 年`} strong />
            <Row k="保険料（月額）" v={`${plan.price.replace("¥", "")} 円 / 月`} strong />
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
              <span className="text-h7 text-neutral-700 leading-relaxed">〒100-0001<br/>東京都千代田区丸の内１丁目 丸の内ビル 10F</span>
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
        </StepSection>

        <StepSection label="お支払い">
          <h2 className="text-h5 font-bold text-neutral-800">保険料のお支払いについて</h2>
          <p className="text-caption text-neutral-600 leading-relaxed">クレジットカードによる保険料払込における各種注意点を確認のうえ、お手続きください。</p>
          {/* クレジットカードのお支払いについて accordion */}
          {[
            { title: "クレジットカードのお支払いについて", idx: 0 },
            { title: "クレジットカード支払規定", idx: 1 },
          ].map(({ title, idx }) => (
            <div key={idx} className="rounded-2xl border border-warm-200 bg-white overflow-hidden">
              <button onClick={() => setPayIdx((o) => (o === idx ? -1 : idx))} className="flex items-center justify-between w-full px-4 py-4 text-left">
                <h4 className="text-h7 font-bold text-neutral-800">{title}</h4>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
                  className={`w-4 h-4 text-primary shrink-0 transition-transform duration-300 ${payIdx === idx ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6"/></svg>
              </button>
              <div style={{ maxHeight: payIdx === idx ? "2000px" : "0px", opacity: payIdx === idx ? 1 : 0 }} className="overflow-hidden transition-all duration-300 ease-out">
                <div className="px-4 pb-4 border-t border-warm-200 pt-3">
                  <p className="text-caption text-neutral-500 leading-relaxed">
                    {idx === 0 ? "カード名義人は被保険者さま本人名義に限ります。以下のマークのあるクレジットカードをご指定いただけます。" : "私がT&Dフィナンシャル生命保険株式会社と締結した生命保険契約の保険料は、私が指定する私名義のクレジットカードで支払います。"}
                  </p>
                  {idx === 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {["VISA", "Mastercard", "JCB", "AMEX", "Diners"].map((c) => (
                        <span key={c} className="rounded border border-warm-300 bg-warm-50 px-2 py-1 text-[10px] font-en font-semibold tracking-wide text-neutral-600">{c}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </StepSection>

        <div className="rounded-2xl border border-[color:var(--secondary-color-100)] bg-[color:var(--secondary-color-10)] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Badge>重要</Badge>
            <span className="text-h6 font-bold text-neutral-800">重要事項をご確認ください</span>
          </div>
          <div className="space-y-2.5">
            {AGREE_ITEMS.map((it, i) => (
              <AgreeItem key={i} num={"①②③④⑤⑥⑦⑧"[i]} item={it} open={openIdx === i}
                onToggle={() => setOpenIdx((o) => (o === i ? -1 : i))}>
                {i === 4 && (
                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-2 gap-3">
                      {[["jp", "日本国籍"], ["other", "日本国籍以外"]].map(([k, l]) => (
                        <button key={k} onClick={() => setNat(k)}
                          className={`h-11 rounded-lg border text-h7 transition-colors ${nat === k ? "border-primary bg-primary-10 text-primary-700 font-medium" : "border-warm-300 bg-warm-50 text-neutral-700"}`}>
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
                              className={`h-11 rounded-lg border text-h7 transition-colors ${jpLang === k ? "border-primary bg-primary-10 text-primary-700 font-medium" : "border-warm-300 bg-warm-50 text-neutral-700"}`}>
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
          <button onClick={() => setAgreed((a) => !a)} className="flex items-start gap-3 w-full text-left rounded-xl bg-[color:var(--secondary-color-10)] p-4 mt-3 transition-colors">
            <span className={`grid place-items-center w-5 h-5 mt-0.5 rounded border-2 shrink-0 ${agreed ? "border-primary bg-primary text-white" : "border-warm-300 bg-white"}`}>
              {agreed && <Ic.check className="w-3 h-3" />}
            </span>
            <span className="text-h7 text-neutral-700 leading-relaxed">①④⑤⑥⑦⑧について確認、②③について同意する</span>
          </button>
        </div>
      </div>
      <ActionBar>
        <Btn kind="danger" onClick={() => go(5)} disabled={!agreed}>クレジットカード登録開始<Ic.chevR className="w-4 h-4" /></Btn>
        {!agreed && <p className="text-center text-caption text-neutral-400">上記に確認・同意すると進めます</p>}
      </ActionBar>
    </>
  );
}

/* ============================================================
   外部サイト共通バー
   ============================================================ */
function ExtBar({ url }: { url: string }) {
  return (
    <div className="shrink-0 bg-neutral-200 border-b border-neutral-300 px-3 py-2 flex items-center gap-2">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5 text-neutral-500 shrink-0">
        <rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>
      </svg>
      <span className="flex-1 bg-white rounded-md px-2.5 py-1 text-caption text-neutral-600 truncate font-en">{url}</span>
      <span className="font-mono text-[10px] text-neutral-500 shrink-0">外部</span>
    </div>
  );
}

/* ============================================================
   SCREEN — クレジットカード情報入力（GMO）
   ============================================================ */
export function ScreenCardInput({ go }: { go: Go }) {
  return (
    <>
      <ExtBar url="payment.gmo-pg.com" />
      <div className="flex-1 overflow-y-auto no-sb bg-neutral-100 px-4 py-5 space-y-4">
        <h2 className="text-h6 font-bold text-neutral-800">クレジットカード設定（外部リンク）</h2>
        <div className="rounded-xl bg-white border border-neutral-200 p-4 space-y-4">
          <p className="flex items-center gap-2 text-h7 font-bold text-neutral-800">
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
              {["VISA", "Mastercard", "JCB", "AMEX", "Diners", "DC", "NICOS", "UC"].map((b) => (
                <span key={b} className="rounded border border-neutral-300 bg-neutral-50 px-2 py-1 font-en text-[11px] font-medium text-neutral-600">{b}</span>
              ))}
            </div>
          </div>
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
   SCREEN — カード情報の確認（GMO）
   ============================================================ */
export function ScreenCardConfirm({ go }: { go: Go }) {
  return (
    <>
      <ExtBar url="payment.gmo-pg.com" />
      <div className="flex-1 overflow-y-auto no-sb bg-neutral-100 px-4 py-5 space-y-4">
        <h2 className="text-h6 font-bold text-neutral-800">お申込み内容の確認（外部リンク）</h2>
        <div className="rounded-xl bg-white border border-neutral-200 p-4 space-y-4">
          <p className="flex items-center gap-2 text-h7 font-bold text-neutral-800">
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
   SCREEN — 完了 (ScreenDone)
   ============================================================ */
export function ScreenDone({ go }: { go: Go }) {
  return (
    <>
      <AppBar title="お申込み完了" />
      <div className="flex-1 overflow-y-auto no-sb">
        <div className="bg-primary text-primary-foreground px-5 pt-2 pb-10 text-center">
          <img src="/assets/theo-tdf/logo_theo_insurance.svg" alt="THEO つみたて安心ほけん" className="h-10 mx-auto mb-4 opacity-95" />
          <div className="mx-auto grid place-items-center w-16 h-16 rounded-full bg-white/15 mb-4">
            <Ic.check className="w-8 h-8" />
          </div>
          <h2 className="text-h4 font-bold">お申込が完了しました</h2>
          <p className="mt-2 text-caption opacity-90">受付番号　THEO-2026-000482</p>
        </div>
        <div className="sticky top-0 z-30"><Steps n={5} go={go} /></div>
        <div className="px-5 py-6 space-y-5">
          <div className="px-1">
            <p className="text-h7 font-bold text-neutral-800 leading-relaxed">THEO つみたて安心ほけんのお申込が完了しました。</p>
            <p className="mt-2 text-caption text-neutral-600 leading-relaxed">
              受付確認メールをご確認ください。<br/>査定結果は●日以内に再度ご登録のメールアドレス宛に連絡いたします。
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
                      <p className="text-h7 font-bold text-neutral-800">{t}</p>
                      <p className="text-caption text-neutral-500 leading-relaxed">{d}</p>
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="flex justify-center items-center py-1.5 text-primary-300" style={{ marginTop: "-20px" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <path d="M12 5v14M19 12l-7 7-7-7"/>
                        </svg>
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
      <ActionBar>
        <Btn kind="button" onClick={() => go(0)}>マイページに戻る</Btn>
      </ActionBar>
    </>
  );
}
