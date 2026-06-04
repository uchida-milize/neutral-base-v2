import type { Metadata } from "next";

import { TheoTdfClaudeDesignShell } from "@/components/theo-tdf/claude-design/app-shell";

export const metadata: Metadata = {
  title: "プロトタイプ | THEO × T&Dファイナンシャル",
  description:
    "THEO「つみたて安心ほけん」申込フロー 4 ステップ・6 画面 (プラン選択 [イントロ〜メール送信統合] → 申込フォーム → 内容確認・お支払い登録 → カード入力/確認 [外部 GMO・ステップ外] → 完了) を iPhone フレーム内でタップ操作できるクリッカブルプロトタイプ。Claude Design 出力 (2026-06-04) を本格 TSX 実装に取り込んだもの。",
};

/**
 * /theo-tdf/prototype
 *
 * Claude Design (claude.ai/design) で生成された申込フロー 6 画面
 * (ステッパーは 4 ステップ、外部カード承認はステップ外) の
 * クリッカブルプロトタイプ。左サイドの Rail で任意ジャンプ、画面下部の
 * 前 / 次ボタンで画面移動ができる。
 *
 * 実装は app-shell.tsx + screens.tsx の 2 ファイルに分離されており、
 * 各画面の中身を編集したい場合は screens.tsx を、流れや shell の見た目を
 * 編集したい場合は app-shell.tsx を触る。
 */
export default function TheoTdfPrototypePage() {
  return <TheoTdfClaudeDesignShell />;
}
