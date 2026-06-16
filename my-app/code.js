// ============================================================
//  THEO × T&Dフィナンシャル生命 — Figma インポーター (現行 /theo-tdf/windows 準拠)
//  UIUX_Importer / figma_Importer プラグイン向け code.js
//  生成: 2026-06-16 (TD 組込1.4 全刷新後の windows 全カテゴリ・全バリアント版)
//
//  画面 (390×820, カテゴリ別の行レイアウト):
//   [商品概要]   01 パターンA / 02 パターンB統合 / 03 パターンB+下部CTA(未同意) / 04 パターンB+同意済CTA活性
//   [プラン選択] 05 デフォルト / 06 重要事項シート / 07 給付予想額展開 / 08 下部CTA(未同意) / 09 同意済CTA活性 / 10 メール認証済
//   [PIN認証]    11 デフォルト / 12 666666入力済・活性
//   [申込フォーム]13 1ページ / 14 2分割(契約者) / 15 2分割(受取人) / 16 積立修正シート
//   [内容確認]   17 デフォルト / 18 支払詳細展開 / 19 同意全チェック・CTA活性 / 20 契約者+受取人 両編集
//   [カード(外部GMO)] 21 入力 / 22 確認
//   [完了]       23 完了
//
//  プロトタイプ(ハッピーパス): 01→05→09→11→12→13→17→19→21→22→23→01
//  制約: Figma Plugin API 準拠 / ノードへの直接プロパティ拡張禁止 / Smart Animate 遷移
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
    ctaBlue:{ r: 0.906, g: 0.929, b: 0.969 }, // #e7edf7 下部CTA帯
    w50:  { r: 0.980, g: 0.980, b: 0.976 },
    w100: { r: 0.961, g: 0.961, b: 0.957 },
    w200: { r: 0.906, g: 0.898, b: 0.894 },
    w300: { r: 0.839, g: 0.827, b: 0.820 },
    n900: { r: 0.075, g: 0.106, b: 0.149 },
    n800: { r: 0.122, g: 0.161, b: 0.216 },
    n700: { r: 0.200, g: 0.247, b: 0.314 },
    n600: { r: 0.294, g: 0.333, b: 0.388 },
    n500: { r: 0.420, g: 0.447, b: 0.502 },
    n400: { r: 0.612, g: 0.639, b: 0.686 },
    n300: { r: 0.792, g: 0.816, b: 0.855 },
    ex200:{ r: 0.878, g: 0.878, b: 0.878 },
    ex100:{ r: 0.941, g: 0.941, b: 0.941 },
    white:{ r: 1, g: 1, b: 1 },
    succ: { r: 0.122, g: 0.541, b: 0.298 },
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
  function statusBar(f, y, light) {
    // 透明背景のステータスバー (時刻 / 5G 100%)
    var col = light ? C.n800 : C.white;
    txt(f, 16, y + 6, "9:41", { size: 11, med: true, color: col, mono: true });
    txt(f, 330, y + 6, "5G  100%", { size: 11, med: true, color: col, right: true, w: 44, mono: true });
    rect(f, 165, y + 4, 60, 16, C.n900, 8); // ノッチ
    return y + 28;
  }
  function appBar(f, y, opts) {
    var o = opts || {};
    var bg = o.gray ? C.ex200 : C.p500;
    rect(f, 0, y, 390, 52, bg);
    var label = o.gray ? "payment.gmo-pg.com" : (o.title || "THEO  つみたて安心ほけん");
    var lc = o.gray ? C.n600 : C.white;
    txt(f, 0, y + 17, label, { size: 14, bold: !o.gray, color: lc, w: 390, center: true });
    return y + 52;
  }
  function steps(f, y, active) {
    rect(f, 0, y, 390, 44, C.white);
    divider(f, 0, y + 43, 390, C.w200);
    var total = 5, cw = 28, lw = 24;
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
  function actionBar(f, y, h, bg) {
    rect(f, 0, y, 390, h, bg || C.white);
    divider(f, 0, y, 390, C.w200);
  }
  function button(f, x, y, w, label, kind, disabled) {
    var bgc = disabled
      ? (kind === "danger" ? { r:1.0,g:0.69,b:0.69 } : { r:0.72,g:0.80,b:0.95 })
      : kind === "danger" ? C.cta
      : kind === "outline" ? C.white
      : C.btn;
    var nd = rect(f, x, y, w, 52, bgc, 12);
    if (kind === "outline") { nd.strokes = fill(C.btn); nd.strokeWeight = 1.5; nd.strokeAlign = "INSIDE"; }
    var fc = kind === "outline" ? C.btn : C.white;
    txt(f, x, y + 16, label, { size: 15, bold: true, color: fc, w: w, center: true });
    return y + 52;
  }
  function checkbox(f, x, y, checked) {
    rectBorder(f, x, y, 20, 20, checked ? C.p500 : C.white, checked ? C.p500 : C.w300, 5, 2);
    if (checked) txt(f, x + 2, y + 3, "✓", { size: 12, bold: true, color: C.white, w: 16, center: true });
  }
  function badge(f, x, y, w, label, tone) {
    var bg = tone === "succ" ? C.sec10 : C.sec10;
    rect(f, x, y, w, 22, bg, 11);
    txt(f, x, y + 4, label, { size: 10, med: true, color: C.sec, w: w, center: true });
  }
  function dataRow(f, x, y, w, key, value) {
    txt(f, x, y + 10, key, { size: 11, color: C.n500, w: Math.floor(w * 0.46) });
    txt(f, x + Math.floor(w * 0.50), y + 8, value, { size: 13, bold: true, color: C.n700, right: true, w: Math.floor(w * 0.48) });
    divider(f, x, y + 36, w, C.w200);
    return y + 40;
  }
  function inputField(f, x, y, w, label, placeholder, disabled) {
    txt(f, x, y, label, { size: 11, med: true, color: C.n600 });
    rectBorder(f, x, y + 16, w, 44, disabled ? C.w100 : C.white, disabled ? C.w200 : C.w300, 12, 1);
    txt(f, x + 12, y + 28, placeholder, { size: 13, color: disabled ? C.n400 : C.n300 });
    return y + 68;
  }
  function lockIcon(f, bx, by) {
    rect(f, bx, by, 64, 64, C.p10, 32);
    rect(f, bx + 21, by + 11, 4, 22, C.p500);
    rect(f, bx + 39, by + 11, 4, 22, C.p500);
    rect(f, bx + 21, by + 11, 22, 4, C.p500, 2);
    rect(f, bx + 17, by + 29, 30, 22, C.p500, 5);
    rect(f, bx + 29, by + 35, 6, 12, C.p10, 3);
  }

  // 3プランカード (商品概要パターンB / プラン選択 共用)
  function planCards(f, y, selId) {
    var plans = [
      { id: "a", name: "障害・介護",  price: "480",   lead: "障害・介護状態になった場合に給付金が支払われます",          tag: null },
      { id: "b", name: "がん",        price: "980",   lead: "初めてがんと診断された場合に給付金が支払われます",          tag: null },
      { id: "c", name: "安心セット",  price: "1,290", lead: "障害・介護またはがんと診断された場合に給付金が支払われます", tag: "おすすめ" },
    ];
    for (var i = 0; i < plans.length; i++) {
      var p = plans[i], sel = (p.id === selId);
      rectBorder(f, 16, y, 358, 104, sel ? C.p10 : C.white, sel ? C.p500 : C.w200, 14, sel ? 2 : 1);
      rect(f, 16, y, 358, 36, sel ? C.p10 : C.w100, 0);
      divider(f, 16, y + 36, 358, sel ? C.p100 : C.w200);
      checkbox(f, 28, y + 9, sel);
      txt(f, 58, y + 10, p.name, { size: 14, bold: true, color: C.n800 });
      if (p.tag) badge(f, 300, y + 8, 64, p.tag);
      txt(f, 28, y + 46, p.lead, { size: 11, color: C.n500, w: 300 });
      txt(f, 250, y + 70, p.price, { size: 22, bold: true, color: C.n800, right: true, w: 90, mono: true });
      txt(f, 344, y + 78, " 円/月", { size: 11, color: C.n500 });
      y += 116;
    }
    return y;
  }

  // 下部CTA帯 (メール送信 / 申込フォームへ)。agreed=同意済(活性), verified=認証済文言
  function ctaSendBlock(f, agreed, verified) {
    var h = 116;
    var top = 820 - h;
    actionBar(f, top, h, C.ctaBlue);
    // 同意チェック行
    checkbox(f, 20, top + 16, agreed);
    txt(f, 50, top + 14, "重要事項・事前同意事項を確認・同意します", { size: 12, color: C.n700, w: 320 });
    var label = verified ? "申込フォームへ進む  ›" : "上記に同意してメールを送信";
    button(f, 20, top + 50, 350, label, "danger", !agreed);
    if (!agreed) txt(f, 0, top + 106, "同意いただくと送信できます", { size: 11, color: C.n400, w: 390, center: true });
  }

  // ── Smart Animate 遷移リアクション ────────────────────────────
  function linkFrames(srcNode, dstId) {
    srcNode.reactions = [{
      action: {
        type: "NODE",
        destinationId: dstId,
        navigation: "NAVIGATE",
        transition: { type: "SMART_ANIMATE", easing: { type: "EASE_OUT" }, duration: 300 },
        preserveScrollPosition: false,
      },
      trigger: { type: "ON_CLICK" },
    }];
  }

  // ============================================================
  //  [商品概要]
  // ============================================================
  function heroOverview(f) {
    // ヒーロー (背景帯 + コピー)
    rect(f, 0, 0, 390, 230, C.p500);
    var ov = rect(f, 0, 0, 390, 230, C.w50); ov.opacity = 0.12;
    statusBar(f, 0, true);
    txt(f, 20, 40, "THEO  つみたて安心ほけん", { size: 12, bold: true, color: C.white });
    txt(f, 20, 72, "つみたてながら、", { size: 26, bold: true, color: C.n800 });
    txt(f, 20, 106, "もしもに備える。", { size: 26, bold: true, color: C.n800 });
    txt(f, 20, 150, "THEOの資産運用に、もしものときの備えをひとつに。", { size: 12, color: C.n700, w: 340 });
    badge(f, 20, 186, 44, "重要");
    return 238;
  }

  function drawOverviewA() {
    var f = frame("商品概要 / パターンA", 390, 820, C.w50);
    var y = heroOverview(f);
    // 3つのプランから選ぶだけ バンド
    rect(f, 16, y, 358, 70, C.w100, 16);
    txt(f, 28, y + 14, "3つのプランから選ぶだけ", { size: 16, bold: true, color: C.n900 });
    txt(f, 28, y + 42, "最短10分で、お申し込みが完了します。", { size: 11, color: C.n500, w: 320 });
    y += 86;
    var feats = [
      ["積立も あんしんに", "働けなくなっても積立は止めない。"],
      ["学資保険の代わりにも", "お子さまの将来の備えにも。"],
      ["もしもの備えに", "がん・障害・介護に幅広く対応。"],
    ];
    for (var i = 0; i < feats.length; i++) {
      rectBorder(f, 16, y, 358, 56, C.white, C.w200, 12, 1);
      rect(f, 28, y + 11, 34, 34, C.p10, 17);
      txt(f, 72, y + 13, feats[i][0], { size: 13, bold: true, color: C.n800, w: 280 });
      txt(f, 72, y + 32, feats[i][1], { size: 11, color: C.n500, w: 280 });
      y += 64;
    }
    rect(f, 16, y, 358, 48, C.w100, 12);
    txt(f, 28, y + 16, "保険料", { size: 12, color: C.n500 });
    txt(f, 210, y + 8, "480", { size: 26, bold: true, color: C.p500, right: true, w: 120, mono: true });
    txt(f, 336, y + 16, " 円/月〜", { size: 12, color: C.n800 });
    actionBar(f, 820 - 72, 72);
    button(f, 20, 820 - 62, 350, "プランを選ぶ  ›", "button", false);
    return f;
  }

  // パターンB: 商品概要 + プラン選択 統合。cta=下部CTA帯, agreed=同意済
  function drawCombined(name, showCta, agreed) {
    var f = frame(name, 390, 820, C.w50);
    var y = heroOverview(f);
    txt(f, 20, y, "プランを選ぶ", { size: 16, bold: true, color: C.n900 });
    y += 30;
    y = planCards(f, y, "c");
    if (showCta) {
      ctaSendBlock(f, agreed, false);
    } else {
      actionBar(f, 820 - 72, 72);
      button(f, 20, 820 - 62, 350, "このプランで続ける  ›", "button", false);
    }
    return f;
  }

  // ============================================================
  //  [プラン選択]
  // ============================================================
  function planBase(name, opts) {
    var o = opts || {};
    var f = frame(name, 390, 820, C.w50);
    var y = appBar(f, 0, {});
    y = steps(f, y, 2);
    rect(f, 0, y, 390, 36, C.p10);
    txt(f, 16, y + 11, "つみたて安心ほけんのプランをお選びください", { size: 11, color: C.n600, w: 360 });
    y += 36;
    y = planCards(f, y + 8, "c");
    // 保険料シミュレーション
    rectBorder(f, 16, y + 4, 358, o.sim ? 230 : 92, C.white, C.w200, 16, 1);
    txt(f, 28, y + 18, "保険料シミュレーション", { size: 13, bold: true, color: C.n800 });
    txt(f, 28, y + 40, "毎月の積立金額 / 保障期間で給付予想額を確認", { size: 11, color: C.n500, w: 320 });
    rect(f, 28, y + 60, 334, 6, C.w200, 3); rect(f, 28, y + 60, 180, 6, C.p500, 3);
    if (o.sim) {
      // 給付予想額テーブル (展開)
      divider(f, 28, y + 84, 334, C.w200);
      txt(f, 28, y + 92, "給付予想額（試算）", { size: 12, bold: true, color: C.n700 });
      var cols = ["経過", "給付予想額", "月払保険料"];
      for (var c = 0; c < 3; c++) txt(f, 28 + c * 112, y + 116, cols[c], { size: 10, color: C.n500, w: 108 });
      var rows = [["5年", "¥600,000", "¥1,290"], ["10年", "¥600,000", "¥1,290"], ["15年", "¥600,000", "¥1,290"]];
      for (var r = 0; r < rows.length; r++) {
        var ry = y + 138 + r * 26;
        for (var cc = 0; cc < 3; cc++) txt(f, 28 + cc * 112, ry, rows[r][cc], { size: 11, color: C.n700, w: 108 });
      }
    }
    // 下部CTA
    if (o.cta || o.agreed || o.verified) {
      ctaSendBlock(f, o.agreed || o.verified, o.verified);
    } else {
      actionBar(f, 820 - 64, 64);
      txt(f, 0, 820 - 44, "下までスクロールすると申込みに進めます", { size: 11, color: C.n400, w: 390, center: true });
    }
    // 重要事項ボトムシート (オーバーレイ)
    if (o.notice) {
      var sh = rect(f, 0, 0, 390, 820, C.n900); sh.opacity = 0.4;
      rect(f, 0, 250, 390, 570, C.white, 24);
      txt(f, 24, 280, "重要事項・事前同意事項", { size: 16, bold: true, color: C.n800 });
      txt(f, 24, 314, "お申し込み前に、以下の内容を必ずご確認ください。", { size: 12, color: C.n600, w: 340 });
      var items = ["申込に関する注意事項の確認", "個人情報のお取り扱いについて", "ペーパーレス申込の同意", "契約概要・注意喚起情報", "契約のしおり・約款"];
      var iy = 352;
      for (var k = 0; k < items.length; k++) {
        rectBorder(f, 24, iy, 342, 46, C.white, C.w200, 10, 1);
        txt(f, 38, iy + 15, items[k], { size: 12, med: true, color: C.n700, w: 280 });
        txt(f, 320, iy + 15, "›", { size: 16, color: C.n400 });
        iy += 54;
      }
      button(f, 24, 760, 342, "確認同意しました", "button", false);
    }
    return f;
  }

  // ============================================================
  //  [PIN認証]
  // ============================================================
  function drawPin(name, filled) {
    var f = frame(name, 390, 820, C.w50);
    var y = appBar(f, 0, {});
    y = steps(f, y, 3);
    y += 32;
    lockIcon(f, 163, y);
    y += 84;
    txt(f, 0, y, "PINコードの入力", { size: 22, bold: true, color: C.n800, w: 390, center: true });
    y += 36;
    txt(f, 30, y, "ご登録のメールアドレスに送信した6桁のPINコードを入力してください。", { size: 12, color: C.n600, w: 330, center: true, lh: 20 });
    y += 56;
    rectBorder(f, 65, y, 260, 56, C.w50, C.w300, 12, 1);
    txt(f, 65, y + 14, filled ? "6 6 6 6 6 6" : "______", { size: 26, bold: true, color: filled ? C.n800 : C.n300, w: 260, center: true, mono: true });
    y += 76;
    txt(f, 0, y, "PINコードを再送する", { size: 11, color: C.btn, w: 390, center: true });
    actionBar(f, 820 - 116, 116);
    txt(f, 20, 820 - 104, "本お手続きは「THEO つみたて安心ほけん」のお申し込みです。", { size: 11, color: C.n500, w: 350 });
    button(f, 65, 820 - 64, 260, "認証する", "danger", !filled);
    if (!filled) txt(f, 0, 820 - 8, "6桁のPINコードを入力してください", { size: 11, color: C.n400, w: 390, center: true });
    return f;
  }

  // ============================================================
  //  [申込フォーム]   mode: "single" | "p1" | "p2" | "edit"
  // ============================================================
  function drawForm(name, mode) {
    var f = frame(name, 390, 820, C.w50);
    var title = mode === "p1" ? "お申込み (1/2)" : mode === "p2" ? "お申込み (2/2)" : "お申込み";
    var y = appBar(f, 0, { title: "THEO  つみたて安心ほけん" });
    y = steps(f, y, 3);
    rect(f, 0, y, 390, 32, C.p10);
    txt(f, 16, y + 9, title, { size: 12, bold: true, color: C.p600, w: 360 });
    y += 40;

    if (mode !== "p2") {
      // 契約者情報
      rectBorder(f, 16, y, 358, mode === "p1" ? 250 : 188, C.white, C.w200, 16, 1);
      rect(f, 16, y, 358, 40, C.p10, 0);
      txt(f, 28, y + 12, "契約者情報", { size: 14, bold: true, color: C.n800 });
      var iy = y + 52;
      iy = inputField(f, 28, iy, 334, "氏名", "山田 太郎", false);
      iy = inputField(f, 28, iy, 334, "生年月日", "1990 / 01 / 01", false);
      if (mode === "p1") iy = inputField(f, 28, iy, 334, "ご住所", "東京都千代田区丸の内1-1-1", false);
      y += (mode === "p1" ? 250 : 188) + 12;
    }
    if (mode !== "p1") {
      // 保険金受取人
      rectBorder(f, 16, y, 358, 196, C.white, C.w200, 16, 1);
      rect(f, 16, y, 358, 40, C.p10, 0);
      txt(f, 28, y + 12, "保険金受取人", { size: 14, bold: true, color: C.n800 });
      var jy = y + 52;
      checkbox(f, 28, jy, true); txt(f, 54, jy + 1, "契約者と同じ", { size: 12, color: C.n700 });
      jy += 32;
      jy = inputField(f, 28, jy, 334, "氏名", "山田 太郎", true);
      jy = inputField(f, 28, jy, 334, "続柄", "本人", true);
      y += 208;
    }
    if (mode === "single" || mode === "edit") {
      // 積立内容 (修正シート起点)
      rectBorder(f, 16, y, 358, 70, C.white, C.w200, 16, 1);
      txt(f, 28, y + 14, "積立内容", { size: 13, bold: true, color: C.n800 });
      txt(f, 28, y + 38, "毎月 ¥10,000 / 保障期間 15年", { size: 12, color: C.n600 });
      txt(f, 320, y + 26, "編集", { size: 12, med: true, color: C.btn });
      y += 82;
    }

    // フッターCTA
    var label = mode === "p1" ? "保険金受取人情報へ  ›" : "入力内容を確認する  ›";
    actionBar(f, 820 - 72, 72);
    button(f, 20, 820 - 62, 350, label, "button", false);

    // 積立修正シート (オーバーレイ)
    if (mode === "edit") {
      var sh = rect(f, 0, 0, 390, 820, C.n900); sh.opacity = 0.4;
      rect(f, 0, 300, 390, 520, C.white, 24);
      txt(f, 24, 330, "積立内容の修正", { size: 16, bold: true, color: C.n800 });
      txt(f, 24, 372, "毎月の積立金額", { size: 12, med: true, color: C.n700 });
      txt(f, 250, 366, "¥10,000", { size: 18, bold: true, color: C.p600, right: true, w: 116, mono: true });
      rect(f, 24, 400, 342, 6, C.w200, 3); rect(f, 24, 400, 150, 6, C.p500, 3);
      txt(f, 24, 430, "保障期間", { size: 12, med: true, color: C.n700 });
      txt(f, 250, 424, "15年", { size: 18, bold: true, color: C.p600, right: true, w: 116, mono: true });
      rect(f, 24, 458, 342, 6, C.w200, 3); rect(f, 24, 458, 200, 6, C.p500, 3);
      // 給付予想額
      rect(f, 24, 490, 342, 120, C.w100, 12);
      txt(f, 38, 504, "給付予想額（試算）", { size: 12, bold: true, color: C.n700 });
      var er = [["5年", "¥600,000"], ["10年", "¥1,200,000"], ["15年", "¥1,800,000"]];
      for (var e = 0; e < er.length; e++) {
        txt(f, 38, 528 + e * 24, er[e][0], { size: 11, color: C.n500, w: 120 });
        txt(f, 220, 528 + e * 24, er[e][1], { size: 12, bold: true, color: C.n700, right: true, w: 130, mono: true });
      }
      button(f, 24, 748, 342, "この内容で更新", "button", false);
    }
    return f;
  }

  // ============================================================
  //  [内容確認・お支払い]  opts: acct, agree(=同意展開+全チェック+CTA活性), editBoth
  // ============================================================
  function drawStep4(name, opts) {
    var o = opts || {};
    var f = frame(name, 390, 820, C.w50);
    var y = appBar(f, 0, {});
    y = steps(f, y, 4);
    y += 12;
    // 申込内容サマリ
    rectBorder(f, 16, y, 358, 96, C.white, C.w200, 16, 1);
    var ry = y + 12;
    ry = dataRow(f, 28, ry, 334, "契約プラン", "安心セット");
    ry = dataRow(f, 28, ry, 334, "毎月の積立金額", "¥10,000");
    y += 108;

    // 契約者情報 / 保険金受取人 (両編集 = editBoth)
    var blocks = [["契約者情報", o.editBoth], ["保険金受取人", o.editBoth]];
    for (var b = 0; b < blocks.length; b++) {
      var open = blocks[b][1];
      var bh = open ? 150 : 70;
      rectBorder(f, 16, y, 358, bh, C.white, open ? C.p100 : C.w200, 16, 1);
      txt(f, 28, y + 14, blocks[b][0], { size: 12, bold: true, color: C.n900, mono: true });
      txt(f, 320, y + 13, open ? "保存" : "編集", { size: 12, med: true, color: open ? C.white : C.btn });
      if (open) {
        rect(f, 312, y + 9, 50, 24, C.p500, 8);
        txt(f, 312, y + 14, "保存", { size: 11, med: true, color: C.white, w: 50, center: true });
        var ey = y + 44;
        ey = inputField(f, 28, ey, 334, "氏名", "山田 太郎", false);
        ey = inputField(f, 28, ey, 334, "住所", "契約者と同じ", false);
      } else {
        txt(f, 28, y + 40, "山田 太郎 / 東京都千代田区…", { size: 12, color: C.n600, w: 320 });
      }
      y += bh + 12;
    }

    // お支払い詳細 (acct 展開)
    rectBorder(f, 16, y, 358, o.acct ? 150 : 56, C.white, C.w200, 16, 1);
    txt(f, 28, y + 18, "お支払い詳細", { size: 13, bold: true, color: C.n800 });
    txt(f, 340, y + 16, o.acct ? "−" : "＋", { size: 16, color: C.n400 });
    if (o.acct) {
      var ay = y + 48;
      ay = dataRow(f, 28, ay, 334, "初回お支払い", "2026/07/01");
      ay = dataRow(f, 28, ay, 334, "お支払い方法", "クレジットカード");
    }
    y += (o.acct ? 150 : 56) + 12;

    // 重要事項 同意 (agree=①展開)
    rectBorder(f, 16, y, 358, o.agree ? 150 : 56, C.white, o.agree ? C.p100 : C.w200, 14, 1);
    checkbox(f, 28, y + 18, !!o.agree);
    txt(f, 58, y + 18, "① 申込に関する注意事項の確認", { size: 12, med: true, color: C.n800, w: 280 });
    txt(f, 348, y + 16, o.agree ? "−" : "＋", { size: 16, color: C.n400 });
    if (o.agree) txt(f, 58, y + 48, "申込内容・告知事項に相違ないことを確認します。…（本文）", { size: 11, color: C.n500, w: 300, lh: 18 });

    // フッター
    actionBar(f, 820 - 96, 96);
    if (o.agree) {
      checkbox(f, 20, 820 - 84, true);
      txt(f, 50, 820 - 84, "すべての項目を確認・同意しました", { size: 12, color: C.n700, w: 320 });
      button(f, 20, 820 - 56, 350, "クレジットカード登録開始", "danger", false);
    } else {
      button(f, 20, 820 - 56, 350, "クレジットカード登録開始", "danger", true);
      txt(f, 0, 820 - 92, "すべての重要事項に同意すると進めます", { size: 11, color: C.n400, w: 390, center: true });
    }
    return f;
  }

  // ============================================================
  //  [カード承認 (外部GMO)]
  // ============================================================
  function drawCardInput() {
    var f = frame("カード入力（外部GMO）", 390, 820, C.ex100);
    var y = appBar(f, 0, { gray: true });
    rect(f, 0, y, 390, 44, C.ex50);
    txt(f, 16, y + 14, "🔒 安全な通信で保護されています", { size: 11, color: C.n500, w: 360 });
    y += 60;
    txt(f, 20, y, "クレジットカード情報の入力", { size: 16, bold: true, color: C.n800 });
    y += 36;
    rect(f, 16, y, 358, 60, C.white, 12);
    txt(f, 28, y + 14, "お支払い金額（月額）", { size: 12, color: C.n500 });
    txt(f, 250, y + 16, "¥1,290", { size: 16, bold: true, color: C.n800, right: true, w: 110, mono: true });
    y += 76;
    var fields = [["カード番号", "1234 5678 9012 3456"], ["有効期限", "MM / YY"], ["セキュリティコード", "***"], ["カード名義", "TARO YAMADA"]];
    for (var i = 0; i < fields.length; i++) y = inputField(f, 20, y, 350, fields[i][0], fields[i][1], false);
    actionBar(f, 820 - 72, 72);
    button(f, 20, 820 - 62, 350, "確認画面へ進む", "button", false);
    return f;
  }
  function drawCardConfirm() {
    var f = frame("カード確認（外部GMO）", 390, 820, C.ex100);
    var y = appBar(f, 0, { gray: true });
    y += 24;
    txt(f, 20, y, "入力内容の確認", { size: 16, bold: true, color: C.n800 });
    y += 40;
    rect(f, 16, y, 358, 200, C.white, 12);
    var ry = y + 16;
    ry = dataRow(f, 28, ry, 334, "カード番号", "**** **** **** 3456");
    ry = dataRow(f, 28, ry, 334, "有効期限", "12 / 28");
    ry = dataRow(f, 28, ry, 334, "カード名義", "TARO YAMADA");
    ry = dataRow(f, 28, ry, 334, "お支払い金額", "¥1,290 / 月");
    y += 220;
    txt(f, 20, y, "上記内容で登録します。よろしければ確定してください。", { size: 12, color: C.n600, w: 350, lh: 20 });
    actionBar(f, 820 - 72, 72);
    button(f, 20, 820 - 62, 350, "この内容で申込", "danger", false);
    return f;
  }

  // ============================================================
  //  [完了]
  // ============================================================
  function drawDone() {
    var f = frame("完了", 390, 820, C.w50);
    rect(f, 0, 0, 390, 300, C.p500);
    var ov = rect(f, 0, 0, 390, 300, C.w50); ov.opacity = 0.08;
    statusBar(f, 0, false);
    txt(f, 0, 70, "THEO  つみたて安心ほけん", { size: 13, bold: true, color: C.white, w: 390, center: true });
    rect(f, 163, 104, 64, 64, C.white, 32);
    rect(f, 177, 127, 10, 20, C.p500, 2);
    rect(f, 187, 137, 22, 10, C.p500, 2);
    txt(f, 0, 178, "お申込が完了しました", { size: 22, bold: true, color: C.n800, w: 390, center: true });
    txt(f, 0, 208, "受付番号  THEO-2026-000482", { size: 12, color: C.n500, w: 390, center: true });
    steps(f, 300, 5);
    var sy = 356;
    txt(f, 20, sy, "THEO つみたて安心ほけんのお申込が完了しました。", { size: 14, bold: true, color: C.n800, w: 350 });
    sy += 32;
    txt(f, 20, sy, "受付確認メールをご確認ください。査定結果は●日以内に再度ご登録のメールアドレス宛に連絡いたします。", { size: 12, color: C.n600, w: 350, lh: 20 });
    sy += 56;
    rectBorder(f, 16, sy, 358, 184, C.white, C.w200, 16, 1);
    txt(f, 28, sy + 14, "このあとの流れ", { size: 10, color: C.n400, mono: true });
    var flows = [
      ["1", "受付確認メール送信確認", "ご登録のメールアドレスをご確認ください。"],
      ["2", "査定・引受の確定", "通常1〜3営業日でマイページに反映されます。"],
      ["3", "初回保険料の引落し・保険開始", "翌月以降、THEOのご登録口座より。"],
    ];
    var fy = sy + 40;
    for (var i = 0; i < flows.length; i++) {
      rect(f, 28, fy, 28, 28, C.p10, 14);
      txt(f, 28, fy + 6, flows[i][0], { size: 12, bold: true, color: C.p500, w: 28, center: true, mono: true });
      txt(f, 66, fy + 4, flows[i][1], { size: 13, bold: true, color: C.n800, w: 280 });
      txt(f, 66, fy + 20, flows[i][2], { size: 11, color: C.n500, w: 280 });
      fy += 48;
    }
    actionBar(f, 820 - 72, 72);
    button(f, 20, 820 - 62, 350, "マイページに戻る", "button", false);
    return f;
  }

  // ============================================================
  //  生成 + 行レイアウト (カテゴリ別)
  // ============================================================
  var S = {
    ovA:        drawOverviewA(),
    comb:       drawCombined("商品概要 / パターンB（統合）", false, false),
    combCta:    drawCombined("商品概要 / パターンB 下部CTA（未同意）", true, false),
    combAgreed: drawCombined("商品概要 / パターンB 同意済・CTA活性", true, true),

    plan:       planBase("プラン選択 / デフォルト", {}),
    planNotice: planBase("プラン選択 / 重要事項シート", { notice: true }),
    planSim:    planBase("プラン選択 / 給付予想額展開", { sim: true }),
    planCta:    planBase("プラン選択 / 下部CTA（未同意）", { cta: true }),
    planAgreed: planBase("プラン選択 / 同意済・CTA活性", { agreed: true }),
    planVerif:  planBase("プラン選択 / メール認証済・申込へ", { verified: true }),

    pin:        drawPin("PIN認証 / デフォルト", false),
    pinFilled:  drawPin("PIN認証 / 666666入力済・活性", true),

    form:       drawForm("申込フォーム / 1ページ", "single"),
    formP1:     drawForm("申込フォーム / 2分割(契約者)", "p1"),
    formP2:     drawForm("申込フォーム / 2分割(受取人)", "p2"),
    formEdit:   drawForm("申込フォーム / 積立修正シート", "edit"),

    step4:      drawStep4("内容確認 / デフォルト", {}),
    step4Acct:  drawStep4("内容確認 / 支払詳細展開", { acct: true }),
    step4Agree: drawStep4("内容確認 / 同意全チェック・CTA活性", { agree: true }),
    step4Edit:  drawStep4("内容確認 / 契約者+受取人 両編集", { editBoth: true }),

    card:       drawCardInput(),
    cardConf:   drawCardConfirm(),
    done:       drawDone(),
  };

  var rows = [
    [S.ovA, S.comb, S.combCta, S.combAgreed],
    [S.plan, S.planNotice, S.planSim, S.planCta, S.planAgreed, S.planVerif],
    [S.pin, S.pinFilled],
    [S.form, S.formP1, S.formP2, S.formEdit],
    [S.step4, S.step4Acct, S.step4Agree, S.step4Edit],
    [S.card, S.cardConf],
    [S.done],
  ];
  var gapX = 56, gapY = 120, rowY = 0, all = [];
  for (var r = 0; r < rows.length; r++) {
    for (var i = 0; i < rows[r].length; i++) {
      rows[r][i].x = i * (390 + gapX);
      rows[r][i].y = rowY;
      all.push(rows[r][i]);
    }
    rowY += 820 + gapY;
  }

  // Smart Animate 遷移 (ハッピーパス)
  // 商品概要 → プラン選択 → 同意済CTA → PIN → 666666 → 申込フォーム → 内容確認 → 全チェックCTA → カード入力 → カード確認 → 完了 → 商品概要
  var flow = [
    [S.ovA, S.plan], [S.plan, S.planAgreed], [S.planAgreed, S.pin], [S.pin, S.pinFilled],
    [S.pinFilled, S.form], [S.form, S.step4], [S.step4, S.step4Agree], [S.step4Agree, S.card],
    [S.card, S.cardConf], [S.cardConf, S.done], [S.done, S.ovA],
  ];
  for (var fi = 0; fi < flow.length; fi++) linkFrames(flow[fi][0], flow[fi][1].id);

  figma.viewport.scrollAndZoomIntoView(all);
  figma.closePlugin("✅ THEO " + all.length + "画面を生成しました（全カテゴリ・全バリアント＋遷移）");

  } catch (err) {
    figma.closePlugin("❌ エラー: " + String(err && err.message ? err.message : err));
  }
})();
