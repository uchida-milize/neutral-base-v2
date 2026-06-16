#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Port TD 組込1.4 kumikomi.html screens -> repo screens.tsx (shadcn wrapper, typed)."""
import re, sys

KUMI = "/sessions/youthful-gifted-hypatia/mnt/outputs/td14/td-1-4/project/kumikomi.html"
OUT  = "/sessions/youthful-gifted-hypatia/mnt/neutral-base-v2/components/theo-tdf/claude-design/screens.tsx"

html = open(KUMI, encoding="utf-8").read()
blocks = re.findall(r'<script type="text/babel"[^>]*>(.*?)</script>', html, re.DOTALL)
screens = blocks[1]
app = blocks[2]

# ---- extract ScreenCombined from app block (brace match) ----
def span(src, name):
    m = re.search(r'\nfunction\s+' + name + r'\b', src)
    k = src.find(') {', m.start()); i = k + 2
    depth = 0; j = i
    while j < len(src):
        c = src[j]
        if c == '{': depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0: break
        j += 1
    return m.start() + 1, j + 1  # start at 'function'

s0, s1 = span(app, "ScreenCombined")
screen_combined = app[s0:s1]

# ---- strip UMD destructure + Object.assign(window,...) from screens block ----
body = screens
body = re.sub(r'\nconst \{[^}]*\} = React;\n', '\n', body)
body = re.sub(r'\nObject\.assign\(window,\s*\{.*?\}\);\s*', '\n', body, flags=re.DOTALL)
body = body.strip('\n')

# ---- GLOBAL TRANSFORMS (applied to kumikomi-derived code only) ----
def transform(t):
    # compact scale -> repo UI heading scale: hN -> h(N-1)  (h2..h7)
    t = re.sub(r'text-h([2-7])', lambda m: 'text-h' + str(int(m.group(1)) - 1), t)
    # asset paths
    t = t.replace('src="assets/', 'src="/assets/theo-tdf/')
    t = t.replace('iconSrc="assets/', 'iconSrc="/assets/theo-tdf/')
    t = re.sub(r"(['\"])assets/", r"\1/assets/theo-tdf/", t)  # any remaining assets/ string literals
    # success utility -> css var
    t = t.replace('bg-success', 'bg-[color:var(--success)]')
    # typing helpers
    t = t.replace('useRef(null)', 'useRef<any>(null)')
    t = t.replace('(el) =>', '(el: any) =>')
    t = re.sub(r'\(p\) => <svg', '(p: React.SVGProps<SVGSVGElement>) => <svg', t)
    return t

body = transform(body)
screen_combined = transform(screen_combined)

# ---- ATOM shadcn-wrapper replacements (proven template c495e75, text-h6) ----
ATOMS = {}
ATOMS["Badge"] = '''function Badge({ children, tone = "secondary" }: { children: React.ReactNode; tone?: "secondary" | "primary" | "warm" }) {
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
}'''

ATOMS["Btn"] = '''function Btn({ kind = "button", children, onClick, disabled, full = true }: { kind?: "cta" | "button" | "danger" | "outline" | "ghost"; children: React.ReactNode; onClick?: () => void; disabled?: boolean; full?: boolean }) {
  // shadcn <Button> へ委譲。kind→variant + ブランド色 className。
  const tint: Record<string, string> = {
    cta: "bg-button-500 text-white hover:bg-button-600",
    button: "bg-button-500 text-white hover:bg-button-600",
    danger: "bg-cta-500 text-white hover:bg-cta-600",
    outline: "border border-button-600 bg-white text-button-600 hover:bg-button-10",
    ghost: "text-neutral-500 hover:text-neutral-800",
  };
  const variant = kind === "outline" ? "outline" : kind === "ghost" ? "ghost" : "default";
  return (
    <Button
      type="button"
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={`h-16 md:h-16 rounded-xl gap-1.5 px-4 text-h6 font-bold active:scale-[.99] ${tint[kind]} ${full ? "w-full" : ""}`}
    >
      {children}
    </Button>
  );
}'''

ATOMS["GroupCard"] = '''function GroupCard({ title, sub, icon: Icon, children, className, iconSrc }: { title: string; sub?: string; icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode; className?: string; iconSrc?: string }) {
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
}'''

