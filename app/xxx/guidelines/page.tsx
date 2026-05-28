import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  SparklesIcon,
  PaletteIcon,
  EyeIcon,
  AccessibilityIcon,
  TypeIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JpText } from "@/components/jp-text";

/* =================================================================
 * /guidelines/td — XXX 社専用デザインガイドライン
 *
 * このページは uploads/MILIZE UIUX Design System (Bundle).zip 内の `td-tokens.css` と
 * `ui_kits/portal/*` の運用ルールを一次ソースとして書き起こしたものです。
 *
 * テナント差し替えポイント (色トークン):
 *   --primary-color-500 #0f766e — primary navy (ブランド基調)
 *   --secondary-color-500    #0891b2 — info / link / secondary
 *   --button-color-500         #d97706 — submit-CTA red (申込確定/前進)
 *   --warm-50             #fafaf9 — premium / featured surface
 *
 * 設計の特徴:
 *   - Primary は赤ではなく "ティール"。ブランド基調を担うのは深い紺。
 *   - 申込/前進だけは "アンバー (amber)" を採用。danger とは別物として運用。
 *   - dark mode の surface は無彩色 (zinc) — ブランド色の影響を受けない汎用設計。
 * ================================================================= */

export const metadata: Metadata = {
  title: "XXX ガイドライン | Design System",
  description:
    "XXX社 (サンプル架空企業)のブランドアイデンティティ (信頼・誠実・モダン・クリーン) と Embedded Insurance トークンに基づくカラー・タイポグラフィ・アクセシビリティの公式ガイドライン。",
};

export default function TdGuidelinesPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <HeroSection />
      <BrandPillars />
      <ColorRules />
      <ButtonRules />
      <TypographyRules />
      <AccessibilityRules />
      <RadiusAndShadow />
      <ContentRules />
      <Footer />
    </main>
  );
}

/* ---------------------------------------------------------------- */
/* セクション共通                                                    */
/* ---------------------------------------------------------------- */

/**
 * 読み手バッジ — そのセクションが誰向けかを示すヒント。
 * 「ページを分けない」方針なので、ナビゲーション補助として控えめに表示する。
 */
type Audience = "designer" | "developer" | "both";

const AUDIENCE_LABELS: Record<Audience, { icon: string; label: string }> = {
  designer:  { icon: "🎨", label: "デザイナー向け" },
  developer: { icon: "💻", label: "開発者向け" },
  both:      { icon: "🤝", label: "両者向け" },
};

function AudienceBadge({ audience }: { audience: Audience }) {
  const { icon, label } = AUDIENCE_LABELS[audience];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-tiny font-medium text-muted-foreground"
      aria-label={`このセクションは ${label}`}
    >
      <span aria-hidden>{icon}</span>
      <span>{label}</span>
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  audience,
}: {
  eyebrow: string;
  title: string;
  description: string;
  audience?: Audience;
}) {
  return (
    <header className="mb-8 max-w-3xl">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>
        {audience ? <AudienceBadge audience={audience} /> : null}
      </div>
      <h2 className="mt-2 text-h5 font-semibold leading-tight tracking-tight">
        <JpText>{title}</JpText>
      </h2>
      <p className="mt-3 text-body text-muted-foreground sm:text-body-lg">
        {description}
      </p>
    </header>
  );
}

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`mt-20 scroll-mt-24 transition-colors duration-300 ${className}`}
    >
      {children}
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 1. ヒーロー                                                       */
/* ---------------------------------------------------------------- */

function HeroSection() {
  return (
    <header className="mb-8 max-w-3xl">
      <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
        Guidelines
      </p>
      <h1 className="mt-2 text-h3 font-semibold tracking-tight sm:text-h2">
        デザインガイドライン
      </h1>
      <p className="mt-3 text-body text-muted-foreground sm:text-body-lg">
        XXX社のデジタル体験は、金融・保険領域で求められる
        <strong className="text-foreground">「誠実さ」</strong>と、
        現代の Web / アプリに求められる
        <strong className="text-foreground">「クリーンさ」</strong>を両立させます。
        本ガイドラインは <code>tokens.css</code> と
        Portal UI Kit の運用を、実装に落とすための公式ルールです。
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="secondary" className="gap-1.5">
          <ShieldCheck className="size-3" />
          XXX · Embedded Insurance
        </Badge>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------- */
/* 2. ブランドの 4 つの柱                                              */
/* ---------------------------------------------------------------- */

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "信頼 (Trust)",
    body: "Primary はティール (#0f766e)。揺るぎない情報密度で誤読を防ぎ、保険・金融プロダクトに不可欠な「読み違えゼロ」を最優先する。",
  },
  {
    icon: SparklesIcon,
    title: "誠実 (Sincerity)",
    body: "誇張・煽り表現は使わない。CTA のアンバー (#d97706) は申込/前進だけに限定し、ボタン・コピー・配色で過度な訴求をしない。",
  },
  {
    icon: PaletteIcon,
    title: "モダン (Modern)",
    body: "Figma Variables ベースのトークン駆動。tenant override は --secondary-color-* と --primary-color-* に集約され、semantic 層は触らない。",
  },
  {
    icon: EyeIcon,
    title: "クリーン (Clean)",
    body: "余白とグレースケールで階層を作る。warm (#fafaf9) は premium 面に限定し、装飾色は持ち込まない。",
  },
];

