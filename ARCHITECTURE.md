# Architecture

> このドキュメントは「**なぜそう設計したか**」を残すための reference です。
> 「**どう使うか**」は [README.md](./README.md)、「**何が起きてきたか**」は [HANDOFF.md](./HANDOFF.md) を参照してください。

---

## 1. 設計の 4 原則

1. **共通の土台 1 つ × テナント別の差分**
   汎用 design system が 1 つだけあり、各顧客は「色とロゴだけ違うコピー」になる。コードベースの大半は共通、上書きは `components/<tenant>/tokens.css` の数行のみ。

2. **デザイナーと開発者が同じトークンを見る**
   Figma Variables ↔ CSS Variables ↔ Tailwind utility が **完全同期** している (`@theme inline` で alias)。デザイナーが Figma で色を変えれば、Tailwind の `bg-primary-500` も自動で追従する。

3. **テナント切り替えは scope class 1 つで完結**
   `app/<tenant>/layout.tsx` が `.<tenant>-scope` class を root に付けるだけで、配下の `bg-primary-500` 等が tenant 色に切り替わる。CSS Variables の cascade を最大活用。

4. **環境への依存を最小に**
   生 hex を書かない (token 経由)、サードパーティ font は `next/font` でセルフホスト、ダーク対応はセマンティック層で自動。これにより「ブランドが増えても判断のブレが生まれない」。

---

## 2. トークン階層 (3 レイヤー)

```
┌─────────────────────────────────────────────────────────────────┐
│ Layer 3: Tailwind utility (View 層が触る)                        │
│                                                                 │
│   bg-primary-500   text-foreground   bg-card   border-border    │
│   ───────────────────────────────────────────────────────────   │
│   ↑ @theme inline で alias                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↑
┌─────────────────────────────────────────────────────────────────┐
│ Layer 2: Semantic token (shadcn 経由 + 自前 semantic)           │
│                                                                 │
│   --primary      = var(--primary-color-500)                     │
│   --foreground   = var(--text-main)                             │
│   --card         = #ffffff (light) → #1b212b (dark)             │
│   ───────────────────────────────────────────────────────────   │
│   ↑ globals.css :root で定義、.dark で反転                       │
└─────────────────────────────────────────────────────────────────┘
                              ↑
┌─────────────────────────────────────────────────────────────────┐
│ Layer 1: Primitive (Figma Variables を起源とする生の値)         │
│                                                                 │
│   --primary-color-500: #065fe3  (theo-tdf)                      │
│   --secondary-color-500: #ff748d                                 │
│   --button-color-500: #007dff                                    │
│   --cta-color-500: #ff2d2d                                       │
│   --warm-50: #fafaf9   --warm-100: #f5f5f4 ...                  │
│   ───────────────────────────────────────────────────────────   │
│   ↑ components/<tenant>/tokens.css の .<tenant>-scope で定義     │
└─────────────────────────────────────────────────────────────────┘
```

### この階層が解く問題

- **「ブランド色を変えたい」** → Layer 1 (`tokens.css`) を編集。Layer 2/3 は触らない。
- **「ダーク対応したい」** → Layer 2 (semantic) の `.dark` variant で反転。Layer 3 (view) は同じ class を書くだけで dark mode 対応。
- **「shadcn の Button をブランド色にしたい」** → 何もしなくていい。`<Button variant="default">` は `bg-primary` を使い、scope 内で自動的にテナント色になる。

### "Layer 1 と 3 だけ触る" のがゴール

Layer 2 (semantic) は基盤として固定。Layer 1 は **デザイナーが Figma で変える** 領域、Layer 3 は **開発者がコンポーネントで書く** 領域。Layer 2 を触る = 設計判断が必要 = まれにしか起きない。

---

## 3. テナント切り替えの仕組み

### scope class の cascade

```html
<html class="dark" data-theme="dark">  ← ThemeToggle が制御
  <body>
    <div class="td-financial-scope">    ← app/td-financial/layout.tsx が付与
      <Card>                            ← bg-card text-card-foreground 使用
        <Button>申込</Button>           ← bg-primary 使用 (= --primary-color-500)
      </Card>
    </div>
  </body>
</html>
```

CSS の cascade:

```css
/* globals.css :root */
:root {
  --primary-color-500: #003388;  /* デフォルト (Navy) */
  --primary: var(--primary-color-500);  /* shadcn semantic alias */
}

/* components/td-financial/tokens.css */
.td-financial-scope {
  --primary-color-500: #003388;  /* T&D Navy */
}

/* components/theo-tdf/tokens.css */
.theo-tdf-scope {
  --primary-color-500: #065fe3;  /* THEO Blue */
  --primary: var(--primary-color-500);  /* 再 alias */
}
```

→ `<div class="theo-tdf-scope">` 配下では `bg-primary` が `#065fe3` に。同じ画面に `<div class="td-financial-scope">` を置けば `#003388` に。**1 ファイル内で複数テナント色を混在できる** (例: brand comparison ページ)。

### なぜ class scope か (= なぜ Layer 2 で shadcn の `--primary` を再 alias するか)

