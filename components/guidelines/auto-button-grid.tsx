import * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * AutoButtonGrid — 5 種類のボタンを意味で使い分けるサンプル。
 *
 * すべての色を `bg-[color:var(--xxx-color-NNN)]` 形式で CSS 変数経由にし、
 * 各テナント (.xxx-scope / .td-financial-scope / .theo-tdf-scope) で
 * 自動的にテナント色が反映される。
 *
 * 役割マップ:
 *   - cta         : 申込/前進 (Red 系)  — 1 画面 1 つ
 *   - primary     : 通常確定 filled    — button-color スケール
 *   - primary-outline : サブ primary 罫線版 (テナントが指定したい場合のオプション扱い)
 *   - neutral     : キャンセル / 戻る  — グレースケール固定
 *   - outline     : サブ操作 (CSV 出力等) — グレー罫線固定
 *   - destructive : 削除 (small サイズ) — cta と同色だが意味が違う
 *
 * 5 「種類」枠は伝統的に cta / primary / neutral / outline / destructive を採用。
 * primary-outline は primary の派生バリアントとして同カードに併記する。
 */

export function AutoButtonGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <ButtonShowcase
        name="cta"
        desc="申込/前進 (positive forward action)。1 画面に 1 つまで。"
        token="--cta-color-500"
        example={
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-[10px] bg-cta-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_var(--cta-color-500)] hover:bg-cta-600"
          >
            申込を確定する
          </button>
        }
      />
      <ButtonShowcase
        name="primary"
        desc="通常の確定 (保存・変更を反映)。エンタープライズの基本ボタン。"
        token="--button-color-500"
        example={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-[10px] bg-button-500 px-4 py-2 text-sm font-semibold text-white hover:bg-button-600"
            >
              変更を保存
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-[10px] border border-button-500 bg-white px-4 py-2 text-sm font-semibold text-button-500 hover:bg-button-10"
            >
              下書き保存
            </button>
          </div>
        }
      />
      <ButtonShowcase
        name="neutral"
        desc="キャンセル / 戻る。primary と並べて主従を明示する。"
        token="grayscale (固定)"
        example={
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-[10px] bg-[#eef1f6] px-4 py-2 text-sm font-medium text-[#475569] hover:bg-[#e3e7ee]"
          >
            やめる
          </button>
        }
      />
      <ButtonShowcase
        name="outline"
        desc="サブ操作 (CSV 出力・エクスポート等)。複数並列可。"
        token="grayscale (固定)"
        example={
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-[10px] border border-[#c9d0dd] bg-white px-4 py-2 text-sm font-medium text-[#0f172a] hover:bg-[#f9fafc]"
          >
            CSV 出力
          </button>
        }
      />
      <ButtonShowcase
        name="destructive"
        desc="削除 (不可逆操作)。small サイズに限定。cta と同色だが意味が違う。"
        token="--cta-color-500 (small only)"
        example={
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-[10px] bg-cta-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cta-600"
          >
            アカウントを削除
          </button>
        }
      />
    </div>
  );
}

function ButtonShowcase({
  name,
  desc,
  example,
  token,
}: {
  name: string;
  desc: string;
  example: React.ReactNode;
  token: string;
}) {
  return (
    <Card className="transition-colors duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-h4 font-mono">{name}</CardTitle>
          <Badge variant="outline" className="font-mono text-tiny">
            {token}
          </Badge>
        </div>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent className="pb-5">{example}</CardContent>
    </Card>
  );
}
