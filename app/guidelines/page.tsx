import type { Metadata } from "next";
import Link from "next/link";
import {
  LayersIcon,
  PaletteIcon,
  TypeIcon,
  AccessibilityIcon,
  ComponentIcon,
  MoonIcon,
  ArrowRight,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
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
 * /guidelines — 共通デザインガイドライン (ベース)
 *
 * このページはどの導入先 (XXX / 他社) にも共通する基本原則をまとめる「土台」。
 * 各社固有のブランド・運用は別ルート (例: /xxx/guidelines) に分離する。
 *
 * 章立て:
 *  1. ヒーロー (このガイドラインの位置づけ)
 *  2. 設計原則 (4 原則)
 *  3. デザイントークン (色 / サイズ)
 *  4. タイポグラフィ概要
 *  5. アクセシビリティ最低ライン
 *  6. コンポーネント運用
 *  7. ライト/ダーク & レスポンシブ
 *  8. 各社別ガイドラインへの導線
 * ================================================================= */

export const metadata: Metadata = {
  title: "共通ガイドライン | Design System",
  description:
    "全導入先に共通するデザインシステムの基本原則・トークン・アクセシビリティ最低ライン。各社固有のルールは子ページに分離。",
};

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 ease-out">
      <SiteHeader />

      <main className="max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
        <Hero />
        <Pipeline />
        <Architecture />
        <Principles />
        <Tokens />
        <Typography />
        <Accessibility />
        <Components />
        <ThemeAndResponsive />
        <BrandSatellites />
        <Footer />
      </main>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 共通: セクション見出し                                              */
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
/* NEW: Pipeline (UI/UX ↔ Dev 連携フロー)                              */
/* ---------------------------------------------------------------- */

function Pipeline() {
  // 4 ステップ: Figma → CSS → Tailwind → React
  const steps = [
    {
      n: "01",
      who: "UI/UX",
      title: "Figma Variables",
      desc: "デザイナーが Figma で色・サイズ・効果を Variables として定義。JSON エクスポートが一次ソース。",
      sample: "color/primary-color-500 = #003388",
    },
    {
      n: "02",
      who: "Bridge",
      title: "app/globals.css",
      desc: "Figma の JSON を CSS Custom Properties (162 colors + 13 sizes) として書き出す。テナント別の上書きは components/<tenant>/tokens.css。",
      sample: "--primary-color-500: #003388;",
    },
    {
      n: "03",
      who: "Bridge",
      title: "Tailwind utility (@theme inline)",
      desc: "Tailwind v4 の @theme inline 経由で、CSS Variable がそのまま utility class として公開される。中間ビルド不要。",
      sample: "bg-primary, text-primary-foreground, ring-ring",
    },
    {
      n: "04",
      who: "Dev",
      title: "React component (.tsx)",
      desc: "開発者は className に utility を書くだけ。生 hex は触らないため、Figma 側の色変更が即座に全コンポーネントへ波及する。",
      sample: '<button className="bg-primary text-primary-foreground">',
    },
  ];

  return (
    <Section id="pipeline">
      <SectionHeading
        eyebrow="Pipeline"
        title="UI/UX ↔ Dev 連携フロー"
        description="デザイナーが Figma Variables を編集してから、開発者の React コンポーネントに色が反映されるまでの 4 ステップ。途中に「ビルド時の同期作業」は介在しないので、Figma の変更がそのまま実装に届きます。"
        audience="both"
      />

      <ol className="space-y-3">
        {steps.map((s) => (
          <li
            key={s.n}
            className="rounded-lg border border-border bg-card p-5 text-card-foreground transition-colors duration-300"
          >
            <div className="flex items-start gap-4">
              <span className="font-mono text-h6 font-semibold text-primary">
                {s.n}
              </span>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-h7 font-semibold">{s.title}</h3>
                  <Badge variant="outline" className="font-mono text-tiny">
                    {s.who}
                  </Badge>
                </div>
                <p className="text-body text-muted-foreground">{s.desc}</p>
                <pre className="overflow-x-auto rounded-md bg-muted/60 px-3 py-2 font-mono text-tiny text-muted-foreground">
                  {s.sample}
                </pre>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <Card className="mt-6 transition-colors duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-h7">テナントごとのカスタマイズ</CardTitle>
          <CardDescription>
            顧客企業のブランドカラーは <code>components/&lt;tenant&gt;/tokens.css</code> で
            上書きします。<code>.&lt;tenant&gt;-scope</code> クラスでスコープされているので、
            同じリポジトリで複数テナントを並行運用できます。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-body text-muted-foreground">
          <p>
            <strong className="text-foreground">テナント追加の自動化:</strong>{" "}
            <code>./scripts/new-tenant.sh &lt;tenant&gt;</code> を実行すると、
            <code>app/&lt;tenant&gt;/</code> と <code>components/&lt;tenant&gt;/</code> の
            雛形が一括生成されます。
          </p>
        </CardContent>
      </Card>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* NEW: Architecture (ファイル構造マップ)                              */
/* ---------------------------------------------------------------- */

function Architecture() {
  const tree = `neutral-base-v2/
├── app/
│   ├── globals.css              # 162 colors + 13 sizes (Figma source)
│   ├── layout.tsx               # root layout (geist font, theme provider)
│   ├── page.tsx                 # 汎用 TOP
│   ├── guidelines/              # 汎用 Guidelines (このページ)
│   ├── components/              # 汎用 Components
│   ├── xxx/                     # XXX テナント (架空サンプル)
│   │   ├── layout.tsx           # .xxx-scope を適用
│   │   ├── page.tsx
│   │   ├── guidelines/
│   │   ├── components/
│   │   ├── prototype/           # iPhone フレーム遷移
│   │   └── windows/             # 2×2 グリッド俯瞰
│   └── td-financial/            # T&D 本番テナント
│       └── ...同じ構造
├── components/
│   ├── ui/                      # shadcn primitives (29 個)
│   ├── uikit-catalog.tsx        # Components ページ本体 (25 セクション)
│   ├── site-header.tsx          # ヘッダー (テナント切替 + フォーカスモード)
│   ├── theme-toggle.tsx         # ライト/ダーク切替
│   ├── mock-viewer/             # iphone-frame, canvas-grid
│   ├── xxx/                     # XXX 固有
│   │   ├── tokens.css           # ★ ブランドカラー override
│   │   ├── flow-*.tsx           # 申込フロー (iPhone 内)
│   │   └── screens.tsx
│   └── td-financial/            # T&D 固有 (同じ構造)
├── lib/utils.ts                 # cn() helper
├── middleware.ts                # Basic Auth (本番 only)
├── public/
│   ├── fonts/                   # Noto Sans JP self-hosted
│   └── assets/                  # ロゴ等
├── scripts/
│   ├── new-tenant.sh            # /new-tenant スキル本体
│   └── rename-tokens.sh         # 一括リネーム用
└── skills/
    └── new-tenant/SKILL.md      # Cowork スキル定義`;

  const layers = [
    {
      icon: "🎨",
      title: "デザインソース",
      who: "UI/UX",
      paths: ["app/globals.css", "components/<tenant>/tokens.css"],
      desc: "色・サイズ・タイポの一次定義。Figma Variables と 1:1 対応。",
    },
    {
      icon: "🧩",
      title: "プリミティブ",
      who: "UI/UX & Dev",
      paths: ["components/ui/"],
      desc: "shadcn/ui の 29 個 (Button / Input / Dialog ...)。両チームの共通言語。",
    },
    {
      icon: "📑",
      title: "アプリケーションページ",
      who: "Dev",
      paths: ["app/<tenant>/*/page.tsx"],
      desc: "実際の画面実装。Tailwind utility と shadcn primitive を組み合わせる。",
    },
    {
      icon: "🛠️",
      title: "自動化スキル",
      who: "Dev",
      paths: ["scripts/", "skills/"],
      desc: "テナント追加、トークンリネーム等の繰り返し作業をスクリプト化。",
    },
  ];

  return (
    <Section id="architecture">
      <SectionHeading
        eyebrow="Architecture"
        title="ファイル構造マップ"
        description="リポジトリのどこに何があるか。デザイナーは globals.css と tokens.css、開発者は components/ と app/ を主に触ります。"
        audience="developer"
      />

      {/* 4 つのレイヤー */}
      <div className="grid gap-3 md:grid-cols-2">
        {layers.map((l) => (
          <div
            key={l.title}
            className="rounded-lg border border-border bg-card p-4 text-card-foreground transition-colors duration-300"
          >
            <div className="flex items-center gap-2">
              <span className="text-h7" aria-hidden>{l.icon}</span>
              <h3 className="text-h7 font-semibold">{l.title}</h3>
              <Badge variant="outline" className="font-mono text-tiny">
                {l.who}
              </Badge>
            </div>
            <p className="mt-2 text-body text-muted-foreground">{l.desc}</p>
            <ul className="mt-2 space-y-0.5">
              {l.paths.map((p) => (
                <li key={p} className="font-mono text-tiny text-primary">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* file tree */}
      <Card className="mt-6 transition-colors duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-h7">file tree (一覧)</CardTitle>
          <CardDescription>
            主要ファイルのみ抜粋。完全版は GitHub リポジトリで参照してください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-md bg-muted/60 p-4 font-mono text-tiny leading-relaxed text-muted-foreground">
            {tree}
          </pre>
        </CardContent>
      </Card>

      {/* 技術スタック */}
      <Card className="mt-4 transition-colors duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-h7">技術スタックの位置づけ</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1.5 text-body text-muted-foreground">
            <li>
              <strong className="text-foreground">Next.js 16</strong> (App Router, Turbopack)
              — ルーティングと SSR/SSG。<code>app/&lt;tenant&gt;/</code> がそのまま URL に対応。
            </li>
            <li>
              <strong className="text-foreground">React 19</strong> — UI レイヤー。
            </li>
            <li>
              <strong className="text-foreground">Tailwind CSS v4</strong>
              — utility-first スタイリング。<code>@theme inline</code> で CSS Variables を
              utility class として自動公開するので、Figma の値変更が即座に
              反映される（ビルド設定のメンテナンス不要）。
            </li>
            <li>
              <strong className="text-foreground">shadcn/ui (new-york)</strong>
              — Radix UI を土台にしたヘッドレス component を <code>components/ui/</code>
              にコピーして使う方式。「ライブラリ」ではなく「自分のコード」として育てる。
            </li>
            <li>
              <strong className="text-foreground">Vercel</strong>
              — GitHub の <code>main</code> ブランチ push で自動デプロイ。
              プレビュー URL は <code>neutral-base.vercel.app/&lt;tenant&gt;</code>。
            </li>
          </ul>
        </CardContent>
      </Card>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* 1. Hero                                                            */
/* ---------------------------------------------------------------- */

function Hero() {
  return (
    <header className="mb-8 max-w-3xl">
      <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
        Guidelines
      </p>
      <h1 className="mt-2 text-h3 font-semibold tracking-tight sm:text-h2">
        デザインガイドライン
      </h1>
      <p className="mt-3 text-body text-muted-foreground sm:text-body-lg">
        デザインシステムの「ベース原則」を定義するページです。
        XXX など各導入先のブランドルールは、ここを土台にした上で
        <Link
          href="/xxx/guidelines"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          子ルート
        </Link>
        として個別に運用します。
      </p>
    </header>
  );
}

/* ---------------------------------------------------------------- */
/* 2. Principles                                                      */
/* ---------------------------------------------------------------- */

const PRINCIPLES = [
  {
    n: "01",
    title: "Token First",
    body:
      "色・サイズ・余白は Figma Variables から生成されたトークンを単一情報源とする。ハードコードされた値はレビューで弾く。",
  },
  {
    n: "02",
    title: "Predictable",
    body:
      "同じ意味の操作には同じコンポーネントを使う。バリアントを増やす前に、既存パターンで解けないかを必ず検討する。",
  },
  {
    n: "03",
    title: "Accessible by Default",
    body:
      "コントラスト・タッチターゲット・フォーカス可視化はオプションではない。プリミティブが既定で満たすように設計する。",
  },
  {
    n: "04",
    title: "Themeable",
    body:
      "ライト / ダーク・モバイル / デスクトップ・各社ブランドの差はトークンの差し替えで吸収する。コンポーネントの実装には差を持ち込まない。",
  },
];

function Principles() {
  return (
    <Section id="principles">
      <SectionHeading
        eyebrow="Principles"
        title="設計原則 4 つ"
        description="どの導入先でも崩さない、デザインシステムの土台です。これに反する個別最適化は採用しません。"
        audience="both"
      />
      <ol className="space-y-3">
        {PRINCIPLES.map((p) => (
          <li
            key={p.n}
            className="flex gap-4 rounded-lg border border-border bg-card p-5 text-card-foreground transition-colors duration-300"
          >
            <span className="font-mono text-h6 font-semibold text-primary">
              {p.n}
            </span>
            <div className="space-y-1">
              <h3 className="text-h7 font-semibold">{p.title}</h3>
              <p className="text-body text-muted-foreground">{p.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* 3. Tokens                                                          */
/* ---------------------------------------------------------------- */

function Tokens() {
  return (
    <Section id="tokens">
      <SectionHeading
        eyebrow="Tokens"
        title="セマンティックトークン"
        description="shadcn の表記 (background / foreground / primary / ...) に Figma の生値を流し込む二段構成。コンポーネントは生値ではなくセマンティック名のみを参照します。"
        audience="both"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SemanticSwatch
          name="background / foreground"
          role="ページ背景と本文テキスト"
          swatchClass="bg-background text-foreground"
        />
        <SemanticSwatch
          name="card / card-foreground"
          role="カード・パネルの面"
          swatchClass="bg-card text-card-foreground"
        />
        <SemanticSwatch
          name="primary / primary-foreground"
          role="主要 CTA・選択状態 (各社で差し替え)"
          swatchClass="bg-primary text-primary-foreground"
        />
        <SemanticSwatch
          name="muted / muted-foreground"
          role="補助テキスト・グレースケール"
          swatchClass="bg-muted text-muted-foreground"
        />
        <SemanticSwatch
          name="accent / accent-foreground"
          role="ハイライト・行選択"
          swatchClass="bg-accent text-accent-foreground"
        />
        <SemanticSwatch
          name="destructive"
          role="削除・取り消しなど不可逆操作"
          swatchClass="bg-destructive text-white"
        />
      </div>

      <Card className="mt-6 transition-colors duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-h7">命名規約</CardTitle>
          <CardDescription>
            生のスケール (例: <code>--secondary-color-500</code>) はトークン定義ファイル内でだけ使い、
            コンポーネントには公開しないこと。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-body text-muted-foreground">
          <p>
            <strong className="text-foreground">良い例:</strong>
            {" "}<code>className=&quot;bg-primary text-primary-foreground&quot;</code>
          </p>
          <p>
            <strong className="text-foreground">悪い例:</strong>
            {" "}<code>className=&quot;bg-[#3b7eff] text-white&quot;</code>
            （ダーク非対応 / 各社差し替え不可）
          </p>
        </CardContent>
      </Card>
    </Section>
  );
}

function SemanticSwatch({
  name,
  role,
  swatchClass,
}: {
  name: string;
  role: string;
  swatchClass: string;
}) {
  return (
    <Card className="overflow-hidden transition-colors duration-300">
      <div
        className={`flex h-20 items-center justify-center text-caption font-medium ${swatchClass} transition-colors duration-300`}
      >
        Aa
      </div>
      <CardContent className="space-y-1 pt-4">
        <p className="font-mono text-caption">{name}</p>
        <p className="text-caption text-muted-foreground">{role}</p>
      </CardContent>
    </Card>
  );
}

/* ---------------------------------------------------------------- */
/* 4. Typography                                                      */
/* ---------------------------------------------------------------- */

const TYPE_SCALE = [
  { name: "H1", token: "text-h1", px: 56, use: "ランディングのキャッチ" },
  { name: "H2", token: "text-h2", px: 48, use: "ヒーロー見出し" },
  { name: "H3", token: "text-h3", px: 40, use: "セクション見出し (大)" },
  { name: "H4", token: "text-h4", px: 32, use: "ページタイトル" },
  { name: "H5", token: "text-h5", px: 24, use: "セクション見出し" },
  { name: "H6", token: "text-h6", px: 20, use: "サブセクション" },
  { name: "H7", token: "text-h7", px: 18, use: "カードタイトル" },
  { name: "Body LG", token: "text-body-lg", px: 16, use: "本文 (リード)" },
  { name: "Body", token: "text-body", px: 14, use: "本文 (標準)" },
  { name: "Caption", token: "text-caption", px: 12, use: "補助・タグ" },
  { name: "Tiny", token: "text-tiny", px: 10, use: "メタ情報" },
];

function Typography() {
  return (
    <Section id="type">
      <SectionHeading
        eyebrow="Typography"
        title="11 段階のフォントスケール"
        description="Figma の size.json から取り込んだ 11 段階。導入先のフォントファミリーは差し替え可能ですが、サイズと階層関係は共通とします。"
        audience="both"
      />
      <div className="overflow-hidden rounded-md border border-border transition-colors duration-300">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">サイズ名</TableHead>
              <TableHead className="w-36">トークン</TableHead>
              <TableHead className="w-20">px</TableHead>
              <TableHead>用途</TableHead>
              <TableHead className="text-right">プレビュー</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TYPE_SCALE.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>
                  <code className="text-caption text-muted-foreground">
                    {row.token}
                  </code>
                </TableCell>
                <TableCell className="tabular-nums">{row.px}</TableCell>
                <TableCell className="text-muted-foreground">
                  {row.use}
                </TableCell>
                <TableCell
                  className={`${row.token} text-right font-semibold leading-none`}
                >
                  Aa
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* 5. Accessibility                                                   */
/* ---------------------------------------------------------------- */

function Accessibility() {
  return (
    <Section id="a11y">
      <SectionHeading
        eyebrow="Accessibility"
        title="最低ライン: WCAG 2.2 AA"
        description="各社のガイドラインはこの最低ラインを下回ってはいけません。導入先の業種に応じて上振れさせるのは可です。"
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
            <p>本文テキスト: 4.5 : 1 以上。</p>
            <p>UI 部品 (枠線・アイコン): 3 : 1 以上。</p>
            <p>状態を色だけで伝えない (アイコン + テキストで補強)。</p>
          </CardContent>
        </Card>
        <Card className="transition-colors duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-md bg-accent text-accent-foreground">
                <TypeIcon className="size-4" />
              </span>
              <CardTitle className="text-h7">タッチ・キーボード</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-body text-muted-foreground">
            <p>モバイルのタッチターゲットは 44 × 44 px 以上。</p>
            <p>
              すべてのインタラクティブ要素にフォーカスリングを{" "}
              <code>focus-visible</code> で表示。
            </p>
            <p>
              ブラウザの拡大率 200% でレイアウトが崩れないこと
              (水平スクロール禁止)。
            </p>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* 6. Components                                                      */
/* ---------------------------------------------------------------- */

function Components() {
  return (
    <Section id="components">
      <SectionHeading
        eyebrow="Components"
        title="共通コンポーネント運用"
        description="プリミティブは shadcn/ui (new-york)。スタイルはトークン経由でのみ上書きします。"
        audience="both"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="transition-colors duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-md bg-accent text-accent-foreground">
                <ComponentIcon className="size-4" />
              </span>
              <CardTitle className="text-h7">追加するときの基準</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-body text-muted-foreground">
            <p>3 箇所以上で使い回せる UI のみコンポーネント化。</p>
            <p>名前は <strong>役割</strong> (Button) で付ける。見た目 (BlueBtn) で付けない。</p>
            <p>
              バリアントは原則 3 つまで (default / secondary / outline)。
              4 つ目を作る前にデザインレビューを通す。
            </p>
          </CardContent>
        </Card>
        <Card className="transition-colors duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-md bg-accent text-accent-foreground">
                <PaletteIcon className="size-4" />
              </span>
              <CardTitle className="text-h7">カラーの当て方</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-body text-muted-foreground">
            <p>
              主役の <code>primary</code> は機能色。装飾には使わない。
            </p>
            <p>1 画面に primary ボタンは原則 1 つ。並列はバリアントを下げる。</p>
            <p>
              業種固有の追加色 (例: 金融の青) は子ガイドライン側で定義する。
            </p>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* 7. Theme & Responsive                                              */
/* ---------------------------------------------------------------- */

function ThemeAndResponsive() {
  return (
    <Section id="theme">
      <SectionHeading
        eyebrow="Theme & Responsive"
        title="ライト・ダーク・モバイル"
        description="単一のトークンセットから 4 環境 (ライト × デスクトップ / ライト × モバイル / ダーク × デスクトップ / ダーク × モバイル) に展開します。"
        audience="developer"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="transition-colors duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-md bg-accent text-accent-foreground">
                <MoonIcon className="size-4" />
              </span>
              <CardTitle className="text-h7">テーマ切替の挙動</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-body text-muted-foreground">
            <p>
              右上トグルが <code>&lt;html&gt;</code> に <code>dark</code>{" "}
              クラスを付与。
            </p>
            <p>
              主要サーフェスに <code>transition-colors duration-300</code> を載せ、
              フワッと切替。
            </p>
            <p>ダーク時の primary は 1 段明るくして &quot;沈み&quot; を防ぐ。</p>
          </CardContent>
        </Card>
        <Card className="transition-colors duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-h7">レスポンシブ規則</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-body text-muted-foreground">
            <p>
              ボタン標準高さ: モバイル 44px / デスクトップ 36px
              (<code>--button-h-standard</code>)。
            </p>
            <p>
              本文は <code>text-body</code> → <code>sm:text-body-lg</code> のように、
              モバイルで小さく、デスクトップで読みやすく拡張する。
            </p>
            <p>レイアウトは 1 → 2 → 3 列の段階だけにする (中間段階を増やさない)。</p>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* 8. Brand satellites                                                */
/* ---------------------------------------------------------------- */

function BrandSatellites() {
  return (
    <Section id="brands">
      <SectionHeading
        eyebrow="Brand-specific"
        title="各社別ガイドライン"
        description="共通ガイドラインを土台として、各導入先のブランド固有ルールは子ページに分離されています。"
        audience="both"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/xxx/guidelines"
          className="group block rounded-lg border border-border bg-card p-6 text-card-foreground transition-colors duration-300 hover:border-primary"
        >
          <div className="flex items-center justify-between">
            <Badge variant="secondary">XXX</Badge>
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
          <h3 className="mt-3 text-h7 font-semibold">
            XXX 専用ガイドライン
          </h3>
          <p className="mt-2 text-body text-muted-foreground">
            信頼・誠実・モダン・クリーンを 4 本柱に、Primary Blue の 60:30:10
            運用と幅広い年齢層への配慮をまとめた金融・保険向けの公式ルール。
          </p>
        </Link>

        <div className="rounded-lg border border-dashed border-border p-6 text-muted-foreground transition-colors duration-300">
          <Badge variant="outline">Coming soon</Badge>
          <h3 className="mt-3 text-h7 font-semibold text-foreground">
            他社向けガイドライン
          </h3>
          <p className="mt-2 text-body">
            新しい導入先が増えるたびに、ここに子ページへのリンクを追加していきます。
          </p>
        </div>
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
          © Design System · Figma Variables を単一情報源として運用されています。
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/components">Components を見る</Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href="/xxx/guidelines">XXX ルールへ</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
