"use client";

import * as React from "react";
import Link from "next/link";
import { makeGroups } from "./shared";

/**
 * /theo-tdf/windows
 *
 * 各STEPごとのサブページへのナビゲーション一覧。
 * 実際にタップして動かしたい場合は /theo-tdf/prototype を参照。
 */

export default function TheoTdfWindowsPage() {
  const noop = () => {};
  const groups = makeGroups(noop);

  return (
    <main className="mx-auto max-w-[1700px] px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      {/* ページヘッダー */}
      <div className="mx-auto mb-10 max-w-5xl">
        <header className="max-w-3xl">
          <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
            Screens
          </p>
          <h1 className="mt-2 text-display-3 font-semibold tracking-tight sm:text-display-2">
            スクリーン
          </h1>
          <p className="mt-3 text-body text-muted-foreground sm:text-body-lg">
            各画面は <strong className="text-foreground">390px 幅</strong>・高さは内容に応じて可変。
            実際にタップして動かしたい場合は{" "}
            <a
              href="/theo-tdf/prototype"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              プロトタイプ
            </a>
            {" "}を参照してください。
          </p>
        </header>

        {/* ナビゲーションボタン */}
        <nav className="mt-8 flex flex-wrap gap-3" aria-label="画面グループ一覧">
          {groups.map((g) => (
            <Link
              key={g.key}
              href={`/theo-tdf/windows/${g.key}`}
              className="group flex items-center gap-2.5 rounded-xl border border-warm-200 bg-white px-4 py-3 shadow-sm transition-all hover:border-primary hover:shadow-md"
            >
              {g.badge && (
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase rounded-full bg-primary-10 text-primary-600 px-2.5 py-0.5 shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  {g.badge}
                </span>
              )}
              <span className="text-h7 font-semibold text-foreground">{g.title}</span>
              <span className="ml-auto text-caption text-muted-foreground tabular-nums">
                {g.screens.length}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
