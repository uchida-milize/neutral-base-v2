// ============================================================
//  THEO × T&Dフィナンシャル生命 — 16画面 Figma インポーター
//  UIUX_Importer プラグイン向け code.js
//  生成日: 2026-06-15
//
//  画面一覧 (390×820):
//   01 商品概要
//   02 プラン選択・デフォルト
//   03 プラン選択・重要事項ボトムシート
//   04 プラン選択・給付予想額アコーディオン展開
//   05 プラン選択・同意チェック済・CTA活性
//   06 PINコード認証・デフォルト
//   07 PINコード認証・666666入力済・認証ボタン活性
//   08 申込フォーム・デフォルト
//   09 申込フォーム・積立修正シート展開
//   10 内容確認・デフォルト
//   11 内容確認・お支払い詳細展開
//   12 内容確認・被保険者確認・日本国籍以外
//   13 内容確認・全チェック済・CTA活性
//   14 クレジットカード情報入力（外部）
//   15 クレジットカード確認（外部）
//   16 完了
//
//  プロトタイプフロー: 01→02→05→06→07→08→10→13→14→15→16→01
//  制約: Figma Plugin API 準拠 / Object.assign 構文なし /
//        ノードへの直接プロパティ拡張禁止 / Smart Animate 遷移付き
// ============================================================

