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
  ScreenStatus,
  ScreenEnded,
} from "@/components/theo-tdf/claude-design/screens";

/* ---- 型定義 ---- */

export type ScreenDef = {
  key: string;
  /** 状態バリアント名 (「デフォルト」「重要事項ボトムシート」等) */
  label: string;
  el: React.ReactNode;
  /** @deprecated 固定高さ廃止 */
  height?: number;
  /** absolute 配置のモーダル等を完全表示するため overflow-visible にする */
  fullSheet?: boolean;
  /** このパターン専用の /theo-tdf-view URL（省略時はリンクなし） */
  viewUrl?: string;
};

export type ScreenGroupDef = {
  key: string;
  /** 画面名 */
  title: string;
  /** "STEP 1" / "PIN認証" / "外部サイト" 等 */
  badge?: string;
  screens: ScreenDef[];
  /** /theo-tdf-view?s=N で開くベアビューの画面番号 */
  viewS?: number;
};

/* ---- アイコン ---- */

export const LINK_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 shrink-0">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

/* ---- 単一の静的スクリーン ---- */

export function StaticScreen({
  label,
  fullSheet,
  viewUrl,
  children,
}: {
  label: string;
  height?: number;
  fullSheet?: boolean;
  viewUrl?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="flex flex-col items-start gap-2" style={{ width: 390 }}>
      <figcaption className="flex items-center gap-2">
        <p className="text-h6 font-semibold text-foreground">{label}</p>
        {viewUrl && (
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-warm-300 bg-white px-2 py-0.5 text-[10px] font-medium text-neutral-400 shadow-sm hover:border-primary hover:text-primary transition-colors shrink-0"
          >
            HTML {LINK_ICON}
          </a>
        )}
      </figcaption>
      {/* screen-flat: overflow-y-auto → visible / flex-1 → none / sticky → static */}
      <div
        className={`theo-tdf-cd font-jp screen-flat relative rounded-2xl border border-warm-200 bg-warm-50 shadow-sm${fullSheet ? " overflow-visible" : " overflow-hidden"}`}
        style={{ width: 390, minHeight: 693 }}
      >
        <div className="flex flex-col">
          {children}
        </div>
      </div>
    </figure>
  );
}

/* ---- 画面グループ (見出し + スクリーン一覧) ---- */

export function ScreenGroupSection({ group }: { group: ScreenGroupDef }) {
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
          <StaticScreen key={s.key} label={s.label} fullSheet={s.fullSheet} viewUrl={s.viewUrl}>
            {s.el}
          </StaticScreen>
        ))}
      </div>
    </section>
  );
}

/* ---- グループデータファクトリ ---- */

