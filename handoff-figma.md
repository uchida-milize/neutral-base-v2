# 引継ぎ書 — Claude Code / Figma デザインシステムサイド
> 対象: theo-tdf Figma ファイル（THEO × T&Dファイナンシャル生命 申込フロー）
> 作業ディレクトリ: `/Users/Neodym/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base`
> 最終更新: 2026-07-02

---

## 完了済みフェーズ

| フェーズ | 内容 | 状態 |
|----------|------|------|
| Phase 1 — Variables | Primitives 48変数 / Semantic 15変数 / Spacing 22変数 作成 | ✅ 完了 |
| Phase 2-B — Spacing Binding | 42,216ノードをスキャン、38,108ノードに Spacing Variables をバインド | ✅ 完了 |
| Phase 2-C — Components登録 | DivSlider / SimSliders / Field / Select / GroupCard / StepSection 6コンポーネント登録 | ✅ 完了 |

---

## 残タスク（優先順）

### 1. 旧カラースタイル削除（最優先）
- Figma の旧来 Color Styles（Variables 移行前に手動作成されたもの）を削除
- Variables に移行済みのため、古い Styles は不要
- 削除方法: Figma > Assets パネル > Local styles > 不要な Color Style を選択 > Delete

### 2. Phase 2-A — ページ構成・ファウンデーションドキュメント
ファイル内のページ構成を整理し、Foundation ページにドキュメントフレームを作成する。

#### ページ構成（目標）
```
📋 Cover
🎨 Foundation
🧩 Components
📱 Screens
```

#### Foundation ページ内セクション（幅 1440px フレーム、縦に配置）
1. **Color Tokens** — Primitives スウォッチ（全スケール）+ Semantic 対応表
2. **Typography Scale** — display〜tiny の実テキスト表示（フォント名・weight・line-height 付き）
3. **Spacing Scale** — spacing/0〜spacing/30 のバー表示 + px 値 + Tailwind class
4. **Radius & Shadow** — 角丸 6段階 + シャドウ 5段階のボックス表示

#### Cover ページ
- プロジェクト名: THEO × T&Dファイナンシャル 申込フロー デザインシステム
- サブ: Embedded Insurance · Components & Guidelines
- 背景: primary-color-500 (#065fe3)

### 3. Storybook 雛形作成（Phase 2 完了後）
- Next.js 側と連携（Cowork / Vercel セッションで対応）
- Phase 2-A 完了後に着手

---

## Variables 詳細（参照用）

### Primitives（48変数）
- `primary-color/50〜900` — Ink Blue スケール
- `secondary-color/50〜900` — Coral スケール
- `button-color/50〜900` — THEO Blue スケール
- `cta-color/50〜900` — 純赤スケール
- `warm/50〜900` — ウォームグレースケール

### Semantic（15変数）
- `--primary` → `primary-color/500`
- `--secondary` → `secondary-color/500`
- `--button` → `button-color/500`
- `--cta` → `cta-color/500`
- `--background`, `--foreground`, `--border`, `--muted`, `--accent` 等

### Spacing（22変数）
- `spacing/0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 30, 32, 36, 40, 48`
- スコープ: GAP（Figma の gap / padding に自動適用される）

---

## 登録済みコンポーネント一覧

| コンポーネント名 | 役割 | screens.tsx との対応 |
|----------------|------|---------------------|
| DivSlider | スライダー（divベース） | `DivSlider` |
| SimSliders | 積立額・保障期間スライダー組 | `SimSliders` |
| Field | テキスト入力（4状態） | `Field` |
| Select | ドロップダウン選択 | `Select` |
| GroupCard | 入力グループコンテナ | `GroupCard` |
| StepSection | STEP番号バッジ付きセクション | `StepSection` |

---

## 重要な設計方針

- **hex 直書き禁止** — 必ず Variables を経由する
- **Semantic 層は触らない** — テナント差し替えは Primitives（`primary-color-*` 等）のみ変更
- **保険商品のためダークモード廃止** — ライト固定
- **スコープ設定**: Primitives は scope=[] / Semantic は scope=ALL_FILLS,STROKE_COLOR

---

## 新セッション開始プロンプト（Claude Code 用）

```
あなたは THEO × T&Dファイナンシャル生命 申込フロー Figma デザインシステムの
構築を担当しています。

## 完了済み
- Phase 1: Variables（Primitives 48 / Semantic 15 / Spacing 22変数）
- Phase 2-B: Spacing Variables バインド（38,108ノード）
- Phase 2-C: 6コンポーネント登録（DivSlider, SimSliders, Field, Select, GroupCard, StepSection）

## 次タスク（優先順）

### ① 旧カラースタイル削除
Figma の Local styles から、Variables 移行前に作成された古い Color Styles を削除してください。
Assets パネル > Local styles > Color styles > 不要なものを削除。

### ② Phase 2-A: ページ構成・ファウンデーションドキュメント
Figma ファイルのページ構成を以下に整理:
  📋 Cover / 🎨 Foundation / 🧩 Components / 📱 Screens

Foundation ページに 4 セクション（幅1440px フレーム）を作成:
  1. Color Tokens（Primitives スウォッチ + Semantic 対応表）
  2. Typography Scale（display〜tiny の実テキスト表示）
  3. Spacing Scale（spacing/0〜30 のバー + px + Tailwind class）
  4. Radius & Shadow（角丸6段階 + シャドウ5段階）

Cover ページ: bg=#065fe3 / タイトル「THEO × T&Dファイナンシャル 申込フロー デザインシステム」

詳細は handoff-figma.md を参照してください。
作業ディレクトリ: /Users/Neodym/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base
```
