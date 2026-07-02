import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  ScreenStatus,
  ScreenDone,
  ScreenEnded,
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

// ScreenStatus
const meta: Meta<typeof ScreenStatus> = {
  title: "theo-tdf/Screens/07 ScreenStatus / ScreenDone",
  component: ScreenStatus,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [PhoneFrame],
};
export default meta;
type Story = StoryObj<typeof ScreenStatus>;

export const StatusProcessing: Story = {
  name: "ScreenStatus — 処理中",
  args: { go: () => {}, variant: "processing" },
};
export const StatusError: Story = {
  name: "ScreenStatus — エラー",
  args: { go: () => {}, variant: "error" },
};

// ScreenDone
export const DoneDefault: StoryObj = {
  name: "ScreenDone — 完了",
  render: () => <ScreenDone go={() => {}} variant="done" />,
};
export const DonePending: StoryObj = {
  name: "ScreenDone — 審査中",
  render: () => <ScreenDone go={() => {}} variant="pending" />,
};

// ScreenEnded
export const EndedStory: StoryObj = {
  name: "ScreenEnded — 申込不可（告知NG）",
  render: () => <ScreenEnded onRestart={() => {}} />,
};
