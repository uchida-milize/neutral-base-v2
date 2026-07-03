import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CardsSection } from "@/components/theo-tdf/theo-catalog";
import { Section, SectionHeading, ComponentSnippet } from "@/components/guidelines/theo-tdf-shared";
export const metadata: Metadata = { title: "セクション | Components | THEO × T&Dファイナンシャル" };
export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <Link href="/theo-tdf/components" className="inline-flex items-center gap-1 text-caption text-muted-foreground hover:text-primary mb-6"><ChevronLeft className="size-3.5" />コンポーネント一覧</Link>
      <header className="mb-10 max-w-3xl">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">Components</p>
        <h1 className="mt-2 text-display-3 font-semibold tracking-tight">セクション</h1>
        <p className="mt-3 text-body text-muted-foreground">NumberedSectionHeading / CardHeader / StepSection。</p>
      </header>
      <div className="mb-14 overflow-x-auto"><CardsSection /></div>
      <Section>
        <SectionHeading eyebrow="Props Reference" title="使い方早見表" description="セクションコンポーネントの props 一覧。" audience="developer" />
        <div className="space-y-6">
          <ComponentSnippet name="GroupCard" desc="入力グループのコンテナ（アイコン付きヘッダー）"
            props={[
              { name: "title",   type: "string", required: true },
              { name: "sub",     type: "string", required: false },
              { name: "iconSrc", type: "string", required: false },
              { name: "children",type: "ReactNode", required: true },
            ]}
            code={`<GroupCard title="契約者情報" sub="ご本人さまの情報" iconSrc="/assets/theo-tdf/person-heart.svg">\n  <Field label="姓" placeholder="山田" required />\n  <LockedField label="生年月日" value="1990/01/01" />\n</GroupCard>`} />
          <ComponentSnippet name="StepSection" desc="STEP 番号バッジ付きセクション"
            props={[
              { name: "label",   type: "string",  required: true },
              { name: "n",       type: "number",  required: true },
              { name: "big",     type: "boolean", required: false, default: "false" },
              { name: "children",type: "ReactNode", required: true },
            ]}
            code={`<StepSection label="メールアドレス" n={1}>\n  <Field label="メールアドレス" placeholder="example@email.com" required />\n</StepSection>`} />
          <ComponentSnippet name="ConfirmCard" desc="確認画面カード（CardHeader + ConfirmRow の組み合わせ）"
            props={[
              { name: "title",   type: "string", required: true },
              { name: "state",   type: '"Plain" | "Locked" | "Editable" | "Editing"', required: false, default: '"Plain"' },
              { name: "children",type: "ReactNode", required: true },
            ]}
            code={`<ConfirmCard title="積立内容" state="Locked">\n  <ConfirmRow label="契約プラン">がん保障型　死亡保障あり</ConfirmRow>\n  <ConfirmRow label="保障期間">15年</ConfirmRow>\n</ConfirmCard>`} />
          <ComponentSnippet name="ConfirmRow / AddressRow" desc="確認行（ラベル＋値）と住所行"
            props={[
              { name: "label",      type: "string",   required: true },
              { name: "postalCode", type: "string",   required: true, default: "— (AddressRow)" },
              { name: "address",    type: "string",   required: true, default: "— (AddressRow)" },
            ]}
            code={`<ConfirmRow label="氏名">山田 太郎</ConfirmRow>\n<AddressRow postalCode="100-0001" address="東京都千代田区丸の内1丁目" />`} />
        </div>
      </Section>
    </main>
  );
}
