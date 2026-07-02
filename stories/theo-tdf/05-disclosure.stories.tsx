import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import {
  KoTable,
  DisclosureQCard,
  DisclosureModal,
  koTableFor,
  PLANS,
  KO_CANCER,
  Btn,
} from "@/components/theo-tdf/claude-design/screens";

/* ============================================================
   Disclosure — KoTable / DisclosureQCard / DisclosureModal
   ============================================================ */
const meta: Meta<typeof KoTable> = {
  title: "theo-tdf/Plan/KoTable",
  component: KoTable,
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
type Story = StoryObj<typeof KoTable>;

export const CancerPlan: Story = {
  args: { rows: koTableFor("cancer", true) },
};
export const CarePlan: Story = {
  name: "KoTable — 障害介護プラン",
  args: { rows: koTableFor("care", true) },
};
export const ThreePlan: Story = {
  name: "KoTable — 三大疾病プラン",
  args: { rows: koTableFor("three", true) },
};

// DisclosureQCard
export const QCard: StoryObj = {
  name: "DisclosureQCard",
  render: () => (
    <DisclosureQCard row={KO_CANCER[1]} idx={1} />
  ),
};

// DisclosureModal (full sheet)
export const ModalSheet: StoryObj = {
  name: "DisclosureModal — 告知シート",
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
            告知モーダルを開く
          </Btn>
        </div>
        <DisclosureModal
          plan={open ? PLANS[0] : null}
          death={true}
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
};
export const ModalSheetWithConfirm: StoryObj = {
  name: "DisclosureModal — confirm buttons",
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
            告知モーダルを開く（確認ボタン付き）
          </Btn>
        </div>
        <DisclosureModal
          plan={open ? PLANS[0] : null}
          death={true}
          onClose={() => setOpen(false)}
          confirm
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </>
    );
  },
};
