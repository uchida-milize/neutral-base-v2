import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import {
  AgreeBlocks,
  AgreeItem,
  NoticeContent,
  HeigaiModal,
  DISCLOSURE_INTRO,
  Btn,
} from "@/components/theo-tdf/claude-design/screens";

/* ============================================================
   Agree / Notice — AgreeBlocks / AgreeItem / NoticeContent / HeigaiModal
   ============================================================ */
const meta: Meta<typeof AgreeBlocks> = {
  title: "theo-tdf/Agree/AgreeBlocks",
  component: AgreeBlocks,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: 360, padding: 16, background: "#fff" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof AgreeBlocks>;

export const DisclosureIntro: Story = {
  name: "AgreeBlocks — 告知に関する重要事項",
  args: { blocks: DISCLOSURE_INTRO },
};

// AgreeItem (accordion)
export const AgreeItemClosed: StoryObj = {
  name: "AgreeItem — closed",
  render: () => (
    <AgreeItem
      num="1"
      item={{
        t: "重要事項の確認",
        blocks: [{ p: "本保険の重要事項を確認してください。" }],
      }}
      open={false}
      onToggle={() => {}}
    />
  ),
};
export const AgreeItemOpen: StoryObj = {
  name: "AgreeItem — open",
  render: () => (
    <AgreeItem
      num="1"
      item={{
        t: "重要事項の確認",
        blocks: [
          { head: "この保険について" },
          { p: "この保険は団体保険です。" },
          { ul: ["保険期間は1年です", "自動更新されます"] },
        ],
      }}
      open={true}
      onToggle={() => {}}
    />
  ),
};
export const AgreeItemChecked: StoryObj = {
  name: "AgreeItem — checked",
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <AgreeItem
        num="1"
        item={{
          t: "重要事項の確認",
          blocks: [{ p: "本保険の重要事項を確認してください。" }],
          checks: ["上記の内容を確認し、同意します"],
        }}
        open={true}
        onToggle={() => {}}
        checked={checked}
        onCheck={() => setChecked((v) => !v)}
      />
    );
  },
};

// NoticeContent (full text)
export const NoticeContentStory: StoryObj = {
  name: "NoticeContent — 重要事項本文",
  render: () => (
    <div style={{ width: 360, padding: 16, background: "#fff", maxHeight: 500, overflowY: "auto" }}>
      <NoticeContent />
    </div>
  ),
};

// HeigaiModal
export const HeigaiModalStory: StoryObj = {
  name: "HeigaiModal — 事前同意事項",
  decorators: [
    (Story) => (
      <div style={{ width: 390, height: 700, position: "relative", overflow: "hidden", background: "#fff" }}>
        <Story />
      </div>
    ),
  ],
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <div style={{ padding: 16 }}>
          <Btn kind="outline" onClick={() => setOpen(true)}>
            重要事項モーダルを開く
          </Btn>
        </div>
        <HeigaiModal
          open={open}
          onClose={() => setOpen(false)}
          onAgree={() => setOpen(false)}
        />
      </>
    );
  },
};
