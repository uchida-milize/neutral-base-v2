# Deploy 手順

このフォルダは GitHub `uchida-milize/neutral-base` リポジトリと連携済みで、Vercel `neutral-base.vercel.app` に自動デプロイされます。

## 現在の構成

### Routes

汎用デザインシステム (3 ページ):
- `/` — TOP（土台の意義とテナント一覧）
- `/guidelines` — Guidelines（デザインの土台ルール）
- `/components` — Components（共有 UI Kit カタログ）

TDF テナント (5 ページ):
- `/tdf` — TOP（TDF 向けポータル入口）
- `/tdf/guidelines` — Guidelines（TDF ブランド固有のルール）
- `/tdf/components` — Components（`.tdf-scope` で navy 系に切替）
- `/tdf/prototype` — Prototype（iPhone フレームの画面遷移ビュー）
- `/tdf/windows` — Windows（同じ画面を 2×2 グリッドで俯瞰）

### ヘッダーナビゲーション

`components/site-header.tsx` の `TENANTS` 配列で、現在のパスに応じてメニューを自動切替します。

| エリア | メニュー |
|-------|---------|
| 汎用 (`/`, `/guidelines`, `/components`) | TOP / Guidelines / Components |
| TDF (`/tdf/*`) | TOP / Guidelines / Components / Prototype / Windows |

新しいテナント（例: AAA社）を追加する場合は、`site-header.tsx` の `TENANTS` 配列に1エントリ追加し、`app/aaa/` 配下に同じ構造でページを作るだけで成立します。

### 技術スタック

- Next.js 16.2.6 + React 19.2.4
- Tailwind CSS v4
- shadcn/ui (new-york style)
- Radix UI primitives
- Geist Sans / Geist Mono (geist package, self-hosted)
- Noto Sans JP (9 weights, self-hosted)
- lucide-react icons
- react-day-picker v10
- next-themes (light/dark)

## 日常の更新フロー

Cowork で内容を編集してもらった後、ローカルのターミナルで:

```bash
cd ~/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base-v2

# 変更内容を確認
git status
git diff

# ステージング → コミット → push
git add -A
git commit -m "変更の説明"
git push
```

push 後、数十秒で Vercel が再ビルド・再デプロイします。Production URL は変わらず `https://neutral-base.vercel.app/`、ブランチや PR の preview URL も自動で発行されます。

## 初回更新（このバージョンへの切り替え）

このフォルダには大幅な構造変更が入っているため、初回の commit は規模が大きくなります。

```bash
cd ~/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base-v2

# .git/index.lock を削除（残っている場合）
rm -f .git/index.lock

# 全体を確認（25 ファイル前後の変更が見えるはず）
git status --short

# 全部ステージング → コミット → push
git add -A
git commit -m "feat: 汎用 + TDF テナントのページ構造を導入

- 汎用エリア: TOP / Guidelines / Components (3 ページ)
- TDF テナント: TOP / Guidelines / Components / Prototype / Windows (5 ページ)
- /tdf/ 配下で .tdf-scope CSS が自動で navy 系に切替
- site-header.tsx でテナント別ナビセットを動的描画
- iPhone フレーム (mock-viewer/iphone-frame.tsx) と俯瞰グリッド (canvas-grid.tsx) を導入
- next/font/google → geist パッケージへ移行（セルフホスト）
- Noto Sans JP 9 ウェイトを public/fonts/ にセルフホスト"

git push
```

push が成功すると、Vercel ダッシュボードで自動的にビルドが始まります。

## ローカル開発（任意）

ローカルで開発サーバーを動かしたい場合:

```bash
cd ~/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base-v2

# 依存インストール（Cowork 側でも実行済みだが、お客様のローカルでは別途必要）
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで http://localhost:3000 にアクセス。`/tdf` を見れば TDF テナント版が見えます。

## トラブルシューティング

### `.git/index.lock` の Operation not permitted

GoogleDrive の FUSE 同期が一時的にロックを保持していると発生します。

```bash
# ロック削除を再試行
rm -f .git/index.lock
# または、少し待ってから再度
sleep 5 && rm -f .git/index.lock
```

### push が失敗する

gh CLI で再認証:

```bash
gh auth status
gh auth refresh
```

### Vercel ビルドが失敗する

ビルドログを確認（Vercel ダッシュボード）。多くは依存パッケージの解決失敗。ローカルで `npm install && npm run build` が通れば、Vercel 側でも同じはず。

### `design-system-silk-chi.vercel.app` が残っている

このプロジェクトでメニュー構造を統一したので、旧 Vercel プロジェクトは不要です。

1. https://vercel.com/dashboard を開く
2. `design-system-silk-chi`（または `design-system`）プロジェクトを開く
3. Settings → Advanced → **Delete Project**

GitHub の `uchida-milize/design-system` リポジトリは履歴保全のため Archive 推奨（削除しなくても良い）。Settings → Archive this repository。

### Upload フォルダ内の不要ファイル

```bash
cd ~/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload

# 旧失敗試行（最初のFUSE permission issueで残ったもの）
rm -rf neutral-base

# 展開済みバンドル（zip があるので問題なし）
rm -rf design-system

# 残しておくもの:
# - neutral-base-v2/       現プロジェクト
# - MILIZE UIUX Design System20260526.zip   元 Claude Design バンドル
# - .env.local             VERCEL_TOKEN 用（GitHub-Vercel 連携後はほぼ未使用）
```

## 次のステップ候補

1. **テナントテーマレイヤーの設計** — `--primary-blue-*` / `--navigation-navy-*` を顧客ごとに差し替える仕組みの整備
2. **ブランド色自動抽出スキル** — 顧客サイト URL から色を抽出し `tokens.css` に流し込むスキル化
3. **テンプレートからの新規テナント生成スキル** — `/tdf/` をテンプレートとして `app/aaa/` を生成するスキル

これらは Cowork のスキルとして整備していくと、顧客追加が数分で済むようになります。
