import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ScreenStep4 } from "@/components/theo-tdf/claude-design/screens";

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

const meta: Meta<typeof ScreenStep4> = {
  title: "theo-tdf/Screens/05 ScreenStep4 (内容確認)",
  component: ScreenStep4,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [PhoneFrame],
};
export default meta;
type Story = StoryObj<typeof ScreenStep4>;

export const Default: Story = {
  args: {
    go: () => {},
    sel: "cancer_d",
    m: 30000,
    y: 20,
  },
};
export const AllChecked: Story = {
  name: "全同意済み",
  args: {
    go: () => {},
    sel: "cancer_d",
    m: 30000,
    y: 20,
    initialChecks: [true, true, true],
  },
};
export const AcctOpen: Story = {
  name: "口座確認 展開",
  args: {
    go: () => {},
    sel: "cancer_d",
    m: 30000,
    y: 20,
    initialAcctOpen: true,
  },
};
export const FirstItemOpen: Story = {
  name: "同意事項 1番目 展開",
  args: {
    go: () => {},
    sel: "cancer_d",
    m: 30000,
    y: 20,
    initialOpenIdx: 0,
  },
};
