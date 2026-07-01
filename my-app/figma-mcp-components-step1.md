# THEO STEP 1 共通コンポーネント — Figma Variables + Component Sets 構築プロンプト
## （Claude Code + Figma Desktop `use_figma`）

> **対象 Figma ファイル**: `https://www.figma.com/design/7vRRacI3x2gedlqD0oj4ja/無題`  
> **作業内容**: Variables（カラー5スケール・タイポグラフィ）+ Component Sets（Btn/Badge/Steps/AppBar/ActionBar/ReqBadge/GroupCard/Field）を構築する。画面フレームはまだ作らない。  
> **事前準備**: Figma Desktop でこのファイルを開く → Claude Code で `/mcp` 確認 → `use_figma` 利用可であること確認。

---

==== ここから貼り付け ====

あなたは Figma Desktop の MCP（`use_figma`）を使って、THEO つみたて安心ほけんのデザインシステム基盤（**Variables + Component Sets**）を構築するエージェントです。

**絶対ルール**:
- `use_figma` は 1 回の呼び出しで**最大10ノード操作**まで。大きな処理は複数回に分ける。
- 各呼び出しで**作成/変更したノードの node-id を必ず return** する。
- エラーが出たら**即座に停止**し原因を読む。サイレントリトライ禁止。
- フォントは text ノード作成前に必ず `await figma.loadFontAsync(...)` する。
- `figma.notify()` は使わない（`return` で出力する）。
- 色は 0〜1 レンジ（255 で割る）。
- `figma.currentPage` リセット注意: 各 `use_figma` 呼び出し冒頭で `setCurrentPageAsync` を必ず実行。
- Yes/No の確認は自動承認（-y）でノンストップで進める。

---

## ソース参照（必ず最初に読む）

リポジトリ: `~/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base`

- `components/theo-tdf/tokens.css` — ブランド 5 スケールの正確な hex 値
- `app/globals.css` — タイポスケール / セマンティック層
- `components/theo-tdf/claude-design/screens.tsx` — 各 atom のクラス / スタイル定義

---

## フェーズ 1 — Variables（カラー + タイポグラフィ）

### 1a. ファイル確認

まず現状を把握:
```
use_figma で以下を実行:
const pages = figma.root.children.map(p => ({ id: p.id, name: p.name }));
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const styles = figma.getLocalTextStyles().map(s => s.name);
return { pages, collections: collections.map(c => c.name), styles };
```
→ 結果を報告して次へ。

### 1b. Color Variables コレクション作成

コレクション名: `Color`、モード名: `theo-tdf`（1モードのみ）

変数は以下の値で作成。スコープ設定必須（後述）。

**primary-color（Ink Blue: #065fe3）**
| 変数名 | hex |
|---|---|
| primary-color/10 | #e9f2fe |
| primary-color/50 | #c9defe |
| primary-color/100 | #98c1fc |
| primary-color/200 | #62a0fb |
| primary-color/300 | #2f81fa |
| primary-color/400 | #0768f8 |
| primary-color/500 | #065fe3 |
| primary-color/600 | #054eba |
| primary-color/700 | #033784 |

**secondary-color（Coral: #ff748d）**
| 変数名 | hex |
|---|---|
| secondary-color/10 | #fff4f6 |
| secondary-color/50 | #ffe3e8 |
| secondary-color/100 | #ffcad4 |
| secondary-color/200 | #ffaebd |
| secondary-color/300 | #ff94a7 |
| secondary-color/400 | #ff7f96 |
| secondary-color/500 | #ff748d |
| secondary-color/600 | #ff3156 |
| secondary-color/700 | #d70027 |

**button-color（Bright Blue: #007dff）**
| 変数名 | hex |
|---|---|
| button-color/10 | #ebf5ff |
| button-color/50 | #cce5ff |
| button-color/100 | #9eceff |
| button-color/200 | #6bb4ff |
| button-color/300 | #3b9bff |
| button-color/400 | #1487ff |
| button-color/500 | #007dff |
| button-color/600 | #0066d1 |
| button-color/700 | #004894 |

**cta-color（Pure Red: #ff2d2d）**
| 変数名 | hex |
|---|---|
| cta-color/10 | #ffeeee |
| cta-color/50 | #ffd5d5 |
| cta-color/100 | #ffafaf |
| cta-color/200 | #ff8585 |
| cta-color/300 | #ff5d5d |
| cta-color/400 | #ff3e3e |
| cta-color/500 | #ff2d2d |
| cta-color/600 | #f60000 |
| cta-color/700 | #ae0000 |

**warm（Stone Neutral）**
| 変数名 | hex |
|---|---|
| warm/50 | #f2fbfe |
| warm/100 | #f5f5f4 |
| warm/200 | #e7e5e4 |
| warm/300 | #d6d3d1 |

