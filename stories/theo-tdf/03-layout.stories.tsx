import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  AppBar,
  Steps,
  GroupCard,
  ActionBar,
  StepSection,
  SectionLabel,
  SubLabel,
  Btn,
  Field,
  Ic,
} from "@/components/theo-tdf/claude-design/screens";

/* ============================================================
   Layout atoms — AppBar / Steps / GroupCard / ActionBar / StepSection
   ============================================================ */
const meta: Meta<typeof AppBar> = {
  title: "theo-tdf/Layout/AppBar",
  component: AppBar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ width: 390, background: "#fff" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof AppBar>;

export const Default: Story = {
  args: { title: "保険" },
};
export const WithBack: Story = {
  args: { title: "保険", onBack: () => {} },
};
export const Done: Story = {
  args: { title: "お申込み完了" },
};

// Steps
export const StepsStep1: StoryObj = {
  name: "Steps — STEP 1",
  render: () => (
    <div style={{ width: 390, background: "#fff" }}>
      <Steps n={1} />
    </div>
  ),
};
export const StepsStep3: StoryObj = {
  name: "Steps — STEP 3",
  render: () => (
    <div style={{ width: 390, background: "#fff" }}>
      <Steps n={3} />
    </div>
  ),
};
export const StepsStep5: StoryObj = {
  name: "Steps — STEP 5 (完了)",
  render: () => (
    <div style={{ width: 390, background: "#fff" }}>
      <Steps n={5} />
    </div>
  ),
};

// GroupCard
export const GroupCardDefault: StoryObj = {
  name: "GroupCard",
  render: () => (
    <div style={{ width: 360, padding: 16 }}>
      <GroupCard title="契約者情報" sub="被保険者と同一" icon={Ic.user}>
        <Field label="氏名（漢字）" placeholder="山田 太郎" required />
        <Field label="生年月日" placeholder="1990-01-01" />
      </GroupCard>
    </div>
  ),
};

// ActionBar
export const ActionBarDefault: StoryObj = {
  name: "ActionBar",
  render: () => (
    <div style={{ width: 390, position: "relative", height: 100, background: "#f9fafb" }}>
      <ActionBar>
        <Btn kind="cta">
          つぎへ <Ic.chevR className="w-4 h-4" />
        </Btn>
      </ActionBar>
    </div>
  ),
};
export const ActionBarSolid: StoryObj = {
  name: "ActionBar — solid (blue)",
  render: () => (
    <div style={{ width: 390, position: "relative", height: 100, background: "#f9fafb" }}>
      <ActionBar solid>
        <Btn kind="cta">申込む</Btn>
      </ActionBar>
    </div>
  ),
};

// StepSection
export const StepSectionDefault: StoryObj = {
  name: "StepSection",
  render: () => (
    <div style={{ width: 360, padding: 16, background: "#fff" }}>
      <StepSection label="プランを選ぶ" n={1} big>
        <p className="text-caption text-neutral-500">プランの説明テキスト</p>
      </StepSection>
    </div>
  ),
};
export const StepSectionSmall: StoryObj = {
  name: "StepSection — small",
  render: () => (
    <div style={{ width: 360, padding: 16, background: "#fff" }}>
      <StepSection label="Contract Info">
        <Field label="氏名" placeholder="山田 太郎" />
      </StepSection>
    </div>
  ),
};
