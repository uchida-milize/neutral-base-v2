import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import {
  PlanCard,
  PlanCardAccordion,
  PlanList,
  PLANS,
  PLAN_CARDS,
} from "@/components/theo-tdf/claude-design/screens";

/* ============================================================
   Plan — PlanCard / PlanCardAccordion / PlanList
   ============================================================ */
const meta: Meta<typeof PlanCard> = {
  title: "theo-tdf/Plan/PlanCard",
  component: PlanCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: 360, padding: 16, background: "#F2FBFE" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof PlanCard>;

export const Unselected: Story = {
  render: () => (
    <PlanCard
      p={PLAN_CARDS[0]}
      selected={false}
      onSelect={() => {}}
    />
  ),
};
export const Selected: Story = {
  render: () => (
    <PlanCard
      p={PLAN_CARDS[0]}
      selected={true}
      onSelect={() => {}}
    />
  ),
};
export const WithTooltip: Story = {
  render: () => (
    <PlanCard
      p={PLAN_CARDS[0]}
      selected={false}
      onSelect={() => {}}
      initialTtOpen
    />
  ),
};

// Accordion variant
export const AccordionClosed: StoryObj = {
  name: "PlanCardAccordion — closed",
  render: () => (
    <PlanCardAccordion
      p={PLAN_CARDS[2]}
      selected={false}
      onSelect={() => {}}
      open={false}
      onToggle={() => {}}
    />
  ),
};
export const AccordionOpen: StoryObj = {
  name: "PlanCardAccordion — open",
  render: () => (
    <PlanCardAccordion
      p={PLAN_CARDS[2]}
      selected={true}
      onSelect={() => {}}
      open={true}
      onToggle={() => {}}
    />
  ),
};

// Full list (interactive)
export const PlanListCard: StoryObj = {
  name: "PlanList — card mode (interactive)",
  render: () => {
    const [sel, setSel] = useState("cancer_d");
    return (
      <div style={{ width: 360, padding: 16, background: "#F2FBFE" }}>
        <PlanList sel={sel} setSel={setSel} mode="card" />
        <p className="mt-4 text-caption text-neutral-500">選択: {sel}</p>
      </div>
    );
  },
};
export const PlanListAccordion: StoryObj = {
  name: "PlanList — accordion mode (interactive)",
  render: () => {
    const [sel, setSel] = useState("cancer_d");
    return (
      <div style={{ width: 360, padding: 16, background: "#F2FBFE" }}>
        <PlanList sel={sel} setSel={setSel} mode="accordion" />
        <p className="mt-4 text-caption text-neutral-500">選択: {sel}</p>
      </div>
    );
  },
};
