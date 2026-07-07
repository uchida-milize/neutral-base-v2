# 引継ぎ・プロンプト — T&D Figma Claude Code 02

> 作成: 2026-07-07 / 次セッション開始時にこのファイルをそのまま貼り付けてください。

---

## プロジェクト概要

| 項目 | 内容 |
|---|---|
| リポジトリ | `neutral-base` (GitHub: uchida-milize/neutral-base) |
| フレームワーク | Next.js 16 App Router / TypeScript strict |
| 本番 URL | Vercel（tuchida-milize-projects チーム） |
| Figma | https://www.figma.com/design/YBJqblcAwrxktgLgGAKyWW/T-D-%E7%B5%84%E8%BE%BC%E3%83%9A%E3%83%BC%E3%82%B8 |
| 作業フォルダ | `/Users/Neodym/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base` |

**主要ファイル**
```
components/theo-tdf/claude-design/
  screens.tsx       ← 全画面コンポーネント（~3800行）
  app-shell.tsx     ← Phone フレーム + ナビ Rail + Tweaks サイドバー
  tokens.css        ← .theo-tdf-scope のブランドカラー定義（スカイブルー済）
  disclosure.tsx    ← 告知データ定数
  plans.tsx         ← プランデータ定数
  constants.ts      ← ブランド名・カラー定数
  types.ts          ← 型定義
```

---

## 現在の状態（2026-07-07 時点）✅ 完了済み

| 項目 | 状態 |
|---|---|
| ブランド THEO→XXX 置換 | ✅ |
| テーマカラー → スカイブルー #1aa5dc | ✅ |
| ScreenCombined ヘッダー修正 | ✅ |
| AGREE_ITEMS 9→3項目 | ✅ |
| コード分割（disclosure/plans/types/constants） | ✅ |
| Figma MCP 接続確認 | ✅ |

**Figma ページ構成（確認済み）**
- 📋 Cover（2115:1074）
- 🎨 Foundation（2115:1075）
- 🧩 Components（2115:1076）
- 📱 Screens（2078:213）

---

## 次タスク（優先順）

### 1. 商品概要レイアウト修正【最優先】
Screensページのキャンバスに「sankou」というノードが貼られている。
これを参考に、**商品概要（ScreenCombined）のレイアウトをFigmaとVercelの両方で更新する**。

手順:
1. Figma MCP で `sankou` ノードを取得（Screens ページ内を検索）
2. レイアウト差分を把握
3. `screens.tsx` の ScreenCombined コンポーネントを修正
4. Figma の Screens ページも同様に更新
5. git push → Vercel 自動デプロイ

### 2. Figmaカラートークン同期
- Foundationページの Primary カラー変数を #1aa5dc スカイブルーに更新
- Figma MCP の `get_variable_defs` で現状確認 → `use_figma` で更新

### 3. git push（未プッシュ分）
```bash
cd /Users/Neodym/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base
git add -A && git commit -m "sky blue theme + header layout + file split refactor" && git push origin main
```

### 4. 残差分の画面修正
- ScreenPin / ScreenForm / ScreenStep4 / ScreenDone

### 5. atoms.tsx 分割（次フェーズ）
- Badge, Btn, AppBar, Steps, Field を screens.tsx から抽出

---

## ワークフロー（確定）

```
Cowork（コード修正・Figma更新）→ ターミナルで git push → Vercel 自動デプロイ
```

- Figma操作: Cowork（Figma Dev Mode MCP Server 経由 ✅）
- git push: ターミナルのみ（Cowork サンドボックスは SSH 不可）
- Claude Design: 廃止。Vercel を源泉真実とする
- 方針: トークン変更・新コンポーネント追加は Vercel + Figma を同時更新

## Figma MCP 接続方法
- Figmaデスクトップアプリを起動
- 対象ファイルを開く（右パネル Dev Mode → MCP: サーバーステータス 有効 を確認）
- Claudeデスクトップアプリを再起動してから作業開始

---

## 次セッション開始プロンプト（コピペ用）

```
T&D Figma Claude Code 02 です。

HANDOFF.md を読んで現状を把握してください。
作業フォルダ: /Users/Neodym/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base

最初のタスク:
Figmaの Screens ページにある「sankou」ノードを参照し、
商品概要（ScreenCombined）のレイアウトを修正してください。
FigmaとVercel（screens.tsx）を同時に更新すること。

Figma URL: https://www.figma.com/design/YBJqblcAwrxktgLgGAKyWW/T-D-%E7%B5%84%E8%BE%BC%E3%83%9A%E3%83%BC%E3%82%B8
```
