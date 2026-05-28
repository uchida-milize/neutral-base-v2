# Handoff — 汎用 + テナント別デザインシステム × 顧客 UI/UX 構築フロー

最終更新: 2026年5月28日

新しい Cowork チャットを開いた時、このファイルを添付すれば文脈を引き継げます。

---

## 1. プロジェクトのゴール

「顧客企業ごとにテーマを差し替え可能なデザインシステムを土台にして、ワイヤーフレームから各社向けの UI/UX ページを高速に生成し、開発側にそのまま渡せる状態でデプロイする」一連のパイプラインを Cowork スキルとして整備する。

### 構想全体フロー

```
[1] Google AI Studio または Figma でワイヤーフレーム / デザイン作成
        │
        │  Figma の場合は Figma MCP 経由で取り込み (Variables/Components も)
        ↓
[2] claude.ai/design (Claude Design) でページデザイン化
        ├ Figma UI Kit を読み込ませて反映
        ├ 顧客ブランドのテーマカラー・コーポレートカラーを適用
        ├ iOS 風枠でも確認できるよう出力
        ├ Tailwind ベースの React コンポーネントを生成
        └ トークン整合性が保たれた状態
        │
        │  お客様が "Hand off to Claude Code" / "Export" で zip ダウンロード
        ↓
[3] Upload フォルダに handoff バンドル (zip) を配置
        │
        │  Cowork が /import-claude-design スキルで読み込む (Priority 3、未実装)
        ↓
[4] Cowork が neutral-base リポジトリの該当テナント配下に配置
        ├ app/<tenant>/<page>/ に Claude Design 出力を整形して置く
        ├ components/<tenant>/tokens.css でブランドカラーを上書き
        ├ site-header.tsx の TENANTS 配列にエントリ追加 (新規テナントの場合)
        └ import 文・コンポーネント参照を本リポジトリの構造に合わせて調整
        │
        ↓
[5] お客様がローカルで git add / commit / push (Cowork は push しない方針)
        │
        ↓
[6] Vercel が自動デプロイ
        │
        ↓
[7] neutral-base.vercel.app/<tenant> が顧客レビュー Space (Basic Auth 保護)
        ├ 顧客担当者はこの URL だけを案内される
        ├ /<tenant>/prototype で iPhone フレーム単画面遷移
        ├ /<tenant>/windows で 2×2 グリッド俯瞰
        └ /<tenant>/<page>?focus=1 でナビ非表示の「顧客説明モード」
        │
        │  最終承認後
        ↓
[8] Figma に各ページのデザイン + リンク構造を FB
        │  html.to.design プラグイン経由で手動取り込み (詳細は §4-B)
        │  /export-to-figma スキル (Priority 5) で自動化予定
```

詳細な /guidelines ページ内 Workflow フロー図 (Dify 風 4 ノード曲線) を参照。

### 役割分担

| ツール | 担当する仕事 |
|--------|-------------|
| **Claude Design** | ワイヤーフレーム → 顧客用 UI/UX ページデザイン化 (本作業の中核創造工程) |
| **Cowork** | プロジェクト基盤管理 / テナント分岐 / デプロイ自動化 / ブランドトークン管理 / Claude Design 出力の受け入れ |
| **Claude Code (CLI)** | Claude Design からの handoff バンドルの直接受け取り (将来、開発者ローカルで使う場合) |
| **Vercel** | GitHub Integration による自動デプロイ + 顧客プレビューホスティング |
| **Figma** | デザインシステム Variables のソース・オブ・トゥルース、最終 FB の格納先 |

### テナント設計方針

このリポジトリは「汎用デザインシステムを土台に、テナントごとに色 + ロゴだけを差し替える」運用。

| テナント | 種別 | URL | ブランドカラー | 用途 |
|---|---|---|---|---|
| **xxx** | 架空サンプル (お手本テンプレート、永続) | `/xxx` | Teal / Cyan / Teal mid / Amber | 雛形 — 新規テナントはこれを複製 |
| **aaa** | デモテナント (検証用、削除可) | `/aaa` | xxx と同色 (Teal/Cyan/Teal mid/Amber) | `/new-tenant` スキルの動作確認用 |
| **td-financial** | 本番顧客 (T&Dファイナンシャル生命) | `/td-financial` | Navy `#003388` / Red `#db0034` / Blue `#344a9c` / Red `#db0034` | 顧客向け本番テナント |

