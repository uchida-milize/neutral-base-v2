"use client";

import * as React from "react";

import {
  ScreenOverview,
  ScreenCombined,
  ScreenStep2,
  ScreenPin,
  ScreenForm,
  ScreenStep4,
  ScreenCardInput,
  ScreenCardConfirm,
  ScreenDone,
} from "@/components/theo-tdf/claude-design/screens";

/**
 * /theo-tdf/windows
 *
 * 各画面を 390px 幅で表示。画面ごとにグループ化し、
 * デフォルト状態 + 状態バリアントをまとめて並べる。
 * 実際にタップして動かしたい場合は /theo-tdf/prototype を参照。
 */

type ScreenDef = {
  key: string;
  /** 状態バリアント名 (「デフォルト」「重要事項ボトムシート」等) */
  label: string;
  el: React.ReactNode;
  /** ボトムシート等 absolute 配置の状態バリアントは 820px 固定高さで描画 */
  height?: number;
  /** ハーフモーダル/ボトムシートをステッパー直下から全文表示する（.theo-sheet-full） */
  fullSheet?: boolean;
};

type ScreenGroupDef = {
  key: string;
  /** 画面名 */
  title: string;
  /** "STEP 1" / "PIN認証" / "外部サイト" 等 */
  badge?: string;
  screens: ScreenDef[];
};

/* ---- 単一の静的スクリーン ---- */
function StaticScreen({
  label,
  height,
  fullSheet,
  children,
}: {
  label: string;
  height?: number;
  fullSheet?: boolean;
  children: React.ReactNode;
}) {
  return (
    <figure className="flex flex-col items-start gap-2" style={{ width: 390 }}>
      <figcaption>
        <p className="text-h6 font-semibold text-foreground">{label}</p>
      </figcaption>
      <div
        className={`theo-tdf-cd font-jp relative rounded-2xl border border-warm-200 bg-warm-50 overflow-hidden shadow-sm transition-colors duration-300${fullSheet ? " theo-sheet-full" : ""}`}
        style={{ width: 390, height }}
      >
        <div
          className="flex flex-col"
          style={height ? { height: "100%" } : { minHeight: 600 }}
        >
          {children}
        </div>
      </div>
    </figure>
  );
}

/* ---- 画面グループ (見出し + スクリーン一覧) ---- */
function ScreenGroupSection({ group }: { group: ScreenGroupDef }) {
  return (
    <section className="flex flex-col gap-6 flex-none">
      <div className="flex flex-wrap items-center gap-3 pb-3 border-b-2 border-warm-300">
        {group.badge && (
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase rounded-full bg-primary-10 text-primary-600 px-3 py-1 shrink-0">
            {group.badge}
          </span>
        )}
        <h2 className="text-h3 font-semibold">{group.title}</h2>
        <span className="text-caption text-muted-foreground">
          {group.screens.length} パターン
        </span>
      </div>
      <div className="flex items-start gap-6">
        {group.screens.map((s) => (
          <StaticScreen key={s.key} label={s.label} height={s.height} fullSheet={s.fullSheet}>
            {s.el}
          </StaticScreen>
        ))}
      </div>
    </section>
  );
}

