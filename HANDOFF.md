# Handoff — 汎用 + テナント別デザインシステム × 顧客 UI/UX 構築フロー

最終更新: 2026年6月15日 (TD 組込1.3 Vercel デプロイ修正完了。最新はセクション 13 参照。なお Claude Design の取り込みは単一ファイル版 `kumikomi.html` を正とする — §11.2)

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
| ローカル作業フォルダ | `~/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base` |

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

### タイポグラフィ階層 (Phase 2 更新済み — 2 スケール統一)

**Display スケール** (LP / Hero 専用):

| トークン | px | 用途 |
|---|---|---|
| `text-display-1` | 56px | ランディングのキャッチ |
| `text-display-2` | 48px | ヒーロー見出し |
| `text-display-3` | 40px | セクション見出し (大) |
| `text-display-4` | 32px | ページタイトル |

**UI Heading スケール** (画面 / モバイル 汎用):

| トークン | px | 用途 |
|---|---|---|
| `text-h1` | 34px | 画面内最大見出し |
| `text-h2` | 28px | セクション見出し |
| `text-h3` | 24px | カードタイトル / サブセクション |
| `text-h4` | 20px | 小見出し |
| `text-h5` | 18px | ラベル大 |
| `text-h6` | 16px | ラベル / Body LG と同サイズ |
| `text-body-lg` | 16px | 本文 (リード) |
| `text-body` | 14px | 本文 (標準) |
| `text-caption` | 12px | 補助・タグ |
| `text-tiny` | 10px | メタ情報 |

> ⚠️ `text-h7` / `text-[1.8rem]` / `text-cd-h*` は **廃止済み**。旧称を書いた JSX は Phase 2 で全置換済み。

セクション間スペーシング: `mt-30` (120px)。Hero h1 に `leading-tight` で 2 行以上の折り返し時の行間を約 80% に。

`JpText` ヘルパー (`components/jp-text.tsx`) で「、」「。」「！」「？」直後で意味のかたまり単位の改行を実現。

---

## 3. ファイル構造の概要

