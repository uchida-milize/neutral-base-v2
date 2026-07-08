import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";

/**
 * theo-tdf (TD 組込1.4) のグラデーション & 新中立面の仕様ショーケース。
 *
 * プロトタイプ (components/theo-tdf/claude-design/screens.tsx) で実際に使われている
 * インライン・グラデーション値と中立面をそのまま再掲する「生きた仕様」。
 * ガイドライン (Buttons セクション) と Components ページの両方から参照する。
 *
 * ※ 値は screens.tsx と一致させること:
 *   - ボタン (cta / button)     : linear-gradient(135deg, #1aa5dc 0%, #7fd0f0 100%)
 *   - ボタン (danger / 警告操作) : linear-gradient(135deg, #E83A3C 0%, #F66A6C 100%)
 *     ※ danger はクレジットカード登録開始・解約など「取り消し不可の注意操作」専用。申込確定 (cta) には使わない。
 *   - ヘッダー (status+appbar)  : linear-gradient(135deg, #1aa5dc 0%, #7fd0f0 100%)
 *   - ステップ番号バッジ         : linear-gradient(135deg, #1aa5dc 0%, #03CDFE 100%)
 *   - 中立面 (無効/プラン帯/補償ラベル): #EFEFEF
 */

const GRAD_BUTTON = "linear-gradient(135deg, #1aa5dc 0%, #7fd0f0 100%)";
const GRAD_DANGER = "linear-gradient(135deg, #E83A3C 0%, #F66A6C 100%)";
const GRAD_BADGE = "linear-gradient(135deg, #1aa5dc 0%, #03CDFE 100%)";

function Swatch({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden rounded-2xl border-warm-200 bg-white shadow-sm">
      <CardContent className="space-y-3 p-5">
        <div className="flex flex-col gap-0.5">
          <p className="text-h6 font-semibold text-neutral-800">{title}</p>
          <p className="text-caption text-muted-foreground">{hint}</p>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

export function BrandGradients() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* 1. ボタングラデーション */}
      <Swatch
        title="ボタン (グラデーション)"
        hint="通常 / 前進 / 申込確定は同じ Sky Blue。危険操作だけ danger の赤。"
      >
        <div className="space-y-2.5">
          <div
            className="flex h-12 w-full items-center justify-center rounded-xl text-h6 font-bold text-white"
            style={{ backgroundImage: GRAD_BUTTON }}
          >
            通常 / 前進 / 確定
          </div>
          <div
            className="flex h-12 w-full items-center justify-center rounded-xl text-h6 font-bold text-white"
            style={{ backgroundImage: GRAD_DANGER }}
          >
            警告操作 (danger)
          </div>
          <dl className="space-y-1 pt-1 text-tiny font-mono text-neutral-500">
            <div>
              <span className="text-neutral-400">cta / button</span> #1aa5dc → #7fd0f0
            </div>
            <div>
              <span className="text-neutral-400">danger</span> #E83A3C → #F66A6C
            </div>
          </dl>
        </div>
      </Swatch>

      {/* 2. ステップ番号バッジ / ヘッダー */}
      <Swatch
        title="ステップ番号バッジ / ヘッダー"
        hint="ステッパーの番号円とアプリヘッダーに青グラデを使用。"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className="grid size-8 place-items-center rounded-full font-en text-h6 font-bold text-white"
                style={{ backgroundImage: GRAD_BADGE }}
              >
                {n}
              </span>
            ))}
          </div>
        </div>
        <div
          className="mt-1 h-10 w-full rounded-lg"
          style={{ backgroundImage: GRAD_BUTTON }}
          aria-hidden
        />
        <dl className="space-y-1 pt-1 text-tiny font-mono text-neutral-500">
          <div>
            <span className="text-neutral-400">バッジ</span> #1aa5dc → #03CDFE
          </div>
          <div>
            <span className="text-neutral-400">ヘッダー</span> #1aa5dc → #7fd0f0
          </div>
        </dl>
      </Swatch>

      {/* 3. 新・中立面 #EFEFEF */}
      <Swatch
        title="中立面 #EFEFEF"
        hint="無効フィールド・プラン選択帯・補償ラベルの面。旧 warm-50/warm-200 から変更。"
      >
        <div className="space-y-2.5">
          <div className="flex h-11 items-center rounded-lg border border-warm-200 bg-[#EFEFEF] px-3 text-h6 text-neutral-400">
            変更不可フィールド
          </div>
          <div className="flex items-center justify-between rounded-lg bg-[#EFEFEF] px-3 py-2 text-caption text-neutral-600">
            <span>プラン選択帯</span>
            <span className="font-en font-semibold text-neutral-800">50,000 円</span>
          </div>
          <dl className="pt-1 text-tiny font-mono text-neutral-500">
            <div>
              <span className="text-neutral-400">surface</span> #EFEFEF
            </div>
          </dl>
        </div>
      </Swatch>
    </div>
  );
}
