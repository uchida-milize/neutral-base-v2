/**
 * フロー 11 画面のメタ情報 (id / label) を Server Component から直接
 * 参照できるように "use client" の付かない素のモジュールに切り出したもの。
 *
 * flow-screens.tsx の FLOW は実際の Component 参照を含むため "use client" 必須。
 * Server Component が FLOW を直接 import すると client reference 化されて
 * `.map()` が呼べなくなる (TypeError: FLOW.map is not a function)。
 * 静的なラベル情報はここから読み出せば良い。
 */

export type FlowStepMeta = {
  id: string;
  label: string;
};

export const FLOW_META: FlowStepMeta[] = [
  { id: "guidance", label: "事前ガイダンス" },
  { id: "product", label: "対象商品の選択" },
  { id: "plan", label: "希望補償プラン" },
  { id: "info", label: "お客様情報入力" },
  { id: "confirm1", label: "入力内容の確認" },
  { id: "ekyc-doc", label: "本人確認 書類選択" },
  { id: "ekyc-cap", label: "本人確認 撮影" },
  { id: "health", label: "健康告知" },
  { id: "confirm2", label: "お申込み内容の確認" },
  { id: "payment", label: "カード登録・決済" },
  { id: "done", label: "お申込み完了" },
];
