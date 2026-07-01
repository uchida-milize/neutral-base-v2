# 商品概要スクリーン 修正プロンプト（アセットコンポーネント参照版）
## Claude Code + `use_figma` — 既存フレームを削除して再描画

> **対象ファイル**: `7vRRacI3x2gedlqD0oj4ja`（無題）  
> **対象ページ**: `MCP`（id: `0:1`）  
> **Assetsページ**: id `22:135`（コンポーネント済み）

---

==== ここから貼り付け ====

`~/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base/components/theo-tdf/claude-design/screens.tsx` の `ScreenOverview`・`ScreenCombined` を正として、商品概要5フレームを再描画します。

**絶対ルール**:
- フォントは `figma.loadFontAsync` 必須（text ノード作成前）
- 色は 0〜1 レンジ（÷255）
- 1回の `use_figma` = 最大10ノード操作
- 各呼び出し冒頭で `await figma.setCurrentPageAsync(page)` を実行
- node-id は毎回 `return` で報告
- アセットは下記 node-id を `figma.getNodeByIdAsync()` で取得してインスタンス挿入

---

## アセット node-id 一覧（Assets ページ id: 22:135）

```js
const ASSETS = {
  hero_bg:              "22:186",  // img/hero_bg (750×1334)
  chart_savings:        "22:190",  // img/chart_savings (2576×1632)
  chart_savings_small:  "22:185",  // img/chart_savings_small (1024×649)
  logo_td:              "22:179",  // img/logo_td (316×44)
  logo_theo_blue:       "22:178",  // logo/theo_insurance_blue (139×34)
  logo_theo_white:      "22:177",  // logo/theo_insurance_white (139×34)
  logo_td_insurance:    "22:180",  // logo/logo_td_insurance (240×66)
  logo_td_financial:    "22:181",  // logo/logo_td_financial (400×63)
  icon_activity:        "22:192",  // icon/activity-heart-circle (24×24)
  icon_graduation:      "22:189",  // icon/graduation-cap (24×24)
  icon_hand:            "22:188",  // icon/hand-holding-heart (24×24)
  icon_info:            "22:183",  // icon/info-circle (24×24)
  icon_hero_notch:      "22:184",  // icon/hero-notch (390×24)
  icon_person_heart:    "22:176",  // icon/person-heart (24×24)
  icon_letter_heart:    "22:182",  // icon/letter-heart-square (24×24)
  icon_calendar:        "22:191",  // icon/calendar (24×24)
};

// インスタンス生成ヘルパー
async function inst(id, w, h) {
  const comp = await figma.getNodeByIdAsync(id);
  const i = comp.createInstance();
  i.resize(w, h);
  return i;
}
```

---

## フェーズ 0 — 事前確認・既存フレーム削除

```js
const mcpPage = figma.root.children.find(p => p.name === "MCP");
await figma.setCurrentPageAsync(mcpPage);
// 既存の商品概要フレームを削除
const toDelete = mcpPage.children.filter(n =>
  n.name.startsWith("01 ") || n.name.startsWith("02 ") ||
  n.name.startsWith("03 ") || n.name.startsWith("04 ") ||
  n.name.startsWith("05 ")
);
toDelete.forEach(n => n.remove());
return { deleted: toDelete.length, remaining: mcpPage.children.map(n => n.name) };
```

---

## フェーズ 1 — 共通定数・フォントロード

```js
await Promise.all([
  figma.loadFontAsync({ family: "Noto Sans JP", style: "Regular" }),
  figma.loadFontAsync({ family: "Noto Sans JP", style: "Medium" }),
  figma.loadFontAsync({ family: "Noto Sans JP", style: "Bold" }),
  figma.loadFontAsync({ family: "Inter", style: "Regular" }),
  figma.loadFontAsync({ family: "Inter", style: "Medium" }),
  figma.loadFontAsync({ family: "Inter", style: "SemiBold" }),
]);

// 色定数
const C = {
  white:   { r:1,       g:1,       b:1       },
  pc10:    { r:233/255, g:242/255, b:254/255 },  // primary-color/10
  pc100:   { r:152/255, g:193/255, b:252/255 },  // primary-color/100
  pc500:   { r:6/255,   g:95/255,  b:227/255 },  // primary-color/500
  n400:    { r:156/255, g:163/255, b:175/255 },
  n500:    { r:107/255, g:114/255, b:128/255 },
  n600:    { r:75/255,  g:85/255,  b:99/255  },
  n700:    { r:55/255,  g:65/255,  b:81/255  },
  n800:    { r:31/255,  g:41/255,  b:55/255  },
  n900:    { r:17/255,  g:24/255,  b:39/255  },
  warm200: { r:231/255, g:229/255, b:228/255 },
  warm300: { r:214/255, g:211/255, b:209/255 },
};

// グラデーション（CTA button / AppBar）
const GRAD_BLUE = {
  type: "GRADIENT_LINEAR",
  gradientTransform: [[0.707, -0.707, 0.5], [0.707, 0.707, -0.207]],
  gradientStops: [
    { position: 0, color: { r:7/255,  g:95/255,  b:227/255, a:1 } },
    { position: 1, color: { r:100/255,g:176/255, b:247/255, a:1 } },
  ],
};

return "fonts and constants ready";
```

