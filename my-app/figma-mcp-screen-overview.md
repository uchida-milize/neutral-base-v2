# 商品概要スクリーン — Figma 修正プロンプト（Claude Code + `use_figma`）
## 既存フレームを削除→再描画 or 全プロパティ上書き

> **対象**: Figma ファイル `7vRRacI3x2gedlqD0oj4ja`（無題）  
> **ページ**: 「MCP」（既存の商品概要フレームを対象）  
> **作業**: 5パターン（01〜05）を正確な寸法・色・レイアウトで再描画  
> **前提**: Phase 1（Variables/Components）完了済み。コンポーネントの node-id は控えてある。

---

==== ここから貼り付け ====

`~/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base/components/theo-tdf/claude-design/screens.tsx` の `ScreenOverview` および `ScreenCombined` コンポーネントを正として、5パターンの商品概要フレームを正確に再描画してください。

**絶対ルール（再確認）**:
- 色は Variables にバインド（生 hex 禁止、ただし gradient は `paint.gradientStops` で直指定）
- フォントは `await figma.loadFontAsync(...)` 必須
- 1回の `use_figma` = 最大10ノード。複数回に分けて実行
- 各呼び出し冒頭で `figma.setCurrentPageAsync(page)` を実行
- 完了ごとに node-id を返す

---

## 0. 事前確認

```js
// MCPページを取得し、既存の商品概要フレームを確認
const page = figma.root.children.find(p => p.name === "MCP");
await figma.setCurrentPageAsync(page);
const existing = page.children.map(n => ({ id: n.id, name: n.name, x: n.x, y: n.y }));
return existing;
```
→ 既存フレームがあれば名前を確認して削除するか確認する。

---

## 1. 共通定数（全フレームで使用）

```
FRAME_W = 390
HERO_H = 500
STATUS_H = 33       // ステータスバー高さ
APPBAR_H = 56       // AppBar 高さ（h-14）
CORNER_FRAME = 44   // 外枠の角丸（iPhone 15 Pro モック）

// グラデーション（Hero AppBar / Btn cta / Btn button）
GRAD_BLUE = { type:"GRADIENT_LINEAR", angle:135, stops:[{pos:0, r:7/255,g:95/255,b:227/255},{pos:1, r:100/255,g:176/255,b:247/255}] }
GRAD_RED  = { type:"GRADIENT_LINEAR", angle:135, stops:[{pos:0, r:232/255,g:58/255,b:60/255},{pos:1, r:246/255,g:106/255,b:108/255}] }

// primary-color/10 = #e9f2fe
PC10 = { r:233/255, g:242/255, b:254/255 }
// primary-color/100 = #98c1fc
PC100 = { r:152/255, g:193/255, b:252/255 }
// primary-color/500 = #065fe3
PC500 = { r:6/255, g:95/255, b:227/255 }
// warm/200 = #e7e5e4
WARM200 = { r:231/255, g:229/255, b:228/255 }
// neutral-800 = #1f2937
N800 = { r:31/255, g:41/255, b:55/255 }
// neutral-700 = #374151
N700 = { r:55/255, g:65/255, b:81/255 }
// neutral-500 = #6b7280
N500 = { r:107/255, g:114/255, b:128/255 }
// neutral-400 = #9ca3af
N400 = { r:156/255, g:163/255, b:175/255 }
// white
WHITE = { r:1, g:1, b:1 }
```

---

## 2. フレーム構造（01 パターンA）

フレーム名: `01 商品概要/パターンA`  
サイズ: 幅 390px × 高さ **自動**（Auto Layout 縦、コンテンツに合わせる）  
角丸: 44px（外枠）  
clipsContent: true  
配置: x=0, y=0

### 2-1. ヒーローセクション（高さ 500px 固定）