XXX 自体は永続的に「お手本テナント」として残す (新規テナントの雛形参照用)。実在企業ロゴは公開ロゴ URL を直接参照する形 (`brandLogo` 経由)。

---

## 2. 現在の構築状態

### リポジトリ・URL

| 種別 | 値 |
|------|-----|
| GitHub リポジトリ | `https://github.com/uchida-milize/neutral-base` (Private) |
| Vercel プロジェクト | `tuchida in milize projects` / `neutral-base` |
| 本番 URL | `https://neutral-base.vercel.app` (Basic Auth 保護) |
| ローカル作業フォルダ | `~/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base-v2` |

### Routes (全 18 ページ)

**汎用デザインシステム (3 ページ)**:
- `/` — TOP (Hero + Overview 3 グループ + Core ページ案内 + Tenants 案内)
- `/guidelines` — Guidelines (Workflow フロー図 + Pipeline 3 グループ + Architecture + Principles + Tokens + Typography + Accessibility + Components + Theme & Responsive + BrandSatellites)
- `/components` — Components (25 セクションの shadcn/ui カタログ)

**各テナント (5 ページ × 3 = 15)**:
| テナント | パス | スコープクラス |
|---|---|---|
| XXX | `/xxx`, `/xxx/guidelines`, `/xxx/components`, `/xxx/prototype`, `/xxx/windows` | `.xxx-scope` |
| AAA | 同上で `/aaa/*` | `.aaa-scope` |
| T&D | 同上で `/td-financial/*` | `.td-financial-scope` |

### ヘッダーナビゲーション

`components/site-header.tsx` の `TENANTS` 配列で動的切替。URL パス前方一致で判定。

| エリア | メニュー | ブランドマーク |
|-------|---------|---|
| 汎用 | TOP / Guidelines / Components | "D" 文字マーク |
| XXX | TOP / Guidelines / Components / Prototype / Windows | "T" 文字マーク |
| AAA | 同上 | "A" 文字マーク |
| T&D | 同上 | **公式ロゴ画像** (Fontshare/CDN 経由の URL) |

新規テナントの追加は `TENANTS` 配列に 1 エントリ追加 + `app/<tenant>/` 配下にディレクトリを作るだけで成立する設計。`./scripts/new-tenant.sh <name>` で全自動。

### フォーカスモード (`?focus=1`)

URL クエリで `?focus=1` を付けると、ヘッダーのナビセットとテーマトグルが非表示になり、ロゴクリックも無効化される。**顧客説明用 URL** として共有可能 (お客様が他ページに遷移できない):

```
https://neutral-base.vercel.app/td-financial/prototype?focus=1
https://neutral-base.vercel.app/td-financial/windows?focus=1
https://neutral-base.vercel.app/td-financial/guidelines?focus=1
```

### Basic Auth (本番保護)

`middleware.ts` で Edge Runtime Basic Auth を実装済み。Vercel 環境変数:

- `BASIC_AUTH_USER`
- `BASIC_AUTH_PASS`

両方が未設定だと fail-closed (500) で誤公開を防ぐ。`_next/static/*` / `_next/image/*` / `favicon.ico` / `robots.txt` / `sitemap.xml` は除外、`NODE_ENV=development` 時はバイパス。

### 技術スタック

- Next.js 16.2.6 + React 19.2.4
- Tailwind CSS v4 (`@theme inline` で CSS Variables を utility class として自動公開)
- shadcn/ui (new-york style)
- Radix UI primitives
- Geist Sans / Geist Mono (geist パッケージ、セルフホスト)
- Noto Sans JP 9 ウェイト (セルフホスト、public/fonts/)
- **Chillax** (Fontshare CDN、Medium 500 単体 + size-adjust 120% + Latin 限定) — 見出しと大きな英数字
- lucide-react アイコン
- react-day-picker v10
- next-themes (light/dark)
- sonner (トースト通知)
- pnpm v11 (`pnpm-workspace.yaml` の `allowBuilds` に sharp / unrs-resolver)