---

## フェーズ 2 — ScreenOverview ヘルパー関数定義

このフェーズでは Hero・Steps・MainContent・誘導ブロック・ActionBar を関数として定義し、フレームを組み立てます。**1フレーム単位**で呼び出してください。

### フレーム 01 — パターンA（ScreenOverview）

```js
const mcpPage = figma.root.children.find(p => p.name === "MCP");
await figma.setCurrentPageAsync(mcpPage);

await Promise.all([
  figma.loadFontAsync({ family: "Noto Sans JP", style: "Regular" }),
  figma.loadFontAsync({ family: "Noto Sans JP", style: "Medium" }),
  figma.loadFontAsync({ family: "Noto Sans JP", style: "Bold" }),
  figma.loadFontAsync({ family: "Inter", style: "Regular" }),
  figma.loadFontAsync({ family: "Inter", style: "Medium" }),
  figma.loadFontAsync({ family: "Inter", style: "SemiBold" }),
]);

// ---- ルートフレーム ----
const root = figma.createFrame();
root.name = "01 商品概要/パターンA";
root.resize(390, 100);
root.layoutMode = "VERTICAL";
root.primaryAxisSizingMode = "AUTO";
root.counterAxisSizingMode = "FIXED";
root.fills = [{ type:"SOLID", color:{r:1,g:1,b:1} }];
root.cornerRadius = 44;
root.clipsContent = true;
root.x = 0; root.y = 0;
mcpPage.appendChild(root);

// ---- HERO セクション (500px) ----
const hero = figma.createFrame();
hero.name = "Hero";
hero.resize(390, 500);
hero.layoutMode = "NONE"; // absolute children
hero.fills = [{ type:"SOLID", color:{r:1,g:1,b:1} }]; // 背景白（imgで上書き）
hero.clipsContent = true;

// hero_bg 画像インスタンス（750×1334 → 390幅にscale）
const heroBgComp = await figma.getNodeByIdAsync("22:186");
const heroBg = heroBgComp.createInstance();
heroBg.name = "hero_bg";
heroBg.resize(390, 693); // 390/750 * 1334 ≈ 693
heroBg.x = 0; heroBg.y = 0;
hero.appendChild(heroBg);

// ステータスバー
const statusBar = figma.createFrame();
statusBar.name = "StatusBar";
statusBar.resize(390, 33);
statusBar.x = 0; statusBar.y = 0;
statusBar.layoutMode = "HORIZONTAL";
statusBar.primaryAxisAlignItems = "SPACE_BETWEEN";
statusBar.paddingLeft = 24; statusBar.paddingRight = 24;
statusBar.paddingTop = 12;
statusBar.fills = [];
const t941 = figma.createText();
t941.fontName = { family:"Inter", style:"Medium" };
t941.fontSize = 12; t941.characters = "9:41";
t941.fills = [{ type:"SOLID", color:{r:1,g:1,b:1} }];
const t5g = figma.createText();
t5g.fontName = { family:"Inter", style:"Medium" };
t5g.fontSize = 12; t5g.characters = "5G  100%";
t5g.fills = [{ type:"SOLID", color:{r:1,g:1,b:1} }];
statusBar.appendChild(t941); statusBar.appendChild(t5g);
hero.appendChild(statusBar);

// THEO ロゴ（logo/theo_insurance_blue 139×34 → h:30）
const logoComp = await figma.getNodeByIdAsync("22:178");
const logoInst = logoComp.createInstance();
logoInst.name = "Logo_THEO";
logoInst.resize(125, 30);
logoInst.x = 15; logoInst.y = 48;
hero.appendChild(logoInst);

// ヒーローテキスト（絶対配置 top:182）
const htFrame = figma.createFrame();
htFrame.name = "HeroText";
htFrame.resize(350, 120);
htFrame.x = 20; htFrame.y = 182;
htFrame.layoutMode = "VERTICAL"; htFrame.itemSpacing = 4;
htFrame.fills = []; htFrame.clipsContent = false;

const tEmb = figma.createText();
tEmb.fontName = { family:"Inter", style:"Regular" };
tEmb.fontSize = 12; tEmb.characters = "Embedded Insurance";
tEmb.letterSpacing = { value:18, unit:"PERCENT" };
tEmb.fills = [{ type:"SOLID", color:{r:1,g:1,b:1}, opacity:0.8 }];

const tH1 = figma.createText();
tH1.fontName = { family:"Noto Sans JP", style:"Bold" };
tH1.fontSize = 31;
tH1.lineHeight = { value:130, unit:"PERCENT" };
tH1.characters = "つみたてながら、\nもしもに備える。";
tH1.fills = [{ type:"SOLID", color:{r:1,g:1,b:1} }];

const tSub = figma.createText();
tSub.fontName = { family:"Noto Sans JP", style:"Regular" };
tSub.fontSize = 16;
tSub.lineHeight = { value:150, unit:"PERCENT" };
tSub.characters = "将来に向けた\n資産形成のためのほけん";
tSub.fills = [{ type:"SOLID", color:{r:1,g:1,b:1}, opacity:0.9 }];

htFrame.appendChild(tEmb); htFrame.appendChild(tH1); htFrame.appendChild(tSub);
hero.appendChild(htFrame);

// hero-notch（390×24、hero下端）
const notchComp = await figma.getNodeByIdAsync("22:184");
const notchInst = notchComp.createInstance();
notchInst.name = "hero-notch";
notchInst.resize(390, 24);
notchInst.x = 0; notchInst.y = 476;
hero.appendChild(notchInst);

root.appendChild(hero);
return { frameId: root.id, heroId: hero.id };
```

