# neutral-base — Multi-tenant Design System

> **顧客企業ごとにテーマを差し替えるデザインシステム**。
> 色とロゴを差し替えるだけで、顧客別の UI/UX を最短数日で立ち上げる、保険・金融プロダクト向けの組込ページ基盤。

🌐 **本番 URL**: https://neutral-base.vercel.app (Basic Auth 保護)
📖 **設計の詳細**: [ARCHITECTURE.md](./ARCHITECTURE.md)
🎨 **デザイナー向け**: [docs/designer-onboarding.md](./docs/designer-onboarding.md)
🤖 **AI セッション継続用**: [HANDOFF.md](./HANDOFF.md)

---

## 5 分で動かす Quickstart

```bash
# 前提: Node.js 22+, pnpm v11+
git clone https://github.com/uchida-milize/neutral-base.git
cd neutral-base

pnpm install
pnpm dev
```

→ http://localhost:3000 で開きます。

### 主要なエントリー URL

| URL | 内容 |
|---|---|
| `/` | 汎用 TOP (デザインシステムの入口) |
| `/guidelines` | 汎用ガイドライン (設計原則 / トークン / タイポ / コンポーネント) |
| `/components` | 汎用コンポーネントカタログ (shadcn primitives 25+) |
| `/xxx`, `/aaa`, `/td-financial`, `/theo-tdf` | 各テナント TOP |
| `/<tenant>/prototype` | クリッカブルプロトタイプ |
| `/<tenant>/windows` | 全画面俯瞰 (Screens) |

---

## よくある作業 (タスク別 cookbook)

### A. 新規テナントを追加する

```bash
./scripts/new-tenant.sh <tenant-name> --brand-label "ブランド表示名"
```

例:
```bash
./scripts/new-tenant.sh acme --brand-label "ACME Corp" --brand-initial "A"
```

これで以下が**全部自動**で更新されます:
1. `app/<tenant>/` (TOP / guidelines / components / prototype / windows)
2. `components/<tenant>/` (tokens.css / Claude Design 取り込み用フォルダ)
3. `components/site-header.tsx` の `TENANTS` 配列にナビ追加
4. `app/page.tsx` の `TENANT_CARDS` 配列に「ブランド別の運用」カード追加
5. `app/layout.tsx` の root に `tokens.css` の import 追加