```
neutral-base/
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
cd ~/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base
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

> **✅ 2026-06-12 Phase 3 (初回セットアップ) 完了**: Claude Code + Figma MCP で Figma ファイルに `Color` コレクションを作成。5 テナント × 40 変数 = 200 セル、WEB コード構文 (`var()` ラッパー) で登録済み。詳細は §12 参照。

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

---

## 9. セッションログ

### 2026-05-28 (午後)

最初は **Priority 2 `/init-brand-tokens` スキルの設計**として開始したが、お客様提供の `組込申込画面.xlsx` が「ブランド規定書」ではなく「申込画面の項目仕様書 + 埋め込みモック画像」だったため、スコープを **「theo-tdf テナントを実画面アセットで一気に構築」+「全テナントの色反映の自動化」** にピボットして完走。

#### 9.1 新規テナント `theo-tdf` 構築

**概要**: 「THEO × T&Dファイナンシャル生命」の組込申込フローを実画面ベースで実装。

| 項目 | 内容 |
|---|---|
| URL | `/theo-tdf/*` |
| 用途 | THEO「つみたて安心ほけん」申込フロー (LP → 情報入力 → シミュレーション → メアド → カード → 注意事項 → 完了 / 全 7 画面) |
| 一次ソース | `uploads/組込申込画面.xlsx` Sheet1「汎用_画面案」の埋め込み画像 22 個 → ユニーク 10 個に重複排除 → 申込フロー 7 画面 + ステップインジケータ部品を特定 |
| アセット配置 | `public/assets/theo-tdf/screens/01-lp.png` 〜 `07-complete.png` + `part-step-indicator.png` |

**画面表示の仕組み**: `components/theo-tdf/flow-screens.tsx` を 1248 行 → 約 115 行にスリム化。`ScreenImg` という単一コンポーネントが `<img>` を 375px viewport に width:100% で流し込み、画面下部 88px に透明な onNext ホットゾーン、左上 80×64px に透明な onBack ホットゾーンを重ねる。FLOW 配列 API は維持しているので `flow-prototype.tsx` (iPhone フレーム) は無改修で動作。

**将来の置き換え経路**: Claude Design 等で TSX 化された画面が降ってきたら `FLOW.map(...)` の `Component` を `ScreenImg` から本物の `<RealScreen />` に差し替えるだけで切替可能。画面単位の段階移行も可能。

#### 9.2 theo-tdf カラー (お客様指定 + 同色相スケール)

| トークン | アンカー | 役割 |
|---|---|---|
| `--primary-color-500` | `#065fe3` | Ink Blue (ブランド主要色 / ヘッダー / sidebar) |
| `--secondary-color-500` | `#ff748d` | Coral (アクセント / 重要バッジ / リンク) |
| `--button-color-500` | `#007dff` | 明るい THEO Blue (filled CTA / シミュレーション画面ボタン) |
| `--cta-color-500` | `#ff2d2d` | 強い純赤 (申込確定ボタン、1 画面 1 つ) |

**スケール生成ロジック (重要)**: 9 段階 (10/50/100/200/300/400/500/600/700) を「**H と S は anchor の値に完全固定、L だけアンカー相対に補間**」で生成:

```python
# t は「anchor → 白 (正) / anchor → 黒 (負)」への補間比率
ladder = {
    "10":  +0.92,  "50":  +0.80,  "100": +0.62,
    "200": +0.42,  "300": +0.23,  "400": +0.08,
    "500":  0.00,                                # anchor そのもの
    "600": -0.18,  "700": -0.42,
}
# L_new = L_a + (1 - L_a) * t   (t >= 0 のとき、白に向かう)
# L_new = L_a * (1 + t)         (t < 0  のとき、黒に向かう)
# H と S は anchor 値で固定 → 完全に同色相のトーン違い
```

これにより、明るい anchor (例: secondary `#ff748d` の L=72.7%) でも階調が逆転しない単調性 (10 < 500 < 700) を保証。H と S は sRGB 量子化丸めで ±0.5° / ±1% 以内のドリフトのみ。

#### 9.3 GeistMono → Inter のグローバル置換

**動機**: GeistMono の等幅見た目を現代的な Inter のクリーンな見た目に統一したい (お客様要望)。

**実装の要点**:
- `app/layout.tsx`: `GeistMono` import を削除し、`Inter from "next/font/google"` で読み込み (variable `--font-inter`)
- `app/globals.css`: `--font-mono: var(--font-inter);` に **変数名は維持しつつ実体だけ差し替え**
- これにより既存の `font-mono` Tailwind utility や `className="font-mono"` を 1 箇所も書き換えずに、全テナント・全ページの "コード/識別子のラベル" が Inter で描画される
- 4 テナント (`xxx`, `aaa`, `td-financial`, `theo-tdf`) の Guidelines ページの Typography セクションの「Geist Mono」表記を「Inter」に更新

**注意**: Inter は厳密には等幅ではない。本リポジトリでは `font-mono` を「強調された等幅風表記」というより「コード/識別子の意味的ラベル」として使っているため、Inter で問題なし。等幅性が必要な箇所が将来出てきた場合は `--font-mono` を別変数 (例: `--font-truly-mono`) に分けて両立できる構造になっている。

#### 9.4 Guidelines ページの自動色反映 (★最重要★)

**問題**: 4 テナントの `guidelines/page.tsx` が `ScaleBlock`/`ButtonRow` にハードコードした hex 値を props で渡していたため、`tokens.css` を更新しても表示が古いまま (4 テナント × 5 スケール × 9 段 = 180 箇所を手動更新する必要があった)。

**解決**: 2 つの共通コンポーネントを新設して全テナントで使い回し:

`components/guidelines/auto-color-scale.tsx`:
- `<AutoColorScale prefix="primary-color" title="..." subtitle="..." />` の形で使用
- 各 swatch は `background: var(--{prefix}-{step})` で描画
- マウント後に `getComputedStyle()` で実際の RGB を取得 → hex 文字列にして表示
- 文字色 (白 / 黒) は背景の相対輝度から自動判定 (WCAG 相当)
- light/dark テーマ切替に `MutationObserver` で追従
- `<AutoWarmScale />` は warm 4 段 (50/100/200/300) 専用エイリアス

`components/guidelines/auto-button-grid.tsx`:
- 5 種類のボタン (cta / primary / neutral / outline / destructive) を内包
- すべて `bg-[color:var(--cta-color-500)]` 形式の CSS var 経由
- どのテナントから呼び出しても、その scope の tokens.css が自動反映される
- `<AutoButtonGrid />` 1 行で 5 種全てが揃う

**4 テナントへの一括反映 (Python スクリプトで自動置換)**:
- `function ScaleBlock` (45 行) と `function ButtonRow` (26 行) の local 定義を全テナントから削除
- 5 ScaleBlock 呼び出し → `<AutoColorScale>` × 4 + `<AutoWarmScale>` × 1
- 5 ButtonRow 呼び出し (inline hardcoded hex 含む) → `<AutoButtonGrid />` 1 行
- 削除した hardcoded hex (例: theo-tdf に xxx の Teal `#0f766e` が残っていた) も同時に解消

**今後の運用**: `new-tenant.sh` は `xxx` を雛形にコピーするため、**今後の新規テナントは自動で AutoColorScale + AutoButtonGrid を継承**。テナントごとのカスタマイズは `components/<tenant>/tokens.css` のアンカー値だけ書き換えれば、Guidelines ページの hex 表示・swatch・5 種ボタン全てが追従する。

#### 9.5 汎用 TOP「ブランド別の運用」のデータ駆動化 + 自動色反映

**問題**: `app/page.tsx` の `TenantsSection` が各テナントカードを JSX でハードコード (色も hex 直書き)。新規テナント追加時に手動編集が必要だった。

**解決**:
- 新コンポーネント `components/auto-tenant-card.tsx` を作成 (Client Component)
- `<div ref={ref} className={`${id}-scope`}>` で tenant の scope を被せ、内側で `getComputedStyle()` から `--primary-color-500` / `--secondary-color-500` / `--button-color-500` / `--cta-color-500` を取得 → hex を本文に動的表示
- `BrandDots` も `style={{ background: "var(--primary-color-500)" }}` 等の CSS var ベースに → scope に応じて色が自動切替
- `app/page.tsx` の `TenantsSection` を `TENANT_CARDS: TenantCardData[]` 配列 + `.map(...)` 構造に作り直し
- `app/layout.tsx` で **全テナントの tokens.css を root import** (各 tokens は `.<tenant>-scope` でスコープ済みなので global import しても他に漏れない)

**`scripts/new-tenant.sh` を 4 step → 6 step に拡張**:
- **Step 5 (新規)**: `app/page.tsx` の `TENANT_CARDS` 配列に新エントリを自動挿入 (アンカー: `// 新規テナントはここに追加 (new-tenant.sh で自動挿入)` の直前)
- **Step 6 (新規)**: `app/layout.tsx` に `import "@/components/<tenant>/tokens.css";` を自動挿入 (アンカー: `// 新規テナントの tokens.css はここに追加` の直前)
- 既存エントリの除去 (--force 想定 / 冪等性) も実装
- 動作確認: dry-run + 実テナント生成 (`demo-acme` で試験 → 全 ステップ正常 → 完全除去まで成功)

**今後の効果**: `./scripts/new-tenant.sh <name>` 1 コマンドで:
1. `app/<tenant>/` + `components/<tenant>/` 生成 (既存)
2. `components/site-header.tsx` のヘッダーナビ追加 (既存)
3. **`app/page.tsx` の「ブランド別の運用」カード追加 (新規)**
4. **`app/layout.tsx` への tokens.css グローバル import 追加 (新規)**

すべて自動。お客様は `components/<tenant>/tokens.css` の 4 つのアンカー色だけ書き換えれば、汎用 TOP + Guidelines + ボタン展示が全自動で正しい色になる。

#### 9.6 Hero (ホーム TOP) のコピー差し替え

「Figma Variables から生成された 162 色 + 13 サイズのトークンを単一情報源として、shadcn/ui (new-york) を Tailwind v4 で組み立てた汎用デザインシステム。各導入先 (XXX など) はここを土台に、`--secondary-color-*` と `--primary-color-*` の 2 系統 + ロゴだけを差し替えて運用します。」(技術スタック中心)

→ 「色とロゴを差し替えるだけで、顧客ごとの UI/UX を同じ品質で立ち上げられる、保険・金融プロダクト向けの共通基盤です。デザイナーと開発者が同じトークンを見ながら設計から実装まで歩調を合わせ、ワイヤーフレームから顧客レビュー用 URL までを最短数日で繋ぎます。アクセシビリティと運用ルールを土台に組み込んであるので、ブランドが増えても判断のブレが生まれません。」(メリット中心)

文字数はほぼ同等 (~140 字)。`<JpText>` で囲んで「、」「。」で意味の塊単位で改行されるように。

#### 9.7 Workflow 01 ノードの入力ソース拡張

`components/flow-diagram.tsx` の Step 01 (Dify 風 4 ノード曲線フロー図の先頭) を:

- 旧: 「Wireframe / Design 入力」「Google AI Studio または Figma → MCP」(2 経路のみ)
- 新: 「**デザイン入力**」「**Figma / AI Studio / Excel 仕様書 / VI 資料**」(**4 経路**)

`desc` も 4 経路を網羅: Figma のデザインを MCP 経由 (Variables / Components ごと)、Google AI Studio のワイヤーフレーム、**Excel 仕様書 (画面項目 + 埋め込みモック画像)**、**VI 資料 / ブランドガイド PDF (色・ロゴ・タイポ規定)** のいずれか、または複数を組み合わせて取り込み。

→ これは 9.1 で実際に体験した「Excel 仕様書からの取り込み」と、Priority 2 `/init-brand-tokens` で扱う予定の「VI 資料 / PDF からの色抽出」を Workflow 図にも反映した形。

#### 9.8 本日新規追加・変更されたファイル一覧

**新規ファイル**:
- `app/theo-tdf/` (テナントツリー全体、`new-tenant.sh` で生成)
- `components/theo-tdf/` (同上)
- `components/theo-tdf/tokens.css` (theo-tdf 色トークン)
- `components/theo-tdf/flow-meta.ts` (申込フロー 7 ステップ メタ)
- `components/theo-tdf/flow-screens.tsx` (画像ベース ScreenImg、約 115 行)
- `public/assets/theo-tdf/screens/` (申込フロー 8 PNG)
- `components/guidelines/auto-color-scale.tsx` (自動色反映 ScaleBlock)
- `components/guidelines/auto-button-grid.tsx` (自動色反映 5 種ボタン)
- `components/auto-tenant-card.tsx` (汎用 TOP の自動色反映カード)

**変更ファイル**:
- `app/layout.tsx` (Inter 導入 + 全テナント tokens.css の root import)
- `app/globals.css` (`--font-mono: var(--font-inter)`)
- `app/page.tsx` (TenantsSection データ駆動化 + Hero コピー差し替え)
- `app/{xxx,aaa,td-financial,theo-tdf}/guidelines/page.tsx` (AutoColorScale / AutoButtonGrid 採用 + フォント表記更新)
- `components/site-header.tsx` (theo-tdf エントリ追加)
- `components/flow-diagram.tsx` (Step 01 を 4 入力経路に拡張)
- `scripts/new-tenant.sh` (4 step → 6 step、Step 5/6 で page.tsx と layout.tsx を自動編集)

#### 9.9 既知のハマりポイント (今日の追加分)

13. **GeistMono → Inter のフォント変数差し替え**: `--font-mono` の変数名を維持して中身だけ差し替えると、既存の `font-mono` utility / className を一切書き換えずにグローバル切替できる。命名のリネームより「変数の参照先を変える」方が影響範囲が狭くて済む。
14. **`next/font/google` Inter のビルド時依存**: 初回ビルドで Google Fonts からダウンロードするため**ネットワークが必要**。Cowork サンドボックスでは `pnpm build` が SWC パッケージ取得段階で失敗するが、お客様の Mac ローカルでは問題なくビルドできる。`tsc --noEmit` での型検証は Cowork でも通る。
15. **テナントごとの `.<tenant>-scope` CSS を root layout で global import しても安全**: 各 tokens.css は `.<tenant>-scope { ... }` のスコープ付きセレクタなので、グローバル import しても他のスタイルに漏れない。これにより汎用 TOP の `AutoTenantCard` が `getComputedStyle()` で CSS var を解決できる。
16. **`.git/index.lock` 残留問題の解決手順**: GoogleDrive FUSE で git 操作が中断されると 0 バイトの `index.lock` が残る。Cowork からは `rm` が `Operation not permitted` で拒否されるので、`mcp__cowork__allow_cowork_file_delete` で削除許可を取得してから `rm -f .git/index.lock` を実行する。お客様のターミナルからは直接 `rm -f .git/index.lock` で削除可能。
17. **HSL ベースのスケール生成は anchor 相対補間で書く**: 固定 L ラダー (10:91%, 50:85%, ...) は dark anchor (T&D Navy #003388 L=27%) では機能するが、light anchor (theo-tdf secondary #ff748d L=72.7%) では階調が逆転する。「anchor → 白 / anchor → 黒」への補間 t で書けばどの anchor でも単調性が保証される。S と H は固定で OK (sRGB 量子化丸めで ±1% 程度のドリフトのみ、肉眼では同色相)。

#### 9.10 次回セッションでの作業候補

セクション 6「次のステップ」の優先度は基本的にそのまま。本日の作業の派生として:

1. **Priority 2 `/init-brand-tokens` の本実装**: 本日は手動で theo-tdf の色を抽出 → tokens.css に反映したが、これをスキル化する。入力タイプ 5 系統 ((A) ブランド規定型 xlsx / (B) 画面仕様型 xlsx / (C) URL / (D) PDF / (E) Figma / (F) AI Studio 画像) を auto-detect dispatcher で分岐。MVP は (B) ブランチで `組込申込画面.xlsx` をテストケースに。
2. **Priority 3 `/import-claude-design` の設計**: Claude Design 出力 zip を `app/<tenant>/<page>/` に自動配置するスキル。本日構築した theo-tdf の flow-screens.tsx 構造 (ScreenImg + FLOW 配列) を真似ると、画像ベース → React ベースへの段階移行も同じパターンで扱える。
3. **theo-tdf の TSX 化**: 現在は `<img>` を iPhone フレームに流し込んでいるだけ。Claude Design に投げて React コンポーネント化すれば、CTA ボタンや入力欄を「本物の」UI に置き換えられる (ホットゾーンの onNext/onBack も実 button に統合できる)。

---

## 10. Claude Design に渡す仕様伝達テンプレ

外部の Claude Design (claude.ai/design) で prototype を作る前に、以下の prompt を最初に貼っておくことで、戻り後の Cowork 側統合コストをほぼゼロにできる。本リポジトリの design system を Claude Design が事前に理解した状態で出力するため、独自の color palette や font scale を新規定義することがなくなる。

### 10.1 使い方

新しい Claude Design セッションを開いて、最初に以下の prompt を一度貼る:

> 「以下が既存の Design System の仕様です。新規の color token / font / text scale は定義せず、これらの Tailwind utility 名をそのまま使ってください。」

そして以下のテンプレを貼り付ける。続いて、お客様の作りたい画面の要件を続けて投入する。

### 10.2 テンプレ本文 (コピペ用)

```
このリポジトリは Next.js 16 + Tailwind v4 + shadcn/ui (new-york style) の構成で、
デザイントークンは以下の Tailwind utility 名で参照します。新規 prototype を作る
場合、必ずこれらの class 名を使ってください (独自の color palette / font / text
scale は定義しないでください)。

== セマンティック色 (shadcn 経由、light/dark で自動反転) ==
  bg-background      ページ背景
  bg-card            カード背景
  bg-popover         ポップオーバー背景
  bg-muted           muted な surface
  bg-accent          ハイライト surface
  bg-destructive     破壊的アクション
  text-foreground    主要テキスト
  text-muted-foreground   弱めテキスト
  text-card-foreground    カード内テキスト
  border-border      標準罫線
  ring-ring          フォーカスリング

== ブランド色スケール (テナント tokens.css 経由、テナント切替時は色だけ変わる) ==
  primary-color-{10,50,100,200,300,400,500,600,700}    コーポレートカラー1
  secondary-color-{...}                                  コーポレートカラー2
  button-color-{...}                                     通常 filled ボタン
  cta-color-{...}                                        申込/前進 CTA (1 画面 1 つ)
  warm-{50,100,200,300}                                  無彩色 neutral 背景

  ※ Tailwind utility 形式の bg-primary-500 / text-cta-700 / border-button-300
    なども全て利用可能です (@theme inline で alias 済み)。

== タイポ (Figma Variables 由来、汎用デザインシステム用の大きめスケール) ==
  text-h1 (56px), text-h2 (48px), text-h3 (40px), text-h4 (32px),
  text-h5 (24px), text-h6 (20px), text-h7 (19.2px),
  text-body-lg (16px), text-body (14px), text-caption (12px), text-tiny (10px)

== タイポ (Claude Design 出力用のコンパクトスケール、モバイル画面密度向け) ==
  text-cd-h2 (34px), text-cd-h3 (28px), text-cd-h4 (24px),
  text-cd-h5 (20px), text-cd-h6 (18px), text-cd-h7 (16px)
  ※ 申込画面のような密度のあるモバイル UI ではこちらを使用。

== フォント ==
  font-jp      Zen Kaku Gothic New + Hiragino Kaku Gothic ProN + Yu Gothic
  font-en      Geist (Latin / 数字)
  font-mono    Inter (= 旧 Geist Mono の置き換え、コード/識別子ラベル用)
  font-chillax Chillax (見出しの Latin 用、デザインシステム説明ページのみ)

== ダーク対応 (任意) ==
  next-themes で <html class="dark"> を切り替えます。
  semantic 色 (bg-background, text-foreground 等) は .dark 時に自動反転されます。
  画面側はクラス名を書くだけで dark mode 対応になります。
  ダーク独自の細かい色 (例: bg-warm-100 を dark で #1b212b にしたい) が必要な場合は、
  生 hex を埋め込まず、JSON で「dark のとき bg-warm-100 → #1b212b」のような
  指定リストを別途渡してください。Cowork 側で globals.css に転記します。

== 🔴 絶対ルール: shadcn primitives を必ず使う (独自 atom を新規定義しない) ==

このリポジトリには shadcn/ui の React コンポーネントが完備されています。
新規 prototype を生成する時、**以下を独自に再実装することは禁止**します。
必ず shadcn の primitive を import して使ってください。

理由: Cowork 統合後の design system は以下の 3 系統が一致している必要があります。
  1. リポジトリ内の React component (shadcn primitives)
  2. Figma の Master Component Library
  3. デザイナーの認識 (= ガイドライン上の名前)

これらが一致して初めて「Vercel ↔ Figma の双方向同期」「Figma 納品時の identity 保持」
が機能します。独自 atom を新規定義すると、この 3 系統の対応関係が壊れ、後で MCP 経由の
Figma 書き戻しで Component Instance ではなく "detached frame" になります (= 致命的)。

【独自定義禁止 (= 必ず shadcn を使う)】

  ❌ function Btn(...) {} を新規定義  → ✅ import { Button } from "@/components/ui/button"
  ❌ function Field(...) {} を新規定義 → ✅ <Label> + <Input> を組み合わせる
  ❌ function Select(...) {} を新規定義 → ✅ shadcn <Select> + <SelectTrigger> + <SelectContent> + <SelectItem>
  ❌ function GroupCard(...) {} を新規定義 → ✅ <Card> + <CardHeader> + <CardTitle> + <CardContent>
  ❌ function Badge(...) {} を新規定義  → ✅ shadcn <Badge variant="...">
  ❌ function Checkbox / Radio / Switch を新規定義 → ✅ shadcn の対応 primitive

【shadcn と Claude Design 独自 atom の対応表 (生成前に必ず参照)】

  Claude Design がやりがちな独自定義  →  代わりに使うべき shadcn / 標準パターン
  ─────────────────────────────────────────────────────────────────────
  Btn                                  →  Button (variant: default / destructive /
                                          outline / secondary / ghost / link)
  Btn (kind="cta")                     →  Button + className="bg-cta-500 hover:bg-cta-600
                                          text-white" (shadcn variant で表現できない時は
                                          className 拡張、独自 wrapper を作らない)
  Field (label + input + hint)         →  <Label htmlFor="x"> + <Input id="x"> +
                                          <p className="text-caption text-muted-foreground">
                                          (3 要素を 1 コンポーネントに包まない)
  LockedField                          →  <Label> + <Input disabled value="..."> + Lock icon
  Select (options array)               →  <Select><SelectTrigger><SelectValue/></SelectTrigger>
                                          <SelectContent>{options.map(o => <SelectItem>)}
                                          </SelectContent></Select>
  GroupCard (title + icon + children)  →  <Card><CardHeader><CardTitle>title</CardTitle>
                                          </CardHeader><CardContent>{children}</CardContent></Card>
  Badge (tone="secondary"/"primary")   →  <Badge variant="secondary"> / <Badge variant="default">
  Row (k:v pair)                       →  単純な <div className="flex justify-between">
                                          (コンポーネント化不要、inline で書く)
  SectionLabel (uppercase eyebrow)     →  <p className="text-caption uppercase tracking-[0.18em]
                                          text-primary"> (inline、コンポーネント化不要)
  PH (placeholder)                     →  <div className="wf-ph">…</div>
                                          (globals.css の utility 使用、inline)

【独自定義が許される唯一の例外】

  shadcn に直接対応する primitive が無い、かつ複数画面で再利用する場合のみ。
  例: AppBar (ヘッダー、status bar 含む) / Steps (progress dots) / ActionBar
      (sticky bottom area) / Phone (iPhone frame) などのモバイル UI 特有のもの。
  
  ※ ただし、これらも components/<tenant>/claude-design/ に閉じ込めて
    components/ui/ には**侵入させない**こと (= shadcn ライブラリの purity を守る)。

【shadcn の variant に欲しいものが無い時】

  自作 wrapper を作るのではなく、shadcn の Button に className で拡張する:

  ✅ OK:
    <Button variant="default" className="bg-cta-500 hover:bg-cta-600 text-white">
      申込を確定する
    </Button>

  ❌ NG:
    function CtaButton({ children, ...props }) {
      return <button className="bg-cta-500 ..." {...props}>{children}</button>;
    }
    (= shadcn を経由していないため、Figma 書き戻し時に identity が失われる)

  もし「cta variant を恒久化したい」なら、コード生成時には shadcn <Button> +
  className で表現し、Cowork 側で受け取った後に shadcn の button.tsx の
  variants 設定に追加する (Cowork が判断して行う)。

== shadcn primitives 一覧 (必ずこれを使う) ==

  Button         variants: default / destructive / outline / secondary / ghost / link
  Card           CardHeader, CardTitle, CardDescription, CardContent, CardFooter
  Badge          variants: default / secondary / destructive / outline
  Input, Label, Textarea
  Select         SelectTrigger, SelectValue, SelectContent, SelectItem
  Checkbox, RadioGroup, RadioGroupItem
  Switch
  Table          TableHeader, TableBody, TableRow, TableHead, TableCell
  Tabs           TabsList, TabsTrigger, TabsContent
  Dialog         DialogTrigger, DialogContent, DialogHeader, DialogTitle
  Popover        PopoverTrigger, PopoverContent
  Tooltip        TooltipTrigger, TooltipContent
  Alert          AlertTitle, AlertDescription
  Separator, Avatar, AspectRatio
  Sheet          (bottom sheet / drawer 用)
  ScrollArea, Skeleton, Progress

  ※ アイコンは lucide-react を使ってください
    例: import { ChevronRight, X, Shield } from "lucide-react"
  ※ 上記に無いもの (Accordion / Carousel など) が必要なら、独自定義する前に
    「shadcn の ◯◯ が欲しい」とコメントしてください。Cowork が
    `pnpm dlx shadcn@latest add <component>` で追加します。

== 推奨アンチパターン (= 絶対にやってはいけないこと) ==

  ❌ 自作 Button / Field / Select / Card 等を function 定義する
     → shadcn の primitive を import して使う

  ❌ bg-white / bg-black の直接使用
     → bg-card / bg-background / bg-foreground を

  ❌ text-neutral-{N} / text-gray-{N} の直接使用
     → text-foreground / text-muted-foreground を

  ❌ 独自 hex の埋め込み (bg-[#xxxxxx])
     → 必ず token (bg-primary-500 等) を経由

  ❌ 独自 font-size の埋め込み (text-[14px])
     → text-body / text-h4 等のスケールを (text-cd-h* / text-h7 は廃止済み)

  ❌ shadcn を import せず、見た目だけ似せた独自 <button> を書く
     → 後の Figma 書き戻しで identity が失われるため厳禁

  ❌ icon を SVG で手書き定義する (Ic.chevR = (p) => <svg>...</svg> 等)
     → import { ChevronRight } from "lucide-react" を使う
```

### 10.3 ダーク値が必要な場合の追加情報

ダークモード固有の RGB 値も指定したい場合は、上記テンプレと一緒に以下のような JSON を渡す:

```
このプロトタイプは dark mode 時に以下の RGB 値を使ってください。

{
  "bg-warm-100": "#131820",
  "bg-warm-50":  "#232a36",
  "bg-card":     "#1b212b",
  "border-default": "#2c3441",
  "text-foreground": "#e7ebf1",
  "text-muted-foreground": "#b0b9c6"
}

(Tailwind class 名はそのまま、`dark:` variant で自動で RGB を切替えてください。)
```

### 10.4 反省: 2026-06-03 セッションでの教訓

theo-tdf の Claude Design 取り込みでは、最初に上記テンプレを渡さなかったため:

- Claude Design 側で独自 Tailwind config (`primary`, `secondary`, `button`, `cta`, `warm` の独立スケール) が定義された
- Cowork 側で受け取った後、`@theme inline` に alias を追加 (`--color-primary-{step}` → `--primary-color-{step}`) する作業が発生
- ダークモードは `[data-theme="dark"] [class~="bg-white"]` のような utility class 強制上書き形式 (`!important`) で実装された
- 結果として動作はするが、design system の semantic 層を経由しない「平行レイヤー」になった

幸い、ブランド色 (primary/secondary/button/cta) は alias 経由で tokens.css と接続されており、テナント差し替えは引き続き有効。次回からは §10.2 のテンプレを最初に渡せばこの遠回りを回避できる。

### 10.5 反省 2 件目: コンポーネント identity の喪失 (2026-06-XX)

§10.2 で「shadcn primitives を優先して使ってください」と書いていたが、表現が**弱すぎた**ため:

- Claude Design は独自に `Btn` / `Field` / `Select` / `GroupCard` / `Badge` などの atom を新規定義してしまった
- これらが `components/<tenant>/claude-design/screens.tsx` に閉じ込められた状態となり、shadcn primitives (`Button`, `Input`, `Card` 等) と**並列に存在する「2 セットの component layer」**ができてしまった
- 結果として:
  - Tailwind class / CSS Variable レベルでは見た目が揃っているが
  - 構造的には `Btn` と `Button` が **別物** で、shadcn 経由の lineage が無い
  - 将来 MCP 経由で Figma に書き戻す時、`Btn` は Master Component の Instance ではなく **detached frame** になる (= identity 失う)
  - shadcn の Button を改修しても `Btn` には反映されない (= 二重管理)

#### 対策 (§10.2 で実施済み)

§10.2 のテンプレを以下の方向で強化:
1. 「優先して使ってください」→ 「**絶対に守ってください、独自 atom を新規定義しないでください**」
2. 独自定義禁止リスト (`Btn` / `Field` / `GroupCard` 等) を明示
3. shadcn 代替の **対応マッピング表** を提示
4. shadcn に variant が無い時の対処法 (className 拡張のみ、wrapper 禁止) を明示
5. 理由 (Vercel ↔ Figma の双方向同期、Figma 納品時の identity 保持) を明文化

#### 既存 theo-tdf prototype の扱い

theo-tdf の既存 `screens.tsx` (1125 行) は引き続き運用可能だが、構造的には「独自 atom set + shadcn primitives 」の並列状態。完全統合は HANDOFF.md §6 Priority 5 周辺 (= Phase B コンポーネント差し替え) で実施予定 (お客様要望時に着手)。

> **✅ 2026-06-11 解消済み**: この identity 問題は §11.4「Phase B (shadcn ラッパー化)」で解消しました。共通 atom が shadcn primitives へ委譲するアダプタ層になり、`/theo-tdf/components` のカタログと構造的に一致しています。詳細は §11 を参照。

#### 次回セッション以降の予防策

新規 prototype を Claude Design で作る時、§10.2 (strengthened版) を**毎回最初に**貼ること。これにより:
- ✅ Claude Design の生成コードが shadcn-based になる
- ✅ Cowork 統合時にそのまま使える (= retrofit 作業不要)
- ✅ Figma 書き戻し時に identity 保持が容易になる

---

## 11. セッションログ 2026-06-11 (THEO 組込フロー 1.1〜1.3 取り込み + shadcn ラッパー化)

このセッションは、Claude Design で更新された THEO 組込保険の申込フローを複数回取り込み、最後に「プロトタイプを shadcn に寄せる (Phase B)」までを実施した。

### 11.1 取り込みフローの変遷 (8画面 / 5ステップ構成の確立)

theo-tdf の `/prototype` `/windows` を、Claude Design の最新出力に合わせて段階的に更新:

| 版 | 主な内容 |
|---|---|
| 6画面版 (旧) | プラン選択 / 申込フォーム / 内容確認 / カード入力・確認(外部) / 完了 |
| **8画面 5ステップ版 (現行)** | **商品概要** → プラン選択 → **PINコード認証** → 申込フォーム → 内容確認・お支払い → カード入力・確認(外部) → 完了 |

現行版の主な UI 要素:
- ステッパーは**番号付き円＋連結線**型 (到達済みステップはタップで遷移可能、`STEP_TO_SCREEN` で画面対応)
- ボタン体系: 通常 CTA は**ブルー** (`button-500`)、申込確定など強調は赤の **`danger`** バリアント、高さ `h-16`
- 商品概要: 「3つのプランから選ぶだけ」見出しバンド + 特徴3アイコン + 保険料バンド
- プラン選択: 生年月日の **iOS 風ドラムロール日付ピッカー** (`DateDrumSheet` / `WheelCol`)
- シミュレーター: 選択プランのラベルチップ + 給付予想額テーブル (月払保険料は選択プランの実額、縦書きヘッダ)
- 内容確認: 重要事項 **8項目**アコーディオン (被保険者確認の国籍分岐含む) + クレカ規定アコーディオン
- 完了: ステッパー 5/5 + 「このあとの流れ」(矢印を番号バッジ中央に配置)
- 新規アイコンアセット (`public/assets/theo-tdf/`): `activity-heart-circle.svg` / `graduation-cap.svg` / `hand-holding-heart.svg` / `hero-chart.png` / `info-circle.svg` / `letter-heart-square.svg` / `person-heart.svg` / `logo_theo_insurance_blue.svg`

### 11.2 ★重要★ Claude Design エクスポートの罠: `screens.jsx` が古いキャッシュになる

**症状**: 複数回 (5回) にわたり別々の share URL / zip を取り込んだが、`screens.jsx` がすべて**バイト単位で同一** (md5 一致) で、お客様が編集画面で見ている変更が反映されなかった。

**原因**: このプロジェクトでは、Claude Design の編集が**単一ファイル版 `kumikomi.html` (インライン版) 側に保存**され、分割版 `screens.jsx` は**古いキャッシュのまま取り残されていた**。`screens.jsx` だけを見ていると「変更なし」と誤判定する。

**解決の決め手**: `kumikomi.html` の `<script type="text/babel" data-presets="react">` ブロックを抽出して `screens.jsx` と diff したところ、`kumikomi.html` 側にだけ最新の編集 (アイコン差し替え / マージン / テーブル / 完了画面文言など) が入っていた。

**確定した運用ルール**:
- このプロジェクトは **`kumikomi.html` (単一ファイル版) が真の最新**。取り込みは必ず `kumikomi.html` のインライン JS を基準にする。
- お客様には **「Implement: kumikomi.html」+ zip 添付** の形で渡してもらうのが最も確実 (API 経由 share URL だと古い `screens.jsx` 主体のバンドルになることがある)。
- 取り込み前に必ず **md5 / 行単位で diff** し、本当に差分があるか機械的に確認する。
- → その後お客様が Claude Design 側でプロジェクトの **分割ファイルを最新と同期**する対応を実施。以降は `screens.jsx` ≡ `kumikomi.html` (diff 0) になった。

### 11.3 取り込みの機械化 (`port` 変換スクリプト)

`kumikomi.html` / `screens.jsx` の JSX を repo の `components/theo-tdf/claude-design/screens.tsx` (TSX) へ機械変換する Python スクリプトを使用 (作業用 `/tmp/port.py`、セッション間で揮発するため再生成して使う)。変換内容:
- `"use client"` 付与、UMD React → ESM import
- `text-h{2-7}` → `text-cd-h{2-7}` (Claude Design のコンパクトスケール)
- `src="assets/..."` / `iconSrc="assets/..."` → `/assets/theo-tdf/...`
- `bg-success` → `bg-[color:var(--success)]`
- `el.__bound` 動的プロパティへ型安全キャスト、`useRef(null)` の型付け
- 全 top-level 関数/定数に TS 型 + `export` 付与 (signature 辞書で一括置換)
- ローカル dark toggle 削除 (サイト共通 `ThemeToggle` が `<html data-theme>` を制御)
- `app.jsx` は実質不変のため `app-shell.tsx` (FLOW 定義) は手動同期

検証は毎回 `./node_modules/.bin/tsc --noEmit` + `eslint` + 生hex/旧スケール/旧パス混入の grep チェック。

### 11.4 Phase B: 共通 atom を shadcn primitives にラッパー化 (§10.5 の identity 問題を解消)

**方針 (お客様承認済み)**: 「Atom を shadcn ラッパー化」。screens 側の呼び出し (`<Btn>` 等) は不変のまま、atom の**中身**を `components/ui` の shadcn primitive へ委譲するアダプタ層にした。これにより **Claude Design 再取り込みパイプラインを壊さずに** shadcn の lineage を獲得し、`/theo-tdf/components` のカタログと構造的に一致する。

| 独自 atom | 委譲先 shadcn |
|---|---|
| `Btn` | `<Button>` (kind→variant + ブランド色 className) |
| `Badge` | `<Badge>` (tone→淡色面 className) |
| `Field` | `<Label>` + `<Input>` |
| `LockedField` | `<Label>` + 無効化 `<Input>` |
| `GroupCard` | `<Card>` + `<CardContent>` |

**維持 (shadcn 化しない)**:
- `Select`: ネイティブ `<select>` のまま (Radix Select は controlled/UX が大きく変わり、モバイル WF の意図とずれるため)
- `AppBar` / `Steps` / `Phone` / `ActionBar` / `DateDrumSheet` / `WheelCol` / `PlanCard` / `ExtBar`: shadcn に対応物がないモバイル UI 固有部品 (§10.2 の許容例外)

**重要**: この shadcn 化は **`port` 変換スクリプトに焼き込んだ** (atom 本体を正規表現で丸ごと shadcn ラッパー版に差し替え)。よって**今後 Claude Design から再取り込みしても自動的に shadcn ラッパーが適用される** = 「Claude Design がマスター」運用と shadcn 準拠が両立する。

トレードオフ: atom の**見た目**は今後ラッパー側が支配するため、Claude Design 側で atom 自体を再スタイルしても反映されない (ブランド色は `tokens.css` 経由で従来どおり追従する)。これは shadcn 準拠の意図的な帰結。

### 11.5 本セッションで変更されたファイル

- `components/theo-tdf/claude-design/screens.tsx` — 8画面5ステップ版 + shadcn ラッパー化 (全面更新)
- `components/theo-tdf/claude-design/app-shell.tsx` — FLOW を 8画面5ステップに更新 (商品概要・PIN追加)
- `app/theo-tdf/windows/page.tsx` — 8画面 + 状態バリアント5枚に更新
- `app/theo-tdf/prototype/page.tsx` — メタ情報更新
- `app/globals.css` — `.theo-tdf-cd` に `--success` 変数追加、ダーク時の secondary 罫線追加
- `public/assets/theo-tdf/` — 新規アイコン/図版アセット8点追加

### 11.6 次セッションの作業候補

1. **`/init-brand-tokens` (Priority 2) の本実装** — まだ未着手。
2. **`/import-claude-design` (Priority 3) のスキル化** — 本セッションの `port` 変換ロジックがほぼ仕様。`kumikomi.html` インライン JS 抽出 + TSX 変換 + shadcn ラッパー適用を 1 スキルにまとめる。
3. **`/export-to-figma` (Priority 5)** — atom が shadcn lineage を持ったので、Figma Master Component への書き戻し前提が整った。
4. **`Select` の shadcn 化検討** — 必要なら Radix Select へ移行 (controlled 化が必要)。
5. **`new-tenant.sh` への波及** — theo-tdf の claude-design 構造を雛形化するか検討。

### 11.7 本セッションで判明した運用上の注意 (追加)

18. **Claude Design の分割ファイル (`screens.jsx`) はキャッシュで古くなることがある** → 単一ファイル版 `kumikomi.html` を正とし、取り込み前に md5/行 diff で実差分を必ず確認。zip 添付 + 「Implement: kumikomi.html」が最も確実。
19. **`/tmp` の作業ファイル (port.py 等) はセッション/呼び出し間で揮発する** → 重要な変換ロジックは HANDOFF か repo の `scripts/` に残すべき (現状は本ログに要点を記載)。
20. **shadcn Button/Input/Card は `cn()` で className 後勝ち** → `h-16 md:h-16` のように `md:` 派生も明示しないと、デスクトップ幅でデフォルトサイズに戻る点に注意。

---

## 12. セッションログ 2026-06-12 (Phase 2 デザインシステム正規化 + Phase 3 Figma Variables 初期セットアップ)

### 12.1 Phase 2 実施内容: タイポグラフィスケール統一 + Tailwind 準拠トークン正規化

前セッション (§9) で確定した設計方針に基づき、Python 移行スクリプト (`migrate.py`) を実行して全ファイルを一括変換した。

**タイポグラフィ: 旧 1 スケール → 新 2 スケール体制**

| 旧 | 新 | 備考 |
|---|---|---|
| `text-h1` 56px | `text-display-2` 48px → LP Hero 用 | Hero タイトルは display スケールへ |
| `text-h2` 48px | `text-display-2` | |
| `text-h3` 40px | `text-display-3` | |
| `text-h4` 32px | `text-display-4` | |
| `text-h5` 24px | `text-h3` 24px | UI スケールで継続 |
| `text-h6` 20px | `text-h4` 20px | |
| `text-h7` 19.2px | `text-h4` 20px (最近似) | **廃止** |
| `text-[1.8rem]` 28.8px | `text-h2` 28px | 生値 → 廃止 |
| `text-cd-h{2-7}` | `text-h{1-6}` | Claude Design コンパクトスケール → 廃止 |

`globals.css` での CSS 変数定義:
```css
/* Display scale (LP/Hero) */
--text-display-1: 3.5rem;   /* 56px */
--text-display-2: 3rem;     /* 48px */
--text-display-3: 2.5rem;   /* 40px */
--text-display-4: 2rem;     /* 32px */

