# デザイナー向けオンボーディング

> このドキュメントは、デザイナーが本プロジェクトに参加するときに最初に読む 1 ページです。
> 技術的な深い詳細は [HANDOFF.md](../HANDOFF.md) や [ARCHITECTURE.md](../ARCHITECTURE.md) を参照してください。

---

## 1. ひとことで言うと

**顧客企業ごとにテーマを差し替えるデザインシステム**。色とロゴを差し替えるだけで、顧客別の UI/UX を最短数日で立ち上げる。保険・金融プロダクト向けの組込ページに特化。

- 共通の土台 (汎用 design system) の上に、各顧客の「専用ツリー」が乗る構造
- ブランド色は 4 スケール (primary / secondary / button / cta) で構成、それぞれ 9 段階
- ダークモード対応、アクセシビリティ (WCAG 2.2 AA) を土台に組み込み済み

---

## 2. 全体は 3 つの作業フェーズ

役割で区切ると曖昧 (デザイナーが入力収集も公開もすべて担うことが多い) なので、**作業フェーズ** で 3 つに整理します。各フェーズの中心はすべてデザイナーで、その隙間に自動化ツール (Cowork / Vercel) が挟まる構造です。

### フェーズ 1: INPUT (入力)
顧客に **ヒアリング** して、または既存資料を **回収** して、デザインの素材を集める。
- Figma ファイル URL (デザイン or コンポーネント)
- Google AI Studio のワイヤーフレーム出力
- Excel 仕様書 (画面項目 + 埋め込みモック画像 — 保険業界では頻出)
- VI 資料 / ブランドガイドライン PDF (色・ロゴ・タイポ規定)
- 競合参考画像、ピクチャイメージ
- テキストでの要件 (商品名、ターゲット、トーン)

→ 主担当: **デザイナー** (顧客との対話 + 資料整理)

