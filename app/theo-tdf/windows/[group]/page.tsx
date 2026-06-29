"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { makeGroups, ScreenGroupSection } from "../shared";

/**
 * /theo-tdf/windows/[group]
 *
 * グループキーに対応する画面群を横スクロール表示。
 */

const BACK_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export default function TheoTdfWindowsGroupPage() {
  const params = useParams();
  const groupKey = typeof params.group === "string" ? params.group : "";
  const noop = () => {};
  const groups = makeGroups(noop);
  const group = groups.find((g) => g.key === groupKey);

  if (!group) {
    return (
      <main className="mx-auto max-w-[1700px] px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
        <p className="text-body text-muted-foreground">グループ「{groupKey}」が見つかりません。</p>
        <Link href="/theo-tdf/windows" className="mt-4 inline-flex items-center gap-1.5 text-primary hover:underline">
          {BACK_ICON} 一覧に戻る
        </Link>
      </main>
    );
  }

  /* 前後グループへのリンク */
  const idx = groups.findIndex((g) => g.key === groupKey);
  const prev = idx > 0 ? groups[idx - 1] : null;
  const next = idx < groups.length - 1 ? groups[idx + 1] : null;

  return (
    <main className="mx-auto max-w-[1700px] px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      {/* パンくず */}
      <div className="mb-8 flex items-center gap-2 text-caption text-muted-foreground">
        <Link href="/theo-tdf/windows" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
          {BACK_ICON} スクリーン一覧
        </Link>
        <span>/</span>
        {group.badge && (
          <>
            <span className="font-mono uppercase tracking-[0.14em] text-primary-600">{group.badge}</span>
            <span>/</span>
          </>
        )}
        <span className="text-foreground font-medium">{group.title}</span>
      </div>

      {/* グループ表示 */}
      <div className="overflow-x-auto pb-6">
        <ScreenGroupSection group={group} />
      </div>

      {/* 前後ナビゲーション */}
      <div className="mt-12 flex items-center justify-between gap-4 border-t border-warm-200 pt-8">
        <div>
          {prev && (
            <Link
              href={`/theo-tdf/windows/${prev.key}`}
              className="group inline-flex items-center gap-2 rounded-xl border border-warm-200 bg-white px-4 py-3 shadow-sm transition-all hover:border-primary hover:shadow-md"
            >
              {BACK_ICON}
              <span className="flex flex-col items-start">
                {prev.badge && (
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-primary-600">{prev.badge}</span>
                )}
                <span className="text-h7 font-semibold text-foreground">{prev.title}</span>
              </span>
            </Link>
          )}
        </div>
        <div>
          {next && (
            <Link
              href={`/theo-tdf/windows/${next.key}`}
              className="group inline-flex items-center gap-2 rounded-xl border border-warm-200 bg-white px-4 py-3 shadow-sm transition-all hover:border-primary hover:shadow-md"
            >
              <span className="flex flex-col items-end">
                {next.badge && (
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-primary-600">{next.badge}</span>
                )}
                <span className="text-h7 font-semibold text-foreground">{next.title}</span>
              </span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
