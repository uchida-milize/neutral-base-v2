# 引継ぎ書 — Vercel / Next.js サイド
> 対象プロジェクト: `neutral-base` (Next.js 15 / Tailwind v4 / shadcn)
> デプロイ先: https://neutral-base.vercel.app/theo-tdf/
> 最終更新: 2026-07-02

---

## 現状サマリー

| ページ | URL | 状態 |
|--------|-----|------|
| ホーム | `/theo-tdf` | ✅ 完了（タイトル・説明文刷新済み） |
| ガイドライン | `/theo-tdf/guidelines` | ✅ 本日更新（Spacing / Typography snippets / ComponentHandoff 追加） |
| コンポーネント | `/theo-tdf/components` | ✅ TheoCatalog（11コンポーネント）掲載済み |
| プロトタイプ | `/theo-tdf/prototype` | ✅ 全画面 + DivSlider（Figma capture 対応）実装済み |
| スクリーン | `/theo-tdf/windows` | ✅ グループナビ + パン/ズーム 実装済み |

---

## 直近の変更履歴（重要）

### ガイドラインページ追加セクション（本日）
- **Spacing Handoff** — Figma Variables `spacing/0〜spacing/30` ↔ Tailwindクラス対応表
- **タイポグラフィ snippets** — `text-h4`, `text-body` 等のコピペ用コードカード
- **Component Handoff** — `Btn` / `Field` / `Select` / `GroupCard` / `StepSection` / `ActionBar` / `SimSliders` の props 表 + 使用例

### 申込フロー画面
- 告知ボタン押下で「上記の事前同意事項を確認し、同意します」チェックを自動ON
- `<input type="range">` → `DivSlider`（div ベーススライダー）に置換（Figma capture 対応）

### ヘッダー・ホーム・ガイドライン
- ヘッダーロゴ: `/assets/theo-tdf/logo_td_financial.png` 画像に変更
- ホーム h1: 「申込フロー 設計・開発リファレンス」
- ガイドライン: 「ブランドの4つの柱」→「デザインの方向性」（Brand → Design Direction）

---

## ⚠️ 未プッシュのコミット

```bash
# ローカルに1コミット未プッシュ
git log --oneline origin/main..HEAD

# プッシュするには:
cd /Users/Neodym/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base
git push
```

---

## 次のタスク一覧

### 優先度: 高
1. **`git push`** — 上記コミットをプッシュして Vercel に反映させる

### 優先度: 中
2. **Storybook 雛形作成**
   - 対象: `components/theo-tdf/claude-design/screens.tsx` の全コンポーネント
   - 参考: ガイドラインの ComponentHandoff セクションの props 定義がそのまま Story の args に使える
   - `pnpm dlx storybook@latest init` → `stories/theo-tdf/` 以下に Stories を作成

3. **ガイドラインの Figma リンク追加**（オプション）
   - 各セクションに Figma ファイルへのリンクを貼る
   - Figma 側の Phase 2-A（ファウンデーションドキュメント）完了後に対応

### 優先度: 低
4. **スクリーン画面の画面数確認**
   - ホームに「7 画面」と書いてあるが実際は 9 グループある → 数字を合わせる
5. **404/エラーページ** の theo-tdf 用スタイリング

---

## 主要ファイル一覧

```
app/theo-tdf/
  page.tsx                    ← ホーム
  guidelines/page.tsx         ← ガイドライン（本日更新）
  components/page.tsx         ← コンポーネント
  prototype/page.tsx          ← プロトタイプ
  windows/[group]/page.tsx    ← スクリーン (Server Component)
  windows/[group]/GroupPageClient.tsx ← スクリーン (Client Component)

components/theo-tdf/
  claude-design/screens.tsx   ← 全申込フロー画面 + カスタムコンポーネント定義
  theo-catalog.tsx            ← コンポーネントカタログ
  brand-gradients.tsx         ← グラデーション見本
  tokens.css                  ← カラートークン（一次ソース）

components/site-header.tsx    ← ヘッダー（テナント切替ロジック）
```

---

## 新セッション開始プロンプト

```
あなたは neutral-base という Next.js 15 / Tailwind v4 プロジェクトの
Vercel デプロイを担当しています。

## プロジェクト概要
THEO「つみたて安心ほけん」（T&Dファイナンシャル生命）の組込申込フロー
デザインシステムポータル。
デプロイ先: https://neutral-base.vercel.app/theo-tdf/
リポジトリ: /Users/Neodym/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base

## 現状
- ガイドライン・コンポーネント・プロトタイプ・スクリーン 4ページ実装済み
- 本日 ガイドラインに Spacing / Typography Snippets / ComponentHandoff セクションを追加
- 1コミット未プッシュ → まず `git push` をお願いします

## 次タスク（優先順）
1. git push でデプロイ
2. Storybook 雛形作成（components/theo-tdf/claude-design/screens.tsx の全コンポーネント）
3. ガイドラインページに Figma リンク追加（Figma Phase 2-A 完了後）

詳細は handoff-vercel.md を参照してください。
```