---

### フェーズ 2b — Steps + MainContent（フレーム01 続き）

```js
const mcpPage = figma.root.children.find(p => p.name === "MCP");
await figma.setCurrentPageAsync(mcpPage);
await Promise.all([
  figma.loadFontAsync({ family: "Noto Sans JP", style: "Regular" }),
  figma.loadFontAsync({ family: "Noto Sans JP", style: "Medium" }),
  figma.loadFontAsync({ family: "Noto Sans JP", style: "Bold" }),
  figma.loadFontAsync({ family: "Inter", style: "Regular" }),
]);

const root = mcpPage.children.find(n => n.name === "01 商品概要/パターンA");

// ---- Steps バー ----
const stepsBar = figma.createFrame();
stepsBar.name = "Steps";
stepsBar.resize(390, 48);
stepsBar.layoutMode = "HORIZONTAL";
stepsBar.primaryAxisAlignItems = "CENTER";
stepsBar.counterAxisAlignItems = "CENTER";
stepsBar.paddingLeft = 24; stepsBar.paddingRight = 24;
stepsBar.itemSpacing = 0;
stepsBar.fills = [{ type:"SOLID", color:{r:1,g:1,b:1} }];
stepsBar.strokeBottomWeight = 1;
stepsBar.strokes = [{ type:"SOLID", color:{r:231/255,g:229/255,b:228/255} }];
stepsBar.strokeAlign = "INSIDE";

// 5ステップ（circle + line）
for (let i = 1; i <= 5; i++) {
  const circle = figma.createEllipse();
  circle.resize(28, 28);
  if (i === 1) { // active
    circle.fills = [{ type:"SOLID", color:{r:6/255,g:95/255,b:227/255} }];
    circle.strokes = [];
  } else {
    circle.fills = [{ type:"SOLID", color:{r:1,g:1,b:1} }];
    circle.strokes = [{ type:"SOLID", color:{r:214/255,g:211/255,b:209/255} }];
    circle.strokeWeight = 1.5;
  }
  const tn = figma.createText();
  tn.fontName = { family:"Inter", style:i===1?"SemiBold":"Regular" };
  tn.fontSize = 12; tn.characters = String(i);
  tn.fills = [{ type:"SOLID", color: i===1 ? {r:1,g:1,b:1} : {r:156/255,g:163/255,b:175/255} }];
  stepsBar.appendChild(circle);
  if (i < 5) {
    const line = figma.createLine();
    line.resize(28, 0);
    line.strokes = [{ type:"SOLID", color: {r:231/255,g:229/255,b:228/255} }];
    line.strokeWeight = 2;
    stepsBar.appendChild(line);
  }
}
root.appendChild(stepsBar);

// ---- MainContent ----
const main = figma.createFrame();
main.name = "MainContent";
main.resize(390, 100);
main.layoutMode = "VERTICAL";
main.primaryAxisSizingMode = "AUTO";
main.counterAxisSizingMode = "FIXED";
main.paddingLeft = 24; main.paddingRight = 24;
main.paddingTop = 24; main.paddingBottom = 0;
main.itemSpacing = 24;
main.fills = [{
  type:"GRADIENT_LINEAR",
  gradientTransform: [[0,1,0],[0,-1,1]], // top→bottom
  gradientStops: [
    { position:0, color:{r:1,g:1,b:1,a:1} },
    { position:1, color:{r:0.949,g:0.984,b:0.996,a:1} },
  ]
}];

// 引受保険会社行
const issuerRow = figma.createFrame();
issuerRow.name = "引受保険会社";
issuerRow.resize(342, 20);
issuerRow.layoutMode = "HORIZONTAL";
issuerRow.primaryAxisAlignItems = "MAX"; // right
issuerRow.counterAxisAlignItems = "CENTER";
issuerRow.itemSpacing = 8;
issuerRow.fills = [];
const tIssuer = figma.createText();
tIssuer.fontName = { family:"Noto Sans JP", style:"Regular" };
tIssuer.fontSize = 9; tIssuer.characters = "引受保険会社";
tIssuer.fills = [{ type:"SOLID", color:{r:156/255,g:163/255,b:175/255} }];
const logoTdComp = await figma.getNodeByIdAsync("22:179");
const logoTdInst = logoTdComp.createInstance();
logoTdInst.resize(72, 10); // 316×44 → 72×10 (scale 0.23)
issuerRow.appendChild(tIssuer); issuerRow.appendChild(logoTdInst);
main.appendChild(issuerRow);

// THEOお客様限定バッジ
const badgeWrap = figma.createFrame();
badgeWrap.name = "THEOお客様限定";
badgeWrap.resize(342, 36);
badgeWrap.layoutMode = "HORIZONTAL";
badgeWrap.primaryAxisAlignItems = "CENTER";
badgeWrap.fills = [];
const badge = figma.createFrame();
badge.name = "pill";
badge.layoutMode = "HORIZONTAL";
badge.paddingLeft = 16; badge.paddingRight = 16;
badge.paddingTop = 8; badge.paddingBottom = 8;
badge.cornerRadius = 100;
badge.fills = [{ type:"SOLID", color:{r:6/255,g:95/255,b:227/255} }];
badge.primaryAxisSizingMode = "AUTO"; badge.counterAxisSizingMode = "AUTO";
const tBadge = figma.createText();
tBadge.fontName = { family:"Noto Sans JP", style:"Bold" };
tBadge.fontSize = 13; tBadge.characters = "THEOのお客様限定";
tBadge.fills = [{ type:"SOLID", color:{r:1,g:1,b:1} }];
badge.appendChild(tBadge); badgeWrap.appendChild(badge);
main.appendChild(badgeWrap);

// THEOロゴ（blue）
const logoTheoWrap = figma.createFrame();
logoTheoWrap.name = "THEOロゴ行";
logoTheoWrap.resize(342, 42);
logoTheoWrap.layoutMode = "HORIZONTAL";
logoTheoWrap.primaryAxisAlignItems = "CENTER";
logoTheoWrap.fills = [];
const logoTheoComp = await figma.getNodeByIdAsync("22:178");
const logoTheoInst = logoTheoComp.createInstance();
logoTheoInst.resize(139, 34);
logoTheoWrap.appendChild(logoTheoInst);
main.appendChild(logoTheoWrap);

root.appendChild(main);
return { rootId: root.id, stepsId: stepsBar.id, mainId: main.id };
```

