"use client";

import {
  InfoIcon,
  ShieldAlertIcon,
  CheckCircle2,
  Bell,
  CheckIcon,
  AlertTriangleIcon,
  XCircleIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  MoreHorizontalIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SonnerDemo } from "@/components/showcase/sonner-demo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClientOnly } from "@/components/client-only";

const tableData = [
  {
    id: 1,
    name: "佐藤 翔太",
    email: "sato@example.com",
    plan: "Pro",
    status: "active",
  },
  {
    id: 2,
    name: "鈴木 結衣",
    email: "suzuki@example.com",
    plan: "Standard",
    status: "active",
  },
  {
    id: 3,
    name: "高橋 健",
    email: "takahashi@example.com",
    plan: "Free",
    status: "trial",
  },
  {
    id: 4,
    name: "田中 美咲",
    email: "tanaka@example.com",
    plan: "Standard",
    status: "suspended",
  },
  {
    id: 5,
    name: "渡辺 涼介",
    email: "watanabe@example.com",
    plan: "Pro",
    status: "active",
  },
];

const statusBadge = (s: string) => {
  switch (s) {
    case "active":
      return <Badge variant="success">Active</Badge>;
    case "trial":
      return <Badge variant="info">Trial</Badge>;
    case "suspended":
      return <Badge variant="destructive">Suspended</Badge>;
    default:
      return <Badge variant="secondary">{s}</Badge>;
  }
};