**semantic（alias）**
| 変数名 | alias先 |
|---|---|
| semantic/primary | primary-color/500 |
| semantic/button | button-color/500 |
| semantic/cta | cta-color/500 |
| semantic/secondary | secondary-color/500 |

**スコープ設定**:
- `*/500` 系・`semantic/*`: `FRAME_FILL`, `SHAPE_FILL`, `STROKE_COLOR`
- `*/10` 〜 `*/400`: `FRAME_FILL`, `SHAPE_FILL`（薄色背景用）
- `*/600` 〜 `*/700`: `SHAPE_FILL`, `STROKE_COLOR`（hover/border用）
- Primitive（各段階）: `[]`（非表示）— semantic 経由のみ

**コード構文（WEB）**:
- `primary-color/500` → `var(--primary-color-500)`
- `button-color/500` → `var(--button-color-500)`
- `cta-color/500` → `var(--cta-color-500)`
- 他も同様のパターン（ハイフン区切り、番号はスラッシュ→ハイフン）

→ **完了後: 変数数と collection id を報告して次へ**

### 1c. Typography テキストスタイル作成

フォントは以下を `loadFontAsync` でロード:
- `{ family: "Noto Sans JP", style: "Regular" }`
- `{ family: "Noto Sans JP", style: "Medium" }`
- `{ family: "Noto Sans JP", style: "Bold" }`
- `{ family: "Inter", style: "Regular" }`
- `{ family: "Inter", style: "Medium" }`
- `{ family: "Inter", style: "SemiBold" }`

作成するテキストスタイル（全て Noto Sans JP ベース、英数字は Inter で代替可）:

| スタイル名 | px | weight | lineHeight |
|---|---|---|---|
| text/h1 | 34 | Bold (700) | 1.3 |
| text/h2 | 28 | Bold (700) | 1.3 |
| text/h3 | 24 | Bold (700) | 1.35 |
| text/h4 | 20 | Bold (700) | 1.35 |
| text/h5 | 18 | Medium (500) | 1.4 |
| text/h6 | 16 | Medium (500) | 1.4 |
| text/body-lg | 16 | Regular (400) | 1.5 |
| text/body | 14 | Regular (400) | 1.5 |
| text/caption | 14 | Regular (400) | 1.5 |
| text/tiny | 10 | Regular (400) | 1.4 |

→ **完了後: 作成したスタイル数と名前一覧を報告して次へ**

---

## フェーズ 2 — Component Sets（atom 単位）

**共通ルール**:
- 全コンポーネントは `figma.createAutoLayout()` + `combineAsVariants()` で作成。
- 命名: `ComponentName/Property=Value, Property=Value`（例: `Btn/Kind=button, State=default`）
- バリアントは `combineAsVariants` 後、グリッドレイアウトで整列（gap 24）。
- 塗りは Phase 1 で作った Variables にバインドする（生 hex 禁止）。
- Components ページを別途作成してそこに配置。

### 2a. ページ作成

```
新しいページ「Components」を作成し、そこをアクティブにする。
```

### 2b. Btn コンポーネントセット

**バリアント軸**:
- `Kind`: `cta` / `button` / `danger` / `outline` / `ghost`
- `State`: `default` / `disabled`

計 5×2 = **10 バリアント**。

**各バリアントの仕様**:
| Kind | fills | text color | border |
|---|---|---|---|
| cta | gradient `#075FE3→#64B0F7 (135°)` | white | none |
| button | gradient `#075FE3→#64B0F7 (135°)` | white | none |
| danger | gradient `#E83A3C→#F66A6C (135°)` | white | none |
| outline | white | button-color/600 | 1px button-color/600 |
| ghost | transparent | neutral-500 | none |

**共通スタイル**:
- 高さ: 64px (`h-16`)
- 幅: 320px（フル幅想定）
- 角丸: 14px (`rounded-xl`)
- フォント: Noto Sans JP Bold 16px（text/h6）
- gap: 8px（アイコン + テキスト）

**disabled state**: opacity 40%、pointer-events none。

→ **完了後: component set の node-id を報告して次へ**

### 2c. Badge コンポーネントセット

**バリアント軸**:
- `Tone`: `secondary` / `primary` / `warm`

計 **3 バリアント**。

| Tone | bg | text color |
|---|---|---|
| secondary | secondary-color/10 | secondary-color/700 |
| primary | primary-color/10 | primary-color/700 |
| warm | warm/100 | neutral-500 |

**共通スタイル**:
- 高さ: auto（padding: 4px 12px）
- 角丸: full (`rounded-full`)
- フォント: Noto Sans JP Medium 14px（text/caption）
- border: none

→ **完了後: node-id を報告して次へ**

### 2d. Steps コンポーネントセット

