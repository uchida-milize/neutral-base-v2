"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";

/**
 * サイト共通ヘッダー — テナント (会社) ごとにナビセットを切替。
 *
 * - 現在のパスが `/<テナント名>/` 配下なら、そのテナントのナビだけを描画
 * - それ以外 (汎用エリア) なら、汎用のナビを描画
 * - 顧客視点: XXX 担当者は /xxx/* だけを見るため、汎用への動線は出さない
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
  /** URL 前方一致用のプレフィックス (例: "/xxx") */
  pathPrefix: string;
  /** ブランドマークに表示するテキスト (alt 属性 / brandLogo 未指定時の本文) */
  brandLabel: string;
  /** ブランドマーク 1 文字 (brandLogo 未指定時のフォールバック) */
  brandInitial: string;
  /** ブランドマークのリンク先 (テナントトップ) */
  brandHref: string;
  /**
   * 外部 or /public 配下のロゴ画像 URL (省略可)。
   * 指定された場合は brandInitial の色付き文字マーク + brandLabel テキストの代わりに
   * このロゴ画像を表示する (画像自体にブランド名が含まれている前提)。
   */
  brandLogo?: string;
  /** brandLogo を使うとき、画像と一緒にテキスト brandLabel も並べるか (デフォルト: false = ロゴだけ) */
  brandLogoWithLabel?: boolean;
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
    pathPrefix: "/xxx",
    brandLabel: "XXX Design System",
    brandInitial: "T",
    brandHref: "/xxx",
    items: [
      { href: "/xxx", label: "TOP", match: "exact" },
      { href: "/xxx/guidelines", label: "Guidelines", match: "exact" },
      { href: "/xxx/components", label: "Components", match: "exact" },
      { href: "/xxx/prototype", label: "Prototype", match: "exact" },
      { href: "/xxx/windows", label: "Windows", match: "exact" },
    ],
  },
  {
    pathPrefix: "/aaa",
    brandLabel: "AAA Design System",
    brandInitial: "A",
    brandHref: "/aaa",
    items: [
      { href: "/aaa", label: "TOP", match: "exact" },
      { href: "/aaa/guidelines", label: "Guidelines", match: "exact" },
      { href: "/aaa/components", label: "Components", match: "exact" },
      { href: "/aaa/prototype", label: "Prototype", match: "exact" },
      { href: "/aaa/windows", label: "Windows", match: "exact" },
    ],
  },
  {
    pathPrefix: "/td-financial",
    brandLabel: "T&Dファイナンシャル生命",
    brandInitial: "T",
    brandHref: "/td-financial",
    // T&D 公式の type logo (画像にブランド名が含まれているため、ラベルテキストは並べない)
    brandLogo: "https://is.tdf-life.co.jp/tdcustomer/assets/Logo_Type-BZQyE79C.png",
    brandLogoWithLabel: false,
    items: [
      { href: "/td-financial", label: "TOP", match: "exact" },
      { href: "/td-financial/guidelines", label: "Guidelines", match: "exact" },
      { href: "/td-financial/components", label: "Components", match: "exact" },
      { href: "/td-financial/prototype", label: "Prototype", match: "exact" },
      { href: "/td-financial/windows", label: "Windows", match: "exact" },
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

/**
 * ブランドマークの inner content (Link / span のどちらでも包めるよう関数化)。
 */
function BrandInner({ tenant }: { tenant: Tenant }) {
  if (tenant.brandLogo) {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tenant.brandLogo}
          alt={tenant.brandLabel}
          className="h-7 w-auto object-contain"
        />
        {tenant.brandLogoWithLabel ? (
          <span className="text-body font-semibold tracking-tight">
            {tenant.brandLabel}
          </span>
        ) : (
          <span className="sr-only">{tenant.brandLabel}</span>
        )}
      </>
    );
  }
  return (
    <>
      <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground text-caption font-semibold">
        {tenant.brandInitial}
      </span>
      <span className="text-body font-semibold tracking-tight">
        {tenant.brandLabel}
      </span>
    </>
  );
}

/**
 * 内部本体。useSearchParams を使うため Suspense でラップする (SiteHeader 側)。
 */
function SiteHeaderInner() {
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  // ?focus=1 が付いている時はフォーカスモード:
  // - ナビセット (他ページへのリンク + テーマトグル) を非表示
  // - ブランドロゴはクリック不可 (顧客に画面遷移させないため)
  const focusMode = searchParams?.get("focus") === "1";
  const tenant = resolveTenant(pathname);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand */}
        {focusMode ? (
          <span
            className="flex cursor-default items-center gap-2 text-foreground"
            aria-label={tenant.brandLabel}
          >
            <BrandInner tenant={tenant} />
          </span>
        ) : (
          <Link
            href={tenant.brandHref}
            className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-80"
          >
            <BrandInner tenant={tenant} />
          </Link>
        )}

        {/* Nav (focus モードでは非表示) */}
        {!focusMode && (
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
        )}
      </div>
    </header>
  );
}

/**
 * useSearchParams は Static Rendering 環境では Suspense boundary 内に置く必要があるため、
 * 公開 API は Suspense でラップした薄いラッパーにする。
 */
export function SiteHeader() {
  return (
    <React.Suspense fallback={null}>
      <SiteHeaderInner />
    </React.Suspense>
  );
}
