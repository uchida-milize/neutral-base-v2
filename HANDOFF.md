# Handoff — XXX デザインシステム × 顧客 UI/UX 構築フロー

最終更新: 2026年5月27日

新しい Cowork チャットを開いた時、このファイルを添付すれば文脈を引き継げます。

---

## 1. プロジェクトのゴール

「顧客企業ごとにテーマを差し替え可能なデザインシステムを土台にして、ワイヤーフレームから各社向けの UI/UX ページを高速に生成し、開発側にそのまま渡せる状態でデプロイする」一連のパイプラインを Cowork スキルとして整備する。

### 構想全体フロー

```
[1] Google AI Studio でワイヤーフレーム作成
        │
        │  お客様が直接アップロード（Upload フォルダは経由しない）
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
[3] Upload フォルダに handoff バンドル（zip）を配置
        │
        │  Cowork が /import-claude-design スキルで読み込む
        ↓
[4] Cowork が neutral-base リポジトリの該当テナント配下に配置
        ├ app/<tenant>/<page>/ に Claude Design 出力を整形して置く
        ├ components/<tenant>/tokens.css でブランドカラーを上書き
        ├ site-header.tsx の TENANTS 配列にエントリ追加（新規テナントの場合）
        └ import 文・コンポーネント参照を本リポジトリの構造に合わせて調整
        │
        ↓
[5] お客様がローカルで git add / commit / push
        │
        ↓
[6] Vercel が自動デプロイ
        │
        ↓
[7] neutral-base.vercel.app/<tenant> が顧客レビュー Space
        ├ 顧客 (XXX 担当者など) はこの URL だけを案内される
        ├ /xxx/prototype で iPhone フレーム単画面遷移
        └ /xxx/windows で 2×2 グリッド俯瞰
        │
        │  最終承認後
        ↓
[8] Figma に各ページのデザイン + リンク構造を FB
        │  html.to.design プラグイン経由で手動取り込み (詳細は §5)
        │  /feedback-to-figma スキル (Priority 5) で自動化予定
```

### Upload フォルダのファイル区分

`Upload/` 直下に置くべきもの・置かないものを明確化:

| 種別 | Upload に置く？ | 理由 |
|------|--------------|------|
| **Google AI Studio ワイヤーフレーム zip** | ❌ 置かない | 直接 claude.ai/design にアップロード（Claude Design 内部で使う） |
| **Claude Design の handoff バンドル zip** | ✅ 置く | Cowork が読み込んで `app/<tenant>/` に展開する |
| **顧客提供素材（ロゴ・PDF・ブランドガイドライン等）** | ✅ 置く | `/init-brand-tokens` スキルが参照 |
| **`.env.local`** | ✅ 置く（既存） | VERCEL_TOKEN 等、git管理外の機密情報 |
| **作業中の neutral-base-v2/** | ✅ 置く（既存） | git管理されたメインプロジェクト |

ファイル整理の運用イメージ:

```
Upload/
├── .env.local                              VERCEL_TOKEN
├── neutral-base-v2/                        メインプロジェクト (git管理)
├── _handoffs/                              Claude Design 出力の保管庫
│   └── xxx-claude-design-20260603.zip
│   └── aaa-claude-design-20260615.zip
└── _brand-assets/                          顧客提供素材の保管庫（任意）
    └── aaa/
        ├── logo.svg
        └── brand-guidelines.pdf
```

`_handoffs/` と `_brand-assets/` は **作る必要は今すぐない** ですが、複数顧客を並行運用する時にこの構成にしておくと整理しやすいです。

### 役割分担

| ツール | 担当する仕事 |
|--------|-------------|
| **Claude Design** | ワイヤーフレーム → 顧客用 UI/UX ページデザイン化 (本作業の中核創造工程) |
| **Cowork** | プロジェクト基盤管理 / テナント分岐 / デプロイ自動化 / ブランドトークン管理 / Claude Design 出力の受け入れ |
| **Claude Code (CLI)** | Claude Design からの handoff バンドルの直接受け取り (将来、開発者ローカルで使う場合) |
| **Vercel** | GitHub Integration による自動デプロイ + 顧客プレビューホスティング |
| **Figma** | デザインシステム Variables のソース・オブ・トゥルース、最終 FB の格納先 |

### テナント設計方針 — XXX は架空のサンプルテナント

このリポジトリは複数顧客向けの汎用テンプレートとして運用するため、**特定の実在企業名は表に出さない方針**。

- `/xxx/` 配下に並んでいるのは **架空企業「XXX」（Sample Tenant）** のデモコンテンツ
- 申込フロー・カラー設計（teal primary / amber CTA）は「サンプル企業ならこういう作りになる」という見本
- 新規顧客が来たら `/xxx/` をテンプレートとして `/aaa/`・`/bbb/` 等の実顧客テナントを派生
- XXX 自体は永続的に「お手本テナント」として残す（テンプレート参照用）
- ロゴ: `public/assets/logo_xxx.svg` (フル), `public/assets/logo_xxx_mark.svg` (マークのみ) — どちらもダミー
- 旧 `logo_td_financial.png` は実在企業のロゴだったため、削除推奨（ローカルから `rm` 必要）

この方針により、リポジトリ全体を顧客に見せても問題ない透明性を確保しつつ、デモとしての説得力（実機さながらの申込フロー画面など）も維持できる。

---

## 2. 現在の構築状態

### リポジトリ・URL

| 種別 | 値 |
|------|-----|
| GitHub リポジトリ | `https://github.com/uchida-milize/neutral-base` (Private) |
| Vercel プロジェクト | `tuchida in milize projects` / `neutral-base` |
| 本番 URL | `https://neutral-base.vercel.app` |
| ローカル作業フォルダ | `~/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base-v2` |

### Routes

汎用デザインシステム (3 ページ):
- `/` — TOP（土台の意義 + テナント案内）
- `/guidelines` — Guidelines（汎用のデザインルール）
- `/components` — Components（25 セクションの shadcn/ui カタログ）

XXX テナント (5 ページ, `.xxx-scope` で teal 系に自動切替):
- `/xxx` — TOP（XXX ポータル入口）
- `/xxx/guidelines` — Guidelines（XXX ブランド固有ルール）
- `/xxx/components` — Components（同じ UikitCatalog が teal で表示）
- `/xxx/prototype` — Prototype（iPhone フレームの画面遷移）
- `/xxx/windows` — Windows（2×2 グリッドで俯瞰）

### ヘッダーナビゲーション

`components/site-header.tsx` の `TENANTS` 配列で動的切替。

| エリア | メニュー |
|-------|---------|
| 汎用 | TOP / Guidelines / Components |
| XXX | TOP / Guidelines / Components / Prototype / Windows |

新規テナントの追加は `TENANTS` 配列に 1 エントリ追加 + `app/<tenant>/` 配下にディレクトリを作るだけで成立する設計。

### 技術スタック

- Next.js 16.2.6 + React 19.2.4
- Tailwind CSS v4 (CSS-based config)
- shadcn/ui (new-york style)
- Radix UI primitives
- Geist Sans / Geist Mono (geist パッケージ, セルフホスト)
- Noto Sans JP 9 ウェイト (セルフホスト, public/fonts/)
- lucide-react アイコン
- react-day-picker v10
- next-themes (light/dark)
- sonner (トースト通知)

### Tailwind 準拠の確認

両側の入口が明確に分離されている。

**デザイナー側** — `app/globals.css` の CSS Variables を編集
- 162 color tokens + 13 size tokens
- `.xxx-scope` で XXX 用オーバーライド

**開発者側** — JSX で Tailwind utility を直接書く
- `className="rounded-md bg-primary text-primary-foreground"` のような可読性高い記法
- 同じトークン (`bg-primary`) を共有しているので、ad-hoc 拡張してもブランド整合性が保たれる

新規コンポーネントを足す時も、`shadcn` の new-york スタイル規約に沿って書けば自動的に既存システムと馴染む。

---

## 3. ファイル構造の概要

```
neutral-base-v2/
├── app/
│   ├── page.tsx                    (206行)  汎用 TOP
│   ├── layout.tsx                  (geist フォント設定)
│   ├── globals.css                 (162 トークン + .xxx-scope)
│   ├── guidelines/page.tsx         (610行)  汎用 Guidelines
│   ├── components/page.tsx         (49行)   汎用 Components → UikitCatalog
│   └── xxx/
│       ├── layout.tsx              (.xxx-scope を当てる)
│       ├── page.tsx                XXX TOP
│       ├── guidelines/page.tsx     XXX Guidelines (968行)
│       ├── components/page.tsx     XXX Components → UikitCatalog
│       ├── prototype/page.tsx      iPhone 画面遷移
│       └── windows/page.tsx        2×2 俯瞰
├── components/
│   ├── ui/                         shadcn コンポーネント 29個
│   ├── uikit-catalog.tsx           (1041行) 25 セクションのリッチカタログ
│   ├── site-header.tsx             テナント別ナビ切替
│   ├── mock-viewer/
│   │   ├── iphone-frame.tsx        iPhone フレーム
│   │   └── canvas-grid.tsx         俯瞰グリッド
│   ├── xxx-portal-mock.tsx
│   ├── xxx/
│   │   ├── tokens.css              XXX 用 CSS Variables オーバーライド
│   │   ├── flow.css
│   │   ├── flow-meta.ts            申込フロー11画面のメタ情報
│   │   ├── flow-prototype.tsx      iPhone フレームでの遷移実装
│   │   ├── flow-screens.tsx
│   │   └── screens.tsx
│   ├── client-only.tsx
│   ├── theme-toggle.tsx
│   └── showcase/sonner-demo.tsx
├── lib/utils.ts                    cn() ヘルパー
├── public/
│   ├── fonts/                      Noto Sans JP 9 ウェイト
│   └── assets/                     ロゴ等
├── package.json
├── tsconfig.json
├── next.config.ts
├── DEPLOY.md                       初回 push + 日常更新の手順
└── HANDOFF.md                      このファイル
```

---

## 4. デプロイ・更新運用

### 日常の更新フロー

```bash
cd ~/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base-v2
rm -f .git/index.lock  # FUSE で残った場合のみ
git add -A
git commit -m "変更の説明"
git push
```

push → 数十秒で Vercel が再ビルド・再デプロイ。

### Cowork サンドボックスの制約

- `api.vercel.com` ブロック → Cowork から Vercel CLI で直接デプロイは不可
- `api.github.com` ブロック → Cowork から GitHub API 経由のリポ作成は不可
- `github.com` ・`registry.npmjs.org` は到達可能
- ローカル GoogleDrive フォルダは FUSE マウントで一部 `rm` 操作が拒否される（`rsync --delete` も避ける）

### コミット作者の重要ルール

Vercel Hobby プランは「team member 以外の author の commit は自動デプロイしない」制限がある。

- Cowork サンドボックスの `git config` は `Cowork Agent <cowork@users.noreply.github.com>` になっていた → これだと Vercel に拒否される
- 解決済み: ローカルで `git config user.name "うちだ"` / `git config user.email "tuchida@milize.co.jp"` を設定済み
- 今後、Cowork が編集→お客様が `git commit` する流れなら、お客様 identity で commit されるので問題なし

### Vercel-GitHub 連携

- GitHub Integration 設定済み（Vercel ダッシュボード上で結合済み）
- push 後、新しい commit は自動でビルド・デプロイ
- 失敗時は Vercel ダッシュボードでログ確認

### 認証情報

- `.env.local` に `VERCEL_TOKEN` のみ残置（緊急時用、現状の運用では使わない）
- GitHub PAT は **Cowork には渡さない** 方針で確定（`gh auth login` ベース）

---

## 4-B. Figma 連携フロー

### 戦略整理 — なぜ Figma 連携が必要か

UI/UX の納品契約では、Figma ファイルが成果物として含まれるケースが多い（または **後日「Figma が欲しい」と顧客から要望が出る**）。完全に省略はできないため、以下の戦略で対応する:

```
日常運用                          ┌─── 納品トリガー (契約マイルストーン / 顧客要望) ─────┐
                                  │                                                       │
[Cowork でデザイン編集]            │   /export-to-figma スキル実行                         │
   ↓                              │      ├ Figma Variables 一括生成 (162 colors + 13 sizes)│
[git push]                        │      ├ Master Components 投入 (29個 + テナント拡張分) │
   ↓                              │      ├ Pages を Frame として配置                       │
[Vercel auto-deploy]              │      ├ プロトタイプ接続 (画面間リンク)                 │
   ↓                              │      └ 完成レポート (Figma URL + 統計)                 │
[顧客レビュー]                     │                                                       │
   ↓                              └──────────────────────────────────────────────────────┘
[最終承認]
   ↓
[納品時に上記スキルを発火 → Figma ファイルを生成して納品]
```

要点:

- **日々の運用は Cowork × Vercel に集中**。Figma との常時同期はしない (二重メンテのコストを避ける)
- **納品 / 顧客要望のタイミング** で `/export-to-figma` を発火、最新の `globals.css` + コードから一気に Figma ファイルを再構築
- 仕様変更時は「最新の Cowork 側を Figma に再生成」だけでズレない (Cowork が単一情報源)

### ツール選定 — Figma MCP と html.to.design の役割分担

| 用途 | ツール | 理由 |
|------|--------|------|
| **本番の Figma 納品ファイル生成** | Figma MCP | Variables / Master Components / Frames を正規構造で投入できる。スキル化して自動実行可能 |
| **見た目の照合・QA** | html.to.design | デプロイ済み URL からピクセル単位で取り込める。MCP 生成物との visual diff に最適 |
| **その場の手早い取り込み** | html.to.design | 1〜2画面だけ Figma に入れたい時など、軽い用途 |

`/export-to-figma` スキルの精度は、初回 1〜2 納品で html.to.design との diff を確認しながら調整 → 以降は安定運用、というプロセスを想定。

### 即席の取り込み手順 (html.to.design)

`/xxx/windows` の 11 画面（その他テナントも同様）を Figma に取り込むには、Figma 公式コミュニティの **html.to.design** プラグインを使う。Vercel にデプロイ済みの URL を直接指定するだけで、テキスト・画像・色・レイアウトを Figma レイヤーとして再現できる。

### 取り込み手順 (基本)

1. Figma で対象のファイルを開く（新規 or 既存）
2. メニュー → `Plugins` → `Browse plugins in Community` で「html.to.design」を検索してインストール (初回のみ)
3. `Plugins` → `html.to.design` → `Open` で起動
4. URL を貼り付け:
   - `https://neutral-base.vercel.app/xxx/windows` (全11画面を一気に取り込む)
   - または `https://neutral-base.vercel.app/xxx/prototype` (1画面ずつ手動で切り替えながら取り込み)
5. Viewport を **1700px** に設定 (Windows ページが最大幅 1700px のため、全画面を1回でキャプチャするため)
   - 単画面取り込みの場合は **375px** にして iPhone レイアウトを忠実に再現
6. **Import** をクリック → 数十秒〜1分で Figma に取り込まれる

### 取り込み後の整形

html.to.design は Figma レイヤーを一塊のフレームとして配置するため、以下の手順で整理する:

1. 取り込まれた最外フレームを選択 → 右クリック → **Frame selection** で個別 Frame に分割
2. 各 `<figure>` 相当のレイヤーを選択 → **Frame** 化して名前を画面 ID (`01-guidance`, `02-product`, ...) にリネーム
3. デザインシステムの Variables (162 トークン) と紐づけ:
   - レイヤーパネルで色を選択 → 右クリック → **Set variable** で対応する Figma Variable を割り当て
   - Master-Components ファイルを参照すれば一括変換可能

### 役割分担の目安

| 段階 | 担当 |
|------|------|
| Web 側の更新 | Cowork (ファイル編集) + お客様 (git push) → Vercel 自動デプロイ |
| Figma 取り込みのトリガー | お客様 (手動で html.to.design 実行) |
| 取り込み後の Figma 整理 | デザイナー (手動 or 半自動) |
| 将来の自動化 | `/feedback-to-figma` スキル (HANDOFF Priority 5) |

### 取り込みやすい URL (推奨)

| URL | 用途 |
|-----|------|
| `https://neutral-base.vercel.app/xxx/windows` | 全画面を一括取り込み (推奨) |
| `https://neutral-base.vercel.app/xxx/prototype` | 単画面を1つずつ取り込み (細かい調整したい時) |
| `https://neutral-base.vercel.app/xxx/components` | UI Kit カタログを取り込み (Master Components 化に便利) |

### html.to.design の制約と回避策

- **動的要素 (hover state, dropdown 展開状態等)**: 取り込み時点の DOM スナップショットなので、Hover/Active/Disabled の各状態を撮り分けたい場合は、それぞれの状態を強制表示するための URL パラメータを別途用意するか、Figma 側で variant 化する
- **iframe / canvas 要素**: 完全再現は難しい (今回の neutral-base には該当なし)
- **Web フォント**: Geist Sans / Noto Sans JP が Figma 側にインストールされていれば自動マッチング、なければデフォルトフォントで取り込まれる → Figma にフォントを別途インストール推奨
- **Layer 数の制限 (Free プラン)**: 1回の import で取り込めるレイヤー数に上限あり (現時点で 100,000 layers)。`/xxx/windows` 11画面でも収まる想定だが、超過時は 1画面ずつに切り替え

### 将来の改善案

- `/xxx/windows/[step]` のような単画面専用ルート (例: `/xxx/windows/01`) を追加 → html.to.design の `viewport=375 + per-screen URL` で個別取り込みが容易に
- 取り込んだ後の Figma Variables への紐づけを自動化する Figma plugin を内製
- `/feedback-to-figma` スキル化 (Priority 5): 取り込み → ページリンク構造をプロトタイプ接続として張る

### Claude Design 経由の Figma 取り込み実験 (2026-05-27)

**実験対象**: 10 ページ規模の Figma ファイル（DOCTORCOMPASS / SHARP FINANCE 系の申込フロー）

**観察できたこと**:

| 方式 | 結果 |
|------|------|
| ファイル全体 drag&drop | Variables (トークン) は抽出できるが、Frame 構造は引き出せず。2636 node 規模で挫折 |
| 個別 Frame URL を1つずつ渡す | 精度向上。レイアウト・色・タイポグラフィは概ね忠実に再現 |
| Attach ダイアログの表示 | "1 page / 4 frames" と出ても、実際は 10 ページ存在することがあり、UI 表示は信頼しない方が良い |

**Claude Design の性格 (実験から得た結論)**:

- ✓ **派生・拡張に強い**: 元 Figma の Q1, Q2 から推測して Q3, Q4, Q5 を自動生成するなど、パターンを汲み取って続きを作る
- ✓ **トークン抽出は正確**: 色・サイズはほぼ忠実
- △ **同一性再現は不完全**: 元には無い画面を加筆する、細部のレイアウトが少しずれる、など

**戦略への反映**:

- 「顧客の既存 Figma を起点に新画面を作りたい」 → Claude Design (個別 Frame URL を渡す方式) が最適
- 「Vercel で動いてる UI を Figma 納品物として正確に再構築したい」 → **Figma MCP 経由の `/export-to-figma` スキル必須**（Claude Design では完全一致できない）
- 「Figma の Frame を React コードに正確に落としたい」 → 同上、**`/figma-to-page` スキル (Figma MCP)** が本命

つまり Claude Design は「**創造系**」、Figma MCP 経由の Cowork スキルは「**同一性が要求される変換**」、と役割分担が確定。

---

## 5. 次のステップ（優先度順）

### Priority 1 — テナント追加の自動化スキル

**スキル: `/new-tenant`**

入力: 顧客名（例: `aaa`）

実行内容:
1. `app/<tenant>/` ディレクトリを `app/xxx/` の構造を雛形に複製
2. `components/<tenant>/tokens.css` を作成（暫定でデフォルト値）
3. `components/site-header.tsx` の `TENANTS` 配列に新エントリ追加
4. README に新テナントエントリを追記

これだけで `https://neutral-base.vercel.app/aaa` が即立ち上がる。

### Priority 2 — 顧客ブランド色の自動抽出スキル

**スキル: `/init-brand-tokens`**

入力: 顧客サイト URL、または PDF / PNG（ブランドガイドライン）

実行内容:
1. Claude in Chrome で顧客サイトをレンダリング → スクリーンショット + 計算後CSS
2. CSS の頻出色 + ロゴ画像から k-means でパレット抽出
3. Claude vision で「primary / secondary / accent / neutral / semantic」のロール推論
4. `brand-palette.json` を生成
5. 人間レビュー用に Markdown サマリ（色見本付き）出力
6. 承認後、`components/<tenant>/tokens.css` に書き込み

### Priority 3 — Claude Design 出力の取り込みスキル

**スキル: `/import-claude-design`**

入力: Claude Design からエクスポートした handoff バンドル（ZIP または share URL）

実行内容:
1. バンドルを解析し、ページ単位に分割
2. テナント名（`xxx`, `aaa` 等）を指定された場合、`app/<tenant>/<page>/` に配置
3. `tokens.css` との衝突がないかチェック（Claude Design 側のトークン名と本リポジトリのトークン名のマッピング）
4. import 文の解決（`@/components/ui/*` のパスに置き換え）
5. `iphone-frame` や `canvas-grid` で wrap が必要なら自動で挿入
6. 結果サマリを Markdown で出力

### Priority 4 — Figma Variables との同期スキル

**スキル: `/sync-figma-tokens`**

入力: Figma file URL（Master-Components ファイル）

実行内容:
1. Figma MCP で Variables を取得
2. `app/globals.css` の CSS Variables を更新
3. テナントごとの `tokens.css` も該当部分を更新
4. 差分 diff を出力（人間が確認できるよう）

### Priority 5 — Figma 納品ファイル生成スキル ★契約対応の本命★

**スキル: `/export-to-figma`**

UI/UX 納品契約で Figma ファイルが要求されるケースに対応。日々の同期は行わず、納品マイルストーンや顧客要望のタイミングで実行する想定。

入力: テナント名 (`xxx`, `aaa` 等)、Figma File URL（新規 or 既存）

実行内容:
1. Figma file 作成 or 既存ファイル指定（MCP の `create_new_file` または既存指定）
2. `app/globals.css` を読み取り、Figma Variables を一括生成（162 colors + 13 sizes）
3. `components/ui/*` を読み取り、Master Components として投入（29個 + テナント拡張分）
   - Button / Card / Input / Tabs 等の variant 構造もそのまま再現
4. テナント配下のページ (`app/<tenant>/*/page.tsx`) を Frame として配置
5. プロトタイプ接続（画面間リンクを Figma の Interactive Prototype として張る）
6. 完成レポート出力: Figma URL、投入したコンポーネント数、Variables 数、既知の差分リスト

精度担保の補助フロー:
- 同じ URL を html.to.design で別ファイルに取り込み、visual diff で比較
- 差分があれば `/export-to-figma` のスクリプトを修正 → 次回からは正しく出る
- 初回 1〜2 納品で安定化、以降はメンテフリーを目指す

詳細な戦略は §4-B を参照。

### Priority 6（中長期）— GitHub Organization への移管

現在は `uchida-milize/neutral-base`（個人アカウント = dev/検証スペース）。本番運用の目処が立ったら `design-milize` のような Organization に移管予定。

実行内容:
1. https://github.com/organizations/new で新 Org を作成（Plan: Free でOK）
2. 既存リポジトリの Settings → Danger Zone → **Transfer ownership** で Org に転送
3. ローカルの remote URL を更新: `git remote set-url origin https://github.com/design-milize/neutral-base.git`
4. Vercel-GitHub Integration の追従確認（URLは自動更新されるはず）
5. HANDOFF.md / DEPLOY.md の参照を更新