### CSS トークン構造 (4 スケール + 1 neutral)

`globals.css` で定義、各テナントの `tokens.css` で上書き:

| トークン | 役割 | 例 (T&D) |
|---|---|---|
| `--primary-color-*` | コーポレートカラー1 (ブランド主要色) | Navy `#003388` |
| `--secondary-color-*` | コーポレートカラー2 (アクセント / badge / highlight) | Red `#db0034` |
| `--button-color-*` | 通常ボタン色 (色面 + 罫線の 2 バリアント) | Blue `#344a9c` |
| `--cta-color-*` | CTA 申込ボタン専用 (= 1 画面 1 つ) | Red `#db0034` (secondary と同色) |
| `--warm-*` | 無彩色 neutral (背景 / 区切り線) | Stone 50-300 |

各スケール 10/50/100/200/300/400/500/600/700 の 9 段階 (warm のみ 4 段階)。

### ボタン体系 (テナント別の差別化)

T&D の例:

| ボタン | 色 | 用途 |
|---|---|---|
| **cta (申込専用)** | Red `#db0034` 色面 | 申込/前進、1 画面 1 つ |
| **primary (通常 filled)** | Blue `#344a9c` 色面 | 通常の確定・保存 |
| **primary-outline (通常 罫線)** | Blue `#344a9c` 罫線 | サブ primary、キャンセル + 確定の主従 |
| **neutral** | グレー色面 | キャンセル / 戻る |
| **outline (サブ)** | グレー罫線 | CSV 出力等 |
| **destructive** | Red 小サイズ | 削除 |

### Tailwind 準拠

**デザイナー側** — `app/globals.css` の CSS Variables を編集
- 162 color tokens + 13 size tokens + 4 テナント色スケール (各テナントの `tokens.css` で上書き)
- `.<tenant>-scope` で各テナントのオーバーライドが効く

**開発者側** — JSX で Tailwind utility を直接書く
- `className="bg-primary text-primary-foreground"` のような可読性高い記法
- 生 hex を書かない → Figma 側の色変更が即座に全コンポーネントへ波及

### タイポグラフィ階層

| 階層 | サイズ | フォント | 用途 |
|---|---|---|---|
| h1 (Hero) | `text-h2` 48px / sm: `text-h1` 56px | Chillax Medium (Latin 120%) | ページ最大タイトル |
| **h2 (セクション)** | **`text-[1.8rem]` 28.8px** | Chillax Medium (Latin 120%) | セクション見出し |
| h3 (CardTitle) | `text-h7` 19.2px (= h2 の 80%) | Chillax Medium (Latin 120%) | 段落見出し |
| body | `text-body` 14px / `text-body-lg` 16px | Geist Sans / Noto Sans JP | 本文 |

セクション間スペーシング: `mt-30` (120px)。Hero h1 に `leading-tight` で 2 行以上の折り返し時の行間を約 80% に。

`JpText` ヘルパー (`components/jp-text.tsx`) で「、」「。」「！」「？」直後で意味のかたまり単位の改行を実現。

---

## 3. ファイル構造の概要

