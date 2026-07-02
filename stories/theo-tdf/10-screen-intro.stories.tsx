import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ScreenIntro } from "@/components/theo-tdf/claude-design/screens";

const meta: Meta<typeof ScreenIntro> = {
  title: "theo-tdf/Screens/00 ScreenIntro",
  component: ScreenIntro,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
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
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof ScreenIntro>;

export const Default: Story = {
  args: { go: () => {} },
};