---

### フェーズ 2c — 3アイコン・チャート・テキスト（フレーム01 続き）

```js
const mcpPage = figma.root.children.find(p => p.name === "MCP");
await figma.setCurrentPageAsync(mcpPage);
await Promise.all([
  figma.loadFontAsync({ family: "Noto Sans JP", style: "Regular" }),
  figma.loadFontAsync({ family: "Noto Sans JP", style: "Medium" }),
  figma.loadFontAsync({ family: "Noto Sans JP", style: "Bold" }),
]);

const root = mcpPage.children.find(n => n.name === "01 商品概要/パターンA");
const main = root.findOne(n => n.name === "MainContent");

// 3特徴アイコン行
const iconsRow = figma.createFrame();
iconsRow.name = "3特徴アイコン";
iconsRow.resize(342, 80);
iconsRow.layoutMode = "HORIZONTAL";
iconsRow.counterAxisAlignItems = "CENTER";
iconsRow.itemSpacing = 12;
iconsRow.fills = [];
const iconDefs = [
  { id:"22:192", label:"積立も\nあんしんに" },
  { id:"22:189", label:"学資保険\nの代わりにも" },
  { id:"22:188", label:"もしもの\n備えに" },
];
for (const d of iconDefs) {
  const col = figma.createFrame();
  col.layoutMode = "VERTICAL";
  col.counterAxisAlignItems = "CENTER";
  col.itemSpacing = 8;
  col.fills = [];
  col.layoutGrow = 1;
  col.primaryAxisSizingMode = "AUTO";
  const ic = await figma.getNodeByIdAsync(d.id);
  const icInst = ic.createInstance();
  icInst.resize(36, 36);
  const tLabel = figma.createText();
  tLabel.fontName = { family:"Noto Sans JP", style:"Bold" };
  tLabel.fontSize = 13;
  tLabel.lineHeight = { value:140, unit:"PERCENT" };
  tLabel.characters = d.label;
  tLabel.textAlignHorizontal = "CENTER";
  tLabel.fills = [{ type:"SOLID", color:{r:55/255,g:65/255,b:81/255} }];
  col.appendChild(icInst); col.appendChild(tLabel);
  iconsRow.appendChild(col);
}
main.appendChild(iconsRow);

// チャート画像（chart_savings）
const chartComp = await figma.getNodeByIdAsync("22:190");
const chartInst = chartComp.createInstance();
chartInst.name = "chart_savings";
chartInst.resize(342, 156); // 幅342 アスペクト比 2576:1632 → 342×217 だが画面実測約156
main.appendChild(chartInst);

// 詳細リンク
const detailLink = figma.createText();
detailLink.fontName = { family:"Noto Sans JP", style:"Bold" };
detailLink.fontSize = 14; detailLink.characters = "詳細なサービス内容はこちら →";
detailLink.fills = [{ type:"SOLID", color:{r:6/255,g:95/255,b:227/255} }];
detailLink.textDecoration = "UNDERLINE";
detailLink.textAlignHorizontal = "RIGHT";
detailLink.resize(342, 20);
main.appendChild(detailLink);

// 保障期間
const hoshoFrame = figma.createFrame();
hoshoFrame.name = "保障期間";
hoshoFrame.layoutMode = "VERTICAL"; hoshoFrame.itemSpacing = 6;
hoshoFrame.fills = []; hoshoFrame.resize(342, 80);
hoshoFrame.primaryAxisSizingMode = "AUTO";
const tHTitle = figma.createText();
tHTitle.fontName = { family:"Noto Sans JP", style:"Bold" };
tHTitle.fontSize = 18; tHTitle.characters = "保障期間";
tHTitle.fills = [{ type:"SOLID", color:{r:31/255,g:41/255,b:55/255} }];
const tHBody = figma.createText();
tHBody.fontName = { family:"Noto Sans JP", style:"Regular" };
tHBody.fontSize = 16; tHBody.characters = "5年〜40年（最大）";
tHBody.fills = [{ type:"SOLID", color:{r:55/255,g:65/255,b:81/255} }];
const tHNote = figma.createText();
tHNote.fontName = { family:"Noto Sans JP", style:"Regular" };
tHNote.fontSize = 14;
tHNote.lineHeight = { value:150, unit:"PERCENT" };
tHNote.characters = "*保険期間は契約日（更新日）から1年であり、保障期間満了まで1年ごとの更新となります。";
tHNote.fills = [{ type:"SOLID", color:{r:107/255,g:114/255,b:128/255} }];
tHNote.resize(342, 60);
hoshoFrame.appendChild(tHTitle); hoshoFrame.appendChild(tHBody); hoshoFrame.appendChild(tHNote);
main.appendChild(hoshoFrame);

// 弊害防止リンク
const heigaiLink = figma.createText();
heigaiLink.fontName = { family:"Noto Sans JP", style:"Bold" };
heigaiLink.fontSize = 14; heigaiLink.characters = "弊害防止措置等の対応について →";
heigaiLink.fills = [{ type:"SOLID", color:{r:6/255,g:95/255,b:227/255} }];
heigaiLink.textDecoration = "UNDERLINE";
heigaiLink.textAlignHorizontal = "RIGHT";
heigaiLink.resize(342, 20);
main.appendChild(heigaiLink);

return { mainId: main.id, childCount: main.children.length };
```