export default function TheoTdfWindowsPage() {
  const noop = () => {};

  const GROUPS: ScreenGroupDef[] = [
    /* ---- 01 商品概要 ---- */
    {
      key: "overview",
      title: "商品概要",
      badge: "STEP 1",
      screens: [
        {
          key: "overview",
          label: "デフォルト（パターンA）",
          el: <ScreenOverview go={noop} />,
        },
        {
          key: "combined",
          label: "パターンB（商品概要＋プラン選択統合）",
          el: (
            <ScreenCombined
              go={noop} sel="cancer" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
            />
          ),
        },
        {
          key: "combined-cta",
          label: "パターンB / ページ下部CTA（未同意）",
          el: (
            <ScreenCombined
              go={noop} sel="cancer" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
              initialShowSend
            />
          ),
        },
        {
          key: "combined-agreed",
          label: "パターンB / 同意チェック済・CTA活性",
          el: (
            <ScreenCombined
              go={noop} sel="cancer" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
              initialShowSend initialAgree
            />
          ),
        },
      ],
    },

    /* ---- 02 プラン選択 ---- */
    {
      key: "step2",
      title: "プラン選択",
      badge: "STEP 2",
      screens: [
        {
          key: "step2",
          label: "デフォルト",
          el: (
            <ScreenStep2
              go={noop} sel="cancer" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
            />
          ),
        },
        {
          key: "st-notice",
          label: "重要事項ボトムシート（全文表示）",
          // ステッパー直下(140px)からシート全文を表示。カード高さ＝140+内容＋余白。
          height: 1000,
          fullSheet: true,
          el: (
            <ScreenStep2
              go={noop} sel="cancer" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
              initialNoticeOpen
            />
          ),
        },
        {
          key: "st-sim",
          label: "給付予想額アコーディオン展開",
          el: (
            <ScreenStep2
              go={noop} sel="cancer" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
              initialSimOpen
            />
          ),
        },
        {
          key: "st-step2-cta",
          label: "ページ下部CTA（未同意・送信ボタン非活性）",
          el: (
            <ScreenStep2
              go={noop} sel="cancer" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
              initialShowSend
            />
          ),
        },
        {
          key: "st-step2-agreed",
          label: "同意チェック済・CTA活性",
          el: (
            <ScreenStep2
              go={noop} sel="cancer" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
              initialShowSend initialAgree
            />
          ),
        },
        {
          key: "st-step2-verified",
          label: "メール認証済み・申込フォームへ進む",
          el: (
            <ScreenStep2
              go={noop} sel="cancer" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
              initialShowSend initialAgree emailVerified
            />
          ),
        },
        {
          key: "st-step2-tooltip",
          label: "プランツールチップ1つ展開（がん保障型）",
          el: (
            <ScreenStep2
              go={noop} sel="cancer" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
              initialTipIdx={0}
            />
          ),
        },
        {
          key: "st-step2-simfirst",
          label: "積立金額・保障期間をプランより先に",
          el: (
            <ScreenStep2
              go={noop} sel="cancer" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
              simFirst
            />
          ),
        },
        {
          // 積立額×12×保障期間 = 150,000×12×25 = 4,500万 > 4,000万 → 保障金額上限エラー
          key: "st-step2-err-amount",
          label: "シミュレーション上限エラー（保障金額）",
          el: (
            <ScreenStep2
              go={noop} sel="cancer" setSel={noop}
              m={150000} setM={noop} y={25} setY={noop}
              initialSimOpen
            />
          ),
        },
        {
          // 加入年齢(1944生まれ≒82歳)＋保障期間15年 = 97 > 90 → 保障満了上限エラー
          key: "st-step2-err-maturity",
          label: "シミュレーション上限エラー（保障満了）",
          el: (
            <ScreenStep2
              go={noop} sel="cancer" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
              initialBirth="1944-01-01" initialSimOpen
            />
          ),
        },
      ],
    },

    /* ---- 03 PINコード認証 ---- */
    {
      key: "pin",
      title: "PINコード認証",
      badge: "PIN認証",
      screens: [
        {
          key: "pin",
          label: "デフォルト（未入力・認証ボタン非活性）",
          el: <ScreenPin go={noop} />,
        },
        {
          key: "pin-filled",
          label: "「666666」入力済・認証ボタン活性",
          el: <ScreenPin go={noop} initialPin="666666" />,
        },
      ],
    },

    /* ---- 04 申込フォーム ---- */
    {
      key: "form",
      title: "申込フォーム",
      badge: "STEP 3",
      screens: [
        {
          // 告知モーダルは ScreenForm マウント時に既定表示される（initialDisclosureOpen 省略時）
          key: "form-disclosure",
          label: "モーダルあり：告知（全文表示）",
          // ステッパー直下(140px)から告知モーダル全文を表示。height:auto のシート全高＋上部140に合わせる。
          height: 2700,
          fullSheet: true,
          el: (
            <ScreenForm
              go={noop} sel="cancer"
              m={10000} setM={noop} y={15} setY={noop}
            />
          ),
        },
        {
          key: "form",
          label: "モーダル無し：デフォルト",
          el: (
            <ScreenForm
              go={noop} sel="cancer"
              m={10000} setM={noop} y={15} setY={noop}
              initialDisclosureOpen={false}
            />
          ),
        },
        {
          key: "form-split",
          label: "モーダル無し：2ページ分割（契約者ページ）",
          el: (
            <ScreenForm
              go={noop} sel="cancer"
              m={10000} setM={noop} y={15} setY={noop}
              formSplit initialDisclosureOpen={false}
            />
          ),
        },
        {
          key: "form-split-2",
          label: "モーダル無し：2ページ分割（保険金受取人ページ）",
          el: (
            <ScreenForm
              go={noop} sel="cancer"
              m={10000} setM={noop} y={15} setY={noop}
              formSplit initialFormPage={2} initialDisclosureOpen={false}
            />
          ),
        },
        {
          // initialSame={false} で「住所は契約者と同じ」を未チェック → 受取人住所の個別入力欄が出る
          key: "form-recipient-addr",
          label: "モーダル無し：受取人住所を個別入力（「契約者と同じ」未チェック）",
          el: (
            <ScreenForm
              go={noop} sel="cancer"
              m={10000} setM={noop} y={15} setY={noop}
              formSplit initialFormPage={2} initialSame={false} initialDisclosureOpen={false}
            />
          ),
        },
        {
          key: "st-edit",
          label: "モーダルあり：積立修正シート＋給付予想額展開",
          height: 820,
          el: (
            <ScreenForm
              go={noop} sel="cancer"
              m={10000} setM={noop} y={15} setY={noop}
              initialEditOpen initialSheetRes initialDisclosureOpen={false}
            />
          ),
        },
      ],
    },

    /* ---- 05 内容確認・お支払い ---- */
    {
      key: "step4",
      title: "内容確認・お支払い",
      badge: "STEP 4",
      screens: [
        {
          key: "step4",
          label: "デフォルト",
          el: <ScreenStep4 go={noop} sel="cancer" m={10000} y={15} />,
        },
        {
          key: "st-acct",
          label: "お支払い詳細展開",
          el: <ScreenStep4 go={noop} sel="cancer" m={10000} y={15} initialAcctOpen />,
        },
        {
          key: "st-agree",
          label: "同意項目①展開＋全チェック・CTA活性",
          el: (
            <ScreenStep4
              go={noop} sel="cancer" m={10000} y={15}
              initialOpenIdx={0}
              initialChecks={[true, true, true, true, true]}
            />
          ),
        },
        {
          key: "st-edit-both",
          label: "契約者情報＋保険金受取人 両方編集展開",
          el: (
            <ScreenStep4
              go={noop} sel="cancer" m={10000} y={15}
              initialEditKiyaku initialEditJuushin
            />
          ),
        },
        {
          // 被保険者の確認は AGREE_ITEMS の index 4。initialNat="other" で「日本国籍以外」選択を表示
          key: "st-insured-other",
          label: "被保険者の確認（日本国籍以外を選択）を開いた状態",
          el: (
            <ScreenStep4
              go={noop} sel="cancer" m={10000} y={15}
              initialOpenIdx={4} initialNat="other"
            />
          ),
        },
      ],
    },

    /* ---- 06 クレジットカード承認（外部） ---- */
    {
      key: "card",
      title: "クレジットカード承認",
      badge: "外部サイト",
      screens: [
        {
          key: "card",
          label: "カード情報入力",
          el: <ScreenCardInput go={noop} />,
        },
        {
          key: "cardconf",
          label: "カード情報確認",
          el: <ScreenCardConfirm go={noop} />,
        },
      ],
    },

    /* ---- 07 完了 ---- */
    {
      key: "done",
      title: "完了",
      badge: "STEP 5",
      screens: [
        {
          key: "done",
          label: "デフォルト",
          el: <ScreenDone go={noop} />,
        },
      ],
    },
  ];

  return (
    <main className="mx-auto max-w-[1700px] px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      {/* ページヘッダー */}
      <div className="mx-auto mb-14 max-w-5xl">
        <header className="max-w-3xl">
          <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
            Screens
          </p>
          <h1 className="mt-2 text-display-3 font-semibold tracking-tight sm:text-display-2">
            スクリーン
          </h1>
          <p className="mt-3 text-body text-muted-foreground sm:text-body-lg">
            各画面は <strong className="text-foreground">390px 幅</strong>・高さは内容に応じて可変。
            画面ごとにデフォルト状態＋バリアントをグループで表示しています。実際にタップして動かしたい場合は{" "}
            <a
              href="/theo-tdf/prototype"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              プロトタイプ
            </a>
            {" "}を参照してください。
          </p>
        </header>
      </div>

      {/* 画面グループ一覧 — グループ自体も flex-wrap で横並び可 */}
      <div className="flex flex-wrap items-start gap-x-8 gap-y-14">
        {GROUPS.map((g) => (
          <ScreenGroupSection key={g.key} group={g} />
        ))}
      </div>
    </main>
  );
}