### フェーズ 2: デザイン
集めた素材を [claude.ai/design](https://claude.ai/design) に投入し、ワイヤーフレーム + 画面デザインを生成。生成後は Cowork が自動で本リポジトリに統合する。
- 最初に **[HANDOFF.md §10.2 の仕様伝達テンプレ](../HANDOFF.md#10-claude-design-に渡す仕様伝達テンプレ)** を貼る (これにより Cowork 統合コストが劇的に下がる)
- 10 画面までの flow を 1 プロジェクト内で扱える
- variant 提案は別プロジェクトで生成 (HANDOFF.md §9.10 参照)
- "Hand off to Claude Code" で zip ダウンロード → Cowork に渡す
- Cowork が `app/<tenant>/<page>/` 配置 / 色 token 反映 / tsc・eslint 検証 を実行

→ 主担当: **デザイナー** (Claude Design 操作)
→ 補助: **Cowork** (zip → コードへの統合作業を自動化)

### フェーズ 3: 公開
コミット → Vercel デプロイ → 顧客レビュー URL を共有 → FB を Claude Design に戻して iteration。**デザイン関連のコミット・push もデザイナーが行う** (= デザイナーが「公開ボタン」を押す感覚)。
- デザイナーが `git add / commit / push` (Cowork は自動 push しない方針)
- Vercel が GitHub webhook で 1〜2 分で自動デプロイ
- 顧客レビュー URL: `https://neutral-base.vercel.app/<tenant>/prototype?focus=1`
  - `?focus=1` でナビ非表示 (顧客が他ページにうろつかない説明モード)
  - Basic Auth で外部閲覧を遮断
- 顧客 FB は Claude Design に戻って iteration ループ
- **任意**: Figma 納品が契約に含まれる場合は html.to.design で取り込み (HANDOFF.md §4-B 参照)

→ 主担当: **デザイナー** (push + 顧客対応 + FB 取込)
→ 自動: **Vercel** (deploy)、お客様 (うちだ) は環境変数・ドメインなど運用層のみ

---

## 3. デザイナーが「触らない」こと (= 触らずに済む構造)

ほぼ全工程がデザイナーの作業ですが、以下は **触らなくて回る** 仕組みになっています:

| 触らないもの | 代わりにやってくれる存在 |
|---|---|
| zip → React コード変換 / app/<tenant>/<page>/ 配置 | **Cowork** (Claude) が自動 |
| 色 token の `tokens.css` への手動転記 | **Cowork** が抽出 → 反映 (将来 `/init-brand-tokens` スキルで完全自動) |
| tsc / eslint / ビルド検証 | **Cowork** が commit 前に走らせる |
| Vercel デプロイ操作 | **GitHub Integration** が webhook で自動 |
| Vercel 環境変数 / ドメイン / Basic Auth 設定 | **お客様 (うちだ)** が運用層を管理 |

つまり、デザイナーは **Claude Design / Figma / git push** の 3 つのツールだけ触れば、INPUT〜公開まで一周回せる構造です。コードや CSS を直接編集する必要は基本ありません (色微調整は Cowork に「この色を `--primary-color-500` に」と伝えれば反映)。

---

## 4. 主要ノード (3 フェーズ × 各ノード)

「**作業フェーズ** = 横レーン」「**ノード** = 工程の単位」で全体フローを表します。デザイナーが主に動くフェーズと、自動化が走るフェーズが交互する構造です。

```
═══════════════════════════════════════════════════════════════════════════
                            INPUT  ◇  入力
═══════════════════════════════════════════════════════════════════════════
                            (デザイナーがヒアリング・回収)

[ 入力資材 ]
  Figma URL / AI Studio WF / Excel 仕様書 / VI PDF /
  競合参考画像 / 商品要件テキスト


═══════════════════════════════════════════════════════════════════════════
                          DESIGN  ◇  デザイン
═══════════════════════════════════════════════════════════════════════════
                          (デザイナーの主戦場 + Cowork 補助)

[ Claude Design ]                                            ← デザイナー
  claude.ai/design でワイヤーフレーム + 画面デザインを生成
  ・最初に HANDOFF §10.2 のテンプレを貼る
  ・10 画面までの flow を 1 プロジェクト内で扱える
  ・variant 提案は別プロジェクト

           ↓ Export zip

[ Cowork ]                                                   ← 自動 (Claude)
  zip を解析 → app/<tenant>/<page>/ に配置
  色 token を tokens.css に反映
  tsc / eslint で検証 → コミット可能状態


═══════════════════════════════════════════════════════════════════════════
                           PUBLISH  ◇  公開
═══════════════════════════════════════════════════════════════════════════
                           (デザイナーが公開ボタンを押す)

[ git push ]                                                 ← デザイナー
  デザイン関連の変更はデザイナーが手動 push
  (Cowork は自動 push しない方針)

           ↓ webhook

[ Vercel ]                                                   ← 自動
  GitHub Integration で受信 → 自動デプロイ (1〜2 分)

           ↓ deploy

[ 顧客レビュー URL ]                                          ← デザイナーが共有
  https://neutral-base.vercel.app/<tenant>/prototype?focus=1
  Basic Auth + focus mode (ナビ非表示)

           ↓ 顧客 FB

  ┄┄┄┄┄┄┄ Claude Design に戻って iteration ループ ┄┄┄┄┄┄┄
```

各ノードのラベル例:
- **フェーズ名 (太字)**: INPUT / DESIGN / PUBLISH
- **主担当**: デザイナー / 自動 (Cowork) / 自動 (Vercel) / お客様
- **アウトプット**: 資材一式 / zip / コミット / レビュー URL

Dify (https://dify.ai) スタイルの swimlane 図と相性が良いです。Claude Design で図化する際は §6 の prompt を貼ると意図通りに描けます。

---

## 5. Claude Design に最初に貼るテンプレ

毎回 claude.ai/design でセッションを始める時、最初に貼る prompt は **[HANDOFF.md §10.2](../HANDOFF.md#102-テンプレ本文-コピペ用)** を参照。これにより:

- ✅ Claude Design が prefix `bg-primary-500` などの既存 token を理解する
- ✅ 独自 color palette を新規定義しない
- ✅ Cowork 側の retrofit 作業がほぼゼロになる

---

## 6. Claude Design にこの flow 図を生成させる prompt

このページの §4 の図をビジュアルにする場合、claude.ai/design に以下を投入:

```
このリポジトリの全体フローを Dify (https://dify.ai) のような視覚的フロー図で
描いてください。

要件:
- レーン構成は **作業フェーズ** で 3 つの横スイムレーン:
    1. INPUT  (入力)   ← デザイナーがヒアリング・回収
    2. DESIGN (デザイン) ← デザイナー + Cowork (自動)
    3. PUBLISH (公開)  ← デザイナー + Vercel (自動)
  ※ 各レーンは異なる subtle background tint で区別
  ※ 「役割」(Designer/Cowork/Customer 等) を縦レーンにしない。
    現実にはデザイナーが大半を担うので、役割で割ると曖昧になる。
    代わりに各ノードに小さい pill で「担当: デザイナー / 自動」を表示する。

- ノード = 工程の単位 (例: Claude Design / Cowork / git push / Vercel /
  顧客レビュー URL / 入力資材)
- エッジは矢印 + その上に短い動詞 (1〜3 語: "投入", "Export zip", "コミット",
  "webhook", "deploy", "共有" 等)
- 各ノードはアイコン + タイトル + 1 行説明 + 担当 pill
- フォントは Zen Kaku Gothic New、配色は primary #065fe3 を基調
- iteration loop (顧客 FB → Claude Design 戻り) を破線矢印で表現
- 印刷向けに A3 横サイズ (3508×2480 px @ 300dpi 相当)
- 既存の design system トークン (primary/secondary/button/cta) を使う

[このページの §4 「主要ノード」セクション全文を貼り付け]

ついでに HANDOFF.md §10.2 (Claude Design に渡す仕様伝達テンプレ) も読んでください。
```

→ 出力された SVG / HTML を Figma に取り込んで顧客提案資料として使えます。

### 旧版 (5 レーン役割ベース) を作ってしまった場合

「Designer / Cowork / Customer / Tooling / Output」のような **役割ベース** の swimlane が出力されたら、それは旧 framing です。Claude Design に追加で以下を伝えると修正されます:

```
スイムレーンは役割 (Designer/Cowork/Customer/Tooling/Output) ではなく、
作業フェーズ (INPUT / DESIGN / PUBLISH) の 3 レーンに直してください。
理由: 現実にはデザイナーが入力収集 / 公開ボタン押下まで担当することが多く、
役割で割ると Customer レーンが大半空になります。
代わりに各ノードに担当 pill (デザイナー / 自動) を付けてください。
```

---

## 7. よくある質問

### Q. 同じ入力から複数 variant の WF を提案したい
**A.** 「方向性が違う variant」(タブ式 vs ウィザード式 etc.) なら **別 Claude Design プロジェクト**、「同じ方向性の細部違い」なら **同じ Claude Design プロジェクト内で iteration**。詳細は HANDOFF.md §9.10 ([リンク](../HANDOFF.md))。

### Q. VI 資料が PDF しかない時は?
**A.** Cowork に PDF を投げると `tokens.css` の 4 スケールに自動抽出されます (Priority 2 `/init-brand-tokens` スキル、現在開発中)。それまでは PDF を目視で読み取り、4 アンカー色を Cowork に直接伝えれば手動反映されます。

### Q. デザイナーがリポジトリのコードを直接編集することはある?
**A.** 原則ありません。すべて Claude Design + Cowork 経由。ただし `tokens.css` の色微調整だけは目視で `#xxxxxx` を渡せば Cowork が即反映します。

### Q. 既に Figma で作ったデザインを取り込みたい
**A.** Figma MCP 経由で Claude Design に読ませる方法と、html.to.design 経由で逆向きに取り込む 2 経路があります。HANDOFF.md §4-B 参照。

### Q. テナント数が増えた時にメニューに自動追加される?
**A.** はい。`new-tenant.sh` が `site-header.tsx`、`app/page.tsx` の TenantsSection、`app/layout.tsx` の tokens import の **3 箇所を自動更新** します (HANDOFF.md §9.5 参照)。

### Q. このプロジェクトの全体像をもっと知りたい
**A.** [HANDOFF.md](../HANDOFF.md) (911 行) が一次資料です。
- §1 構想全体フロー
- §2 現在の構築状態 (テナント一覧、技術スタック)
- §5 実装済みスキル / 機能
- §9 セッションログ (時系列で何が変わったか)
- §10 Claude Design に渡す仕様伝達テンプレ

---

## 8. 関連リンク

- [HANDOFF.md](../HANDOFF.md) — プロジェクトの完全ドキュメント (技術詳細)
- [ARCHITECTURE.md](../ARCHITECTURE.md) — トークン階層 / scope クラスの設計 (開発者向け、デザイナーは §1 だけ読めば OK)
- [README.md](../README.md) — 開発者 Quickstart
- [DEPLOY.md](../DEPLOY.md) — デプロイ手順 (お客様 / 開発者向け)
- [Vercel preview](https://neutral-base.vercel.app/) — 本番 URL (Basic Auth 要)
