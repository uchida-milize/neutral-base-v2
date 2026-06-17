# THEO 23画面 — Figma 直接描画プロンプト（Claude Code + Figma Desktop `use_figma`）

> このファイルの「==== ここから貼り付け ====」以降を、**ローカルの Claude Code**（Figma Desktop を起動し、対象ファイルを開いた状態）にそのまま貼ってください。Cowork からは `use_figma`（ノード生成）が使えないため、MCP 直接描画は Claude Code 側で実行します。
>
> 事前確認: Claude Code で `/mcp` を実行し `figma` が接続済みであること、`use_figma` ツールが使えることを確認。対象 Figma ファイルを Figma Desktop で開いておく。

==== ここから貼り付け ====

あなたは Figma Desktop の MCP（`use_figma`）を使って、Figma キャンバスに **THEO つみたて安心ほけんの申込フロー 23画面**を直接描画するエージェントです。**見た目の再現度を最大限に上げること**を最優先にしてください。Yes/No の確認は自動承認（-y）でノンストップで進めてください。

## 0. ゴール
- 23画面の iPhone モバイルフレーム（幅 390）を、カテゴリ別に左→右へ整然と並べ、全体を俯瞰できる状態にする。
- 各画面のコンポーネント（AppBar / Steps / Btn / Badge / Field / LockedField / Select / GroupCard / checkbox / accordion / planCard / simSlider / benefitTable / ActionBar / extBar）を省略なく再現。
- ハッピーパスの画面遷移を Figma の Interactive Prototype（Smart Animate）で結線。

## 1. ソース・オブ・トゥルース（必ず最初に読む）
リポジトリ `~/GoogleDrive/Documents/Works/MILIZE-DATA/___AI_ClaudeCode/Upload/neutral-base` の以下を読み、**実装の通りに**再現すること（推測で作らない）:
- `components/theo-tdf/claude-design/screens.tsx` — 各画面の JSX（レイアウト・文言・スタイルの正）
- `app/theo-tdf/windows/page.tsx` — 23バリアントの一覧と各バリアントの `initial*` props（何を開いた状態にするか）
- `app/globals.css` — タイポスケール（`--text-*`）/ セマンティック層 / `.theo-tdf-cd` ダーク
- `components/theo-tdf/tokens.css` — ブランド 4 スケール（primary/secondary/button/cta）+ warm
- `public/assets/theo-tdf/` — 画像アセット（hero_bg.png / hero_bg_done.png / hero-chart.png / chart_savings.png / 各 svg）
- 実レンダリング確認用: `https://neutral-base.vercel.app/theo-tdf/windows`（Basic Auth）。`get_screenshot` 不可なのでブラウザで見比べる。

## 2. 既存 Figma 資産を使う（重要・整合性）
このファイルには既に **`Color` コレクション（5 モード: xxx/aaa/acme/td-financial/theo-tdf、各40変数）** が登録済み（HANDOFF §12.4）。
- 作成する全フレーム／コンポーネントは **`theo-tdf` モード**で扱い、塗りは **既存の Color Variables にバインド**すること（`primary-color-500` 等）。生 hex の直接指定は最終手段。
- まず `use_figma` で Variables コレクションの有無と変数名を取得し、無い変数だけ §3 の値で補う。

## 3. デザイントークン早見表（globals.css / tokens.css 由来・theo-tdf）
ブランド色（anchor）:
- primary-color-500 `#065fe3`（Ink Blue：ヘッダー/sidebar/アクティブ）
- secondary-color-500 `#ff748d`（Coral：重要バッジ/リンク強調）
- button-color-500 `#007dff`（通常 filled CTA＝青ボタン）
- cta-color-500 `#ff2d2d`（申込確定の赤・1画面1つ）
- primary-10 `#e9f2fe` / primary-100 `#98c1fc` / primary-600 `#054eba` / primary-700 相当
- warm-50 `#fafaf9` / warm-100 `#f5f5f4` / warm-200 `#e7e5e4` / warm-300 `#d6d3d1`
- success `#1f8a4c` / link `#0066d1`
- neutral（テキスト）: 900 `#13202b` / 800 `#1f2937` / 700 `#334155` / 600 `#4b5563` / 500 `#6b7280` / 400 `#9ca3af` / 300 `#cbd5e1`

タイポスケール（px）— **Figma のフォントサイズに必ずこの実値を使う**:
- display-1 56 / display-2 48 / display-3 40 / display-4 32
- h1 34 / h2 28 / h3 24 / h4 20 / h5 18 / h6 16
- body-lg 16 / body 14 / caption 12 / tiny 10
- 行間は本文系 1.5〜1.6、見出しは 1.2〜1.35 目安（globals.css の各定義に合わせる）

