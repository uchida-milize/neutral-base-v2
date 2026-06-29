#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Port TD 組込1.4 kumikomi.html screens -> repo screens.tsx (shadcn wrapper, typed)."""
import re, sys, os

# Usage: python3 port-claude-design-1.4.py <kumikomi.html> [out screens.tsx]
# 既定の OUT は repo 相対 (scripts/ の一つ上の components/theo-tdf/claude-design/screens.tsx)。
_REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
KUMI = sys.argv[1] if len(sys.argv) > 1 else os.path.join(_REPO, "kumikomi.html")
OUT  = sys.argv[2] if len(sys.argv) > 2 else os.path.join(_REPO, "components/theo-tdf/claude-design/screens.tsx")

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
    # TD 組込1.5: tooltip は optional。表示は ttOpen (tooltip 存在時のみ true) 配下だが
    # TS の narrowing が効かないため optional chaining で型安全化。
    t = t.replace('p.tooltip.sections.map', 'p.tooltip?.sections.map')
    t = t.replace('(el) =>', '(el: any) =>')
    t = re.sub(r'\(p\) => <svg', '(p: React.SVGProps<SVGSVGElement>) => <svg', t)
    return t

body = transform(body)
screen_combined = transform(screen_combined)

# ---- TD 組込1.5(3): HeigaiModal は app ブロック (blocks[2]) に定義されるが
#      ScreenStep2 (blocks[1]) でも参照されるため、app ブロックから抽出して body に追加する。
def _extract_heigai(src):
    if 'HEIGAI_BLOCKS' not in src: return ''
    try:
        cb = src.index('\nconst HEIGAI_BLOCKS')
        h0, h1 = span(src, 'HeigaiModal')
        return src[cb:h1]
    except (ValueError, AttributeError):
        return ''

_heigai_raw = _extract_heigai(app)
if _heigai_raw:
    _heigai = transform(_heigai_raw)
    _heigai = re.sub(r'^function ', 'export function ', _heigai, flags=re.M)
    _heigai = re.sub(r'^const ', 'export const ', _heigai, flags=re.M)
    _heigai = _heigai.replace(
        'export function HeigaiModal({ open, onClose, onAgree })',
        'export function HeigaiModal({ open, onClose, onAgree }: { open: boolean; onClose: () => void; onAgree?: () => void })')
    _heigai = _heigai.replace(
        '{HEIGAI_BLOCKS.map((b, i) => (',
        '{(HEIGAI_BLOCKS as any[]).map((b: any, i: number) => (')
else:
    _heigai = ''

# ---- HEADER_GRAD_* に React.CSSProperties 型注釈を付与 (style props へ渡すため) ----
for _hg in ("HEADER_GRAD_CSS", "HEADER_GRAD_STATUS", "HEADER_GRAD_APPBAR"):
    body = body.replace("const %s = {" % _hg, "const %s: React.CSSProperties = {" % _hg)

# ---- ヘッダーグラデの右端切れ対策: 固定幅 366px → 100% (お客様要望 2026-06-17) ----
# kumikomi の 366px は Phone 枠 (p-3 → 内容 366px) 前提。枠の無い windows (390px 幅) では
# 右 24px がグラデ無しで切れるため、幅を 100% にして全幅を覆う (縦 89px の連続性は維持)。
body = body.replace('backgroundSize: "366px 89px"', 'backgroundSize: "100% 89px"')


def must_replace(t, old, new):
    """文字列置換。対象が無ければ即エラー (kumikomi のシグネチャ・ドリフトを検知)。
    silent no-op で initial props 注入が抜け落ちる退行 (HANDOFF gotcha #35) を防ぐ。"""
    if old not in t:
        raise SystemExit(
            "PORT ERROR: 期待した部分文字列が見つかりません (kumikomi のシグネチャが変わった可能性):\n  "
            + old[:160])
    return t.replace(old, new)


# ---- windows (Screens ページ) 用 initial props 注入 ----
# 静的バリアント表示のため、kumikomi に無い initial 系 props を追加して
# useState の初期値に流し込む。destructure は inject_type 前に増やしておく。
# NOTE: 新 kumikomi(1.4) で simFirst が末尾に追加されたシグネチャに同期。
# initialShowSend (§14.11 CTA 表示) と initialTipIdx (A: ツールチップ1つ静的展開) を注入。
body = must_replace(body,
    "function ScreenStep2({ go, sel, setSel, deathOpt = true, m, setM, y, setY, initialNoticeOpen, initialAgree, initialSimOpen, emailVerified, simFirst, planCardStyle = \"card\" })",
    "function ScreenStep2({ go, sel, setSel, deathOpt = true, m, setM, y, setY, initialNoticeOpen, initialAgree, initialSimOpen, initialShowSend, initialTipIdx, initialBirth, emailVerified, simFirst, planCardStyle = \"card\", initialPlanOpenId })")
# initialBirth: windows でシミュレーション上限エラー(加入年齢+保障期間>90)を静的再現するため
# 生年月日を初期注入できるようにする。body 内 birth は ScreenStep2 のみ (ScreenCombined は screen_combined)。
body = must_replace(body,
    'const [birth, setBirth] = useState("");',
    'const [birth, setBirth] = useState(initialBirth ?? "");')