---

### フェーズ 2d — 誘導ブロック + ActionBar（フレーム01 完成）

```js
const mcpPage = figma.root.children.find(p => p.name === "MCP");
await figma.setCurrentPageAsync(mcpPage);
await Promise.all([
  figma.loadFontAsync({ family: "Noto Sans JP", style: "Regular" }),
  figma.loadFontAsync({ family: "Noto Sans JP", style: "Medium" }),
  figma.loadFontAsync({ family: "Noto Sans JP", style: "Bold" }),
  figma.loadFontAsync({ family: "Inter", style: "Medium" }),
]);

const root = mcpPage.children.find(n => n.name === "01 商品概要/パターンA");

// ---- 誘導ブロック（primary-10 フルブリード帯） ----
const yudo = figma.createFrame();
yudo.name = "誘導ブロック";
yudo.resize(390, 100);
yudo.layoutMode = "VERTICAL";
yudo.primaryAxisSizingMode = "AUTO";
yudo.counterAxisSizingMode = "FIXED";
yudo.paddingLeft = 24; yudo.paddingRight = 24;
yudo.paddingTop = 40; yudo.paddingBottom = 18;
yudo.itemSpacing = 0;
yudo.fills = [{ type:"SOLID", color:{r:233/255,g:242/255,b:254/255} }]; // primary-10

// 必要書類セクション
const hitsuyoSection = figma.createFrame();
hitsuyoSection.name = "必要書類セクション";
hitsuyoSection.layoutMode = "VERTICAL";
hitsuyoSection.counterAxisAlignItems = "CENTER";
hitsuyoSection.itemSpacing = 8;
hitsuyoSection.fills = [];
hitsuyoSection.paddingBottom = 40;
hitsuyoSection.primaryAxisSizingMode = "AUTO";
hitsuyoSection.counterAxisSizingMode = "FIXED";
hitsuyoSection.resize(342, 100);

const tHitsuyo = figma.createText();
tHitsuyo.fontName = { family:"Noto Sans JP", style:"Bold" };
tHitsuyo.fontSize = 24; tHitsuyo.characters = "必要書類";
tHitsuyo.fills = [{ type:"SOLID", color:{r:17/255,g:24/255,b:39/255} }];
tHitsuyo.textAlignHorizontal = "CENTER";

const tHitsuyo2 = figma.createText();
tHitsuyo2.fontName = { family:"Noto Sans JP", style:"Regular" };
tHitsuyo2.fontSize = 16;
tHitsuyo2.lineHeight = { value:150, unit:"PERCENT" };
tHitsuyo2.characters = "お手続きの際に必要となる書類を\nご準備ください";
tHitsuyo2.fills = [{ type:"SOLID", color:{r:107/255,g:114/255,b:128/255} }];
tHitsuyo2.textAlignHorizontal = "CENTER";

// クレカアイコン（person-heart で代替 or rectangle）
const cardRect = figma.createRectangle();
cardRect.resize(80, 64); cardRect.cornerRadius = 8;
cardRect.fills = [{ type:"SOLID", color:{r:6/255,g:95/255,b:227/255}, opacity:0.15 }];

const tCard = figma.createText();
tCard.fontName = { family:"Noto Sans JP", style:"Medium" };
tCard.fontSize = 14; tCard.characters = "ご本人名義のクレジットカード";
tCard.fills = [{ type:"SOLID", color:{r:75/255,g:85/255,b:99/255} }];
tCard.textAlignHorizontal = "CENTER";

hitsuyoSection.appendChild(tHitsuyo);
hitsuyoSection.appendChild(tHitsuyo2);
hitsuyoSection.appendChild(cardRect);
hitsuyoSection.appendChild(tCard);
yudo.appendChild(hitsuyoSection);

// 区切り線
const divider = figma.createLine();
divider.resize(342, 0);
divider.strokes = [{ type:"SOLID", color:{r:152/255,g:193/255,b:252/255} }];
divider.strokeWeight = 1;
yudo.appendChild(divider);

// 5プランセクション
const planSection = figma.createFrame();
planSection.name = "5プランセクション";
planSection.layoutMode = "VERTICAL";
planSection.counterAxisAlignItems = "CENTER";
planSection.itemSpacing = 8;
planSection.fills = [];
planSection.paddingTop = 40; planSection.paddingBottom = 24;
planSection.primaryAxisSizingMode = "AUTO";
planSection.counterAxisSizingMode = "FIXED";
planSection.resize(342, 100);

const tPlan = figma.createText();
tPlan.fontName = { family:"Noto Sans JP", style:"Bold" };
tPlan.fontSize = 24; tPlan.characters = "5つのプランから選ぶだけ";
tPlan.fills = [{ type:"SOLID", color:{r:17/255,g:24/255,b:39/255} }];
tPlan.textAlignHorizontal = "CENTER";

const tPlan2 = figma.createText();
tPlan2.fontName = { family:"Noto Sans JP", style:"Regular" };
tPlan2.fontSize = 16; tPlan2.characters = "最短10分で、お申し込みが完了します。";
tPlan2.fills = [{ type:"SOLID", color:{r:107/255,g:114/255,b:128/255} }];
tPlan2.textAlignHorizontal = "CENTER";

// いつでも見直しバッジ
const okBadge = figma.createFrame();
okBadge.layoutMode = "HORIZONTAL";
okBadge.paddingLeft = 12; okBadge.paddingRight = 12;
okBadge.paddingTop = 8; okBadge.paddingBottom = 8;
okBadge.cornerRadius = 100;
okBadge.fills = [{ type:"SOLID", color:{r:1,g:1,b:1} }];
okBadge.primaryAxisSizingMode = "AUTO"; okBadge.counterAxisSizingMode = "AUTO";
const tOk = figma.createText();
tOk.fontName = { family:"Noto Sans JP", style:"Bold" };
tOk.fontSize = 14; tOk.characters = "✓ いつでも見直し・解約OK";
tOk.fills = [{ type:"SOLID", color:{r:6/255,g:95/255,b:227/255} }];
okBadge.appendChild(tOk);

// CTAガイド
const ctaGuide = figma.createFrame();
ctaGuide.layoutMode = "VERTICAL";
ctaGuide.counterAxisAlignItems = "CENTER";
ctaGuide.itemSpacing = 4; ctaGuide.paddingTop = 32;
ctaGuide.fills = []; ctaGuide.primaryAxisSizingMode = "AUTO";
ctaGuide.counterAxisSizingMode = "FIXED"; ctaGuide.resize(342, 60);
const tGuide = figma.createText();
tGuide.fontName = { family:"Noto Sans JP", style:"Bold" };
tGuide.fontSize = 14; tGuide.characters = "まずはプランを選んでみましょう";
tGuide.fills = [{ type:"SOLID", color:{r:6/255,g:95/255,b:227/255} }];
tGuide.textAlignHorizontal = "CENTER";
const tChev = figma.createText();
tChev.fontName = { family:"Inter", style:"Regular" };
tChev.fontSize = 20; tChev.characters = "↓";
tChev.fills = [{ type:"SOLID", color:{r:6/255,g:95/255,b:227/255} }];
tChev.textAlignHorizontal = "CENTER";
ctaGuide.appendChild(tGuide); ctaGuide.appendChild(tChev);

planSection.appendChild(tPlan); planSection.appendChild(tPlan2);
planSection.appendChild(okBadge); planSection.appendChild(ctaGuide);
yudo.appendChild(planSection);
root.appendChild(yudo);

// ---- ActionBar（solid: primary-10 / border-top primary-100） ----
const actionBar = figma.createFrame();
actionBar.name = "ActionBar";
actionBar.resize(390, 100);
actionBar.layoutMode = "VERTICAL";
actionBar.primaryAxisSizingMode = "AUTO";
actionBar.counterAxisSizingMode = "FIXED";
actionBar.paddingLeft = 24; actionBar.paddingRight = 24;
actionBar.paddingTop = 12; actionBar.paddingBottom = 12;
actionBar.itemSpacing = 8;
actionBar.fills = [{ type:"SOLID", color:{r:233/255,g:242/255,b:254/255} }]; // pc10
actionBar.strokeTopWeight = 1;
actionBar.strokes = [{ type:"SOLID", color:{r:152/255,g:193/255,b:252/255} }];
actionBar.strokeAlign = "INSIDE";

// 保険名称テキスト
const insNameFrame = figma.createFrame();
insNameFrame.layoutMode = "VERTICAL"; insNameFrame.itemSpacing = 2;
insNameFrame.fills = []; insNameFrame.primaryAxisSizingMode = "AUTO";
insNameFrame.counterAxisSizingMode = "FIXED"; insNameFrame.resize(342, 32);
const tInsLabel = figma.createText();
tInsLabel.fontName = { family:"Inter", style:"Medium" };
tInsLabel.fontSize = 12; tInsLabel.characters = "保険名称";
tInsLabel.letterSpacing = { value:14, unit:"PERCENT" };
tInsLabel.fills = [{ type:"SOLID", color:{r:156/255,g:163/255,b:175/255} }];
const tInsName = figma.createText();
tInsName.fontName = { family:"Noto Sans JP", style:"Regular" };
tInsName.fontSize = 12; tInsName.characters = "無配当特定疾病障害介護保障保険（団体型）";
tInsName.fills = [{ type:"SOLID", color:{r:55/255,g:65/255,b:81/255} }];
insNameFrame.appendChild(tInsLabel); insNameFrame.appendChild(tInsName);
actionBar.appendChild(insNameFrame);

// CTAボタン（gradient blue h:64 rounded:14）
const ctaBtn = figma.createFrame();
ctaBtn.name = "Btn_CTA";
ctaBtn.resize(342, 64);
ctaBtn.cornerRadius = 14;
ctaBtn.layoutMode = "HORIZONTAL";
ctaBtn.primaryAxisAlignItems = "CENTER";
ctaBtn.counterAxisAlignItems = "CENTER";
ctaBtn.fills = [{
  type: "GRADIENT_LINEAR",
  gradientTransform: [[0.707, -0.707, 0.5], [0.707, 0.707, -0.207]],
  gradientStops: [
    { position:0, color:{r:7/255, g:95/255, b:227/255, a:1} },
    { position:1, color:{r:100/255, g:176/255, b:247/255, a:1} },
  ],
}];
const tCta = figma.createText();
tCta.fontName = { family:"Noto Sans JP", style:"Bold" };
tCta.fontSize = 16; tCta.characters = "プランを選ぶ ›";
tCta.fills = [{ type:"SOLID", color:{r:1,g:1,b:1} }];
ctaBtn.appendChild(tCta);
actionBar.appendChild(ctaBtn);

root.appendChild(actionBar);
return { rootId: root.id, totalHeight: root.height };
```

