import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ScreenPin } from "@/components/theo-tdf/claude-design/screens";
import { figmaDesign, FIGMA_URLS } from "./figma-links";

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

const meta: Meta<typeof ScreenPin> = {
  title: "theo-tdf/Screens/03 ScreenPin (PIN認証)",
  component: ScreenPin,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", designs: figmaDesign(FIGMA_URLS.pages.screens) },
  decorators: [PhoneFrame],
};
export default meta;
type Story = StoryObj<typeof ScreenPin>;

export const Default: Story = {
  args: { go: () => {} },
};
export const PinEntered: Story = {
  name: "PIN 入力済み",
  args: { go: () => {}, initialPin: "123456" },
};
