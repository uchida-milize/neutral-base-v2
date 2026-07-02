import { JpText } from "@/components/jp-text";

/* ---------------------------------------------------------------- */
/* Audience type & labels                                            */
/* ---------------------------------------------------------------- */

export type Audience = "designer" | "developer" | "both";

export const AUDIENCE_LABELS: Record<Audience, { icon: string; label: string }> = {
  designer:  { icon: "🎨", label: "デザイナー向け" },
  developer: { icon: "💻", label: "開発者向け" },
  both:      { icon: "🤝", label: "両者向け" },
};

/* ---------------------------------------------------------------- */
/* AudienceBadge                                                     */
/* ---------------------------------------------------------------- */

export function AudienceBadge({ audience }: { audience: Audience }) {
  const { icon, label } = AUDIENCE_LABELS[audience];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-tiny font-medium text-muted-foreground"
      aria-label={`このセクションは ${label}`}
    >
      <span aria-hidden>{icon}</span>
      <span>{label}</span>
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* SectionHeading                                                    */
/* ---------------------------------------------------------------- */

export function SectionHeading({
  eyebrow,
  title,
  description,
  audience,
}: {
  eyebrow: string;
  title: string;
  description: string;
  audience?: Audience;
}) {
  return (
    <header className="mb-8 max-w-3xl">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>
        {audience ? <AudienceBadge audience={audience} /> : null}
      </div>
      <h2 className="mt-2 text-h2 font-semibold leading-tight tracking-tight">
        <JpText>{title}</JpText>
      </h2>
      <p className="mt-3 text-body text-muted-foreground sm:text-body-lg">
        {description}
      </p>
    </header>
  );
}

/* ---------------------------------------------------------------- */
/* Section                                                           */
/* ---------------------------------------------------------------- */

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`mt-30 scroll-mt-24 transition-colors duration-300 ${className}`}
    >
      {children}
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* SnippetCard                                                       */
/* ---------------------------------------------------------------- */

export function SnippetCard({
  label,
  preview,
  code,
}: {
  label: string;
  preview: React.ReactNode;
  code: string;
}) {
  return (
    <div className="rounded-md border border-border bg-card transition-colors duration-300">
      <div className="border-b border-border px-4 py-2">
        <p className="text-caption font-medium text-foreground">{label}</p>
      </div>
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="flex items-center justify-center border-b border-border bg-background p-4 lg:border-b-0 lg:border-r">
          {preview}
        </div>
        <pre className="overflow-x-auto bg-muted/40 p-4 font-mono text-tiny leading-relaxed text-muted-foreground">
          {code}
        </pre>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* RadiusBox                                                         */
/* ---------------------------------------------------------------- */

export function RadiusBox({ label, value }: { label: string; value: string }) {
  const radius = value === "9999px" ? 9999 : parseInt(value, 10);
  return (
    <div className="space-y-2">
      <div
        className="h-16 border border-border bg-primary-500/10 transition-colors duration-300 dark:bg-primary-300/15"
        style={{ borderRadius: radius }}
      />
      <p className="text-body font-medium">{label}</p>
      <p className="font-mono text-caption text-muted-foreground">{value}</p>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* PropDef type & ComponentSnippet                                   */
/* ---------------------------------------------------------------- */

export type PropDef = {
  name: string;
  type: string;
  required: boolean;
  default?: string;
};

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ComponentSnippet({
  name,
  desc,
  props,
  code,
}: {
  name: string;
  desc: string;
  props: PropDef[];
  code: string;
}) {
  return (
    <Card className="transition-colors duration-300">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start gap-3">
          <code className="rounded-md border border-border bg-muted px-2 py-1 text-h5 font-semibold">{`<${name}>`}</code>
          <CardDescription className="mt-1 text-body">{desc}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">prop</TableHead>
                <TableHead>型</TableHead>
                <TableHead className="w-20">必須</TableHead>
                <TableHead className="w-32">default</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.map((p) => (
                <TableRow key={p.name}>
                  <TableCell className="font-mono text-caption font-semibold">{p.name}</TableCell>
                  <TableCell className="font-mono text-caption text-muted-foreground">{p.type}</TableCell>
                  <TableCell>
                    {p.required ? (
                      <span className="rounded-full bg-secondary-10 px-2 py-0.5 text-tiny font-medium text-secondary-700">必須</span>
                    ) : (
                      <span className="text-caption text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-caption text-muted-foreground">{p.default ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <pre className="overflow-x-auto rounded-md bg-muted/60 p-4 font-mono text-tiny leading-relaxed text-muted-foreground">{code}</pre>
      </CardContent>
    </Card>
  );
}

/* ---------------------------------------------------------------- */
/* Constants                                                         */
/* ---------------------------------------------------------------- */

export const FONT_SCALE = [
  { name: "h1",       token: "--text-h1",       px: 34, use: "画面内最大見出し" },
  { name: "h2",       token: "--text-h2",       px: 28, use: "セクション見出し" },
  { name: "h3",       token: "--text-h3",       px: 24, use: "カードタイトル" },
  { name: "h4",       token: "--text-h4",       px: 20, use: "小見出し" },
  { name: "h5",       token: "--text-h5",       px: 18, use: "ラベル大" },
  { name: "h6",       token: "--text-h6",       px: 16, use: "ラベル" },
  { name: "body-lg",  token: "--text-body-lg",  px: 16, use: "本文 (リード)" },
  { name: "body",     token: "--text-body",     px: 14, use: "本文 (標準)" },
  { name: "caption",  token: "--text-caption",  px: 12, use: "メタデータ・ラベル" },
];

export const SPACING_SCALE = [
  { token: "spacing/0",  tw: "p-0 / gap-0 / m-0",    px: 0 },
  { token: "spacing/1",  tw: "p-1 / gap-1 / mt-1",    px: 4 },
  { token: "spacing/2",  tw: "p-2 / gap-2 / mt-2",    px: 8 },
  { token: "spacing/3",  tw: "p-3 / gap-3 / mt-3",    px: 12 },
  { token: "spacing/4",  tw: "p-4 / gap-4 / mt-4",    px: 16 },
  { token: "spacing/5",  tw: "p-5 / gap-5 / mt-5",    px: 20 },
  { token: "spacing/6",  tw: "p-6 / gap-6 / mt-6",    px: 24 },
  { token: "spacing/8",  tw: "p-8 / gap-8 / mt-8",    px: 32 },
  { token: "spacing/10", tw: "p-10 / gap-10 / mt-10", px: 40 },
  { token: "spacing/12", tw: "p-12 / gap-12 / mt-12", px: 48 },
  { token: "spacing/16", tw: "p-16 / gap-16 / mt-16", px: 64 },
  { token: "spacing/20", tw: "p-20 / gap-20 / mt-20", px: 80 },
  { token: "spacing/24", tw: "p-24 / gap-24 / mt-24", px: 96 },
  { token: "spacing/30", tw: "mt-30 / pb-30",          px: 120 },
];
