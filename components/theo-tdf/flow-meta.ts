/**
 * THEO × T&Dファイナンシャル「つみたて安心ほけん」申込フロー 7 画面のメタ情報。
 *
 * 一次ソース: uploads/組込申込画面.xlsx Sheet1「汎用_画面案」の埋め込み画像
 *   抽出スクリプト: /init-brand-tokens xlsx ブランチ (Priority 2, 開発中)
 *   配置先: public/assets/theo-tdf/screens/
 *
 * flow-screens.tsx の FLOW は画像表示版 ScreenImg を返すため "use client" 必須。
 * 静的なラベル情報はここから読み出せば良い。
 */

export type FlowStepMeta = {
  id: string;
  label: string;
  /** public/assets/theo-tdf/screens/ 配下のファイル名 */
  image: string;
};

export const FLOW_META: FlowStepMeta[] = [
  { id: "lp",            label: "TOP / 商品紹介",       image: "01-lp.png" },
  { id: "customer-info", label: "お客さま情報入力",     image: "02-customer-info.png" },
  { id: "simulation",    label: "シミュレーション",     image: "03-simulation.png" },
  { id: "email",         label: "メールアドレス入力",   image: "04-email.png" },
  { id: "credit-card",   label: "クレジットカード入力", image: "05-credit-card.png" },
  { id: "notice",        label: "ご注意事項",           image: "06-notice.png" },
  { id: "complete",      label: "受付完了",             image: "07-complete.png" },
];
