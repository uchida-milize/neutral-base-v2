import type { Metadata } from "next";

import { TheoTdfClaudeDesignShell } from "@/components/theo-tdf/claude-design/app-shell";

export const metadata: Metadata = {
  title: "プロトタイプ | THEO × T&Dファイナンシャル",
  description:
    "THEO「つみたて安心ほけん」申込フロー 5 ステップ・8 画面 (商品概要 → プラン選択 → PINコード認証 → 申込フォーム → 内容確認・お支払い → カード入力/確認 [外部 GMO・ステップ外] → 完了) を iPhone フレーム内でタップ操作できるクリッカブルプロトタイプ。表示オプション (パターンB 統合 / フォーム2ページ分割) も切り替え可能。Claude Design 出力 (TD 組込1.4) を本格 TSX 実装に取り込んだもの。",
};

/**
 * /theo-tdf/prototype
 *
 * Claude Design (claude.ai/design) で生成された申込フロー 8 画面
 * (ステッパーは 5 ステップ、PIN認証・外部カード承認はステップ外) の
 * クリッカブルプロトタイプ。左サイドの Rail で任意ジャンプ、画面下部の
 * 前 / 次ボタンで画面移動、上部の「表示オプション」で
 * パターンB (商品概要+プラン選択統合) / フォーム2ページ分割を切り替えできる。
 *
 * 実装は app-shell.tsx + screens.tsx + tweaks-panel.tsx に分離されており、
 * 各画面の中身を編集したい場合は screens.tsx を、流れや shell の見た目を
 * 編集したい場合は app-shell.tsx を触る。
 */
export default function TheoTdfPrototypePage() {
  return <TheoTdfClaudeDesignShell />;
}