```
Frame名: "Hero"
w: 390, h: 500
clipsContent: true
position: auto layout 内の最初の子

子ノード（下から上へ重ねる）:
  1. "hero_bg" — Rectangle w:390 h:500
      fills: [{ type:"IMAGE", scaleMode:"FILL" }]
      ※ 画像は figma.createImage() で /assets/theo-tdf/hero_bg.png を読み込む
        → ローカルファイルは直接読めないため、代替として:
           fills: [{ type:"SOLID", color:{r:0.9,g:0.93,b:0.98}, opacity:1 }] でプレースホルダー
           + テキスト "📷 hero_bg.png" をグレーで中央配置
           + constraints: {horizontal:"STRETCH", vertical:"STRETCH"}

  2. "StatusBar" — Frame w:390 h:33, position absolute top:0
      bg: transparent
      children:
        - Text "9:41" → x:24, y:12, Inter Medium 12px, color N800
        - Text "5G  100%" → right:24, y:12, Inter Medium 12px, color N800

  3. "AppBar_Transparent" — Frame w:390 h:56, position absolute top:33
      bg: transparent（スクロール前の状態）
      ※ Figmaではtransparentとして描画。solid化後の見た目は別パターンで対応。

  4. "Logo_THEO" — Rectangle w:120 h:30, position absolute top:48 left:15
      fills: [{ type:"SOLID", color:PC500 }]
      ※ SVGロゴ代替: Rectangle + Text "THEO つみたて安心ほけん" 12px PC500

  5. "HeroText" — Frame w:350 h:auto, position absolute top:182 left:20
      auto layout 縦 gap:4
      children:
        - Text "Embedded Insurance" → Inter Regular 12px, letterSpacing 18%, N500, uppercase
        - Text "つみたてながら、\nもしもに備える。" → Noto Sans JP Bold 31px, lineHeight 1.3, N800
        - Text "将来に向けた\n資産形成のためのほけん" → Noto Sans JP Regular 16px, lineHeight 1.5, N700

  6. "hero-notch" — Rectangle w:390 h:24, position absolute bottom:0
      fills: WHITE, corner: 24px top-left/top-right のみ
      → 下端の白い逆角丸ノッチを再現
```

### 2-2. Steps（ステッパー）

```
コンポーネント: Components ページの "Steps/CurrentStep=1" インスタンスを挿入
幅: 390px
bg: white, border-bottom: 1px WARM200
padding: 8px 24px
```

### 2-3. メインコンテンツ（白→#F2FBFE グラデ背景）

```
Frame名: "MainContent"
w: 390, h: auto (auto layout 縦)
fills: gradient {from:WHITE, to:{r:0.949,g:0.984,b:0.996}} top→bottom
paddingLeft: 24, paddingRight: 24, paddingTop: 24
gap: 24

子ノード:

A. "引受保険会社行" — Frame w:fill, justify:flex-end
   children: Text "引受保険会社" 9px N400 + Image placeholder "logo_td.png" h:16px

B. "THEOお客様限定バッジ行" — Frame w:fill, justify:center
   children: 
     Pill Frame: bg PC500, rounded-full, px:16 py:8
       Text "THEOのお客様限定" Noto Sans JP Bold 13px WHITE

C. "THEOロゴ行" — Frame w:fill, justify:center
   children: Rectangle w:180 h:42, fills:PC500 (ロゴPH)

D. "3特徴アイコン" — Frame w:fill, layout:HORIZONTAL, gap:12
   children × 3:
     Frame w:fill h:auto, auto layout 縦, align:center, gap:8
       Rectangle w:36 h:36, fills:PC500 (アイコンPH)
       Text "積立も\nあんしんに" / "学資保険\nの代わりにも" / "もしもの\n備えに"
             Noto Sans JP Bold 14px lineHeight:1.4 N700 textAlign:center

E. "チャート画像" — Rectangle w:342 h:200
   fills: WARM200 (PH)
   label: Text "📷 chart_savings.png" N400 center

F. "詳細リンク" — Frame w:fill, justify:flex-end
   children: Text "詳細なサービス内容はこちら" 14px PC500 underline

G. "保障期間" — Frame w:fill, auto layout 縦, gap:8
   children:
     Text "保障期間" Noto Sans JP Bold 18px N800
     Text "5年〜40年（最大）" 16px N700
     Text "*保険期間は契約日（更新日）から1年であり..." 14px N500 lineHeight:1.5

H. "弊害防止リンク" — Frame w:fill, justify:flex-end
   children: Text "弊害防止措置等の対応について" 14px PC500 underline
```

### 2-4. 誘導ブロック（primary-10 フルブリード帯）

```
Frame名: "誘導ブロック"
w: 390, h: auto, auto layout 縦
paddingLeft:24, paddingRight:24, paddingTop:40, paddingBottom:18
fills: [{type:"SOLID", color:PC10}]
gap: 0

子ノード:

A. "必要書類セクション" — auto layout 縦, gap:8, align:center, mb:48
   Text "必要書類" Noto Sans JP Bold 24px N900 textAlign:center
   Text "お手続きの際に必要となる書類を\nご準備ください" 16px N500 center
   Rectangle w:80 h:64, fills:PC500 (クレカアイコンPH)
   Text "ご本人名義のクレジットカード" 14px Medium N600 center

B. "区切り線" — Line w:342 h:1, fills:PC100

C. "5プランセクション" — auto layout 縦, gap:8, align:center, mt:45 mb:24
   Text "5つのプランから選ぶだけ" Noto Sans JP Bold 24px N900 textAlign:center
   Text "最短10分で、お申し込みが完了します。" 16px N500 center

D. "いつでも見直しバッジ" — align:center
   Pill Frame: bg WHITE, shadow-sm, rounded-full, px:12 py:8
     Text "✓ いつでも見直し・解約OK" 14px Bold PC600

E. "↓ CTA誘導テキスト" — auto layout 縦, align:center, mt:32 gap:4
   Text "まずはプランを選んでみましょう" 14px Bold PC500
   Text "↓" 24px PC500 (chevron代替)
```

