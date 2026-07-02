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
import {
  SectionHeading,
  Section,
  RadiusBox,
} from "@/components/guidelines/theo-tdf-shared";

export const metadata: Metadata = {
  title: "ボタン・フォーム | ガイドライン | THEO × T&Dファイナンシャル 組込",
  description:
    "5 種ボタンの用途ルール・1 画面 1 CTA 規律・角丸とシャドウの階段スケール。",
};

export default function ButtonFormPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <ButtonRules />
      <RadiusAndShadow />
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
        title="5 種類のボタン — 用途で選ぶ"
        description="kind prop で用途を宣言します。cta（申込/前進）/ button（通常確定）/ outline（サブアクション）/ ghost（キャンセル・後退）/ danger（削除・解約）。色は tokens.css の --cta-* / --button-* から自動反映されます。1 画面に cta は 1 つまで、という規律を必ず守ってください。"
        audience="both"
      />

      {/* 5 種ボタン (テナントの tokens.css の値を自動反映) */}
      <AutoButtonGrid />

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
/* Radius / Shadow                                                    */
/* ---------------------------------------------------------------- */

function RadiusAndShadow() {
  return (
    <Section id="radius">
      <SectionHeading
        eyebrow="Shape"
        title="角丸とシャドウ"
        description="角丸は意図的に階段状。ボタンは 10px、フォーム 14px、カード 18px、フィーチャーカード 24px の 4 段で構造を表します。"
        audience="designer"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <RadiusBox label="sm" value="6px" />
        <RadiusBox label="md (button)" value="10px" />
        <RadiusBox label="lg (form)" value="14px" />
        <RadiusBox label="xl (card)" value="18px" />
        <RadiusBox label="2xl (feature)" value="24px" />
        <RadiusBox label="full (pill)" value="9999px" />
      </div>

      <Card className="mt-6 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-h4">シャドウは 5 段階</CardTitle>
          <CardDescription>
            xs / sm / md / lg / navy (深さに応じて) 。navy シャドウは Primary
            ボタンの hover / featured カードで限定使用。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { name: "xs", style: { boxShadow: "0 1px 2px 0 rgba(15, 23, 42, 0.04)" } },
            { name: "sm", style: { boxShadow: "0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)" } },
            { name: "md", style: { boxShadow: "0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)" } },
            { name: "lg", style: { boxShadow: "0 12px 28px -8px rgba(15, 23, 42, 0.16), 0 8px 16px -8px rgba(15, 23, 42, 0.06)" } },
            { name: "navy", style: { boxShadow: "0 16px 30px -12px rgba(27, 49, 87, 0.32)" } },
          ].map((s) => (
            <div
              key={s.name}
              className="grid h-20 place-items-center rounded-[14px] border border-border bg-card text-caption text-card-foreground"
              style={s.style}
            >
              {s.name}
            </div>
          ))}
        </CardContent>
      </Card>
    </Section>
  );
}