転送後、GitHub が旧URLからの自動リダイレクトを提供するため、移行は段階的に進められる。Vercel の本番URL (`neutral-base.vercel.app`) は GitHub URL変更とは無関係に維持される。

### Priority 7（中長期）— ガバナンスの整備

Org 化後の運用ベストプラクティス:

- **Branch protection rules**: `main` への直接 push を禁止 → PR 必須化
- **CODEOWNERS**: ファイル別レビュアー自動アサイン (例: `/app/xxx/* @td-team`)
- **GitHub Actions**: テスト・lint・PR ごとの preview deploy 自動化
- **顧客別リポジトリ戦略**: `design-milize/neutral-base`（基盤）と `design-milize/customer-aaa`（顧客固有）の派生方針を確定

---

## 6. 引き継ぎ事項・既知の事項

### 環境

- macOS Sonoma (おそらく)
- Mac には `gh` (GitHub CLI), `git`, Node.js, Homebrew がインストール済み
- GoogleDrive デスクトップアプリで `~/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload` が同期マウント

### Cowork コネクタ

設定済み: Design プラグイン (Figma, Slack, Notion, Atlassian 等のコネクタ含む)、Figma プラグイン

未設定 (将来必要になりそう): GitHub MCP（PR コメント・Issue 操作したい場合）

