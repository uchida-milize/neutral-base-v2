import * as React from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";

/**
 * OverviewSection — 「30 秒で分かる」共通ブロック。
 *
 * 汎用 TOP / XXX TOP / T&D TOP など、どのテナントの入口に置いても成立する
 * システム概観 (Pipeline 4 ステップ + 役割見取り図) を提供する。
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
    <section className="mt-16">
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
          を参照。ここでは「全体の流れ」と「誰がどこを触るか」だけ示します。
        </p>
      </div>

      {/* Pipeline 4 ステップ (横並び) */}
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PipelineStep
          n="01"
          who="UI/UX"
          title="Figma Variables"
          body="デザイナーが色・サイズを Variables として定義。"
        />
        <PipelineStep
          n="02"
          who="Bridge"
          title="globals.css"
          body="CSS Custom Properties として書き出し (162 + 13 トークン)。"
        />
        <PipelineStep
          n="03"
          who="Bridge"
          title="Tailwind utility"
          body="@theme inline で CSS var を utility class に自動公開。"
        />
        <PipelineStep
          n="04"
          who="Dev"
          title="React component"
          body="className に utility を書くだけ。生 hex は触らない。"
        />
      </div>

      {/* 「誰がどこを触る」見取り図 (3 列) */}
      <div className="grid gap-4 lg:grid-cols-3">
        <RoleColumn
          icon="🎨"
          title="デザイナーが触る"
          who="UI/UX"
          paths={[
            { path: "Figma Variables", desc: "色・サイズ・効果の一次定義" },
            { path: "components/<tenant>/tokens.css", desc: "テナント別のブランドカラー上書き" },
            { path: "app/globals.css", desc: "汎用 162 色 + 13 サイズの基盤" },
          ]}
        />
        <RoleColumn
          icon="🤝"
          title="両者で見る"
          who="Both"
          paths={[
            { path: "/<tenant>/guidelines", desc: "ブランドルール・配色・コードスニペット" },
            { path: "/<tenant>/components", desc: "shadcn コンポーネントのカタログ" },
            { path: "components/ui/*", desc: "shadcn primitive (29 個、両者の共通言語)" },
          ]}
        />
        <RoleColumn
          icon="💻"
          title="開発者が触る"
          who="Dev"
          paths={[
            { path: "app/<tenant>/*/page.tsx", desc: "画面実装。Tailwind utility 中心" },
            { path: "components/<tenant>/", desc: "テナント固有の React component" },
            { path: "scripts/, middleware.ts", desc: "テナント生成、Basic Auth 等の運用" },
          ]}
        />
      </div>
    </section>
  );
}

function PipelineStep({
  n,
  who,
  title,
  body,
}: {
  n: string;
  who: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground transition-colors duration-300">
      <div className="flex items-center justify-between">
        <span className="font-mono text-caption font-semibold text-primary">
          {n}
        </span>
        <Badge variant="outline" className="font-mono text-tiny">
          {who}
        </Badge>
      </div>
      <h3 className="mt-2 text-h7 font-semibold">{title}</h3>
      <p className="mt-1 text-caption text-muted-foreground">{body}</p>
    </div>
  );
}

function RoleColumn({
  icon,
  title,
  who,
  paths,
}: {
  icon: string;
  title: string;
  who: string;
  paths: { path: string; desc: string }[];
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 text-card-foreground transition-colors duration-300">
      <div className="flex items-center gap-2">
        <span className="text-h6" aria-hidden>{icon}</span>
        <h3 className="text-h7 font-semibold">{title}</h3>
        <Badge variant="outline" className="ml-auto font-mono text-tiny">
          {who}
        </Badge>
      </div>
      <ul className="mt-3 space-y-2.5">
        {paths.map((p) => (
          <li key={p.path}>
            <p className="font-mono text-caption text-primary">{p.path}</p>
            <p className="text-caption text-muted-foreground">{p.desc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