export function makeGroups(noop: () => void): ScreenGroupDef[] {
  return [
    /* ---- 01 商品概要 ---- */
    {
      key: "overview",
      title: "商品概要",
      badge: "STEP 1",
      screens: [
        {
          key: "overview",
          label: "デフォルト（パターンA）",
          viewUrl: "/theo-tdf-view?s=0",
          el: <ScreenOverview go={noop} />,
        },
        {
          key: "overview-heigai",
          label: "弊害防止措置等の対応について（モーダル全文表示）",
          fullSheet: true,
          viewUrl: "/theo-tdf-view?s=0",
          el: <ScreenOverview go={noop} initialHeigaiOpen />,
        },
        {
          key: "combined",
          label: "パターンB（商品概要＋プラン選択統合）",
          viewUrl: "/theo-tdf-view?s=0&patternB=1",
          el: (
            <ScreenCombined
              go={noop} sel="cancer_d" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
            />
          ),
        },
        {
          key: "combined-cta",
          label: "パターンB / ページ下部CTA（未同意）",
          viewUrl: "/theo-tdf-view?s=0&patternB=1",
          el: (
            <ScreenCombined
              go={noop} sel="cancer_d" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
              initialShowSend
            />
          ),
        },
        {
          key: "combined-agreed",
          label: "パターンB / 同意チェック済・CTA活性",
          viewUrl: "/theo-tdf-view?s=0&patternB=1",
          el: (
            <ScreenCombined
              go={noop} sel="cancer_d" setSel={noop}
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
          viewUrl: "/theo-tdf-view?s=1",
          el: (
            <ScreenStep2
              go={noop} sel="cancer_d" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
            />
          ),
        },
        {
          key: "st-notice",
          label: "重要事項ボトムシート（全文表示）",
          fullSheet: true,
          viewUrl: "/theo-tdf-view?s=1",
          el: (
            <ScreenStep2
              go={noop} sel="cancer_d" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
              initialNoticeOpen
            />
          ),
        },
        {
          key: "st-sim",
          label: "給付予想額アコーディオン展開",
          viewUrl: "/theo-tdf-view?s=1",
          el: (
            <ScreenStep2
              go={noop} sel="cancer_d" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
              initialSimOpen
            />
          ),
        },
        {
          key: "st-step2-cta",
          label: "ページ下部CTA（未同意・送信ボタン非活性）",
          viewUrl: "/theo-tdf-view?s=1",
          el: (
            <ScreenStep2
              go={noop} sel="cancer_d" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
              initialShowSend
            />
          ),
        },
        {
          key: "st-step2-agreed",
          label: "同意チェック済・CTA活性",
          viewUrl: "/theo-tdf-view?s=1",
          el: (
            <ScreenStep2
              go={noop} sel="cancer_d" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
              initialShowSend initialAgree
            />
          ),
        },
        {
          key: "st-step2-verified",
          label: "メール認証済み・申込フォームへ進む",
          viewUrl: "/theo-tdf-view?s=1",
          el: (
            <ScreenStep2
              go={noop} sel="cancer_d" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
              initialShowSend initialAgree emailVerified
            />
          ),
        },
        {
          key: "st-step2-tooltip",
          label: "プランツールチップ1つ展開（がん保障型）",
          viewUrl: "/theo-tdf-view?s=1",
          el: (
            <ScreenStep2
              go={noop} sel="cancer_d" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
              initialTipIdx={0}
            />
          ),
        },
        {
          key: "st-step2-simfirst",
          label: "積立金額・保障期間をプランより先に",
          viewUrl: "/theo-tdf-view?s=1&simFirst=1",
          el: (
            <ScreenStep2
              go={noop} sel="cancer_d" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
              simFirst
            />
          ),
        },
        {
          key: "st-step2-err-amount",
          label: "シミュレーション上限エラー（保障金額）",
          viewUrl: "/theo-tdf-view?s=1",
          el: (
            <ScreenStep2
              go={noop} sel="cancer_d" setSel={noop}
              m={150000} setM={noop} y={25} setY={noop}
              initialSimOpen
            />
          ),
        },
        {
          key: "st-step2-err-maturity",
          label: "シミュレーション上限エラー（保障満了）",
          viewUrl: "/theo-tdf-view?s=1",
          el: (
            <ScreenStep2
              go={noop} sel="cancer_d" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
              initialBirth="1944-01-01" initialSimOpen
            />
          ),
        },
        {
          key: "st-step2-accordion",
          label: "アコーディオン表示（がんプラン＋死亡保障 展開）",
          viewUrl: "/theo-tdf-view?s=1&planCardStyle=accordion&planOpenId=cancer_d",
          el: (
            <ScreenStep2
              go={noop} sel="cancer_d" setSel={noop}
              m={10000} setM={noop} y={15} setY={noop}
              planCardStyle="accordion" initialPlanOpenId="cancer_d"
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
      viewS: 2,
      screens: [
        {
          key: "pin",
          label: "デフォルト（未入力・認証ボタン非活性）",
          viewUrl: "/theo-tdf-view?s=2",
          el: <ScreenPin go={noop} />,
        },
        {
          key: "pin-filled",
          label: "「666666」入力済・認証ボタン活性",
          viewUrl: "/theo-tdf-view?s=2",
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
          key: "form-disclosure",
          label: "モーダルあり：告知（全文表示）",
          fullSheet: true,
          viewUrl: "/theo-tdf-view?s=3&disclosure=1",
          el: (
            <ScreenForm
              go={noop} sel="cancer_d"
              m={10000} setM={noop} y={15} setY={noop}
              initialDisclosureOpen={true}
            />
          ),
        },
        {
          key: "form",
          label: "モーダル無し：デフォルト",
          viewUrl: "/theo-tdf-view?s=3",
          el: (
            <ScreenForm
              go={noop} sel="cancer_d"
              m={10000} setM={noop} y={15} setY={noop}
              initialDisclosureOpen={false}
            />
          ),
        },
        {
          key: "form-recipient-addr",
          label: "モーダル無し：受取人住所を個別入力（「契約者と同じ」未チェック）",
          viewUrl: "/theo-tdf-view?s=3",
          el: (
            <ScreenForm
              go={noop} sel="cancer_d"
              m={10000} setM={noop} y={15} setY={noop}
              initialSame={false} initialDisclosureOpen={false}
            />
          ),
        },
        {
          key: "st-edit",
          label: "モーダルあり：積立修正シート＋給付予想額展開",
          viewUrl: "/theo-tdf-view?s=3",
          el: (
            <ScreenForm
              go={noop} sel="cancer_d"
              m={10000} setM={noop} y={15} setY={noop}
              initialEditOpen initialSheetRes initialDisclosureOpen={false}
            />
          ),
        },
        {
          key: "form-err-inline",
          label: "エラー表示①：各入力の下に赤字（errMode=inline）",
          viewUrl: "/theo-tdf-view?s=3&errMode=inline",
          el: (
            <ScreenForm
              go={noop} sel="cancer_d"
              m={10000} setM={noop} y={15} setY={noop}
              errMode="inline" initialDisclosureOpen={false}
            />
          ),
        },
        {
          key: "form-err-top",
          label: "エラー表示②：上部にまとめて（errMode=top）",
          viewUrl: "/theo-tdf-view?s=3&errMode=top",
          el: (
            <ScreenForm
              go={noop} sel="cancer_d"
              m={10000} setM={noop} y={15} setY={noop}
              errMode="top" initialDisclosureOpen={false}
            />
          ),
        },
        {
          key: "form-err-float-1",
          label: "エラー表示③-a：フローティング「1/4 次の項目へ」（initialErrStep=0）",
          viewUrl: "/theo-tdf-view?s=3&errMode=float&errStep=0",
          el: (
            <ScreenForm
              go={noop} sel="cancer_d"
              m={10000} setM={noop} y={15} setY={noop}
              errMode="float" initialDisclosureOpen={false} initialErrStep={0}
            />
          ),
        },
        {
          key: "form-err-float-2",
          label: "エラー表示③-b：フローティング「2/4 次の項目へ」（initialErrStep=1）",
          viewUrl: "/theo-tdf-view?s=3&errMode=float&errStep=1",
          el: (
            <ScreenForm
              go={noop} sel="cancer_d"
              m={10000} setM={noop} y={15} setY={noop}
              errMode="float" initialDisclosureOpen={false} initialErrStep={1}
            />
          ),
        },
        {
          key: "form-err-float-4",
          label: "エラー表示③-c：フローティング「4/4 次の項目へ」（initialErrStep=3）",
          viewUrl: "/theo-tdf-view?s=3&errMode=float&errStep=3",
          el: (
            <ScreenForm
              go={noop} sel="cancer_d"
              m={10000} setM={noop} y={15} setY={noop}
              errMode="float" initialDisclosureOpen={false} initialErrStep={3}
            />
          ),
        },
      ],
    },

    /* ---- 04b 申込フォーム — 告知10パターン ---- */
    {
      key: "form-kokuchi",
      title: "申込フォーム — 告知10パターン",
      badge: "STEP 3 告知",
      viewS: 3,
      screens: [
        {
          key: "kokuchi-care_d",
          label: "① 障害・介護プラン（死亡あり）",
          fullSheet: true,
          viewUrl: "/theo-tdf-view?s=3&disclosure=1&kokuchiPattern=care_d",
          el: (
            <ScreenForm
              go={noop} sel="care" deathOpt={true}
              m={10000} setM={noop} y={15} setY={noop}
              initialDisclosureOpen={true} kokuchiPattern="care_d"
            />
          ),
        },
        {
          key: "kokuchi-care_n",
          label: "② 障害・介護プラン（死亡なし）",
          fullSheet: true,
          viewUrl: "/theo-tdf-view?s=3&disclosure=1&kokuchiPattern=care_n",
          el: (
            <ScreenForm
              go={noop} sel="care" deathOpt={false}
              m={10000} setM={noop} y={15} setY={noop}
              initialDisclosureOpen={true} kokuchiPattern="care_n"
            />
          ),
        },
        {
          key: "kokuchi-cancer_d",
          label: "③ がんプラン（死亡あり）",
          fullSheet: true,
          viewUrl: "/theo-tdf-view?s=3&disclosure=1&kokuchiPattern=cancer_d",
          el: (
            <ScreenForm
              go={noop} sel="cancer_d" deathOpt={true}
              m={10000} setM={noop} y={15} setY={noop}
              initialDisclosureOpen={true} kokuchiPattern="cancer_d"
            />
          ),
        },
        {
          key: "kokuchi-cancer_n",
          label: "④ がんプラン（死亡なし）",
          fullSheet: true,
          viewUrl: "/theo-tdf-view?s=3&disclosure=1&kokuchiPattern=cancer_n",
          el: (
            <ScreenForm
              go={noop} sel="cancer_d" deathOpt={false}
              m={10000} setM={noop} y={15} setY={noop}
              initialDisclosureOpen={true} kokuchiPattern="cancer_n"
            />
          ),
        },
        {
          key: "kokuchi-cc_d",
          label: "⑤ がん・障害介護プラン（死亡あり）",
          fullSheet: true,
          viewUrl: "/theo-tdf-view?s=3&disclosure=1&kokuchiPattern=cc_d",
          el: (
            <ScreenForm
              go={noop} sel="cancer_care" deathOpt={true}
              m={10000} setM={noop} y={15} setY={noop}
              initialDisclosureOpen={true} kokuchiPattern="cc_d"
            />
          ),
        },
        {
          key: "kokuchi-cc_n",
          label: "⑥ がん・障害介護プラン（死亡なし）",
          fullSheet: true,
          viewUrl: "/theo-tdf-view?s=3&disclosure=1&kokuchiPattern=cc_n",
          el: (
            <ScreenForm
              go={noop} sel="cancer_care" deathOpt={false}
              m={10000} setM={noop} y={15} setY={noop}
              initialDisclosureOpen={true} kokuchiPattern="cc_n"
            />
          ),
        },
        {
          key: "kokuchi-three_d",
          label: "⑦ 三大疾病プラン（死亡あり）",
          fullSheet: true,
          viewUrl: "/theo-tdf-view?s=3&disclosure=1&kokuchiPattern=three_d",
          el: (
            <ScreenForm
              go={noop} sel="three" deathOpt={true}
              m={10000} setM={noop} y={15} setY={noop}
              initialDisclosureOpen={true} kokuchiPattern="three_d"
            />
          ),
        },
        {
          key: "kokuchi-three_n",
          label: "⑧ 三大疾病プラン（死亡なし）",
          fullSheet: true,
          viewUrl: "/theo-tdf-view?s=3&disclosure=1&kokuchiPattern=three_n",
          el: (
            <ScreenForm
              go={noop} sel="three" deathOpt={false}
              m={10000} setM={noop} y={15} setY={noop}
              initialDisclosureOpen={true} kokuchiPattern="three_n"
            />
          ),
        },
        {
          key: "kokuchi-tc_d",
          label: "⑨ 三大疾病・障害介護プラン（死亡あり）",
          fullSheet: true,
          viewUrl: "/theo-tdf-view?s=3&disclosure=1&kokuchiPattern=tc_d",
          el: (
            <ScreenForm
              go={noop} sel="three_care" deathOpt={true}
              m={10000} setM={noop} y={15} setY={noop}
              initialDisclosureOpen={true} kokuchiPattern="tc_d"
            />
          ),
        },
        {
          key: "kokuchi-tc_n",
          label: "⑩ 三大疾病・障害介護プラン（死亡なし）",
          fullSheet: true,
          viewUrl: "/theo-tdf-view?s=3&disclosure=1&kokuchiPattern=tc_n",
          el: (
            <ScreenForm
              go={noop} sel="three_care" deathOpt={false}
              m={10000} setM={noop} y={15} setY={noop}
              initialDisclosureOpen={true} kokuchiPattern="tc_n"
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
          viewUrl: "/theo-tdf-view?s=4",
          el: <ScreenStep4 go={noop} sel="cancer_d" m={10000} y={15} />,
        },
        {
          key: "st-acct",
          label: "お支払い詳細展開",
          viewUrl: "/theo-tdf-view?s=4",
          el: <ScreenStep4 go={noop} sel="cancer_d" m={10000} y={15} initialAcctOpen />,
        },
        {
          key: "st-agree",
          label: "同意項目①展開＋全チェック・CTA活性",
          viewUrl: "/theo-tdf-view?s=4",
          el: (
            <ScreenStep4
              go={noop} sel="cancer_d" m={10000} y={15}
              initialOpenIdx={0}
              initialChecks={[true, true, true, true, true]}
            />
          ),
        },
        {
          key: "st-edit-both",
          label: "契約者情報＋保険金受取人 両方編集展開",
          viewUrl: "/theo-tdf-view?s=4&editKiyaku=1&editJuushin=1",
          el: (
            <ScreenStep4
              go={noop} sel="cancer_d" m={10000} y={15}
              initialEditKiyaku initialEditJuushin
            />
          ),
        },
        {
          key: "st-insured-other",
          label: "被保険者の確認（日本国籍以外を選択）を開いた状態",
          viewUrl: "/theo-tdf-view?s=4",
          el: (
            <ScreenStep4
              go={noop} sel="cancer_d" m={10000} y={15}
              initialOpenIdx={4}
            />
          ),
        },
        {
          key: "st-step4-diffaddr",
          label: "保険金受取人の住所：別住所を入力（benSameAddr=false）",
          viewUrl: "/theo-tdf-view?s=4&benSameAddr=0",
          el: (
            <ScreenStep4
              go={noop} sel="cancer_d" m={10000} y={15}
              benSameAddr={false}
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
          viewUrl: "/theo-tdf-view?s=5",
          el: <ScreenCardInput go={noop} />,
        },
        {
          key: "cardconf",
          label: "カード情報確認",
          viewUrl: "/theo-tdf-view?s=6",
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
          label: "完了",
          viewUrl: "/theo-tdf-view?s=7",
          el: <ScreenDone go={noop} />,
        },
        {
          key: "done-processing",
          label: "処理中",
          viewUrl: "/theo-tdf-view?s=7&doneVariant=processing",
          el: <ScreenStatus variant="processing" go={noop} />,
        },
        {
          key: "done-error",
          label: "処理エラー",
          viewUrl: "/theo-tdf-view?s=7&doneVariant=error",
          el: <ScreenStatus variant="error" go={noop} />,
        },
        {
          key: "done-maint",
          label: "メンテナンス中",
          viewUrl: "/theo-tdf-view?s=7&doneVariant=maint",
          el: <ScreenStatus variant="maint" go={noop} />,
        },
      ],
    },

    /* ---- 08 申込キャンセル終了 ---- */
    {
      key: "ended",
      title: "申込キャンセル終了",
      badge: "終了",
      screens: [
        {
          key: "ended",
          label: "デフォルト（「告知に同意しない」でキャンセル後）",
          height: 812,
          el: <ScreenEnded onRestart={noop} />,
        },
      ],
    },
  ];
}
