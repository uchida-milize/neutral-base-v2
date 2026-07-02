import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Btn, Ic } from "@/components/theo-tdf/claude-design/screens";

const meta: Meta<typeof Btn> = {
  title: "theo-tdf/Atoms/Btn",
  component: Btn,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: 360, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Btn>;

export const Cta: Story = {
  args: { kind: "cta", children: "プランを選ぶ" },
};
export const Default: Story = {
  args: { kind: "button", children: "つぎへ" },
};
export const Outline: Story = {
  args: { kind: "outline", children: "もどる" },
};
export const Danger: Story = {
  args: { kind: "danger", children: "解約する" },
};
export const Ghost: Story = {
  args: { kind: "ghost", children: "スキップ" },
};
export const Disabled: Story = {
  args: { kind: "cta", children: "申込む", disabled: true },
};
export const WithIcon: Story = {
  render: () => (
    <Btn kind="cta">
      プランを選ぶ <Ic.chevR className="w-4 h-4" />
    </Btn>
  ),
};
