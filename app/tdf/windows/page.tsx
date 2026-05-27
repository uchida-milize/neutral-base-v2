import type { Metadata } from "next";

import { TdfFlowScreenStatic } from "@/components/tdf/flow-prototype";
import { FLOW_META } from "@/components/tdf/flow-meta";

export const metadata: Metadata = {
  title: "Prototype · 俯瞰 | T&D Design System",
  description:
    "T&D Embedded Insurance 申込フローの 11 画面を 390px 幅のページとして左から右に並べ、各画面の情報要素と遷移の流れを一目で俯瞰できるキャンバス。",
};

/**
 * /tdf/windows
 *
 * iPhone フレームは外し、各画面の `.phone` (幅 390px) を高さ可変のまま
 * 左から右に並べる。複数列でラップしてもよいので、画面解像度に応じて
 * flex-wrap で自然に折り返す。
 */
export default function TdfPrototypeCanvasPage() {
  return (
    <main className="mx-auto max-w-[1700px] px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <header className="mb-10 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
          Prototype · 俯瞰
        </p>
        <h1 className="mt-2 text-h5 font-semibold tracking-tight sm:text-h4">
          申込フロー 11 画面を一望するキャンバス
        </h1>
        <p className="mt-3 text-body text-muted-foreground sm:text-body-lg">
          各画面は <strong className="text-foreground">390px 幅</strong> · 高さは内容に応じて可変。
          画面解像度に合わせて自動的に折り返します。実際にタップして動かしたい場合は{" "}
          <a
            href="/tdf/prototype"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            画面遷移ビュー
          </a>
          {" "}を参照してください。
        </p>
      </header>

      {/* 横並びキャンバス: flex-wrap + items-start で高さ可変、左から順に流す */}
      <div className="flex flex-wrap items-start justify-start gap-x-8 gap-y-12">
        {FLOW_META.map((step, i) => (
          <figure
            key={step.id}
            className="flex flex-col items-start gap-3"
            style={{ width: 390 }}
          >
            <figcaption>
              <p className="font-mono text-caption text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 text-h7 font-semibold">{step.label}</h3>
            </figcaption>
            <TdfFlowScreenStatic index={i} />
          </figure>
        ))}
      </div>
    </main>
  );
}
