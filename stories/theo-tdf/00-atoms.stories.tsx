import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  Badge,
  Btn,
  Ic,
} from "@/components/theo-tdf/claude-design/screens";

/* ============================================================
   Atoms — Badge
   ============================================================ */
const meta: Meta<typeof Badge> = {
  title: "theo-tdf/Atoms/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Secondary: Story = {
  args: { children: "重要", tone: "secondary" },
};
export const Primary: Story = {
  args: { children: "おすすめ", tone: "primary" },
};
export const Warm: Story = {
  args: { children: "任意", tone: "warm" },
};