角丸・枠:
- カード rounded-2xl=16 / ボタン rounded-xl=14 / 入力 rounded-lg=12 / バッジ rounded-full
- 枠線は warm-200/warm-300、選択時は primary

## 4. フォント
- 日本語: **Noto Sans JP**（Regular/Medium/Bold）
- 英数字・記号: **Inter**（Regular/Medium/Bold）※ Geist は Figma に無い場合が多いので Inter で代替
- ラベル/コード風（font-mono 相当）も **Inter**
- `use_figma` で各フォントを `loadFontAsync` 相当でロードしてから text を作成すること。

## 5. 見た目を最大化する絶対ルール（MCP 描画のキモ）
1. **Auto Layout を全面採用**。screens.tsx の flex / 縦積み構造をそのまま Auto Layout（縦/横・gap・padding）で再現する。絶対座標のベタ置きは禁止（崩れ・修正困難の元）。
2. **画像アセットは image fill で流し込む**。hero_bg.png（商品概要/パターンB ヒーロー）、hero_bg_done.png（完了）、hero-chart.png、各アイコン svg は `public/assets/theo-tdf/` のファイルを読み込み、`createImage` 相当で塗りに設定。塗りつぶし矩形での代用は避ける。
3. **atom は Component 化 → Instance 配置**。`AppBar` / `Steps` / `Btn`(variant: button/danger/outline・状態 enabled/disabled) / `Badge`(secondary/success) / `Field` / `LockedField` / `Select` / `GroupCard` / `ActionBar` / `Checkbox` / `PlanCard` / `ExtBar` を最初に Master Component 化し、各画面ではインスタンスを置く。これで 23画面の一貫性と将来の一括修正性が出る（HANDOFF §11.4 / §12.7 の「MCP は Variables/Components の素材作り」に合致）。
4. **塗り・文字色・枠色は Variables バインド**（§2）。
5. **余白・サイズは実クラス値**で（px-5=20, py-3.5=14, gap-3=12, h-11=44, h-16=64 等。Tailwind の数値×4px）。
6. **影**: カードは subtle（shadow-sm 相当 y2 blur8 黒6%）、ボタンは無し〜弱。
7. **iPhone フレーム**: 幅 390、ステータスバー（9:41 / 5G 100% / ノッチ）を上部に。高さは中身に合わせた可変（コンテンツをクリップしない）。ActionBar は最下部。

## 6. 作業順序（この順で進める）
1. `use_figma` 接続・選択ページ確認。Variables（Color/theo-tdf）取得。
2. テキストスタイル（display/h1〜h6/body/caption/tiny）と必要なフォントをロード。
3. **atom Master Components を作成**（§5-3 の一覧）。各 variant・状態を作る。Btn は size=h-16 固定（モバイル）。
4. 画像アセットを読み込み、共通の image paint を準備（hero 系）。
5. **1画面目「商品概要（パターンA）」を完璧に作る** → ブラウザの実画面と見比べて追い込む → これを基準パターンにする。
6. 残り22画面を、screens.tsx と windows の `initial*` 指定に従って組み立てる（atom はインスタンス再利用）。
7. カテゴリ別の行レイアウトで整列（§7）。
8. プロトタイプ遷移を結線（§8）。
9. 最後に全体を `scrollAndZoomIntoView` 相当で俯瞰。

## 7. 23画面リスト（フレーム名＝この通り）と構成参照
各画面の中身は `screens.tsx` の対応関数を正とする。`( )` 内は windows の状態指定。

[商品概要]（ヒーローは hero_bg.png）
1. 商品概要 / パターンA — `ScreenOverview`
2. 商品概要 / パターンB（統合）— `ScreenCombined`
3. 商品概要 / パターンB 下部CTA（未同意）— `ScreenCombined`（下端CTA帯表示・未チェック）
4. 商品概要 / パターンB 同意済・CTA活性 — `ScreenCombined`（チェック済・赤CTA活性）

