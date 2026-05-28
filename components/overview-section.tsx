import * as React from "react";
import Link from "next/link";

/**
 * OverviewSection — 「30 秒で分かる」共通ブロック。
 *
 * 3 つの役割グループでシステム全体を俯瞰:
 *   🎨 UI/UX  — デザイナーが触る (Step 01: Figma Variables)
 *   🔗 Bridge — 両者をつなぐ中間 (Step 02-03: globals.css → Tailwind utility)
 *   💻 Dev    — 開発者が触る (Step 04: React component)
 *
 * 引数:
 *   - guidelinesHref: 詳細リンク先 (デフォルト "/guidelines")
 *   - tenant:         "汎用 / XXX / T&D 等" — 説明文に差し込むテナント名 (任意)
 */
export function OverviewSection({
  guidelinesHref = "/guidelines",
  tenant,
}: {
  guidelinesHref?: string;
  tenant?: string;
}) {
  return (
    <section className="mt-30">
      <div className="mb-6 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
          Overview
        </p>
        <h2 className="mt-2 text-h5 font-semibold tracking-tight">
          30 秒で分かるこのシステム
        </h2>
        <p className="mt-3 text-body text-muted-foreground">
          {tenant ? <>このページは <strong className="text-foreground">{tenant}</strong> 配下のテナントですが、システム全体の流れは共通です。 </> : null}
          詳しくは{" "}
          <Link
            href={guidelinesHref}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Guidelines ページ
          </Link>
          を参照。ここでは「3 つの役割」と「それぞれが触るファイル / 担当ステップ」だけ示します。
        </p>
      </div>

      {/* 3 グループ: UI/UX / Bridge / Dev */}
      <div className="grid gap-4 lg:grid-cols-3">
        <RoleGroup
          icon="🎨"
          who="UI/UX"
          title="デザイナーが触る"
          tasks={[
            {
              title: "Figma Variables",
              body: "色・サイズ・効果を Variables として定義し、JSON エクスポートする。",
            },
          ]}
          files={[
            { path: "Figma Variables", desc: "色・サイズ・効果の一次定義" },
            { path: "components/<tenant>/tokens.css", desc: "テナント別のブランドカラー上書き" },
          ]}
        />
        <RoleGroup
          icon="🤝"
          who="UI/UX + Dev"
          title="両者をつなぐ中間層"
          tasks={[
            {
              title: "globals.css",
              body: "CSS Custom Properties として書き出し (162 + 13 トークン)。",
            },
            {
              title: "Tailwind utility",
              body: "@theme inline で CSS var を utility class に自動公開。",
            },
          ]}
          files={[
            { path: "app/globals.css", desc: "汎用 162 色 + 13 サイズの基盤" },
            { path: "components/ui/*", desc: "shadcn primitive (29 個、両者の共通言語)" },
          ]}
        />
        <RoleGroup
          icon="💻"
          who="Dev"
          title="開発者が触る"
          tasks={[
            {
              title: "React component",
              body: "className に Tailwind utility を書くだけ。生 hex は触らない。",
            },
          ]}
          files={[
            { path: "app/<tenant>/*/page.tsx", desc: "画面実装。Tailwind utility 中心" },
            { path: "components/<tenant>/", desc: "テナント固有の React component" },
            { path: "scripts/, middleware.ts", desc: "テナント生成、Basic Auth 等の運用" },
          ]}
        />
      </div>
    </section>
  );
}

function RoleGroup({
  icon,
  who,
  title,
  tasks,
  files,
}: {
  icon: string;
  who: string;
  title: string;
  tasks: { title: string; body: string }[];
  files: { path: string; desc: string }[];
}) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card p-5 text-card-foreground transition-colors duration-300">
      {/* アイコン + 役割を 1 つの pill にまとめる
          → 「🎨 = UI/UX」というペア関係が視覚的に伝わる */}
      <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-muted/60 px-2.5 py-1">
        <span className="text-body" aria-hidden>{icon}</span>
        <span className="font-chillax text-caption font-medium text-foreground">
          {who}
        </span>
      </span>

      {/* タイトル (役割の長文ラベル) */}
      <h3 className="mt-3 text-h7 font-semibold leading-tight">{title}</h3>

      {/* このグループが担当する作業 (順番付けない、並列のリスト) */}
      <div className="mt-4 space-y-2">
        <p className="text-tiny font-medium uppercase tracking-wider text-muted-foreground">
          やること
        </p>
        <ul className="space-y-2">
          {tasks.map((t) => (
            <li
              key={t.title}
              className="rounded-md bg-muted/40 p-3"
            >
              <p className="text-caption font-semibold leading-tight">
                {t.title}
              </p>
              <p className="mt-1 text-caption text-muted-foreground">
                {t.body}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* 触るファイル一覧 */}
      <div className="mt-4">
        <p className="text-tiny font-medium uppercase tracking-wider text-muted-foreground">
          触るファイル
        </p>
        <ul className="mt-2 space-y-2">
          {files.map((f) => (
            <li key={f.path}>
              <p className="font-mono text-caption text-primary">{f.path}</p>
              <p className="text-caption text-muted-foreground">{f.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
