import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16+ では同一 LAN 上の IP アクセス時に HMR が CORS でブロックされるため、
  // 開発用に使う origin を明示的に許可する。
  // 192.168.4.104 は現在の開発機の LAN IP。必要に応じて追記してください。
  allowedDevOrigins: ["192.168.4.104"],
};

export default nextConfig;
