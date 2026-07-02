import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { ScreenCombined } from "@/components/theo-tdf/claude-design/screens";
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

const meta: Meta<typeof ScreenCombined> = {
  title: "theo-tdf/Screens/08 ScreenCombined (パターンB統合)",
  component: ScreenCombined,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", designs: figmaDesign(FIGMA_URLS.pages.screens) },
  decorators: [PhoneFrame],
};
export default meta;

const WithState = (args: Partial<Parameters<typeof ScreenCombined>[0]>) => {
  const [sel, setSel] = useState("cancer_d");
  const [m, setM] = useState(30000);
  const [y, setY] = useState(20);
  return (
    <ScreenCombined
      go={() => {}}
      sel={sel} setSel={setSel}
      m={m} setM={setM}
      y={y} setY={setY}
      {...args}
    />
  );
};

export const Default: StoryObj = {
  render: () => <WithState />,
};
export const SimFirst: StoryObj = {
  name: "simFirst モード（シム先行）",
  render: () => <WithState simFirst />,
};
export const Agreed: StoryObj = {
  name: "事前同意済み",
  render: () => <WithState initialAgree />,
};
export const AccordionCards: StoryObj = {
  name: "プランカード accordion モード",
  render: () => <WithState planCardStyle="accordion" />,
};