**バリアント軸**:
- `CurrentStep`: `1` / `2` / `3` / `4` / `5`（どのステップがアクティブか）

計 **5 バリアント**。

各バリアントは横 Auto Layout、5つの円（直径32px）を幅32pxの線で繋ぐ:

**各ステップ円のスタイル**:
- `active`（currentStep に一致）: bg `primary-color/500`、border `primary-color/500`、text white、数字 Bold
- `filled`（currentStep より前）: bg white、border `primary-color/500`、text `primary-color/500`
- `empty`（currentStep より後）: bg white、border `warm/300`、text neutral-400

**繋ぎ線**:
- filled→filled/active 間: `primary-color/500`
- その他: `warm/200`

**外枠**:
- bg: white
- border-bottom: 1px `warm/200`
- padding: 8px 24px

→ **完了後: node-id を報告して次へ**

### 2e. AppBar コンポーネントセット

**バリアント軸**:
- `Style`: `default` / `transparent`

計 **2 バリアント**。

**仕様**:
- 高さ: 56px
- 幅: 390px
- 構造: 左スペーサー（40px）+ 中央コンテンツ + 右スペーサー（40px）
- 中央: "THEO"（Inter SemiBold 16px tracking 10%）+ "つみたて安心ほけん"（Noto Sans JP Medium 16px）

| Style | bg | text color |
|---|---|---|
| default | gradient `#075FE3→#64B0F7 (backgroundSize: 100% 89px, position 0 -33px)` | white |
| transparent | transparent | white |

→ **完了後: node-id を報告して次へ**

### 2f. ActionBar コンポーネントセット

**バリアント軸**:
- `Style`: `default` / `solid`

計 **2 バリアント**。

| Style | bg | border-top |
|---|---|---|
| default | white/95（blur backdrop） | warm/200 |
| solid | primary-color/10 | primary-color/100 |

**共通スタイル**:
- 幅: 390px
- padding: 12px 24px
- vertical stack（space-y 8px）

→ **完了後: node-id を報告して次へ**

### 2g. ReqBadge コンポーネント

バリアントなし。1つのコンポーネント。

**仕様**:
- テキスト: "必須"
- フォント: Inter Regular 10px
- 色: `var(--color-attention)` = `#d70027`（secondary-color/700）
- border: 1px `#d70027`
- 角丸: 2px
- padding: 2px 4px

→ **完了後: node-id を報告して次へ**

### 2h. GroupCard コンポーネントセット

**バリアント軸**:
- `HasIcon`: `true` / `false`

計 **2 バリアント**。

**構造**（Auto Layout 縦）:
1. ヘッダー帯: bg `primary-color/10`、border-bottom 1px `primary-color/100`、padding 16px 24px
   - アイコン（32px × 32px、`primary-color/600`）+ タイトル（Noto Sans JP Bold 20px）
   - `HasIcon=false` はアイコンを非表示
2. コンテンツ: bg white、padding 24px

**外枠**:
- 角丸: 16px
- border: 1px `warm/200`
- shadow: y2 blur8 #00000010（shadow-sm）

→ **完了後: node-id を報告して次へ**

### 2i. Field コンポーネントセット

**バリアント軸**:
- `State`: `default` / `filled` / `error` / `disabled`

計 **4 バリアント**。

**構造**（Auto Layout 縦, gap 8px）:
1. Label: Noto Sans JP Medium 14px（text/caption）
2. Input: 幅 full、高さ 48px、角丸 12px、border 1px

| State | border | bg | text |
|---|---|---|---|
| default | warm/300 | white | neutral-400（placeholder） |
| filled | warm/300 | white | neutral-800 |
| error | #d70027 | #FFF5F5 | neutral-800 |
| disabled | warm/300 | #EFEFEF | neutral-400 |

→ **完了後: node-id を報告して次へ**

---

## フェーズ 3 — 完了確認・スクリーンショット

全コンポーネント完成後:

```
use_figma で以下を実行:
1. Components ページの全 ComponentSet に screenshot を撮る。
2. Variables コレクションの変数数を再確認。
3. 以下を return:
   {
     variables: { collections: [...], totalCount: N },
     textStyles: N個,
     components: [ { name, type, nodeId, variantCount } ]
   }
```

→ **スクリーンショットを見せて、作成完了を報告する。**

---

## 補足: 次フェーズ（STEP 1 画面描画）への引き継ぎ

完了後、以下を `my-app/figma-mcp-import-prompt-batched.md` に追記もしくは別途貼り付けてフェーズ1（商品概要画面描画）へ進む。  
引き継ぎ情報として必ず含める:
- Components ページの各 component の node-id
- Variables コレクションの collection-id
- `theo-tdf` モードの mode-id

==== 貼り付けここまで ====