/* UI Heading scale (画面/モバイル汎用) */
--text-h1:        2.125rem; /* 34px */
--text-h2:        1.75rem;  /* 28px */
--text-h3:        1.5rem;   /* 24px */
--text-h4:        1.25rem;  /* 20px */
--text-h5:        1.125rem; /* 18px */
--text-h6:        1rem;     /* 16px */
```

**Tailwind 準拠トークン正規化**

- `bg-[color:var(--secondary-color-*)]` → `bg-secondary-*` (全 JSX)
- `bg-[color:var(--cta-color-500)]` 等 → `bg-cta-*` (全 JSX)
- `@theme inline` から冗長な `--color-primary-color-*` / `--color-secondary-color-*` エントリを除去 (Tailwind v4 では `--primary-*` をそのまま utility として公開できる)
- 生 hex の埋め込みを grep チェックし残置ゼロを確認

**Slider アクセシビリティ修正**

`components/uikit-catalog.tsx` の Slider セクション:
```tsx
// 修正前: Radix SliderPrimitive.Root は <span> なので <label for> のターゲットにならない
<Field label="音量" htmlFor="sl-volume">
  <Slider id="sl-volume" defaultValue={[60]} />
</Field>

// 修正後: aria-label を直接付与
<Field label="音量">
  <Slider aria-label="音量" defaultValue={[60]} />
