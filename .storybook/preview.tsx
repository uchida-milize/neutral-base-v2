import type { Preview } from "@storybook/react";
import React from "react";
import "../app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // モバイルフレーム（390px）でプレビュー
    viewport: {
      defaultViewport: "mobile1",
    },
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: 390,
          minHeight: 600,
          position: "relative",
          overflow: "hidden",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          fontFamily: "var(--font-sans, sans-serif)",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
