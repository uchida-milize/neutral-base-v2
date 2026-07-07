import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// patch-next-config.cjs (loaded via NODE_OPTIONS) handles the
// `next/config` shim so @storybook/nextjs peer-dep auto-detection
// does not crash even if the package is present in node_modules.

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    // storybook-addon-designs@6.x は Storybook 8 と非互換（@storybook/addons 削除済み）
    // stories の parameters.designs はそのまま保持。SB8 対応版が出たら再追加。
    // "storybook-addon-designs",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: ["../public"],
  viteFinal: async (viteConfig) => {
    // Tailwind v4 Vite plugin
    viteConfig.plugins = [
      ...(viteConfig.plugins ?? []),
      tailwindcss(),
    ];
    // @ alias → project root (mirrors tsconfig paths)
    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias as Record<string, string> ?? {}),
      "@": path.resolve(__dirname, ".."),
      "next/font/google": path.resolve(__dirname, "mocks/next-font-google.ts"),
    };
    return viteConfig;
  },
};

export default config;