```
neutral-base-v2/
├── app/
│   ├── globals.css                # 162 colors + 13 sizes + 4 tenant scales + Chillax + @layer base
│   ├── layout.tsx                 # root layout (geist フォント + SiteFooter 統合)
│   ├── page.tsx                   # 汎用 TOP (Hero + Overview + Core + Tenants)
│   ├── guidelines/page.tsx        # 汎用 Guidelines (Workflow フロー図 + Pipeline 3 グループ + Arch + …)
│   ├── components/page.tsx        # 汎用 Components → UikitCatalog
│   ├── xxx/                       # 架空サンプル (Teal/Cyan/Teal-mid/Amber)
│   │   ├── layout.tsx             # .xxx-scope を当てる
│   │   ├── page.tsx               # TOP (Hero + Overview + 4 ページ案内)
│   │   ├── guidelines/page.tsx    # Guidelines (5 ScaleBlock + Tailwind マッピング + コードスニペット)
│   │   ├── components/page.tsx    # Components → UikitCatalog
│   │   ├── prototype/page.tsx     # iPhone 画面遷移
│   │   └── windows/page.tsx       # 2×2 俯瞰 (max-w-[1700px] mx-auto)
│   ├── aaa/                       # デモテナント (xxx と同色、削除可能)
│   │   └── ... (xxx と同構造)
│   └── td-financial/              # T&Dファイナンシャル生命 本番テナント
│       └── ... (Navy/Red/Blue 配色、公式ロゴ表示)
├── components/
│   ├── ui/                        # shadcn primitives (29 個)
│   ├── uikit-catalog.tsx          # Components ページ本体 (25 セクション)
│   ├── site-header.tsx            # テナント切替 + ?focus=1 対応 + brandLogo 対応
│   ├── site-footer.tsx            # © MILIZE (layout 経由で全ページ)
│   ├── overview-section.tsx       # 「30 秒で分かる」3 グループ (UI/UX / 🤝 / Dev)
│   ├── flow-diagram.tsx           # Dify 風 Workflow フロー図 (4 ノード曲線)
│   ├── jp-text.tsx                # 読点 / 句点で改行されやすくするヘルパー
│   ├── mock-viewer/
│   │   ├── iphone-frame.tsx       # iPhone フレーム
│   │   └── canvas-grid.tsx        # 俯瞰グリッド
│   ├── xxx-portal-mock.tsx        # @deprecated
│   ├── xxx/, aaa/, td-financial/  # 各テナント固有
│   │   ├── tokens.css             # 4 スケール (primary/secondary/button/cta) + warm 上書き
│   │   ├── flow.css               # .<tenant>-flow scope
│   │   ├── flow-meta.ts           # 申込フロー11画面メタ
│   │   ├── flow-prototype.tsx     # iPhone フレームでの遷移実装
│   │   ├── flow-screens.tsx
│   │   └── screens.tsx
│   ├── client-only.tsx
│   ├── theme-toggle.tsx
│   ├── scroll-to-top.tsx
│   └── showcase/sonner-demo.tsx
├── lib/utils.ts                   # cn() ヘルパー
├── middleware.ts                  # Basic Auth (Next.js Edge Runtime)
├── public/
│   ├── fonts/                     # Noto Sans JP 9 ウェイト
│   └── assets/                    # ロゴ等
├── scripts/
│   ├── new-tenant.sh              # /new-tenant スキル本体 (Bash + Python 埋込み)
│   └── rename-tokens.sh           # CSS 変数一括リネーム (改修用、再利用は稀)
├── skills/
│   └── new-tenant/SKILL.md        # Cowork スキル定義
├── pnpm-workspace.yaml            # allowBuilds: sharp, unrs-resolver (pnpm v11 対応)
├── package.json
├── tsconfig.json
├── next.config.ts
├── DEPLOY.md                      # 初回 push + 日常更新の手順
└── HANDOFF.md                     # このファイル
```

---

## 4. デプロイ・更新運用

### 日常の更新フロー

```bash
cd ~/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base-v2
rm -f .git/index.lock              # FUSE で残った場合のみ
git add -A
git commit -m "変更の説明"          # 複数行メッセージは時々ハマるので、シンプルな 1 行推奨
git push
```

push → 数十秒で Vercel が再ビルド・再デプロイ。

### Cowork サンドボックスの制約

- `api.vercel.com` ブロック → Cowork から Vercel CLI で直接デプロイは不可
- `api.github.com` ブロック → Cowork から GitHub API 経由のリポ作成は不可
- `github.com` ・`registry.npmjs.org` は到達可能
- ローカル GoogleDrive フォルダは FUSE マウントで一部 `rm` 操作が拒否される (`rsync --delete` も避ける)
  - 対処: `mcp__cowork__allow_cowork_file_delete` ツールで削除許可を取得

### コミット作者の重要ルール

Vercel Hobby プランは「team member 以外の author の commit は自動デプロイしない」制限がある。

- ローカルで `git config user.name "うちだ"` / `git config user.email "tuchida@milize.co.jp"` 設定済み
- Cowork が編集 → お客様が `git commit` する流れなら、お客様 identity で commit されるので問題なし

