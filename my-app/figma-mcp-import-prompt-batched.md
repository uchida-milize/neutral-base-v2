# THEO 23画面 — Figma 直接描画プロンプト【フェーズ分割版】（Claude Code + `use_figma`）

> 23画面を一度に作らせると重くて停止するため、**1回の実行＝1フェーズ**に分割する。各フェーズのブロックを順に Claude Code に貼り、終わってから次を貼る。共通ルール・トークン・フォント・画面仕様は同フォルダの **`figma-mcp-import-prompt.md`（共通仕様）** を正とする（各フェーズ冒頭で必ず読ませる）。
>
> 前提: Figma Desktop で対象ファイルを開く → Claude Code で `/mcp` を実行し `figma` 接続＆`use_figma` 利用可を確認 → 各フェーズ実行。Yes/No は自動承認(-y)。
>
> 重さ対策の共通指示（各フェーズに含めてある）: 「**このフェーズの対象だけ**を作る。1ノードずつ細かく `use_figma` を呼ばず、**1フレーム＝なるべく少ない回数のバッチ**でまとめて生成する。完了したらどこまで作ったか（フレーム名と node-id）を報告して停止する。」

---

## フェーズ0 — セットアップ＋atom Component 化（最初に1回）

==== 貼り付け（Phase 0）====
`~/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base/my-app/figma-mcp-import-prompt.md` を読み、その §1〜§5 の方針に従う。今回は **フェーズ0のみ**を実行する。

1. `use_figma` 接続確認。対象ページに `THEO 23画面` という Section（または親フレーム）を用意。
2. Color Variables（`theo-tdf` モード）の有無を確認。無い変数は共通仕様 §3 の値で作成。
3. テキストスタイル（display-1..4 / h1..h6 / body-lg / body / caption / tiny）を作成。フォントは Noto Sans JP・Inter をロード。
4. **atom Master Components を作成**（別ページ「Components」推奨）。Auto Layout・Variables バインド必須:
   - `AppBar`（青 primary / タイトル中央 / 高さ52）
   - `Steps`（5ステップ・到達数 prop）
   - `Btn`（variant: button[青 button-500] / danger[赤 cta-500] / outline、状態: enabled/disabled、高さ56・rounded-xl）
   - `Badge`（secondary[淡コーラル] / success[淡緑]）
   - `Field`（Label + Input・rounded-lg・h44）
   - `LockedField`（無効 Input + 「変更不可」バッジ + 鍵）
   - `Select`（Field + chevron）
   - `Checkbox`（on/off）
   - `GroupCard`（白カード rounded-2xl + ヘッダ淡青帯 primary-10 + タイトル）
   - `ActionBar`（最下部・上罫線・白 or 薄青）
   - `PlanCard`（プラン名/価格/特徴/選択状態）
   - `ExtBar`（GMO 灰色ブラウザバー）
5. 完了したら、作成した Variables・Styles・Components 名と node-id を一覧で報告して**停止**。画面フレームはまだ作らない。
==== 貼り付けここまで ====

---

## フェーズ1 — 商品概要 4画面（01-04）

==== 貼り付け（Phase 1）====
`my-app/figma-mcp-import-prompt.md` を読み、§7 の「商品概要」4画面（01 パターンA / 02 パターンB統合 / 03 B+下部CTA未同意 / 04 B+同意済CTA活性）**だけ**を作る。
- フェーズ0で作った atom Components のインスタンスを再利用する（atom は新規作成しない）。
- ヒーローは `public/assets/theo-tdf/hero_bg.png` を image fill で。
- 各フレームは幅390・可変高さ・Auto Layout（縦）。`screens.tsx` の `ScreenOverview` / `ScreenCombined` を正とする。
- カテゴリ行の先頭（x=0, y=0）から右へ gap64 で4枚並べる。
- 完了したら4フレームの node-id を報告して**停止**。
==== 貼り付けここまで ====

---

