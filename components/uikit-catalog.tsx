"use client";

import * as React from "react";
import { Plus, Check, Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

/**
 * 共通 Components カタログ。
 *
 * /components (汎用) と /tdf/components (T&D 専用) で使い回す。
 * shadcn セマンティック層 (--primary, --accent, --border 等) を参照しているので、
 * 親が `<div className="tdf-scope">` で包めば自動的にテナント色に追従する。
 *
 * id を付与した input/checkbox 等はカタログを 1 ページに 1 度だけ置く前提。
 * 複数並べる必要が出たら scopeKey prop を足して id を分離するのが筋。
 */
export function UikitCatalog() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
      <ButtonsCard />
      <BadgesCard />
      <FormFieldsCard />
      <SelectionControlsCard />
      <SlidersProgressCard />
      <SelectCard />
      <TableCard />
      <TabsCard />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 共通カード枠                                                       */
/* ---------------------------------------------------------------- */

function CatalogCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="transition-colors duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

/* ---------------------------------------------------------------- */
/* 個別カード                                                         */
/* ---------------------------------------------------------------- */

function ButtonsCard() {
  return (
    <CatalogCard title="Buttons" description="variant × size の組み合わせ">
      <div className="flex flex-wrap gap-2">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="add">
          <Plus />
        </Button>
        <Button disabled>Disabled</Button>
      </div>
    </CatalogCard>
  );
}

function BadgesCard() {
  return (
    <CatalogCard title="Badges" description="状態表示・タグ">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="secondary" className="gap-1">
          <Check className="size-3" /> Verified
        </Badge>
        <Badge variant="outline" className="gap-1">
          <Bell className="size-3" /> 3
        </Badge>
      </div>
    </CatalogCard>
  );
}

function FormFieldsCard() {
  return (
    <CatalogCard title="Form fields" description="Input / Textarea / Label">
      <div className="space-y-2">
        <Label htmlFor="uk-email">Email</Label>
        <Input id="uk-email" type="email" placeholder="you@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="uk-pw">Password</Label>
        <Input id="uk-pw" type="password" placeholder="••••••••" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="uk-note">Note</Label>
        <Textarea id="uk-note" placeholder="メモを入力..." rows={3} />
      </div>
    </CatalogCard>
  );
}

function SelectionControlsCard() {
  const [pref, setPref] = React.useState("email");
  return (
    <CatalogCard title="Selection" description="Checkbox / Radio / Switch">
      <div className="flex items-center gap-3">
        <Checkbox id="uk-tos" defaultChecked />
        <Label htmlFor="uk-tos" className="text-sm">
          利用規約に同意する
        </Label>
      </div>

      <RadioGroup value={pref} onValueChange={setPref} className="grid gap-2">
        <div className="flex items-center gap-3">
          <RadioGroupItem value="email" id="uk-r-email" />
          <Label htmlFor="uk-r-email" className="text-sm">
            メールで通知
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="push" id="uk-r-push" />
          <Label htmlFor="uk-r-push" className="text-sm">
            プッシュ通知
          </Label>
        </div>
      </RadioGroup>

      <div className="flex items-center justify-between">
        <Label htmlFor="uk-sw" className="text-sm">
          ダークモードを優先
        </Label>
        <Switch id="uk-sw" />
      </div>
    </CatalogCard>
  );
}

function SlidersProgressCard() {
  const [vol, setVol] = React.useState<number[]>([60]);
  return (
    <CatalogCard title="Slider &amp; Progress">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <Label htmlFor="uk-vol">Volume</Label>
          <span className="text-muted-foreground tabular-nums">{vol[0]}</span>
        </div>
        <Slider
          id="uk-vol"
          value={vol}
          onValueChange={setVol}
          max={100}
          step={1}
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span>Upload</span>
          <span className="text-muted-foreground tabular-nums">72%</span>
        </div>
        <Progress value={72} />
      </div>
    </CatalogCard>
  );
}

function SelectCard() {
  return (
    <CatalogCard title="Select" description="ドロップダウン入力">
      <div className="space-y-2">
        <Label htmlFor="uk-region">Region</Label>
        <Select defaultValue="jp">
          <SelectTrigger id="uk-region" className="w-full">
            <SelectValue placeholder="地域を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jp">日本</SelectItem>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="de">Germany</SelectItem>
            <SelectItem value="sg">Singapore</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CatalogCard>
  );
}

const sampleRows = [
  { id: "INV-001", name: "Sato Yuki", status: "Paid", amount: "¥12,400" },
  { id: "INV-002", name: "Tanaka Aoi", status: "Pending", amount: "¥3,200" },
  { id: "INV-003", name: "Ito Ren", status: "Refunded", amount: "¥980" },
  { id: "INV-004", name: "Suzuki Mei", status: "Paid", amount: "¥8,750" },
];

function TableCard() {
  return (
    <CatalogCard title="Table" description="一覧表示">
      <div className="overflow-hidden rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-mono text-xs">{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      row.status === "Paid"
                        ? "default"
                        : row.status === "Pending"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CatalogCard>
  );
}

function TabsCard() {
  return (
    <CatalogCard title="Tabs" description="セクション切替">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent
          value="overview"
          className="rounded-md border border-border p-3 text-sm text-muted-foreground"
        >
          月次サマリーをここに表示します。
        </TabsContent>
        <TabsContent
          value="activity"
          className="rounded-md border border-border p-3 text-sm text-muted-foreground"
        >
          最新のアクティビティ。
        </TabsContent>
        <TabsContent
          value="settings"
          className="rounded-md border border-border p-3 text-sm text-muted-foreground"
        >
          通知やセキュリティの設定。
        </TabsContent>
      </Tabs>
    </CatalogCard>
  );
}
