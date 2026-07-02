import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ScreenOverview } from "@/components/theo-tdf/claude-design/screens";
import { figmaDesign, FIGMA_URLS } from "./figma-links";

const PHONE_DECORATOR = (Story: React.ComponentType) => (
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

const meta: Meta<typeof ScreenOverview> = {
  title: "theo-tdf/Screens/01 ScreenOverview",
  component: ScreenOverview,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", designs: figmaDesign(FIGMA_URLS.pages.screens) },
  decorators: [PHONE_DECORATOR],
};
export default meta;
type Story = StoryObj<typeof ScreenOverview>;

export const Default: Story = {
  args: { go: () => {} },
};
export const WithHeigaiOpen: Story = {
  name: "重要事項モーダル 表示",
  args: { go: () => {}, initialHeigaiOpen: true },
};
