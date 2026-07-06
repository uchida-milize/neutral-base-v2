# 引継ぎ・プロンプト — neutral-base

> 作成: 2026-07-07 / 次セッション開始時にこのファイルをそのまま貼り付けてください。

---

## プロジェクト概要

| 項目 | 内容 |
|---|---|
| リポジトリ | `neutral-base` (GitHub: uchida-milize/neutral-base) |
| フレームワーク | Next.js 16 App Router / TypeScript strict |
| 本番 URL | Vercel（tuchida-milize-projects チーム） |
| Figma | https://www.figma.com/design/YBJqblcAwrxktgLgGAKyWW/ |
| 作業フォルダ | `/Users/Neodym/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base` |

**主要ファイル**
```
components/theo-tdf/claude-design/
  screens.tsx       ← 全画面コンポーネント（~3800行）
  app-shell.tsx     ← Phone フレーム + ナビゲーション Rail + Tweaks サイドバー
  tokens.css        ← .theo-tdf-scope のブランドカラー定義
  disclosure.tsx    ← 告知データ定数（今回分割）
  plans.tsx         ← プランデータ定数（今回分割）
  constants.ts      ← ブランド名・カラー定数
  types.ts          ← 型定義
```

---

## 現在の状態（2026-07-07 時点）

### ブランド: THEO → XXX/generic 置換 ✅
- AppBar: `XXX つみたて安心ほけん`
- ロゴ: `dammy_logo_cyan.svg`（スカイブルー #1aa5dc）
- 契約番号: `XXX-2026-000001`

### テーマカラー: ダークブルー → スカイブルー ✅
- `tokens.css` の primary-color スケールを `#065fe3` → `#1aa5dc` に変更
- button-color / cta-color も primary に統一
- screens.tsx のハードコード色も置換済み

### アプリ画面フロー ✅
- FLOW: 商品概要 → PINコード認証 → 申込フォーム → 内容確認 → カード → 完了（5ステップ）
- patternB 常時ON（プラン選択は商品概要に統合）
- ScreenCombined がデフォルト表示（scr=0）

### ScreenCombined ヘッダー（商品概要） ✅
- 「XXXのお客様限定」バッジ → 中央配置
- dammy_logo_cyan.svg h-[30px] → 中央 + ブランド名テキスト横並び
- 「引受保険会社 T&D」→ 右寄せ別行
- アイコン下テキスト → 16px

### AGREE_ITEMS（内容確認画面）✅
- 9項目 → 3項目に簡略化（申込注意事項 / 重要事項説明 / マイページ利用規約）
- チェック文言: `①②を確認し、③の内容に同意する`

### コード分割 ✅
- `disclosure.tsx`, `plans.tsx`, `types.ts`, `constants.ts` を新規作成
- screens.tsx から約130行削減、re-export で既存 import 維持

---

## 未対応・次タスク

### 優先度 高
1. **git push（未プッシュ分）**
   ```bash
   cd /Users/Neodym/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base
   git add -A
   git commit -m "sky blue theme + header layout + refactor file split"
   git push origin main
   ```

2. **Figma カラートークン同期**
   - Figmaの `Primary/500` を `#1aa5dc` に更新（スケール全体）
   - 手順: claude.ai コネクタ設定 → Figma 認証 → 新セッションで指示

### 優先度 中
3. **残差分の画面修正**（スクショ比較で確認）
   - ScreenPin / ScreenForm / ScreenStep4 / ScreenDone
4. **atoms.tsx 分割**（次フェーズ）
   - Badge, Btn, AppBar, Steps, Field 等を screens.tsx から抽出

---

## ワークフロー（確定）

```
Cowork（コード修正・Figma更新）→ ターミナルで git push → Vercel 自動デプロイ
```

- Figma操作: Cowork（Figma MCP 経由、要認証）
- git push: ターミナルのみ（Cowork サンドボックスは SSH 不可）
- Claude Design: 廃止。Vercel を源泉真実とする
- 方針: トークン変更・新コンポーネント追加は Vercel + Figma を同時更新

---

## 次セッション開始プロンプト（コピペ用）

```
neutral-baseプロジェクトの続きです。
HANDOFF.mdを読んで現状を把握してください。

次タスク: [ここに具体的なタスクを記入]
  例）Figmaのカラートークンをスカイブルー（#1aa5dc）に更新する
  例）ScreenPin の画面差分を修正する
  例）atoms.tsx へのコンポーネント分割を進める
```