shadcn は `--primary` を 1 つだけ持つ前提。テナント別にしたい場合の選択肢は:

| アプローチ | Pros | Cons |
|---|---|---|
| **CSS scope class (採用)** | shadcn を改造しない / 1 画面に複数テナントを混在可 / cascade で自動 | scope class を付け忘れると default に戻る |
| Tailwind `data-*` variant | data attribute で切替 | shadcn を全面改造する必要 |
| ContextProvider + props | TypeScript が型安全 | runtime コスト / DOM 構造が重くなる |
| CSS Modules | 完全に分離 | shadcn 全 component を書き換え |

CSS scope class が最も Tailwind + shadcn の哲学と一致しており、`@layer base` と相性が良い (= utility が後勝ち)。

---

## 4. ファイル構造の理由

```
app/
├── globals.css              ← Layer 2 + 3 の定義集約 (162 colors / 13 sizes)
├── layout.tsx               ← font 読込 + 全 tenant tokens.css の root import
├── page.tsx                 ← 汎用 TOP (= まだテナント未確定の入口)
├── guidelines/              ← 汎用 ガイドライン (デザインシステム本体の説明)
├── components/              ← 汎用 コンポーネントカタログ
├── xxx/                     ← 雛形テナント (new-tenant.sh のコピー元)
├── aaa/                     ← デモテナント
├── td-financial/            ← 本番 T&Dファイナンシャル
├── theo-tdf/                ← 本番 THEO × T&D
│   ├── layout.tsx          ← .theo-tdf-scope class を付与
│   ├── page.tsx            ← テナント TOP
│   ├── guidelines/         ← テナント別 ガイドライン (色 + ボタン体系)
│   ├── components/         ← テナント別 コンポーネントカタログ
│   ├── prototype/          ← クリッカブル プロトタイプ
│   └── windows/            ← 全画面俯瞰 (Screens)
components/
├── ui/                      ← shadcn primitives (Button, Card, Input, ...)
├── guidelines/              ← AutoColorScale, AutoButtonGrid (テナント横断)
├── auto-tenant-card.tsx     ← 汎用 TOP の「ブランド別の運用」カード
├── site-header.tsx          ← TENANTS 配列 (テナント切替)
├── site-footer.tsx          ← © MILIZE フッタ (全テナント共通)
├── overview-section.tsx     ← 「30 秒で分かる」3 グループ
├── flow-diagram.tsx         ← Workflow 4 ノード曲線
├── jp-text.tsx              ← 「、」「。」位置で意味改行
└── <tenant>/                ← テナント固有実装
    ├── tokens.css           ← Layer 1: ブランド色 4 スケール
    └── claude-design/       ← (theo-tdf のみ) Claude Design 取り込み
        ├── screens.tsx
        └── app-shell.tsx
public/
├── fonts/                   ← セルフホスト font (Noto Sans JP + Zen Kaku + ...)
└── assets/                  ← ロゴ画像 / 画面キャプチャ
scripts/
├── new-tenant.sh           ← 1 コマンドでテナント生成 (6 step)
└── rename-tokens.sh        ← 旧 → 新 CSS 変数名のリネーム (改修用)
skills/
└── new-tenant/SKILL.md     ← Cowork スキル定義
```

### 「app/<tenant>/ と components/<tenant>/ がペアになっている」理由