### git 運用方針 (確定)

- **Cowork は編集のみ**、`git add / commit / push` はすべてお客様がターミナルで実行
- GitHub PAT は **Cowork には渡さない** 方針で確定 (`gh auth login` ベース)
- `.env.local` に `VERCEL_TOKEN` のみ残置 (緊急時用、現状の運用では使わない)

### Vercel-GitHub 連携

- GitHub Integration 設定済み (Vercel ダッシュボード上で結合済み)
- push 後、新しい commit は自動でビルド・デプロイ
- 失敗時は Vercel ダッシュボードでログ確認

---

## 4-B. Figma 連携フロー

(前バージョンと同内容のため要約)

UI/UX 納品契約で Figma ファイルが要求されるケースに備え、以下の戦略:

- **日常運用**: Cowork × Vercel に集中。Figma との常時同期はしない
- **納品 / 顧客要望のタイミング**: `/export-to-figma` (Priority 5、未実装) を発火
- **見た目の QA**: html.to.design で `https://neutral-base.vercel.app/<tenant>/windows?focus=1` を Viewport 1700px で取り込み

Claude Design の特性 (2026-05-27 実験結果):
- ✓ 派生・拡張に強い (Q1→Q2 から Q3/Q4 を自動生成)
- ✓ トークン抽出は正確
- △ 同一性再現は不完全 (細部のレイアウトずれ、不要な加筆)

→ Claude Design = 「**創造系**」、Figma MCP 経由 Cowork スキル = 「**同一性が要求される変換**」と役割分担。

詳細は前バージョンの §4-B 参照 (内容は不変)。

---

## 5. 実装済みスキル / 機能

### ✅ Priority 1 — `/new-tenant` テナント追加スキル (実装済み)

**スキル本体**: `scripts/new-tenant.sh` + `skills/new-tenant/SKILL.md`

**使い方**:
```bash
./scripts/new-tenant.sh <tenant>                                        # 最小構成
./scripts/new-tenant.sh aaa                                              # サンプル名で
./scripts/new-tenant.sh acme --brand-label "ACME Corp"                  # ブランド表示名指定
./scripts/new-tenant.sh acme --brand-label "..." --brand-initial "A"    # マーク文字指定
./scripts/new-tenant.sh aaa --force                                      # 既存上書き
./scripts/new-tenant.sh aaa --dry-run                                    # 確認のみ
```

**実行内容**:
1. `app/xxx/` → `app/<tenant>/` 全体を `cp -R` で複製
2. `components/xxx/` → `components/<tenant>/` 全体を複製
3. コピー先で以下を一括置換:
   - `/xxx` (URL) → `/<tenant>`
   - `@/components/xxx/` (import) → `@/components/<tenant>/`
   - `.xxx-scope` / `xxx-scope` → `.<tenant>-scope` / `<tenant>-scope`
   - `.xxx-flow` / `xxx-flow` → `.<tenant>-flow` / `<tenant>-flow`
   - `--xxx-` (CSS 変数 prefix) → `--<tenant>-`
4. `components/site-header.tsx` の `TENANTS` 配列に新エントリ挿入 (`// 将来の他社はここに追加 (例)` アンカーの直前)

**置換しないもの** (意図的):
- `XXX` (大文字、ブランドテキスト) — 顧客に見せる文言は `/init-brand-tokens` (Priority 2) または手動で
- React コンポーネント名 (例: `TdfFlowPrototype`) — ファイルが別なので衝突しない

### ✅ T&Dファイナンシャル生命テナント (本番運用中)

- URL: `/td-financial/*`
- カラー: Navy `#003388` / Red `#db0034` / Blue `#344a9c` / Red `#db0034`
- 公式ロゴ表示 (T&D 公式 CDN URL を `brandLogo` で参照)
- Hero タイトル: 「TDF 組込ページ向け デザイン資料」

### ✅ CSS 変数の 4 スケール構造

- `--primary-color-*` (旧 `navigation-navy-*`)
- `--secondary-color-*` (旧 `primary-blue-*`)
- `--button-color-*` (旧 `cta-amber-*`)
- `--cta-color-*` (新規追加)
- `--warm-*` (neutral)