## フェーズ2 — プラン選択 6画面（05-10）

==== 貼り付け（Phase 2）====
`my-app/figma-mcp-import-prompt.md` を読み、§7 の「プラン選択」6画面（05 デフォルト / 06 重要事項シート / 07 給付予想額展開 / 08 下部CTA未同意 / 09 同意済CTA活性 / 10 メール認証済）**だけ**を作る。
- `screens.tsx` の `ScreenStep2` と windows の `initial*`（initialNoticeOpen / initialSimOpen / initialShowSend / initialAgree / emailVerified）に従う。
- atom はフェーズ0のインスタンス再利用。プランカードは `PlanCard` を3つ（安心セット=選択）。
- 商品概要の行の下（y は前行の最大高さ+140）に、左から右へ6枚。
- 完了したら6フレームの node-id を報告して**停止**。
==== 貼り付けここまで ====

---

## フェーズ3 — PIN認証 2画面（11-12）

==== 貼り付け（Phase 3）====
`my-app/figma-mcp-import-prompt.md` を読み、§7 の「PIN認証」2画面（11 デフォルト未入力 / 12 666666入力済・活性）**だけ**を作る。`ScreenPin` を正とする。鍵アイコン＋6桁入力＋「認証する」（12は活性）。前行の下に左→右で2枚。完了したら node-id 報告して**停止**。
==== 貼り付けここまで ====

---

## フェーズ4 — 申込フォーム 4画面（13-16）

==== 貼り付け（Phase 4）====
`my-app/figma-mcp-import-prompt.md` を読み、§7 の「申込フォーム」4画面（13 1ページ / 14 2分割契約者 / 15 2分割受取人 / 16 積立修正シート）**だけ**を作る。
- `ScreenForm` と windows の `formSplit` / `initialFormPage=2` / `initialEditOpen+initialSheetRes` に従う。
- 14 は AppBar「お申込み(1/2)」・CTA「保険金受取人情報へ」、15 は「(2/2)」・受取人セクション・CTA「入力内容を確認する」、16 は下からシート＋給付予想額。
- GroupCard / Field / LockedField / Select / Checkbox のインスタンス再利用。前行の下に左→右で4枚。完了したら node-id 報告して**停止**。
==== 貼り付けここまで ====

---

## フェーズ5 — 内容確認 4画面（17-20）

==== 貼り付け（Phase 5）====
`my-app/figma-mcp-import-prompt.md` を読み、§7 の「内容確認」4画面（17 デフォルト / 18 支払詳細展開 / 19 同意全チェック・CTA活性 / 20 契約者+受取人 両編集）**だけ**を作る。
- `ScreenStep4` と windows の `initialAcctOpen` / `initialOpenIdx=0+initialChecks=[true×5]` / `initialEditKiyaku+initialEditJuushin` に従う。
- サマリ dataRow、重要事項8項目アコーディオン（19は①展開＋全チェック）、CTA「クレジットカード登録開始」（19は赤活性）。
- 前行の下に左→右で4枚。完了したら node-id 報告して**停止**。
==== 貼り付けここまで ====

---

## フェーズ6 — カード（外部GMO）+ 完了 3画面（21-23）

==== 貼り付け（Phase 6）====
`my-app/figma-mcp-import-prompt.md` を読み、§7 の「カード承認」2画面（21 入力 / 22 確認）と「完了」1画面（23）**だけ**を作る。
- 21/22 は `ExtBar`（payment.gmo-pg.com）＋灰背景。CTA は 21「確認画面へ進む」/ 22「この内容で申込」。`ScreenCardInput` / `ScreenCardConfirm`。
- 23 は `hero_bg_done.png` ヒーロー＋チェック＋受付番号＋このあとの流れ＋「マイページに戻る」。`ScreenDone`。
- 前行の下に左→右で3枚。完了したら node-id 報告して**停止**。
==== 貼り付けここまで ====

---