(async function () {
  try {

  // ── フォント事前ロード ─────────────────────────────────────────
  await Promise.all([
    figma.loadFontAsync({ family: "Noto Sans JP", style: "Regular" }),
    figma.loadFontAsync({ family: "Noto Sans JP", style: "Medium" }),
    figma.loadFontAsync({ family: "Noto Sans JP", style: "Bold" }),
    figma.loadFontAsync({ family: "Inter", style: "Regular" }),
    figma.loadFontAsync({ family: "Inter", style: "Medium" }),
    figma.loadFontAsync({ family: "Inter", style: "Bold" }),
  ]);

  // ── カラーパレット (theo-tdf tokens) ──────────────────────────
  var C = {
    p500: { r: 0.024, g: 0.373, b: 0.890 },
    p600: { r: 0.020, g: 0.306, b: 0.729 },
    p300: { r: 0.184, g: 0.506, b: 0.980 },
    p10:  { r: 0.914, g: 0.949, b: 0.996 },
    p100: { r: 0.596, g: 0.757, b: 0.988 },
    btn:  { r: 0.000, g: 0.490, b: 1.000 },
    cta:  { r: 1.000, g: 0.176, b: 0.176 },
    sec:  { r: 1.000, g: 0.455, b: 0.553 },
    sec10:{ r: 1.000, g: 0.957, b: 0.965 },
    sec1: { r: 1.000, g: 0.894, b: 0.918 },
    w50:  { r: 0.980, g: 0.980, b: 0.976 },
    w100: { r: 0.961, g: 0.961, b: 0.957 },
    w200: { r: 0.906, g: 0.898, b: 0.894 },
    w300: { r: 0.839, g: 0.827, b: 0.820 },
    n800: { r: 0.122, g: 0.161, b: 0.216 },
    n700: { r: 0.200, g: 0.247, b: 0.314 },
    n600: { r: 0.294, g: 0.333, b: 0.388 },
    n500: { r: 0.420, g: 0.447, b: 0.502 },
    n400: { r: 0.612, g: 0.639, b: 0.686 },
    n300: { r: 0.792, g: 0.816, b: 0.855 },
    ex200:{ r: 0.878, g: 0.878, b: 0.878 },
    ex100:{ r: 0.941, g: 0.941, b: 0.941 },
    ex50: { r: 0.973, g: 0.973, b: 0.973 },
    white:{ r: 1, g: 1, b: 1 },
    dark: { r: 0.122, g: 0.161, b: 0.216 },
  };

  // ── ペイントヘルパー ───────────────────────────────────────────
  function fill(color, opacity) {
    var p = { type: "SOLID", color: color };
    if (opacity !== undefined) p.opacity = opacity;
    return [p];
  }
  function noFill() { return []; }

  // ── ノードファクトリ ───────────────────────────────────────────
  function frame(name, w, h, bg) {
    var f = figma.createFrame();
    f.name = name;
    f.resize(w, h);
    f.fills = fill(bg || C.w50);
    f.clipsContent = true;
    return f;
  }

  function rect(parent, x, y, w, h, bg, r) {
    var nd = figma.createRectangle();
    nd.x = x; nd.y = y; nd.resize(w, h);
    nd.fills = bg ? fill(bg) : noFill();
    if (r !== undefined) nd.cornerRadius = r;
    parent.appendChild(nd);
    return nd;
  }

  function rectBorder(parent, x, y, w, h, bg, borderColor, r, bw) {
    var nd = rect(parent, x, y, w, h, bg, r);
    nd.strokes = fill(borderColor);
    nd.strokeWeight = bw || 1;
    nd.strokeAlign = "INSIDE";
    return nd;
  }

  function txt(parent, x, y, content, opts) {
    var o = opts || {};
    var nd = figma.createText();
    nd.x = x; nd.y = y;
    var family = o.mono ? "Inter" : "Noto Sans JP";
    var wt = o.bold ? "Bold" : o.med ? "Medium" : "Regular";
    nd.fontName = { family: family, style: wt };
    nd.fontSize = o.size || 13;
    nd.fills = fill(o.color || C.n800);
    nd.characters = content;
    if (o.w) { nd.textAutoResize = "HEIGHT"; nd.resize(o.w, nd.height || 20); }
    if (o.center) nd.textAlignHorizontal = "CENTER";
    if (o.right)  nd.textAlignHorizontal = "RIGHT";
    if (o.lh) nd.lineHeight = { unit: "PIXELS", value: o.lh };
    parent.appendChild(nd);
    return nd;
  }

  function divider(parent, x, y, w, color) {
    var nd = figma.createRectangle();
    nd.x = x; nd.y = y; nd.resize(w, 1);
    nd.fills = fill(color || C.w200);
    parent.appendChild(nd);
    return nd;
  }

  // ── 共通UIパーツ ──────────────────────────────────────────────

  function appBar(f, y, opts) {
    var o = opts || {};
    var bg = o.gray ? C.ex200 : C.p500;
    rect(f, 0, y, 390, 56, bg);
    if (!o.gray) {
      rect(f, 8, y + 10, 36, 36, C.p600, 18);
      rect(f, 15, y + 22, 14, 2, C.white);
      rect(f, 15, y + 18, 2, 8, C.white);
      rect(f, 15, y + 22, 8, 2, C.white);
    }
    var label = o.gray ? "payment.gmo-pg.com" : "THEO  つみたて安心ほけん";
    var lc = o.gray ? C.n600 : C.white;
    txt(f, 0, y + 19, label, { size: 14, bold: !o.gray, color: lc, w: 390, center: true });
    return y + 56;
  }

  function steps(f, y, active) {
    rect(f, 0, y, 390, 44, C.white);
    divider(f, 0, y + 43, 390, C.w200);
    var total = 5;
    var cw = 28, lw = 24;
    var totalW = total * cw + (total - 1) * lw;
    var sx = Math.round((390 - totalW) / 2);
    for (var i = 1; i <= total; i++) {
      var cx = sx + (i - 1) * (cw + lw);
      var filled = i <= active;
      rect(f, cx, y + 8, cw, cw, filled ? C.p500 : C.w300, 14);
      txt(f, cx, y + 14, String(i), { size: 11, bold: true, color: filled ? C.white : C.n400, w: cw, center: true, mono: true });
      if (i < total) rect(f, cx + cw, y + 21, lw, 2, filled ? C.p500 : C.w200);
    }
    return y + 44;
  }

  function actionBar(f, y, h) {
    rect(f, 0, y, 390, h, C.white);
    divider(f, 0, y, 390, C.w200);
  }

  function button(f, x, y, w, label, kind, disabled) {
    var bgc = disabled
      ? (kind === "danger" ? { r:1.0,g:0.69,b:0.69 } : { r:0.72,g:0.80,b:0.95 })
      : kind === "danger" ? C.cta
      : kind === "outline" ? C.white
      : C.btn;
    var nd = rect(f, x, y, w, 48, bgc, 12);
    if (kind === "outline") {
      nd.strokes = fill(C.btn);
      nd.strokeWeight = 1.5;
      nd.strokeAlign = "INSIDE";
    }
    var fc = kind === "outline" ? C.btn : C.white;
    txt(f, x, y + 14, label, { size: 15, bold: true, color: fc, w: w, center: true });
    return y + 48;
  }

  function checkbox(f, x, y, checked) {
    rectBorder(f, x, y, 20, 20, checked ? C.p500 : C.white, checked ? C.p500 : C.w300, 5, 2);
    if (checked) txt(f, x + 2, y + 3, "✓", { size: 12, bold: true, color: C.white, w: 16, center: true });
  }

  function dataRow(f, x, y, w, key, value) {
    txt(f, x, y + 10, key, { size: 11, color: C.n500, w: Math.floor(w * 0.48) });
    txt(f, x + Math.floor(w * 0.52), y + 10, value, { size: 12, bold: true, color: C.n700, right: true, w: Math.floor(w * 0.46) });
    divider(f, x, y + 32, w, C.w200);
    return y + 36;
  }

  function inputField(f, x, y, w, label, placeholder, disabled) {
    txt(f, x, y, label, { size: 11, med: true, color: C.n600 });
    rectBorder(f, x, y + 16, w, 44, disabled ? C.w100 : C.white, disabled ? C.w200 : C.w300, 12, 1);
    txt(f, x + 12, y + 28, placeholder, { size: 13, color: disabled ? C.n400 : C.n300 });
    return y + 68;
  }

  // lock icon (drawn, no emoji)
  function lockIcon(f, bx, by) {
    rect(f, bx, by, 64, 64, C.p10, 32);
    // shackle: left, right, top
    rect(f, bx + 21, by + 11, 4, 22, C.p500);
    rect(f, bx + 39, by + 11, 4, 22, C.p500);
    rect(f, bx + 21, by + 11, 22, 4, C.p500, 2);
    // body
    rect(f, bx + 17, by + 29, 30, 22, C.p500, 5);
    // keyhole
    rect(f, bx + 29, by + 35, 6, 12, C.p10, 3);
  }

  // ── Smart Animate 遷移リアクション ────────────────────────────
  function linkFrames(srcNode, dstId) {
    srcNode.reactions = [{
      action: {
        type: "NODE",
        destinationId: dstId,
        navigation: "NAVIGATE",
        transition: {
          type: "SMART_ANIMATE",
          easing: { type: "EASE_OUT" },
          duration: 300,
        },
        preserveScrollPosition: false,
      },
      trigger: { type: "ON_CLICK" },
    }];
  }

  // ============================================================
  //  画面 01 — 商品概要
  // ============================================================
  function drawS01() {
    var f = frame("01 商品概要", 390, 820, C.w50);
    var y = appBar(f, 0, {});
    y = steps(f, y, 1);

    rect(f, 0, y, 390, 200, C.p500);
    var o1 = rect(f, 0, y, 390, 200, C.w50); o1.opacity = 0.12;
    txt(f, 20, y + 18, "THEO  つみたて安心ほけん", { size: 12, bold: true, color: C.white });
    txt(f, 20, y + 48, "信頼を、もっと", { size: 26, bold: true, color: C.n800 });
    txt(f, 20, y + 80, "触れる距離に。", { size: 26, bold: true, color: C.n800 });
    txt(f, 20, y + 116, "THEOの資産運用に、もしものときの備えをひとつに。", { size: 12, color: C.n600, w: 340 });
    rect(f, 20, y + 148, 44, 22, C.sec10, 11);
    txt(f, 20, y + 152, "重要", { size: 10, med: true, color: C.sec, w: 44, center: true });
    y += 208;

    rectBorder(f, 16, y, 358, 140, C.white, C.w200, 16, 1);
    txt(f, 28, y + 14, "このアプリだけの備え", { size: 10, color: C.n400, mono: true });
    txt(f, 28, y + 36, "働けなくなっても、\nつみたては止めない。", { size: 17, bold: true, color: C.n800, w: 300, lh: 26 });
    txt(f, 28, y + 94, "就業不能時に、毎月の積立額を保険金として給付。資産形成の歩みを止めません。", { size: 11, color: C.n500, w: 310 });
    y += 152;

    var vps = [
      ["申込みは10分", "クレジットカード払い。入力は最小限。"],
      ["マイページでかんたん運用管理", "保険料変更・給付額変更・ご請求など。"],
      ["少額から、毎月", "月額数百円から。いつでも見直し可能。"],
    ];
    for (var i = 0; i < vps.length; i++) {
      rectBorder(f, 16, y + 4, 358, 56, C.white, C.w200, 12, 1);
      rect(f, 28, y + 14, 34, 34, C.p10, 17);
      txt(f, 72, y + 17, vps[i][0], { size: 13, bold: true, color: C.n800, w: 280 });
      txt(f, 72, y + 34, vps[i][1], { size: 11, color: C.n500, w: 280 });
      y += 68;
    }

    rect(f, 16, y + 4, 358, 48, C.w100, 12);
    txt(f, 28, y + 18, "保険料", { size: 12, color: C.n500 });
    txt(f, 200, y + 8, "480", { size: 28, bold: true, color: C.p500, w: 140, right: true, mono: true });
    txt(f, 346, y + 18, " 円/月〜", { size: 13, color: C.n800 });

    actionBar(f, 820 - 68, 68);
    button(f, 20, 820 - 58, 350, "つぎへ  ›", "button", false);
    return f;
  }

  // ============================================================
  //  画面 02 — プラン選択・デフォルト
  // ============================================================
  function drawS02() {
    var f = frame("02 プラン選択・デフォルト", 390, 820, C.w50);
    var y = appBar(f, 0, {});
    y = steps(f, y, 2);

    rect(f, 0, y, 390, 38, C.p10);
    txt(f, 16, y + 12, "つみたて安心ほけんのプランをお選びください", { size: 11, color: C.n600, w: 360 });
    y += 38;

    var plans = [
      { name: "障害・介護",  price: "480 円/月",   lead: "障害・介護状態になった場合に給付金が支払われます",          tag: null,      sel: false },
      { name: "がん",        price: "980 円/月",   lead: "初めてがんと診断された場合に給付金が支払われます",          tag: null,      sel: false },
      { name: "安心セット",  price: "1,290 円/月", lead: "障害・介護状態またはがんと診断された場合に給付",           tag: "おすすめ", sel: true  },
    ];
    for (var i = 0; i < plans.length; i++) {
      var p = plans[i];
      rectBorder(f, 16, y + 4, 358, 112, p.sel ? C.p10 : C.white, p.sel ? C.p500 : C.w200, 14, p.sel ? 2 : 1);
      rect(f, 16, y + 4, 358, 38, p.sel ? C.p10 : C.w100, 0);
      divider(f, 16, y + 41, 358, p.sel ? C.p100 : C.w200);
      checkbox(f, 28, y + 13, p.sel);
      txt(f, 58, y + 14, p.name, { size: 14, bold: true, color: C.n800 });
      if (p.tag) { rect(f, 286, y + 12, 72, 22, C.sec10, 11); txt(f, 286, y + 15, p.tag, { size: 10, med: true, color: C.sec, w: 72, center: true }); }
      txt(f, 28, y + 50, p.lead, { size: 11, color: C.n500, w: 320 });
      txt(f, 0, y + 84, p.price, { size: 18, bold: true, color: C.n800, right: true, w: 360, mono: true });
      y += 120;
    }

    divider(f, 16, y + 4, 358);
    txt(f, 16, y + 14, "将来の給付金予想額を確認する  ∨", { size: 13, color: C.n800, w: 340 });
    y += 44;

    rect(f, 16, y + 4, 358, 48, C.sec10, 12);
    rectBorder(f, 16, y + 4, 358, 48, null, C.sec1, 12, 1);
    txt(f, 28, y + 18, "重要  重要事項をご確認ください  ∨", { size: 13, bold: true, color: C.cta, w: 320 });

    actionBar(f, 820 - 88, 88);
    checkbox(f, 20, 820 - 80, false);
    txt(f, 46, 820 - 80, "①④⑤⑥⑦⑧について確認、②③について同意する", { size: 11, color: C.n600, w: 320 });
    var ctaBtn = rect(f, 20, 820 - 52, 350, 40, C.cta, 10);
    ctaBtn.opacity = 0.40;
    txt(f, 20, 820 - 40, "上記に同意してメールを送信", { size: 14, bold: true, color: C.white, w: 350, center: true });
    txt(f, 0, 820 - 10, "上記に確認・同意すると進めます", { size: 10, color: C.n400, w: 390, center: true });
    return f;
  }

  // ============================================================
  //  画面 03 — プラン選択・重要事項ボトムシート  [NEW]
  // ============================================================
  function drawS03() {
    var f = frame("03 プラン選択・重要事項ボトムシート", 390, 820, C.w50);
    var y = appBar(f, 0, {});
    y = steps(f, y, 2);

    // 背景 (先頭1枚のプランカードのみ見える)
    rect(f, 0, y, 390, 38, C.p10);
    txt(f, 16, y + 12, "つみたて安心ほけんのプランをお選びください", { size: 11, color: C.n600, w: 360 });
    y += 38;
    rectBorder(f, 16, y + 4, 358, 112, C.white, C.w200, 14, 1);
    checkbox(f, 28, y + 13, false);
    txt(f, 58, y + 14, "障害・介護", { size: 14, bold: true, color: C.n800 });

    // ダークオーバーレイ
    var ov = rect(f, 0, 0, 390, 820, C.dark);
    ov.opacity = 0.40;

    // ボトムシート
    var sh = 280;
    rect(f, 0, sh, 390, 820 - sh, C.white, 20);
    rect(f, 170, sh + 10, 50, 4, C.w300, 2);
    txt(f, 16, sh + 28, "重要", { size: 10, med: true, color: C.cta });
    txt(f, 48, sh + 26, "重要事項をご確認ください", { size: 16, bold: true, color: C.n800 });
    divider(f, 16, sh + 58, 358, C.w200);

    var items = [
      "① 申込に関する注意事項の確認",
      "② 個人情報のお取り扱いについて",
      "③ ペーパーレス申込の同意",
      "④ 健康告知について",
      "⑤ 被保険者の確認",
      "⑥ 重要事項説明の確認",
      "⑦ 意向の確認",
      "⑧ ほけん商品のお問い合わせ",
    ];
    var iy = sh + 68;
    for (var j = 0; j < items.length; j++) {
      rectBorder(f, 16, iy, 358, 44, C.white, C.w200, 12, 1);
      txt(f, 28, iy + 15, items[j], { size: 13, bold: true, color: C.n800, w: 300 });
      txt(f, 352, iy + 16, "›", { size: 14, color: C.p500 });
      iy += 50;
    }
    rect(f, 0, 820 - 68, 390, 68, C.white);
    divider(f, 0, 820 - 68, 390, C.w200);
    button(f, 16, 820 - 58, 358, "閉じる", "outline", false);
    return f;
  }

  // ============================================================
  //  画面 04 — プラン選択・給付予想額アコーディオン展開  [NEW]
  // ============================================================
  function drawS04() {
    var f = frame("04 プラン選択・給付予想額展開", 390, 820, C.w50);
    var y = appBar(f, 0, {});
    y = steps(f, y, 2);

    rect(f, 0, y, 390, 38, C.p10);
    txt(f, 16, y + 12, "つみたて安心ほけんのプランをお選びください", { size: 11, color: C.n600, w: 360 });
    y += 38;

    // プランカード compact (76px)
    var plans4 = [
      { name: "障害・介護",  price: "480 円/月",   sel: false },
      { name: "がん",        price: "980 円/月",   sel: false },
      { name: "安心セット",  price: "1,290 円/月", sel: true, tag: "おすすめ" },
    ];
    for (var i = 0; i < plans4.length; i++) {
      var p4 = plans4[i];
      rectBorder(f, 16, y + 4, 358, 66, p4.sel ? C.p10 : C.white, p4.sel ? C.p500 : C.w200, 14, p4.sel ? 2 : 1);
      checkbox(f, 28, y + 23, p4.sel);
      txt(f, 58, y + 23, p4.name, { size: 14, bold: true, color: C.n800 });
      if (p4.tag) { rect(f, 286, y + 20, 72, 22, C.sec10, 11); txt(f, 286, y + 24, p4.tag, { size: 10, med: true, color: C.sec, w: 72, center: true }); }
      txt(f, 0, y + 46, p4.price, { size: 16, bold: true, color: p4.sel ? C.p500 : C.n800, right: true, w: 360, mono: true });
      y += 76;
    }

    // シミュレーター展開
    divider(f, 16, y + 4, 358);
    txt(f, 16, y + 14, "将来の給付金予想額を確認する  ∧", { size: 13, bold: true, color: C.n800, w: 340 });
    y += 44;
    rectBorder(f, 16, y, 358, 168, C.p10, C.p100, 12, 1);
    txt(f, 28, y + 14, "毎月の積立金額", { size: 11, color: C.n600 });
    txt(f, 28, y + 30, "10,000 円/月", { size: 18, bold: true, color: C.n800, mono: true });
    rect(f, 28, y + 60, 330, 4, C.w300, 2);
    rect(f, 28, y + 60, 152, 4, C.p500, 2);
    rect(f, 173, y + 54, 16, 16, C.p500, 8);
    txt(f, 28, y + 84, "保障期間", { size: 11, color: C.n600 });
    txt(f, 28, y + 100, "15 年", { size: 18, bold: true, color: C.n800, mono: true });
    divider(f, 28, y + 128, 330, C.p100);
    txt(f, 28, y + 136, "給付予想額（一時金）", { size: 11, color: C.n600 });
    txt(f, 0, y + 148, "1,800,000 円", { size: 18, bold: true, color: C.p500, right: true, w: 355, mono: true });
    y += 176;

    rect(f, 16, y + 4, 358, 48, C.sec10, 12);
    rectBorder(f, 16, y + 4, 358, 48, null, C.sec1, 12, 1);
    txt(f, 28, y + 18, "重要  重要事項をご確認ください  ∨", { size: 13, bold: true, color: C.cta, w: 320 });

    actionBar(f, 820 - 88, 88);
    checkbox(f, 20, 820 - 80, false);
    txt(f, 46, 820 - 80, "①④⑤⑥⑦⑧について確認、②③について同意する", { size: 11, color: C.n600, w: 320 });
    var ctaBtn4 = rect(f, 20, 820 - 52, 350, 40, C.cta, 10);
    ctaBtn4.opacity = 0.40;
    txt(f, 20, 820 - 40, "上記に同意してメールを送信", { size: 14, bold: true, color: C.white, w: 350, center: true });
    txt(f, 0, 820 - 10, "上記に確認・同意すると進めます", { size: 10, color: C.n400, w: 390, center: true });
    return f;
  }

  // ============================================================
  //  画面 05 — プラン選択・同意チェック済・CTA活性
  // ============================================================
  function drawS05() {
    var f = frame("05 プラン選択・CTA活性", 390, 820, C.w50);
    var y = appBar(f, 0, {});
    y = steps(f, y, 2);

    rect(f, 0, y, 390, 38, C.p10);
    txt(f, 16, y + 12, "つみたて安心ほけんのプランをお選びください", { size: 11, color: C.n600, w: 360 });
    y += 38;

    var plans5 = [
      { name: "障害・介護",  price: "480 円/月",   sel: false },
      { name: "がん",        price: "980 円/月",   sel: false },
      { name: "安心セット",  price: "1,290 円/月", sel: true, tag: "おすすめ" },
    ];
    for (var i = 0; i < plans5.length; i++) {
      var p5 = plans5[i];
      rectBorder(f, 16, y + 4, 358, 66, p5.sel ? C.p10 : C.white, p5.sel ? C.p500 : C.w200, 14, p5.sel ? 2 : 1);
      checkbox(f, 28, y + 23, p5.sel);
      txt(f, 58, y + 23, p5.name, { size: 14, bold: true, color: C.n800 });
      if (p5.tag) { rect(f, 286, y + 20, 72, 22, C.sec10, 11); txt(f, 286, y + 24, p5.tag, { size: 10, med: true, color: C.sec, w: 72, center: true }); }
      txt(f, 0, y + 46, p5.price, { size: 16, bold: true, color: p5.sel ? C.p500 : C.n800, right: true, w: 360, mono: true });
      y += 76;
    }

    // 重要事項展開
    rect(f, 16, y + 4, 358, 280, C.sec10, 12);
    rectBorder(f, 16, y + 4, 358, 280, null, C.sec1, 12, 1);
    txt(f, 28, y + 18, "重要  重要事項をご確認ください  ∧", { size: 13, bold: true, color: C.cta, w: 320 });
    var items5 = ["① 申込に関する注意事項の確認","② 個人情報のお取り扱いについて",
                  "③ ペーパーレス申込の同意","④ 健康告知について",
                  "⑤ 被保険者の確認","⑥ 重要事項説明の確認","⑦ 意向の確認","⑧ ほけん商品のお問い合わせ"];
    var iy5 = y + 44;
    for (var j = 0; j < items5.length; j++) {
      rectBorder(f, 24, iy5, 342, 28, C.white, C.w200, 8, 1);
      txt(f, 32, iy5 + 7, items5[j], { size: 11, bold: true, color: C.n800, w: 300 });
      txt(f, 344, iy5 + 7, "∨", { size: 11, color: C.p500 });
      iy5 += 32;
    }
    y += 288;

    actionBar(f, 820 - 88, 88);
    checkbox(f, 20, 820 - 80, true);
    txt(f, 46, 820 - 80, "①④⑤⑥⑦⑧について確認、②③について同意する", { size: 11, color: C.n600, w: 320 });
    rect(f, 20, 820 - 52, 350, 40, C.cta, 10);
    txt(f, 20, 820 - 40, "上記に同意してメールを送信", { size: 14, bold: true, color: C.white, w: 350, center: true });
    return f;
  }

  // ============================================================
  //  画面 06 — PINコード認証・デフォルト
  // ============================================================
  function drawS06() {
    var f = frame("06 PIN認証・デフォルト", 390, 820, C.w50);
    var y = appBar(f, 0, {});
    y = steps(f, y, 3);

    txt(f, 0, y + 30, "THEO  つみたて安心ほけん", { size: 13, bold: true, color: C.p500, w: 390, center: true });
    lockIcon(f, 163, y + 68);
    txt(f, 0, y + 142, "PINコードの入力", { size: 20, bold: true, color: C.n800, w: 390, center: true });
    txt(f, 40, y + 172, "ご登録のメールアドレスに認証用のPINコードをお送りしました。6桁のPINコードを入力してください。",
        { size: 12, color: C.n600, w: 310, center: true, lh: 20 });
    rectBorder(f, 65, y + 238, 260, 56, C.w50, C.w300, 12, 1);
    txt(f, 65, y + 258, "_ _ _ _ _ _", { size: 24, bold: true, color: C.w300, w: 260, center: true, mono: true });
    txt(f, 0, y + 308, "PINコードを再送する", { size: 12, color: C.btn, w: 390, center: true });

    actionBar(f, 820 - 110, 110);
    txt(f, 20, 820 - 102, "本お手続きは「THEO つみたて安心ほけん」のお申し込みです。", { size: 11, color: C.n500, w: 350, center: true });
    txt(f, 20, 820 - 84, "引受保険会社：T&Dフィナンシャル生命保険株式会社", { size: 10, color: C.n400, w: 350, center: true });
    button(f, 20, 820 - 60, 350, "認証する", "button", true);
    txt(f, 0, 820 - 8, "6桁のPINコードを入力してください", { size: 10, color: C.n400, w: 390, center: true });
    return f;
  }

  // ============================================================
  //  画面 07 — PINコード認証・666666入力済・活性
  // ============================================================
  function drawS07() {
    var f = frame("07 PIN認証・666666入力済・活性", 390, 820, C.w50);
    var y = appBar(f, 0, {});
    y = steps(f, y, 3);

    txt(f, 0, y + 30, "THEO  つみたて安心ほけん", { size: 13, bold: true, color: C.p500, w: 390, center: true });
    lockIcon(f, 163, y + 68);
    txt(f, 0, y + 142, "PINコードの入力", { size: 20, bold: true, color: C.n800, w: 390, center: true });
    txt(f, 40, y + 172, "ご登録のメールアドレスに認証用のPINコードをお送りしました。6桁のPINコードを入力してください。",
        { size: 12, color: C.n600, w: 310, center: true, lh: 20 });
    rectBorder(f, 65, y + 238, 260, 56, C.p10, C.p300, 12, 1.5);
    txt(f, 65, y + 258, "6  6  6  6  6  6", { size: 24, bold: true, color: C.n800, w: 260, center: true, mono: true });
    txt(f, 0, y + 308, "PINコードを再送する", { size: 12, color: C.btn, w: 390, center: true });

    actionBar(f, 820 - 110, 110);
    txt(f, 20, 820 - 102, "本お手続きは「THEO つみたて安心ほけん」のお申し込みです。", { size: 11, color: C.n500, w: 350, center: true });
    txt(f, 20, 820 - 84, "引受保険会社：T&Dフィナンシャル生命保険株式会社", { size: 10, color: C.n400, w: 350, center: true });
    button(f, 20, 820 - 60, 350, "認証する", "button", false);
    return f;
  }

  // ============================================================
  //  画面 08 — 申込フォーム・デフォルト
  // ============================================================
  function drawS08() {
    var f = frame("08 申込フォーム", 390, 820, C.w50);
    var y = appBar(f, 0, {});
    y = steps(f, y, 3);
    var cx = 20; y += 12;
    txt(f, cx, y, "認証が完了しました。", { size: 20, bold: true, color: C.n800, w: 350 });
    y += 32;
    txt(f, cx, y, "あと少しで、お申し込みは完了です。ご契約者・保険金受取人の情報をご入力ください。",
        { size: 12, color: C.n600, w: 350, lh: 20 });
    y += 48;
    txt(f, cx, y, "THEO 口座情報の一部を自動入力しています。", { size: 11, color: C.p500 });
    y += 28;

    rectBorder(f, 16, y, 358, 244, C.white, C.w200, 16, 1);
    txt(f, 28, y + 14, "契約者情報", { size: 14, bold: true, color: C.n800 });
    txt(f, 28, y + 32, "ご契約者ご本人さまの情報", { size: 11, color: C.n500 });
    divider(f, 28, y + 52, 330);
    var fy = y + 60;
    inputField(f, 28, fy, 158, "姓 *", "山田", false);
    inputField(f, 196, fy, 158, "名 *", "太郎", false);
    fy += 72;
    inputField(f, 28, fy, 158, "セイ *", "ヤマダ", false);
    inputField(f, 196, fy, 158, "メイ *", "タロウ", false);
    fy += 72;
    inputField(f, 28, fy, 330, "生年月日", "1990 / 01 / 01", true);
    y += 256;

    rectBorder(f, 16, y, 358, 120, C.white, C.w200, 16, 1);
    txt(f, 28, y + 14, "保険金受取人", { size: 14, bold: true, color: C.n800 });
    txt(f, 28, y + 32, "保険金をお受け取りになる方", { size: 11, color: C.n500 });
    divider(f, 28, y + 52, 330);
    inputField(f, 28, y + 60, 330, "氏名", "山田 花子", false);

    actionBar(f, 820 - 80, 80);
    rect(f, 20, 820 - 72, 350, 24, C.w100, 6);
    txt(f, 28, 820 - 66, "安心セット  |  10,000円/月  |  15年", { size: 11, color: C.n700 });
    button(f, 20, 820 - 52, 350, "入力内容を確認する  ›", "button", false);
    return f;
  }

  // ============================================================
  //  画面 09 — 申込フォーム・積立修正シート展開  [NEW]
  // ============================================================
  function drawS09() {
    var f = frame("09 申込フォーム・積立修正シート", 390, 820, C.w50);
    var y = appBar(f, 0, {});
    y = steps(f, y, 3);
    var cx = 20; y += 12;
    txt(f, cx, y, "認証が完了しました。", { size: 20, bold: true, color: C.n800, w: 350 });
    y += 32;
    txt(f, cx, y, "あと少しで、お申し込みは完了です。", { size: 12, color: C.n600, w: 350 });

    var ov9 = rect(f, 0, 0, 390, 820, C.dark);
    ov9.opacity = 0.40;

    var sh9 = 360;
    rect(f, 0, sh9, 390, 820 - sh9, C.white, 20);
    rect(f, 170, sh9 + 10, 50, 4, C.w300, 2);
    txt(f, 20, sh9 + 28, "積立内容を修正する", { size: 17, bold: true, color: C.n800 });
    divider(f, 16, sh9 + 60, 358, C.w200);

    var sy9 = sh9 + 72;
    txt(f, 20, sy9, "毎月の積立金額", { size: 11, color: C.n600 });
    rect(f, 20, sy9 + 16, 350, 48, C.w50, 10);
    rect(f, 28, sy9 + 24, 32, 32, C.white, 8);
    txt(f, 28, sy9 + 32, "−", { size: 18, bold: true, color: C.btn, w: 32, center: true, mono: true });
    txt(f, 0, sy9 + 28, "10,000 円/月", { size: 18, bold: true, color: C.n800, w: 390, center: true, mono: true });
    rect(f, 330, sy9 + 24, 32, 32, C.white, 8);
    txt(f, 330, sy9 + 32, "+", { size: 18, bold: true, color: C.btn, w: 32, center: true, mono: true });
    sy9 += 72;

    txt(f, 20, sy9, "保障期間", { size: 11, color: C.n600 });
    var yrs = ["10年", "15年", "20年", "25年"];
    var bxr = 20;
    for (var yi = 0; yi < yrs.length; yi++) {
      var isSel = yi === 1;
      rectBorder(f, bxr, sy9 + 16, 82, 36, isSel ? C.p500 : C.white, isSel ? C.p500 : C.w200, 8, isSel ? 2 : 1);
      txt(f, bxr, sy9 + 26, yrs[yi], { size: 13, bold: isSel, color: isSel ? C.white : C.n600, w: 82, center: true, mono: true });
      bxr += 88;
    }
    sy9 += 60;

    rectBorder(f, 16, sy9, 358, 68, C.p10, C.p100, 12, 1);
    txt(f, 28, sy9 + 10, "給付予想額（一時金）", { size: 11, color: C.n600 });
    txt(f, 28, sy9 + 28, "1,800,000", { size: 24, bold: true, color: C.p500, mono: true });
    txt(f, 185, sy9 + 34, " 円", { size: 14, color: C.n800 });
    txt(f, 28, sy9 + 52, "安心セット  |  10,000円/月  |  15年の場合", { size: 10, color: C.n400 });
    sy9 += 76;

    button(f, 20, sy9, 350, "この内容で確認する  ›", "button", false);
    return f;
  }

  // ============================================================
  //  画面 10 — 内容確認・デフォルト
  // ============================================================
  function drawS10() {
    var f = frame("10 内容確認・デフォルト", 390, 820, C.w50);
    var y = appBar(f, 0, {});
    y = steps(f, y, 4);
    y += 12;

    rectBorder(f, 16, y, 358, 160, C.white, C.w200, 16, 1);
    txt(f, 28, y + 12, "積立内容", { size: 10, color: C.n400, mono: true });
    var rows10 = [["契約プラン","安心セット"],["毎月の積立金額","10,000 円"],["保障期間","15 年"],["保険料（月額）","1,290 円/月"]];
    var ry10 = y + 28;
    for (var i = 0; i < rows10.length; i++) ry10 = dataRow(f, 28, ry10, 330, rows10[i][0], rows10[i][1]);
    y += 168;

    rect(f, 16, y, 358, 320, C.sec10, 12);
    rectBorder(f, 16, y, 358, 320, null, C.sec1, 12, 1);
    txt(f, 28, y + 14, "重要", { size: 10, med: true, color: C.cta });
    txt(f, 60, y + 12, "重要事項をご確認ください", { size: 14, bold: true, color: C.n800 });
    var agreeItems10 = ["① 申込に関する注意事項の確認","② 個人情報のお取り扱いについて",
      "③ ペーパーレス申込の同意","④ 健康告知について",
      "⑤ 被保険者の確認","⑥ 重要事項説明の確認","⑦ 意向の確認","⑧ ほけん商品のお問い合わせ"];
    var ay10 = y + 40;
    for (var j = 0; j < agreeItems10.length; j++) {
      rectBorder(f, 24, ay10, 342, 28, C.white, C.w200, 8, 1);
      txt(f, 32, ay10 + 7, agreeItems10[j], { size: 11, bold: true, color: C.n800, w: 290 });
      txt(f, 344, ay10 + 7, "∨", { size: 11, color: C.p500 });
      ay10 += 32;
    }
    y += 328;

    rect(f, 16, y + 4, 358, 52, C.sec10, 10);
    checkbox(f, 24, y + 16, false);
    txt(f, 52, y + 14, "①④⑤⑥⑦⑧について確認、②③について同意する", { size: 11, color: C.n700, w: 300 });

    actionBar(f, 820 - 72, 72);
    button(f, 20, 820 - 62, 350, "クレジットカード登録開始  ›", "danger", true);
    txt(f, 0, 820 - 10, "上記に確認・同意すると進めます", { size: 10, color: C.n400, w: 390, center: true });
    return f;
  }

  // ============================================================
  //  画面 11 — 内容確認・お支払い詳細展開  [NEW]
  // ============================================================
  function drawS11() {
    var f = frame("11 内容確認・お支払い詳細展開", 390, 820, C.w50);
    var y = appBar(f, 0, {});
    y = steps(f, y, 4);
    y += 12;

    rectBorder(f, 16, y, 358, 160, C.white, C.w200, 16, 1);
    txt(f, 28, y + 12, "積立内容", { size: 10, color: C.n400, mono: true });
    var rows11 = [["契約プラン","安心セット"],["毎月の積立金額","10,000 円"],["保障期間","15 年"],["保険料（月額）","1,290 円/月"]];
    var ry11 = y + 28;
    for (var i = 0; i < rows11.length; i++) ry11 = dataRow(f, 28, ry11, 330, rows11[i][0], rows11[i][1]);
    y += 168;

    // お支払い展開
    rectBorder(f, 16, y, 358, 204, C.white, C.p100, 16, 1.5);
    rect(f, 16, y, 358, 48, C.p10);
    txt(f, 28, y + 16, "お支払い方法", { size: 14, bold: true, color: C.n800 });
    txt(f, 340, y + 16, "∧", { size: 14, color: C.p500 });
    divider(f, 28, y + 46, 330, C.p100);
    var pry = y + 56;
    var payRows = [["お支払い方法","クレジットカード"],["カード番号","**** **** **** 3456"],["カード名義","TARO YAMADA"],["有効期限","04 / 25"]];
    for (var k = 0; k < payRows.length; k++) pry = dataRow(f, 28, pry, 330, payRows[k][0], payRows[k][1]);
    txt(f, 28, pry + 6, "変更する", { size: 12, color: C.btn });
    y += 212;

    rect(f, 16, y, 358, 52, C.sec10, 12);
    rectBorder(f, 16, y, 358, 52, null, C.sec1, 12, 1);
    txt(f, 28, y + 18, "重要  重要事項をご確認ください  ∨", { size: 13, bold: true, color: C.cta, w: 300 });
    y += 60;

    actionBar(f, 820 - 72, 72);
    button(f, 20, 820 - 62, 350, "クレジットカード登録開始  ›", "danger", true);
    txt(f, 0, 820 - 10, "上記に確認・同意すると進めます", { size: 10, color: C.n400, w: 390, center: true });
    return f;
  }

  // ============================================================
  //  画面 12 — 内容確認・被保険者確認・日本国籍以外  [NEW]
  // ============================================================
  function drawS12() {
    var f = frame("12 内容確認・被保険者・日本国籍以外", 390, 820, C.w50);
    var y = appBar(f, 0, {});
    y = steps(f, y, 4);
    y += 12;

    rectBorder(f, 16, y, 358, 100, C.white, C.w200, 16, 1);
    txt(f, 28, y + 12, "積立内容", { size: 10, color: C.n400, mono: true });
    dataRow(f, 28, y + 28, 330, "契約プラン", "安心セット");
    dataRow(f, 28, y + 64, 330, "保険料（月額）", "1,290 円/月");
    y += 108;

    // お支払い collapsed
    rectBorder(f, 16, y, 358, 48, C.white, C.w200, 12, 1);
    txt(f, 28, y + 16, "お支払い方法", { size: 13, bold: true, color: C.n800 });
    txt(f, 340, y + 16, "∨", { size: 13, color: C.p500 });
    y += 56;

    // 被保険者確認 展開
    rectBorder(f, 16, y, 358, 288, C.white, C.p100, 16, 1.5);
    rect(f, 16, y, 358, 48, C.p10);
    txt(f, 28, y + 16, "被保険者の確認", { size: 14, bold: true, color: C.n800 });
    txt(f, 340, y + 16, "∧", { size: 14, color: C.p500 });
    divider(f, 28, y + 46, 330, C.p100);
    var by = y + 56;
    txt(f, 28, by, "被保険者氏名", { size: 11, color: C.n500 });
    txt(f, 28, by + 16, "山田 太郎", { size: 14, bold: true, color: C.n800 });
    by += 44;
    txt(f, 28, by, "国籍", { size: 11, color: C.n600 });
    by += 16;
    rectBorder(f, 28, by, 148, 36, C.white, C.w200, 8, 1);
    txt(f, 28, by + 10, "日本国籍", { size: 13, color: C.n600, w: 148, center: true });
    rectBorder(f, 182, by, 172, 36, C.p10, C.p500, 8, 2);
    rect(f, 190, by + 10, 16, 16, C.p500, 8);
    rect(f, 195, by + 15, 6, 6, C.white, 3);
    txt(f, 212, by + 10, "日本国籍以外", { size: 13, bold: true, color: C.p500 });
    by += 44;
    txt(f, 28, by, "在留資格", { size: 11, med: true, color: C.n600 });
    rectBorder(f, 28, by + 16, 330, 44, C.white, C.w300, 12, 1);
    txt(f, 40, by + 29, "永住権", { size: 13, color: C.n800 });
    txt(f, 340, by + 29, "∨", { size: 13, color: C.p500 });
    by += 68;
    txt(f, 28, by, "日本在住期間", { size: 11, med: true, color: C.n600 });
    rectBorder(f, 28, by + 16, 330, 44, C.white, C.w300, 12, 1);
    txt(f, 40, by + 29, "10年以上", { size: 13, color: C.n800 });
    txt(f, 340, by + 29, "∨", { size: 13, color: C.p500 });
    y += 296;

    rect(f, 16, y, 358, 52, C.sec10, 12);
    rectBorder(f, 16, y, 358, 52, null, C.sec1, 12, 1);
    txt(f, 28, y + 18, "重要  重要事項をご確認ください  ∨", { size: 13, bold: true, color: C.cta, w: 300 });

    actionBar(f, 820 - 72, 72);
    button(f, 20, 820 - 62, 350, "クレジットカード登録開始  ›", "danger", true);
    txt(f, 0, 820 - 10, "上記に確認・同意すると進めます", { size: 10, color: C.n400, w: 390, center: true });
    return f;
  }

  // ============================================================
  //  画面 13 — 内容確認・全チェック済・CTA活性
  // ============================================================
  function drawS13() {
    var f = frame("13 内容確認・全チェック済・CTA活性", 390, 820, C.w50);
    var y = appBar(f, 0, {});
    y = steps(f, y, 4);
    y += 12;

    rectBorder(f, 16, y, 358, 100, C.white, C.w200, 16, 1);
    txt(f, 28, y + 12, "積立内容", { size: 10, color: C.n400, mono: true });
    dataRow(f, 28, y + 28, 330, "契約プラン", "安心セット");
    dataRow(f, 28, y + 64, 330, "保険料（月額）", "1,290 円/月");
    y += 108;

    rect(f, 16, y, 358, 352, C.sec10, 12);
    rectBorder(f, 16, y, 358, 352, null, C.sec1, 12, 1);
    txt(f, 28, y + 14, "重要  重要事項をご確認ください", { size: 14, bold: true, color: C.n800 });
    var oy = y + 38;
    rectBorder(f, 24, oy, 342, 68, C.white, C.p100, 8, 1);
    checkbox(f, 32, oy + 24, true);
    txt(f, 60, oy + 9, "① 申込に関する注意事項の確認  ∧", { size: 11, bold: true, color: C.n800, w: 260 });
    txt(f, 32, oy + 40, "お申し込み・告知内容は必ず被保険者ご本人さまがご入力ください。", { size: 10, color: C.n600, w: 300 });
    oy += 72;
    var ck13 = ["② 個人情報のお取り扱い","③ ペーパーレス申込の同意","④ 健康告知について",
                "⑤ 被保険者の確認","⑥ 重要事項説明の確認","⑦ 意向の確認","⑧ ほけん商品のお問い合わせ"];
    for (var k = 0; k < ck13.length; k++) {
      rectBorder(f, 24, oy, 342, 28, C.white, C.p100, 8, 1);
      checkbox(f, 32, oy + 4, true);
      txt(f, 60, oy + 7, ck13[k], { size: 11, bold: true, color: C.n800, w: 265 });
      txt(f, 344, oy + 7, "∨", { size: 11, color: C.p500 });
      oy += 32;
    }
    y += 360;

    rect(f, 16, y + 4, 358, 52, C.sec10, 10);
    checkbox(f, 24, y + 16, true);
    txt(f, 52, y + 14, "①④⑤⑥⑦⑧について確認、②③について同意する", { size: 11, bold: true, color: C.p500, w: 300 });

    actionBar(f, 820 - 72, 72);
    button(f, 20, 820 - 62, 350, "クレジットカード登録開始  ›", "danger", false);
    return f;
  }

  // ============================================================
  //  画面 14 — クレジットカード情報入力（外部 GMO）
  // ============================================================
  function drawS14() {
    var f = frame("14 カード情報入力（外部）", 390, 820, C.ex100);
    appBar(f, 0, { gray: true });
    var y = 56;
    txt(f, 16, y + 14, "クレジットカード設定（外部リンク）", { size: 15, bold: true, color: C.n800 });
    y += 44;
    rectBorder(f, 16, y, 358, 380, C.white, C.ex200, 12, 1);
    txt(f, 28, y + 14, "クレジットカード情報を入力ください", { size: 13, bold: true, color: C.n800 });
    var cy = y + 44;
    cy = inputField(f, 28, cy, 330, "カード番号 *", "1234  5678  9012  3456", false);
    cy += 4;
    cy = inputField(f, 28, cy, 330, "カード名義（半角ローマ字） *", "TARO YAMADA", false);
    cy += 4;
    inputField(f, 28, cy, 158, "有効期限（月／年） *", "04 / 25", false);
    inputField(f, 196, cy, 158, "セキュリティコード *", "***", false);
    cy += 72;
    txt(f, 28, cy, "使用できるクレジットカード", { size: 11, med: true, color: C.n600 });
    cy += 18;
    var brands = ["VISA", "Mastercard", "JCB", "AMEX", "Diners"];
    var bx = 28;
    for (var b = 0; b < brands.length; b++) {
      var bw = brands[b].length * 7 + 12;
      rectBorder(f, bx, cy, bw, 22, C.ex50, C.ex200, 4, 1);
      txt(f, bx + 4, cy + 4, brands[b], { size: 10, mono: true, color: C.n600 });
      bx += bw + 8;
    }
    rect(f, 0, 820 - 84, 390, 84, C.ex100);
    divider(f, 0, 820 - 84, 390, C.ex200);
    button(f, 20, 820 - 76, 350, "確認画面へ進む  ›", "button", false);
    txt(f, 0, 820 - 16, "キャンセルして戻る", { size: 12, color: C.n500, w: 390, center: true });
    return f;
  }

  // ============================================================
  //  画面 15 — クレジットカード確認（外部 GMO）
  // ============================================================
  function drawS15() {
    var f = frame("15 カード確認（外部）", 390, 820, C.ex100);
    appBar(f, 0, { gray: true });
    var y = 56;
    txt(f, 16, y + 14, "お申込み内容の確認（外部リンク）", { size: 15, bold: true, color: C.n800 });
    y += 44;
    rectBorder(f, 16, y, 358, 260, C.white, C.ex200, 12, 1);
    txt(f, 28, y + 14, "ご登録内容", { size: 13, bold: true, color: C.n800 });
    var ry15 = y + 44;
    var rows15 = [["カード番号","**** **** **** 3456"],["カード名義","TARO YAMADA"],
                  ["有効期限","04 / 25"],["お支払い方法","一回払い"],["保険金の受取人","山田 花子様"]];
    for (var i = 0; i < rows15.length; i++) ry15 = dataRow(f, 28, ry15, 330, rows15[i][0], rows15[i][1]);
    y += 268;
    rect(f, 16, y, 358, 60, C.ex50, 10);
    txt(f, 24, y + 10, "上記の内容で申込します。「この内容で申込」を押すと、お申込みが確定し、初回のお支払い手続きが行われます。",
        { size: 11, color: C.n500, w: 340, lh: 18 });
    rect(f, 0, 820 - 84, 390, 84, C.ex100);
    divider(f, 0, 820 - 84, 390, C.ex200);
    button(f, 20, 820 - 76, 350, "この内容で申込", "button", false);
    txt(f, 0, 820 - 16, "入力内容を修正する", { size: 12, color: C.n500, w: 390, center: true });
    return f;
  }

  // ============================================================
  //  画面 16 — 完了
  // ============================================================
  function drawS16() {
    var f = frame("16 完了", 390, 820, C.w50);
    rect(f, 0, 0, 390, 300, C.p500);
    var ov16 = rect(f, 0, 0, 390, 300, C.w50); ov16.opacity = 0.08;
    txt(f, 0, 66, "THEO  つみたて安心ほけん", { size: 13, bold: true, color: C.white, w: 390, center: true });
    // checkmark drawn
    rect(f, 163, 98, 64, 64, C.white, 32);
    rect(f, 177, 121, 10, 20, C.p500, 2);
    rect(f, 187, 131, 22, 10, C.p500, 2);
    txt(f, 0, 172, "お申込が完了しました", { size: 22, bold: true, color: C.n800, w: 390, center: true });
    txt(f, 0, 202, "受付番号  THEO-2026-000482", { size: 12, color: C.n500, w: 390, center: true });

    steps(f, 300, 5);

    var sy = 352;
    txt(f, 20, sy, "THEO つみたて安心ほけんのお申込が完了しました。", { size: 14, bold: true, color: C.n800, w: 350 });
    sy += 32;
    txt(f, 20, sy, "受付確認メールをご確認ください。査定結果は数日以内にご登録のメールアドレス宛にご連絡いたします。",
        { size: 12, color: C.n600, w: 350, lh: 20 });
    sy += 52;

    rectBorder(f, 16, sy, 358, 180, C.white, C.w200, 16, 1);
    txt(f, 28, sy + 12, "このあとの流れ", { size: 10, color: C.n400, mono: true });
    var flows16 = [
      ["1","受付確認メール送信確認","ご登録のメールアドレスをご確認ください。"],
      ["2","査定・引受の確定","通常1〜3営業日でマイページに反映されます。"],
      ["3","初回保険料の引落し・保険開始","翌月以降、THEOのご登録口座より。"],
    ];
    var fy16 = sy + 36;
    for (var i = 0; i < flows16.length; i++) {
      rect(f, 28, fy16, 28, 28, C.p10, 14);
      txt(f, 28, fy16 + 6, flows16[i][0], { size: 12, bold: true, color: C.p500, w: 28, center: true, mono: true });
      txt(f, 66, fy16 + 4, flows16[i][1], { size: 13, bold: true, color: C.n800, w: 280 });
      txt(f, 66, fy16 + 20, flows16[i][2], { size: 11, color: C.n500, w: 280 });
      fy16 += 48;
    }

    actionBar(f, 820 - 68, 68);
    button(f, 20, 820 - 58, 350, "マイページに戻る", "button", false);
    return f;
  }

  // ============================================================
  //  メイン実行
  // ============================================================
  var screens = [
    drawS01(),  // 00
    drawS02(),  // 01
    drawS03(),  // 02
    drawS04(),  // 03
    drawS05(),  // 04
    drawS06(),  // 05
    drawS07(),  // 06
    drawS08(),  // 07
    drawS09(),  // 08
    drawS10(),  // 09
    drawS11(),  // 10
    drawS12(),  // 11
    drawS13(),  // 12
    drawS14(),  // 13
    drawS15(),  // 14
    drawS16(),  // 15
  ];

  // 横並びレイアウト
  var gapX = 48;
  for (var i = 0; i < screens.length; i++) {
    screens[i].x = i * (390 + gapX);
    screens[i].y = 0;
  }

  // Smart Animate 遷移 (プロトタイプフロー)
  // 01→02→05→06→07→08→10→13→14→15→16→01
  var flow = [
    [0,  1],   // 01 → 02
    [1,  4],   // 02 → 05 (CTA活性)
    [4,  5],   // 05 → 06
    [5,  6],   // 06 → 07 (PIN入力済)
    [6,  7],   // 07 → 08
    [7,  9],   // 08 → 10
    [9,  12],  // 10 → 13 (全チェック)
    [12, 13],  // 13 → 14
    [13, 14],  // 14 → 15
    [14, 15],  // 15 → 16
    [15, 0],   // 16 → 01
  ];
  for (var fi = 0; fi < flow.length; fi++) {
    linkFrames(screens[flow[fi][0]], screens[flow[fi][1]].id);
  }

  figma.viewport.scrollAndZoomIntoView(screens);
  figma.closePlugin("✅ THEO 16画面を生成しました");

  } catch (err) {
    figma.closePlugin("❌ エラー: " + String(err && err.message ? err.message : err));
  }
})();
