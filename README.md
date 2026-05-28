# Design System Showcase

Figma Variables を取り込んだ Next.js + Tailwind CSS v4 + shadcn/ui ベースのデザインシステムショーケース。

## 概要

- **Color tokens**: 162 件 (Figma `color.json` から)
- **Size tokens**: 13 件 (Figma `size.json` から)
- **コンポーネント**: shadcn/ui new-york スタイルで 20 種類以上 (Button / Input / Select / Table / Dialog / Tooltip / Sheet / Command / Calendar 等)
- **ライト / ダーク両モード対応**: WCAG コントラスト比に配慮した自動生成パレット
- **モバイルファースト**: ボタン等は mobile 44px / desktop 36px のレスポンシブ高さ

## 技術スタック

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript 5
- Tailwind CSS v4 (`@theme inline` + `@custom-variant dark`)
- shadcn/ui (new-york style)
- Radix UI primitives
- sonner (toast)
- react-day-picker (calendar)

## 開発

```bash
pnpm install
pnpm dev
```

`http://localhost:3000` でショーケースが開きます。

## ビルド

```bash
pnpm build
pnpm start
```

## ディレクトリ構成

```
app/
  page.tsx          # ショーケース本体（旧 /showcase をトップに統合）
  showcase/         # 旧 URL の互換リダイレクト
  globals.css       # 162+13 トークンと shadcn セマンティック変数
  layout.tsx        # Sonner Toaster を含む root layout
components/
  ui/               # shadcn コンポーネント (Button, Input, Dialog ...)
  showcase/         # ショーケース専用クライアントデモ
  theme-toggle.tsx  # 右上のライト/ダーク切替
  client-only.tsx   # SSR/CSR の useId 不一致を回避するマウントゲート
lib/
  utils.ts          # cn() ヘルパー
```

## デザイントークンの更新フロー

1. Figma で Variables を編集
2. JSON エクスポート (`color.json`, `size.json`)
3. `app/globals.css` の CSS 変数を更新
4. `@theme inline` 経由で Tailwind ユーティリティとして自動公開

## マルチテナント構成

このリポジトリは複数顧客向けの汎用テンプレートとして運用される。
`app/<tenant>/` 配下にテナント固有のページを置き、`components/<tenant>/tokens.css`
でブランドカラーを上書きする方針。

### 既存テナント

| パス | 用途 | スコープクラス |
|------|------|---------------|
| `/xxx` | サンプル架空テナント (お手本・テンプレート参照用、永続) | `.xxx-scope` |
| `/aaa` | デモテナント (`/new-tenant` スキルで生成) | `.aaa-scope` |

### 新しいテナントを追加する (`/new-tenant` スキル)

`/xxx/` を雛形として、新規顧客テナントをスキャフォールドする。

```bash
./scripts/new-tenant.sh <tenant>
# 例:
./scripts/new-tenant.sh acme --brand-label "ACME Corp"
```

実行後、以下が自動生成・更新される:

- `app/<tenant>/` (TOP, Guidelines, Components, Prototype, Windows の 5 ページ)
- `components/<tenant>/` (tokens.css ほか、flow 系コンポーネント)
- `components/site-header.tsx` の `TENANTS` 配列に新エントリ

`http://localhost:3000/<tenant>` で即立ち上がる。詳細は
[`skills/new-tenant/SKILL.md`](skills/new-tenant/SKILL.md) を参照。
