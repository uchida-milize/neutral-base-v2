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
import { AutoColorScale, AutoWarmScale } from "@/components/guidelines/auto-color-scale";
import { AutoButtonGrid } from "@/components/guidelines/auto-button-grid";
import { BrandGradients } from "@/components/theo-tdf/brand-gradients";

/* =================================================================
 * /theo-tdf/guidelines — THEO × T&Dファイナンシャル 組込デザインガイドライン
 *
 * THEO「つみたて安心ほけん」(T&Dファイナンシャル生命) の組込申込フロー向け。
 * 色トークンは components/theo-tdf/tokens.css を一次ソースとする。
 *
 * カラートークン (anchor):
 *   --primary-color-500   #065fe3 — Ink Blue (ブランド基調 / ヘッダー / ヒーロー)
 *   --secondary-color-500 #ff748d — Coral (アクセント / 重要バッジ / リンク)
 *   --button-color-500    #007dff — THEO Blue (通常 filled / 前進。実機は青グラデ #075FE3→#64B0F7)
 *   --cta-color-500       #ff2d2d — 純赤 (申込確定。1 画面 1 つ。danger は赤グラデ #E83A3C→#F66A6C)
 *   --warm-50             — premium / featured surface
 *
 * 設計の特徴:
 *   - Primary は Ink Blue。ブランド基調を担う。
 *   - 通常ボタン / 前進は THEO Blue (実機は青グラデーション)。
 *   - 申込確定だけは純赤。装飾には使わない (1 画面 1 つ)。
 *   - 保険商品のため常時ライト固定 (ダークモードは廃止)。
 * ================================================================= */

export const metadata: Metadata = {
  title: "ガイドライン | THEO × T&Dファイナンシャル 組込",
  description:
    "THEO「つみたて安心ほけん」(T&Dファイナンシャル生命) の組込申込フローのブランドアイデンティティ (信頼・誠実・モダン・クリーン) と Embedded Insurance トークンに基づくカラー・タイポグラフィ・アクセシビリティのガイドライン。",
};