各 9 段階 (10〜700)、テナントの `tokens.css` で上書き、`globals.css` のデフォルトは primary-color エイリアス。

### ✅ ボタン体系の再構成 (T&D 例)

- cta (Red filled, 申込専用)
- primary 色面 (Blue filled)
- primary 罫線 (Blue outline)
- neutral / outline / destructive

### ✅ フォーカスモード `?focus=1`

ヘッダーのナビセット非表示 + ロゴクリック無効化。顧客説明 URL として共有可能。

### ✅ Basic Auth (本番のみ)

`middleware.ts` で Vercel env (`BASIC_AUTH_USER` / `BASIC_AUTH_PASS`) を検証。fail-closed。dev はスキップ。

### ✅ SiteFooter (全ページ)

`components/site-footer.tsx` を root layout に統合。`© <year> MILIZE. All rights reserved.` を `text-tiny text-muted-foreground/70 text-left` で控えめに表示。コンテンツ幅 (`max-w-5xl mx-auto`) 内の左端。

### ✅ Chillax フォント (Fontshare CDN)

`@font-face` で直接定義 (Medium 500 単体ロード):
- `size-adjust: 120%` で英数字が自動 120% 拡大
- `unicode-range` で Latin / 記号限定 → 日本語は Noto Sans JP fallback
- `font-synthesis: none` で faux-bold 防止 → 常に Medium で描画
- `@layer base` で h1-h4 に自動適用
- `font-chillax` Tailwind utility で明示適用も可能

`src` URL は Fontshare の公開 CDN ハッシュ:
```
https://cdn.fontshare.com/wf/XASL35KKT35X3ACCBCOQKKABSR6AT3FX/6MU5BWUUPHCFUHM2F3E3QPQGKXCVBUOO/WZY5PMNTII6NKOB2TTIAX7QVAWMSY2DQ.woff2
```

将来 Fontshare 側で URL が変更されると壊れる。その場合は `https://api.fontshare.com/v2/css?f[]=chillax@500&display=swap` をブラウザで開いて新 URL を取得して差し替える。

### ✅ 日本語の改行制御 (`JpText`)

`components/jp-text.tsx`: 「、」「。」「！」「？」直後で文字列を分割し、各セグメントを `<span className="inline-block">` で包む。ブラウザが折り返す時に意味のかたまり単位で改行される。全 Hero h1 + 全 SectionHeading.title に適用。

### ✅ /guidelines の充実

**汎用 `/guidelines`** には以下が並ぶ:
1. Hero
2. **Workflow** (新規) — Dify 風 4 ステップ曲線フロー
3. **Architecture** (新規) — 4 レイヤー + file tree + 技術スタック
4. **Pipeline** — 3 グループ構造 (UI/UX / 🤝 UI/UX+Dev / Dev) + テナントごとのカスタマイズカード
5. Principles (4 設計原則)
6. Tokens (セマンティック swatch)
7. Typography (8 段スケール)
8. Accessibility
9. Components
10. Theme & Responsive
11. BrandSatellites (テナント案内)
12. Footer

各セクションの `<SectionHeading>` に **読み手バッジ** (`🎨 デザイナー向け` / `💻 開発者向け` / `🤝 両者向け`) を pill 形で表示。

**テナント `/<tenant>/guidelines`** には:
1. Hero
2. Brand Pillars (4 つの柱)
3. Color (5 スケール ScaleBlock + Tailwind マッピング表 + テナント生スケール直接アクセス + コードスニペット 6 種)
4. Buttons (6 種のボタン + 1 画面 1 つ規律)
5. Typography
6. Accessibility
7. Shape (Radius & Shadow)
8. Voice & Content
9. Footer

### ✅ TOP の OverviewSection

`components/overview-section.tsx` を共有化、3 つの TOP (汎用 / xxx / td-financial) で利用。

3 グループ並列構造 (PipelineStep 4 ステップは廃止、RoleGroup に統合):
- 🎨 UI/UX (デザイナーが触る) — Figma Variables
- 🤝 UI/UX + Dev (両者をつなぐ中間層) — globals.css + Tailwind utility
- 💻 Dev (開発者が触る) — React component

