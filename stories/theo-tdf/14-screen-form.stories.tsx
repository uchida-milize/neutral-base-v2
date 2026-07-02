import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { ScreenForm } from "@/components/theo-tdf/claude-design/screens";
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

const meta: Meta<typeof ScreenForm> = {
  title: "theo-tdf/Screens/04 ScreenForm (申込フォーム)",
  component: ScreenForm,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", designs: figmaDesign(FIGMA_URLS.pages.screens) },
  decorators: [PhoneFrame],
};
export default meta;

const WithState = (args: Partial<Parameters<typeof ScreenForm>[0]>) => {
  const [m, setM] = useState(30000);
  const [y, setY] = useState(20);
  return (
    <ScreenForm
      go={() => {}}
      sel="cancer_d"
      m={m} setM={setM}
      y={y} setY={setY}
      {...args}
    />
  );
};

export const Default: StoryObj = {
  render: () => <WithState />,
};
export const DisclosureOpen: StoryObj = {
  name: "告知モーダル 表示",
  render: () => <WithState initialDisclosureOpen />,
};
export const ValidationErrors: StoryObj = {
  name: "バリデーションエラー表示",
  render: () => <WithState errMode="inline" initialErrStep={1} />,
};
export const Page2: StoryObj = {
  name: "フォーム 2ページ目（保険金受取人）",
  render: () => <WithState initialFormPage={2} />,
};
export const WithSheetResult: StoryObj = {
  name: "告知確認済み（同意シート完了）",
  render: () => <WithState initialKokuchiAgreed />,
};
