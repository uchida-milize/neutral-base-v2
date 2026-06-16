---
name: new-tenant
description: |
  neutral-base リポジトリに新規顧客テナントを追加するスキル。/xxx/ を雛形として
  app/<tenant>/ と components/<tenant>/ を複製し、URL パス・CSS スコープクラス・
  CSS 変数 prefix を新テナント名に置換、site-header.tsx の TENANTS 配列に新
  エントリを挿入する。実行後すぐに http://localhost:3000/<tenant> が立ち上がる
  状態になる。

  使うべきタイミング:
  - 「新しいテナントを追加して」「aaa 用のページを作って」「demo テナントを立ち上げて」
    のような依頼があった時
  - HANDOFF.md の Priority 1 を実行する時
  - 顧客プロジェクト開始時 (まだブランドカラーが決まっていなくても、雛形として立ち上げる)

  使うべきでないタイミング:
  - 既存テナント (例: xxx, aaa) のコンテンツを編集したい時 (このスキルは新規作成専用)
  - Claude Design からの handoff バンドルを取り込みたい時 → Priority 3 の /import-claude-design
  - 顧客サイトからブランドカラーを抽出したい時 → Priority 2 の /init-brand-tokens
---

# /new-tenant — 新規テナント追加スキル

## 概要

`app/xxx/` を雛形として、新しい顧客テナント (例: `aaa`, `demo`) をリポジトリに
スキャフォールドする。実行 1 回で **app/ と components/ 配下のファイル群 + site-header.tsx**
が更新され、即 Vercel デプロイ可能な状態になる。

## 引数

| 引数 | 必須 | 説明 |
|------|------|------|
| `<tenant>` | ✓ | テナント識別子。英小文字で始まり、英小文字・数字・ハイフンのみ可 (1〜32 文字)。例: `aaa`, `demo`, `acme-2026` |
| `--brand-label "..."` |   | ヘッダーに表示するブランド名。省略時は `<TENANT> Design System` (大文字化) |
| `--brand-initial "X"` |   | ヘッダー左上のマーク 1 文字。省略時はテナント名先頭 1 文字を大文字化 |
| `--force` |   | 既存の `app/<tenant>/` `components/<tenant>/` を上書き |
| `--dry-run` |   | 実行内容のみ表示、ファイルは触らない |

## 実行手順

ユーザーの依頼を受けたら、以下の順で動く。

### 1. 引数の確認 (会話で)

ユーザーから明示されていない情報があれば AskUserQuestion で確認する。
最小限の質問にすべきだが、以下のうち未指定のものは聞く。

- テナント識別子 (英小文字) — 必須
- ブランド表示名 — `--brand-label` で渡す。未確定なら省略可
- 既存テナントの上書きが必要か — 通常は新規だが、検証中に再生成したい場合は `--force`

### 2. スクリプト実行

```bash
cd <neutral-base のリポジトリルート>
./scripts/new-tenant.sh <tenant> [--brand-label "..."] [--brand-initial "X"] [--force]
```

スクリプトは以下を実行する:

1. **app/xxx/ → app/<tenant>/** 全体を `cp -R` で複製
2. **components/xxx/ → components/<tenant>/** 全体を `cp -R` で複製
3. コピーしたファイル内で以下を置換 (Python による正規表現置換):
   - `/xxx` (URL) → `/<tenant>`
   - `@/components/xxx/` (import) → `@/components/<tenant>/`
   - `.xxx-scope` / `xxx-scope` → `.<tenant>-scope` / `<tenant>-scope`
   - `.xxx-flow` / `xxx-flow` → `.<tenant>-flow` / `<tenant>-flow`
   - `--xxx-` (CSS 変数 prefix) → `--<tenant>-`
4. **components/site-header.tsx** の `TENANTS` 配列に新エントリ挿入
   - アンカー: `// 将来の他社はここに追加 (例)` コメント行の直前
5. 完了サマリ表示

**置換しないもの (意図的)**:
- `XXX` (大文字のブランドテキスト) — 顧客に見せる文言は `/init-brand-tokens` (Priority 2) または手動で
- React コンポーネント名 (例: `TdfFlowPrototype`) — テナント間でファイルが別なので衝突しない

### 3. 動作確認 (スクリプト実行後)

```bash
pnpm dev
```

ブラウザで以下が開けるか確認:

- `http://localhost:3000/<tenant>` — TOP
- `http://localhost:3000/<tenant>/guidelines` — Guidelines
- `http://localhost:3000/<tenant>/components` — Components
- `http://localhost:3000/<tenant>/prototype` — Prototype (iPhone フレーム)
- `http://localhost:3000/<tenant>/windows` — Windows (2×2 グリッド)

ヘッダーに新しいブランドラベルとマークが表示され、`/<tenant>` 配下では
そのテナントのナビセットだけが見える状態になる。

### 4. ブランドカラーの調整 (任意)

`components/<tenant>/tokens.css` を編集してブランドカラーを上書き。
構造は `.<tenant>-scope { ... }` のスコープブロックになっているので、
中の `--navigation-navy-*` `--primary-blue-*` `--cta-amber-*` `--warm-*`
スケールを顧客カラーに差し替える。

> **将来**: `/init-brand-tokens` スキル (Priority 2) で顧客サイト URL や
> ブランドガイドライン PDF からこのファイルを自動生成する予定。

### 5. コミットとデプロイ

```bash
git add -A
git commit -m "feat: add <tenant> tenant"
git push
```

Vercel が自動で `https://neutral-base.vercel.app/<tenant>` をデプロイする。

## 失敗パターンと対処

| エラー | 原因 | 対処 |
|--------|------|------|
| `テナント '<tenant>' は既に存在します` | `app/<tenant>/` または `components/<tenant>/` が既存 | 再生成したい時は `--force`。それ以外は別名で |
| `'xxx' は雛形テナント名のため使えません` | tenant に `xxx` を指定 | 別の名前を使う (xxx はテンプレート用に永続化される) |
| `TENANTS 配列に /<tenant> エントリが既にあります` | site-header.tsx に登録済み | 重複表示を避けたい場合は事前に削除してから再実行 |
| `雛形が見つかりません` | `app/xxx/` `components/xxx/` のいずれかが消えている | リポジトリの状態を `git status` で確認、`git restore` で復元 |

## 関連スキル

| Priority | スキル | 役割 |
|---------|-------|------|
| 1 | **/new-tenant** (このスキル) | 雛形からテナントをスキャフォールド |
| 2 | /init-brand-tokens | 顧客サイト URL からブランドカラーを抽出 → tokens.css 生成 |
| 3 | /import-claude-design | Claude Design 出力 (handoff バンドル zip) を `app/<tenant>/` に展開 |
| 4 | /sync-figma-tokens | Figma Variables ↔ globals.css の同期 |
| 5 | /export-to-figma | 納品用 Figma ファイル生成 (本命) |

## 参照

- HANDOFF.md §5 Priority 1
- HANDOFF.md §1 「テナント設計方針 — XXX は架空のサンプルテナント」
- components/site-header.tsx の TENANTS 配列コメント
