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

## 2. あなた (デザイナー) の役割

デザイナーは以下の 4 フェーズを回します:

### フェーズ A: 入力資材を集める
顧客から以下のいずれか (複数組合せ可) を回収:
- Figma ファイル URL (デザイン or コンポーネント)
- Google AI Studio のワイヤーフレーム出力
- Excel 仕様書 (画面項目 + 埋め込みモック画像 — 保険業界では頻出)
- VI 資料 / ブランドガイドライン PDF (色・ロゴ・タイポ規定)
- 競合参考画像、ピクチャイメージ

### フェーズ B: Claude Design でデザイン化
[claude.ai/design](https://claude.ai/design) でワイヤーフレーム + 画面デザインを生成:
- フェーズ A の資材を投入
- 最初に **[HANDOFF.md §10.2 の仕様伝達テンプレ](../HANDOFF.md#10-claude-design-に渡す仕様伝達テンプレ)** を貼る (これにより Cowork 統合コストが劇的に下がる)
- 10 画面までの flow を 1 プロジェクト内で扱える
- variant 提案は別プロジェクトで生成 (HANDOFF.md §9.10 参照)
- "Hand off to Claude Code" で zip ダウンロード

### フェーズ C: 顧客レビュー
zip を Cowork に渡す → 自動で `app/<tenant>/<page>/` に統合され、Vercel にデプロイされる:
```
https://neutral-base.vercel.app/<tenant>/prototype?focus=1
```
- `?focus=1` でナビ非表示 (顧客がうろつかない説明モード)
- Basic Auth で外部から隠せる
- 修正依頼は Claude Design に戻って iteration

### フェーズ D: 確定後 (任意)
- Figma 納品が契約に含まれる場合: `html.to.design` プラグインで取り込み
- 詳細は HANDOFF.md §4-B 参照

---

## 3. あなたが「触らない」こと

役割境界を明確に:

| 担当 | やること |
|---|---|
| **Cowork (Claude)** | Claude Design 出力 zip の解析 / `app/<tenant>/<page>/` への配置 / 色 token を `tokens.css` に反映 / tsc + eslint 検証 |
| **開発者** | `tokens.css` の手動編集 (Claude Design に無い細部) / Vercel デプロイ / 本番ドメイン管理 |
| **お客様 (うちだ)** | git push (Cowork は自動 push しない方針) / Vercel 環境変数 / ドメイン |

デザイナーは **claude.ai/design** と **Figma** だけを触れば OK。Cowork や開発者の領域は触らない (= 触らなくて済む構造)。

---

## 4. 主要ノード (Dify 風 flow 図を作る素材)

以下のノード × エッジで「全体フロー図」が描けます (claude.ai/design で図化推奨):

```
┌─────────────────┐
│  入力資材        │   Figma URL / AI Studio WF / Excel 仕様書 / VI PDF / テキスト
│  (お客様提供)    │
└────────┬────────┘
         │ 投入
         ↓
┌─────────────────┐
│  Claude Design   │   claude.ai/design でワイヤーフレーム + 画面デザイン生成
│  (デザイナー)    │   ・最初に HANDOFF §10.2 テンプレを貼る
└────────┬────────┘   ・10 画面までの flow 単位
         │ Export zip
         ↓
┌─────────────────┐
│   Cowork         │   zip を解析 → app/<tenant>/<page>/ に自動配置
│  (Claude)        │   色 token を tokens.css に反映
└────────┬────────┘   tsc / eslint で検証 → コミット可能状態
         │ commit
         ↓
┌─────────────────┐
│  git push        │   お客様が手動 (Cowork は push しない方針)
│  (お客様)        │
└────────┬────────┘
         │ webhook
         ↓
┌─────────────────┐
│  Vercel          │   GitHub Integration で自動デプロイ (1〜2 分)
│  (自動)          │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  顧客レビュー URL │   https://neutral-base.vercel.app/<tenant>/prototype?focus=1
│  (顧客に共有)    │   Basic Auth + focus mode
└────────┬────────┘
         │ FB
         ↓
┌─────────────────┐
│  Claude Design に │   修正依頼を入れて再生成 → Cowork へ → ループ
│  戻って修正      │
└─────────────────┘
```

各ノードは:
- **役割** = 誰がやるか (デザイナー / Cowork / 開発 / 顧客 / Vercel)
- **成果物** = 何が出るか (zip / commit / URL / Figma file)

Dify (https://dify.ai) のフロー図形式が参考。Claude Design で図化する際は §6 の prompt を貼ると意図通りに描けます。

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
- ノードは縦に積み、上から下へ流れる
- ノード = 「役割 (デザイナー / Cowork / 開発 / お客様 / Vercel)」または
  「成果物 (Figma / 入力資材 / handoff zip / レビュー URL)」
- エッジは矢印 + その上に短い動詞 (1〜3 語: "投入", "生成", "配置" 等)
- 縦 5 レーン (Designer / Cowork / Customer / Tooling / Output) の swimlane
- 各ノードはアイコン + タイトル + 1 行説明
- フォントは Zen Kaku Gothic New、配色は primary #065fe3 を基調にしつつ各レーンを
  異なる subtle background tint で区別
- iteration loop (顧客 FB → Claude Design 戻り) を破線矢印で表現
- 印刷向けに A3 横サイズ
- 既存の design system トークン (primary/secondary/button/cta) を使うこと

[このページの §4 「主要ノード」セクション全文を貼り付け]

ついでに HANDOFF.md §10.2 (Claude Design に渡す仕様伝達テンプレ) も読んでください。
```

→ 出力された SVG / HTML を Figma に取り込んで顧客提案資料として使えます。

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
