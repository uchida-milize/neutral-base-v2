"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV = [
  { href: "/theo-tdf/components", label: "一覧" },
  { href: "/theo-tdf/components/brand", label: "ブランドアセット" },
  { href: "/theo-tdf/components/navigation", label: "ナビゲーション" },
  { href: "/theo-tdf/components/buttons", label: "ボタン" },
  { href: "/theo-tdf/components/labels", label: "ラベル・バッジ" },
  { href: "/theo-tdf/components/forms", label: "フォーム入力" },
  { href: "/theo-tdf/components/cards", label: "セクション" },
  { href: "/theo-tdf/components/plan", label: "カード・プラン選択" },
  { href: "/theo-tdf/components/disclosure", label: "開示・折り畳み" },
  { href: "/theo-tdf/components/status", label: "アイコン" },
  { href: "/theo-tdf/components/action", label: "アクション" },
];

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      {/* sub-nav */}
      <nav className="sticky top-14 z-30 border-y border-border bg-[#F2FBFE]">
        <div className="mx-auto flex max-w-5xl justify-start gap-1 overflow-x-auto px-4 py-2 sm:px-6">
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
