"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";

/**
 * サイト共通ヘッダー — テナント (会社) ごとにナビセットを切替。
 *
 * - 現在のパスが `/<テナント名>/` 配下なら、そのテナントのナビだけを描画
 * - それ以外 (汎用エリア) なら、汎用のナビを描画
 * - 顧客視点: T&D 担当者は /tdf/* だけを見るため、汎用への動線は出さない
 *
 * テナント追加は TENANTS 配列に 1 エントリ加えるだけ。pages 配下にも
 * 同名のディレクトリ (例: app/aaa/) を作れば成立する。
 */

type NavItem = {
  href: string;
  label: string;
  /** active 判定: "exact" = 完全一致、"prefix" = 前方一致 (子ルート含む) */
  match: "exact" | "prefix";
};

type Tenant = {
  /** URL 前方一致用のプレフィックス (例: "/tdf") */
  pathPrefix: string;
  /** ブランドマークに表示するテキスト */
  brandLabel: string;
  /** ブランドマーク 1 文字 (アイコン代わり) */
  brandInitial: string;
  /** ブランドマークのリンク先 (テナントトップ) */
  brandHref: string;
  /** このテナント配下のヘッダーに並べる nav リンク */
  items: NavItem[];
};

/**
 * 顧客テナントの追加は、ここに 1 エントリ足すだけ。
 * 並びは配列の前方からマッチを試すので、より深いプレフィックスは前に置く。
 * メニュー順は items 配列の宣言順 = ファイル名先頭の番号順 (1TOP, 2Guidelines, ...)。
 */
const TENANTS: Tenant[] = [
  {
    pathPrefix: "/tdf",
    brandLabel: "T&D Design System",
    brandInitial: "T",
    brandHref: "/tdf",
    items: [
      { href: "/tdf", label: "TOP", match: "exact" },
      { href: "/tdf/guidelines", label: "Guidelines", match: "exact" },
      { href: "/tdf/components", label: "Components", match: "exact" },
      { href: "/tdf/prototype", label: "Prototype", match: "exact" },
      { href: "/tdf/windows", label: "Windows", match: "exact" },
    ],
  },
  // 将来の他社はここに追加 (例)
  // {
  //   pathPrefix: "/aaa",
  //   brandLabel: "AAA Design System",
  //   brandInitial: "A",
  //   brandHref: "/aaa",
  //   items: [
  //     { href: "/aaa", label: "TOP", match: "exact" },
  //     { href: "/aaa/guidelines", label: "Guidelines", match: "exact" },
  //     { href: "/aaa/components", label: "Components", match: "exact" },
  //   ],
  // },
];

/** 汎用エリア (テナント配下でない URL) の nav 設定。 */
const GENERIC: Tenant = {
  pathPrefix: "/",
  brandLabel: "Design System",
  brandInitial: "D",
  brandHref: "/",
  items: [
    { href: "/", label: "TOP", match: "exact" },
    { href: "/guidelines", label: "Guidelines", match: "exact" },
    { href: "/components", label: "Components", match: "exact" },
  ],
};

function resolveTenant(pathname: string): Tenant {
  // TENANTS から前方一致でマッチを探す。マッチしなければ GENERIC。
  for (const t of TENANTS) {
    if (pathname === t.pathPrefix || pathname.startsWith(t.pathPrefix + "/")) {
      return t;
    }
  }
  return GENERIC;
}

function isActive(item: NavItem, pathname: string): boolean {
  if (item.match === "exact") return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const tenant = resolveTenant(pathname);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand */}
        <Link
          href={tenant.brandHref}
          className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-80"
        >
          <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground text-caption font-semibold">
            {tenant.brandInitial}
          </span>
          <span className="text-body font-semibold tracking-tight">
            {tenant.brandLabel}
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {tenant.items.map((item) => {
            const active = isActive(item, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "rounded-md px-3 py-1.5 text-caption font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
          <span className="ml-2 hidden sm:inline-block h-5 w-px bg-border" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
