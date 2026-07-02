"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV = [
  { href: "/theo-tdf/guidelines", label: "概要" },
  { href: "/theo-tdf/guidelines/color", label: "カラー" },
  { href: "/theo-tdf/guidelines/typography", label: "タイポグラフィ" },
  { href: "/theo-tdf/guidelines/button-form", label: "スタイル" },
  { href: "/theo-tdf/guidelines/components", label: "カスタムコンポーネント" },
  { href: "/theo-tdf/guidelines/accessibility", label: "アクセシビリティ" },
];

export default function GuidelinesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      {/* sub-nav */}
      <nav className="sticky top-14 z-30 border-y border-border bg-[#F2FBFE]">
        <div className="mx-auto flex max-w-5xl justify-center gap-1 overflow-x-auto px-4 py-2 sm:px-6">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
      {children}
    </>
  );
}
