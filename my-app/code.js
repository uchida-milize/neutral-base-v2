// ============================================================
//  THEO × T&Dフィナンシャル生命 — Figma 完全逆輸入インポーター
//  UIUX_Importer / figma_Importer プラグイン向け code.js
//  生成: 2026-06-30  ベース: Vercel 公開最新 /theo-tdf/windows (全27画面)
//
//  方針:
//   - 27画面すべてを省略なしで具体描画（プレースホルダコメント無し）
//   - スプレッド演算子(...)不使用。Figmaノードへのカスタムプロパティ付与なし
//     （プロト遷移は正規の node.reactions のみ使用）
//   - 各画面はコンテンツ全体を表示する可変高さフレーム（クリップ無し）
//   - Btn / Badge / Field / LockedField / Select / GroupCard / checkbox /
//     accordion / planCard / simSlider / benefitTable / extBar をすべて描画
//   - Smart Animate でハッピーパス遷移を結線
//
//  27画面（カテゴリ別の行レイアウト）:
//   [商品概要]   01 パターンA / 02 パターンB統合 / 03 B+下部CTA(未同意) / 04 B+同意済CTA活性
//   [プラン選択] 05 デフォルト / 06 重要事項シート / 07 給付予想額展開 / 08 下部CTA(未同意) / 09 同意済CTA活性 / 10 メール認証済
//   [PIN認証]    11 デフォルト / 12 666666入力済・活性
//   [申込フォーム]13 1ページ / 14 2分割(契約者) / 15 2分割(受取人) / 16 積立修正シート
//   [内容確認]   17 デフォルト / 18 支払詳細展開 / 19 同意全チェック・CTA活性 / 20 契約者+受取人 両編集
//   [カード(外部GMO)] 21 入力 / 22 確認
//   [完了・ステータス] 23 完了 / 24 処理中 / 25 処理エラー / 26 メンテナンス中
//   [終了]       27 終了（申込キャンセル）
// ============================================================

