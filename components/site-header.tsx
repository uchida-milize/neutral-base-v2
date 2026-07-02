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
  /** 外部リンク: true のとき target="_blank" で開き、active 判定をしない */
  external?: boolean;
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
      { href: "/xxx", label: "ホーム", match: "exact" },
      { href: "/xxx/guidelines", label: "ガイドライン", match: "exact" },
      { href: "/xxx/components", label: "コンポーネント", match: "exact" },
      { href: "/xxx/prototype", label: "プロトタイプ", match: "exact" },
      { href: "/xxx/windows", label: "スクリーン", match: "exact" },
    ],
  },
  {
    pathPrefix: "/aaa",
    brandLabel: "AAA Design System",
    brandInitial: "A",
    brandHref: "/aaa",
    items: [
      { href: "/aaa", label: "ホーム", match: "exact" },
      { href: "/aaa/guidelines", label: "ガイドライン", match: "exact" },
      { href: "/aaa/components", label: "コンポーネント", match: "exact" },
      { href: "/aaa/prototype", label: "プロトタイプ", match: "exact" },
      { href: "/aaa/windows", label: "スクリーン", match: "exact" },
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
      { href: "/td-financial", label: "ホーム", match: "exact" },
      { href: "/td-financial/guidelines", label: "ガイドライン", match: "exact" },
      { href: "/td-financial/components", label: "コンポーネント", match: "exact" },
      { href: "/td-financial/prototype", label: "プロトタイプ", match: "exact" },
      { href: "/td-financial/windows", label: "スクリーン", match: "exact" },
    ],
  },
  {
    pathPrefix: "/theo-tdf",
    brandLabel: "T&Dファイナンシャル生命",
    brandInitial: "T",
    brandHref: "/theo-tdf",
    brandLogo: "/assets/theo-tdf/logo_td_financial.png",
    brandLogoWithLabel: false,
    items: [
      { href: "/theo-tdf", label: "ホーム", match: "exact" },
      { href: "/theo-tdf/guidelines", label: "ガイドライン", match: "exact" },
      { href: "/theo-tdf/components", label: "コンポーネント", match: "exact" },
      { href: "/theo-tdf/prototype", label: "プロトタイプ", match: "exact" },
      { href: "/theo-tdf/windows", label: "スクリーン", match: "exact" },
      // ─── 外部リンク ───────────────────────────────────────
      {
        href: "https://neutral-base-storybook.vercel.app",
        label: "Storybook",
        match: "exact",
        external: true,
      },
      {
        href: "https://www.figma.com/design/YBJqblcAwrxktgLgGAKyWW/T-D-%E7%B5%84%E8%BE%BC%E3%83%9A%E3%83%BC%E3%82%B8",
        label: "Figma",
        match: "exact",
        external: true,
      },
    ],
  },
  {
    pathPrefix: "/acme",
    brandLabel: "ACME Corp",
    brandInitial: "A",
    brandHref: "/acme",
    items: [
      { href: "/acme", label: "ホーム", match: "exact" },
      { href: "/acme/guidelines", label: "ガイドライン", match: "exact" },
      { href: "/acme/components", label: "コンポーネント", match: "exact" },
      { href: "/acme/prototype", label: "プロトタイプ", match: "exact" },
      { href: "/acme/windows", label: "スクリーン", match: "exact" },
    ],
  },
  // 将来の他社はここに追加 (例)
  // {
  //   pathPrefix: "/aaa",
  //   brandLabel: "AAA Design System",
  //   brandInitial: "A",
  //   brandHref: "/aaa",
  //   items: [
  //     { href: "/aaa", label: "ホーム", match: "exact" },
  //     { href: "/aaa/guidelines", label: "ガイドライン", match: "exact" },
  //     { href: "/aaa/components", label: "コンポーネント", match: "exact" },
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
    { href: "/", label: "ホーム", match: "exact" },
    { href: "/guidelines", label: "ガイドライン", match: "exact" },
    { href: "/components", label: "コンポーネント", match: "exact" },
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

/** Storybook ロゴアイコン — ブランドカラー #FF4785 */
function StorybookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="#FF4785"
    >
      {/* 右肩の折れ込みタブ */}
      <path d="M16.71.243l-.12 2.71a.18.18 0 0 0 .29.15l1.06-.8.9.7a.18.18 0 0 0 .28-.16L18.97.577zM19.75 1.93l.2 4.9-1.3-.4.1-1.8-1.1.8-1.1-.9.1 2-1.3-.3-.2-4.7 1.5-.1 1.1 1 1.1-.9z" />
      {/* 本体フレーム */}
      <path d="M5.5 5.96a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1H5.5zm.5 1.5h12v11H6z" />
      {/* 内側 "A" マーク */}
      <path d="M10.5 15.83c.1-1.3 1.2-2.1 2.7-2.1 1.7 0 2.6.9 2.6 2.4v4h-2v-.6c-.4.5-1 .8-1.6.8-1.1-.2-1.8-.9-1.8-1.8 0-1.2 1-2 2.7-2 .2 0 .4 0 .6.1v-1.1c0-.4-.2-.6-.6-.6-.4 0-.6.2-.6.5zm1 3.3c0 .4.3.6.7.6.5 0 1-.3 1-.8v-.5c-.2-.1-.4-.1-.6-.1-.7 0-1.1.3-1.1.8z" />
    </svg>
  );
}

/** Figma ロゴアイコン — 公式5色 */
function FigmaIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* 左上: Red */}
      <path fill="#F24E1E" d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
      {/* 右上: Coral */}
      <path fill="#FF7262" d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
      {/* 右中: Blue */}
      <path fill="#1ABCFE" d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
      {/* 左下: Purple */}
      <path fill="#A259FF" d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
      {/* 左中: Green */}
      <path fill="#0ACF83" d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
    </svg>
  );
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
            {tenant.items.map((item, i) => {
              // 外部リンクの手前にセパレータを挿入
              const prevItem = tenant.items[i - 1];
              const showSep = item.external && prevItem && !prevItem.external;
              const active = !item.external && isActive(item, pathname);
              const cls = [
                "rounded-md px-3 py-1.5 text-caption font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              ].join(" ");

              return (
                <React.Fragment key={item.href}>
                  {showSep && (
                    <span className="mx-1 hidden sm:inline-block h-5 w-px bg-border" />
                  )}
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={item.label}
                      aria-label={`${item.label}（別タブで開く）`}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {item.label === "Storybook" ? (
                        <StorybookIcon className="size-5" />
                      ) : item.label === "Figma" ? (
                        <FigmaIcon className="size-5" />
                      ) : (
                        <span className="text-caption font-medium">{item.label} ↗</span>
                      )}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cls}
                    >
                      {item.label}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
            {/* theo-tdf は保険商品のため常時ライト固定 → テーマトグルを出さない */}
            {tenant.pathPrefix !== "/theo-tdf" && (
              <>
                <span className="ml-2 hidden sm:inline-block h-5 w-px bg-border" />
                <ThemeToggle />
              </>
            )}
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
