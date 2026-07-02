import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { ScreenStep2 } from "@/components/theo-tdf/claude-design/screens";

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

const meta: Meta<typeof ScreenStep2> = {
  title: "theo-tdf/Screens/02 ScreenStep2 (プラン選択)",
  component: ScreenStep2,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [PhoneFrame],
};
export default meta;
type Story = StoryObj<typeof ScreenStep2>;

const WithState = (args: Partial<Parameters<typeof ScreenStep2>[0]>) => {
  const [sel, setSel] = useState("cancer_d");
  const [m, setM] = useState(30000);
  const [y, setY] = useState(20);
  return (
    <ScreenStep2
      go={() => {}}
      sel={sel}
      setSel={setSel}
      m={m} setM={setM}
      y={y} setY={setY}
      {...args}
    />
  );
};

export const Default: Story = {
  render: () => <WithState />,
};
export const NoticeOpen: Story = {
  name: "重要事項モーダル 表示",
  render: () => <WithState initialNoticeOpen />,
};
export const Agreed: Story = {
  name: "同意済み",
  render: () => <WithState initialAgree />,
};
export const WithSim: Story = {
  name: "シミュレーター 展開",
  render: () => <WithState initialSimOpen />,
};
export const SimFirst: Story = {
  name: "simFirst モード（シム→プラン）",
  render: () => <WithState simFirst />,
};
export const AccordionCards: Story = {
  name: "プランカード accordion モード",
  render: () => <WithState planCardStyle="accordion" />,
};