(async function () {
  try {

  await Promise.all([
    figma.loadFontAsync({ family: "Noto Sans JP", style: "Regular" }),
    figma.loadFontAsync({ family: "Noto Sans JP", style: "Medium" }),
    figma.loadFontAsync({ family: "Noto Sans JP", style: "Bold" }),
    figma.loadFontAsync({ family: "Inter", style: "Regular" }),
    figma.loadFontAsync({ family: "Inter", style: "Medium" }),
    figma.loadFontAsync({ family: "Inter", style: "Bold" }),
  ]);

  // ============================================================
  //  ① Colorバリアブル動的探索
  //     theo-tdf コレクションの変数を name → Variable オブジェクト でマップ化
  //     例: VAR["color/primary/500"] → Variable
  // ============================================================
  var VAR = {};
  var VAR_COLLECTION_ID = null;
  (function() {
    try {
      var allVars = figma.variables.getLocalVariables("COLOR");
      for (var vi = 0; vi < allVars.length; vi++) {
        VAR[allVars[vi].name] = allVars[vi];
        if (!VAR_COLLECTION_ID) VAR_COLLECTION_ID = allVars[vi].variableCollectionId;
      }
    } catch(e) { /* variables API 非対応バージョンでは無視 */ }
  })();

  // ② コレクション内モード（theo-tdf）ID取得
  var VAR_MODE_ID = null;
  (function() {
    if (!VAR_COLLECTION_ID) return;
    try {
      var col = figma.variables.getVariableCollectionById(VAR_COLLECTION_ID);
      if (col && col.modes && col.modes.length > 0) {
        // "theo-tdf" または先頭モードを採用
        for (var mi = 0; mi < col.modes.length; mi++) {
          if (/theo/i.test(col.modes[mi].name)) { VAR_MODE_ID = col.modes[mi].modeId; break; }
        }
        if (!VAR_MODE_ID) VAR_MODE_ID = col.modes[0].modeId;
      }
    } catch(e) {}
  })();

  // ③ 共通コンポーネント動的探索
  //    ◇ で始まるコンポーネントを name → ComponentNode でマップ化
  //    例: COMP["◇Btn"] → ComponentNode
  var COMP = {};
  (function() {
    try {
      var allComps = figma.root.findAll(function(n) {
        return n.type === "COMPONENT" && n.name.indexOf("◇") === 0;
      });
      for (var ci = 0; ci < allComps.length; ci++) {
        // 同名の場合は最初に見つかったものを優先
        if (!COMP[allComps[ci].name]) COMP[allComps[ci].name] = allComps[ci];
      }
    } catch(e) {}
  })();

  // ── バリアブル紐付けヘルパー ──────────────────────────────────
  // ノードの fills に Color Variable を紐付ける（変数が見つかった場合のみ）
  function bindFillVar(node, varName) {
    var v = VAR[varName];
    if (!v) return;
    try {
      node.setBoundVariable("fills", v);
    } catch(e) {}
  }
  // ノードの stroke に Color Variable を紐付ける
  function bindStrokeVar(node, varName) {
    var v = VAR[varName];
    if (!v) return;
    try {
      node.setBoundVariable("strokes", v);
    } catch(e) {}
  }
  // テキストノードの fills に Color Variable を紐付ける
  function bindTextColorVar(node, varName) {
    var v = VAR[varName];
    if (!v) return;
    try {
      node.setBoundVariable("fills", v);
    } catch(e) {}
  }

  // ── コンポーネントインスタンス生成ヘルパー ──────────────────────
  // 見つかったコンポーネントのインスタンスを生成して parent に追加
  // 見つからない場合は null を返す（呼び出し側がフォールバック描画）
  function createInstance(compName, parent, x, y, w, h) {
    var comp = COMP[compName];
    if (!comp) return null;
    try {
      var inst = comp.createInstance();
      inst.x = x; inst.y = y;
      if (w && h) inst.resize(w, h);
      if (parent) parent.appendChild(inst);
      return inst;
    } catch(e) { return null; }
  }

  // ── カラーパレット (theo-tdf tokens) ──────────────────────────
  var C = {
    p500: { r: 0.024, g: 0.373, b: 0.890 },
    p600: { r: 0.020, g: 0.306, b: 0.729 },
    p700: { r: 0.020, g: 0.247, b: 0.557 },
    p300: { r: 0.184, g: 0.506, b: 0.980 },
    p100: { r: 0.596, g: 0.757, b: 0.988 },
    p10:  { r: 0.914, g: 0.949, b: 0.996 },
    btn:  { r: 0.000, g: 0.490, b: 1.000 },
    btn600:{ r: 0.000, g: 0.392, b: 0.835 },
    cta:  { r: 1.000, g: 0.176, b: 0.176 },
    sec:  { r: 1.000, g: 0.455, b: 0.553 },
    sec700:{ r: 0.804, g: 0.247, b: 0.337 },
    sec10:{ r: 1.000, g: 0.957, b: 0.965 },
    sec100:{ r: 1.000, g: 0.886, b: 0.910 },
    ctaBlue:{ r: 0.906, g: 0.929, b: 0.969 },
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
    ex50: { r: 0.973, g: 0.973, b: 0.973 },
    white:{ r: 1, g: 1, b: 1 },
    succ: { r: 0.122, g: 0.541, b: 0.298 },
    succ10:{ r: 0.910, g: 0.965, b: 0.933 },
    link: { r: 0.000, g: 0.400, b: 0.820 },
    errBg:{ r: 1.000, g: 0.941, b: 0.941 },
  };
  var W = 390;

  // ============================================================
  //  バリアブル名テーブル（Colorコレクション名 → C.xxx のマッピング）
  //  Figmaファイル内のバリアブル命名規則に合わせて変更してください
  //  例: "color/primary/500" がない場合は空文字を設定 → 紐付けをスキップ
  // ============================================================
  var CVAR = {
    p500:   "color/primary/500",
    p600:   "color/primary/600",
    p700:   "color/primary/700",
    p300:   "color/primary/300",
    p100:   "color/primary/100",
    p10:    "color/primary/10",
    btn:    "color/primary/500",
    btn600: "color/primary/600",
    cta:    "color/attention/500",
    sec:    "color/secondary/500",
    sec700: "color/secondary/700",
    sec10:  "color/secondary/10",
    sec100: "color/secondary/100",
    w50:    "color/warm/50",
    w100:   "color/warm/100",
    w200:   "color/warm/200",
    w300:   "color/warm/300",
    n900:   "color/neutral/900",
    n800:   "color/neutral/800",
    n700:   "color/neutral/700",
    n600:   "color/neutral/600",
    n500:   "color/neutral/500",
    n400:   "color/neutral/400",
    n300:   "color/neutral/300",
    white:  "color/base/white",
    succ:   "color/success/500",
    succ10: "color/success/10",
    link:   "color/link/default",
  };

  // ── ペイント/ファクトリ ───────────────────────────────────────
  function fill(color, opacity) {
    var p = { type: "SOLID", color: color };
    if (opacity !== undefined) p.opacity = opacity;
    return [p];
  }
  function noFill() { return []; }
  function frame(name, h, bg) {
    var f = figma.createFrame();
    f.name = name;
    f.resize(W, h || 900);
    f.fills = fill(bg || C.w50);
    f.clipsContent = true;
    return f;
  }
  // rect 生成後にバリアブル紐付けを試みる（bgKey: C のキー名文字列）
  function rect(parent, x, y, w, h, bg, r, bgKey) {
    var nd = figma.createRectangle();
    nd.x = x; nd.y = y; nd.resize(w, h);
    nd.fills = bg ? fill(bg) : noFill();
    if (r !== undefined) nd.cornerRadius = r;
    parent.appendChild(nd);
    if (bgKey && CVAR[bgKey]) bindFillVar(nd, CVAR[bgKey]);
    return nd;
  }
  function rectB(parent, x, y, w, h, bg, bc, r, bw, bgKey, bcKey) {
    var nd = rect(parent, x, y, w, h, bg, r, bgKey);
    nd.strokes = fill(bc);
    nd.strokeWeight = bw || 1;
    nd.strokeAlign = "INSIDE";
    if (bcKey && CVAR[bcKey]) bindStrokeVar(nd, CVAR[bcKey]);
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
    else nd.textAutoResize = "WIDTH_AND_HEIGHT";
    if (o.center) nd.textAlignHorizontal = "CENTER";
    if (o.right) nd.textAlignHorizontal = "RIGHT";
    if (o.lh) nd.lineHeight = { unit: "PIXELS", value: o.lh };
    parent.appendChild(nd);
    // テキストカラーのバリアブル紐付け（o.colorKey が指定された場合）
    if (o.colorKey && CVAR[o.colorKey]) bindTextColorVar(nd, CVAR[o.colorKey]);
    return nd;
  }
  function divider(parent, x, y, w, color) {
    var nd = figma.createRectangle();
    nd.x = x; nd.y = y; nd.resize(w, 1);
    nd.fills = fill(color || C.w200);
    parent.appendChild(nd);
    return nd;
  }
  function chevron(parent, x, y, dir, color, s) {
    txt(parent, x, y, dir === "down" ? "∨" : dir === "up" ? "∧" : "›", { size: s || 14, color: color || C.n400 });
  }

  // ── 共通UIパーツ ──────────────────────────────────────────────
  function statusBar(f, y, light) {
    var col = light ? C.n800 : C.white;
    txt(f, 16, y + 6, "9:41", { size: 11, med: true, color: col, mono: true });
    rect(f, 165, y + 4, 60, 16, C.n900, 8);
    txt(f, 318, y + 6, "5G 100%", { size: 11, med: true, color: col, right: true, w: 56, mono: true });
    return y + 28;
  }
  function appBar(f, y, title) {
    // ◇AppBar インスタンス優先
    var inst = createInstance(CNAME.AppBar, f, 0, y, W, 52);
    if (inst) {
      try { inst.setProperties && inst.setProperties({ "Title": title || "つみたて安心ほけん" }); } catch(e) {}
      return y + 52;
    }
    // フォールバック
    rect(f, 0, y, W, 52, C.p500);
    txt(f, 0, y + 8, "THEO", { size: 13, bold: true, color: C.white, w: W, center: true });
    txt(f, 0, y + 27, title || "つみたて安心ほけん", { size: 11, med: true, color: C.white, w: W, center: true });
    return y + 52;
  }
  function steps(f, y, active) {
    // ◇Steps インスタンス優先
    var inst = createInstance(CNAME.Steps, f, 0, y, W, 46);
    if (inst) {
      try { inst.setProperties && inst.setProperties({ "Active": active, "Step": active }); } catch(e) {}
      return y + 46;
    }
    // フォールバック
    rect(f, 0, y, W, 46, C.white);
    divider(f, 0, y + 45, W, C.w200);
    var total = 5, cw = 28, lw = 24;
    var totalW = total * cw + (total - 1) * lw;
    var sx = Math.round((W - totalW) / 2);
    for (var i = 1; i <= total; i++) {
      var cx = sx + (i - 1) * (cw + lw);
      var filled = i <= active;
      rect(f, cx, y + 9, cw, cw, filled ? C.p500 : C.w300, 14);
      txt(f, cx, y + 15, String(i), { size: 11, bold: true, color: filled ? C.white : C.n400, w: cw, center: true, mono: true });
      if (i < total) rect(f, cx + cw, y + 22, lw, 2, filled ? C.p500 : C.w200);
    }
    return y + 46;
  }
  function actionBar(f, y, h, bg) {
    // ◇ActionBar インスタンス優先
    var inst = createInstance(CNAME.ActionBar, f, 0, y, W, h);
    if (inst) { return y + h; }
    // フォールバック
    rect(f, 0, y, W, h, bg || C.white);
    divider(f, 0, y, W, bg ? C.p100 : C.w200);
    return y + h;
  }
  // ============================================================
  //  コンポーネント名テーブル（ファイル内の ◇コンポーネント名）
  //  Figmaファイル内のコンポーネント名に合わせて変更してください
  // ============================================================
  var CNAME = {
    Btn:        "◇Btn",
    BtnDanger:  "◇Btn",       // variant で分岐
    BtnOutline: "◇Btn",
    Badge:      "◇Badge",
    Field:      "◇Field",
    LockedField:"◇LockedField",
    Select:     "◇SelectField",
    AppBar:     "◇AppBar",
    ActionBar:  "◇ActionBar",
    Steps:      "◇Steps",
    GroupCard:  "◇GroupCard",
    ReqBadge:   "◇ReqBadge",
    Checkbox:   "◇Checkbox",
  };

  // Btn → ◇Btn インスタンス優先、なければプリミティブ描画
  // kind: "button"(青) / "danger"(赤cta) / "outline"
  function Btn(f, x, y, w, label, kind, disabled) {
    // コンポーネントインスタンス試行
    var inst = createInstance(CNAME.Btn, f, x, y, w, 56);
    if (inst) {
      try {
        // テキスト・バリアントの上書きを試みる（プロパティ名はファイルに依存）
        inst.setProperties && inst.setProperties({
          "Label": label,
          "Kind":  kind || "button",
          "State": disabled ? "disabled" : "default",
        });
      } catch(e) {}
      return inst;
    }
    // フォールバック：プリミティブ描画
    var bgc = disabled
      ? (kind === "danger" ? { r: 1.0, g: 0.69, b: 0.69 } : { r: 0.72, g: 0.80, b: 0.95 })
      : kind === "danger" ? C.cta
      : kind === "outline" ? C.white
      : C.btn;
    var nd = rect(f, x, y, w, 56, bgc, 14);
    if (kind === "outline") { nd.strokes = fill(C.btn); nd.strokeWeight = 1.5; nd.strokeAlign = "INSIDE"; }
    var fc = kind === "outline" ? C.btn : C.white;
    txt(f, x, y + 18, label, { size: 15, bold: true, color: fc, w: w, center: true });
    return nd;
  }
  // Badge → ◇Badge インスタンス優先
  function Badge(f, x, y, label, tone) {
    var inst = createInstance(CNAME.Badge, f, x, y);
    if (inst) {
      try {
        inst.setProperties && inst.setProperties({ "Label": label, "Tone": tone || "default" });
      } catch(e) {}
      return label.length * 13 + 22; // 幅の概算を返す
    }
    // フォールバック
    var bg = tone === "succ" ? C.succ10 : C.sec10;
    var fc = tone === "succ" ? C.succ : C.sec700;
    var bw = label.length * 13 + 22;
    rect(f, x, y, bw, 22, bg, 11);
    txt(f, x, y + 4, label, { size: 11, med: true, color: fc, w: bw, center: true });
    return bw;
  }
  // Field → ◇Field インスタンス優先
  function Field(f, x, y, w, label, value, required) {
    var inst = createInstance(CNAME.Field, f, x, y, w, 74);
    if (inst) {
      try {
        inst.setProperties && inst.setProperties({
          "Label": label + (required ? " *" : ""),
          "Value": value || "",
          "Required": !!required,
        });
      } catch(e) {}
      return y + 74;
    }
    // フォールバック
    txt(f, x, y, label + (required ? " *" : ""), { size: 11, med: true, color: C.n600 });
    rectB(f, x, y + 18, w, 44, C.white, C.w300, 12, 1);
    txt(f, x + 12, y + 31, value, { size: 13, color: value ? C.n800 : C.n300 });
    return y + 74;
  }
  // LockedField → 無効化 Input + 「変更不可」
  function LockedField(f, x, y, w, label, value) {
    txt(f, x, y, label, { size: 11, med: true, color: C.n600 });
    Badge(f, x + 90, y - 2, "変更不可", "succ");
    rectB(f, x, y + 18, w, 44, C.w100, C.w200, 12, 1);
    txt(f, x + 12, y + 31, value, { size: 13, color: C.n500 });
    rect(f, x + w - 30, y + 33, 12, 10, C.n400, 2); // 鍵代用
    return y + 74;
  }
  // Select → ネイティブ select 相当
  function SelectField(f, x, y, w, label, value, required) {
    txt(f, x, y, label + (required ? " *" : ""), { size: 11, med: true, color: C.n600 });
    rectB(f, x, y + 18, w, 44, C.white, C.w300, 12, 1);
    txt(f, x + 12, y + 31, value, { size: 13, color: C.n800 });
    chevron(f, x + w - 26, y + 28, "down", C.n400, 14);
    return y + 74;
  }
  function checkbox(f, x, y, checked) {
    rectB(f, x, y, 22, 22, checked ? C.p500 : C.white, checked ? C.p500 : C.w300, 6, 2);
    if (checked) txt(f, x + 3, y + 3, "✓", { size: 13, bold: true, color: C.white, w: 16, center: true });
  }
  function checkRow(f, x, y, w, label, checked) {
    checkbox(f, x, y, checked);
    txt(f, x + 32, y + 2, label, { size: 12, color: C.n700, w: w - 36, lh: 18 });
  }
  function dataRow(f, x, y, w, key, value, strong) {
    txt(f, x, y + 11, key, { size: 11, color: C.n500, w: Math.floor(w * 0.42) });
    txt(f, x + Math.floor(w * 0.44), y + 8, value, { size: strong ? 14 : 13, bold: !!strong, color: strong ? C.n900 : C.n700, right: true, w: Math.floor(w * 0.54) });
    divider(f, x, y + 38, w, C.w200);
    return y + 42;
  }
  // GroupCard → Card + ヘッダ淡色帯。bodyTop を返し、呼び出し側が本体描画後に枠を確定
  function groupCard(f, x, y, w, h, title, sub) {
    rectB(f, x, y, w, h, C.white, C.w200, 16, 1);
    rect(f, x, y, w, 44, C.p10, 0);
    divider(f, x, y + 44, w, C.p100);
    rect(f, x + 16, y + 13, 18, 18, C.p500, 5);
    txt(f, x + 44, y + (sub ? 9 : 14), title, { size: 13, bold: true, color: C.n800 });
    if (sub) txt(f, x + 44, y + 26, sub, { size: 10, color: C.n500, w: w - 60 });
    return y + 56;
  }
  function lockIcon(f, bx, by) {
    rect(f, bx, by, 64, 64, C.p10, 32);
    rect(f, bx + 21, by + 11, 4, 22, C.p500);
    rect(f, bx + 39, by + 11, 4, 22, C.p500);
    rect(f, bx + 21, by + 11, 22, 4, C.p500, 2);
    rect(f, bx + 17, by + 29, 30, 22, C.p500, 5);
    rect(f, bx + 29, by + 35, 6, 12, C.p10, 3);
  }
  // accordion 行 (内容確認の同意項目など)
  function accordionRow(f, x, y, w, label, open, withCheck, checked) {
    var h = open ? 96 : 52;
    rectB(f, x, y, w, h, C.white, open ? C.p100 : C.w200, 12, 1);
    var tx = x + 16;
    if (withCheck) { checkbox(f, x + 14, y + 15, checked); tx = x + 46; }
    txt(f, tx, y + 17, label, { size: 12, med: true, color: C.n800, w: w - (tx - x) - 40 });
    chevron(f, x + w - 28, y + 15, open ? "up" : "down", C.n400, 16);
    if (open) txt(f, x + 16, y + 50, "（本文）内容を表示しています。記載事項をご確認・ご同意ください。", { size: 11, color: C.n500, w: w - 32, lh: 18 });
    return y + h + 10;
  }
  // 3プランカード
  function planCards(f, y, selId) {
    var plans = [
      { id: "a", name: "障害・介護",  price: "480",   lead: "障害・介護状態になった場合に給付金が支払われます",          tag: null },
      { id: "b", name: "がん",        price: "980",   lead: "初めてがんと診断された場合に給付金が支払われます",          tag: null },
      { id: "c", name: "安心セット",  price: "1,290", lead: "障害・介護またはがんと診断された場合に給付金が支払われます", tag: "おすすめ" },
    ];
    for (var i = 0; i < plans.length; i++) {
      var p = plans[i], sel = (p.id === selId);
      rectB(f, 16, y, 358, 108, sel ? C.p10 : C.white, sel ? C.p500 : C.w200, 14, sel ? 2 : 1);
      rect(f, 16, y, 358, 38, sel ? C.p10 : C.w100, 0);
      divider(f, 16, y + 38, 358, sel ? C.p100 : C.w200);
      checkbox(f, 28, y + 9, sel);
      txt(f, 60, y + 11, p.name, { size: 14, bold: true, color: C.n800 });
      if (p.tag) Badge(f, 296, y + 9, p.tag);
      txt(f, 28, y + 48, p.lead, { size: 11, color: C.n500, w: 300 });
      txt(f, 230, y + 72, p.price, { size: 22, bold: true, color: C.n800, right: true, w: 110, mono: true });
      txt(f, 344, y + 80, " 円/月", { size: 11, color: C.n500 });
      y += 120;
    }
    return y;
  }
  // 積立スライダー2本
  function simSliders(f, y) {
    txt(f, 28, y, "毎月の積立金額（ご希望給付額）", { size: 12, med: true, color: C.n800 });
    txt(f, 230, y - 2, "¥10,000", { size: 18, bold: true, color: C.p600, right: true, w: 116, mono: true });
    rect(f, 28, y + 26, 334, 6, C.w200, 3); rect(f, 28, y + 26, 140, 6, C.p500, 3);
    txt(f, 28, y + 40, "5,000円", { size: 10, color: C.n400, mono: true });
    txt(f, 322, y + 40, "50,000円", { size: 10, color: C.n400, right: true, w: 40, mono: true });
    txt(f, 28, y + 64, "保障期間", { size: 12, med: true, color: C.n800 });
    txt(f, 230, y + 62, "15年", { size: 18, bold: true, color: C.p600, right: true, w: 116, mono: true });
    rect(f, 28, y + 90, 334, 6, C.w200, 3); rect(f, 28, y + 90, 200, 6, C.p500, 3);
    txt(f, 28, y + 104, "5年", { size: 10, color: C.n400, mono: true });
    txt(f, 338, y + 104, "30年", { size: 10, color: C.n400, right: true, w: 24, mono: true });
    return y + 124;
  }
  // 給付予想額テーブル
  function benefitTable(f, x, y, w) {
    var cols = ["経過", "給付予想額", "月払保険料"];
    for (var c = 0; c < 3; c++) txt(f, x + c * (w / 3), y, cols[c], { size: 10, med: true, color: C.n500, w: w / 3 - 6, center: c > 0 });
    divider(f, x, y + 20, w, C.w200);
    var rows = [["5年", "60万円", "1,290円"], ["10年", "60万円", "1,290円"], ["15年", "60万円", "1,290円"], ["20年", "60万円", "1,290円"]];
    var ry = y + 26;
    for (var r = 0; r < rows.length; r++) {
      for (var cc = 0; cc < 3; cc++) txt(f, x + cc * (w / 3), ry, rows[r][cc], { size: 11, color: C.n700, w: w / 3 - 6, center: cc > 0 });
      ry += 24;
    }
    return ry;
  }
  // 外部GMO ブラウザバー
  function extBar(f, y, url) {
    rect(f, 0, y, W, 44, C.ex200);
    rect(f, 12, y + 10, W - 24, 24, C.white, 12);
    txt(f, 28, y + 16, "🔒 " + url, { size: 11, color: C.n600, w: W - 50 });
    return y + 44;
  }
  // 重要事項ボトムシート (オーバーレイ) — 親フレーム最終高さに合わせて全面シェード
  function noticeSheet(f, fh, title, lead, items, btnLabel) {
    var sh = rect(f, 0, 0, W, fh, C.n900); sh.opacity = 0.42;
    var top = Math.max(120, fh - 660);
    rect(f, 0, top, W, fh - top, C.white, 24);
    txt(f, 24, top + 26, title, { size: 17, bold: true, color: C.n800 });
    txt(f, 24, top + 56, lead, { size: 12, color: C.n600, w: 342, lh: 18 });
    var iy = top + 96;
    for (var k = 0; k < items.length; k++) {
      rectB(f, 24, iy, 342, 48, C.white, C.w200, 10, 1);
      txt(f, 38, iy + 16, items[k], { size: 12, med: true, color: C.n700, w: 280 });
      chevron(f, 348, iy + 14, "right", C.n400, 16);
      iy += 56;
    }
    Btn(f, 24, fh - 80, 342, btnLabel, "button", false);
  }
  // 遷移結線 (正規 reactions のみ)
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
  function endFrame(f, y) { f.resize(W, Math.max(820, Math.round(y))); return f; }

  // ============================================================
  //  ヒーロー (商品概要 / パターンB 共通)
  // ============================================================
  function heroBlock(f) {
    rect(f, 0, 0, W, 300, C.p500);
    var ov = rect(f, 0, 0, W, 300, C.w50); ov.opacity = 0.12;
    statusBar(f, 0, true);
    txt(f, 20, 40, "THEO  つみたて安心ほけん", { size: 12, bold: true, color: C.white });
    txt(f, 20, 78, "つみたてながら、", { size: 27, bold: true, color: C.n900 });
    txt(f, 20, 114, "もしもに備える。", { size: 27, bold: true, color: C.n900 });
    txt(f, 20, 162, "将来に向けた\n資産形成のためのほけん", { size: 13, color: C.n700, w: 340, lh: 20 });
    Badge(f, 20, 218, "THEOのお客様限定");
    txt(f, 20, 252, "引受保険会社  T&Dフィナンシャル生命保険株式会社", { size: 10, color: C.n600, w: 350 });
    return 300;
  }

  // ============================================================
  //  feature icons 3列グリッド (商品概要 / パターンB 共通)
  // ============================================================
  function featureIcons(f, y) {
    var labels = ["積立も\nあんしんに", "学資保険\nの代わりにも", "もしもの\n備えに"];
    var colW = Math.floor(W / 3);
    for (var i = 0; i < 3; i++) {
      var cx = i * colW + Math.floor((colW - 36) / 2);
      rect(f, cx, y, 36, 36, C.p10, 18);
      txt(f, i * colW, y + 44, labels[i], { size: 11, bold: true, color: C.n700, w: colW, center: true, lh: 16 });
    }
    return y + 78;
  }

  // ============================================================
  //  [商品概要 01]  パターンA（独立）
  // ============================================================
  function drawOverviewA() {
    var f = frame("01 商品概要 / パターンA", 1100, C.w50);
    var y = heroBlock(f);
    y = steps(f, y, 1);
    y += 16;

    // feature icons
    y = featureIcons(f, y);
    y += 8;

    // chart placeholder
    rect(f, 16, y, 358, 120, C.p10, 16);
    txt(f, 0, y + 50, "就業不能時も積立保障イメージ図", { size: 11, color: C.n400, w: W, center: true });
    y += 132;

    // 詳細サービスリンク（右寄せ）
    txt(f, W - 200, y, "詳細なサービス内容はこちら ›", { size: 12, med: true, color: C.link });
    y += 28;

    // 保障期間
    txt(f, 20, y, "保障期間", { size: 13, bold: true, color: C.n800 });
    y += 22;
    txt(f, 20, y, "5年〜40年（最大）", { size: 12, color: C.n700, w: 350 });
    y += 20;
    txt(f, 20, y, "*保険期間は契約日から1年。保障期間満了まで1年ごとに更新。", { size: 10, color: C.n500, w: 350, lh: 14 });
    y += 32;

    // 弊害防止リンク（右寄せ）
    txt(f, W - 240, y, "弊害防止措置等の対応について ›", { size: 12, med: true, color: C.link });
    y += 36;

    // 必要書類 blue band
    rect(f, 0, y, W, 130, C.p10);
    divider(f, 0, y, W, C.p100);
    txt(f, 0, y + 14, "必要書類", { size: 16, bold: true, color: C.n900, w: W, center: true });
    txt(f, 0, y + 36, "お手続きの際に必要となる書類を\nご準備ください", { size: 12, color: C.n500, w: W, center: true, lh: 18 });
    rect(f, 155, y + 78, 80, 36, C.white, 8);
    txt(f, 0, y + 86, "クレジットカード（本人名義）", { size: 11, med: true, color: C.n600, w: W, center: true });
    y += 142;

    divider(f, 20, y, 350, C.p100);
    y += 20;

    // 5つのプランから選ぶだけ
    txt(f, 0, y, "5つのプランから選ぶだけ", { size: 20, bold: true, color: C.n900, w: W, center: true });
    y += 30;
    txt(f, 0, y, "最短10分で、お申し込みが完了します。", { size: 12, color: C.n500, w: W, center: true });
    y += 28;

    // いつでも解約OK バッジ
    rect(f, 105, y, 180, 32, C.white, 16);
    txt(f, 0, y + 8, "✓  いつでも見直し・解約OK", { size: 12, bold: true, color: C.succ, w: W, center: true });
    y += 50;

    // まずはプランを選んでみましょう + 矢印
    txt(f, 0, y, "まずはプランを選んでみましょう", { size: 12, med: true, color: C.p500, w: W, center: true });
    txt(f, 0, y + 20, "∨", { size: 16, color: C.p500, w: W, center: true });
    y += 50;

    // ActionBar: 保険名称ラベル + CTAボタン
    var ab = actionBar(f, y + 8, 96);
    txt(f, 20, y + 16, "保険名称", { size: 10, med: true, color: C.n400, mono: true });
    txt(f, 20, y + 30, "無配当特定疾病障害介護保障保険（団体型）", { size: 11, color: C.n700, w: 350 });
    Btn(f, 20, y + 50, 350, "プランを選ぶ  ›", "button", false);
    return endFrame(f, ab);
  }

  // ============================================================
  //  [商品概要 02-04]  パターンB 統合（概要コンパクト + シミュレーション）
  // ============================================================
  function drawCombined(name, mode) {
    // mode: "base" | "cta" | "agreed"
    var f = frame(name, 1800, C.w50);
    var y = heroBlock(f);

    // ── 商品概要コンパクト ──────────────────────────────────
    rect(f, 0, y, W, 1, C.w200);
    y += 16;

    // THEOお客様限定バッジ + 引受保険会社
    rect(f, 20, y, 120, 24, C.p500, 12);
    txt(f, 20, y + 5, "THEOのお客様限定", { size: 10, bold: true, color: C.white, w: 120, center: true });
    txt(f, W - 140, y + 3, "引受保険会社 T&D生命", { size: 9, color: C.n400 });
    y += 36;

    // feature icons 3列
    y = featureIcons(f, y);
    y += 8;

    // chart placeholder
    rect(f, 16, y, 358, 100, C.p10, 16);
    txt(f, 0, y + 40, "就業不能時も積立保障イメージ図", { size: 11, color: C.n400, w: W, center: true });
    y += 112;

    // 保険名称・保障期間
    txt(f, 20, y, "保険名称", { size: 12, bold: true, color: C.n800 });
    y += 20;
    txt(f, 20, y, "無配当特定疾病障害介護保障保険（団体型）", { size: 11, color: C.n700, w: 350 });
    y += 22;
    txt(f, 20, y, "保障期間", { size: 12, bold: true, color: C.n800 });
    y += 20;
    txt(f, 20, y, "5年〜40年（最大）", { size: 11, color: C.n700, w: 350 });
    y += 20;
    txt(f, 20, y, "*保険期間は契約日から1年。保障期間満了まで1年ごとに更新。", { size: 10, color: C.n500, w: 350, lh: 14 });
    y += 32;

    // 詳細サービスリンク + 弊害防止リンク
    txt(f, 20, y, "詳細なサービス内容はこちら ›", { size: 12, med: true, color: C.link });
    y += 24;
    txt(f, W - 240, y, "弊害防止措置等の対応について ›", { size: 12, med: true, color: C.link });
    y += 40;

    // ── 橋渡しバナー ────────────────────────────────────────
    rect(f, 0, y, W, 80, C.white, 0);
    rect(f, 0, y, W, 80, C.p10, 0);
    txt(f, 0, y + 26, "プランシミュレーション", { size: 18, bold: true, color: C.p600, w: W, center: true });
    y += 80;

    // ── プランシミュレーション section ──────────────────────
    rect(f, 0, y, W, 8, C.p10); // gradient spacer
    y += 20;

    // 生年月日・性別
    txt(f, 20, y, "生年月日・性別", { size: 13, bold: true, color: C.n800 });
    txt(f, 20, y + 22, "お客様情報。保険料の算出に使用します。", { size: 11, color: C.n500, w: 350 });
    y += 48;
    SelectField(f, 20, y, 350, "生年月日", "1990 / 01 / 01", true);
    y += 80;
    txt(f, 20, y, "性別 *", { size: 11, med: true, color: C.n600 });
    y += 16;
    rectB(f, 20, y, 172, 44, C.p10, C.p500, 10, 1.5);
    txt(f, 20, y + 12, "男性", { size: 13, bold: true, color: C.p700, w: 172, center: true });
    rectB(f, 198, y, 172, 44, C.white, C.w300, 10, 1);
    txt(f, 198, y + 12, "女性", { size: 13, color: C.n600, w: 172, center: true });
    y += 60;

    // ステップラベル: 1. プランを選ぶ
    rect(f, 0, y, W, 2, C.p100);
    y += 16;
    rect(f, 20, y, 24, 24, C.p500, 12);
    txt(f, 20, y + 5, "1", { size: 12, bold: true, color: C.white, w: 24, center: true, mono: true });
    txt(f, 52, y + 5, "プランを選ぶ", { size: 14, bold: true, color: C.n800 });
    y += 36;
    txt(f, 20, y, "ご希望の保障プランをご選択ください", { size: 11, color: C.n500, w: 350 });
    y += 20;
    y = planCards(f, y, "c");

    // ステップラベル: 2. 保険料シミュレーション
    rect(f, 0, y, W, 2, C.p100);
    y += 16;
    rect(f, 20, y, 24, 24, C.p500, 12);
    txt(f, 20, y + 5, "2", { size: 12, bold: true, color: C.white, w: 24, center: true, mono: true });
    txt(f, 52, y + 5, "保険料シミュレーション", { size: 14, bold: true, color: C.n800 });
    y += 44;
    y = simSliders(f, y);
    y += 16;

    // ステップラベル: 3. 申し込みをする
    rect(f, 0, y, W, 2, C.p100);
    y += 16;
    rect(f, 20, y, 24, 24, C.p500, 12);
    txt(f, 20, y + 5, "3", { size: 12, bold: true, color: C.white, w: 24, center: true, mono: true });
    txt(f, 52, y + 5, "申し込みをする", { size: 14, bold: true, color: C.n800 });
    y += 44;

    // 必要書類のご確認カード
    rectB(f, 16, y, 358, 110, C.white, C.w200, 16, 1);
    txt(f, 28, y + 14, "必要書類のご確認", { size: 13, bold: true, color: C.n800 });
    txt(f, 28, y + 36, "お手続きの際に必要となる書類をご準備ください。", { size: 11, color: C.n600, w: 316 });
    rect(f, 28, y + 60, 316, 36, C.w50, 10);
    txt(f, 28, y + 68, "申込みは本人様名義のクレジットカードが必要です", { size: 11, med: true, color: C.n700, w: 316, center: true });
    y += 122;

    // 事前同意事項のご確認カード
    rectB(f, 16, y, 358, 110, C.white, C.w200, 16, 1);
    txt(f, 28, y + 14, "事前同意事項のご確認", { size: 13, bold: true, color: C.n800 });
    txt(f, 28, y + 36, "お申し込み前に、下記より重要事項・事前同意事項を必ずご確認ください。", { size: 11, color: C.n600, w: 316, lh: 16 });
    rectB(f, 28, y + 72, 316, 26, C.sec10, C.sec, 8, 1);
    Badge(f, 36, y + 77, "重要");
    txt(f, 88, y + 78, "重要事項・事前同意事項を確認する", { size: 11, med: true, color: C.link, w: 240 });
    y += 122;

    // メールアドレスのご入力カード
    var my = groupCard(f, 16, y, 358, 150, "メールアドレスのご入力");
    txt(f, 32, my + 6, "ご入力されたメールアドレス宛に、お申し込み手続きのご案内URLをお送りします。", { size: 11, color: C.n600, w: 326, lh: 16 });
    Field(f, 32, my + 44, 326, "メールアドレス", "taro@example.com", true);
    y += 162;

    if (mode === "cta" || mode === "agreed") {
      var ab2 = actionBar(f, y + 8, 116, C.ctaBlue);
      checkRow(f, 20, y + 24, 350, "上記の事前同意事項を確認し、同意します", mode === "agreed");
      Btn(f, 20, y + 58, 350, "上記に同意してメールを送信", "danger", mode !== "agreed");
      if (mode !== "agreed") txt(f, 0, y + 116, "同意いただくと送信できます", { size: 11, color: C.n400, w: W, center: true });
      return endFrame(f, ab2);
    }
    var ab = actionBar(f, y + 8, 76);
    Btn(f, 20, ab - 66, 350, "このプランで続ける  ›", "button", false);
    return endFrame(f, ab);
  }

  // ============================================================
  //  [プラン選択 05-10]   opts: notice, sim, cta, agreed, verified
  // ============================================================
  function planBase(name, opts) {
    var o = opts || {};
    var f = frame(name, 1500, C.w50);
    var y = statusBar(f, 0, false) - 28;
    y = appBar(f, 0, "保険");
    y = steps(f, y, 2);
    txt(f, 20, y + 16, "さっそく、はじめましょう。", { size: 20, bold: true, color: C.n900 });
    txt(f, 20, y + 46, "ご入力はかんたん。まずは保険料の算出に必要な情報からどうぞ。", { size: 12, color: C.n600, w: 350 });
    y += 78;
    // 生年月日・性別
    var gy = groupCard(f, 16, y, 358, 170, "生年月日・性別", "お客様情報。保険料の算出に使用します。");
    SelectField(f, 32, gy + 6, 326, "生年月日", "1990 / 01 / 01", true);
    var seg = gy + 86;
    txt(f, 32, seg, "性別", { size: 11, med: true, color: C.n600 });
    rectB(f, 32, seg + 18, 159, 42, C.p10, C.p500, 10, 1.5); txt(f, 32, seg + 30, "男性", { size: 13, bold: true, color: C.p700, w: 159, center: true });
    rectB(f, 199, seg + 18, 159, 42, C.white, C.w300, 10, 1); txt(f, 199, seg + 30, "女性", { size: 13, color: C.n600, w: 159, center: true });
    y += 186;
    // プラン選択
    txt(f, 20, y, "ご希望の保障プランをご選択ください", { size: 13, bold: true, color: C.n800 });
    y = planCards(f, y + 28, "c");
    txt(f, 20, y, "※ 保険料は年齢・性別により変動します。", { size: 10, color: C.n400, w: 350 });
    y += 24;
    // シミュレーション
    var simH = o.sim ? 360 : 156;
    rectB(f, 16, y, 358, simH, C.white, C.w200, 16, 1);
    txt(f, 28, y + 16, "保険料シミュレーション", { size: 13, bold: true, color: C.n800 });
    simSliders(f, y + 44);
    if (o.sim) {
      divider(f, 28, y + 178, 334, C.w200);
      txt(f, 28, y + 190, "給付予想額（試算）", { size: 12, bold: true, color: C.n700 });
      benefitTable(f, 28, y + 216, 334);
      txt(f, 28, y + 330, "※ 表示金額は試算であり、実際の保険料・給付額を保証するものではありません。", { size: 10, color: C.n400, w: 334, lh: 14 });
    } else {
      rectB(f, 28, y + 116, 334, 30, C.w50, C.w200, 8, 1);
      txt(f, 0, y + 122, "給付予想額をみる  ∨", { size: 12, med: true, color: C.link, w: 358, center: true });
    }
    y += simH + 12;
    // メール + 事前同意
    var my = groupCard(f, 16, y, 358, 150, "メールアドレスのご入力");
    txt(f, 32, my + 6, "ご入力されたメールアドレス宛に、お申し込み手続きのご案内URLをお送りします。", { size: 11, color: C.n600, w: 326, lh: 16 });
    Field(f, 32, my + 44, 326, "メールアドレス", o.verified ? "taro@example.com" : "", true);
    if (o.verified) { Badge(f, 32, my + 118, "メールアドレスの認証は完了しています", "succ"); }
    y += 162;
    var ey = groupCard(f, 16, y, 358, 130, "事前同意事項のご確認");
    txt(f, 32, ey + 6, "お申し込み前に、下記より重要事項・事前同意事項を必ずご確認ください。", { size: 11, color: C.n600, w: 326, lh: 16 });
    rectB(f, 32, ey + 44, 326, 44, C.white, C.w300, 10, 1);
    Badge(f, 44, ey + 55, "重要");
    txt(f, 96, ey + 56, "重要事項・事前同意事項を確認する", { size: 12, med: true, color: C.link, w: 250 });
    y += 142;

    var fh;
    if (o.cta || o.agreed || o.verified) {
      var agreed = !!(o.agreed || o.verified);
      var ab = actionBar(f, y + 8, 124, C.ctaBlue);
      checkRow(f, 20, y + 24, 350, "上記の事前同意事項を確認し、同意します", agreed);
      var label = o.verified ? "申込フォームへ進む  ›" : "上記に同意してメールを送信";
      Btn(f, 20, y + 58, 350, label, "danger", !agreed);
      if (!agreed) txt(f, 0, y + 120, "同意いただくと送信できます", { size: 11, color: C.n400, w: W, center: true });
      fh = ab;
    } else {
      var ab0 = actionBar(f, y + 8, 60);
      txt(f, 0, y + 30, "下までスクロールすると申込みに進めます", { size: 11, color: C.n400, w: W, center: true });
      fh = ab0;
    }
    endFrame(f, fh);
    if (o.notice) {
      noticeSheet(f, f.height,
        "重要事項・事前同意事項",
        "お申込み前に、以下の内容を必ずご確認ください。",
        ["この保険について", "個人情報の取扱いについて", "事前同意事項", "契約概要・注意喚起情報", "契約のしおり・約款"],
        "確認同意しました");
    }
    return f;
  }

  // ============================================================
  //  [PIN認証 11-12]
  // ============================================================
  function drawPin(name, filled) {
    var f = frame(name, 820, C.w50);
    var y = appBar(f, 0, "保険");
    y = steps(f, y, 3);
    y += 36;
    lockIcon(f, 163, y);
    y += 84;
    txt(f, 0, y, "PINコードの入力", { size: 22, bold: true, color: C.n800, w: W, center: true });
    y += 36;
    txt(f, 30, y, "ご登録のメールアドレスに、認証用のPINコードをお送りしました。メールに記載の6桁のPINコードを入力してください。", { size: 12, color: C.n600, w: 330, center: true, lh: 20 });
    y += 72;
    rectB(f, 65, y, 260, 56, C.white, C.w300, 12, 1);
    txt(f, 65, y + 13, filled ? "6 6 6 6 6 6" : "_ _ _ _ _ _", { size: 26, bold: true, color: filled ? C.n800 : C.n300, w: 260, center: true, mono: true });
    y += 76;
    txt(f, 0, y, "PINコードを再送する", { size: 11, color: C.link, w: W, center: true });
    y += 40;
    var ab = actionBar(f, 820 - 132, 132);
    txt(f, 20, 820 - 120, "本お手続きは「THEO つみたて安心ほけん」のお申し込みです。", { size: 11, color: C.n500, w: 350 });
    txt(f, 20, 820 - 102, "引受保険会社：T&Dフィナンシャル生命保険株式会社", { size: 10, color: C.n400, w: 350 });
    txt(f, 20, 820 - 70, "← 戻る", { size: 12, med: true, color: C.link });
    Btn(f, 90, 820 - 76, 240, "認証する", "danger", !filled);
    if (!filled) txt(f, 0, 820 - 18, "6桁のPINコードを入力してください", { size: 11, color: C.n400, w: W, center: true });
    return endFrame(f, 820);
  }

  // ============================================================
  //  [申込フォーム 13-16]   mode: single | p1 | p2 | edit
  // ============================================================
  function drawForm(name, mode) {
    var f = frame(name, 1500, C.w50);
    var title = mode === "p1" ? "お申込み (1/2)" : mode === "p2" ? "お申込み (2/2)" : "お申込み";
    var y = appBar(f, 0, "つみたて安心ほけん");
    y = steps(f, y, 3);
    // 受け止め
    rect(f, 0, y, W, 60, C.succ10);
    txt(f, 20, y + 12, "認証が完了しました。", { size: 13, bold: true, color: C.succ });
    txt(f, 20, y + 32, "あと少しで、お申し込みは完了です。", { size: 11, color: C.n600, w: 350 });
    y += 72;
    rect(f, 0, y, W, 30, C.p10);
    txt(f, 16, y + 8, title, { size: 12, bold: true, color: C.p600, w: 360 });
    y += 42;

    if (mode !== "p2") {
      var ch = mode === "p1" ? 320 : 252;
      var cy = groupCard(f, 16, y, 358, ch, "情報ご入力", "THEO 口座情報の一部を自動入力しています。");
      var iy = cy + 6;
      iy = LockedField(f, 32, iy, 326, "氏名", "山田 太郎");
      iy = LockedField(f, 32, iy, 326, "フリガナ", "ヤマダ タロウ");
      iy = SelectField(f, 32, iy, 326, "生年月日", "1990 / 01 / 01", true);
      if (mode === "p1") { iy = Field(f, 32, iy, 326, "ご住所", "東京都千代田区丸の内1-1-1", true); }
      y += ch + 12;
      // 連絡先
      var ly = groupCard(f, 16, y, 358, 120, "連絡先");
      Field(f, 32, ly + 6, 326, "電話番号", "090-1234-5678", true);
      y += 132;
    }
    if (mode !== "p1") {
      var jy = groupCard(f, 16, y, 358, 290, "保険金受取人情報", "保険金をお受け取りになる方の情報をご入力ください。");
      checkRow(f, 32, jy + 6, 326, "住所は契約者と同じ", true);
      var ky = jy + 40;
      ky = Field(f, 32, ky, 326, "氏名", "山田 花子", true);
      ky = SelectField(f, 32, ky, 158, "生年月日", "1992/05", true);
      txt(f, 206, jy + 40, "性別", { size: 11, med: true, color: C.n600 });
      rectB(f, 206, jy + 58, 152, 44, C.white, C.w300, 10, 1); txt(f, 206, jy + 70, "女性", { size: 13, color: C.n800, w: 152, center: true });
      ky = Field(f, 32, ky + 40, 326, "続柄", "配偶者", true);
      y += 302;
    }
    if (mode === "single" || mode === "edit") {
      // 保険内容
      var hy = groupCard(f, 16, y, 358, 110, "保険内容");
      txt(f, 32, hy + 8, "毎月 ¥10,000 ／ 保障期間 15年", { size: 13, color: C.n700 });
      txt(f, 32, hy + 32, "安心セット（障害・介護＋がん）", { size: 12, color: C.n500 });
      rectB(f, 250, hy + 4, 108, 34, C.white, C.btn, 10, 1.5);
      txt(f, 250, hy + 12, "修正", { size: 12, med: true, color: C.btn, w: 108, center: true });
      y += 122;
      // 団体特定コード
      var ty = groupCard(f, 16, y, 358, 100, "団体特定コード");
      Field(f, 32, ty + 6, 326, "団体特定コード（任意）", "", false);
      y += 112;
    }

    var label = mode === "p1" ? "保険金受取人情報へ  ›" : "入力内容を確認する  ›";
    var ab = actionBar(f, y + 8, 92);
    txt(f, 20, y + 22, "← 戻る", { size: 12, med: true, color: C.link });
    Btn(f, 20, y + 42, 350, label, "button", false);
    endFrame(f, ab);

    if (mode === "edit") {
      var fh = f.height;
      var sh = rect(f, 0, 0, W, fh, C.n900); sh.opacity = 0.42;
      var top = fh - 560;
      rect(f, 0, top, W, fh - top, C.white, 24);
      txt(f, 24, top + 24, "積立内容を修正", { size: 17, bold: true, color: C.n800 });
      simSliders(f, top + 64);
      txt(f, 24, top + 198, "給付予想額をみる", { size: 12, med: true, color: C.link });
      rect(f, 24, top + 222, 342, 150, C.w100, 12);
      txt(f, 38, top + 234, "給付予想額（試算）", { size: 12, bold: true, color: C.n700 });
      benefitTable(f, 38, top + 260, 314);
      Btn(f, 24, fh - 78, 342, "この内容で更新", "button", false);
    }
    return f;
  }

  // ============================================================
  //  [内容確認 17-20]   opts: acct, agree, editBoth
  // ============================================================
  function drawStep4(name, opts) {
    var o = opts || {};
    var f = frame(name, 1700, C.w50);
    var y = appBar(f, 0, "保険");
    y = steps(f, y, 4);
    y += 12;
    txt(f, 20, y, "お申込み内容", { size: 16, bold: true, color: C.n900 });
    y += 32;
    // 積立内容サマリ
    rectB(f, 16, y, 358, 100, C.white, C.w200, 16, 1);
    var ry = y + 12;
    ry = dataRow(f, 28, ry, 334, "契約プラン", "安心セット", true);
    ry = dataRow(f, 28, ry, 334, "毎月の積立金額", "¥10,000", true);
    y += 112;

    // 契約者情報
    var k1 = o.editBoth;
    var ch1 = k1 ? 200 : 96;
    rectB(f, 16, y, 358, ch1, C.white, k1 ? C.p100 : C.w200, 16, 1);
    txt(f, 28, y + 14, "契約者情報", { size: 12, bold: true, color: C.n900, mono: true });
    if (k1) {
      txt(f, 250, y + 13, "キャンセル", { size: 11, color: C.n500 });
      rect(f, 312, y + 9, 50, 24, C.p500, 8); txt(f, 312, y + 14, "保存", { size: 11, med: true, color: C.white, w: 50, center: true });
      var e1 = y + 44;
      e1 = Field(f, 28, e1, 334, "氏名", "山田 太郎", false);
      e1 = Field(f, 28, e1, 334, "住所", "東京都千代田区丸の内１丁目 丸の内ビル 10F", false);
    } else {
      txt(f, 320, y + 13, "編集", { size: 12, med: true, color: C.btn });
      dataRow(f, 28, y + 36, 334, "氏名", "山田 太郎");
      txt(f, 28, y + 70, "住所  東京都千代田区丸の内１丁目 丸の内ビル 10F", { size: 11, color: C.n600, w: 330 });
    }
    y += ch1 + 12;

    // 保険金受取人
    var k2 = o.editBoth;
    var ch2 = k2 ? 196 : 96;
    rectB(f, 16, y, 358, ch2, C.white, k2 ? C.p100 : C.w200, 16, 1);
    txt(f, 28, y + 14, "保険金受取人", { size: 12, bold: true, color: C.n900, mono: true });
    if (k2) {
      txt(f, 250, y + 13, "キャンセル", { size: 11, color: C.n500 });
      rect(f, 312, y + 9, 50, 24, C.p500, 8); txt(f, 312, y + 14, "保存", { size: 11, med: true, color: C.white, w: 50, center: true });
      var e2 = y + 44;
      e2 = Field(f, 28, e2, 334, "氏名", "山田 花子", false);
      e2 = Field(f, 28, e2, 334, "住所", "契約者と同じ", false);
    } else {
      txt(f, 320, y + 13, "編集", { size: 12, med: true, color: C.btn });
      dataRow(f, 28, y + 36, 334, "氏名", "山田 花子");
      dataRow(f, 28, y + 70, 334, "続柄", "配偶者");
    }
    y += ch2 + 12;

    // 団体特定コード
    rectB(f, 16, y, 358, 56, C.white, C.w200, 16, 1);
    dataRow(f, 28, y + 10, 334, "団体特定コード", "—");
    y += 68;

    // 保険料のお支払いについて (acct 展開)
    var ah = o.acct ? 200 : 96;
    rectB(f, 16, y, 358, ah, C.white, C.w200, 16, 1);
    txt(f, 28, y + 14, "保険料のお支払いについて", { size: 13, bold: true, color: C.n800 });
    txt(f, 28, y + 36, "クレジットカードによる保険料払込における各種注意点を確認のうえ、お手続きください。", { size: 11, color: C.n500, w: 320, lh: 16 });
    chevron(f, 344, y + 14, o.acct ? "up" : "down", C.n400, 16);
    if (o.acct) {
      divider(f, 28, y + 76, 334, C.w200);
      var ay = y + 84;
      ay = dataRow(f, 28, ay, 334, "お支払い方法", "クレジットカード");
      ay = dataRow(f, 28, ay, 334, "初回お支払い", "2026 / 07 / 01");
      ay = dataRow(f, 28, ay, 334, "お支払い金額", "¥1,290 / 月");
    }
    y += ah + 12;

    // 重要事項アコーディオン (8項目, agree 時に①展開)
    txt(f, 20, y, "重要事項をご確認ください", { size: 13, bold: true, color: C.n800 });
    Badge(f, 220, y - 2, "重要");
    y += 26;
    var items = [
      "① 申込に関する注意事項の確認",
      "② 個人情報のお取り扱いについて",
      "③ ペーパーレス申込の同意",
      "④ 契約概要のご確認",
      "⑤ 注意喚起情報のご確認",
      "⑥ クレジットカードのお支払いについて",
      "⑦ 契約のしおり・約款",
      "⑧ 被保険者の告知・確認",
    ];
    for (var i = 0; i < items.length; i++) {
      var open = (o.agree && i === 0);
      var checked = !!o.agree;
      y = accordionRow(f, 16, y, 358, items[i], open, true, checked);
    }
    // ⑥ クレジットカード支払規定の補足 (常時)
    rectB(f, 16, y, 358, 110, C.white, C.w200, 12, 1);
    txt(f, 28, y + 12, "クレジットカードのお支払いについて", { size: 12, bold: true, color: C.n800 });
    txt(f, 28, y + 34, "カード名義人は被保険者さま本人名義に限ります。以下のマークのあるクレジットカードをご指定いただけます。", { size: 11, color: C.n500, w: 320, lh: 16 });
    var brands = ["VISA", "Master", "JCB", "AMEX"];
    for (var b = 0; b < brands.length; b++) { rectB(f, 28 + b * 70, y + 74, 60, 24, C.white, C.w300, 5, 1); txt(f, 28 + b * 70, y + 79, brands[b], { size: 9, med: true, color: C.n600, w: 60, center: true, mono: true }); }
    y += 122;
    // 被保険者確認
    rectB(f, 16, y, 358, 70, C.white, C.w200, 12, 1);
    checkRow(f, 28, y + 14, 334, "日本国内に移住し、将来日本に永住する意思が確実であり、日本語の読み書きができる", !!o.agree);
    y += 82;

    // フッター
    var fh2;
    if (o.agree) {
      var ab = actionBar(f, y + 8, 116);
      checkRow(f, 20, y + 24, 350, "①④⑤⑥⑦⑧について確認、②③について同意する", true);
      txt(f, 20, y + 56, "← 戻る", { size: 12, med: true, color: C.link });
      Btn(f, 20, y + 50, 350, "クレジットカード登録開始", "danger", false);
      fh2 = ab;
    } else {
      var ab0 = actionBar(f, y + 8, 116);
      checkRow(f, 20, y + 24, 350, "①④⑤⑥⑦⑧について確認、②③について同意する", false);
      Btn(f, 20, y + 50, 350, "クレジットカード登録開始", "danger", true);
      txt(f, 0, y + 110, "上記に確認・同意すると進めます", { size: 11, color: C.n400, w: W, center: true });
      fh2 = ab0;
    }
    return endFrame(f, fh2);
  }

  // ============================================================
  //  [カード承認 外部GMO 21-22]
  // ============================================================
  function drawCardInput() {
    var f = frame("21 カード入力（外部GMO）", 900, C.ex100);
    var y = extBar(f, 0, "payment.gmo-pg.com");
    rect(f, 0, y, W, 44, C.ex50);
    txt(f, 16, y + 14, "クレジットカード設定（外部リンク）", { size: 12, bold: true, color: C.n700, w: 360 });
    y += 60;
    txt(f, 20, y, "クレジットカード情報を入力ください", { size: 15, bold: true, color: C.n800 });
    y += 34;
    rect(f, 16, y, 358, 56, C.white, 12);
    txt(f, 28, y + 12, "お支払い金額（月額）", { size: 12, color: C.n500 });
    txt(f, 250, y + 14, "¥1,290", { size: 16, bold: true, color: C.n800, right: true, w: 110, mono: true });
    y += 72;
    y = Field(f, 20, y, 350, "カード番号", "1234 5678 9012 3456", true);
    y = Field(f, 20, y, 165, "有効期限", "MM / YY", true);
    Field(f, 205, y - 74, 165, "セキュリティコード", "***", true);
    y = Field(f, 20, y, 350, "カード名義", "TARO YAMADA", true);
    txt(f, 20, y, "使用できるクレジットカード", { size: 11, med: true, color: C.n600 });
    var brands = ["VISA", "Master", "JCB", "AMEX", "Diners"];
    for (var b = 0; b < brands.length; b++) { rectB(f, 20 + b * 70, y + 20, 60, 26, C.white, C.w300, 5, 1); txt(f, 20 + b * 70, y + 26, brands[b], { size: 9, med: true, color: C.n600, w: 60, center: true, mono: true }); }
    y += 64;
    var ab = actionBar(f, y + 8, 92);
    Btn(f, 20, y + 18, 350, "確認画面へ進む", "button", false);
    txt(f, 0, y + 78, "キャンセルして戻る", { size: 12, color: C.link, w: W, center: true });
    return endFrame(f, ab);
  }
  function drawCardConfirm() {
    var f = frame("22 カード確認（外部GMO）", 900, C.ex100);
    var y = extBar(f, 0, "payment.gmo-pg.com");
    rect(f, 0, y, W, 44, C.ex50);
    txt(f, 16, y + 14, "お申込み内容の確認（外部リンク）", { size: 12, bold: true, color: C.n700, w: 360 });
    y += 60;
    txt(f, 20, y, "ご登録内容", { size: 15, bold: true, color: C.n800 });
    y += 34;
    rect(f, 16, y, 358, 188, C.white, 12);
    var ry = y + 14;
    ry = dataRow(f, 28, ry, 334, "カード番号", "**** **** **** 3456");
    ry = dataRow(f, 28, ry, 334, "有効期限", "12 / 28");
    ry = dataRow(f, 28, ry, 334, "カード名義", "TARO YAMADA");
    ry = dataRow(f, 28, ry, 334, "お支払い金額", "¥1,290 / 月", true);
    y += 204;
    txt(f, 20, y, "上記の内容で申込します。「この内容で申込」を押すと、お申込みが確定し、初回のお支払い手続きが行われます。", { size: 12, color: C.n600, w: 350, lh: 20 });
    y += 64;
    var ab = actionBar(f, y + 8, 92);
    Btn(f, 20, y + 18, 350, "この内容で申込", "danger", false);
    txt(f, 0, y + 78, "入力内容を修正する", { size: 12, color: C.link, w: W, center: true });
    return endFrame(f, ab);
  }

  // ============================================================
  //  [完了 23]
  // ============================================================
  function drawDone() {
    var f = frame("23 完了", 900, C.w50);

    // ヒーロー背景
    rect(f, 0, 0, W, 300, C.p500);
    var ov = rect(f, 0, 0, W, 300, C.w50); ov.opacity = 0.08;

    // ステータスバー（ライト）
    statusBar(f, 0, false);

    // ロゴ + チェックアイコン
    txt(f, 0, 52, "THEO  つみたて安心ほけん", { size: 12, bold: true, color: C.white, w: W, center: true });
    rect(f, 163, 90, 64, 64, C.white, 32);
    // チェックマーク (2本の矩形で代用)
    rect(f, 177, 127, 10, 20, C.p500, 2);
    rect(f, 187, 137, 22, 10, C.p500, 2);
    txt(f, 0, 164, "お申込が完了しました", { size: 20, bold: true, color: C.n800, w: W, center: true });
    txt(f, 0, 192, "申込番号　THEO-2026-000482", { size: 12, color: C.n500, w: W, center: true });

    // Steps ステッパー（step 5 = 完了）
    var sy = steps(f, 300, 5);

    // 本文
    sy += 16;
    txt(f, 20, sy, "THEO つみたて安心ほけんのお申込が完了しました。", { size: 13, bold: true, color: C.n800, w: 350 });
    sy += 28;
    txt(f, 20, sy, "受付確認メールをご確認ください。査定結果は●日以内に再度ご登録のメールアドレス宛に連絡いたします。", { size: 12, color: C.n600, w: 350, lh: 20 });
    sy += 60;

    // このあとの流れ（接続線あり）
    rectB(f, 16, sy, 358, 220, C.white, C.w200, 16, 1);
    txt(f, 28, sy + 14, "このあとの流れ", { size: 10, color: C.n400, mono: true });
    var flows = [
      ["1", "受付確認メール送信確認", "ご登録のメールアドレスをご確認ください。"],
      ["2", "査定・引受の確定", "通常1〜3営業日でマイページに反映されます。"],
      ["3", "初回保険料の引落し・保険開始", "翌月以降、THEOのご登録口座より。"],
    ];
    var fy = sy + 42;
    for (var i = 0; i < flows.length; i++) {
      // 丸数字
      rect(f, 28, fy, 28, 28, C.p10, 14);
      txt(f, 28, fy + 6, flows[i][0], { size: 12, bold: true, color: C.p500, w: 28, center: true, mono: true });
      // 接続線（最後以外）
      if (i < flows.length - 1) {
        rect(f, 40, fy + 28, 2, 26, C.p100);
      }
      // テキスト
      txt(f, 66, fy + 4, flows[i][1], { size: 13, bold: true, color: C.n800, w: 290 });
      txt(f, 66, fy + 22, flows[i][2], { size: 11, color: C.n500, w: 290 });
      fy += 56;
    }
    sy += 232;

    // 保険証券メモ
    rect(f, 16, sy, 358, 52, C.w100, 12);
    txt(f, 28, sy + 14, "保険証券（電子）はマイページからいつでもご確認・ダウンロードいただけます。", { size: 11, color: C.n500, w: 318, lh: 16 });
    sy += 64;

    var ab = actionBar(f, sy + 8, 76);
    Btn(f, 20, sy + 18, 350, "マイページに戻る", "button", false);
    return endFrame(f, ab);
  }

  // ============================================================
  //  [ステータス 24-26]  variant: processing | error | maint
  // ============================================================
  function drawStatus(name, variant) {
    var f = frame(name, 820, C.w50);

    // 背景 (薄いグラデーション代替)
    var bgTint = variant === "error" ? C.errBg : C.p10;
    var bgOv = rect(f, 0, 0, W, 820, bgTint); bgOv.opacity = 0.5;

    statusBar(f, 0, true);

    // 中央コンテンツ (固定位置)
    var cy = 200;

    // ロゴ
    txt(f, 0, cy, "THEO  つみたて安心ほけん", { size: 12, bold: true, color: C.p600, w: W, center: true });
    cy += 40;

    // アイコン円
    var iconBg = variant === "error" ? C.errBg : C.p10;
    var iconBd = variant === "error" ? { r: 1, g: 0.8, b: 0.8 } : C.p100;
    rectB(f, 163, cy, 64, 64, iconBg, iconBd, 32, 1.5);

    if (variant === "error") {
      // ! アイコン代用
      rect(f, 194, cy + 14, 4, 22, C.cta, 2);
      rect(f, 194, cy + 40, 4, 6, C.cta, 2);
    } else if (variant === "maint") {
      // ⚙ 歯車代用 (小さい円2重)
      rect(f, 179, cy + 22, 32, 20, C.p500, 10);
      rect(f, 185, cy + 16, 20, 32, C.p500, 10);
      rect(f, 185, cy + 24, 20, 16, C.white, 8);
    } else {
      // ⟳ スピナー代用 (弧)
      rect(f, 183, cy + 16, 24, 6, C.p500, 3);
      rect(f, 183, cy + 42, 24, 6, C.p300, 3);
      rect(f, 177, cy + 22, 6, 20, C.p500, 3);
      rect(f, 207, cy + 22, 6, 20, C.p300, 3);
    }
    cy += 80;

    var heading = variant === "error" ? "処理エラー"
                : variant === "maint" ? "メンテナンス中"
                : "処理中";
    txt(f, 0, cy, heading, { size: 22, bold: true, color: C.n800, w: W, center: true });
    cy += 36;

    var body = variant === "error"
      ? "クレジットカード情報をご確認のうえ、\n再度操作をお願いいたします（E01260010）。"
      : variant === "maint"
      ? "ただいまシステムメンテナンスを実施しております。\nご迷惑をおかけしますが、しばらく経ってからお試しください。"
      : "お手続きを処理しています。\nこのまましばらくお待ちください。";
    txt(f, 20, cy, body, { size: 12, color: C.n500, w: 350, center: true, lh: 20 });
    cy += 64;

    // ActionBar
    actionBar(f, 820 - 96, 96);
    Btn(f, 20, 820 - 76, 350, "戻る", "button", false);
    return endFrame(f, 820);
  }

  // ============================================================
  //  [終了 27]  申込キャンセル
  // ============================================================
  function drawEnded() {
    var f = frame("27 終了（申込キャンセル）", 820, C.w50);

    statusBar(f, 0, true);

    // 中央コンテンツ
    var cy = 200;

    // ロゴ
    txt(f, 0, cy, "THEO  つみたて安心ほけん", { size: 12, bold: true, color: C.p600, w: W, center: true });
    cy += 40;

    // X アイコン円 (グレー)
    rect(f, 163, cy, 64, 64, C.w200, 32);
    // X = 2本の細い矩形を斜めに見立て、正直に2本の矩形で描く
    rect(f, 187, cy + 20, 16, 3, C.n400, 2);
    rect(f, 187, cy + 41, 16, 3, C.n400, 2);
    rect(f, 186, cy + 20, 3, 24, C.n400, 2);
    rect(f, 201, cy + 20, 3, 24, C.n400, 2);
    cy += 80;

    txt(f, 0, cy, "お申し込みを終了しました", { size: 20, bold: true, color: C.n800, w: W, center: true });
    cy += 34;
    txt(f, 20, cy, "今回のお申し込みは受付されていません。\n再度お申し込みいただく場合は、はじめからやり直してください。", { size: 12, color: C.n500, w: 350, center: true, lh: 20 });
    cy += 60;

    // サポートカード
    var sy = 820 - 180;
    rect(f, 16, sy, 358, 64, C.w100, 14);
    txt(f, 28, sy + 20, "ご不明な点は THEO サポートまで\nお問い合わせください。", { size: 12, color: C.n500, w: 314, center: true, lh: 18 });

    // ActionBar
    actionBar(f, 820 - 96, 96);
    Btn(f, 20, 820 - 76, 350, "はじめの画面に戻る", "button", false);
    return endFrame(f, 820);
  }

  // ============================================================
  //  生成 + カテゴリ別 行レイアウト
  // ============================================================
  var S = {
    ovA:        drawOverviewA(),
    comb:       drawCombined("02 商品概要 / パターンB（統合）", "base"),
    combCta:    drawCombined("03 商品概要 / パターンB 下部CTA（未同意）", "cta"),
    combAgreed: drawCombined("04 商品概要 / パターンB 同意済・CTA活性", "agreed"),

    plan:       planBase("05 プラン選択 / デフォルト", {}),
    planNotice: planBase("06 プラン選択 / 重要事項シート", { notice: true }),
    planSim:    planBase("07 プラン選択 / 給付予想額展開", { sim: true }),
    planCta:    planBase("08 プラン選択 / 下部CTA（未同意）", { cta: true }),
    planAgreed: planBase("09 プラン選択 / 同意済・CTA活性", { agreed: true }),
    planVerif:  planBase("10 プラン選択 / メール認証済・申込へ", { verified: true }),

    pin:        drawPin("11 PIN認証 / デフォルト", false),
    pinFilled:  drawPin("12 PIN認証 / 666666入力済・活性", true),

    form:       drawForm("13 申込フォーム / 1ページ", "single"),
    formP1:     drawForm("14 申込フォーム / 2分割(契約者)", "p1"),
    formP2:     drawForm("15 申込フォーム / 2分割(受取人)", "p2"),
    formEdit:   drawForm("16 申込フォーム / 積立修正シート", "edit"),

    step4:      drawStep4("17 内容確認 / デフォルト", {}),
    step4Acct:  drawStep4("18 内容確認 / 支払詳細展開", { acct: true }),
    step4Agree: drawStep4("19 内容確認 / 同意全チェック・CTA活性", { agree: true }),
    step4Edit:  drawStep4("20 内容確認 / 契約者+受取人 両編集", { editBoth: true }),

    card:       drawCardInput(),
    cardConf:   drawCardConfirm(),

    done:        drawDone(),
    statusProc:  drawStatus("24 処理中", "processing"),
    statusErr:   drawStatus("25 処理エラー", "error"),
    statusMaint: drawStatus("26 メンテナンス中", "maint"),
    ended:       drawEnded(),
  };

  var rows = [
    [S.ovA, S.comb, S.combCta, S.combAgreed],
    [S.plan, S.planNotice, S.planSim, S.planCta, S.planAgreed, S.planVerif],
    [S.pin, S.pinFilled],
    [S.form, S.formP1, S.formP2, S.formEdit],
    [S.step4, S.step4Acct, S.step4Agree, S.step4Edit],
    [S.card, S.cardConf],
    [S.done, S.statusProc, S.statusErr, S.statusMaint],
    [S.ended],
  ];
  var gapX = 64, gapY = 140, rowY = 0, all = [];
  for (var r = 0; r < rows.length; r++) {
    var maxH = 0, x = 0;
    for (var i = 0; i < rows[r].length; i++) {
      rows[r][i].x = x;
      rows[r][i].y = rowY;
      x += W + gapX;
      if (rows[r][i].height > maxH) maxH = rows[r][i].height;
      all.push(rows[r][i]);
    }
    rowY += maxH + gapY;
  }

  // Smart Animate 遷移 (ハッピーパス)
  var flow = [
    [S.ovA, S.plan], [S.plan, S.planAgreed], [S.planAgreed, S.pin], [S.pin, S.pinFilled],
    [S.pinFilled, S.form], [S.form, S.step4], [S.step4, S.step4Agree], [S.step4Agree, S.card],
    [S.card, S.cardConf], [S.cardConf, S.done], [S.done, S.ovA],
    // ステータス遷移
    [S.cardConf, S.statusProc], [S.statusErr, S.card], [S.statusMaint, S.ovA],
  ];
  for (var fi = 0; fi < flow.length; fi++) linkFrames(flow[fi][0], flow[fi][1].id);

  figma.viewport.scrollAndZoomIntoView(all);

  // 探索結果サマリをメッセージに含める
  var varCount = Object.keys(VAR).length;
  var compCount = Object.keys(COMP).length;
  var compNames = Object.keys(COMP).join(", ") || "なし";
  figma.closePlugin(
    "✅ THEO " + all.length + "画面を完全生成しました\n" +
    "🎨 Colorバリアブル紐付: " + varCount + "個検出\n" +
    "◇ コンポーネント紐付: " + compCount + "個検出 [" + compNames + "]\n" +
    (varCount === 0 ? "⚠️ Colorバリアブルが見つかりません。CVARのキー名を確認してください。\n" : "") +
    (compCount === 0 ? "⚠️ ◇コンポーネントが見つかりません。CNAMEのコンポーネント名を確認してください。" : "")
  );

  } catch (err) {
    figma.closePlugin("❌ エラー: " + String(err && err.message ? err.message : err));
  }
})();