各 group に: アイコン + who の pill / タイトル / やること / 触るファイル。番号 (01-04) は削除 (TOP は並列の役割表示なので)。

### ✅ 汎用 TOP の TenantsSection

T&D カードを XXX より左に配置 (左上)。各カードのタイトル冒頭に **3 色ドット** (`BrandDots`) を真円で表示:
- T&D: Navy ● + Red ● + Blue ●
- XXX: Teal ● + Cyan ● + Teal mid ●

`size-3` の円 + 薄い ring で背景境界、`aria-label` でアクセシビリティ対応。

### ✅ レイアウト / タイポ調整

- セクション間スペーシング: `mt-30` (120px)
- h2 サイズ: `text-[1.8rem]` (28.8px = h2 の 120%)
- h1 に `leading-tight` (折り返し時の行間を 80% に)
- `--text-h7: 1.2rem` (19.2px = h2 の 80%)
- 中央寄せ (`mx-auto max-w-5xl` / `max-w-[1400px]` / `max-w-[1700px]` for windows)

---

## 6. 次のステップ (優先度順)

### Priority 2 — 顧客ブランド色の自動抽出スキル

**スキル: `/init-brand-tokens`**

入力: 顧客サイト URL、または PDF / PNG (ブランドガイドライン)

実行内容:
1. Claude in Chrome で顧客サイトをレンダリング → スクリーンショット + 計算後 CSS
2. CSS の頻出色 + ロゴ画像から k-means でパレット抽出
3. Claude vision で「primary / secondary / button / cta / neutral」のロール推論
4. `brand-palette.json` を生成
5. 人間レビュー用に Markdown サマリ (色見本付き) 出力
6. 承認後、`components/<tenant>/tokens.css` の 4 スケールに書き込み

### Priority 3 — Claude Design 出力の取り込みスキル

**スキル: `/import-claude-design`**

入力: Claude Design からエクスポートした handoff バンドル (ZIP または share URL)

実行内容:
1. バンドルを解析し、ページ単位に分割
2. テナント名を指定された場合、`app/<tenant>/<page>/` に配置
3. `tokens.css` との衝突がないかチェック (Claude Design 側のトークン名と本リポジトリのトークン名のマッピング)
4. import 文の解決 (`@/components/ui/*` のパスに置き換え)
5. `iphone-frame` や `canvas-grid` で wrap が必要なら自動で挿入
6. 結果サマリを Markdown で出力

### Priority 4 — Figma Variables との同期スキル

**スキル: `/sync-figma-tokens`**

入力: Figma file URL (Master-Components ファイル)

実行内容:
1. Figma MCP で Variables を取得
2. `app/globals.css` の CSS Variables を更新
3. テナントごとの `tokens.css` も該当部分を更新
4. 差分 diff を出力

### Priority 5 — Figma 納品ファイル生成スキル ★契約対応の本命★

**スキル: `/export-to-figma`**

UI/UX 納品契約で Figma ファイルが要求されるケースに対応。

入力: テナント名、Figma File URL (新規 or 既存)

実行内容:
1. Figma file 作成 or 既存ファイル指定
2. `app/globals.css` を読み取り、Figma Variables を一括生成 (162 colors + 13 sizes + 4 テナント色スケール)
3. `components/ui/*` を読み取り、Master Components として投入 (29 個 + テナント拡張分)
4. テナント配下のページ (`app/<tenant>/*/page.tsx`) を Frame として配置
5. プロトタイプ接続 (画面間リンクを Figma の Interactive Prototype として張る)
6. 完成レポート出力

精度担保: html.to.design との visual diff で初回 1〜2 納品で調整、以降は安定運用。

### Priority 6 (中長期) — GitHub Organization への移管

現在は `uchida-milize/neutral-base` (個人アカウント = dev/検証スペース)。本番運用の目処が立ったら `design-milize` のような Organization に移管予定。

1. https://github.com/organizations/new で新 Org を作成 (Plan: Free でOK)
2. 既存リポジトリの Settings → Danger Zone → **Transfer ownership** で Org に転送
3. ローカルの remote URL を更新
4. Vercel-GitHub Integration の追従確認
5. HANDOFF.md / DEPLOY.md の参照を更新