body = body.replace(
    "function ScreenPin({ go, onVerified, backScr = 1 })",
    "function ScreenPin({ go, onVerified, backScr = 1, initialPin })")
body = must_replace(body,
    "function ScreenStep4({ go, sel, deathOpt = true, m, y, initialOpenIdx, initialChecks, initialAcctOpen, benSameAddr = true })",
    "function ScreenStep4({ go, sel, deathOpt = true, m, y, initialOpenIdx, initialChecks, initialAcctOpen, benSameAddr = true, initialEditKiyaku, initialEditJuushin, initialNat })")
body = must_replace(body,
    "function ScreenForm({ go, sel, deathOpt = true, m, setM, y, setY, initialEditOpen, initialSheetRes, initialSame, backScr = 1, formSplit = false, errMode = 'none', onTerminate, kokuchiPattern = 'auto' })",
    "function ScreenForm({ go, sel, deathOpt = true, m, setM, y, setY, initialEditOpen, initialSheetRes, initialSame, backScr = 1, formSplit = false, errMode = 'none', onTerminate, kokuchiPattern = 'auto', initialFormPage = 1, initialDisclosureOpen, initialErrStep = 0 })")
# ScreenStep4: 国籍 (被保険者の確認の「日本国籍以外」選択) を静的再現する initialNat。
body = must_replace(body, 'const [nat, setNat] = useState("jp");', 'const [nat, setNat] = useState(initialNat ?? "jp");')
# 新 kumikomi(1.4) で simFirst 追加。initialAgree / initialShowSend (§14.11) と
# initialTipIdx (A) を注入。
screen_combined = must_replace(screen_combined,
    "function ScreenCombined({ go, sel, setSel, deathOpt = true, m, setM, y, setY, emailVerified, simFirst, planCardStyle = \"card\" })",
    "function ScreenCombined({ go, sel, setSel, deathOpt = true, m, setM, y, setY, emailVerified, simFirst, planCardStyle = \"card\", initialAgree, initialShowSend, initialTipIdx, initialPlanOpenId })")
# useState 初期値の wiring (body の showSend は ScreenStep2 のみ、screen_combined は ScreenCombined のみ)
# formPage は ScreenOverview と ScreenForm の両方に存在するため、ScreenForm 固有のコメント文脈で限定置換する。
body = body.replace(
    "// ページ下部到達で CTA ブロックを薄ブルーに\n  const [atBottom, setAtBottom] = useState(false);\n  const [formPage, setFormPage] = useState(1);",
    "// ページ下部到達で CTA ブロックを薄ブルーに\n  const [atBottom, setAtBottom] = useState(false);\n  const [formPage, setFormPage] = useState(initialFormPage ?? 1);")
body = body.replace("const [showSend, setShowSend] = useState(false);",
                    "const [showSend, setShowSend] = useState(initialShowSend ?? false);")
body = body.replace('const [pin, setPin] = useState("");',
                    'const [pin, setPin] = useState(initialPin ?? "");')
body = body.replace("const [editKiyaku, setEditKiyaku] = useState(false);",
                    "const [editKiyaku, setEditKiyaku] = useState(initialEditKiyaku ?? false);")
body = body.replace("const [editJuushin, setEditJuushin] = useState(false);",
                    "const [editJuushin, setEditJuushin] = useState(initialEditJuushin ?? false);")
screen_combined = screen_combined.replace("const [showSend, setShowSend] = useState(false);",
                    "const [showSend, setShowSend] = useState(initialShowSend ?? false);")
screen_combined = screen_combined.replace("const [agree, setAgree] = useState(false);",
                    "const [agree, setAgree] = useState(initialAgree ?? false);")
# NOTE (1.5(1)): 以下はお客様が Claude Design 側に取り込み済みのため撤去:
#   - 橋渡しバナーの青グラデ / パターンB の シミュレーション・申込帯のグラデ / ActionBar #F2FBFE
#   いずれも新 kumikomi にネイティブで入っている (旧文字列 #EAF9FE/#e7edf7/bg-primary は消滅)。

# ---- (A) ツールチップ静的展開: PlanCard に initialTtOpen、画面に initialTipIdx ----
# windows で「プラン選択 / ツールチップ1つ展開」を静的に再現するため、kumikomi に無い
# initialTtOpen / initialTipIdx を注入する。state 名は kumikomi の ttOpen を踏襲。
body = must_replace(body,
    "function PlanCard({ p, selected, onSelect }) {",
    "function PlanCard({ p, selected, onSelect, initialTtOpen }) {")
# PlanCardAccordion も handoff(9) で ttOpen を持つ。PlanCard と同じ initialTtOpen prop を注入。
body = must_replace(body,
    "function PlanCardAccordion({ p, selected, onSelect, open, onToggle }) {",
    "function PlanCardAccordion({ p, selected, onSelect, open, onToggle, initialTtOpen }) {")
