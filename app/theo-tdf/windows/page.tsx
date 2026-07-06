"use client";

import * as React from "react";
import { makeGroups, ScreenGroupSection } from "./shared";

/**
 * /theo-tdf/windows
 *
 * 全ステップの画面を1ページに縦スクロール・各グループ横スクロールで表示。
 * アンカーリンクで各グループへジャンプ可能。
 */

export default function TheoTdfWindowsPage() {
  const noop = () => {};
  const groups = makeGroups(noop);

  return (
    <main className="mx-auto max-w-[1700px] px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      {/* ページヘッダー */}
      <div className="mb-10 max-w-3xl">
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
      </div>

      {/* アンカージャンプナビ */}
      <nav className="mb-12 flex flex-wrap gap-2" aria-label="画面グループ一覧">
        {groups.map((g) => (
          <a
            key={g.key}
            href={`#${g.key}`}
            className="flex items-center gap-2 rounded-xl border border-warm-200 bg-white px-4 py-2.5 shadow-sm transition-all hover:border-primary hover:shadow-md"
          >
            {g.badge && (
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase rounded-full bg-primary-10 text-primary-600 px-2.5 py-0.5 shrink-0">
                {g.badge}
              </span>
            )}
            <span className="text-h7 font-semibold text-foreground">{g.title}</span>
            <span className="text-caption text-muted-foreground tabular-nums">{g.screens.length}</span>
          </a>
        ))}
      </nav>

      {/* 全グループをインライン表示 */}
      <div className="flex flex-col gap-20">
        {groups.map((g) => (
          <div key={g.key} id={g.key} className="scroll-mt-20 overflow-x-auto pb-4">
            <ScreenGroupSection group={g} />
          </div>
        ))}
      </div>
    </main>
  );
}
