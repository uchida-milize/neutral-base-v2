import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import {
  SimSliders,
  BenefitTable,
  Simulator,
  WheelCol,
  DateDrumSheet,
  PLANS,
  Btn,
} from "@/components/theo-tdf/claude-design/screens";
import { figmaDesign, FIGMA_URLS } from "./figma-links";

/* ============================================================
   Simulator — SimSliders / BenefitTable / Simulator / WheelCol / DateDrumSheet
   ============================================================ */
const meta: Meta<typeof SimSliders> = {
  title: "theo-tdf/Simulator/SimSliders",
  component: SimSliders,
  tags: ["autodocs"],
  parameters: {
    designs: figmaDesign(FIGMA_URLS.components.simSliders),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360, padding: 24, background: "#fff" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof SimSliders>;

export const Default: Story = {
  render: () => {
    const [m, setM] = useState(30000);
    const [y, setY] = useState(20);
    return <SimSliders m={m} setM={setM} y={y} setY={setY} />;
  },
};

// BenefitTable
export const BenefitTableStory: StoryObj = {
  name: "BenefitTable",
  render: () => (
    <BenefitTable m={30000} y={20} plan={PLANS[0]} startAge={30} />
  ),
};

// Simulator (full panel)
export const SimulatorClosed: StoryObj = {
  name: "Simulator — collapsed",
  render: () => {
    const [m, setM] = useState(30000);
    const [y, setY] = useState(20);
    return (
      <div style={{ width: 360, padding: 0 }}>
        <Simulator
          m={m} setM={setM}
          y={y} setY={setY}
          planName={PLANS[0].name}
          plan={PLANS[0]}
          initialSimOpen={false}
        />
      </div>
    );
  },
};
export const SimulatorOpen: StoryObj = {
  name: "Simulator — expanded",
  render: () => {
    const [m, setM] = useState(30000);
    const [y, setY] = useState(20);
    return (
      <div style={{ width: 360, padding: 0 }}>
        <Simulator
          m={m} setM={setM}
          y={y} setY={setY}
          planName={PLANS[0].name}
          plan={PLANS[0]}
          initialSimOpen={true}
        />
      </div>
    );
  },
};

// WheelCol (single column)
export const WheelColStory: StoryObj = {
  name: "WheelCol",
  render: () => {
    const [idx, setIdx] = useState(5);
    const items = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
    return (
      <div style={{ width: 80, margin: "0 auto", border: "1px solid #e5e7eb" }}>
        <WheelCol items={items} index={idx} onChange={setIdx} />
      </div>
    );
  },
};

// DateDrumSheet
export const DateDrumSheetStory: StoryObj = {
  name: "DateDrumSheet",
  decorators: [
    (Story) => (
      <div style={{ width: 390, height: 500, position: "relative", overflow: "hidden", background: "#f9fafb" }}>
        <Story />
      </div>
    ),
  ],
  render: () => {
    const [open, setOpen] = useState(true);
    const [val, setVal] = useState("1990-06-15");
    return (
      <>
        <div style={{ padding: 16 }}>
          <Btn kind="outline" onClick={() => setOpen(true)}>
            生年月日ピッカーを開く
          </Btn>
          <p className="mt-2 text-caption text-neutral-500">選択値: {val}</p>
        </div>
        <DateDrumSheet
          open={open}
          value={val}
          onClose={() => setOpen(false)}
          onDone={(v) => { setVal(v); setOpen(false); }}
        />
      </>
    );
  },
};
