import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AutoButtonGrid } from "@/components/guidelines/auto-button-grid";
import { BrandGradients } from "@/components/theo-tdf/brand-gradients";
import {
  SectionHeading,
  Section,
  ComponentSnippet,
} from "@/components/guidelines/theo-tdf-shared";

export const metadata: Metadata = {
  title: "コンポーネント | ガイドライン | THEO × T&Dファイナンシャル 組込",
  description:
    "ボタン 5 種の使い分け・カスタムコンポーネント props 一覧・コードスニペット。",
};

export default function ComponentsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <ButtonRules />
      <ComponentHandoff />
    </main>
  );
}

/* ---------------------------------------------------------------- */
/* ボタン運用                                                         */
/* ---------------------------------------------------------------- */

function ButtonRules() {
  return (
    <Section id="buttons">
      <SectionHeading
        eyebrow="Buttons"
        title="5 種類のボタンを意味で使い分ける"
        description="theo-tdf のボタン体系は tokens.css の --button-* / --cta-* に定義されています。「純赤 = 申込/前進」「THEO Blue = 通常確定」「グレー = キャンセル」「白枠 = サブ」「destructive = 削除」を厳密に分けます。実機の通常ボタンは青グラデ (#075FE3→#64B0F7)、申込確定は赤グラデ (#E83A3C→#F66A6C) で描画します。"
        audience="both"
      />

      {/* 5 種ボタン (テナントの tokens.css の値を自動反映) */}
      <AutoButtonGrid />

      {/* グラデーション & 新中立面 (TD 組込1.4 で追加) */}
      <div className="mt-8 space-y-3">
        <h3 className="text-h4 font-semibold">グラデーション &amp; 中立面（TD 組込1.4）</h3>
        <p className="max-w-3xl text-body text-muted-foreground">
          実機プロトタイプでは、通常 CTA・申込確定ボタンと、ステッパーの番号バッジ・アプリヘッダーに青系グラデーションを使用します。
          無効フィールドやプラン選択帯・補償ラベルなどの中立面は <code>#EFEFEF</code> に統一しました。
          値は申込フロー画面（<code>claude-design/screens.tsx</code>）と一致します。
        </p>
        <BrandGradients />
      </div>

      <Card className="mt-6 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-h4">1 画面 1 つだけ、の規律</CardTitle>
          <CardDescription>
            純赤 (cta) と通常ボタン (THEO Blue) が同一画面で主役を争うのは原則禁止。並べる場合は純赤を 1 つに絞り、通常ボタンは neutral / outline に降格させること。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>状況</TableHead>
                  <TableHead>OK / NG</TableHead>
                  <TableHead>理由</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>申込フォームの最下部 (送信)</TableCell>
                  <TableCell><Badge>OK</Badge></TableCell>
                  <TableCell className="text-muted-foreground">前進アクションは cta 赤で 1 つに収束</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>キャンセル + 送信を並べる</TableCell>
                  <TableCell><Badge>OK</Badge></TableCell>
                  <TableCell className="text-muted-foreground">cta + neutral の主従関係</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>cta 純赤 と 通常ボタン THEO Blue を同列</TableCell>
                  <TableCell><Badge variant="destructive">NG</Badge></TableCell>
                  <TableCell className="text-muted-foreground">どちらが主か判断できなくなる</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>キャンセル を赤にする</TableCell>
                  <TableCell><Badge variant="destructive">NG</Badge></TableCell>
                  <TableCell className="text-muted-foreground">赤は前進専用。後退・否定には使わない</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>大面積の赤い背景</TableCell>
                  <TableCell><Badge variant="destructive">NG</Badge></TableCell>
                  <TableCell className="text-muted-foreground">cta 赤はピンポイント。装飾には使わない</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* コンポーネント ハンドオフ                                            */
/* ---------------------------------------------------------------- */

function ComponentHandoff() {
  return (
    <Section id="components-handoff">
      <SectionHeading
        eyebrow="Components Handoff"
        title="カスタムコンポーネント 使い方早見表"
        description="screens.tsx で定義された theo-tdf 固有コンポーネントの props 一覧とコードスニペット。インタラクティブなライブプレビューは Storybook で確認できます。"
        audience="developer"
      />

      <div className="flex">
        <a
          href="https://neutral-base-storybook.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-primary-10 px-4 py-2.5 text-body font-medium text-primary-700 transition-colors hover:bg-primary-50"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Storybook でライブプレビュー
        </a>
      </div>

      <div className="space-y-6">
        <ComponentSnippet
          name="Btn"
          desc="5 種 × full / disabled 対応ボタン"
          props={[
            { name: "kind", type: '"cta" | "button" | "outline" | "ghost" | "danger"', required: true },
            { name: "full",     type: "boolean", required: false, default: "true"  },
            { name: "disabled", type: "boolean", required: false, default: "false" },
          ]}
          code={`<Btn kind="cta">申込を確定する</Btn>
<Btn kind="button" full={false}>確認する</Btn>
<Btn kind="outline" full={false}>戻る</Btn>
<Btn kind="ghost"   full={false}>スキップ</Btn>
<Btn kind="danger"  full={false}>解約する</Btn>
<Btn kind="cta" disabled>申込む（disabled）</Btn>`}
        />

        <ComponentSnippet
          name="Field"
          desc="テキスト入力（4 状態: default / filled / error / disabled）"
          props={[
            { name: "label",       type: "string",                  required: true  },
            { name: "placeholder", type: "string",                  required: false },
            { name: "required",    type: "boolean",                 required: false },
            { name: "value",       type: "string",                  required: false },
            { name: "error",       type: "string",                  required: false },
            { name: "errMode",     type: '"inline" | "below"',      required: false, default: '"below"' },
            { name: "disabled",    type: "boolean",                 required: false },
          ]}
          code={`<Field label="姓" placeholder="山田" required />
<Field label="姓" value="山田" required />
<Field label="姓" required error="姓を入力してください" errMode="inline" />
<Field label="生年月日" value="1990 / 01 / 01" disabled />`}
        />

        <ComponentSnippet
          name="LockedField"
          desc="読み取り専用フィールド（変更不可。disabled より意図が明確）"
          props={[
            { name: "label", type: "string", required: true },
            { name: "value", type: "string", required: true },
          ]}
          code={`<LockedField label="生年月日" value="1990 / 01 / 01" />
<LockedField label="性別" value="男性" />`}
        />

        <ComponentSnippet
          name="Select"
          desc="ドロップダウン選択（3 状態）"
          props={[
            { name: "label",    type: "string",   required: true  },
            { name: "options",  type: "string[]", required: true  },
            { name: "required", type: "boolean",  required: false },
            { name: "error",    type: "string",   required: false },
            { name: "errMode",  type: '"inline" | "below"', required: false, default: '"below"' },
            { name: "disabled", type: "boolean",  required: false },
          ]}
          code={`import { PREFS } from "@/components/theo-tdf/claude-design/screens";

<Select label="都道府県" required options={PREFS} />
<Select label="都道府県" options={PREFS} error="選択してください" errMode="inline" />
<Select label="都道府県" options={PREFS} disabled />`}
        />

        <ComponentSnippet
          name="GroupCard"
          desc="入力グループのコンテナ（タイトル + アイコン + Field群をまとめる）"
          props={[
            { name: "title",   type: "string", required: true  },
            { name: "sub",     type: "string", required: false },
            { name: "iconSrc", type: "string", required: false },
          ]}
          code={`<GroupCard
  title="契約者情報"
  sub="ご契約者ご本人さまの情報"
  iconSrc="/assets/theo-tdf/person-heart.svg"
>
  <Field label="姓" placeholder="山田" required />
  <Field label="名" placeholder="太郎" required />
  <LockedField label="生年月日" value="1990 / 01 / 01" />
</GroupCard>`}
        />

        <ComponentSnippet
          name="StepSection"
          desc="STEP 番号バッジ付きセクション"
          props={[
            { name: "label", type: "string",  required: true  },
            { name: "n",     type: "number",  required: true  },
            { name: "big",   type: "boolean", required: false, default: "false" },
          ]}
          code={`{/* 通常 (フォーム用) */}
<StepSection label="メールアドレス" n={1}>
  <Field label="メールアドレス" placeholder="example@email.com" required />
</StepSection>

{/* big = true でバッジ・ラベルが大きくなる (シミュレーション用) */}
<StepSection label="保険料シミュレーション" n={2} big>
  <SimSliders m={m} setM={setM} y={y} setY={setY} />
</StepSection>`}
        />

        <ComponentSnippet
          name="ActionBar"
          desc="画面下部スティッキーバー（通常: 白背景 / solid: ブルー帯）"
          props={[
            { name: "solid", type: "boolean", required: false, default: "false" },
          ]}
          code={`{/* 通常: 白背景 */}
<ActionBar>
  <Btn kind="cta">次へ進む</Btn>
</ActionBar>

{/* solid: ブルー帯（申込確定画面で使用） */}
<ActionBar solid>
  <Btn kind="cta">申込む</Btn>
  <Btn kind="ghost" full={false}>キャンセル</Btn>
</ActionBar>`}
        />

        <ComponentSnippet
          name="SimSliders"
          desc="積立金額・保障期間 div ベーススライダー（Figma capture 対応）"
          props={[
            { name: "m",    type: "number",                     required: true },
            { name: "setM", type: "(val: number) => void",      required: true },
            { name: "y",    type: "number",                     required: true },
            { name: "setY", type: "(val: number) => void",      required: true },
          ]}
          code={`const [m, setM] = React.useState(10000);  // 積立金額 (円)
const [y, setY] = React.useState(15);     // 保障期間 (年)

<SimSliders m={m} setM={setM} y={y} setY={setY} />`}
        />
      </div>

      {/* import まとめ */}
      <div className="mt-6 rounded-lg border border-border bg-card p-5 transition-colors duration-300">
        <h3 className="text-h4 font-semibold">一括 import</h3>
        <pre className="mt-3 overflow-x-auto rounded-md bg-muted/60 p-4 font-mono text-tiny leading-relaxed text-muted-foreground">{`import {
  AppBar, Steps, Badge, Btn, Field, Select,
  LockedField, GroupCard, ActionBar, SimSliders,
  ReqBadge, ErrText, StepSection, PREFS,
} from "@/components/theo-tdf/claude-design/screens";`}</pre>
      </div>
    </Section>
  );
}
