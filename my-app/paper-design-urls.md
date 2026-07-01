# paper.design インポート URL 一覧
## THEO つみたて安心ほけん — T&D テナント

**ベース URL**: `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view`

---

## STEP 0 — イントロ画面

| # | 画面名 | URL |
|---|---|---|
| 00 | イントロ（ScreenIntro） | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?intro=1` |

---

## STEP 1 — 商品概要（5パターン）

| # | 画面名 | URL |
|---|---|---|
| 01 | 商品概要 パターンA（デフォルト） | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=0` |
| 02 | 商品概要 弊害防止モーダル（heigai表示） | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=0` ※ 弊害防止リンクタップで開くため静的URLなし |
| 03 | 商品概要 パターンB（統合：プランシミュ付き） | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=0&patternB=1` |
| 04 | 商品概要 パターンB／ページ下部CTA（未同意） | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=0&patternB=1&showSend=1` |
| 05 | 商品概要 パターンB／同意済・CTA活性 | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=0&patternB=1&showSend=1&agree=1` |

---

## STEP 2 — プラン選択

| # | 画面名 | URL |
|---|---|---|
| 06 | プラン選択（カード型、デフォルト） | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=1` |
| 07 | プラン選択（アコーディオン型） | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=1&planCardStyle=accordion` |
| 08 | プラン選択（シミュ先出し） | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=1&simFirst=1` |

---

## STEP 2.5 — PINコード認証

| # | 画面名 | URL |
|---|---|---|
| 09 | PINコード認証 | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=2` |

---

## STEP 3 — 申込フォーム（告知パターン別）

| # | 画面名 | URL |
|---|---|---|
| 10 | 申込フォーム（デフォルト） | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=3` |
| 11 | 申込フォーム 告知：介護障害型/死亡あり | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=3&kokuchiPattern=care_d` |
| 12 | 申込フォーム 告知：介護障害型/死亡なし | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=3&kokuchiPattern=care_n` |
| 13 | 申込フォーム 告知：がん型/死亡あり | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=3&kokuchiPattern=cancer_d` |
| 14 | 申込フォーム 告知：がん型/死亡なし | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=3&kokuchiPattern=cancer_n` |
| 15 | 申込フォーム 告知：CC型/死亡あり | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=3&kokuchiPattern=cc_d` |
| 16 | 申込フォーム 告知：CC型/死亡なし | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=3&kokuchiPattern=cc_n` |
| 17 | 申込フォーム 告知：三大疾病型/死亡あり | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=3&kokuchiPattern=three_d` |
| 18 | 申込フォーム 告知：三大疾病型/死亡なし | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=3&kokuchiPattern=three_n` |
| 19 | 申込フォーム 告知：TC型/死亡あり | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=3&kokuchiPattern=tc_d` |
| 20 | 申込フォーム 告知：TC型/死亡なし | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=3&kokuchiPattern=tc_n` |
| 21 | 申込フォーム 告知モーダル開いた状態 | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=3&kokuchiPattern=cancer_d&disclosure=1` |
| 22 | 申込フォーム エラー：インライン | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=3&errMode=inline` |
| 23 | 申込フォーム エラー：トップ | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=3&errMode=top` |
| 24 | 申込フォーム エラー：フローティング | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=3&errMode=float` |

---

## STEP 4 — 内容確認・お支払い

| # | 画面名 | URL |
|---|---|---|
| 25 | 内容確認（デフォルト） | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=4` |
| 26 | 内容確認 契約者情報編集展開 | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=4&editKiyaku=1` |
| 27 | 内容確認 受取人編集展開 | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=4&editJuushin=1` |
| 28 | 内容確認 受取人住所個別入力 | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=4&benSameAddr=0` |

---

## STEP 5-6 — クレジットカード

| # | 画面名 | URL |
|---|---|---|
| 29 | クレジットカード入力 | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=5` |
| 30 | クレジットカード確認 | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=6` |

---

## STEP 7 — 完了系

| # | 画面名 | URL |
|---|---|---|
| 31 | 申込完了 | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=7` |
| 32 | 処理中 | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=7&doneVariant=processing` |
| 33 | エラー | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=7&doneVariant=error` |
| 34 | メンテナンス | `https://neutral-base-escpn8c8q-tuchida-milize-projects.vercel.app/theo-tdf-view?s=7&doneVariant=maint` |

---

## paper.design インポート手順

1. paper.design を開く → 新規プロジェクト作成
2. 「Import from URL」または「Add screen from URL」を選択
3. 上記 URL を1つずつ入力してインポート
4. 画面名は `#番号 画面名` でリネーム推奨

> **備考**: 各URLは Vercel の最新デプロイ (`neutral-base-escpn8c8q-...`) を指しています。
> 再デプロイ後にURLが変わる場合は、最新のデプロイURLに置き換えてください。