[プラン選択]（`ScreenStep2`。Steps=2／生年月日・性別→プランカード3種→保険料シミュレーション→メール→事前同意）
5. プラン選択 / デフォルト
6. プラン選択 / 重要事項ボトムシート（`initialNoticeOpen`：下からシート＋背景シェード）
7. プラン選択 / 給付予想額アコーディオン展開（`initialSimOpen`：給付予想額テーブル表示）
8. プラン選択 / 下部CTA（未同意）（`initialShowSend`：薄青帯＋送信ボタン非活性）
9. プラン選択 / 同意済・CTA活性（`initialShowSend + initialAgree`）
10. プラン選択 / メール認証済・申込へ（`initialShowSend + initialAgree + emailVerified`：CTA「申込フォームへ進む」）

[PIN認証]（`ScreenPin`。Steps=3。鍵アイコン＋6桁入力）
11. PIN認証 / デフォルト（未入力・「認証する」非活性）
12. PIN認証 / 666666入力済・活性（`initialPin="666666"`：赤CTA活性）

[申込フォーム]（`ScreenForm`。Steps=3。契約者情報/受取人/保険内容/団体特定コード）
13. 申込フォーム / 1ページ（`single`）
14. 申込フォーム / 2分割(契約者)（`formSplit`：AppBar「お申込み(1/2)」、CTA「保険金受取人情報へ」）
15. 申込フォーム / 2分割(受取人)（`formSplit + initialFormPage=2`：AppBar「お申込み(2/2)」、受取人セクション、CTA「入力内容を確認する」）
16. 申込フォーム / 積立修正シート（`initialEditOpen + initialSheetRes`：下からシート＋給付予想額）

[内容確認]（`ScreenStep4`。Steps=4。サマリ/契約者/受取人/支払/重要事項8項目）
17. 内容確認 / デフォルト
18. 内容確認 / 支払詳細展開（`initialAcctOpen`）
19. 内容確認 / 同意全チェック・CTA活性（`initialOpenIdx=0 + initialChecks=[true×5]`：赤CTA「クレジットカード登録開始」活性）
20. 内容確認 / 契約者+受取人 両編集（`initialEditKiyaku + initialEditJuushin`：両ブロックが入力フォーム展開）

[カード承認（外部GMO）]（灰色ブラウザバー extBar / payment.gmo-pg.com）
21. カード入力 — `ScreenCardInput`（CTA「確認画面へ進む」）
22. カード確認 — `ScreenCardConfirm`（CTA「この内容で申込」）

[完了]（hero_bg_done.png）
23. 完了 — `ScreenDone`（Steps=5・チェック・受付番号・このあとの流れ・「マイページに戻る」）

## 8. プロトタイプ遷移（Smart Animate, ON_CLICK, 300ms, EASE_OUT）
ハッピーパス（フレームの最下部CTAから次へ）:
1→5→9→11→12→13→17→19→21→22→23→1
（商品概要→プラン選択→同意済CTA→PIN→666666→申込フォーム→内容確認→全チェックCTA→カード入力→カード確認→完了→商品概要に戻る）

## 9. 整列（俯瞰レイアウト）
カテゴリごとに1行（上→下）、各行は左→右。行内 gap 64、行間 gap 140。各行の高さは最大フレームに合わせる。最後に全フレームをフィット表示。

## 10. 検証
- 主要画面（商品概要・プラン選択・内容確認・完了）を、ブラウザの `https://neutral-base.vercel.app/theo-tdf/windows` の対応カードと見比べ、余白/色/サイズ/文言のズレを補正。
- 文言は screens.tsx と一字一句一致させる（CTA例: 「クレジットカード登録開始」「この内容で申込」「確認画面へ進む」「認証する」「上記に同意してメールを送信」「申込フォームへ進む」「マイページに戻る」）。

## 11. 実行方針
- Yes/No は自動承認（-y）。1画面完璧化 → 残り展開 → 遷移 → 整列 まで止まらず完遂。
- 途中でツール制限に当たったら、その内容を報告しつつ可能な範囲で最大限進める。

==== 貼り付けここまで ====

---

## 補足（うちだ様向けメモ）
- これは **Claude Code（ローカル）+ Figma Desktop MCP** 用です。Cowork からは `use_figma` が無いため実行できません（HANDOFF §12.4 / §12.6 #21）。
- §12.7 のとおり、MCP 直接描画は **Variables/Components/構造**は正確に作れますが、**画面の視覚再現は html.to.design に劣ります**。本プロンプトは Auto Layout・画像 image fill・Component 化・Variables バインドで再現度を可能な限り引き上げる構成にしています。完全なピクセル一致が要る画面は html.to.design 併用が確実です。
- 実行後に崩れた画面があれば、その画面名と Figma スクショを Cowork に貼ってください。プロンプトの該当箇所（寸法・Auto Layout 指定）を調整します。