function BrandPillars() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Brand Pillars"
        title="ブランドの 4 つの柱"
        description="すべてのデザイン判断はこの 4 つに照らして妥当性を確認します。迷ったら最も保守的な選択を採ります。"
        audience="both"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {PILLARS.map(({ icon: Icon, title, body }) => (
          <Card key={title} className="transition-colors duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-md bg-accent text-accent-foreground">
                  <Icon className="size-4" aria-hidden />
                </span>
                <CardTitle className="text-h7">{title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-body text-muted-foreground">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* 3. カラー運用                                                      */
/* ---------------------------------------------------------------- */

function ColorRules() {
  return (
    <Section id="color">
      <SectionHeading
        eyebrow="Color"
        title="Teal 基調 + Cyan アクセント + Teal 通常ボタン + Amber CTA"
        description="XXX のカラーは 5 つのスケール (primary-color / secondary-color / button-color / cta-color / warm) で構成されます。CTA と通常ボタンを別スケールで分け、申込専用色を明示します。直接 hex を書かず、必ず var(--primary) / var(--ring) 等の semantic 層を経由します。"
        audience="both"
      />

      {/* スウォッチ群 — 5 スケール */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ScaleBlock
          title="primary-color"
          subtitle="コーポレートカラー1 · Teal #0f766e · ブランド主要色 / ヘッダー / sidebar"
          stops={[
            { name: "10", hex: "#f0fdfa", inv: false },
            { name: "50", hex: "#ccfbf1", inv: false },
            { name: "100", hex: "#99f6e4", inv: false },
            { name: "200", hex: "#5eead4", inv: false },
            { name: "300", hex: "#2dd4bf", inv: false },
            { name: "400", hex: "#14b8a6", inv: true },
            { name: "500", hex: "#0f766e", inv: true, primary: true },
            { name: "600", hex: "#115e59", inv: true },
            { name: "700", hex: "#134e4a", inv: true },
          ]}
        />
        <ScaleBlock
          title="secondary-color"
          subtitle="コーポレートカラー2 · Cyan #0891b2 · highlight / link / アクセント"
          stops={[
            { name: "10", hex: "#ecfeff", inv: false },
            { name: "50", hex: "#cffafe", inv: false },
            { name: "100", hex: "#a5f3fc", inv: false },
            { name: "200", hex: "#67e8f9", inv: false },
            { name: "300", hex: "#22d3ee", inv: false },
            { name: "400", hex: "#06b6d4", inv: true },
            { name: "500", hex: "#0891b2", inv: true, primary: true },
            { name: "600", hex: "#0e7490", inv: true },
            { name: "700", hex: "#155e75", inv: true },
          ]}
        />
        <ScaleBlock
          title="button-color"
          subtitle="通常ボタンカラー · Teal #14b8a6 · 色面 + 罫線の 2 バリアント"
          stops={[
            { name: "50", hex: "#f0fdfa", inv: false },
            { name: "100", hex: "#ccfbf1", inv: false },
            { name: "200", hex: "#99f6e4", inv: false },
            { name: "300", hex: "#5eead4", inv: false },
            { name: "400", hex: "#2dd4bf", inv: false },
            { name: "500", hex: "#14b8a6", inv: true, primary: true },
            { name: "600", hex: "#0d9488", inv: true },
            { name: "700", hex: "#0f766e", inv: true },
          ]}
        />
        <ScaleBlock
          title="cta-color"
          subtitle="CTA 申込ボタンカラー · Amber #d97706 · 申込/前進 専用"
          stops={[
            { name: "50", hex: "#fffbeb", inv: false },
            { name: "100", hex: "#fef3c7", inv: false },
            { name: "200", hex: "#fde68a", inv: false },
            { name: "300", hex: "#fcd34d", inv: false },
            { name: "400", hex: "#fbbf24", inv: false },
            { name: "500", hex: "#d97706", inv: true, primary: true },
            { name: "600", hex: "#b45309", inv: true },
            { name: "700", hex: "#92400e", inv: true },
          ]}
        />
        <ScaleBlock
          title="warm (neutral)"
          subtitle="無彩色 neutral · 背景 / 区切り線。装飾色は持ち込まない"
          stops={[
            { name: "50", hex: "#fafaf9", inv: false, primary: true },
            { name: "100", hex: "#f5f5f4", inv: false },
            { name: "200", hex: "#e7e5e4", inv: false },
            { name: "300", hex: "#d6d3d1", inv: false },
          ]}
        />
      </div>

      {/* Tailwind マッピング表 (token → Tailwind class → CSS var → 実際の値) */}
      <Card className="mt-8 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-h7">token → Tailwind class → CSS var の対応表</CardTitle>
          <CardDescription>
            デザイナーが指す色 (Figma の primary-color-500) と、開発者が書くコード (className=&quot;bg-primary&quot;) と、ブラウザに渡る CSS の値が、どう繋がっているか。Tailwind v4 の <code>@theme inline</code> が CSS Variable をそのまま utility class として公開しているため、3 つは常に同期します。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>役割</TableHead>
                  <TableHead>Tailwind class (Dev)</TableHead>
                  <TableHead>CSS variable</TableHead>
                  <TableHead className="text-right">解決値</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>ブランド主要色 (primary)</TableCell>
                  <TableCell><code className="font-mono">bg-primary</code> / <code className="font-mono">text-primary</code> / <code className="font-mono">ring-primary</code></TableCell>
                  <TableCell className="font-mono text-caption">var(--primary)</TableCell>
                  <TableCell className="text-right font-mono text-caption">#0f766e Teal</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>primary 上の文字色</TableCell>
                  <TableCell><code className="font-mono">text-primary-foreground</code></TableCell>
                  <TableCell className="font-mono text-caption">var(--primary-foreground)</TableCell>
                  <TableCell className="text-right font-mono text-caption">#ffffff</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>背景 / 本文</TableCell>
                  <TableCell><code className="font-mono">bg-background</code> / <code className="font-mono">text-foreground</code></TableCell>
                  <TableCell className="font-mono text-caption">var(--background) / var(--foreground)</TableCell>
                  <TableCell className="text-right font-mono text-caption">white / near-black</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>補助テキスト</TableCell>
                  <TableCell><code className="font-mono">text-muted-foreground</code></TableCell>
                  <TableCell className="font-mono text-caption">var(--muted-foreground)</TableCell>
                  <TableCell className="text-right font-mono text-caption">gray-500 相当</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>カード面 / 文字</TableCell>
                  <TableCell><code className="font-mono">bg-card</code> / <code className="font-mono">text-card-foreground</code></TableCell>
                  <TableCell className="font-mono text-caption">var(--card) / var(--card-foreground)</TableCell>
                  <TableCell className="text-right font-mono text-caption">white / foreground</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>境界線</TableCell>
                  <TableCell><code className="font-mono">border-border</code></TableCell>
                  <TableCell className="font-mono text-caption">var(--border)</TableCell>
                  <TableCell className="text-right font-mono text-caption">gray-200 相当</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>アクセント (hover の薄背景)</TableCell>
                  <TableCell><code className="font-mono">bg-accent</code> / <code className="font-mono">text-accent-foreground</code></TableCell>
                  <TableCell className="font-mono text-caption">var(--accent) / var(--accent-foreground)</TableCell>
                  <TableCell className="text-right font-mono text-caption">primary-color-10 (#f0fdfa)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>destructive / エラー</TableCell>
                  <TableCell><code className="font-mono">bg-destructive</code></TableCell>
                  <TableCell className="font-mono text-caption">var(--destructive)</TableCell>
                  <TableCell className="text-right font-mono text-caption">red-600 系</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* テナント生スケールへの直接アクセス */}
      <Card className="mt-4 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-h7">テナント生スケールへの直接アクセス</CardTitle>
          <CardDescription>
            上の semantic だけでは表現できない場合 (グラフの 6 色目を出したい等) に使う、生スケールへの直接参照。可能な限り上の semantic を優先し、これは「最終手段」として位置づけます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-md bg-muted/60 p-4 font-mono text-tiny leading-relaxed text-muted-foreground">{`/* CSS: 直接 var() で参照 */
.my-chart-bar-2 {
  background: var(--primary-color-300);  /* teal-300 */
  border-color: var(--secondary-color-500); /* cyan-600 */
}

/* React / Tailwind: arbitrary value で参照 */
<div className="bg-[color:var(--primary-color-300)]">
  ...
</div>`}</pre>
        </CardContent>
      </Card>

      {/* Tailwind class でのコードスニペット — 開発者がコピペで使える */}
      <Card className="mt-4 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-h7">コードスニペット (コピペ用)</CardTitle>
          <CardDescription>
            よくあるパターン。<strong className="text-foreground">直接 hex を書かない</strong>こと
            (Figma 側の値変更時に追従できなくなるため)。Tailwind utility か CSS var を経由。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SnippetCard
            label="① ヘッダー / ヒーロー (Teal primary)"
            preview={
              <div className="rounded-md bg-primary px-4 py-3 text-primary-foreground">
                <p className="text-caption font-medium opacity-80">Embedded Insurance</p>
                <p className="text-h7 font-semibold">信頼を、もっと触れる距離に。</p>
              </div>
            }
            code={`<header className="rounded-md bg-primary px-4 py-3 text-primary-foreground">
  <p className="text-caption opacity-80">Embedded Insurance</p>
  <p className="text-h7 font-semibold">信頼を、もっと触れる距離に。</p>
</header>`}
          />

          <SnippetCard
            label="② CTA 申込ボタン (Amber)"
            preview={
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-[color:var(--cta-color-500)] px-4 py-2 text-sm font-semibold text-white hover:bg-[color:var(--cta-color-600)]"
              >
                申込を確定する
              </button>
            }
            code={`<button className="inline-flex items-center justify-center rounded-md
  bg-[color:var(--cta-color-500)] px-4 py-2 text-sm font-semibold text-white
  hover:bg-[color:var(--cta-color-600)]">
  申込を確定する
</button>`}
          />

          <SnippetCard
            label="③ 通常ボタン (Teal, 色面)"
            preview={
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-[color:var(--button-color-500)] px-4 py-2 text-sm font-semibold text-white hover:bg-[color:var(--button-color-600)]"
              >
                変更を保存
              </button>
            }
            code={`<button className="inline-flex items-center justify-center rounded-md
  bg-[color:var(--button-color-500)] px-4 py-2 text-sm font-semibold text-white
  hover:bg-[color:var(--button-color-600)]">
  変更を保存
</button>`}
          />

          <SnippetCard
            label="④ 通常ボタン (Teal, 罫線)"
            preview={
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-[color:var(--button-color-500)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--button-color-500)] hover:bg-[color:var(--button-color-50)]"
              >
                変更を保存
              </button>
            }
            code={`<button className="inline-flex items-center justify-center rounded-md
  border border-[color:var(--button-color-500)] bg-white px-4 py-2
  text-sm font-semibold text-[color:var(--button-color-500)]
  hover:bg-[color:var(--button-color-50)]">
  変更を保存
</button>`}
          />

          <SnippetCard
            label="⑤ 重要ラベル / バッジ (Cyan secondary)"
            preview={
              <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--secondary-color-10)] px-3 py-1 text-caption font-medium text-[color:var(--secondary-color-700)]">
                重要
              </span>
            }
            code={`<span className="inline-flex items-center gap-1 rounded-full
  bg-[color:var(--secondary-color-10)] px-3 py-1
  text-caption font-medium text-[color:var(--secondary-color-700)]">
  重要
</span>`}
          />

          <SnippetCard
            label="⑥ Card (汎用、ブランドに依存しない)"
            preview={
              <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
                <p className="text-h7 font-semibold">タイトル</p>
                <p className="mt-1 text-body text-muted-foreground">
                  本文。<code className="text-foreground">bg-card</code> / <code className="text-foreground">text-card-foreground</code> /{" "}
                  <code className="text-foreground">border-border</code> は全テナント共通の semantic です。
                </p>
              </div>
            }
            code={`<div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
  <p className="text-h7 font-semibold">タイトル</p>
  <p className="mt-1 text-body text-muted-foreground">本文</p>
</div>`}
          />
        </CardContent>
      </Card>

      <div className="mt-6 rounded-lg border border-border bg-card p-5 text-card-foreground transition-colors duration-300">
        <h3 className="text-h7 font-semibold">テナント差し替え点</h3>
        <p className="mt-2 text-body text-muted-foreground">
          顧客企業が変えるのは 4 つのスケール (<code>--primary-color-*</code>、
          <code>--secondary-color-*</code>、<code>--button-color-*</code>、
          <code>--cta-color-*</code>) と、ロゴアセット。Semantic 層 (<code>--primary</code> /
          <code>--accent</code> 等) は自動で追従するので触らないこと。
        </p>
      </div>
    </Section>
  );
}

/**
 * コードスニペット表示用カード — preview (実描画) + code (className 文字列) を並べる。
 */
function SnippetCard({
  label,
  preview,
  code,
}: {
  label: string;
  preview: React.ReactNode;
  code: string;
}) {
  return (
    <div className="rounded-md border border-border bg-card transition-colors duration-300">
      <div className="border-b border-border px-4 py-2">
        <p className="text-caption font-medium text-foreground">{label}</p>
      </div>
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="flex items-center justify-center border-b border-border bg-background p-4 lg:border-b-0 lg:border-r">
          {preview}
        </div>
        <pre className="overflow-x-auto bg-muted/40 p-4 font-mono text-tiny leading-relaxed text-muted-foreground">
          {code}
        </pre>
      </div>
    </div>
  );
}

function ScaleBlock({
  title,
  subtitle,
  stops,
}: {
  title: string;
  subtitle: string;
  stops: {
    name: string;
    hex: string;
    inv?: boolean;
    primary?: boolean;
  }[];
}) {
  return (
    <Card className="overflow-hidden transition-colors duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-h7 font-mono">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="grid overflow-hidden rounded-md border border-border"
          style={{ gridTemplateColumns: `repeat(${stops.length}, minmax(0, 1fr))` }}
        >
          {stops.map((s) => (
            <div
              key={s.name}
              className="relative flex flex-col items-center justify-center py-3 text-[10px] leading-none"
              style={{ background: s.hex, color: s.inv ? "#fff" : "#0f172a" }}
              title={`${title}-${s.name} · ${s.hex}`}
            >
              <span className="font-semibold">{s.name}</span>
              <span className="mt-1 font-mono opacity-80">{s.hex}</span>
              {s.primary ? (
                <span className="absolute right-1 top-1 size-1.5 rounded-full bg-current opacity-70" />
              ) : null}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------------------------------------------------------- */
/* 4. ボタン運用 (XXX の核)                                            */
/* ---------------------------------------------------------------- */

function ButtonRules() {
  return (
    <Section id="buttons">
      <SectionHeading
        eyebrow="Buttons"
        title="5 種類のボタンを意味で使い分ける"
        description="XXX 専用のボタン体系は td-tokens.css の --button-* に定義されています。「赤 = 申込/前進」「ティール = 通常確定」「グレー = キャンセル」「白枠 = サブ」「destructive = 削除」を厳密に分けます。"
        audience="both"
      />

      <div className="grid gap-3 md:grid-cols-2">
        <ButtonRow
          name="cta"
          desc="申込/前進 (positive forward action)。1 画面に 1 つまで。"
          example={
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-[10px] bg-[#d97706] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(217, 119, 6, 0.5)] hover:bg-[#b45309]"
            >
              申込を確定する
            </button>
          }
          token="--button-cta · #d97706"
        />
        <ButtonRow
          name="primary"
          desc="通常の確定 (保存・変更を反映)。エンタープライズの基本ボタン。"
          example={
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-[10px] bg-[#0f766e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#115e59]"
            >
              変更を保存
            </button>
          }
          token="--button-primary · #0f766e"
        />
        <ButtonRow
          name="neutral"
          desc="キャンセル / 戻る。primary と並べて主従を明示する。"
          example={
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-[10px] bg-[#eef1f6] px-4 py-2 text-sm font-medium text-[#475569] hover:bg-[#e3e7ee]"
            >
              やめる
            </button>
          }
          token="--button-neutral · #eef1f6"
        />
        <ButtonRow
          name="outline"
          desc="サブ操作 (CSV 出力・エクスポート等)。複数並列可。"
          example={
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-[10px] border border-[#c9d0dd] bg-white px-4 py-2 text-sm font-medium text-[#0f172a] hover:bg-[#f9fafc]"
            >
              CSV 出力
            </button>
          }
          token="--button-outline · border #c9d0dd"
        />
        <ButtonRow
          name="destructive"
          desc="削除 (不可逆操作)。small サイズに限定。cta と同じ赤を使うが意味が違う。"
          example={
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-[10px] bg-[#d97706] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#b45309]"
            >
              アカウントを削除
            </button>
          }
          token="--button-cta-* (small size only)"
        />
      </div>

      <Card className="mt-6 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-h7">1 画面 1 つだけ、の規律</CardTitle>
          <CardDescription>
            赤 (cta) とティール (primary) が同一画面に並ぶのは原則禁止。並べる場合は赤を 1 つに絞り、ティールは neutral / outline に降格させること。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>状況</TableHead>
                  <TableHead>OK / NG</TableHead>
                  <TableHead>理由</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>申込フォームの最下部 (送信)</TableCell>
                  <TableCell><Badge>OK</Badge></TableCell>
                  <TableCell className="text-muted-foreground">前進アクションは cta 赤で 1 つに収束</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>キャンセル + 送信を並べる</TableCell>
                  <TableCell><Badge>OK</Badge></TableCell>
                  <TableCell className="text-muted-foreground">cta + neutral の主従関係</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>cta 赤 と primary ティールを同列</TableCell>
                  <TableCell><Badge variant="destructive">NG</Badge></TableCell>
                  <TableCell className="text-muted-foreground">どちらが主か判断できなくなる</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>キャンセル を赤にする</TableCell>
                  <TableCell><Badge variant="destructive">NG</Badge></TableCell>
                  <TableCell className="text-muted-foreground">赤は前進専用。後退・否定には使わない</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>大面積の赤い背景</TableCell>
                  <TableCell><Badge variant="destructive">NG</Badge></TableCell>
                  <TableCell className="text-muted-foreground">cta 赤はピンポイント。装飾には使わない</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}

function ButtonRow({
  name,
  desc,
  example,
  token,
}: {
  name: string;
  desc: string;
  example: React.ReactNode;
  token: string;
}) {
  return (
    <Card className="transition-colors duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-h7 font-mono">{name}</CardTitle>
          <Badge variant="outline" className="font-mono text-tiny">
            {token}
          </Badge>
        </div>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent className="pb-5">{example}</CardContent>
    </Card>
  );
}

/* ---------------------------------------------------------------- */
/* 5. タイポグラフィ                                                  */
/* ---------------------------------------------------------------- */

const FONT_SCALE = [
  { name: "h1", token: "--text-h1", px: 28, use: "ページ最大タイトル" },
  { name: "h2", token: "--text-h2", px: 22, use: "セクション見出し" },
  { name: "h3", token: "--text-h3", px: 18, use: "サブセクション" },
  { name: "h4", token: "--text-h4", px: 16, use: "カードタイトル" },
  { name: "body-lg", token: "--text-body-lg", px: 15, use: "本文 (リード)" },
  { name: "body", token: "--text-body", px: 14, use: "本文 (標準)" },
  { name: "caption", token: "--text-caption", px: 12, use: "メタデータ・ラベル" },
  { name: "eyebrow", token: "--text-eyebrow", px: 11, use: "セクション eyebrow (uppercase)" },
];

function TypographyRules() {
  return (
    <Section id="type">
      <SectionHeading
        eyebrow="Typography"
        title="モバイル基準の 8 段スケール"
        description="td-tokens.css は 'モバイルチューニング済み' のスケール。ワイヤーフレームでは 7–10px が混在していたものを下限 12px に引き上げ、業務系の可読性を確保しています。フォントは Geist Sans + Noto Sans JP のセルフホスト構成。"
        audience="both"
      />
      <div className="overflow-hidden rounded-md border border-border transition-colors duration-300">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">サイズ名</TableHead>
              <TableHead className="w-40">トークン</TableHead>
              <TableHead className="w-20">px</TableHead>
              <TableHead>用途</TableHead>
              <TableHead className="text-right">プレビュー</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FONT_SCALE.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>
                  <code className="text-caption text-muted-foreground">
                    {row.token}
                  </code>
                </TableCell>
                <TableCell className="tabular-nums">{row.px}</TableCell>
                <TableCell className="text-muted-foreground">{row.use}</TableCell>
                <TableCell className="text-right">
                  <span
                    className="font-semibold leading-none"
                    style={{ fontSize: row.px }}
                  >
                    Aあ
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="transition-colors duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-h7">フォントスタック</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 text-body text-muted-foreground">
            <p>
              ラテン: <strong className="text-foreground">Geist Sans</strong>{" "}
              (Google Fonts CDN)
            </p>
            <p>
              日本語: <strong className="text-foreground">Noto Sans JP</strong>{" "}
              (セルフホスト · 100–900 の 9 ウェイト)
            </p>
            <p>
              コード: <strong className="text-foreground">Geist Mono</strong>
            </p>
            <p className="text-caption">
              見出し font-weight = 600 / 本文 line-height = 1.6 / 見出し
              tracking = -0.02em 起点で段階的に緩める。
            </p>
          </CardContent>
        </Card>
        <Card className="transition-colors duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-h7">禁止事項</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 text-body text-muted-foreground">
            <p>Tailwind の任意スケール (text-xl / text-2xl 等) は使わない。必ず <code>text-h*</code> / <code>text-body*</code> を使う。</p>
            <p>11px (eyebrow) を本文用途で使うのは禁止。eyebrow は uppercase + tracked のみ。</p>
            <p>見出しを 2 段以上スキップしない (例: h2 → h4)。</p>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* 6. アクセシビリティ                                                */
/* ---------------------------------------------------------------- */

function AccessibilityRules() {
  return (
    <Section id="a11y">
      <SectionHeading
        eyebrow="Accessibility"
        title="20 代から 70 代までを一枚の UI で支える"
        description="XXX のユーザー層は 20 代の新規契約者から 70 代の既契約者まで幅広い。WCAG 2.2 AA を最低ラインとし、年齢階層を問わず迷わず操作できる UI を目指します。"
        audience="both"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="transition-colors duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-md bg-accent text-accent-foreground">
                <AccessibilityIcon className="size-4" />
              </span>
              <CardTitle className="text-h7">コントラスト比</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-body text-muted-foreground">
            <p>
              本文 (body / body-lg): <strong className="text-foreground">4.5 : 1 以上</strong>を必須。
              18px 以上の太字または 24px 以上の通常文字は 3 : 1 を許容。
            </p>
            <p>
              UI コンポーネント (ボタンの外周線、フォームの境界): 3 : 1 以上。
            </p>
            <p>
              ティール <code>#0f766e</code> on 白 = <strong>11.6 : 1</strong>、
              button-color <code>#d97706</code> on 白 = <strong>5.4 : 1</strong>。
              いずれも本文しきい値を超える設計。
            </p>
          </CardContent>
        </Card>

        <Card className="transition-colors duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-md bg-accent text-accent-foreground">
                <TypeIcon className="size-4" />
              </span>
              <CardTitle className="text-h7">フォントサイズ</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-body text-muted-foreground">
            <p>
              60 代以上向けの導線 (申込フォーム / 約款) は{" "}
              <strong className="text-foreground">body-lg (15px) 以上</strong>を既定とする。
            </p>
            <p>
              caption (12px) と eyebrow (11px) は補助/装飾専用。
              意味を伝える情報には使わない。
            </p>
            <p>
              ブラウザの拡大率を 200% にしてもレイアウトが崩れないこと
              (水平スクロール禁止)。
            </p>
          </CardContent>
        </Card>

        <Card className="transition-colors duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-h7">タッチターゲット</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-body text-muted-foreground">
            <p>
              モバイル ボタン: <strong className="text-foreground">44 × 44 px 以上</strong>。
              Portal の cta / primary は h=40px だが、タップ領域は周囲 padding を含めて 44px を確保する。
            </p>
            <p>リンク / アイコンボタンの間隔は最低 8px、隣接タップの誤操作を防ぐ。</p>
          </CardContent>
        </Card>

        <Card className="transition-colors duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-h7">フォーカス可視化</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-body text-muted-foreground">
            <p>
              キーボード操作時のフォーカスリングは必ず表示。
              focus-visible のリング色は navy ベース、CTA だけ赤系のリングに切替。
            </p>
            <p>
              色だけで状態を伝えない。エラーは color + テキスト + アイコンの 3 重で示す
              (例: Portal の StatusBadge は 5 種類の意味色 × ラベル文字)。
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 視認性プレビュー */}
      <Card className="mt-6 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-h7">サイズ感の比較 (XXX 推奨)</CardTitle>
          <CardDescription>
            60 代以上の主要導線は左の body-lg を既定としてください。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md border border-border p-4 transition-colors duration-300">
            <p className="text-caption font-medium text-primary">推奨 (body-lg 15px)</p>
            <p className="mt-2" style={{ fontSize: 15 }}>
              ご契約内容の確認はこちらから。
            </p>
          </div>
          <div className="rounded-md border border-border p-4 transition-colors duration-300">
            <p className="text-caption font-medium text-muted-foreground">標準 (body 14px)</p>
            <p className="mt-2" style={{ fontSize: 14 }}>
              ご契約内容の確認はこちらから。
            </p>
          </div>
          <div className="rounded-md border border-border p-4 transition-colors duration-300">
            <p className="text-caption font-medium" style={{ color: "#d97706" }}>
              非推奨 (caption 12px)
            </p>
            <p className="mt-2" style={{ fontSize: 12 }}>
              ご契約内容の確認はこちらから。
            </p>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* 7. Radius / Shadow / Spacing                                       */
/* ---------------------------------------------------------------- */

function RadiusAndShadow() {
  return (
    <Section id="radius">
      <SectionHeading
        eyebrow="Shape"
        title="角丸とシャドウ"
        description="角丸は意図的に階段状。ボタンは 10px、フォーム 14px、カード 18px、フィーチャーカード 24px の 4 段で構造を表します。"
        audience="designer"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <RadiusBox label="sm" value="6px" />
        <RadiusBox label="md (button)" value="10px" />
        <RadiusBox label="lg (form)" value="14px" />
        <RadiusBox label="xl (card)" value="18px" />
        <RadiusBox label="2xl (feature)" value="24px" />
        <RadiusBox label="full (pill)" value="9999px" />
      </div>

      <Card className="mt-6 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-h7">シャドウは 5 段階</CardTitle>
          <CardDescription>
            xs / sm / md / lg / navy (深さに応じて) 。navy シャドウは Primary
            ボタンの hover / featured カードで限定使用。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { name: "xs", style: { boxShadow: "0 1px 2px 0 rgba(15, 23, 42, 0.04)" } },
            { name: "sm", style: { boxShadow: "0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)" } },
            { name: "md", style: { boxShadow: "0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)" } },
            { name: "lg", style: { boxShadow: "0 12px 28px -8px rgba(15, 23, 42, 0.16), 0 8px 16px -8px rgba(15, 23, 42, 0.06)" } },
            { name: "navy", style: { boxShadow: "0 16px 30px -12px rgba(27, 49, 87, 0.32)" } },
          ].map((s) => (
            <div
              key={s.name}
              className="grid h-20 place-items-center rounded-[14px] border border-border bg-card text-caption text-card-foreground"
              style={s.style}
            >
              {s.name}
            </div>
          ))}
        </CardContent>
      </Card>
    </Section>
  );
}

function RadiusBox({ label, value }: { label: string; value: string }) {
  const radius = value === "9999px" ? 9999 : parseInt(value, 10);
  return (
    <div className="space-y-2">
      <div
        className="h-16 border border-border bg-[#0f766e]/10 transition-colors duration-300 dark:bg-[#2dd4bf]/15"
        style={{ borderRadius: radius }}
      />
      <p className="text-body font-medium">{label}</p>
      <p className="font-mono text-caption text-muted-foreground">{value}</p>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 8. Content rules                                                   */
/* ---------------------------------------------------------------- */

function ContentRules() {
  return (
    <Section id="content">
      <SectionHeading
        eyebrow="Voice & Content"
        title="コピーは事実から、語尾は『です・ます』"
        description="XXX のデジタル UI 文言は、業務系・金融系のフォーマルなトーンに統一されています。エンタープライズ管理画面の信頼感と、保険プロダクトに必要な誤読の少なさを両立させます。"
        audience="designer"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="transition-colors duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-h7">言語・トーン</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-body text-muted-foreground">
            <p>日本語が一次言語。コンポーネント名は英語、UI 文言は日本語。</p>
            <p>「です・ます」調で統一。命令形は使わない。</p>
            <p>「あなた」「私」など人称は基本使わず、無人称的に書く。</p>
            <p>
              絵文字は使わない。アイコンは lucide-react に統一。
              ステータスバッジは英単語 (Active / Trial / Suspended …)。
            </p>
          </CardContent>
        </Card>

        <Card className="transition-colors duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-h7">具体例</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-body text-muted-foreground">
            <p>
              <strong className="text-foreground">成功:</strong>{" "}
              「保存が完了しました」/ 「変更内容はすべてサーバーに反映されました。」
            </p>
            <p>
              <strong className="text-foreground">エラー:</strong>{" "}
              「エラーが発生しました」/ 「サーバーに接続できません。ネットワークをご確認ください。」
            </p>
            <p>
              <strong className="text-foreground">確認:</strong>{" "}
              「本当に削除しますか？」 / 「この操作は取り消せません。」
            </p>
            <p>
              <strong className="text-foreground">警告:</strong>{" "}
              「ご注意」 / 「パスワードの有効期限が 3 日以内に切れます。」
            </p>
            <p>
              <strong className="text-foreground">ボタン:</strong>{" "}
              「保存」「キャンセル」「削除する」「やめる」「編集」「作成する」
            </p>
          </CardContent>
        </Card>

        <Card className="transition-colors duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-h7">ケース・記号</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-body text-muted-foreground">
            <p>
              日本語と英数字の間に <strong>半角スペースは入れない</strong>。
              ただし数値と単位の間にはスペースを入れる: 「12 月 25 日」「87.4 %」「162 件」。
            </p>
            <p>句点は <strong>。</strong> (全角)、読点は <strong>、</strong> (全角) を使用。</p>
            <p>数値のシンボルは半角: +12.3% / ¥1,200。</p>
          </CardContent>
        </Card>

        <Card className="transition-colors duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-h7">雰囲気 (Vibe)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-body text-muted-foreground">
            <p>業務系・金融系のフォーマル。エンタープライズ管理画面のトーン。</p>
            <p>親しみよりも正確さ・信頼感を優先する。</p>
            <p>余白は十分に取り、密度はミドル〜高。テーブルとフォームが主役。</p>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* Footer                                                            */
/* ---------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="mt-20 border-t border-border pt-8 transition-colors duration-300">
      <div className="flex flex-col gap-3 text-caption text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © XXX Design System · 一次ソース:{" "}
          <code>td-tokens.css</code> + <code>ui_kits/portal/*</code>
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/xxx/components">Components を見る</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/xxx/prototype">Prototype を試す</Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href="/xxx">XXX 入口へ</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