## フェーズ7 — プロトタイプ遷移＋俯瞰整列（最後に1回）

==== 貼り付け（Phase 7）====
`my-app/figma-mcp-import-prompt.md` の §8・§9 に従い、**遷移結線と整列のみ**行う（新規フレームは作らない）。
1. 各画面最下部の主 CTA から次画面へ、Smart Animate（ON_CLICK / 300ms / EASE_OUT）で結線。ハッピーパス: 01→05→09→11→12→13→17→19→21→22→23→01。
2. 全フレームの整列を最終確認（カテゴリ別の行・行内 gap64・行間 gap140）。
3. 全フレームをフィット表示（scrollAndZoomIntoView 相当）。
4. 完了したら結線したペア一覧を報告。
==== 貼り付けここまで ====

---

## デザインシステム基盤 引き継ぎ情報（2026-06-29 構築済み）

> 対象ファイル: `https://www.figma.com/design/7vRRacI3x2gedlqD0oj4ja/無題`
> 以下の ID は次フェーズ（画面描画）で `use_figma` から参照すること。

### Variables コレクション

| 項目 | 値 |
|---|---|
| Collection name | `Color` |
| Collection ID | `VariableCollectionId:4:3` |
| Mode name | `theo-tdf` |
| Mode ID | `4:1` |
| 総変数数 | 44 変数 |

#### 主要変数 ID（バインドに使う代表値）

| 変数名 | ID |
|---|---|
| primary-color/10 | `VariableID:4:4` |
| primary-color/100 | `VariableID:4:6` |
| primary-color/500 | `VariableID:4:10` |
| primary-color/600 | `VariableID:4:11` |
| primary-color/700 | `VariableID:4:12` |
| secondary-color/10 | `VariableID:4:13` |
| secondary-color/700 | `VariableID:4:21` |
| button-color/500 | `VariableID:4:28` |
| button-color/600 | `VariableID:4:29` |
| cta-color/500 | `VariableID:4:37` |
| warm/50 | `VariableID:4:40` |
| warm/100 | `VariableID:4:41` |
| warm/200 | `VariableID:4:42` |
| warm/300 | `VariableID:4:43` |
| semantic/primary | `VariableID:4:44` |
| semantic/button | `VariableID:4:45` |
| semantic/cta | `VariableID:4:46` |
| semantic/secondary | `VariableID:4:47` |

### テキストスタイル（10種）

`text/h1` / `text/h2` / `text/h3` / `text/h4` / `text/h5` / `text/h6` / `text/body-lg` / `text/body` / `text/caption` / `text/tiny`（全て Noto Sans JP ベース）

### Components ページ（page ID: `4:58`）コンポーネント一覧

| コンポーネント名 | node-id | type | バリアント数 |
|---|---|---|---|
| Btn | `5:22` | COMPONENT_SET | 10 (Kind×State) |
| Badge | `5:29` | COMPONENT_SET | 3 (Tone) |
| Steps | `6:77` | COMPONENT_SET | 5 (CurrentStep) |
| AppBar | `7:14` | COMPONENT_SET | 2 (Style) |
| ActionBar | `7:19` | COMPONENT_SET | 2 (Style) |
| ReqBadge | `7:20` | COMPONENT | 1 |
| GroupCard | `7:33` | COMPONENT_SET | 2 (HasIcon) |
| Field | `7:50` | COMPONENT_SET | 4 (State) |

---

## 重さで止まる場合の追加対策
- それでも重いフェーズ（特に 2・4・5）は、さらに **1フェーズ＝2〜3画面**に割って実行（例: フェーズ2を 05-07 と 08-10 に分割）。
- 1画面内でも「`use_figma` を1ノードずつ大量に呼ぶ」と遅くなるため、**1回の `use_figma` 呼び出しで複数ノードをまとめて生成**するよう指示する（共通指示に記載済み）。
- 各フェーズ完了時に node-id を控えておくと、続きや修正を別実行で再開しやすい。
