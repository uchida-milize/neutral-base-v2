# Handoff — T&D デザインシステム × 顧客 UI/UX 構築フロー

最終更新: 2026年5月27日

新しい Cowork チャットを開いた時、このファイルを添付すれば文脈を引き継げます。

---

## 1. プロジェクトのゴール

「顧客企業ごとにテーマを差し替え可能なデザインシステムを土台にして、ワイヤーフレームから各社向けの UI/UX ページを高速に生成し、開発側にそのまま渡せる状態でデプロイする」一連のパイプラインを Cowork スキルとして整備する。

### 構想全体フロー

```
[Google AI Studio で作ったワイヤーフレーム]
        ↓
[Claude Design で各顧客向けにページデザイン化]
   ・Figma UI Kit を読み込ませて反映
   ・顧客ブランドのテーマカラー・コーポレートカラーを適用
   ・iOS 風枠でも確認できるよう出力
        ↓
[Claude Code で開発側に渡す Handoff バンドル]
   ・Tailwind ベースの React コンポーネント
   ・トークン整合性が保たれた状態
        ↓
[Cowork が neutral-base リポジトリの該当テナント配下に配置]
   ・app/<tenant>/ に Claude Design 出力を置く
   ・テナント tokens.css でブランドカラーを上書き
        ↓
[GitHub push → Vercel 自動デプロイ]
        ↓
[neutral-base.vercel.app の <tenant> 配下が顧客レビュー Space]
        ↓
[最終承認後、Figma に各ページのデザイン + リンク構造を FB]
```

### 役割分担

| ツール | 担当する仕事 |
|--------|-------------|
| **Claude Design** | ワイヤーフレーム → 顧客用 UI/UX ページデザイン化 (本作業の中核創造工程) |
| **Cowork** | プロジェクト基盤管理 / テナント分岐 / デプロイ自動化 / ブランドトークン管理 / Claude Design 出力の受け入れ |
| **Claude Code (CLI)** | Claude Design からの handoff バンドルの直接受け取り (将来、開発者ローカルで使う場合) |
| **Vercel** | GitHub Integration による自動デプロイ + 顧客プレビューホスティング |
| **Figma** | デザインシステム Variables のソース・オブ・トゥルース、最終 FB の格納先 |

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

T&D テナント (5 ページ, `.tdf-scope` で navy 系に自動切替):
- `/tdf` — TOP（T&D ポータル入口）
- `/tdf/guidelines` — Guidelines（T&D ブランド固有ルール）
- `/tdf/components` — Components（同じ UikitCatalog が navy で表示）
- `/tdf/prototype` — Prototype（iPhone フレームの画面遷移）
- `/tdf/windows` — Windows（2×2 グリッドで俯瞰）

### ヘッダーナビゲーション

`components/site-header.tsx` の `TENANTS` 配列で動的切替。

| エリア | メニュー |
|-------|---------|
| 汎用 | TOP / Guidelines / Components |
| T&D | TOP / Guidelines / Components / Prototype / Windows |

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
- `.tdf-scope` で T&D 用オーバーライド

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
│   ├── globals.css                 (162 トークン + .tdf-scope)
│   ├── guidelines/page.tsx         (610行)  汎用 Guidelines
│   ├── components/page.tsx         (49行)   汎用 Components → UikitCatalog
│   └── tdf/
│       ├── layout.tsx              (.tdf-scope を当てる)
│       ├── page.tsx                T&D TOP
│       ├── guidelines/page.tsx     T&D Guidelines (968行)
│       ├── components/page.tsx     T&D Components → UikitCatalog
│       ├── prototype/page.tsx      iPhone 画面遷移
│       └── windows/page.tsx        2×2 俯瞰
├── components/
│   ├── ui/                         shadcn コンポーネント 29個
│   ├── uikit-catalog.tsx           (1041行) 25 セクションのリッチカタログ
│   ├── site-header.tsx             テナント別ナビ切替
│   ├── mock-viewer/
│   │   ├── iphone-frame.tsx        iPhone フレーム
│   │   └── canvas-grid.tsx         俯瞰グリッド
│   ├── td-portal-mock.tsx
│   ├── tdf/
│   │   ├── tokens.css              T&D 用 CSS Variables オーバーライド
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

## 5. 次のステップ（優先度順）

### Priority 1 — テナント追加の自動化スキル

**スキル: `/new-tenant`**

入力: 顧客名（例: `aaa`）

実行内容:
1. `app/<tenant>/` ディレクトリを `app/tdf/` の構造を雛形に複製
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
2. テナント名（`tdf`, `aaa` 等）を指定された場合、`app/<tenant>/<page>/` に配置
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

### Priority 5 — Figma への逆フィードバック

**スキル: `/feedback-to-figma`**

入力: テナント名 + ページパス

実行内容:
1. デプロイ済みのページのスクリーンショット + Vercel URL を取得
2. Figma MCP で対応するフレームにコメント追加
3. ページ間のリンク構造を Figma プロトタイプ接続として張る

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
- **CODEOWNERS**: ファイル別レビュアー自動アサイン (例: `/app/tdf/* @td-team`)
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

### 残課題

- `Upload` フォルダ直下の `neutral-base/`（古い試行）と `design-system/`（バンドル展開ディレクトリ）はローカルで `rm -rf` 推奨（zip は残す）
- Vercel 旧プロジェクト `design-system-silk-chi` と GitHub 旧リポジトリ `uchida-milize/design-system` は削除済み

---

## 7. 次のチャットで Cowork に伝える言葉（テンプレ）

新しい Cowork チャットを開いて、このファイルを添付した上で:

> 「`HANDOFF.md` を読んでください。Priority 1（`/new-tenant` スキル）の実装に進みたいです。」

あるいは:

> 「`HANDOFF.md` を読んでから、まずは `/init-brand-tokens` スキルの設計から始めたいです。サンプル顧客サイト URL を渡すので、ブランド色抽出を試したいです。」

このように Priority 番号 + やりたい作業を伝えると Cowork が文脈を即座に把握できます。