export function UikitCatalog() {
  return (
        <div className="max-w-5xl space-y-12 p-6 py-10">
          {/* ------- Button ------- */}
          <Section title="Button" desc="バリアント / サイズ / 状態">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </Section>

          {/* ------- Card ------- */}
          <Section title="Card" desc="コンテンツを囲むパネル">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>プロジェクト概要</CardTitle>
                  <CardDescription>
                    Figma の Master Components から同期したデザインシステム
                  </CardDescription>
                  <CardAction>
                    <Button size="sm" variant="ghost">
                      編集
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p className="text-body">
                    本プロジェクトでは <code className="rounded bg-muted px-1 py-0.5 text-caption">color.json</code> と{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-caption">size.json</code> から
                    162 トークンを取り込み、ライト / ダーク両モードに展開しています。
                  </p>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                  <Button variant="outline" size="sm">
                    キャンセル
                  </Button>
                  <Button size="sm">保存</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-fg-success" />
                    今月の達成率
                  </CardTitle>
                  <CardDescription>2026年5月</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-h3 font-semibold text-fg-main">
                      87.4
                    </span>
                    <span className="text-fg-muted text-caption">%</span>
                    <Badge variant="success" className="ml-auto">
                      +12.3%
                    </Badge>
                  </div>
                  <div className="bg-muted mt-3 h-2 w-full overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full"
                      style={{ width: "87.4%" }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </Section>

          {/* ------- Badge ------- */}
          <Section title="Badge" desc="ステータス / カテゴリラベル">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
              <Badge>
                <Bell />
                3 件
              </Badge>
            </div>
          </Section>

          {/* ------- Input ------- */}
          <Section
            title="Input"
            desc="Figma: component/Text Field の default / edited / disable / danger"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Default" htmlFor="in-default">
                <Input id="in-default" placeholder="お名前を入力" />
              </Field>
              <Field label="Edited (値あり)" htmlFor="in-edited">
                <Input id="in-edited" defaultValue="うちだ" />
              </Field>
              <Field label="Disabled" htmlFor="in-disabled">
                <Input id="in-disabled" defaultValue="編集不可" disabled />
              </Field>
              <Field
                label="Danger (エラー)"
                htmlFor="in-danger"
                hint="必須項目です"
                hintTone="danger"
              >
                <Input
                  id="in-danger"
                  aria-invalid
                  defaultValue=""
                  placeholder="必須項目"
                />
              </Field>
            </div>
          </Section>

          {/* ------- Textarea ------- */}
          <Section title="Textarea" desc="複数行入力">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Default" htmlFor="ta-default">
                <Textarea id="ta-default" placeholder="自由記述..." rows={4} />
              </Field>
              <Field label="Disabled" htmlFor="ta-disabled">
                <Textarea
                  id="ta-disabled"
                  defaultValue={"これは編集不可の\nテキストエリアです。"}
                  rows={4}
                  disabled
                />
              </Field>
            </div>
          </Section>

          {/* ------- Checkbox ------- */}
          <Section title="Checkbox" desc="複数選択">
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox defaultChecked id="cb-1" />
                <span>利用規約に同意する（デフォルト ON）</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox id="cb-2" />
                <span>メールマガジンを受け取る</span>
              </label>
              <label className="flex items-center gap-2 text-sm opacity-50">
                <Checkbox id="cb-3" disabled />
                <span>無効化された項目</span>
              </label>
            </div>
          </Section>

          {/* ------- Radio ------- */}
          <Section title="Radio Group" desc="単一選択">
            <RadioGroup defaultValue="standard" className="gap-3">
              {[
                { value: "free", label: "Free（無料プラン）" },
                { value: "standard", label: "Standard（標準プラン）" },
                { value: "pro", label: "Pro（上位プラン）" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 text-sm"
                  htmlFor={`rd-${opt.value}`}
                >
                  <RadioGroupItem id={`rd-${opt.value}`} value={opt.value} />
                  <span>{opt.label}</span>
                </label>
              ))}
            </RadioGroup>
          </Section>

          {/* ------- Select ------- */}
          <Section title="Select" desc="ドロップダウン選択">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="部署を選択" htmlFor="sel-department">
                <Select>
                  <SelectTrigger id="sel-department" className="w-full">
                    <SelectValue placeholder="部署を選んでください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>エンジニアリング</SelectLabel>
                      <SelectItem value="frontend">フロントエンド</SelectItem>
                      <SelectItem value="backend">バックエンド</SelectItem>
                      <SelectItem value="infra">インフラ</SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>その他</SelectLabel>
                      <SelectItem value="design">デザイン</SelectItem>
                      <SelectItem value="sales">営業</SelectItem>
                      <SelectItem value="hr">人事</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Disabled" htmlFor="sel-disabled">
                <Select disabled defaultValue="locked">
                  <SelectTrigger id="sel-disabled" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="locked">編集不可</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </Section>

          {/* ------- Tooltip ------- */}
          <Section title="Tooltip" desc="マウスホバーで補足説明を表示">
            {/* Tooltip は Radix の useId が SSR/CSR で揃わずハイドレーション不整合を起こすので、
                ClientOnly で SSR をスキップしてマウント後に描画する */}
            <ClientOnly
              fallback={
                <div className="text-fg-muted text-caption">
                  Tooltip を読み込み中…
                </div>
              }
            >
              <div className="flex flex-wrap items-center gap-6">
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Button variant="outline">
                      <InfoIcon />
                      詳細
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    クリックで詳細ページに遷移します
                  </TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Button variant="destructive">
                      <ShieldAlertIcon />
                      削除
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    この操作は取り消せません
                  </TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <span className="text-fg-link cursor-help underline decoration-dotted underline-offset-4">
                      Hover してね
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Tooltip は `bg-primary` を使うので、ライト / ダークで自動切替されます。
                  </TooltipContent>
                </Tooltip>
              </div>
            </ClientOnly>
          </Section>

          {/* ------- Table ------- */}
          <Section
            title="Table"
            desc="Figma: component/table のトークンを背景・ヘッダー・行に適用"
          >
            <Card className="overflow-hidden p-0">
              <Table>
                <TableCaption>過去 30 日間のユーザー一覧</TableCaption>
                <TableHeader className="bg-table-base-3">
                  <TableRow>
                    <TableHead className="w-[60px] pl-4">#</TableHead>
                    <TableHead>名前</TableHead>
                    <TableHead>メール</TableHead>
                    <TableHead>プラン</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead className="pr-4 text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="text-fg-muted pl-4">
                        {u.id}
                      </TableCell>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="text-fg-sub">{u.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={u.plan === "Pro" ? "default" : "secondary"}
                        >
                          {u.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>{statusBadge(u.status)}</TableCell>
                      <TableCell className="pr-4 text-right">
                        <Button size="sm" variant="ghost">
                          編集
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </Section>

          {/* ------- Dialog ------- */}
          <Section title="Dialog" desc="モーダルポップアップ">
            <div className="flex flex-wrap items-center gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>新しいプロジェクト</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>新しいプロジェクトを作成</DialogTitle>
                    <DialogDescription>
                      プロジェクトの基本情報を入力してください。あとから変更できます。
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-2">
                    <Field label="プロジェクト名" htmlFor="dl-name">
                      <Input id="dl-name" placeholder="例: マーケサイト改装" />
                    </Field>
                    <Field label="説明" htmlFor="dl-desc">
                      <Textarea
                        id="dl-desc"
                        placeholder="プロジェクトの概要"
                        rows={3}
                      />
                    </Field>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">キャンセル</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button>作成する</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">アカウントを削除</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>本当に削除しますか？</DialogTitle>
                    <DialogDescription>
                      この操作は取り消せません。すべてのデータが完全に削除されます。
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">やめる</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button variant="destructive">削除する</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </Section>

          {/* ======================================================
           * Form 拡充
           * ====================================================== */}

          <Section title="Switch" desc="ON / OFF を切り替えるトグル">
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 text-sm">
                <Switch id="sw-1" defaultChecked />
                <span>メール通知</span>
              </label>
              <label className="flex items-center gap-3 text-sm">
                <Switch id="sw-2" />
                <span>SMS 通知</span>
              </label>
              <label className="flex items-center gap-3 text-sm opacity-50">
                <Switch id="sw-3" disabled />
                <span>Disabled</span>
              </label>
            </div>
          </Section>

          <Section title="Slider" desc="数値範囲の選択">
            <div className="space-y-6">
              <Field label="音量" htmlFor="sl-volume">
                <Slider id="sl-volume" defaultValue={[60]} max={100} step={1} />
              </Field>
              <Field label="価格帯（レンジ）" htmlFor="sl-range">
                <Slider
                  id="sl-range"
                  defaultValue={[20, 80]}
                  max={100}
                  step={5}
                />
              </Field>
            </div>
          </Section>

          <Section title="Toggle / ToggleGroup" desc="単独 ON/OFF と複数選択">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-3">
                <Toggle aria-label="Bold">
                  <BoldIcon />
                </Toggle>
                <Toggle aria-label="Italic" defaultPressed>
                  <ItalicIcon />
                </Toggle>
                <Toggle aria-label="Underline">
                  <UnderlineIcon />
                </Toggle>
                <Toggle variant="outline" aria-label="More">
                  <MoreHorizontalIcon />
                </Toggle>
              </div>

              <ToggleGroup type="single" defaultValue="center" variant="outline">
                <ToggleGroupItem value="left" aria-label="左揃え">
                  <AlignLeftIcon />
                </ToggleGroupItem>
                <ToggleGroupItem value="center" aria-label="中央揃え">
                  <AlignCenterIcon />
                </ToggleGroupItem>
                <ToggleGroupItem value="right" aria-label="右揃え">
                  <AlignRightIcon />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </Section>

          <Section title="Calendar" desc="日付選択（react-day-picker）">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                className="rounded-md border border-stroke-default"
              />
            </div>
          </Section>

          {/* ======================================================
           * Feedback
           * ====================================================== */}

          <Section title="Alert" desc="インライン通知（4 バリアント）">
            <div className="space-y-3">
              <Alert>
                <InfoIcon />
                <AlertTitle>お知らせ</AlertTitle>
                <AlertDescription>
                  メンテナンスを 12 月 25 日 02:00〜04:00 に予定しています。
                </AlertDescription>
              </Alert>
              <Alert variant="success">
                <CheckIcon />
                <AlertTitle>保存が完了しました</AlertTitle>
                <AlertDescription>
                  変更内容はすべてサーバーに反映されました。
                </AlertDescription>
              </Alert>
              <Alert variant="warning">
                <AlertTriangleIcon />
                <AlertTitle>ご注意</AlertTitle>
                <AlertDescription>
                  パスワードの有効期限が 3 日以内に切れます。
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <XCircleIcon />
                <AlertTitle>エラーが発生しました</AlertTitle>
                <AlertDescription>
                  サーバーに接続できません。ネットワークをご確認ください。
                </AlertDescription>
              </Alert>
            </div>
          </Section>

          <Section title="Progress" desc="進捗バー">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="flex justify-between text-caption">
                  <span>アップロード</span>
                  <span className="text-fg-muted">33%</span>
                </div>
                <Progress value={33} />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-caption">
                  <span>分析</span>
                  <span className="text-fg-muted">66%</span>
                </div>
                <Progress value={66} />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-caption">
                  <span>完了直前</span>
                  <span className="text-fg-muted">92%</span>
                </div>
                <Progress value={92} />
              </div>
            </div>
          </Section>

          <Section title="Skeleton" desc="読み込み中のプレースホルダー">
            <div className="flex items-center gap-4">
              <Skeleton className="size-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          </Section>

          <Section title="Sonner Toast" desc="右下に表示される通知トースト">
            <SonnerDemo />
          </Section>

          {/* ======================================================
           * Navigation
           * ====================================================== */}

          <Section title="Tabs" desc="タブで内容を切り替え">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">概要</TabsTrigger>
                <TabsTrigger value="analytics">分析</TabsTrigger>
                <TabsTrigger value="settings">設定</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <p className="text-body">
                  プロジェクト全体の概要と最近のアクティビティを表示します。
                </p>
              </TabsContent>
              <TabsContent value="analytics" className="mt-4">
                <p className="text-body">アクセス数 / コンバージョン率などのメトリクス。</p>
              </TabsContent>
              <TabsContent value="settings" className="mt-4">
                <p className="text-body">
                  通知 / 連携サービス / 料金プランの変更ができます。
                </p>
              </TabsContent>
            </Tabs>
          </Section>

          <Section title="Accordion" desc="折りたたみで FAQ などに">
            <Accordion type="single" collapsible defaultValue="q1">
              <AccordionItem value="q1">
                <AccordionTrigger>このデザインシステムはどう構築されていますか？</AccordionTrigger>
                <AccordionContent>
                  Figma Variables から 162 の color / size トークンを取り込み、Tailwind v4 の @theme inline と CSS 変数に展開しています。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>ダークモードはどう実装されていますか？</AccordionTrigger>
                <AccordionContent>
                  primitive を WCAG コントラスト比に配慮して再マッピングし、`.dark` セレクタで上書きしています。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>新しいコンポーネントの追加方法は？</AccordionTrigger>
                <AccordionContent>
                  shadcn 標準パターンに沿って `components/ui/` に作成し、トークンを参照する形にしてください。
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Section>

          <Section title="Breadcrumb" desc="現在地のパスを示すナビゲーション">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">ホーム</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Showcase</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Components</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </Section>

          <Section title="Pagination" desc="ページネーション">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">10</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Section>

          {/* ======================================================
           * Overlay
           * ====================================================== */}

          <Section title="Popover" desc="トリガーの近くに浮かぶ汎用ポップアップ">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">設定を開く</Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="space-y-3">
                  <h4 className="font-medium leading-none">表示設定</h4>
                  <p className="text-fg-muted text-caption">
                    プロフィール画面の表示項目を調整します。
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <Switch defaultChecked /> 通知バッジを表示
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Switch /> 既読を相手に通知
                    </label>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </Section>

          <Section title="Sheet" desc="画面端からスライドするサイドドロワー">
            <div className="flex gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <MenuIcon />
                    右から開く
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>サイド設定</SheetTitle>
                    <SheetDescription>
                      ここに細かい設定 UI を縦に並べられます。
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-3 px-4">
                    <Field label="名前" htmlFor="sh-name">
                      <Input id="sh-name" defaultValue="うちだ" />
                    </Field>
                    <Field label="メール" htmlFor="sh-mail">
                      <Input id="sh-mail" defaultValue="tuchida@milize.co.jp" />
                    </Field>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button variant="outline">閉じる</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">左から開く</Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>メニュー</SheetTitle>
                    <SheetDescription>
                      モバイル等で使うナビゲーションパネル
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </div>
          </Section>

          <Section title="DropdownMenu" desc="ボタンに紐づくメニュー">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  アカウント
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>うちださん</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <UserIcon />
                    プロフィール
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SettingsIcon />
                    設定
                    <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <LogOutIcon />
                  ログアウト
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Section>

          <Section title="Command" desc="検索可能なコマンドパレット（インライン）">
            <Command className="rounded-lg border border-stroke-default">
              <CommandInput placeholder="コマンドを入力 or 検索..." />
              <CommandList>
                <CommandEmpty>結果がありません。</CommandEmpty>
                <CommandGroup heading="提案">
                  <CommandItem>
                    <UserIcon />
                    プロフィールを開く
                    <CommandShortcut>⇧⌘P</CommandShortcut>
                  </CommandItem>
                  <CommandItem>
                    <SettingsIcon />
                    設定を開く
                    <CommandShortcut>⌘,</CommandShortcut>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="アクション">
                  <CommandItem>新しいプロジェクト</CommandItem>
                  <CommandItem>新しいタスク</CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </Section>
        </div>
  );
}

// ----------------- helpers -----------------

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-h6 font-semibold tracking-tight">{title}</h2>
        {desc ? <p className="text-fg-muted text-caption">{desc}</p> : null}
      </div>
      <div className="rounded-lg border border-stroke-default bg-card p-6 shadow-xs">
        <div className="space-y-6">{children}</div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  hintTone = "muted",
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  hintTone?: "muted" | "danger";
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? (
        <p
          className={
            hintTone === "danger"
              ? "text-fg-error text-caption"
              : "text-fg-muted text-caption"
          }
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
