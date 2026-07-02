# THEO TDF — Storybook Stories

`screens.tsx` の全コンポーネントをカバーするストーリー一覧。

## セットアップ（初回のみ）

```bash
cd /path/to/neutral-base

# Storybook をインストール（既存設定を上書きしない --skip-install オプション付き）
pnpm dlx storybook@latest init --skip-install

# または依存パッケージを手動追加
pnpm add -D \
  @storybook/nextjs \
  @storybook/react \
  @storybook/addon-essentials \
  @storybook/addon-onboarding \
  @chromatic-com/storybook \
  @storybook/experimental-addon-test \
  storybook
```

`package.json` の `scripts` に以下を追加：

```json
"storybook": "storybook dev -p 6006",
"build-storybook": "storybook build"
```

## 起動

```bash
pnpm storybook
```

## ファイル構成

| ファイル | コンポーネント |
|---------|--------------|
| `00-atoms.stories.tsx` | Badge |
| `01-btn.stories.tsx` | Btn |
| `02-field.stories.tsx` | Field / LockedField / Select |
| `03-layout.stories.tsx` | AppBar / Steps / GroupCard / ActionBar / StepSection |
| `04-plan-card.stories.tsx` | PlanCard / PlanCardAccordion / PlanList |
| `05-disclosure.stories.tsx` | KoTable / DisclosureQCard / DisclosureModal |
| `06-simulator.stories.tsx` | SimSliders / BenefitTable / Simulator / WheelCol / DateDrumSheet |
| `07-agree.stories.tsx` | AgreeBlocks / AgreeItem / NoticeContent / HeigaiModal |
| `10-screen-intro.stories.tsx` | ScreenIntro（商品概要） |
| `11-screen-overview.stories.tsx` | ScreenOverview（ヒーロー） |
| `12-screen-step2.stories.tsx` | ScreenStep2（プラン選択） |
| `13-screen-pin.stories.tsx` | ScreenPin（PIN認証） |
| `14-screen-form.stories.tsx` | ScreenForm（申込フォーム） |
| `15-screen-step4.stories.tsx` | ScreenStep4（内容確認） |
| `16-screen-card.stories.tsx` | ScreenCardInput / ScreenCardConfirm / ExtBar |
| `17-screen-done.stories.tsx` | ScreenStatus / ScreenDone / ScreenEnded |
| `18-screen-combined.stories.tsx` | ScreenCombined（パターンB統合） |

## Tailwind v4 対応メモ

Storybook の `@storybook/addon-styling-webpack` は Tailwind v4 未対応（2026-07 時点）。
`preview.tsx` で `globals.css` を直接インポートしているため、CSS Variables / カラートークンは
Next.js 本番と同一の状態でプレビューされます。