---

## フェーズ 3 — 残り4フレーム（02〜05）

フレーム01の作成が確認できたら、同様の手順で02〜05を作成します。

**フレーム02（弊害防止モーダル）**: フレーム01をクローン → HeigaiModalフレームを絶対配置で追加
```js
// フレーム01をコピーして02を作成
const frame01 = mcpPage.children.find(n => n.name === "01 商品概要/パターンA");
const frame02 = frame01.clone();
frame02.name = "02 商品概要/弊害防止措置等モーダル";
frame02.x = 430;
mcpPage.appendChild(frame02);
// → 次の use_figma でモーダルレイヤーを追加
```

**フレーム03〜05（ScreenCombined）**: 別途 `screens.tsx` の `ScreenCombined` 構造を参照して構築。
- x位置: 03=860, 04=1290, 05=1720
- Hero: フレーム01と同じ（clone可）
- Steps以降: PLAN SIMULATION セクション（`bg-primary-10` 帯）を追加

---

## 完了確認

```js
const mcpPage = figma.root.children.find(p => p.name === "MCP");
await figma.setCurrentPageAsync(mcpPage);
const frames = mcpPage.children.map(n => ({
  id: n.id, name: n.name,
  w: Math.round(n.width), h: Math.round(n.height),
  x: Math.round(n.x)
}));
return frames;
```

==== 貼り付けここまで ====