### 2-5. ActionBar（最下部固定）

```
Frame名: "ActionBar"
w: 390, h: auto
bg: PC10, border-top: 1px PC100
paddingLeft:24, paddingRight:24, paddingTop:12, paddingBottom:12
auto layout 縦, gap:8

children:
  A. "保険名称テキスト" — auto layout 縦, gap:2
     Text "保険名称" Inter 12px N400 tracking:14%
     Text "無配当特定疾病障害介護保障保険（団体型）" Noto Sans JP Regular 12px N700

  B. "CTA Button" — Frame w:fill h:64, rounded:14
     fills: GRAD_BLUE
     children: Text "プランを選ぶ ›" Noto Sans JP Bold 16px WHITE textAlign:center
```

---

## 3. パターン02 — 弊害防止モーダル開（fullSheet）

フレーム名: `02 商品概要/弊害防止措置等モーダル`  
基本構造はパターン01と同じ。以下を追加:

```
"HeigaiModal" — Frame w:390 h:auto
  position: absolute top:200 (モーダルシート表示位置)
  fills: WHITE, corner:24px (top-left/top-right のみ)
  shadow: 0 -4px 32px rgba(0,0,0,0.12)
  auto layout 縦, padding:24, gap:16

  children:
    "ドラッグハンドル" — Rectangle w:36 h:4, fills:WARM200, corner:2, align:center
    "タイトル" — Text "商品販売のご案内にあたり\nご確認・同意いただきたいこと" Noto Sans JP Bold 16px N800
    "本文スクロール域" — Frame w:342 h:320, clipsContent:true
      Text (本文) 14px N600 lineHeight:1.5
        "第三者提供の禁止に関する対応\nT&Dフィナンシャル生命保険株式会社は..."
    "CTAボタン行" — Frame w:fill, layout:HORIZONTAL, gap:12
      "キャンセルBtn" — Frame w:120 h:48, rounded:12
        bg:WARM200 Text "キャンセル" 14px N600
      "確認同意Btn" — Frame w:fill h:48, rounded:12
        bg:PC500 Text "確認して同意します" 14px Bold WHITE
```

---

## 4. パターン03〜05 — ScreenCombined（パターンB）

`screens.tsx` の `ScreenCombined` を参照。パターンA と異なる主要点:

```
03 パターンB（統合）: ScreenCombined go=noop sel="cancer_d" m=10000 y=15
04 パターンB/下部CTA未同意: + initialShowSend=true
05 パターンB/同意済CTA活性: + initialShowSend=true, initialAgree=true

ScreenCombined の構造 (ScreenOverview + ScreenStep2 をページ内で統合):
- Hero: ScreenOverview と同じ 500px ヒーロー
- Steps: n=1 (STEP 1 アクティブ)
- プランシミュレーションセクション (bg:PC10 帯):
    - "保険名称" GroupCard
    - "PLAN SIMULATION 保険料シミュレーション" ヘッダー
    - 生年月日フィールド (Field State=filled: "1990年01月01日")
    - 性別トグル (男性=選択 bg:PC500 WHITE / 女性=未選択 WHITE N600)
    - プランを選ぶ見出し
    - PlanCard×3 (がん保障型 ¥980/月 選択済 / がん保障型 ¥780 / 三大疾病型 ¥1,180)
    - 04/05 のみ: 弊害防止チェックボックス + 重要事項チェックボックス
- ActionBar:
    03: "内容を確認してください" テキスト + "PINコードを送信" Btn(button, disabled)
    04: 同上 disabled
    05: "よくあるご質問" リンク + "PINコードを送信" Btn(cta, active, gradient)
```

---

## 5. 完了確認

全5フレーム作成後:
```js
const page = figma.root.children.find(p => p.name === "MCP");
const frames = page.children.filter(n => n.type === "FRAME");
return frames.map(f => ({ id: f.id, name: f.name, w: f.width, h: f.height }));
```
→ 各フレームのサイズと node-id を報告して停止。

==== 貼り付けここまで ====

---

## チェックポイント（Figma との差分確認用）

| 要素 | 正しい値 | よくある間違い |
|---|---|---|
| Hero 高さ | 500px | 300px以下に縮まる |
| Headline フォント | 31px Bold | 16〜20px |
| ActionBar CTA | 64px h gradient | 48px solid blue |
| 誘導ブロック bg | primary-color/10 (#e9f2fe) | 白または透明 |
| ヒーロー重なり | 絶対配置でロゴ/テキストをオーバーレイ | 縦積みでずれる |
| Steps | 390px full-width | 狭い幅 |