ATOMS["Field"] = '''function Field({ label, placeholder, required, hint, value, onChange, disabled }: { label: string; placeholder?: string; required?: boolean; hint?: string; value?: string; onChange?: React.ChangeEventHandler<HTMLInputElement>; disabled?: boolean }) {
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
        className={`fld h-11 rounded-lg border px-3 text-h6 placeholder:text-neutral-400 ${disabled ? "border-warm-200 bg-warm-200/60 text-neutral-400 cursor-not-allowed" : "border-warm-300 bg-warm-50 text-neutral-800"}`}
      />
      {hint && <span className="text-caption text-neutral-400">{hint}</span>}
    </div>
  );
}'''

ATOMS["LockedField"] = '''function LockedField({ label, value }: { label: string; value: string }) {
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
}'''

def replace_func(t, name, newtext):
    m = re.search(r'\nfunction\s+' + name + r'\b', t)
    if not m:
        print("WARN atom not found:", name); return t
    k = t.find(') {', m.start()); i = k + 2
    depth = 0; j = i
    while j < len(t):
        c = t[j]
        if c == '{': depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0: break
        j += 1
    return t[:m.start()+1] + newtext + t[j+1:]

for name, txt in ATOMS.items():
    body = replace_func(body, name, txt)

# ---- TYPE signatures injected into kept-faithful functions ----
TYPE = {
  "PH": "{ className?: string; label: string }",
  "AppBar": "{ title: string; onBack?: () => void; brandVisible?: boolean }",
  "Steps": "{ n: number; of?: number; go?: Go }",
  "SectionLabel": "{ children: React.ReactNode }",
  "SubLabel": "{ children: React.ReactNode }",
  "ActionBar": "{ children: React.ReactNode; solid?: boolean; bg?: string }",
  "Select": "{ label: string; required?: boolean; hint?: string; value?: string; onChange?: React.ChangeEventHandler<HTMLSelectElement>; options?: string[]; disabled?: boolean }",
  "StepSection": "{ label: string; n?: number; big?: boolean; className?: string; children: React.ReactNode }",
  "PlanCard": "{ p: Plan; selected: boolean; onSelect: () => void }",
  "WheelCol": "{ items: string[]; index: number; onChange: (v: number) => void; flex?: number; align?: string }",
  "DateDrumSheet": "{ open: boolean; value: string; onClose: () => void; onDone: (v: string) => void }",
  "ScreenOverview": "{ go: Go }",
  "ScreenStep2": "{ go: Go; sel: string; setSel: React.Dispatch<React.SetStateAction<string>>; m: number; setM: React.Dispatch<React.SetStateAction<number>>; y: number; setY: React.Dispatch<React.SetStateAction<number>>; initialNoticeOpen?: boolean; initialAgree?: boolean; initialSimOpen?: boolean; emailVerified?: boolean }",
  "ScreenPin": "{ go: Go; onVerified?: () => void; backScr?: number }",
  "Row": "{ k: string; v: React.ReactNode; strong?: boolean }",
  "FeatValue": "{ v: string }",
  "SimSliders": "{ m: number; setM: React.Dispatch<React.SetStateAction<number>>; y: number; setY: React.Dispatch<React.SetStateAction<number>>; onInput?: () => void }",
  "BenefitTable": "{ m: number; y: number; plan: Plan | undefined }",
  "Simulator": "{ m: number; setM: React.Dispatch<React.SetStateAction<number>>; y: number; setY: React.Dispatch<React.SetStateAction<number>>; initialSimOpen?: boolean; infoSlot?: React.ReactNode; planName?: string | null; plan: Plan | undefined }",
  "ScreenForm": "{ go: Go; sel: string; m: number; setM: React.Dispatch<React.SetStateAction<number>>; y: number; setY: React.Dispatch<React.SetStateAction<number>>; initialEditOpen?: boolean; initialSheetRes?: boolean; initialSame?: boolean; backScr?: number; formSplit?: boolean }",
  "AgreeBlocks": "{ blocks: AgreeBlock[] }",
  "AgreeItem": "{ num: string; item: AgreeItemData; open: boolean; onToggle: () => void; checked?: boolean; onCheck?: () => void; children?: React.ReactNode }",
  "ScreenStep4": "{ go: Go; sel: string; m: number; y: number; initialOpenIdx?: number; initialChecks?: boolean[]; initialAcctOpen?: boolean }",
  "ExtBar": "{ url: string }",
  "ScreenCardInput": "{ go: Go }",
  "ScreenCardConfirm": "{ go: Go }",
  "ScreenDone": "{ go: Go }",
  "ScreenIntro": "{ go: Go }",
  "ScreenCombined": "{ go: Go; sel: string; setSel: React.Dispatch<React.SetStateAction<string>>; m: number; setM: React.Dispatch<React.SetStateAction<number>>; y: number; setY: React.Dispatch<React.SetStateAction<number>>; emailVerified?: boolean }",
}

