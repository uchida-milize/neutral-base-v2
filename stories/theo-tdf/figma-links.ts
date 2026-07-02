/**
 * Figma ファイルへの URL 一覧
 * storybook-addon-designs の parameters.designs で使用する。
 *
 * ファイル: T-D 組込ページ
 * https://www.figma.com/design/YBJqblcAwrxktgLgGAKyWW/
 */

const FILE_KEY = "YBJqblcAwrxktgLgGAKyWW";
const FILE_NAME = "T-D-%E7%B5%84%E8%BE%BC%E3%83%9A%E3%83%BC%E3%82%B8";
const BASE = `https://www.figma.com/design/${FILE_KEY}/${FILE_NAME}`;

const url = (nodeId: string) => `${BASE}?node-id=${nodeId}`;

/** Figma ノード URL マップ */
export const FIGMA_URLS = {
  // ─── ページ ──────────────────────────────────────────
  pages: {
    cover:      url("2115-1074"),
    foundation: url("2115-1075"),
    components: url("2115-1076"),
    screens:    url("2078-213"),
  },

  // ─── コンポーネント（🧩 Components ページ内）────────
  components: {
    divSlider:   url("2107-977"),   // DivSlider（Default / Active）
    simSliders:  url("2107-1005"),  // SimSliders
    field:       url("2108-1000"),  // Field（4状態）
    select:      url("2109-1004"),  // Select（4状態）
    groupCard:   url("2110-985"),   // GroupCard
    stepSection: url("2111-1022"),  // StepSection（Big / Compact）
  },

  // ─── Foundation ドキュメント ──────────────────────────
  foundation: {
    colorTokens:    url("2116-2"),   // ① Color Tokens
    typographyScale: url("2115-1075"), // ② Typography Scale（Foundationページ全体）
    spacingScale:   url("2116-6"),   // ③ Spacing Scale
    radiusShadow:   url("2116-8"),   // ④ Radius & Shadow
  },
} as const;

/**
 * storybook-addon-designs 用ヘルパー
 * @example
 *   parameters: { designs: figmaDesign(FIGMA_URLS.components.field) }
 */
export const figmaDesign = (figmaUrl: string) => ({
  type: "figma" as const,
  url: figmaUrl,
});