# ttOpen useState を 2 箇所（PlanCard + PlanCardAccordion）両方 initialTtOpen ?? false に統一
body = body.replace(
    "const [ttOpen, setTtOpen] = React.useState(false);",
    "const [ttOpen, setTtOpen] = React.useState(initialTtOpen ?? false);")


def wire_tip(t):
    # PLAN_CARDS.map (handoff(4)~) / PLANS.map に index を渡し、initialTipIdx と一致する 1 枚だけ tooltip を開く。
    t = t.replace("PLAN_CARDS.map((p) =>", "PLAN_CARDS.map((p, i) =>")
    t = t.replace("PLANS.map((p) =>", "PLANS.map((p, i) =>")
    t = t.replace(
        "<PlanCard key={p.id} p={p} selected={sel === p.id} onSelect={() => setSel(p.id)} />",
        "<PlanCard key={p.id} p={p} selected={sel === p.id} onSelect={() => setSel(p.id)} initialTtOpen={i === initialTipIdx} />")
    return t


body = wire_tip(body)
screen_combined = wire_tip(screen_combined)

# ---- handoff(5): PlanList に initialTipIdx を注入 (PlanCard 呼び出しで参照するため) ----
# PlanList は新 kumikomi で追加。card モード内で PLAN_CARDS.map → wire_tip が
# initialTtOpen={i === initialTipIdx} を注入するが、PlanList のスコープに
# initialTipIdx が無いとTS エラーになるため prop として追加する。
# ScreenStep2 / ScreenCombined からも initialTipIdx を渡す。
body = must_replace(body,
    "function PlanList({ sel, setSel, mode = 'card' })",
    "function PlanList({ sel, setSel, mode = 'card', initialTipIdx, initialOpenId })")
# PlanList の toggleOpen コールバック: id が implicit-any → 型注釈
body = body.replace(
    "  const toggleOpen = (id) => setOpenIds(",
    "  const toggleOpen = (id: string) => setOpenIds(")
# initialOpenId で accordion の初期展開項目を制御 (windows 静的プレビュー用)
body = body.replace(
    "  const [openIds, setOpenIds] = React.useState(() => new Set());",
    "  const [openIds, setOpenIds] = React.useState<Set<string>>(() => new Set(initialOpenId ? [initialOpenId] : []));")
body = body.replace(
    "<PlanList sel={sel} setSel={setSel} mode={planCardStyle} />",
    "<PlanList sel={sel} setSel={setSel} mode={planCardStyle} initialTipIdx={initialTipIdx} initialOpenId={initialPlanOpenId} />")
screen_combined = screen_combined.replace(
    "<PlanList sel={sel} setSel={setSel} mode={planCardStyle} />",
    "<PlanList sel={sel} setSel={setSel} mode={planCardStyle} initialTipIdx={initialTipIdx} initialOpenId={initialPlanOpenId} />")

