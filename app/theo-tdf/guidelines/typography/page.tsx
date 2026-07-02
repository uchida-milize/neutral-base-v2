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
import {
  SectionHeading,
  Section,
  FONT_SCALE,
  SPACING_SCALE,
} from "@/components/guidelines/theo-tdf-shared";

export const metadata: Metadata = {
  title: "タイポグラフィ | ガイドライン | THEO × T&Dファイナンシャル 組込",
  description:
    "9 段フォントスケール・4px スペーシンググリッド。",
};

export default function TypographyPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <TypographyRules />
      <SpacingHandoff />
    </main>
  );
}

/* ---------------------------------------------------------------- */
/* タイポグラフィ                                                     */
/* ---------------------------------------------------------------- */

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
/* スペーシング ハンドオフ                                             */
/* ---------------------------------------------------------------- */

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