`http://localhost:3000/<tenant-name>` でその場で立ち上がります。
詳細: [skills/new-tenant/SKILL.md](./skills/new-tenant/SKILL.md)、[ARCHITECTURE.md §7](./ARCHITECTURE.md#7-new-tenantsh-の動作-6-step)

### B. テナントの色を変える

ブランドの 4 アンカー色を編集します:

```bash
# 例: theo-tdf の primary を変えたい
$EDITOR components/theo-tdf/tokens.css
```

- 編集するのは **アンカー値** (`--primary-color-500`, `--secondary-color-500`, `--button-color-500`, `--cta-color-500`)
- 9 段階のスケール (10〜700) は anchor 相対補間で生成可能 ([HANDOFF.md §9.2](./HANDOFF.md))
- 保存すると即時 hot reload で反映
- Guidelines ページの色見本も自動更新 ([components/guidelines/auto-color-scale.tsx](./components/guidelines/auto-color-scale.tsx))

スケール生成スクリプト (Python):
```python
import colorsys
def gen(anchor_hex):
    r,g,b = [int(anchor_hex.lstrip('#')[i:i+2], 16) for i in (0,2,4)]
    h, la, s = colorsys.rgb_to_hls(r/255, g/255, b/255)
    ladder = {'10':+0.92,'50':+0.80,'100':+0.62,'200':+0.42,'300':+0.23,
              '400':+0.08,'500':0.00,'600':-0.18,'700':-0.42}
    for k, t in ladder.items():
        ln = la + (1-la)*t if t>=0 else la*(1+t)
        nr,ng,nb = colorsys.hls_to_rgb(h, ln, s)
        print(f'  --primary-color-{k}: #{int(nr*255):02x}{int(ng*255):02x}{int(nb*255):02x};')

gen('#065fe3')  # theo-tdf primary
```

### C. 新規ページを追加する

```bash
mkdir -p app/<tenant>/<page-name>
cat > app/<tenant>/<page-name>/page.tsx <<'EOF'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ページタイトル | <ブランド名>",
};

export default function MyPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <h1 className="text-h3 font-semibold sm:text-h2">タイトル</h1>
      <p className="mt-3 text-body text-muted-foreground sm:text-body-lg">
        本文...
      </p>
    </main>
  );
}
EOF
```

ナビに追加する場合は `components/site-header.tsx` の該当テナント `items` 配列に手で追加。

### D. shadcn primitive を追加する

```bash
pnpm dlx shadcn@latest add <component>
# 例:
pnpm dlx shadcn@latest add accordion
```

→ `components/ui/accordion.tsx` が自動生成されます。`/components` カタログに追加したい場合は `components/uikit-catalog.tsx` にセクションを追加。

### E. Claude Design 出力を取り込む

1. デザイナーが claude.ai/design で prototype を作る (最初に [HANDOFF.md §10.2](./HANDOFF.md#10-claude-design-に渡す仕様伝達テンプレ) を貼ること)
2. "Hand off to Claude Code" で zip ダウンロード
3. Cowork チャットに zip + 「これを取り込んで」と投入
4. Cowork が自動で:
   - `components/<tenant>/claude-design/` に screens.tsx + app-shell.tsx を配置
   - 必要 font / asset を `public/` に配置
   - `globals.css` 拡張 (新規 token があれば)
   - `app/<tenant>/prototype/page.tsx` を新 shell に差し替え
5. ローカル確認後、お客様が手動 commit / push

詳細: [ARCHITECTURE.md §8](./ARCHITECTURE.md#8-claude-design-import-の流れ)

### F. デプロイ

```bash
# 普段の更新
git add -A
git commit -m "変更の説明"     # 1 行 message 推奨
git push                        # Vercel が 1〜2 分で自動再ビルド

# .git/index.lock が残った場合 (GoogleDrive FUSE の既知問題)
rm -f .git/index.lock
```

詳細: [DEPLOY.md](./DEPLOY.md)

---

## 技術スタック

| 領域 | 採用 |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI lib | React 19 + shadcn/ui (new-york style) |
| Styling | Tailwind CSS v4 (`@theme inline` + `@custom-variant dark`) |
| Type | TypeScript 5 |
| Primitives | Radix UI |
| Font (Latin) | Geist (sans), Inter (旧 GeistMono を置換) |
| Font (JP) | Noto Sans JP (9 weights セルフホスト) + Zen Kaku Gothic New (Claude Design 出力用) |
| Font (Display) | Chillax (Fontshare CDN、Medium 単体 + size-adjust 120%) |
| Theme | next-themes ベースの light/dark + tenant scope class |
| Toast | sonner |
| Calendar | react-day-picker v10 |
| Auth | Edge Runtime Basic Auth (`middleware.ts`) |
| Deploy | Vercel (GitHub Integration による自動デプロイ) |
| Package manager | pnpm v11 (`pnpm-workspace.yaml` で sharp / unrs-resolver の allowBuilds 設定) |

---

## ディレクトリ構成 (概要)

```
app/
├── globals.css              # 162 color tokens + 13 size tokens + @theme inline alias
├── layout.tsx               # font 読込 + 全テナント tokens.css の root import
├── page.tsx                 # 汎用 TOP
├── guidelines/, components/ # 汎用ページ
├── <tenant>/                # 各テナント (xxx, aaa, td-financial, theo-tdf, ...)
│   ├── layout.tsx          # .<tenant>-scope class を付与
│   ├── page.tsx
│   ├── guidelines/, components/, prototype/, windows/
components/
├── ui/                      # shadcn primitives
├── guidelines/              # AutoColorScale, AutoButtonGrid (全テナント共有)
├── <tenant>/                # テナント固有実装
│   ├── tokens.css           # ブランド色 4 スケール
│   └── claude-design/       # (theo-tdf 等) Claude Design 取り込み
├── site-header.tsx, site-footer.tsx
├── auto-tenant-card.tsx     # 汎用 TOP「ブランド別の運用」カード
└── ...
public/
├── fonts/                   # セルフホスト font
└── assets/                  # ロゴ / 画面キャプチャ
scripts/
└── new-tenant.sh            # テナント追加 (6 step 自動)
skills/
└── new-tenant/SKILL.md
docs/
└── designer-onboarding.md   # デザイナー向け
```

詳細: [ARCHITECTURE.md §4](./ARCHITECTURE.md#4-ファイル構造の理由)

---

## チーム内コラボレーション

| ロール | やること | 主な参照 doc |
|---|---|---|
| **デザイナー** | claude.ai/design で WF / 画面デザイン作成 / Figma 連携 | [docs/designer-onboarding.md](./docs/designer-onboarding.md) |
| **開発者** | このリポジトリ編集 / shadcn 追加 / 新規ページ実装 / レビュー | このページ + [ARCHITECTURE.md](./ARCHITECTURE.md) |
| **Cowork (AI)** | Claude Design 出力の取り込み / テナント追加 / token 反映 | [HANDOFF.md](./HANDOFF.md) |
| **お客様 (うちだ)** | git commit / push / Vercel 環境変数 / ドメイン | [DEPLOY.md](./DEPLOY.md) |

---

## 関連ドキュメント

- [ARCHITECTURE.md](./ARCHITECTURE.md) — 設計の「なぜ」(トークン階層 / scope class / Tailwind v4 / new-tenant.sh の動作)
- [HANDOFF.md](./HANDOFF.md) — Cowork セッション継続用ドキュメント (911 行、完全な記録)
- [DEPLOY.md](./DEPLOY.md) — デプロイ手順
- [docs/designer-onboarding.md](./docs/designer-onboarding.md) — デザイナー向け 1 ページ
- [skills/new-tenant/SKILL.md](./skills/new-tenant/SKILL.md) — テナント追加スキル仕様