</Field>
```

**検証**
```bash
./node_modules/.bin/tsc --noEmit
# Exit 0 — 型エラーなし
```

### 12.2 Phase 2 で変更されたファイル

- `app/globals.css` — Display/UI Heading 2 スケール定義、`@theme inline` 簡素化
- `app/guidelines/page.tsx` — `TYPE_SCALE` 配列を 14 エントリ版に更新
- `app/{xxx,aaa,acme,td-financial,theo-tdf}/guidelines/page.tsx` — `FONT_SCALE` 配列を 9 エントリ版 (h1〜h6 + body-lg/body/caption) に更新
- `components/theo-tdf/claude-design/screens.tsx` — `text-cd-h{2-7}` → `text-h{1-6}`、`bg-[color:var(--secondary-*)]` → `bg-secondary-*`
- `components/theo-tdf/claude-design/app-shell.tsx` — 同上
- `components/flow-diagram.tsx` — `bg-[color:var(--secondary-color-10,#...)]` → `bg-secondary-10`、`text-h7` 廃止
- `components/guidelines/auto-button-grid.tsx` — `bg-[color:var(--cta-*)]` → `bg-cta-*`
- `components/guidelines/auto-color-scale.tsx` — `text-h7` 廃止
- `components/auto-tenant-card.tsx` — `text-h7` 廃止
- `components/mock-viewer/canvas-grid.tsx` — `text-h7` 廃止
- `components/uikit-catalog.tsx` — Slider aria-label 修正

### 12.3 Phase 2 スクリプト実行で判明した罠

**FONT_SCALE / TYPE_SCALE の二重変換問題**

`migrate.py` は上から順に正規表現で全文変換するため、タイポグラフィ置換が実行された後に FONT_SCALE 配列の `token` フィールド (`"--text-h1"` 等) が誤変換されてしまった。

- 具体的: `--text-h1` の中の `text-h1` が `text-display-1` に誤変換 → `--text-display-1` になった
- 修正: `fix_scales.py` で `re.sub(r'const FONT_SCALE = \[.*?\];', NEW_FONT_SCALE, t, flags=re.DOTALL)` によりアレイ丸ごと差し替え

> **教訓**: 同一ファイル内で複数の正規表換パスが走る場合、後続パスが前段の出力に当たってしまう。安全順序 (temp marker 方式) か、アレイ全体置換 (`re.DOTALL`) で対処。

### 12.4 Phase 3: Figma Variables 初期セットアップ (Claude Code 経由)

**Cowork では不可** — Cowork は `dev-mode-mcp-server-dxt` (読み取り専用 Dev Mode MCP) しか持たず、`use_figma` ツールが存在しない。Figma Variables の書き込みには **Claude Code + Figma Desktop の MCP サーバー** が必要。

**セットアップ手順** (参考、Claude Code セッション内で実施):
```
claude (Claude Code)
> /mcp  → figma が接続されていることを確認
> mcp__figma__authenticate でブラウザ認証
> 対象 Figma ファイルキーを確認 (ブラウザ URL の /design/<file_key>/ 部分)
```

**作成した Variables 構造**:

| 項目 | 内容 |
|---|---|
| コレクション名 | `Color` |
| モード (テナント) | `xxx`, `aaa`, `acme`, `td-financial`, `theo-tdf` |
| 変数数 | 40 個 / モード (primary/secondary/button/cta × 9 段階 + warm × 4 段階) |
| コード構文 | WEB — `var(--primary-color-10)` 形式 |

**モード別パレット状況**:
- `xxx` / `aaa` / `acme`: 現状は同一パレット (Teal/Cyan 系)。テナント差別化時に各自の `tokens.css` を参照して更新。
- `td-financial`: Navy `#003388` / Red `#db0034` / Blue `#344a9c`
- `theo-tdf`: 独自 4 スケール (tokens.css の実値を転記)
- `button/10` と `cta/10` が存在しない非 theo-tdf テナントは `/50` 値で暫定埋め (将来確定次第更新)

### 12.5 次回 Figma MCP セッション用プロンプト

次回 Claude Code で Figma Variables の続き作業 (セマンティック alias 層追加、ダーク対応、等) を行う際は以下を冒頭に貼る:

```
このプロジェクトは neutral-base デザインシステムです。
Figma ファイルには Color コレクション (5 モード: xxx/aaa/acme/td-financial/theo-tdf)、
各 40 変数 (primary-color-10〜700, secondary-color-10〜700, button-color-10〜700,
cta-color-10〜700, warm-50〜300) が登録済みです。
コード構文: WEB, var() ラッパー形式。

今回やりたいこと: [ここに作業内容を書く]

Figma MCP の use_figma ツールを使い、Variables を操作してください。
```

### 12.6 本セッションで判明した運用上の注意 (追加)

21. **Figma Variables の書き込みは Cowork ではできない** → `use_figma` ツールは Claude Code のローカル MCP サーバー (Figma Desktop 必要) でのみ利用可能。Cowork は Dev Mode MCP (読み取りのみ)。
22. **正規表現移行スクリプトで FONT_SCALE / TYPE_SCALE の token 文字列が誤変換される** → `re.DOTALL` で配列ごと丸ごと差し替えるか、配列内の文字列を変換対象から除外するパターンにする。
23. **Radix `SliderPrimitive.Root` は `<span>` なので `<label for>` の合法ターゲットではない** → `htmlFor` ではなく `aria-label` を Slider に直接付与する。
24. **MCP 書き出しは視覚的な画面再現には向かない** → `figma-generate-design` によるコードからの画面書き出しは、構造・Variables バインド・Component Instance は正しく作れるが、レイアウトや細部の視覚再現度が低く毎回手修正が必要になる。**画面の Figma 化には html.to.design + 手動バインドのハイブリッドが最もコスパが高い**。MCP で作った Components / Variables はその「素材」として使う位置づけ。

### 12.7 Figma の位置づけと確定フロー

MCP 書き出し・Write to canvas・html.to.design の3手法を実験した結果、以下を確定した。

**Figma は「参考資料」。Vercel が正。**

```
Vercel (正・顧客レビュー・開発仕様の基準)
    ↓  顧客から Figma 納品を求められた時のみ
html.to.design でサクッと取込 (視覚再現 ★★★★)
    ↓
Figma (参考資料として渡す)
```

| ツール | 視覚再現 | Variables | Components | 結論 |
|---|---|---|---|---|
| html.to.design | ★★★★ | ❌ | ❌ | 画面書き出しはこれ一択 |
| Write to canvas | ★★★ | ❌ | ❌ | 同上、視覚精度は劣る |
| MCP 書き出し | ★★ | ✅ | ✅ | 画面には使わない |

**MCP (Claude Code) の役割**: Variables と Master Components の「下準備」専任。将来 Figma が「正」になった時のために構造を整えておく資産。画面フレームは作らない。

---

## 13. セッションログ 2026-06-15 (TD 組込1.3 Vercel デプロイ修正)

### 13.1 実施内容

前セッションで取り込んだ TD 組込1.3 (`screens.tsx`) の Vercel ビルドエラーを順次修正し、正常デプロイを達成した。

### 13.2 修正一覧

| # | エラー | 原因 | 修正 |
|---|---|---|---|
| 1 | ESLint `react-hooks/exhaustive-deps` | `DateDrumSheet` の2つの `useEffect` で依存配列が意図的に不完全 | 各 `useEffect` 直前に `// eslint-disable-next-line react-hooks/exhaustive-deps` を追加 |
| 2 | `ReferenceError: window is not defined` | `Object.assign(window, {...})` がモジュールトップレベルにあり SSR (Node.js) でクラッシュ | `if (typeof window !== "undefined") { ... }` でガード |
| 3 | ステータスバー二重表示 | `Phone` コンポーネントがステータスバーを描画し、`ScreenOverview`・`ScreenDone` 内にもフェイクステータスバーがあった | screens.tsx 側のフェイクステータスバーを削除 |
| 4 | CTA ボタン高さが 64px にならない | `Button` の default size に `md:h-9` があり、デスクトップ viewport でボタンが 36px になっていた（Phone 枠内でも viewport 基準のメディアクエリが効く）| `button.tsx` に `cta: "h-16 px-5"` サイズ variant を追加し、`Btn` から `size="cta"` で使用 |
| 5 | ヒーロー背景がブルーのまま | `Phone` がステータスバーを `shrink-0` ブロックとして描画するためヒーロー画像の上に青帯が残った | `Phone` に `heroTop` prop を追加。`scr===0` (ScreenOverview) と `scr===7` (ScreenDone) では status bar を `absolute z-50` に変更してヒーロー画像に重ねる |
| 6 | ステータスバー文字が白 | heroTop モードで `text-white` を指定していた | `text-neutral-800` に変更 |
| 7 | 完了画面ロゴ・コンテンツが見えない | heroTop でステータスバーが絶対配置になり、ヒーローコンテンツが被った | `ScreenDone` のヒーローコンテンツ `pt-4` → `pt-[66px]`（+50px） |
| 8 | CTA ボタンが赤色 | `kind="cta"` が `bg-cta-500`（赤）を指していた | 内容確認ページ (ScreenStep4) 以外の `kind="cta"` をすべて `kind="button"`（青）に変更 |

### 13.3 gotcha 追記

25. **Tailwind `md:h-*` は viewport 基準** → Phone シミュレーター枠（390px）内のコンポーネントでも、ブラウザ viewport が 768px 以上なら `md:` 接頭辞が効いてしまう。Phone 枠内で常に一定サイズにしたい要素は responsive prefix を使わず固定値か inline style にする。
26. **SSR で `window` は undefined** → Next.js の static generation 時はモジュール評価が Node.js 上で行われる。`window`/`document` のモジュールトップレベル参照は必ず `typeof window !== "undefined"` でガードする。
27. **`"use client"` でもモジュールトップレベルは SSR で評価される** → `"use client"` はクライアント側のランタイム実行を指示するが、Next.js の静的ページ生成時にモジュールの import/評価は行われるため `window` 参照は NG。

### 13.4 現在の状態

- Vercel: 正常デプロイ済み
- `/theo-tdf/prototype`: 8画面クリッカブルプロトタイプ 動作確認済み
- 残課題: なし（次タスクは別途 Claude Design zip が来た時に §11 フローで対応）

---

## 14. セッションログ 2026-06-16 (TD 組込1.4 全刷新取り込み + tweaks パネル移植)

### 14.1 経緯

新しい `TD 組込1.4-handoff.zip` を受領。前回コミット済みの 1.4 とは別物で「画面も画面遷移も全部新しい」状態だったため、**追加/修正ではなく theo-tdf プロトタイプを全刷新（screens / app-shell / windows を丸ごと再生成）**した。

§11.2 の罠どおり、今回も `screens.jsx` ではなく **`kumikomi.html` のインライン JS が真の最新**（screens.jsx と 382 行、app.jsx と 306 行差）。kumikomi を一次ソースに移植。

### 14.2 前コミット版で発見した「粗い取り込み」の是正（重要）

前回の 1.4 コミット (`39a497f` 系) は、HANDOFF が定める 2 つの規約が外れた状態だった。今回の全刷新で是正:

1. **タイポスケール未変換**: `screens.tsx` に `text-h7` が 50 箇所残存。globals.css には `--text-h7` が無く（§12 で廃止）、実質無効クラスになっていた。→ globals.css のコメント通り **`text-h{2-7}` → `text-h{1-6}`**（コンパクトスケール h7=16px → UI Heading h6=16px）へ全面変換。
2. **shadcn ラッパーの退行**: 共通 atom が素の `<button>`/`<span>` に戻っていた（§11.4 のラッパーが消えていた）。→ 実績ある `c495e75`（Phase B）のラッパー実装をテンプレに、`Btn→Button` / `Badge→Badge` / `Field→Label+Input` / `LockedField→Label+disabled Input` / `GroupCard→Card+CardContent` を再委譲。`cn`/twMerge による後勝ち（`h-16 md:h-16`, `p-5` 等）を踏襲。`Select` はネイティブ維持。

### 14.3 新デザインの主な変更点（1.3→1.4）

- **新画面 `ScreenCombined`（パターンB）**: 商品概要＋プラン選択を 1 画面に統合。
- **新部品 `FeatValue`**: 補償項目の金額を「50,000 円」体裁に整形。
- **PIN/メール認証フロー変更**: `ScreenPin` が `onVerified` / `backScr` を持ち、`emailVerified` 状態を App が保持して各画面へ伝播。
- **申込フォーム 2 ページ分割**: `ScreenForm` に `formSplit`（契約者／受取人の 2 ページ）。
- **新 `Phone`**: `overviewMode`（scr 0/7 はステータスバー透明・画面側が描画）＋ `screenKey` による `.screen-enter` フェード。
- 受取人ピッカー・団体特定コード・住所自動入力など細部多数。

### 14.4 tweaks パネルの移植（お客様要望: パネルごと移植）

Claude Design の `tweaks-panel.jsx` は host protocol（`postMessage __activate_edit_mode`）でしか開かない＝ Vercel 単体では出ない。そこで **ランチャー（歯車ボタン）で開閉する自己完結型**に作り替え `components/theo-tdf/claude-design/tweaks-panel.tsx` を新設。プロトタイプ上部に「表示オプション」として常設し、**patternB（統合）/ formSplit（2ページ分割）をその場で切替**できる。`useTweaks` は React state（localStorage 非依存・SSR セーフ）。

### 14.5 変更ファイル

- `components/theo-tdf/claude-design/screens.tsx` — kumikomi screens から全面再生成（shadcn ラッパー + スケール変換 + ScreenCombined/FeatValue）
- `components/theo-tdf/claude-design/app-shell.tsx` — 新 Phone / tweaks 統合 / patternB・formSplit・emailVerified 配線
- `components/theo-tdf/claude-design/tweaks-panel.tsx` — 新規（自己完結 tweaks パネル）
- `app/theo-tdf/windows/page.tsx` — 新 props 体系へ（廃止 props 除去、パターンB・formSplit バリアント追加、StatesGallery の 5 バリアントに整合）
- `app/theo-tdf/prototype/page.tsx` — metadata 更新（8画面5ステップ・表示オプション・1.4）
- `app/globals.css` — `.theo-tdf-cd` に `--color-link: #0066d1`（dark `#5b9dff`）追加、`.screen-enter` アニメーション追加

### 14.6 移植スクリプト

`kumikomi.html` → `screens.tsx` の機械変換は Python ポートスクリプトで実施（`"use client"`/ESM import 化、型シグネチャ辞書注入、`text-h{2-7}→{1-6}`、`assets/→/assets/theo-tdf/`、`bg-success→bg-[color:var(--success)]`、`useRef<any>`、atom の shadcn ラッパー差し替え、`export` 付与）。スクリプトは `outputs/port_screens.py` に保存（次回再取り込み時の雛形）。

### 14.7 検証

- `tsc --noEmit`: エラー 0
- `eslint`（5 ファイル）: クリーン
- grep: `text-h7` / `text-cd-h` / 未変換 `assets/` / 素 `bg-success` / 廃止 props（initialShowSend/initialPin/initialNat）すべて 0
- 忠実性照合: kumikomi の UI テキストノード 164 件中、画面本体のコピーは 100% 移植（未一致 7 件はすべて Rail/前後ボタン/StatesGallery 由来＝ app-shell 側に存在）

### 14.8 既知の注意（追加）

28. **コミット済み版が「粗い取り込み」になっていることがある** → 再取り込み時は必ず globals.css の規約（`text-h{2-7}→{1-6}`）と §11.4 shadcn ラッパーが効いているか grep で確認する。素の `<button>` や `text-h7` が出たら退行のサイン。
29. **tweaks パネルは host 依存** → Claude Design の `tweaks-panel.jsx` をそのまま移植しても Vercel では開かない。ランチャー付きの自己完結版に作り替える。
30. **`#065fe3` 等のインライン生 hex は設計の意図的指定**（hero の「480 円」やグラデ等）→ `--primary-color-500` と同値だが、デザイン忠実を優先しそのまま温存している。トークン化するなら別途方針決定が必要。

### 14.9 現在の状態

- `tsc` / `eslint` グリーン。ローカルでの `git add/commit/push` はお客様が実施（Cowork は編集のみ方針）。
- Cowork サンドボックスでは `next build` が Google Fonts 取得段階で失敗するため未実行（§9.14）。お客様の Mac でビルド & デプロイ確認をお願いします。

### 14.10 Vercel プロジェクト統一 + ローカルフォルダ改名 (2026-06-16)

同一 GitHub リポジトリ (`uchida-milize/neutral-base`) に Vercel プロジェクトが 2 つ連携しており、1 回の push で両方がビルドされていた（`neutral-base` と `neutral-base-v2`、同一コミットを二重デプロイ）。

- **`neutral-base-v2` (Vercel プロジェクト) を削除済み**。本番は **`neutral-base` の 1 本に統一**。URL は `https://neutral-base.vercel.app/theo-tdf`。
- **ローカル作業フォルダも `neutral-base-v2` → `neutral-base` に改名**（お客様がターミナルで実施）。本ドキュメント／`DEPLOY.md`／`app/guidelines/page.tsx`／`skills/new-tenant/SKILL.md` 内の旧名・旧パス表記を `neutral-base` に一括更新済み。
- **要対応 — `.vercel/project.json`**: 削除した方のプロジェクト (`"projectName":"neutral-base-v2"` / 旧 projectId) を指したまま残っている。GitHub Integration 経由のデプロイには無関係だが、ローカルで `vercel` CLI を使う場合に誤リンクになる。対処は次のいずれか:
  - `rm -rf .vercel`（CLI を使わないなら最も簡単。GitHub 連携デプロイには影響なし）
  - もしくは `vercel link` で `neutral-base` プロジェクトに貼り直す
- 注意: 環境変数 (`BASIC_AUTH_USER` / `BASIC_AUTH_PASS`) は Vercel プロジェクト単位。残した `neutral-base` 側に設定されていること（誤公開防止の fail-closed）を確認すること。

#### フォルダ改名の手順（お客様ターミナル）

このフォルダは Cowork に接続中のため、改名するとセッションのマウントが切れる。改名は Cowork セッションを閉じてから実施し、改名後に新パスで再接続する:

```bash
cd ~/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload
mv neutral-base-v2 neutral-base
# 以降の作業フォルダ: ~/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base
```

git remote はフォルダ名に依存しないため、改名後もそのまま push 可能（remote は `github.com/uchida-milize/neutral-base`）。

> ⚠️ **gotcha #31 — git は必ず `…/Upload/neutral-base` の中で打つ**: 改名後にひとつ上の `Upload` で git を実行すると、`Upload` に `.git` が無いため親をたどって**ホーム (`~`) の迷子 git リポジトリ**を拾う（ホームが誤って `git init` されていた）。`git rev-parse --show-toplevel` が `…/neutral-base` を返すか最初に確認する。迷子リポジトリは `rm -rf ~/.git` で除去可（コミット0・リモート無しなら無害）。

### 14.11 スクリーンページ (`/theo-tdf/windows`) の状態バリアント拡充 (2026-06-16)

「スクリーンページはページ挙動の確認ではなく、各パターンを表現するカテゴリ」というお客様方針に合わせ、静的に開いた状態を再現できるよう各画面に `initial*` props を追加し、windows に5バリアントを追加した。

| 追加 props | 対象 | windows バリアント |
|---|---|---|
| `initialShowSend` | `ScreenStep2` / `ScreenCombined` | パターンB ページ下部CTA、プラン選択 ページ下部CTA |
| `initialAgree` | `ScreenCombined` (ScreenStep2 は既存) | 同意チェック済・CTA活性（パターンB / プラン選択） |
| `initialPin` | `ScreenPin` | 「666666」入力済・認証ボタン活性 |
| `initialEditKiyaku` / `initialEditJuushin` | `ScreenStep4` | 契約者情報＋保険金受取人 両方編集展開 |

- これらは **`scripts/port-claude-design-1.4.py` にも反映済み**（「windows 用 initial props 注入」ブロック + TYPE 辞書）。再取り込み時も自動で付与され、スクリプト再生成結果は現行 `screens.tsx` とバイト一致を確認済み。
- CTA は `showSend`（スクロール下端到達）が true でないと描画されないため、CTA 状態の表示には `initialShowSend` が必須。`disabled={!agree}` なので活性表示には `initialAgree` も併用する。
- 検証: `tsc --noEmit` エラー0 / `eslint` クリーン。