# ---- 各画面コンテンツ背景の白→薄ブルー縦グラデ (Claude Design / ScreenCombined と統一) ----
# ScreenCombined は kumikomi 側で既に content に gradient を持つ。他のフロー画面にも
# hero / ヘッダ+ステッパー直下のコンテンツ起点コンテナへ同じグラデを適用する (お客様要望 2026-06-17)。
# 外部 GMO カード画面 (bg-neutral-100 グレー) は対象外。
_SCREEN_GRAD = ' style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #F2FBFE 100%)" }}'
_grad_targets = [
    '<div className="px-5 pt-8 pb-0 space-y-8">',                          # ScreenStep2 content (handoff(9): px-4→px-5, pb-6→pb-0)
    '<div className="px-5 py-10 flex flex-col items-center text-center">',  # ScreenPin   (handoff(9): px-4→px-5)
    '<div key={formPage} ref={bindScroll} className="flex-1 overflow-y-auto no-sb px-4 py-6 space-y-6">',  # ScreenForm (handoff(9): pt-6 pb-6→py-6)
    '<div className="flex-1 overflow-y-auto no-sb px-4 py-6 space-y-8">',  # ScreenStep4 (handoff(8): py-5→py-6)
    '<div className="px-5 pt-6">',                                          # ScreenOverview (handoff(9): px-4→px-5)
    '<div className="px-4 py-6 space-y-6">',                               # ScreenDone (handoff(8): space-y-5→space-y-6)
]
for _t in _grad_targets:
    body = must_replace(body, _t, _t[:-1] + _SCREEN_GRAD + ">")

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
    cta: "text-white",
    button: "text-white",
    danger: "text-white",
    outline: "border border-button-600 bg-white text-button-600 hover:bg-button-10",
    ghost: "text-neutral-500 hover:text-neutral-800",
  };
  // グラデーション: cta / button = ブルー, danger = レッド (TD 組込1.4)
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
          <p className="text-h4 font-bold text-neutral-800 leading-tight">{title}</p>
          {sub && <p className="text-[11px] text-neutral-500 leading-tight">{sub}</p>}
        </div>
      </div>
      <CardContent className="p-5 space-y-6">{children}</CardContent>
    </Card>
  );
}'''

ATOMS["Field"] = '''function Field({ label, placeholder, required, hint, value, onChange, disabled, error, errMode, anchorRef }: { label: string; placeholder?: string; required?: boolean; hint?: string; value?: string; onChange?: React.ChangeEventHandler<HTMLInputElement>; disabled?: boolean; error?: string; errMode?: string; anchorRef?: any }) {
  // shadcn <Label> + <Input> へ委譲。error/errMode は Claude Design のインライン検証用 (1.5(1))。
  const id = React.useId();
  const invalid = !!error && !!errMode && errMode !== "none";
  return (
    <div className="flex flex-col gap-1.5" ref={anchorRef}>
      <Label htmlFor={id} className="text-caption font-medium text-neutral-600">
        {label}{required && <span className="text-[color:var(--secondary-color-700)] ml-0.5">*</span>}
      </Label>
      <Input
        id={id}
        placeholder={placeholder}
        defaultValue={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={`fld h-11 rounded-lg border px-3 text-h6 placeholder:text-neutral-400 ${disabled ? "border-warm-200 bg-warm-200/60 text-neutral-400 cursor-not-allowed" : invalid ? "border-[color:var(--color-attention)] bg-white text-neutral-800" : "border-warm-300 bg-white text-neutral-800"}`}
      />
      {errMode === "inline" && error && <ErrText>{error}</ErrText>}
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
  "ErrText": "{ children: React.ReactNode }",
  "Select": "{ label: string; required?: boolean; hint?: string; value?: string; onChange?: React.ChangeEventHandler<HTMLSelectElement>; options?: string[]; disabled?: boolean; error?: string; errMode?: string; anchorRef?: any }",
  "StepSection": "{ label?: string; n?: number; big?: boolean; className?: string; children: React.ReactNode }",
  "PlanCard": "{ p: Plan; selected: boolean; onSelect: () => void; initialTtOpen?: boolean }",
  "PlanCardAccordion": "{ p: Plan; selected: boolean; onSelect: () => void; open: boolean; onToggle: () => void; initialTtOpen?: boolean }",
  "WheelCol": "{ items: string[]; index: number; onChange: (v: number) => void; flex?: number; align?: string }",
  "DateDrumSheet": "{ open: boolean; value: string; onClose: () => void; onDone: (v: string) => void }",
  "ScreenOverview": "{ go: Go; initialHeigaiOpen?: boolean }",
  "ScreenStep2": "{ go: Go; sel: string; setSel: React.Dispatch<React.SetStateAction<string>>; deathOpt?: boolean; m: number; setM: React.Dispatch<React.SetStateAction<number>>; y: number; setY: React.Dispatch<React.SetStateAction<number>>; initialNoticeOpen?: boolean; initialAgree?: boolean; initialSimOpen?: boolean; initialShowSend?: boolean; initialTipIdx?: number; initialBirth?: string; emailVerified?: boolean; simFirst?: boolean; planCardStyle?: string; initialPlanOpenId?: string }",
  "ScreenPin": "{ go: Go; onVerified?: () => void; backScr?: number; initialPin?: string }",
  "ScreenPhone": "{ go: Go; onVerified?: () => void; backScr?: number; toScr?: number }",
  "Row": "{ k: string; v: React.ReactNode; strong?: boolean }",
  "FeatValue": "{ v: string }",
  "SimSliders": "{ m: number; setM: React.Dispatch<React.SetStateAction<number>>; y: number; setY: React.Dispatch<React.SetStateAction<number>>; onInput?: () => void }",
  "BenefitTable": "{ m: number; y: number; plan: Plan | undefined; startAge?: number }",
  "DisclosureModal": "{ plan: Plan | null; death?: boolean; onClose: () => void; confirm?: boolean; onConfirm?: () => void; onCancel?: () => void }",
  "Simulator": "{ m: number; setM: React.Dispatch<React.SetStateAction<number>>; y: number; setY: React.Dispatch<React.SetStateAction<number>>; initialSimOpen?: boolean; infoSlot?: React.ReactNode; planName?: string | null; plan: Plan | undefined; startAge?: number }",
  "ScreenForm": "{ go: Go; sel: string; deathOpt?: boolean; m: number; setM: React.Dispatch<React.SetStateAction<number>>; y: number; setY: React.Dispatch<React.SetStateAction<number>>; initialEditOpen?: boolean; initialSheetRes?: boolean; initialSame?: boolean; backScr?: number; formSplit?: boolean; errMode?: string; onTerminate?: () => void; kokuchiPattern?: string; initialFormPage?: number; initialDisclosureOpen?: boolean; initialErrStep?: number }",
  "KoTable": "{ rows: any[] }",
  "AgreeBlocks": "{ blocks: AgreeBlock[] }",
  "AgreeItem": "{ num: string; item: AgreeItemData; open: boolean; onToggle: () => void; checked?: boolean; onCheck?: () => void; children?: React.ReactNode }",
  "ScreenStep4": "{ go: Go; sel: string; deathOpt?: boolean; m: number; y: number; initialOpenIdx?: number; initialChecks?: boolean[]; initialAcctOpen?: boolean; benSameAddr?: boolean; initialEditKiyaku?: boolean; initialEditJuushin?: boolean; initialNat?: string }",
  "ExtBar": "{ url: string }",
  "ScreenCardInput": "{ go: Go }",
  "ScreenCardConfirm": "{ go: Go }",
  "ScreenDone": "{ go: Go; variant?: string }",
  "ScreenStatus": "{ variant?: string; go: Go }",
  "ScreenEnded": "{ onRestart: () => void }",
  "ScreenIntro": "{ go: Go }",
  "ScreenCombined": "{ go: Go; sel: string; setSel: React.Dispatch<React.SetStateAction<string>>; deathOpt?: boolean; m: number; setM: React.Dispatch<React.SetStateAction<number>>; y: number; setY: React.Dispatch<React.SetStateAction<number>>; emailVerified?: boolean; simFirst?: boolean; planCardStyle?: string; initialAgree?: boolean; initialShowSend?: boolean; initialTipIdx?: number; initialPlanOpenId?: string }",
  "PlanList": "{ sel: string; setSel: React.Dispatch<React.SetStateAction<string>>; mode?: string; initialTipIdx?: number; initialOpenId?: string }",
}

def inject_type(t, name, typ):
    # function NAME(<params>) {   ->   function NAME(<params>: typ) {
    # 括弧バランスで閉じ括弧を探す（アロー初期値 `= () => {}` 等の括弧に対応）。
    m = re.search(r'\nfunction ' + name + r'\(', t)
    if not m:
        print("WARN type sig not matched:", name); return t
    i = m.end() - 1  # '(' の位置
    depth = 0; j = i
    while j < len(t):
        c = t[j]
        if c == '(': depth += 1
        elif c == ')':
            depth -= 1
            if depth == 0: break
        j += 1
    return t[:j] + ": " + typ + t[j:]

for name, typ in TYPE.items():
    if name == "ScreenCombined":
        screen_combined = inject_type("\n" + screen_combined, name, typ).lstrip("\n")
    else:
        body = inject_type(body, name, typ)

# positional helpers
body = body.replace("function daysInMonth(y, m)", "function daysInMonth(y: number, m: number)")
body = body.replace("function pad2(n)", "function pad2(n: number)")
body = body.replace("function fmtBirth(v)", "function fmtBirth(v: string)")
# TD 組込1.5: 新ヘルパー (年齢計算 / 積立上限バリデーション)
body = must_replace(body, "function ageFromBirth(b)", "function ageFromBirth(b: string)")
body = must_replace(body, "function simErrors(m, y, startAge)", "function simErrors(m: number, y: number, startAge: number)")
# TD 組込1.5(1)→1.5(2): プラン×死亡保障 → ノックアウト告知テーブルを返すヘルパー (disclosureFor→koTableFor 改名)
body = must_replace(body, "function koTableFor(planId, death)", "function koTableFor(planId: string, death: boolean)")
body = must_replace(body, "const errs = [];", "const errs: string[] = [];")
# koTableFor の map は planId(string) で添字引きするため any キャスト。byKey も型付け。
body = must_replace(body,
    "const blocks = map[planId] || [KO_CANCER];",
    "const blocks: any[] = ((map as Record<string, any[]>)[planId] || [KO_CANCER]);")
body = must_replace(body, "const byKey = {};", "const byKey: Record<string, any> = {};")
# koTableFor forEach コールバック: any 経由呼び出しで implicit-any になるため明示型付け
body = must_replace(body,
    "(row.paras || []).forEach((p) => { if (!tgt.paras.some((q) => q.t === p.t)) tgt.paras.push(p); });",
    "(row.paras || []).forEach((p: any) => { if (!tgt.paras.some((q: any) => q.t === p.t)) tgt.paras.push(p); });")
body = must_replace(body,
    "(row.checks || []).forEach((c) => { if (!tgt.checks.includes(c)) tgt.checks.push(c); });",
    "(row.checks || []).forEach((c: any) => { if (!tgt.checks.includes(c)) tgt.checks.push(c); });")
# KoTable map コールバック: rows が any[] だと各段階のコールバック引数が implicit-any になる
body = must_replace(body,
    "{r.paras.map((p, j) => (",
    "{r.paras.map((p: any, j: number) => (")
body = must_replace(body,
    "{p.sub.map((row, k) => (",
    "{p.sub.map((row: any, k: number) => (")
body = must_replace(body,
    "{r.checks.map((c, j) => (",
    "{r.checks.map((c: any, j: number) => (")
# DisclosureQCard: row/idx パラメータと各 map コールバックに型注釈
body = must_replace(body,
    "function DisclosureQCard({ row, idx }) {",
    "function DisclosureQCard({ row, idx }: { row: any; idx: number }) {")
body = must_replace(body,
    "        {row.paras.map((p, j) => {",
    "        {row.paras.map((p: any, j: number) => {")
body = must_replace(body,
    "                {parts.map((seg, k) =>",
    "                {parts.map((seg: string, k: number) =>")
body = must_replace(body,
    "                  {p.sub.map((srow, sk) => (",
    "                  {p.sub.map((srow: any, sk: number) => (")
body = must_replace(body,
    "            {row.checks.map((c, j) => (",
    "            {row.checks.map((c: any, j: number) => (")
body = must_replace(body,
    "  const qCards = [];",
    "  const qCards: React.ReactNode[] = [];")

# infoPlan: handoff(5) で auto-open を廃止 → useState(null) に変更。
# windows の静的プレビューで告知モーダルを表示したい場合は initialDisclosureOpen={true} を渡す。
body = must_replace(body,
    "const [infoPlan, setInfoPlan] = useState(null);",
    "const [infoPlan, setInfoPlan] = useState<Plan | null>(initialDisclosureOpen ? (modalPlan ?? null) : null);")
# NOTE: handoff(5) で kokuchiPattern 切替 useEffect が削除されたため、対応 must_replace も撤去済み。

# ScreenOverview の heigaiOpen を initialHeigaiOpen prop で制御
# inject_type は型注釈のみ追加するため、destructuring にも initialHeigaiOpen を追加する
body = must_replace(body,
    "function ScreenOverview({ go }: { go: Go; initialHeigaiOpen?: boolean })",
    "function ScreenOverview({ go, initialHeigaiOpen }: { go: Go; initialHeigaiOpen?: boolean })")
# （ScreenCombined の同名 state と区別するため bindScroll コンテキストで一意化）
body = must_replace(body,
    "const [heigaiOpen, setHeigaiOpen] = useState(false);\n  const bindScroll",
    "const [heigaiOpen, setHeigaiOpen] = useState(initialHeigaiOpen ?? false);\n  const bindScroll")

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
# SimSliders 直接入力ハンドラ (TD 組込1.5: .num-input 連動)
body = body.replace(
    "const onMText = (e) => { const d = e.target.value.replace(/[^0-9]/g, \"\"); setM(d === \"\" ? 0 : +d); onInput && onInput(); };",
    "const onMText = (e: React.ChangeEvent<HTMLInputElement>) => { const d = e.target.value.replace(/[^0-9]/g, \"\"); setM(d === \"\" ? 0 : +d); onInput && onInput(); };")
body = body.replace(
    "const onYText = (e) => { const d = e.target.value.replace(/[^0-9]/g, \"\"); setY(d === \"\" ? 0 : +d); onInput && onInput(); };",
    "const onYText = (e: React.ChangeEvent<HTMLInputElement>) => { const d = e.target.value.replace(/[^0-9]/g, \"\"); setY(d === \"\" ? 0 : +d); onInput && onInput(); };")
# onYBlur: v は再代入なし → prefer-const 対応
body = body.replace(
    "const onYBlur = () => { let v = Math.min(30,",
    "const onYBlur = () => { const v = Math.min(30,")
body = body.replace("const setH = (k) => (e) => setHolder((h) => ({ ...h, [k]: e.target.value }));",
                    "const setH = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setHolder((h: any) => ({ ...h, [k]: e.target.value }));")

# ---- TD 組込1.5(1): 死亡保障オプション / インライン検証まわりの型注入 ----
# PlanCard 死亡保障トグルは handoff(4) で削除済み → no-op (旧コードのみ対応)。
body = body.replace(
    '{[["あり", true], ["なし", false]].map(([lbl, val]) => {',
    '{([["あり", true], ["なし", false]] as [string, boolean][]).map(([lbl, val]) => {')
# kokuchiPattern に応じた告知モーダル対象を特定するための any キャスト。
body = must_replace(body,
    "const kokuchiPat = KOKUCHI_PATTERNS.find((p) => p.key === kokuchiPattern);",
    "const kokuchiPat = KOKUCHI_PATTERNS.find((p: any) => p.key === kokuchiPattern);")
# ScreenForm エラーデモの動的添字オブジェクト群に型付け。
body = must_replace(body, "const fieldRefs = useRef({});", "const fieldRefs = useRef<Record<string, any>>({});")
body = must_replace(body, "const setFieldRef = (id) => (el: any) =>", "const setFieldRef = (id: string) => (el: any) =>")
body = must_replace(body,
    "const errMap = showErr ? Object.fromEntries(ERR_DEFS.map((e) => [e.id, e.msg])) : {};",
    "const errMap: Record<string, string> = showErr ? Object.fromEntries(ERR_DEFS.map((e) => [e.id, e.msg])) : {};")
body = must_replace(body, "const scrollToField = (id) => {", "const scrollToField = (id: string) => {")
body = must_replace(body, "const jumpNext = (list) => {", "const jumpNext = (list: typeof ERR_DEFS) => {")
# jumpIdx(useRef) → errStep(useState) でサイクル位置を再レンダリング可能に (TD 組込1.5-handoff(1))
body = must_replace(body,
    "const jumpIdx = useRef(0);",
    "const [errStep, setErrStep] = useState(initialErrStep);")
body = must_replace(body,
    "  scrollToField(list[jumpIdx.current % list.length].id);\n    jumpIdx.current++;",
    "  scrollToField(list[errStep % list.length].id);\n    setErrStep((s) => s + 1);")
# float バー右側のピルに「現在N/合計M 次の項目へ」カウンターを表示
body = must_replace(body,
    '<span className="flex items-center gap-1 text-caption font-medium whitespace-nowrap rounded-full bg-white/20 px-3 py-1">次の項目へ<Ic.chevR className="w-3.5 h-3.5" /></span>',
    '<span className="flex items-center gap-1 text-caption font-medium whitespace-nowrap rounded-full bg-white/20 px-3 py-1"><span className="font-mono tabular-nums">{errStep % visibleErrs.length + 1}/{visibleErrs.length}</span>&#8194;次の項目へ<Ic.chevR className="w-3.5 h-3.5" /></span>')
body = must_replace(body,
    "const errState = showErr ? { tel: !tel, benBirth: !benBirth, benGender: !benGender, rel: !rel } : {};",
    "const errState: Record<string, boolean> = showErr ? { tel: !tel, benBirth: !benBirth, benGender: !benGender, rel: !rel } : {};")
body = must_replace(body, "const errOf = (id) => (errState[id] ? errMap[id] : undefined);",
                    "const errOf = (id: string) => (errState[id] ? errMap[id] : undefined);")

# NoticeContent の Ul ヘルパーを関数外に移動 (component created during render ESLint rule 対策)。
# kumikomi でインライン定義されている const Ul を NoticeContent の手前に抽出して top-level に昇格させる。
_UL_INNER = "  const Ul = ({ items }) => (\n    <ul className=\"space-y-2 text-caption text-neutral-600 leading-relaxed\">\n      {items.map((t, i) => (\n        <li key={i} className=\"flex gap-1.5\"><span className=\"text-neutral-400 shrink-0\">・</span><span>{t}</span></li>\n      ))}\n    </ul>\n  );"
_UL_OUTER = "function NoticeUl({ items }: { items: string[] }) {\n  return (\n    <ul className=\"space-y-2 text-caption text-neutral-600 leading-relaxed\">\n      {items.map((t: string, i: number) => (\n        <li key={i} className=\"flex gap-1.5\"><span className=\"text-neutral-400 shrink-0\">・</span><span>{t}</span></li>\n      ))}\n    </ul>\n  );\n}\n\n/* 重要事項・事前同意事項モーダルの本文（プラン選択／TOP統合案で共通） */"
if _UL_INNER in body:
    body = body.replace(_UL_INNER + "\n", "")  # Ul を NoticeContent 内から除去
    body = body.replace(
        "/* 重要事項・事前同意事項モーダルの本文（プラン選択／TOP統合案で共通） */",
        _UL_OUTER)
    body = body.replace("<Ul items=", "<NoticeUl items=")

# ScreenDone: variant チェックの early return が useRef より前 → hook の条件付き呼び出し ESLint エラー対策
# useRef を早期リターンの前に移動する (TD 組込1.5(3))
body = body.replace(
    "  if (variant !== 'done') return <ScreenStatus variant={variant} go={go} />;\n  const doneBgRef = useRef<any>(null);",
    "  const doneBgRef = useRef<any>(null);\n  if (variant !== 'done') return <ScreenStatus variant={variant} go={go} />;")

# IKO[planIdFromSel(sel)]: planIdFromSel が string を返し IKO のキーは具体的なリテラル型 → any キャスト
# handoff(4) で IKO[sel] → IKO[planIdFromSel(sel)] に変更。旧パターンも残す (fallback)。
body = body.replace(
    "const ikoText = (IKO[sel] || IKO.cancer)[deathOpt ? \"d\" : \"n\"];",
    "const ikoText = ((IKO as Record<string, any>)[sel] || IKO.cancer)[deathOpt ? \"d\" : \"n\"];")
body = body.replace(
    "const ikoMid = (IKO[sel] || IKO.cancer)[deathOpt ? \"d\" : \"n\"];",
    "const ikoMid = ((IKO as Record<string, any>)[sel] || IKO.cancer)[deathOpt ? \"d\" : \"n\"];")
# handoff(4): planIdFromSel を挟む新パターン
body = body.replace(
    "const ikoMid = (IKO[planIdFromSel(sel)] || IKO.cancer)[deathOpt ? \"d\" : \"n\"];",
    "const ikoMid = ((IKO as Record<string, any>)[planIdFromSel(sel)] || IKO.cancer)[deathOpt ? \"d\" : \"n\"];")

# ---- const type annotations ----
body = body.replace("const STEP_TO_SCREEN = {", "const STEP_TO_SCREEN: Record<number, number> = {")
body = body.replace("const PREFS = [", "const PREFS: string[] = [")
body = body.replace("const PLANS = [", "const PLANS: Plan[] = [")
body = body.replace("const AGREE_ITEMS = [", "const AGREE_ITEMS: AgreeItemData[] = [")
# handoff(4): PLAN_CARDS (10枚フラット配列), planIdFromSel/deathFromSel ヘルパー型注釈
body = body.replace(
    "const PLAN_CARDS = PLANS.flatMap((p) => [",
    "const PLAN_CARDS: (Plan & { planId: string })[] = PLANS.flatMap((p) => [")
body = body.replace("function planIdFromSel(sel) {", "function planIdFromSel(sel: string) {")
body = body.replace("function deathFromSel(sel)  {", "function deathFromSel(sel: string)  {")

# ---- handoff(4): ScreenPin 6-box PIN 入力の新ヘルパーに型注釈 ----
body = body.replace(
    "const pinRefs = useRef([]);",
    "const pinRefs = useRef<HTMLInputElement[]>([]);")
body = body.replace(
    "const setDigit = (i, v) => {",
    "const setDigit = (i: number, v: string) => {")
body = body.replace(
    "const onPinKey = (i, e) => {",
    "const onPinKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {")
body = body.replace(
    "const onPinPaste = (e) => {",
    "const onPinPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {")

# ---- export prefixing (top-level only) ----
body = re.sub(r'^function ', 'export function ', body, flags=re.M)
body = re.sub(r'^const ', 'export const ', body, flags=re.M)
screen_combined = re.sub(r'^function ', 'export function ', screen_combined, flags=re.M)

# TD 組込1.5: kumikomi で字下げされていない関数内 const は export 不可。
# `agreeItems` は ScreenStep4 内のローカル (plan を参照) なので export を剥がす。
body = must_replace(body, "export const agreeItems = deathOpt", "  const agreeItems = deathOpt")

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
/* eslint-disable react-hooks/refs --
   ScreenForm の setFieldRef は ref コールバック (ref={setFieldRef(id)}) で、
   .current への代入はコミット時に走る正規パターン。React Compiler ルールの誤検知を抑制。 */
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
};

export type AgreeItemData = {
  t: string;
  blocks: AgreeBlock[];
  kind?: string;
  id?: string;
};

type Go = (n: number) => void;

'''

# ---- Tailwind サイズグリッド正規化 ----
# 許容ピクセル値: 1, 2, 4, 8, 12, 16, 24, 32, 40, 48, 56, 64, ... (24以降は8の倍数)
# ・小数点クラス（-1.5, -2.5, -3.5等）→ 最寄りの許容値（切り上げ）
# ・-0.5（2px）は許容値だが小数表記を廃止 → -[2px]（任意値）
# ・整数 5(20px)/7(28px)/9(36px)/11(44px) → 切り上げ
def normalize_grid(t: str) -> str:
    import re as _re
    # spacing/size プロパティ prefix
    PROPS = [
        'px', 'py', 'pt', 'pb', 'pl', 'pr', 'p',
        'mx', 'my', 'mt', 'mb', 'ml', 'mr', 'm',
        'gap-x', 'gap-y', 'gap',
        'space-x', 'space-y',
        'w', 'h', 'size',
        'inset', 'top', 'bottom', 'left', 'right',
        'min-w', 'min-h', 'max-w', 'max-h',
    ]
    # .5 系 (小数値を許容グリッドへ)
    FRAC_MAP = {
        '0.5': ('[2px]', ['py','px','pt','pb','pl','pr','p','mx','my','mt','mb','ml','mr','m',
                           'gap-x','gap-y','gap','space-x','space-y','h','w','size',
                           'inset','top','bottom','left','right']),
        '1.5': ('2',     PROPS),
        '2.5': ('3',     PROPS),
        '3.5': ('4',     PROPS),
        '4.5': ('4',     PROPS),  # 18px → 16px (最寄りは16か24、小さい方を選択)
    }
    for frac, (to_num, props) in FRAC_MAP.items():
        for prop in sorted(props, key=len, reverse=True):  # longer first
            # 負prefix variant (-mx-5 等) は先に処理
            t = _re.sub(r'(?<![a-zA-Z0-9_])(-' + _re.escape(prop) + r')-' + _re.escape(frac) + r'\b',
                        r'\1-' + to_num, t)
            # 通常 prefix
            t = _re.sub(r'\b' + _re.escape(prop) + r'-' + _re.escape(frac) + r'\b',
                        prop + '-' + to_num, t)

    # 整数 non-grid (20/28/36/44/52/60 px → 切り上げ)
    INT_MAP = [
        ('5', '6'),   # 20px → 24px
        ('7', '8'),   # 28px → 32px
        ('9', '10'),  # 36px → 40px
        ('11', '12'), # 44px → 48px
        ('13', '14'), # 52px → 56px
        ('15', '16'), # 60px → 64px
    ]
    for from_n, to_n in INT_MAP:
        for prop in sorted(PROPS, key=len, reverse=True):
            # 負prefix
            t = _re.sub(r'(?<![a-zA-Z0-9_])(-' + _re.escape(prop) + r')-' + from_n + r'\b',
                        r'\1-' + to_n, t)
            # 通常
            t = _re.sub(r'\b' + _re.escape(prop) + r'-' + from_n + r'\b',
                        prop + '-' + to_n, t)
    return t

body = normalize_grid(body)
screen_combined = normalize_grid(screen_combined)
if _heigai:
    _heigai = normalize_grid(_heigai)

# cn is imported but only used if needed; keep usage to avoid unused — reference in a noop is ugly.
# Instead drop cn import if not used.
final = HEADER + body + ("\n\n" + _heigai if _heigai else "") + "\n\n" + screen_combined + "\n"
if "cn(" not in final:
    final = final.replace('import { cn } from "@/lib/utils";\n', '')

open(OUT, "w", encoding="utf-8").write(final)
print("WROTE", OUT, "lines:", final.count("\n"))