### 過去にハマったポイント

1. **Cowork サンドボックスから Vercel API がブロック** → GitHub Integration 経由で迂回
2. **GoogleDrive FUSE の `rm` 制限** → 削除はローカルで、Cowork からは `rsync` で上書きのみ
3. **`next/font/google` がサンドボックスから到達不可** → `geist` パッケージでセルフホスト
4. **lucide-react v1.16.0 という存在しないバージョン** → v0.474.0 に修正済み
5. **PAT がチャット履歴に露出** → `gh auth login` ベースに切り替え、Cowork に PAT を渡さない運用に
6. **Vercel Hobby が non-team-member commit を拒否** → ローカル git config を `うちだ <tuchida@milize.co.jp>` に設定

---

## 7. 次のチャットで Cowork に伝える言葉（テンプレ）

新しい Cowork チャットを開いて、このファイルを添付した上で:

> 「`HANDOFF.md` を読んでください。Priority 1（`/new-tenant` スキル）の実装に進みたいです。」

あるいは:

> 「`HANDOFF.md` を読んでから、まずは `/init-brand-tokens` スキルの設計から始めたいです。サンプル顧客サイト URL を渡すので、ブランド色抽出を試したいです。」

このように Priority 番号 + やりたい作業を伝えると Cowork が文脈を即座に把握できます。
