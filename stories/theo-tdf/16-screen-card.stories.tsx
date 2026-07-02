import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  ScreenCardInput,
  ScreenCardConfirm,
  ExtBar,
} from "@/components/theo-tdf/claude-design/screens";

const PhoneFrame = (Story: React.ComponentType) => (
  <div
    style={{
      width: 390,
      height: 844,
      position: "relative",
      overflow: "hidden",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Story />
  </div>
);

// ScreenCardInput
const inputMeta: Meta<typeof ScreenCardInput> = {
  title: "theo-tdf/Screens/06 ScreenCardInput (カード入力)",
  component: ScreenCardInput,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [PhoneFrame],
};
export default inputMeta;

export const Default: StoryObj<typeof ScreenCardInput> = {
  args: { go: () => {} },
};

// ScreenCardConfirm — 別ファイルが原則だが一覧性のためここにまとめる
export const CardConfirm: StoryObj = {
  name: "ScreenCardConfirm (カード確認)",
  render: () => (
    <div
      style={{
        width: 390,
        height: 844,
        position: "relative",
        overflow: "hidden",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ScreenCardConfirm go={() => {}} />
    </div>
  ),
};

// ExtBar (外部GMOフレーム)
export const ExtBarStory: StoryObj = {
  name: "ExtBar (GMO外部URL)",
  render: () => (
    <div style={{ width: 390, padding: 16, background: "#fff" }}>
      <ExtBar url="https://example.com/gmo-payment" />
    </div>
  ),
};
