import type { Metadata } from "next";
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
import { AutoColorScale, AutoWarmScale } from "@/components/guidelines/auto-color-scale";
import { BrandGradients } from "@/components/theo-tdf/brand-gradients";
import {
  SectionHeading,
  Section,
  SnippetCard,
} from "@/components/guidelines/theo-tdf-shared";

export const metadata: Metadata = {
  title: "カラー | ガイドライン | THEO × T&Dファイナンシャル 組込",
  description:
    "Sky Blue (Primary/Button/CTA 共通) / Coral / アラート専用の純赤と、token → Tailwind 対応表。",
};

export default function ColorPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <ColorRules />
    </main>
  );
}

function ColorRules() {
  return (
    <Section id="color">
      <SectionHeading
        eyebrow="Color"
        title="Sky Blue 基調 + Coral アクセント。CTA と通常ボタンは同一の Sky Blue"
        description="THEO × T&Dファイナンシャル のカラーは primary-color / secondary-color / warm の 3 スケールで構成されます。button-color と cta-color は primary-color のエイリアスで、独自の色は持ちません。純赤 (secondary-color-700 系) はアラート・エラー・必須表示専用で、CTA には使いません。直接 hex を書かず、必ず var(--primary) / var(--ring) 等の semantic 層を経由します。"
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
          subtitle="通常ボタンカラー · primary-color のエイリアス（独自の値は持たない）"
        />
        <AutoColorScale
          prefix="cta-color"
          title="cta-color"
          subtitle="CTA 申込ボタンカラー · primary-color のエイリアス（独自の値は持たない）"
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
                  <TableCell className="text-right font-mono text-caption">#1aa5dc Sky Blue</TableCell>
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
            label="② CTA 申込ボタン (Sky Blue, button-color と共通)"
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

      {/* グラデーション & 中立面 (TD 組込1.4 で追加) */}
      <div className="mt-8 space-y-3">
        <h3 className="text-h4 font-semibold">グラデーション &amp; 中立面（TD 組込1.4）</h3>
        <p className="max-w-3xl text-body text-muted-foreground">
          実機プロトタイプでは、通常 CTA・申込確定ボタンと、ステッパーの番号バッジ・アプリヘッダーに青系グラデーションを使用します。
          無効フィールドやプラン選択帯・補償ラベルなどの中立面は <code>#EFEFEF</code> に統一しました。
          値は申込フロー画面（<code>claude-design/screens.tsx</code>）と一致します。
        </p>
        <BrandGradients />
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card p-5 text-card-foreground transition-colors duration-300">
        <h3 className="text-h4 font-semibold">テナント差し替え点</h3>
        <p className="mt-2 text-body text-muted-foreground">
          顧客企業が変えるのは <code>--primary-color-*</code> と <code>--secondary-color-*</code> の
          2 スケールと、ロゴアセット。<code>--button-color-*</code> / <code>--cta-color-*</code> は
          <code>--primary-color-*</code> のエイリアスなので自動で追従し、直接編集しないこと。Semantic 層
          (<code>--primary</code> / <code>--accent</code> 等) も同様に自動で追従します。
        </p>
      </div>
    </Section>
  );
}
