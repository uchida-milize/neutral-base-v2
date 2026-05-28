import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { SiteFooter } from "@/components/site-footer";

/**
 * Inter — 旧 GeistMono の置き換え。
 * `--font-mono` がこの Inter を指すよう globals.css の @theme inline で再束縛。
 * GeistMono と違って等幅ではないが、本リポジトリでは `font-mono` を
 * 「強調された等幅風表記」というより「コード/識別子の意味的ラベル」として使っており、
 * Inter のクリーンな見た目の方が現代的なデザイン要件に合致するため。
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Design System",
  description:
    "Figma Variables (162 color tokens + 13 size tokens) を反映した Next.js + Tailwind v4 + shadcn/ui のデザインシステム。汎用 (/) と各テナント (/xxx 等) を 1 つのリポジトリで運用。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${GeistSans.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col"
        suppressHydrationWarning
      >
        {children}
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  );
}