### Priority 7 (中長期) — ガバナンスの整備

- Branch protection rules: `main` への直接 push を禁止 → PR 必須化
- CODEOWNERS: ファイル別レビュアー自動アサイン
- GitHub Actions: テスト・lint・PR ごとの preview deploy 自動化
- 顧客別リポジトリ戦略: `design-milize/neutral-base` (基盤) と `design-milize/customer-aaa` (顧客固有) の派生方針

---

## 7. 引き継ぎ事項・既知の事項

### 環境

- macOS Sonoma (おそらく)
- Mac には `gh` (GitHub CLI), `git`, Node.js, Homebrew, pnpm v11 がインストール済み
- GoogleDrive デスクトップアプリで `~/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload` が同期マウント

### Cowork コネクタ

設定済み: Design プラグイン (Figma, Slack, Notion, Atlassian 等のコネクタ含む)、Figma プラグイン

未設定 (将来必要になりそう): GitHub MCP (PR コメント・Issue 操作したい場合)

### 過去にハマったポイント (累積)

1. **Cowork サンドボックスから Vercel API がブロック** → GitHub Integration 経由で迂回
2. **GoogleDrive FUSE の `rm` 制限** → `mcp__cowork__allow_cowork_file_delete` ツールで削除許可を取得
3. **`next/font/google` がサンドボックスから到達不可** → `geist` パッケージでセルフホスト
4. **lucide-react v1.16.0 という存在しないバージョン** → v0.474.0 に修正済み
5. **PAT がチャット履歴に露出** → `gh auth login` ベースに切り替え、Cowork に PAT を渡さない運用に
6. **Vercel Hobby が non-team-member commit を拒否** → ローカル git config を `うちだ <tuchida@milize.co.jp>` に設定
7. **pnpm v11 で sharp / unrs-resolver のビルドスクリプトが拒否される** → `pnpm-workspace.yaml` の `allowBuilds` に追加
8. **複数行 git commit メッセージで terminal が止まったように見える** → 1 行メッセージで実行
9. **Bash heredoc 内のバックティック / バックスラッシュエスケープ問題** → クォート付き heredoc (`<<'EOF'`) + 環境変数渡しで解決
10. **Tailwind v4 の utility 公開** → `@theme inline` ブロック内に変数定義する必要がある (`:root` 内では公開されない)
11. **flex-col の body 内で `mx-auto max-w-5xl` の左寄せ動作が不安定** → footer は `w-full` の外殻 + 内側 `<div className="mx-auto max-w-5xl">` の二段構造に
12. **Chillax フォント URL がハッシュベースで予測不可** → ブラウザで `api.fontshare.com/v2/css?f[]=chillax@500` を開いて取得

### 確定済みの運用ルール

- **Cowork は編集のみ、git は手動** (Cowork からは push しない)
- **テナント追加**: `./scripts/new-tenant.sh <name>` → `tokens.css` の色を手動編集 → commit/push
- **顧客向け URL**: `https://neutral-base.vercel.app/<tenant>/<page>?focus=1` で共有 (ナビ非表示モード)
- **Basic Auth**: Vercel env で `BASIC_AUTH_USER` / `BASIC_AUTH_PASS` を設定済み
- **複数顧客並行運用**: `app/<tenant>/` ディレクトリと `.<tenant>-scope` クラスで完全独立

---

## 8. 次のチャットで Cowork に伝える言葉 (テンプレ)

新しい Cowork チャットを開いて、このファイルを添付した上で:

> 「`HANDOFF.md` を読んでください。Priority 2 (`/init-brand-tokens` スキル) の設計から始めたいです。サンプル顧客サイト URL を渡すので、ブランド色抽出を試したいです。」

あるいは:

> 「`HANDOFF.md` を読んでから、新規テナント `acme` を追加して、ブランドカラーを 〇〇〇 / △△△ / □□□ に設定したいです。」

あるいは:

> 「`HANDOFF.md` を読んでください。Priority 5 (`/export-to-figma`) の Figma MCP 連携を試したいです。」

このように Priority 番号 + やりたい作業を伝えると Cowork が文脈を即座に把握できます。
