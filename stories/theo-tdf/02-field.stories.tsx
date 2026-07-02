import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  Field,
  LockedField,
  Select,
  PREFS,
} from "@/components/theo-tdf/claude-design/screens";

/* ============================================================
   Form atoms — Field / LockedField / Select
   ============================================================ */
const meta: Meta<typeof Field> = {
  title: "theo-tdf/Form/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: 360, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  args: {
    label: "氏名（漢字）",
    placeholder: "山田 太郎",
    required: true,
  },
};
export const WithHint: Story = {
  args: {
    label: "電話番号",
    placeholder: "09012345678",
    hint: "ハイフンなしで入力してください",
    required: true,
  },
};
export const WithError: Story = {
  args: {
    label: "メールアドレス",
    placeholder: "taro@example.com",
    required: true,
    error: "メールアドレスの形式が正しくありません",
    errMode: "inline",
  },
};
export const Disabled: Story = {
  args: {
    label: "登録メールアドレス",
    value: "taro@theo.app",
    disabled: true,
  },
};

// LockedField は別コンポーネントだが同グループ
export const Locked: StoryObj = {
  render: () => (
    <LockedField label="登録メールアドレス" value="taro@theo.app" />
  ),
};

// Select
export const SelectDefault: StoryObj = {
  render: () => (
    <Select label="都道府県" required options={PREFS} />
  ),
};
export const SelectWithError: StoryObj = {
  render: () => (
    <Select
      label="都道府県"
      required
      options={PREFS}
      error="都道府県を選択してください"
      errMode="inline"
    />
  ),
};
