"use client";

import * as React from "react";
import {
  Home as HomeIcon,
  FileText,
  Users,
  Settings as SettingsIcon,
  Bell,
  Search,
  Wifi,
  Signal,
  BatteryFull,
  Info,
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Plus,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

/**
 * iPhone 内に描画する「XXX Portal」モバイルモック。
 *
 * uploads/MILIZE UIUX Design System (Bundle).zip のソース (App / Sidebar / TopBar /
 * Dashboard / Contracts / ContractDetail / Settings) を 375×812 のモバイル
 * 縦画面に向けて再構成。テキスト・KPI 値・契約レコード・通知文・色トークンは
 * 元コードと td-tokens.css を一次ソースとし、そのまま採用しています。
 *
 * 色トークン (td-tokens.css 由来 — テナント差し替えポイント):
 *   --primary-color-500 #0f766e  ブランド/Primary ボタン/Active nav
 *   --secondary-color-500    #0891b2  Info / リンク / セカンダリ
 *   --button-color-500         #d97706  申込/前進 CTA (positive forward action)
 *   --warm-50             #fafaf9  featured / premium surface
 *
 * dark mode 時は portal.css に従い sidebar / bottom-nav を無彩色 #222 系、
 * その他は zinc に寄せる。アプリ全体の ThemeToggle に追従するよう
 * `dark:` Tailwind variant で各クラスを切替。
 */

/* =================================================================
 * 共通: コンタクト / 型定義
 * ================================================================= */

type Status = "active" | "pending" | "trial" | "suspended" | "completed";

type Contract = {
  id: string;
  customer: string;
  plan: string;
  premium: string;
  status: Status;
  updated: string;
};

const CONTRACTS: Contract[] = [
  { id: "C-2406-001", customer: "株式会社サンプル商事", plan: "保険A", premium: "¥48,200", status: "active", updated: "2026/05/18" },
  { id: "C-2406-002", customer: "ABC コーポレーション", plan: "保険B", premium: "¥62,500", status: "pending", updated: "2026/05/17" },
  { id: "C-2406-003", customer: "山田 太郎", plan: "保険A", premium: "¥31,800", status: "active", updated: "2026/05/15" },
  { id: "C-2406-004", customer: "株式会社グリーン", plan: "保険C", premium: "¥124,000", status: "active", updated: "2026/05/14" },
  { id: "C-2405-198", customer: "佐藤 翔太", plan: "保険A", premium: "¥28,400", status: "trial", updated: "2026/05/10" },
  { id: "C-2405-187", customer: "鈴木 結衣", plan: "保険B", premium: "¥56,800", status: "active", updated: "2026/05/09" },
  { id: "C-2405-176", customer: "東京物流株式会社", plan: "保険C", premium: "¥218,500", status: "active", updated: "2026/05/06" },
  { id: "C-2405-145", customer: "高橋 健", plan: "保険A", premium: "¥31,200", status: "suspended", updated: "2026/05/02" },
  { id: "C-2404-201", customer: "田中 美咲", plan: "保険B", premium: "¥58,900", status: "completed", updated: "2026/04/28" },
];

type Page =
  | { name: "dashboard" }
  | { name: "contracts" }
  | { name: "detail"; contract: Contract }
  | { name: "settings" };

/* =================================================================
 * ルートコンポーネント
 * ================================================================= */

export function TdPortalMock() {
  const [page, setPage] = React.useState<Page>({ name: "dashboard" });

  const navHome = () => setPage({ name: "dashboard" });
  const navContracts = () => setPage({ name: "contracts" });
  const navSettings = () => setPage({ name: "settings" });
  const openContract = (c: Contract) => setPage({ name: "detail", contract: c });

  return (
    <div
      className="
        flex h-full flex-col
        bg-[#f9fafc] text-[#0f172a]
        dark:bg-zinc-950 dark:text-zinc-100
        transition-colors duration-300
      "
    >
      <PhoneStatusBar />
      <TopAppBar page={page} />

      <main className="flex-1 overflow-y-auto pb-24">
        {page.name === "dashboard" && <DashboardScreen onOpen={openContract} />}
        {page.name === "contracts" && <ContractsScreen onOpen={openContract} />}
        {page.name === "detail" && (
          <ContractDetailScreen
            contract={page.contract}
            onBack={() => setPage({ name: "contracts" })}
          />
        )}
        {page.name === "settings" && <SettingsScreen />}
      </main>

      <BottomNav
        active={page.name === "detail" ? "contracts" : page.name}
        onHome={navHome}
        onContracts={navContracts}
        onSettings={navSettings}
      />
    </div>
  );
}

/* =================================================================
 * Status bar / TopBar / BottomNav
 * ================================================================= */

function PhoneStatusBar() {
  return (
    <div className="flex items-center justify-between px-7 pt-3 text-[11px] font-semibold text-[#0f172a] dark:text-zinc-100">
      <span className="tabular-nums">9:41</span>
      <span className="w-[110px]" aria-hidden />
      <span className="flex items-center gap-1">
        <Signal className="size-3" />
        <Wifi className="size-3" />
        <BatteryFull className="size-3.5" />
      </span>
    </div>
  );
}

function TopAppBar({ page }: { page: Page }) {
  const title =
    page.name === "dashboard"
      ? "ダッシュボード"
      : page.name === "contracts"
        ? "契約一覧"
        : page.name === "detail"
          ? page.contract.customer
          : "設定";

  return (
    <header
      className="
        sticky top-0 z-10
        border-b border-[#e0e4ec]
        bg-[#0f766e] text-white
        dark:bg-[#134e4a] dark:border-zinc-800
        px-4 pt-3 pb-3
        transition-colors duration-300
      "
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-md bg-white/10 text-[11px] font-bold tracking-tight">
            XXX
          </span>
          <div className="leading-tight">
            <p className="text-[10px] text-white/60">
              XXXフィナンシャル生命
            </p>
            <p className="text-[13px] font-semibold">{title}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="通知"
            className="relative grid size-8 place-items-center rounded-md hover:bg-white/10"
          >
            <Bell className="size-4" />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#d97706] ring-2 ring-[#0f766e] dark:ring-[#134e4a]" />
          </button>
          <span className="grid size-8 place-items-center rounded-full bg-white/15 text-[11px] font-semibold">
            U
          </span>
        </div>
      </div>
    </header>
  );
}

function BottomNav({
  active,
  onHome,
  onContracts,
  onSettings,
}: {
  active: "dashboard" | "contracts" | "settings";
  onHome: () => void;
  onContracts: () => void;
  onSettings: () => void;
}) {
  const items: {
    id: "dashboard" | "contracts" | "customers" | "settings";
    label: string;
    Icon: typeof HomeIcon;
    onClick?: () => void;
  }[] = [
    { id: "dashboard", label: "ホーム", Icon: HomeIcon, onClick: onHome },
    { id: "contracts", label: "契約", Icon: FileText, onClick: onContracts },
    { id: "customers", label: "顧客", Icon: Users },
    { id: "settings", label: "設定", Icon: SettingsIcon, onClick: onSettings },
  ];
  return (
    <div className="absolute inset-x-0 bottom-0 border-t border-[#e0e4ec] bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95 transition-colors duration-300">
      <nav className="grid grid-cols-4 px-2 pb-5 pt-2 text-[10px]">
        {items.map(({ id, label, Icon, onClick }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              type="button"
              onClick={onClick}
              className={`flex flex-col items-center gap-0.5 rounded-md py-1 transition-colors ${
                isActive
                  ? "text-[#0f766e] dark:text-white"
                  : "text-[#6b7280] dark:text-zinc-500"
              }`}
            >
              <Icon className="size-5" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/* =================================================================
 * Dashboard
 * ================================================================= */

function DashboardScreen({
  onOpen,
}: {
  onOpen: (c: Contract) => void;
}) {
  const bars = [38, 52, 47, 68, 75, 61, 58, 72, 84, 91, 78, 95];
  const max = Math.max(...bars);
  const xLabels = ["6月", "7月", "8月", "9月", "10月", "11月", "12月", "1月", "2月", "3月", "4月", "5月"];

  return (
    <div className="space-y-3 px-3 py-3">
      <p className="px-1 text-[11px] text-[#6b7280] dark:text-zinc-400">
        2026 年 5 月のサマリー · 最終更新 5 月 22 日 09:14
      </p>

      <InfoAlert
        variant="info"
        title="システムメンテナンスのお知らせ"
        body="5 月 25 日 02:00〜04:00 に定期メンテナンスを実施します。サービス停止を伴います。"
      />

      {/* KPI 2x2 */}
      <div className="grid grid-cols-2 gap-2">
        <Kpi label="アクティブ契約" value="248" unit="件" delta="+12 件" up />
        <Kpi label="今月の保険料収入" value="¥8.42M" delta="+12.3%" up />
        <Kpi label="保留中の申込" value="14" unit="件" delta="-3 件" up={false} />
        <Kpi label="達成率" value="87.4" unit="%" delta="+5.2pt" up />
      </div>

      {/* 月次保険料推移 */}
      <PortalCard
        title="月次保険料推移"
        sub="過去 12 ヶ月 · 単位: 百万円"
        right={
          <div className="flex gap-1">
            <PillTab active>12 ヶ月</PillTab>
            <PillTab>6 ヶ月</PillTab>
          </div>
        }
      >
        <div className="px-3 pb-3">
          <div className="flex h-24 items-end gap-[3px]">
            {bars.map((v, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-sm ${
                  i === bars.length - 1
                    ? "bg-[#d97706]"
                    : "bg-[#0f766e] dark:bg-[#2dd4bf]"
                }`}
                style={{ height: `${(v / max) * 100}%` }}
              />
            ))}
          </div>
          <div className="mt-1.5 flex justify-between text-[9px] text-[#94a3b8] dark:text-zinc-500">
            {xLabels.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </PortalCard>

      {/* 最近の更新 */}
      <PortalCard title="最近の更新" sub="直近 24 時間">
        <div className="divide-y divide-[#ebeef4] dark:divide-zinc-800">
          <FeedItem
            kind="success"
            title="新規契約が成立しました"
            meta="C-2406-001 · 株式会社サンプル商事 · 2 時間前"
          />
          <FeedItem
            kind="warning"
            title="支払い期限が近づいています"
            meta="C-2405-119 · 3 件 · 5 時間前"
          />
          <FeedItem
            kind="info"
            title="プランの料率が更新されました"
            meta="保険B · システム · 昨日"
          />
          <FeedItem
            kind="success"
            title="月次レポートを生成しました"
            meta="2026 年 4 月分 · 昨日"
          />
        </div>
      </PortalCard>

      {/* 直近の契約 (リスト) */}
      <PortalCard title="直近の契約" sub="タップで詳細へ">
        <ul className="divide-y divide-[#ebeef4] dark:divide-zinc-800">
          {CONTRACTS.slice(0, 4).map((c) => (
            <ContractRow key={c.id} contract={c} onOpen={onOpen} />
          ))}
        </ul>
      </PortalCard>

      {/* CTA */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <PortalButton variant="outline">
          <Download className="size-3.5" />
          エクスポート
        </PortalButton>
        <PortalButton variant="cta">
          <Plus className="size-3.5" />
          新規契約
        </PortalButton>
      </div>
    </div>
  );
}

/* =================================================================
 * Contracts
 * ================================================================= */

function ContractsScreen({ onOpen }: { onOpen: (c: Contract) => void }) {
  const [filter, setFilter] = React.useState<"all" | Status>("all");
  const [query, setQuery] = React.useState("");

  const filtered = CONTRACTS.filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    if (
      query &&
      !r.customer.includes(query) &&
      !r.id.toLowerCase().includes(query.toLowerCase())
    )
      return false;
    return true;
  });

  const tabs: { id: "all" | Status; label: string }[] = [
    { id: "all", label: `全て (${CONTRACTS.length})` },
    { id: "active", label: `有効 (${CONTRACTS.filter((r) => r.status === "active").length})` },
    { id: "pending", label: `保留 (${CONTRACTS.filter((r) => r.status === "pending").length})` },
    { id: "suspended", label: "停止" },
    { id: "completed", label: "完了" },
  ];

  return (
    <div className="space-y-3 px-3 py-3">
      <p className="px-1 text-[11px] text-[#6b7280] dark:text-zinc-400">
        {CONTRACTS.length} 件の契約 · {filtered.length} 件を表示中
      </p>

      {/* 検索 */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#94a3b8] dark:text-zinc-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="契約番号 / 顧客名で検索…"
          className="
            w-full rounded-[10px] border border-[#e0e4ec] bg-white px-9 py-2 text-[13px]
            text-[#0f172a] placeholder:text-[#a3a8b8]
            focus:outline-none focus:ring-2 focus:ring-[#0f766e]/30
            dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500
            transition-colors duration-300
          "
        />
      </div>

      {/* タブフィルタ */}
      <div className="-mx-3 overflow-x-auto px-3">
        <div className="flex gap-1.5 pb-1">
          {tabs.map((t) => (
            <PillTab
              key={t.id}
              active={filter === t.id}
              onClick={() => setFilter(t.id)}
            >
              {t.label}
            </PillTab>
          ))}
        </div>
      </div>

      {/* リスト */}
      <PortalCard>
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-[12px] text-[#6b7280] dark:text-zinc-400">
            該当する契約がありません
          </div>
        ) : (
          <ul className="divide-y divide-[#ebeef4] dark:divide-zinc-800">
            {filtered.map((c) => (
              <ContractRow key={c.id} contract={c} onOpen={onOpen} />
            ))}
          </ul>
        )}
      </PortalCard>

      {/* ページネーション */}
      <div className="flex items-center justify-between rounded-[12px] border border-[#e0e4ec] bg-white px-3 py-2 text-[11px] text-[#6b7280] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <span>
          1 〜 {filtered.length} 件 / 全 {CONTRACTS.length} 件
        </span>
        <div className="flex items-center gap-1">
          <PageButton>‹</PageButton>
          <PageButton active>1</PageButton>
          <PageButton>2</PageButton>
          <PageButton>›</PageButton>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1">
        <PortalButton variant="outline">
          <Filter className="size-3.5" />
          フィルタ
        </PortalButton>
        <PortalButton variant="outline">
          <Download className="size-3.5" />
          CSV
        </PortalButton>
        <PortalButton variant="cta">
          <Plus className="size-3.5" />
          新規
        </PortalButton>
      </div>
    </div>
  );
}

/* =================================================================
 * Contract detail
 * ================================================================= */

function ContractDetailScreen({
  contract,
  onBack,
}: {
  contract: Contract;
  onBack: () => void;
}) {
  return (
    <div className="space-y-3 px-3 py-3">
      <button
        type="button"
        onClick={onBack}
        className="
          inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px]
          text-[#0f766e] hover:bg-[#0f766e]/10
          dark:text-zinc-200 dark:hover:bg-white/10
        "
      >
        <ChevronLeft className="size-3.5" />
        契約一覧に戻る
      </button>

      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-[16px] font-semibold leading-tight">
          {contract.customer}
        </h2>
        <StatusPill status={contract.status} />
      </div>
      <p className="text-[11px] text-[#6b7280] dark:text-zinc-400">
        契約番号 <span className="font-mono">{contract.id}</span> · 最終更新{" "}
        {contract.updated}
      </p>

      <InfoAlert
        variant="warning"
        title="次回支払い: 2026 年 6 月 1 日"
        body={`口座振替で ${contract.premium} が引き落とされます。残高をご確認ください。`}
      />

      {/* 契約情報フォーム */}
      <PortalCard title="契約情報">
        <div className="grid gap-3 p-3">
          <Field label="契約番号" value={contract.id} disabled />
          <Field label="契約日" defaultValue="2024-06-12" />
          <Field label="顧客名" defaultValue={contract.customer} />
          <Field label="担当者" defaultValue="うちだ" />
          <Field label="プラン" defaultValue={contract.plan} />
          <Field label="月額保険料" defaultValue={contract.premium} />
          <div>
            <label className="block text-[11px] font-medium text-[#475569] dark:text-zinc-300">
              備考
            </label>
            <textarea
              defaultValue="長期取引先。プラン変更の打診あり (5 月 18 日)。"
              className="
                mt-1 h-16 w-full resize-none rounded-[10px] border border-[#e0e4ec]
                bg-white px-2.5 py-2 text-[12px] leading-relaxed text-[#0f172a]
                focus:outline-none focus:ring-2 focus:ring-[#0f766e]/30
                dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100
                transition-colors duration-300
              "
            />
          </div>
        </div>
      </PortalCard>

      {/* 支払い履歴 */}
      <PortalCard title="支払い履歴" sub="直近 6 件">
        <ul className="divide-y divide-[#ebeef4] dark:divide-zinc-800">
          {[
            { d: "2026/05/01", a: "¥48,200" },
            { d: "2026/04/01", a: "¥48,200" },
            { d: "2026/03/01", a: "¥48,200" },
            { d: "2026/02/01", a: "¥48,200" },
            { d: "2026/01/01", a: "¥48,200" },
            { d: "2025/12/01", a: "¥48,200" },
          ].map((p) => (
            <li
              key={p.d}
              className="flex items-center justify-between px-3 py-2 text-[12px]"
            >
              <span className="text-[#6b7280] dark:text-zinc-400">{p.d}</span>
              <span className="tabular-nums font-medium">{p.a}</span>
              <span className="inline-flex items-center rounded-full bg-[#e7f6ec] px-2 py-0.5 text-[10px] font-medium text-[#0f8a36] dark:bg-[#0f8a36]/20 dark:text-[#7be096]">
                完了
              </span>
            </li>
          ))}
        </ul>
      </PortalCard>

      {/* CTA */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <PortalButton variant="outline">解約申請</PortalButton>
        <PortalButton variant="primary">変更を保存</PortalButton>
      </div>
    </div>
  );
}

/* =================================================================
 * Settings
 * ================================================================= */

function SettingsScreen() {
  return (
    <div className="space-y-3 px-3 py-3">
      <p className="px-1 text-[11px] text-[#6b7280] dark:text-zinc-400">
        アカウントと通知の設定を管理します
      </p>

      <PortalCard title="アカウント情報" sub="管理者本人の情報">
        <div className="grid gap-3 p-3">
          <Field label="氏名" defaultValue="うちだ" />
          <Field label="メールアドレス" defaultValue="tuchida@milize.co.jp" />
          <Field label="所属" defaultValue="営業企画部" />
          <Field label="役職" defaultValue="マネージャー" />
        </div>
      </PortalCard>

      <PortalCard title="通知設定">
        <div className="px-3 py-1">
          <SwitchRow
            label="新規契約の通知"
            desc="新しい契約が成立した際にメールで通知"
            defaultChecked
          />
          <SwitchRow
            label="支払い期限のリマインダー"
            desc="支払い期限の 3 日前にリマインダーを送信"
            defaultChecked
          />
          <SwitchRow
            label="月次レポート"
            desc="毎月 1 日にレポートをメール送信"
          />
          <SwitchRow
            label="システムメンテナンス"
            desc="メンテナンス予定の通知"
            defaultChecked
            last
          />
        </div>
      </PortalCard>

      <PortalCard title="危険な操作">
        <div className="space-y-3 p-3">
          <InfoAlert
            variant="info"
            title="アカウント削除"
            body="アカウントを削除すると、契約情報の閲覧権限が失われます。再発行には管理者承認が必要です。"
          />
          <div className="flex justify-end">
            <PortalButton variant="destructive">アカウントを削除</PortalButton>
          </div>
        </div>
      </PortalCard>
    </div>
  );
}

/* =================================================================
 * 共通サブコンポーネント
 * ================================================================= */

function Kpi({
  label,
  value,
  unit,
  delta,
  up,
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  up: boolean;
}) {
  return (
    <div className="rounded-[14px] border border-[#e0e4ec] bg-white p-3 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-[10px] font-medium text-[#6b7280] dark:text-zinc-400">
        {label}
      </p>
      <p className="mt-1 flex items-baseline gap-0.5 tabular-nums">
        <span className="text-[20px] font-semibold tracking-tight">{value}</span>
        {unit ? (
          <span className="text-[10px] text-[#6b7280] dark:text-zinc-400">
            {unit}
          </span>
        ) : null}
      </p>
      {delta ? (
        <p
          className={`mt-1 inline-flex items-center gap-0.5 text-[10px] font-medium ${
            up
              ? "text-[#0f8a36] dark:text-[#7be096]"
              : "text-[#d97706] dark:text-[#ea7077]"
          }`}
        >
          {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
          {delta}
        </p>
      ) : null}
    </div>
  );
}

function PortalCard({
  title,
  sub,
  right,
  children,
}: {
  title?: string;
  sub?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[14px] border border-[#e0e4ec] bg-white transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900">
      {title ? (
        <header className="flex items-start justify-between gap-2 border-b border-[#ebeef4] px-3 py-2 dark:border-zinc-800">
          <div>
            <p className="text-[12px] font-semibold">{title}</p>
            {sub ? (
              <p className="text-[10px] text-[#6b7280] dark:text-zinc-400">
                {sub}
              </p>
            ) : null}
          </div>
          {right}
        </header>
      ) : null}
      {children}
    </section>
  );
}

function FeedItem({
  kind,
  title,
  meta,
}: {
  kind: "success" | "warning" | "info";
  title: string;
  meta: string;
}) {
  const tone =
    kind === "success"
      ? "bg-[#e7f6ec] text-[#0f8a36] dark:bg-[#0f8a36]/20 dark:text-[#7be096]"
      : kind === "warning"
        ? "bg-[#fff5e0] text-[#b06d00] dark:bg-[#f0a818]/20 dark:text-[#f0c674]"
        : "bg-[#eff5ff] text-[#0891b2] dark:bg-[#0891b2]/20 dark:text-[#9abae7]";
  const Icon = kind === "success" ? Check : kind === "warning" ? AlertTriangle : Info;
  return (
    <div className="flex items-start gap-2 px-3 py-2">
      <span className={`grid size-6 shrink-0 place-items-center rounded-full ${tone}`}>
        <Icon className="size-3" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-medium leading-snug">{title}</p>
        <p className="text-[10px] text-[#6b7280] dark:text-zinc-400">{meta}</p>
      </div>
    </div>
  );
}

function ContractRow({
  contract,
  onOpen,
}: {
  contract: Contract;
  onOpen: (c: Contract) => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(contract)}
        className="
          flex w-full items-center gap-2 px-3 py-2 text-left
          hover:bg-[#f3f5f8] dark:hover:bg-zinc-800
          transition-colors duration-150
        "
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[12px] font-medium">{contract.customer}</p>
          </div>
          <p className="mt-0.5 text-[10px] text-[#6b7280] dark:text-zinc-400">
            <span className="font-mono">{contract.id}</span> · {contract.plan} ·{" "}
            {contract.updated}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[12px] font-semibold tabular-nums">
            {contract.premium}
          </span>
          <StatusPill status={contract.status} />
        </div>
        <ChevronRight className="size-3.5 text-[#94a3b8] dark:text-zinc-500" />
      </button>
    </li>
  );
}

const STATUS_LABEL: Record<Status, string> = {
  active: "有効",
  pending: "保留",
  trial: "試用",
  suspended: "停止",
  completed: "完了",
};

function StatusPill({ status }: { status: Status }) {
  const cls: Record<Status, string> = {
    active:
      "bg-[#e7f6ec] text-[#0f8a36] dark:bg-[#0f8a36]/20 dark:text-[#7be096]",
    pending:
      "bg-[#fff5e0] text-[#b06d00] dark:bg-[#f0a818]/20 dark:text-[#f0c674]",
    trial:
      "bg-[#eff5ff] text-[#0891b2] dark:bg-[#0891b2]/20 dark:text-[#9abae7]",
    suspended:
      "bg-[#fdebec] text-[#d97706] dark:bg-[#d97706]/20 dark:text-[#ea7077]",
    completed:
      "bg-[#eef0f6] text-[#0f766e] dark:bg-[#0f766e]/30 dark:text-[#b3bbcd]",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium ${cls[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function PillTab({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors duration-150 ${
        active
          ? "border-[#0f766e] bg-[#0f766e] text-white dark:border-[#2dd4bf] dark:bg-[#2dd4bf]"
          : "border-[#e0e4ec] bg-white text-[#475569] hover:bg-[#f3f5f8] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
      }`}
    >
      {children}
    </button>
  );
}

function PageButton({
  active,
  children,
}: {
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`grid size-6 place-items-center rounded text-[11px] ${
        active
          ? "bg-[#0f766e] text-white dark:bg-[#2dd4bf]"
          : "text-[#475569] hover:bg-[#f3f5f8] dark:text-zinc-400 dark:hover:bg-zinc-800"
      }`}
    >
      {children}
    </button>
  );
}

function InfoAlert({
  variant,
  title,
  body,
}: {
  variant: "info" | "warning" | "success" | "danger";
  title: string;
  body: string;
}) {
  const tone =
    variant === "info"
      ? "border-[#dde9fb] bg-[#eff5ff] text-[#0f766e] dark:border-[#0891b2]/40 dark:bg-[#0891b2]/15 dark:text-[#cfddf6]"
      : variant === "warning"
        ? "border-[#f0a818]/30 bg-[#fff5e0] text-[#b06d00] dark:border-[#f0a818]/40 dark:bg-[#f0a818]/15 dark:text-[#f0c674]"
        : variant === "success"
          ? "border-[#cdebd6] bg-[#e7f6ec] text-[#0f8a36] dark:border-[#0f8a36]/40 dark:bg-[#0f8a36]/15 dark:text-[#7be096]"
          : "border-[#fbd0d3] bg-[#fdebec] text-[#d97706] dark:border-[#d97706]/40 dark:bg-[#d97706]/15 dark:text-[#ea7077]";
  const Icon =
    variant === "info" ? Info : variant === "warning" ? AlertTriangle : variant === "success" ? Check : AlertTriangle;
  return (
    <div className={`flex items-start gap-2 rounded-[12px] border px-2.5 py-2 transition-colors duration-300 ${tone}`}>
      <Icon className="mt-0.5 size-3.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] font-semibold leading-tight">{title}</p>
        <p className="mt-0.5 text-[10px] leading-snug opacity-90">{body}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  defaultValue,
  disabled,
}: {
  label: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-[#475569] dark:text-zinc-300">
        {label}
      </label>
      <input
        type="text"
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        readOnly={value !== undefined}
        className={`
          mt-1 w-full rounded-[10px] border px-2.5 py-1.5 text-[12px]
          focus:outline-none focus:ring-2 focus:ring-[#0f766e]/30
          transition-colors duration-300
          ${disabled
            ? "cursor-not-allowed border-[#e0e4ec] bg-[#f3f5f8] text-[#94a3b8] dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-500"
            : "border-[#e0e4ec] bg-white text-[#0f172a] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"}
        `}
      />
    </div>
  );
}

function SwitchRow({
  label,
  desc,
  defaultChecked,
  last,
}: {
  label: string;
  desc: string;
  defaultChecked?: boolean;
  last?: boolean;
}) {
  const [on, setOn] = React.useState(!!defaultChecked);
  return (
    <div
      className={`flex items-start justify-between gap-3 py-2 ${
        last ? "" : "border-b border-[#ebeef4] dark:border-zinc-800"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-medium">{label}</p>
        <p className="text-[10px] text-[#6b7280] dark:text-zinc-400">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn((v) => !v)}
        className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${
          on
            ? "bg-[#0f766e] dark:bg-[#2dd4bf]"
            : "bg-[#c9d0dd] dark:bg-zinc-700"
        }`}
      >
        <span
          className={`inline-block size-4 rounded-full bg-white shadow transition-transform duration-200 ${
            on ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

/* ---- ボタン -----------------------------------------------------
 * cta:         #d97706 申込/前進 (positive forward action) — 1 画面 1 つまで
 * primary:     #0f766e 通常の確定
 * outline:     白 + ボーダー (サブ操作)
 * destructive: 削除 (small サイズ限定)
 * ---------------------------------------------------------------- */
function PortalButton({
  variant,
  children,
}: {
  variant: "cta" | "primary" | "outline" | "destructive";
  children: React.ReactNode;
}) {
  const base =
    "inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-[10px] text-[12px] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const variantCls =
    variant === "cta"
      ? "bg-[#d97706] text-white shadow-[0_8px_20px_-8px_rgba(217, 119, 6, 0.5)] hover:bg-[#b45309] focus-visible:ring-[#d97706]/40"
      : variant === "primary"
        ? "bg-[#0f766e] text-white hover:bg-[#115e59] focus-visible:ring-[#0f766e]/40 dark:bg-[#2dd4bf] dark:hover:bg-[#0891b2]"
        : variant === "outline"
          ? "border border-[#c9d0dd] bg-white text-[#0f172a] hover:bg-[#f9fafc] focus-visible:ring-[#0f766e]/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          : "bg-[#d97706] text-white hover:bg-[#b45309] focus-visible:ring-[#d97706]/40 dark:bg-[#b04545]";
  return <button type="button" className={`${base} ${variantCls}`}>{children}</button>;
}

/* =================================================================
 * Canvas (俯瞰) 用: 単一画面を非インタラクティブに描画
 *
 * /acme/windows で iPhone フレーム × 4 を 2×2 に並べる際に使用。
 * インタラクション (onOpen / onBack / onNav) は no-op にし、
 * 見た目は TdPortalMock と完全一致させて「この画面はどう見えるか?」を
 * 並列比較できるようにする。
 * ================================================================= */
export type TdStaticScreenName = "dashboard" | "contracts" | "detail" | "settings";

export function TdStaticScreen({ page }: { page: TdStaticScreenName }) {
  const pageObj: Page =
    page === "detail"
      ? { name: "detail", contract: CONTRACTS[0] }
      : { name: page };
  const noop = () => {};
  return (
    <div
      className="
        flex h-full flex-col
        bg-[#f9fafc] text-[#0f172a]
        dark:bg-zinc-950 dark:text-zinc-100
        transition-colors duration-300
      "
    >
      <PhoneStatusBar />
      <TopAppBar page={pageObj} />
      <main className="flex-1 overflow-y-auto pb-24">
        {pageObj.name === "dashboard" && <DashboardScreen onOpen={noop} />}
        {pageObj.name === "contracts" && <ContractsScreen onOpen={noop} />}
        {pageObj.name === "detail" && (
          <ContractDetailScreen contract={pageObj.contract} onBack={noop} />
        )}
        {pageObj.name === "settings" && <SettingsScreen />}
      </main>
      <BottomNav
        active={page === "detail" ? "contracts" : page}
        onHome={noop}
        onContracts={noop}
        onSettings={noop}
      />
    </div>
  );
}