def inject_type(t, name, typ):
    # function NAME(<params>) {   ->   function NAME(<params>: typ) {
    pat = re.compile(r'(\nfunction ' + name + r'\()([^)]*)(\)\s*\{)')
    def rep(m):
        return m.group(1) + m.group(2) + ": " + typ + m.group(3)
    new, n = pat.subn(rep, t)
    if n == 0: print("WARN type sig not matched:", name)
    return new

for name, typ in TYPE.items():
    if name == "ScreenCombined":
        screen_combined = inject_type("\n" + screen_combined, name, typ).lstrip("\n")
    else:
        body = inject_type(body, name, typ)

# positional helpers
body = body.replace("function daysInMonth(y, m)", "function daysInMonth(y: number, m: number)")
body = body.replace("function pad2(n)", "function pad2(n: number)")
body = body.replace("function fmtBirth(v)", "function fmtBirth(v: string)")

# ---- standalone arrow param typings (avoid implicit-any in strict mode) ----
body = body.replace("const years = [];", "const years: number[] = [];")
body = body.replace('const yen = (v) => v.toLocaleString("ja-JP");',
                    'const yen = (v: number) => v.toLocaleString("ja-JP");')
body = body.replace('const yen = (v) => (v || 0).toLocaleString("ja-JP");',
                    'const yen = (v: number) => (v || 0).toLocaleString("ja-JP");')
body = body.replace('const man = (v) => Math.round(v / 10000).toLocaleString("ja-JP");',
                    'const man = (v: number) => Math.round(v / 10000).toLocaleString("ja-JP");')
body = body.replace("const onM = (e) => { setM(+e.target.value); onInput && onInput(); };",
                    "const onM = (e: React.ChangeEvent<HTMLInputElement>) => { setM(+e.target.value); onInput && onInput(); };")
body = body.replace("const onY = (e) => { setY(+e.target.value); onInput && onInput(); };",
                    "const onY = (e: React.ChangeEvent<HTMLInputElement>) => { setY(+e.target.value); onInput && onInput(); };")
body = body.replace("const setH = (k) => (e) => setHolder((h) => ({ ...h, [k]: e.target.value }));",
                    "const setH = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setHolder((h: any) => ({ ...h, [k]: e.target.value }));")

# ---- const type annotations ----
body = body.replace("const STEP_TO_SCREEN = {", "const STEP_TO_SCREEN: Record<number, number> = {")
body = body.replace("const PREFS = [", "const PREFS: string[] = [")
body = body.replace("const PLANS = [", "const PLANS: Plan[] = [")
body = body.replace("const AGREE_ITEMS = [", "const AGREE_ITEMS: AgreeItemData[] = [")

# ---- export prefixing (top-level only) ----
body = re.sub(r'^function ', 'export function ', body, flags=re.M)
body = re.sub(r'^const ', 'export const ', body, flags=re.M)
screen_combined = re.sub(r'^function ', 'export function ', screen_combined, flags=re.M)

# ---- HEADER ----
HEADER = '''"use client";
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

import { cn } from "@/lib/utils";
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
  tooltip?: string;
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

'''

# cn is imported but only used if needed; keep usage to avoid unused — reference in a noop is ugly.
# Instead drop cn import if not used.
final = HEADER + body + "\n\n" + screen_combined + "\n"
if "cn(" not in final:
    final = final.replace('import { cn } from "@/lib/utils";\n', '')

open(OUT, "w", encoding="utf-8").write(final)
print("WROTE", OUT, "lines:", final.count("\n"))