export default function TdGuidelinesPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <HeroSection />
      <BrandPillars />
      <ColorRules />
      <ButtonRules />
      <TypographyRules />
      <SpacingHandoff />
      <AccessibilityRules />
      <RadiusAndShadow />
      <ContentRules />
      <ComponentHandoff />
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
      <h2 className="mt-2 text-h2 font-semibold leading-tight tracking-tight">
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
      className={`mt-30 scroll-mt-24 transition-colors duration-300 ${className}`}
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
      <h1 className="mt-2 text-display-3 font-semibold tracking-tight sm:text-display-2">
        デザインガイドライン
      </h1>
      <p className="mt-3 text-body text-muted-foreground sm:text-body-lg">
        THEO「つみたて安心ほけん」の組込申込フローは、金融・保険領域で求められる
        <strong className="text-foreground">「誠実さ」</strong>と、
        現代の Web / アプリに求められる
        <strong className="text-foreground">「クリーンさ」</strong>を両立させます。
        本ガイドラインは <code>tokens.css</code> と
        申込フロー画面の運用を、実装に落とすためのルールです。
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="secondary" className="gap-1.5">
          <ShieldCheck className="size-3" />
          THEO × T&amp;Dファイナンシャル · Embedded Insurance
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
    body: "Primary は Ink Blue (#065fe3)。揺るぎない情報密度で誤読を防ぎ、保険・金融プロダクトに不可欠な「読み違えゼロ」を最優先する。",
  },
  {
    icon: SparklesIcon,
    title: "誠実 (Sincerity)",
    body: "誇張・煽り表現は使わない。申込確定の純赤 (#ff2d2d) は申込/前進だけに限定し、ボタン・コピー・配色で過度な訴求をしない。",
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
        eyebrow="Design Direction"
        title="デザインの方向性"
        description="申込フローのすべてのデザイン判断はこの 4 つの方向性に照らして妥当性を確認します。迷ったら最も保守的な選択を採ります。"
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
                <CardTitle className="text-h4">{title}</CardTitle>
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
        title="Ink Blue 基調 + Coral アクセント + THEO Blue 通常ボタン + 純赤 CTA"
        description="THEO × T&Dファイナンシャル のカラーは 5 つのスケール (primary-color / secondary-color / button-color / cta-color / warm) で構成されます。CTA と通常ボタンを別スケールで分け、申込専用色を明示します。直接 hex を書かず、必ず var(--primary) / var(--ring) 等の semantic 層を経由します。"
        audience="both"
      />

      {/* スウォッチ群 — 5 スケール (テナントの tokens.css の値を自動反映) */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AutoColorScale
          prefix="primary-color"
          title="primary-color"
          subtitle="コーポレートカラー1 · ブランド主要色 / ヘッダー / sidebar"
        />
        <AutoColorScale
          prefix="secondary-color"
          title="secondary-color"
          subtitle="コーポレートカラー2 · highlight / link / アクセント"
        />
        <AutoColorScale
          prefix="button-color"
          title="button-color"
          subtitle="通常ボタンカラー · 色面 + 罫線の 2 バリアント"
        />
        <AutoColorScale
          prefix="cta-color"
          title="cta-color"
          subtitle="CTA 申込ボタンカラー · 申込/前進 専用 (1 画面 1 つ)"
        />
        <AutoWarmScale subtitle="無彩色 neutral · 背景 / 区切り線。装飾色は持ち込まない" />
      </div>

      {/* Tailwind マッピング表 (token → Tailwind class → CSS var → 実際の値) */}
      <Card className="mt-8 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-h4">token → Tailwind class → CSS var の対応表</CardTitle>
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
                  <TableCell className="text-right font-mono text-caption">#065fe3 Ink Blue</TableCell>
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
          <CardTitle className="text-h4">テナント生スケールへの直接アクセス</CardTitle>
          <CardDescription>
            上の semantic だけでは表現できない場合 (グラフの 6 色目を出したい等) に使う、生スケールへの直接参照。可能な限り上の semantic を優先し、これは「最終手段」として位置づけます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-md bg-muted/60 p-4 font-mono text-tiny leading-relaxed text-muted-foreground">{`/* CSS: 直接 var() で参照 */
.my-chart-bar-2 {
  background: var(--primary-color-300);  /* Ink Blue 300 */
  border-color: var(--secondary-color-500); /* Coral 500 */
}

/* React / Tailwind: arbitrary value で参照 */
<div className="bg-primary-300">
  ...
</div>`}</pre>
        </CardContent>
      </Card>

      {/* Tailwind class でのコードスニペット — 開発者がコピペで使える */}
      <Card className="mt-4 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-h4">コードスニペット (コピペ用)</CardTitle>
          <CardDescription>
            よくあるパターン。<strong className="text-foreground">直接 hex を書かない</strong>こと
            (Figma 側の値変更時に追従できなくなるため)。Tailwind utility か CSS var を経由。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SnippetCard
            label="① ヘッダー / ヒーロー (Ink Blue primary)"
            preview={
              <div className="rounded-md bg-primary px-4 py-3 text-primary-foreground">
                <p className="text-caption font-medium opacity-80">Embedded Insurance</p>
                <p className="text-h4 font-semibold">信頼を、もっと触れる距離に。</p>
              </div>
            }
            code={`<header className="rounded-md bg-primary px-4 py-3 text-primary-foreground">
  <p className="text-caption opacity-80">Embedded Insurance</p>
  <p className="text-h4 font-semibold">信頼を、もっと触れる距離に。</p>
</header>`}
          />

          <SnippetCard
            label="② CTA 申込ボタン (純赤)"
            preview={
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-cta-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cta-600"
              >
                申込を確定する
              </button>
            }
            code={`<button className="inline-flex items-center justify-center rounded-md
  bg-cta-500 px-4 py-2 text-sm font-semibold text-white
  hover:bg-cta-600">
  申込を確定する
</button>`}
          />

          <SnippetCard
            label="③ 通常ボタン (THEO Blue, 色面)"
            preview={
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-button-500 px-4 py-2 text-sm font-semibold text-white hover:bg-button-600"
              >
                変更を保存
              </button>
            }
            code={`<button className="inline-flex items-center justify-center rounded-md
  bg-button-500 px-4 py-2 text-sm font-semibold text-white
  hover:bg-button-600">
  変更を保存
</button>`}
          />

          <SnippetCard
            label="④ 通常ボタン (THEO Blue, 罫線)"
            preview={
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-button-500 bg-white px-4 py-2 text-sm font-semibold text-button-500 hover:bg-button-50"
              >
                変更を保存
              </button>
            }
            code={`<button className="inline-flex items-center justify-center rounded-md
  border border-button-500 bg-white px-4 py-2
  text-sm font-semibold text-button-500
  hover:bg-button-50">
  変更を保存
</button>`}
          />

          <SnippetCard
            label="⑤ 重要ラベル / バッジ (Coral secondary)"
            preview={
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary-10 px-3 py-1 text-caption font-medium text-secondary-700">
                重要
              </span>
            }
            code={`<span className="inline-flex items-center gap-1 rounded-full
  bg-secondary-10 px-3 py-1
  text-caption font-medium text-secondary-700">
  重要
</span>`}
          />

          <SnippetCard
            label="⑥ Card (汎用、ブランドに依存しない)"
            preview={
              <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
                <p className="text-h4 font-semibold">タイトル</p>
                <p className="mt-1 text-body text-muted-foreground">
                  本文。<code className="text-foreground">bg-card</code> / <code className="text-foreground">text-card-foreground</code> /{" "}
                  <code className="text-foreground">border-border</code> は全テナント共通の semantic です。
                </p>
              </div>
            }
            code={`<div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
  <p className="text-h4 font-semibold">タイトル</p>
  <p className="mt-1 text-body text-muted-foreground">本文</p>
</div>`}
          />
        </CardContent>
      </Card>

      <div className="mt-6 rounded-lg border border-border bg-card p-5 text-card-foreground transition-colors duration-300">
        <h3 className="text-h4 font-semibold">テナント差し替え点</h3>
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

// ScaleBlock は AutoColorScale (components/guidelines/auto-color-scale.tsx) に統合済み。

/* ---------------------------------------------------------------- */
/* 4. ボタン運用 (theo-tdf の核)                                        */
/* ---------------------------------------------------------------- */

function ButtonRules() {
  return (
    <Section id="buttons">
      <SectionHeading
        eyebrow="Buttons"
        title="5 種類のボタンを意味で使い分ける"
        description="theo-tdf のボタン体系は tokens.css の --button-* / --cta-* に定義されています。「純赤 = 申込/前進」「THEO Blue = 通常確定」「グレー = キャンセル」「白枠 = サブ」「destructive = 削除」を厳密に分けます。実機の通常ボタンは青グラデ (#075FE3→#64B0F7)、申込確定は赤グラデ (#E83A3C→#F66A6C) で描画します。"
        audience="both"
      />

      {/* 5 種ボタン (テナントの tokens.css の値を自動反映) */}
      <AutoButtonGrid />

      {/* グラデーション & 新中立面 (TD 組込1.4 で追加) */}
      <div className="mt-8 space-y-3">
        <h3 className="text-h4 font-semibold">グラデーション &amp; 中立面（TD 組込1.4）</h3>
        <p className="max-w-3xl text-body text-muted-foreground">
          実機プロトタイプでは、通常 CTA・申込確定ボタンと、ステッパーの番号バッジ・アプリヘッダーに青系グラデーションを使用します。
          無効フィールドやプラン選択帯・補償ラベルなどの中立面は <code>#EFEFEF</code> に統一しました。
          値は申込フロー画面（<code>claude-design/screens.tsx</code>）と一致します。
        </p>
        <BrandGradients />
      </div>

      <Card className="mt-6 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-h4">1 画面 1 つだけ、の規律</CardTitle>
          <CardDescription>
            純赤 (cta) と通常ボタン (THEO Blue) が同一画面で主役を争うのは原則禁止。並べる場合は純赤を 1 つに絞り、通常ボタンは neutral / outline に降格させること。
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
                  <TableCell>cta 純赤 と 通常ボタン THEO Blue を同列</TableCell>
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

// ButtonRow は AutoButtonGrid (components/guidelines/auto-button-grid.tsx) に統合済み。

/* ---------------------------------------------------------------- */
/* 5. タイポグラフィ                                                  */
/* ---------------------------------------------------------------- */

const FONT_SCALE = [
  { name: "h1", token: "--text-h1", px: 34, use: "画面内最大見出し" },
  { name: "h2", token: "--text-h2", px: 28, use: "セクション見出し" },
  { name: "h3", token: "--text-h3", px: 24, use: "カードタイトル" },
  { name: "h4", token: "--text-h4", px: 20, use: "小見出し" },
  { name: "h5", token: "--text-h5", px: 18, use: "ラベル大" },
  { name: "h6", token: "--text-h6", px: 16, use: "ラベル" },
  { name: "body-lg", token: "--text-body-lg", px: 16, use: "本文 (リード)" },
  { name: "body", token: "--text-body", px: 14, use: "本文 (標準)" },
  { name: "caption", token: "--text-caption", px: 12, use: "メタデータ・ラベル" },
];

function TypographyRules() {
  return (
    <Section id="type">
      <SectionHeading
        eyebrow="Typography"
        title="UI Heading + Body の 9 段スケール"
        description="画面内最大見出し (h1 = 34px) から ラベル (h6 = 16px) まで 6 段の UI Heading + Body/Caption の計 9 段。フォントは Geist Sans（ラテン・コード共通）+ Noto Sans JP（日本語）+ Chillax（大見出し英数字）。"
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

      {/* タイポグラフィ Tailwind スニペット */}
      <Card className="mt-6 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-h4">タイポグラフィ スニペット（コピペ用）</CardTitle>
          <CardDescription>
            Tailwind 任意スケール（<code>text-xl</code> 等）は使わず、必ず下の utility class を使います。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-md bg-muted/60 p-4 font-mono text-tiny leading-relaxed text-muted-foreground">{`/* ページ見出し */
<h1 className="text-display-2 font-semibold tracking-tight">申込フロー 設計・開発リファレンス</h1>

/* セクション見出し */
<h2 className="text-h2 font-semibold tracking-tight">コンポーネントセット</h2>

/* カードタイトル */
<h3 className="text-h3 font-semibold tracking-tight">AppBar & Steps</h3>

/* 小見出し */
<p className="text-h4 font-semibold">フォーム項目名</p>

/* 本文リード */
<p className="text-body-lg text-muted-foreground">申込フローの概要説明文。</p>

/* 本文標準 */
<p className="text-body text-muted-foreground">内容説明テキスト。</p>

/* メタ / ラベル (eyebrow) */
<span className="text-caption font-medium uppercase tracking-[0.18em] text-primary">Components</span>

/* コード */
<code className="font-mono text-caption">--primary-color-500</code>`}</pre>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="transition-colors duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-h4">フォントスタック</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 text-body text-muted-foreground">
            <p>
              ラテン・コード共通:{" "}
              <strong className="text-foreground">Geist Sans</strong>{" "}
              (セルフホスト・npm パッケージ経由、<code>--font-sans</code> / <code>--font-mono</code> 両方に適用)
            </p>
            <p>
              日本語: <strong className="text-foreground">Noto Sans JP</strong>{" "}
              (セルフホスト · 100–900 の 9 ウェイト)
            </p>
            <p>
              大見出し英数字: <strong className="text-foreground">Chillax</strong>{" "}
              (セルフホスト · Medium 500 のみ、<code>font-chillax</code> utility 経由)
            </p>
            <p className="text-caption">
              見出し font-weight = 600 (SemiBold) / 本文 line-height = 1.6 / 見出し
              tracking = −0.02em 起点で段階的に緩める。
            </p>
          </CardContent>
        </Card>
        <Card className="transition-colors duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-h4">禁止事項</CardTitle>
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
        title="WCAG 2.2 AA 準拠。年齢・習熟度を問わず操作できることを最低条件とする"
        description="契約者の年齢層やデバイス習熟度にかかわらず、UI が破綻しないことを最低条件とします。WCAG 2.2 AA を基準とし、コントラスト・タップ領域・フォームの入力補助を実装レベルで担保します。"
        audience="both"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="transition-colors duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-md bg-accent text-accent-foreground">
                <AccessibilityIcon className="size-4" />
              </span>
              <CardTitle className="text-h4">コントラスト比</CardTitle>
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
              Ink Blue <code>#065fe3</code> on 白 = <strong>5.6 : 1</strong>（本文 AA 4.5:1 をクリア）。
              通常ボタンは白文字を青系の面・グラデーション上に置くため、ラベルは太字かつ 16px 以上を維持し、申込確定の純赤は面積を絞って使う。
            </p>
          </CardContent>
        </Card>

        <Card className="transition-colors duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-md bg-accent text-accent-foreground">
                <TypeIcon className="size-4" />
              </span>
              <CardTitle className="text-h4">フォントサイズ</CardTitle>
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
            <CardTitle className="text-h4">タッチターゲット</CardTitle>
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
            <CardTitle className="text-h4">フォーカス可視化</CardTitle>
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
          <CardTitle className="text-h4">サイズ感の比較 (theo-tdf 推奨)</CardTitle>
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
            <p className="text-caption font-medium" style={{ color: "var(--cta-color-600)" }}>
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
          <CardTitle className="text-h4">シャドウは 5 段階</CardTitle>
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
        className="h-16 border border-border bg-primary-500/10 transition-colors duration-300 dark:bg-primary-300/15"
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
        title="Tone：です・ます統一。Content：数値・仕様は一次ソースから"
        description="語調（Tone）と内容の誠実さ（Content）は別の問題として扱います。語尾を『です・ます』に統一しつつ、文言の根拠には必ず一次ソースを置き、誇張・推測を混入させません。"
        audience="designer"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="transition-colors duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-h4">言語・トーン</CardTitle>
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
            <CardTitle className="text-h4">具体例</CardTitle>
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
            <CardTitle className="text-h4">ケース・記号</CardTitle>
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
            <CardTitle className="text-h4">雰囲気 (Vibe)</CardTitle>
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
/* 9. スペーシング ハンドオフ                                          */
/* ---------------------------------------------------------------- */

const SPACING_SCALE = [
  { token: "spacing/0",  tw: "p-0 / gap-0 / m-0",    px: 0 },
  { token: "spacing/1",  tw: "p-1 / gap-1 / mt-1",    px: 4 },
  { token: "spacing/2",  tw: "p-2 / gap-2 / mt-2",    px: 8 },
  { token: "spacing/3",  tw: "p-3 / gap-3 / mt-3",    px: 12 },
  { token: "spacing/4",  tw: "p-4 / gap-4 / mt-4",    px: 16 },
  { token: "spacing/5",  tw: "p-5 / gap-5 / mt-5",    px: 20 },
  { token: "spacing/6",  tw: "p-6 / gap-6 / mt-6",    px: 24 },
  { token: "spacing/8",  tw: "p-8 / gap-8 / mt-8",    px: 32 },
  { token: "spacing/10", tw: "p-10 / gap-10 / mt-10", px: 40 },
  { token: "spacing/12", tw: "p-12 / gap-12 / mt-12", px: 48 },
  { token: "spacing/16", tw: "p-16 / gap-16 / mt-16", px: 64 },
  { token: "spacing/20", tw: "p-20 / gap-20 / mt-20", px: 80 },
  { token: "spacing/24", tw: "p-24 / gap-24 / mt-24", px: 96 },
  { token: "spacing/30", tw: "mt-30 / pb-30",          px: 120 },
];

function SpacingHandoff() {
  return (
    <Section id="spacing">
      <SectionHeading
        eyebrow="Spacing"
        title="4px グリッドベースのスペーシング"
        description="余白・ギャップ・パディングはすべて 4px を 1 単位とした Tailwind spacing スケールに合わせます。Figma の spacing Variables と 1:1 で対応しています。直接 px 値は書かず、Tailwind class を使います。"
        audience="developer"
      />
      <div className="overflow-hidden rounded-md border border-border transition-colors duration-300">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Figma Variable</TableHead>
              <TableHead>Tailwind class</TableHead>
              <TableHead className="w-20 text-right">px</TableHead>
              <TableHead className="w-32">スケール</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SPACING_SCALE.map((row) => (
              <TableRow key={row.token}>
                <TableCell className="font-mono text-caption">{row.token}</TableCell>
                <TableCell><code className="text-caption text-muted-foreground">{row.tw}</code></TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">{row.px}</TableCell>
                <TableCell>
                  <div
                    className="h-3 rounded-sm bg-primary/30"
                    style={{ width: Math.min(row.px, 120) }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Card className="mt-6 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-h4">よく使うパターン</CardTitle>
          <CardDescription>コンポーネント実装でよく登場する spacing の組み合わせ。</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-md bg-muted/60 p-4 font-mono text-tiny leading-relaxed text-muted-foreground">{`/* カード内余白 */
<div className="p-4 space-y-3">           /* p-4=16px, y-gap=12px */

/* セクション間 (ページ内) */
<section className="mt-30">               /* 120px */
<section className="mt-12">               /* 48px (小セクション) */

/* フォームフィールド間 */
<div className="flex flex-col gap-4">     /* 16px */

/* ボタン内横パディング */
<button className="px-6 py-3">           /* px=24px, py=12px */

/* リスト行 (icon + label) */
<div className="flex items-center gap-3 py-2">  /* icon-label=12px, y=8px */

/* カードグリッド */
<div className="grid gap-4 md:grid-cols-2">     /* gap=16px */`}</pre>
        </CardContent>
      </Card>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* 10. コンポーネント ハンドオフ                                        */
/* ---------------------------------------------------------------- */

type PropDef = {
  name: string;
  type: string;
  required: boolean;
  default?: string;
};

function ComponentSnippet({
  name,
  desc,
  props,
  code,
}: {
  name: string;
  desc: string;
  props: PropDef[];
  code: string;
}) {
  return (
    <Card className="transition-colors duration-300">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start gap-3">
          <code className="rounded-md border border-border bg-muted px-2 py-1 text-h5 font-semibold">{`<${name}>`}</code>
          <CardDescription className="mt-1 text-body">{desc}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">prop</TableHead>
                <TableHead>型</TableHead>
                <TableHead className="w-20">必須</TableHead>
                <TableHead className="w-32">default</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.map((p) => (
                <TableRow key={p.name}>
                  <TableCell className="font-mono text-caption font-semibold">{p.name}</TableCell>
                  <TableCell className="font-mono text-caption text-muted-foreground">{p.type}</TableCell>
                  <TableCell>
                    {p.required ? (
                      <span className="rounded-full bg-secondary-10 px-2 py-0.5 text-tiny font-medium text-secondary-700">必須</span>
                    ) : (
                      <span className="text-caption text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-caption text-muted-foreground">{p.default ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <pre className="overflow-x-auto rounded-md bg-muted/60 p-4 font-mono text-tiny leading-relaxed text-muted-foreground">{code}</pre>
      </CardContent>
    </Card>
  );
}

function ComponentHandoff() {
  return (
    <Section id="components-handoff">
      <SectionHeading
        eyebrow="Components Handoff"
        title="カスタムコンポーネント 使い方早見表"
        description="screens.tsx で定義された theo-tdf 固有コンポーネントの props 一覧とコードスニペット。ライブプレビューはコンポーネントページを参照。"
        audience="developer"
      />

      <div className="space-y-6">
        <ComponentSnippet
          name="Btn"
          desc="5 種 × full / disabled 対応ボタン"
          props={[
            { name: "kind", type: '"cta" | "button" | "outline" | "ghost" | "danger"', required: true },
            { name: "full",     type: "boolean", required: false, default: "true"  },
            { name: "disabled", type: "boolean", required: false, default: "false" },
          ]}
          code={`<Btn kind="cta">申込を確定する</Btn>
<Btn kind="button" full={false}>確認する</Btn>
<Btn kind="outline" full={false}>戻る</Btn>
<Btn kind="ghost"   full={false}>スキップ</Btn>
<Btn kind="danger"  full={false}>解約する</Btn>
<Btn kind="cta" disabled>申込む（disabled）</Btn>`}
        />

        <ComponentSnippet
          name="Field"
          desc="テキスト入力（4 状態: default / filled / error / disabled）"
          props={[
            { name: "label",       type: "string",                  required: true  },
            { name: "placeholder", type: "string",                  required: false },
            { name: "required",    type: "boolean",                 required: false },
            { name: "value",       type: "string",                  required: false },
            { name: "error",       type: "string",                  required: false },
            { name: "errMode",     type: '"inline" | "below"',      required: false, default: '"below"' },
            { name: "disabled",    type: "boolean",                 required: false },
          ]}
          code={`<Field label="姓" placeholder="山田" required />
<Field label="姓" value="山田" required />
<Field label="姓" required error="姓を入力してください" errMode="inline" />
<Field label="生年月日" value="1990 / 01 / 01" disabled />`}
        />

        <ComponentSnippet
          name="LockedField"
          desc="読み取り専用フィールド（変更不可。disabled より意図が明確）"
          props={[
            { name: "label", type: "string", required: true },
            { name: "value", type: "string", required: true },
          ]}
          code={`<LockedField label="生年月日" value="1990 / 01 / 01" />
<LockedField label="性別" value="男性" />`}
        />

        <ComponentSnippet
          name="Select"
          desc="ドロップダウン選択（3 状態）"
          props={[
            { name: "label",    type: "string",   required: true  },
            { name: "options",  type: "string[]", required: true  },
            { name: "required", type: "boolean",  required: false },
            { name: "error",    type: "string",   required: false },
            { name: "errMode",  type: '"inline" | "below"', required: false, default: '"below"' },
            { name: "disabled", type: "boolean",  required: false },
          ]}
          code={`import { PREFS } from "@/components/theo-tdf/claude-design/screens";

<Select label="都道府県" required options={PREFS} />
<Select label="都道府県" options={PREFS} error="選択してください" errMode="inline" />
<Select label="都道府県" options={PREFS} disabled />`}
        />

        <ComponentSnippet
          name="GroupCard"
          desc="入力グループのコンテナ（タイトル + アイコン + Field群をまとめる）"
          props={[
            { name: "title",   type: "string", required: true  },
            { name: "sub",     type: "string", required: false },
            { name: "iconSrc", type: "string", required: false },
          ]}
          code={`<GroupCard
  title="契約者情報"
  sub="ご契約者ご本人さまの情報"
  iconSrc="/assets/theo-tdf/person-heart.svg"
>
  <Field label="姓" placeholder="山田" required />
  <Field label="名" placeholder="太郎" required />
  <LockedField label="生年月日" value="1990 / 01 / 01" />
</GroupCard>`}
        />

        <ComponentSnippet
          name="StepSection"
          desc="STEP 番号バッジ付きセクション"
          props={[
            { name: "label", type: "string",  required: true  },
            { name: "n",     type: "number",  required: true  },
            { name: "big",   type: "boolean", required: false, default: "false" },
          ]}
          code={`{/* 通常 (フォーム用) */}
<StepSection label="メールアドレス" n={1}>
  <Field label="メールアドレス" placeholder="example@email.com" required />
</StepSection>

{/* big = true でバッジ・ラベルが大きくなる (シミュレーション用) */}
<StepSection label="保険料シミュレーション" n={2} big>
  <SimSliders m={m} setM={setM} y={y} setY={setY} />
</StepSection>`}
        />

        <ComponentSnippet
          name="ActionBar"
          desc="画面下部スティッキーバー（通常: 白背景 / solid: ブルー帯）"
          props={[
            { name: "solid", type: "boolean", required: false, default: "false" },
          ]}
          code={`{/* 通常: 白背景 */}
<ActionBar>
  <Btn kind="cta">次へ進む</Btn>
</ActionBar>

{/* solid: ブルー帯（申込確定画面で使用） */}
<ActionBar solid>
  <Btn kind="cta">申込む</Btn>
  <Btn kind="ghost" full={false}>キャンセル</Btn>
</ActionBar>`}
        />

        <ComponentSnippet
          name="SimSliders"
          desc="積立金額・保障期間 div ベーススライダー（Figma capture 対応）"
          props={[
            { name: "m",    type: "number",                     required: true },
            { name: "setM", type: "(val: number) => void",      required: true },
            { name: "y",    type: "number",                     required: true },
            { name: "setY", type: "(val: number) => void",      required: true },
          ]}
          code={`const [m, setM] = React.useState(10000);  // 積立金額 (円)
const [y, setY] = React.useState(15);     // 保障期間 (年)

<SimSliders m={m} setM={setM} y={y} setY={setY} />`}
        />
      </div>

      {/* import まとめ */}
      <div className="mt-6 rounded-lg border border-border bg-card p-5 transition-colors duration-300">
        <h3 className="text-h4 font-semibold">一括 import</h3>
        <pre className="mt-3 overflow-x-auto rounded-md bg-muted/60 p-4 font-mono text-tiny leading-relaxed text-muted-foreground">{`import {
  AppBar, Steps, Badge, Btn, Field, Select,
  LockedField, GroupCard, ActionBar, SimSliders,
  ReqBadge, ErrText, StepSection, PREFS,
} from "@/components/theo-tdf/claude-design/screens";`}</pre>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* Footer                                                            */
/* ---------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="mt-30 border-t border-border pt-8 transition-colors duration-300">
      <div className="flex flex-col gap-3 text-caption text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © THEO × T&amp;Dファイナンシャル 組込 · 一次ソース:{" "}
          <code>tokens.css</code> + <code>claude-design/screens.tsx</code>
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/theo-tdf/components">Components を見る</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/theo-tdf/prototype">Prototype を試す</Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href="/theo-tdf">theo-tdf 入口へ</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