- **app/<tenant>/** はルーティング (URL → ページ) の責務
- **components/<tenant>/** は実装の責務 (テナント固有のロジック)
- 2 つを分けることで、`app/` 配下は Next.js の routing 規約に従い、`components/` 配下は自由に整理できる。

### `components/guidelines/` が `<tenant>/` の外にある理由

`AutoColorScale` / `AutoButtonGrid` は **全テナントで共有** され、`<tenant>-scope` class の cascade で勝手に正しい色になる。テナント固有では**ない**ので、`components/<tenant>/` ではなく `components/guidelines/` に置く。

---

## 5. Tailwind v4 `@theme inline` の役割

Tailwind v4 から `@theme inline { ... }` ブロック内に CSS 変数を書くと、それが **utility class として自動公開** される。例:

```css
@theme inline {
  --color-primary-500: var(--primary-color-500);
  --text-h7: 1.2rem;
}
```

→ `bg-primary-500`, `text-primary-500`, `border-primary-500`, `text-h7` などの utility が使えるようになる。

### なぜ alias する (Layer 1 → Layer 3 を直接ではなく Layer 2 経由)

`@theme inline` 内で `--color-primary-500: #065fe3` と直書きしたら、テナントごとに変えられない (Tailwind の theme は global)。**`var()` を経由することで、scope class 内で `--primary-color-500` が再定義されると Tailwind utility も自動追従** する。これがテナント切り替えの鍵。

### `text-cd-h{N}` という別名前空間の理由

Claude Design 出力は `text-h7 = 16px` を前提としていたが、汎用 design system の `text-h7 = 19.2px`。両立のため `text-cd-h{N}` を別 namespace で追加し、Claude Design ポートだけがそれを使う形に。詳細は HANDOFF.md §9.4 参照。

---

## 6. next-themes と scope class の組み合わせ

ダークモード切替には 2 つの仕組みが連動:

### 6.1 next-themes (= `<html class="dark">`)

`components/theme-toggle.tsx` がクリック時に `<html>` の `class="dark"` と `data-theme="dark"` を切り替える。これは next-themes 標準の方式。

### 6.2 shadcn の `.dark` variant

`globals.css` 内に `.dark { --background: ...; --foreground: ...; }` のように semantic 層を反転する定義あり。`<html class="dark">` の cascade でこれが効く。

### 6.3 tenant 別 dark 上書き

各テナントが独自に dark を調整したい場合は `tokens.css` で:

```css
.dark .theo-tdf-scope {
  --primary: var(--primary-color-300);  /* dark で 1 段明るく */
  --background: #131820;                 /* 独自の dark bg */
}
```

→ `.dark .theo-tdf-scope` の specificity (2 class) で勝つ。

### 6.4 Claude Design 出力の dark 対応

Claude Design は `bg-white` `text-neutral-700` のような Tailwind built-in class を多用するので、それらの dark 対応は `[data-theme="dark"] .theo-tdf-cd [class~="bg-white"]` のような **属性セレクタ + scope class** で `!important` 上書きする方式 (HANDOFF.md §9 のセクション参照)。これは scope 内に閉じ込めているため、他テナントには影響しない。

---

## 7. `new-tenant.sh` の動作 (6 step)

```
Step 1: app/xxx/ → app/<tenant>/ を複製
Step 2: components/xxx/ → components/<tenant>/ を複製
Step 3: コピーしたファイル内の xxx (URL/import/CSS scope/CSS変数 prefix) を置換
Step 4: components/site-header.tsx の TENANTS 配列に新エントリを挿入
Step 5: app/page.tsx の TENANT_CARDS 配列 (汎用 TOP「ブランド別の運用」) に追加
Step 6: app/layout.tsx の root に tokens.css の import を挿入
```

それぞれの step に **アンカーコメント** (例: `// 新規テナントはここに追加 (new-tenant.sh で自動挿入)`) が仕込まれており、`new-tenant.sh` はそのアンカーの直前に新エントリを差し込む。冪等性のため、既存エントリは事前に除去してから再挿入する。

→ お客様は `./scripts/new-tenant.sh acme --brand-label "ACME Corp"` を 1 行打つだけで、9 ファイルが整合性をもって更新される。

詳細は [`scripts/new-tenant.sh`](./scripts/new-tenant.sh) のコメント参照。

---

## 8. Claude Design import の流れ

外部の Claude Design (claude.ai/design) で作った prototype を取り込む手順:

```
1. デザイナーが claude.ai/design で prototype を作る
   → 最初に HANDOFF.md §10.2 の仕様伝達テンプレを貼る (重要)

2. "Hand off to Claude Code" で zip ダウンロード

3. お客様が zip を Cowork チャットにアップロード

4. Cowork が以下を実行:
   - zip 展開 → screens.jsx / app.jsx / styles.css / assets/ / fonts/ を確認
   - 必要なフォントを public/fonts/ に配置
   - assets を public/assets/<tenant>/ に配置
   - globals.css に @theme inline alias を追加 (もし新規 token があれば)
   - screens.jsx → screens.tsx に変換 ("use client" 追加、ESM import、TypeScript 型付け)
   - app.jsx → app-shell.tsx に変換
   - app/<tenant>/prototype/page.tsx を新 shell を呼ぶだけに
   - app/<tenant>/windows/page.tsx を新 screens で書き直し
   - tsc + eslint クリーンを確認

5. お客様が手動で git add / commit / push
   → Vercel が自動デプロイ
```

詳細フロー: HANDOFF.md §9 (theo-tdf 取り込みの実例) 参照。
将来的にはスキル `/import-claude-design` (Priority 3、未実装) として自動化予定。

---

## 9. 設計上の「やらないこと」

- **Cowork から git push しない** (お客様が手動 commit する運用)
- **生 hex をコード内に書かない** (必ず token 経由)
- **shadcn を改造しない** (必要な時は wrapper component を作る)
- **テナントごとに `app/ui/` を持たない** (`components/ui/` は全テナント共通)
- **Tailwind の `@apply` を多用しない** (utility をそのまま class で並べる方が変更追従しやすい)
- **CSS-in-JS を入れない** (Tailwind + CSS Variables で完結)
- **`!important` は scope 内のダーク対応など止むを得ない場合のみ**

---

## 10. 関連ドキュメント

- [README.md](./README.md) — 開発者 Quickstart (5 分で動かす)
- [HANDOFF.md](./HANDOFF.md) — プロジェクトの完全ドキュメント (Cowork セッション継続用、911 行)
- [DEPLOY.md](./DEPLOY.md) — デプロイ手順 (お客様 / 開発者向け)
- [docs/designer-onboarding.md](./docs/designer-onboarding.md) — デザイナー向けオンボーディング
- [scripts/new-tenant.sh](./scripts/new-tenant.sh) — テナント追加スクリプト本体 (詳細コメント付き)
