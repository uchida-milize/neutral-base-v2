import type { Metadata } from "next";

import { TheoTdfClaudeDesignShell } from "@/components/theo-tdf/claude-design/app-shell";

export const metadata: Metadata = {
  title: "プロトタイプ | THEO × T&Dファイナンシャル",
  description:
    "THEO「つみたて安心ほけん」申込フロー 10 画面 (イントロ → プラン選択 → 補償内容 → メール送信 → 申込フォーム → 内容確認 → お支払い登録 → カード入力 → カード確認 → 完了) を iPhone フレーム内でタップ操作できるクリッカブルプロトタイプ。Claude Design 出力 (2026-06-03) を本格 TSX 実装に取り込んだもの。",
};

/**
 * /theo-tdf/prototype
 *
 * Claude Design (claude.ai/design) で生成された申込フロー 10 画面の
 * クリッカブルプロトタイプ。左サイドの Rail で任意ジャンプ、画面下部の
 * 前 / 次ボタンで step 移動ができる。
 *
 * 実装は app-shell.tsx + screens.tsx の 2 ファイルに分離されており、
 * 各画面の中身を編集したい場合は screens.tsx を、流れや shell の見た目を
 * 編集したい場合は app-shell.tsx を触る。
 */
export default function TheoTdfPrototypePage() {
  return <TheoTdfClaudeDesignShell />;
}
