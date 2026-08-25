"use client";

import * as React from "react";
import {
  AppBar, Steps, Badge, Btn, ReqBadge, ErrText,
  Field, DatePicker, LockedField, Select, SegmentedToggle,
  GenderField, AgreeCheckbox, GroupCard, StepSection,
  NumberedSectionHeading, CardHeader, BirthDateGenderBlock,
  NumberedStepCard, IconNoteCard, NoteBox, AttentionNoticeCard,
  ConfirmRow, AddressRow, ConfirmCard,
  SelectedPlanBadge, SliderField, PremiumSimulationCard,
  PlanCard, PlanCardAccordion, PLANS,
  AccordionDropdown, NumberedDisclosureItem,
  StatusIcon, ActionBar,
  Logo, PhoneStatusBar, HomeIndicator,
  AgreeItem, AGREE_ITEMS,
} from "@/components/theo-tdf/claude-design/screens";

const PREFS = ["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
  "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
  "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
  "熊本県","大分県","宮崎県","鹿児島県","沖縄県"];

/* ---- 共通ユーティリティ ---- */
export function CatSection({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <div className="mb-5 border-b-2 border-warm-300 pb-3">
        <h2 className="text-h3 font-semibold tracking-tight">{title}</h2>
        {sub && <p className="mt-1 text-caption text-muted-foreground">{sub}</p>}
      </div>
      {children}
    </section>
  );
}

function PhoneFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <figure className="flex flex-col items-start gap-2 shrink-0" style={{ width: 390 }}>
      <figcaption className="text-h6 font-semibold text-foreground">{label}</figcaption>
      <div className="theo-tdf-cd font-jp rounded-2xl bg-warm-50 overflow-hidden w-full">
        {children}
      </div>
    </figure>
  );
}

export function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-6 items-start">{children}</div>;
}

/* Preview — bg prop で背景切替（デフォルト #EFEFEF） */
export function Preview({ label, children, width = 390, bg = "#EFEFEF" }: {
  label: string;
  children: React.ReactNode;
  width?: number;
  bg?: string;
}) {
  return (
    <figure className="flex flex-col gap-2 shrink-0" style={{ width }}>
      <figcaption className="text-caption font-medium text-muted-foreground">{label}</figcaption>
      <div className="theo-tdf-cd font-jp rounded-xl p-4 border border-warm-200" style={{ background: bg }}>
        {children}
      </div>
    </figure>
  );
}

function AssetCard({ label, children, bg = "bg-white", style }: {
  label: string;
  children: React.ReactNode;
  bg?: string;
  style?: React.CSSProperties;
}) {
  return (
    <figure className="flex flex-col gap-2 shrink-0">
      <div
        className={`flex items-center justify-center rounded-xl border border-warm-200 ${bg} p-4`}
        style={{ minWidth: 160, minHeight: 80, ...style }}
      >
        {children}
      </div>
      <figcaption className="text-caption text-muted-foreground text-center">{label}</figcaption>
    </figure>
  );
}

export function SubHead({ children }: { children: React.ReactNode }) {
  return <h3 className="text-h5 font-semibold mb-3 mt-10 first:mt-0 text-foreground">{children}</h3>;
}

/* ================================================================
   1. ブランドアセット
   Logo コンポーネント / ロゴ画像 / 背景画像 / AppBar / Phone UI Chrome
================================================================ */
export function BrandSection() {
  const noop = () => {};
  return (
    <div className="theo-tdf-cd font-jp">
      <SubHead>Logo コンポーネント</SubHead>
      <Row>
        {/* variant=default は白地だと見えないので EFEFEF 背景 */}
        <AssetCard label="variant=default" bg="" style={{ background: "#EFEFEF", minWidth: 200, minHeight: 100 }}>
          <Logo variant="default" className="h-14 w-auto" />
        </AssetCard>
        <AssetCard label="variant=blue" style={{ minWidth: 200, minHeight: 100 }}>
          <Logo variant="blue" className="h-14 w-auto" />
        </AssetCard>
      </Row>
      <SubHead>ロゴ 画像ファイル</SubHead>
      <Row>
        <AssetCard label="logo_td.png">
          <img src="/assets/theo-tdf/logo_td.png" alt="" className="h-8 w-auto" />
        </AssetCard>
        <AssetCard label="logo_td_financial.png">
          <img src="/assets/theo-tdf/logo_td_financial.png" alt="" className="h-8 w-auto" />
        </AssetCard>
        <AssetCard label="logo_td_insurance.png">
          <img src="/assets/theo-tdf/logo_td_insurance.png" alt="" className="h-8 w-auto" />
        </AssetCard>
      </Row>
      <SubHead>背景・ヒーロー画像</SubHead>
      <Row>
        {[
          { file: "hero_bg.png", label: "hero_bg.png" },
          { file: "hero_bg_done.png", label: "hero_bg_done.png" },
          { file: "status_bg.png", label: "status_bg.png" },
          { file: "chart_savings.svg", label: "chart_savings.svg（fukidashi）" },
          { file: "chart_savings_area.svg", label: "chart_savings_area.svg（area）" },
          { file: "hero-background.png", label: "hero-background.png（HeroBackground）" },
        ].map(({ file, label }) => (
          <AssetCard key={file} label={label} bg="bg-warm-100">
            <img src={`/assets/theo-tdf/${file}`} alt="" className="h-20 w-auto rounded-lg object-cover" />
          </AssetCard>
        ))}
        {/* hero-notch.svg は EFEFEF 背景（青ではない） */}
        <AssetCard label="hero-notch.svg" bg="" style={{ background: "#EFEFEF" }}>
          <img src="/assets/theo-tdf/hero-notch.svg" alt="" className="h-8 w-auto" />
        </AssetCard>
      </Row>
      <SubHead>AppBar</SubHead>
      <Row>
        <PhoneFrame label="State=Default"><AppBar title="保険" /></PhoneFrame>
        <PhoneFrame label="State=Empty"><AppBar title="お申込み完了" /></PhoneFrame>
      </Row>
      <SubHead>Phone UI Chrome</SubHead>
      <Row>
        <Preview label="PhoneStatusBar" width={390}>
          <div className="rounded-lg overflow-hidden border border-warm-200">
            <PhoneStatusBar />
          </div>
        </Preview>
        <Preview label="HomeIndicator" width={390}>
          <div className="rounded-lg overflow-hidden border border-warm-200">
            <HomeIndicator />
          </div>
        </Preview>
      </Row>
    </div>
  );
}

/* ================================================================
   2. ナビゲーション（Steps + Btn + ActionBar を統合）
================================================================ */
export function NavigationSection() {
  const noop = () => {};
  return (
    <div className="theo-tdf-cd font-jp">
      <SubHead>Steps</SubHead>
      <Row>
        {[1, 2, 3, 4, 5].map((n) => (
          <Preview key={n} label={`n=${n}/5`} width={300} bg="#ffffff">
            <Steps n={n} of={5} go={noop} />
          </Preview>
        ))}
      </Row>
      <SubHead>Btn</SubHead>
      <Row>
        {(["cta", "button", "outline", "ghost", "danger"] as const).map((kind) => (
          <Preview key={kind} label={`kind="${kind}"`} width={220}>
            <div className="flex flex-col gap-3">
              <Btn kind={kind} full={false}>
                {kind === "cta" ? "申込む" : kind === "danger" ? "解約する" : kind === "outline" ? "戻る" : kind === "ghost" ? "スキップ" : "確認する"}
              </Btn>
              <Btn kind={kind} full={false} disabled>
                {kind === "cta" ? "申込む" : kind === "danger" ? "解約する" : kind === "outline" ? "戻る" : kind === "ghost" ? "スキップ" : "確認する"} (disabled)
              </Btn>
            </div>
          </Preview>
        ))}
      </Row>
      <SubHead>ActionBar</SubHead>
      <Row>
        <PhoneFrame label="variant=normal">
          <div className="h-20 bg-warm-50 flex items-center justify-center">
            <span className="text-caption text-neutral-400">コンテンツエリア</span>
          </div>
          <ActionBar><Btn kind="cta">次へ進む</Btn></ActionBar>
        </PhoneFrame>
        <PhoneFrame label="variant=solid（ブルー帯）">
          <div className="h-20 bg-warm-50 flex items-center justify-center">
            <span className="text-caption text-neutral-400">コンテンツエリア</span>
          </div>
          <ActionBar solid>
            <Btn kind="cta">申込む</Btn>
            <Btn kind="ghost" full={false}>キャンセル</Btn>
          </ActionBar>
        </PhoneFrame>
      </Row>
    </div>
  );
}

/* ButtonsSection / ActionSection — 後方互換エイリアス */
export function ButtonsSection() { return <NavigationSection />; }

/* ================================================================
   4. ラベル・バッジ
================================================================ */
export function LabelsSection() {
  return (
    <div className="theo-tdf-cd font-jp">
      <Row>
        <Preview label="Badge — secondary" width={200}>
          <div className="flex gap-2 flex-wrap">
            <Badge tone="secondary">がん保障型</Badge>
            <Badge tone="secondary">死亡保障あり</Badge>
          </div>
        </Preview>
        <Preview label="Badge — primary" width={140}>
          <Badge tone="primary">告知</Badge>
        </Preview>
        <Preview label="Badge — warm" width={140}>
          <Badge tone="warm">選択中</Badge>
        </Preview>
        <Preview label="ReqBadge" width={160}>
          <span className="text-h6 font-medium text-neutral-800">姓<ReqBadge /></span>
        </Preview>
        <Preview label="ErrText" width={280}>
          <ErrText>入力内容を確認してください</ErrText>
        </Preview>
        <Preview label="SelectedPlanBadge" width={280}>
          <SelectedPlanBadge planType="がん保障型" deathCoverage />
        </Preview>
      </Row>
      <SubHead>NoteBox</SubHead>
      <Row>
        <Preview label="NoteBox">
          <NoteBox>本保険は THEO の積立投資と組み合わせた保険商品です。詳細は重要事項説明書をご確認ください。</NoteBox>
        </Preview>
      </Row>
      <SubHead>AttentionNoticeCard</SubHead>
      <Row>
        <Preview label="AttentionNoticeCard"><AttentionNoticeCard /></Preview>
      </Row>
      <SubHead>ConfirmRow / AddressRow / ConfirmCard</SubHead>
      <Row>
        <Preview label="ConfirmRow" width={340}>
          <div>
            <ConfirmRow label="契約プラン">がん保障型　死亡保障あり</ConfirmRow>
            <ConfirmRow label="保障期間">15年</ConfirmRow>
            <ConfirmRow label="積立金額">毎月 10,000円</ConfirmRow>
          </div>
        </Preview>
        <Preview label="AddressRow" width={340}>
          <AddressRow postalCode="100-0001" address="東京都千代田区丸の内１丁目 丸の内ビル10F" />
        </Preview>
        <Preview label="ConfirmCard — Locked" width={370}>
          <ConfirmCard title="積立内容" state="Locked">
            <ConfirmRow label="契約プラン">がん保障型　死亡保障あり</ConfirmRow>
            <ConfirmRow label="保障期間">15年</ConfirmRow>
          </ConfirmCard>
        </Preview>
        <Preview label="ConfirmCard — Editable" width={370}>
          <ConfirmCard title="お客様情報" state="Editable">
            <ConfirmRow label="氏名">山田 太郎</ConfirmRow>
            <AddressRow postalCode="100-0001" address="東京都千代田区丸の内１丁目" />
          </ConfirmCard>
        </Preview>
      </Row>
    </div>
  );
}

/* ================================================================
   5. フォーム入力
================================================================ */
export function FormsSection() {
  const noop = () => {};
  return (
    <div className="theo-tdf-cd font-jp">
      <SubHead>Field — テキスト入力（4状態）</SubHead>
      <Row>
        <Preview label="Default"><Field label="姓" placeholder="山田" required /></Preview>
        <Preview label="Filled"><Field label="姓" placeholder="山田" required value="山田" /></Preview>
        <Preview label="Error"><Field label="姓" placeholder="山田" required error="姓を入力してください" errMode="inline" /></Preview>
        <Preview label="Disabled"><Field label="生年月日" value="1990 / 01 / 01" disabled /></Preview>
      </Row>
      <SubHead>DatePicker — 日付入力（2状態）</SubHead>
      <Row>
        <Preview label="Default"><DatePicker label="生年月日" required /></Preview>
        <Preview label="Error"><DatePicker label="生年月日" required error="生年月日を選択してください" errMode="inline" /></Preview>
      </Row>
      <SubHead>LockedField — 読み取り専用</SubHead>
      <Row>
        <Preview label="生年月日"><LockedField label="生年月日" value="1990 / 01 / 01" /></Preview>
        <Preview label="性別"><LockedField label="性別" value="男性" /></Preview>
      </Row>
      <SubHead>Select — セレクトボックス（3状態）</SubHead>
      <Row>
        <Preview label="Default"><Select label="都道府県" required options={PREFS} /></Preview>
        <Preview label="Error"><Select label="都道府県" required options={PREFS} error="都道府県を選択してください" errMode="inline" /></Preview>
        <Preview label="Disabled"><Select label="都道府県" options={PREFS} disabled /></Preview>
      </Row>
      <SubHead>SegmentedToggle</SubHead>
      <Row>
        <Preview label="通常" width={300}><SegmentedToggle options={["男性","女性"]} value="男性" onChange={noop} /></Preview>
        <Preview label="エラー" width={300}><SegmentedToggle options={["男性","女性"]} value="" onChange={noop} error /></Preview>
      </Row>
      <SubHead>GenderField</SubHead>
      <Row>
        <Preview label="通常" width={300}><GenderField value="男性" onChange={noop} required /></Preview>
        <Preview label="エラー" width={300}><GenderField value="" onChange={noop} required error /></Preview>
      </Row>
      <SubHead>AgreeCheckbox</SubHead>
      <Row>
        <Preview label="未チェック">
          <AgreeCheckbox checked={false} onChange={() => {}}>上記の事前同意事項を確認し、同意します</AgreeCheckbox>
        </Preview>
        <Preview label="チェック済">
          <AgreeCheckbox checked={true} onChange={() => {}}>上記の事前同意事項を確認し、同意します</AgreeCheckbox>
        </Preview>
      </Row>
      <SubHead>BirthDateGenderBlock</SubHead>
      <Row>
        <Preview label="BirthDateGenderBlock"><BirthDateGenderBlock /></Preview>
      </Row>
    </div>
  );
}

/* ================================================================
   6. セクション（旧：セクション・カード）
   NumberedSectionHeading / CardHeader / StepSection のみ
================================================================ */
export function CardsSection() {
  const noop = () => {};
  return (
    <div className="theo-tdf-cd font-jp">
      <SubHead>NumberedSectionHeading</SubHead>
      <Row>
        {[1, 2, 3].map((n) => (
          <Preview key={n} label={`n=${n}`} width={280}>
            <NumberedSectionHeading n={n}>
              {n === 1 ? "プランを選ぶ" : n === 2 ? "お客様情報" : "申込内容の確認"}
            </NumberedSectionHeading>
          </Preview>
        ))}
      </Row>
      <SubHead>CardHeader（4状態）</SubHead>
      <Row>
        {(["Plain","Locked","Editable","Editing"] as const).map((state) => (
          <Preview key={state} label={`state=${state}`} width={300}>
            <CardHeader title="積立内容" state={state} />
          </Preview>
        ))}
      </Row>
      <SubHead>StepSection</SubHead>
      <Row>
        <Preview label="Compact（n=1）">
          <StepSection label="メールアドレス" n={1}>
            <Field label="メールアドレス" placeholder="example@email.com" required />
          </StepSection>
        </Preview>
        <Preview label="Big（n=2）">
          <StepSection label="保険料シミュレーション" n={2} big>
            <p className="text-caption text-neutral-500">コンテンツエリア</p>
          </StepSection>
        </Preview>
      </Row>
    </div>
  );
}

/* ================================================================
   7. カード・プラン選択（旧：プラン選択）
   GroupCard / BirthDateGenderBlock / NumberedStepCard / IconNoteCard /
   NoteBox / AttentionNoticeCard / ConfirmRow / AddressRow / ConfirmCard +
   PremiumSimulationCard / SliderField / PlanCard / PlanCardAccordion
================================================================ */
export function PlanSection() {
  const [m, setM] = React.useState(10000);
  const [y, setY] = React.useState(15);
  const [planSel, setPlanSel] = React.useState("");
  const [accordionOpen, setAccordionOpen] = React.useState<Record<string, boolean>>({});
  return (
    <div className="theo-tdf-cd font-jp">
      {/* ── 旧 CardsSection から移動 ── */}
      <SubHead>GroupCard</SubHead>
      <Row>
        <Preview label="契約者情報">
          <GroupCard title="契約者情報" sub="ご契約者ご本人さまの情報" iconSrc="/assets/theo-tdf/person-heart.svg">
            <Field label="姓" placeholder="山田" required />
            <Field label="名" placeholder="太郎" required />
            <LockedField label="生年月日" value="1990 / 01 / 01" />
          </GroupCard>
        </Preview>
      </Row>
      <SubHead>NumberedStepCard</SubHead>
      <Row>
        <Preview label="NumberedStepCard">
          <NumberedStepCard
            heading="HOW IT WORKS"
            steps={[
              { title: "プランを選ぶ", desc: "ご希望の積立金額と保障期間を設定します。" },
              { title: "告知に回答する", desc: "健康状態について簡単な質問にお答えください。" },
              { title: "お申込み完了", desc: "内容を確認してお申込みを完了します。" },
            ]}
          />
        </Preview>
      </Row>
      <SubHead>IconNoteCard</SubHead>
      <Row>
        <Preview label="IconNoteCard">
          <IconNoteCard iconSrc="/assets/theo-tdf/person-heart.svg">
            ご契約者さまの情報をご確認ください。変更がある場合はTHEOアプリよりご連絡ください。
          </IconNoteCard>
        </Preview>
      </Row>
      {/* ── プラン選択コンポーネント ── */}
      <SubHead>PremiumSimulationCard（インタラクティブ）</SubHead>
      <Preview label="PremiumSimulationCard" width={390} bg="#ffffff">
        <PremiumSimulationCard m={m} setM={setM} y={y} setY={setY} planType="がん保障型" deathCoverage />
      </Preview>
      <SubHead>SliderField</SubHead>
      <Row>
        <Preview label="積立金額" width={390} bg="#ffffff">
          <SliderField label="毎月の積立金額" value={m} min={5000} max={150000} step={1000} onChange={setM}
            formatValue={(v) => `${v.toLocaleString()}円`} minLabel="5,000円" maxLabel="150,000円" />
        </Preview>
        <Preview label="保障期間" width={390} bg="#ffffff">
          <SliderField label="保障期間" value={y} min={5} max={30} step={1} onChange={setY}
            formatValue={(v) => `${v}年`} minLabel="5年" maxLabel="30年" />
        </Preview>
      </Row>
      <SubHead>PlanCard</SubHead>
      <Row>
        {PLANS.slice(0, 3).map((p) => {
          const id = p.id + "_d";
          return (
            <Preview key={id} label={p.name}>
              <PlanCard
                p={{ ...p, id, name: p.name + "　死亡保障あり", death: true }}
                selected={planSel === id}
                onSelect={() => setPlanSel((prev) => (prev === id ? "" : id))}
                initialTtOpen={false}
              />
            </Preview>
          );
        })}
      </Row>
      <SubHead>PlanCardAccordion</SubHead>
      <div className="flex flex-col gap-3" style={{ maxWidth: 390 }}>
        {PLANS.slice(0, 3).map((p) => {
          const id = p.id + "_d";
          return (
            <PlanCardAccordion
              key={id}
              p={{ ...p, id, name: p.name + "　死亡保障あり", death: true }}
              selected={planSel === id}
              onSelect={() => setPlanSel((prev) => (prev === id ? "" : id))}
              open={!!accordionOpen[id]}
              onToggle={() => setAccordionOpen((prev) => ({ ...prev, [id]: !prev[id] }))}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================
   8. 開示・折り畳み
================================================================ */
export function DisclosureSection() {
  const noop = () => {};
  const [disclosureOpen, setDisclosureOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [agreeOpen, setAgreeOpen] = React.useState(false);
  const [agreeChecked, setAgreeChecked] = React.useState(false);
  return (
    <div className="theo-tdf-cd font-jp">
      <SubHead>AccordionDropdown</SubHead>
      <Row>
        <Preview label="Closed" width={390}>
          <AccordionDropdown title="クレジットカードのお支払いについて" open={false} onToggle={noop} />
        </Preview>
        <Preview label="Open" width={390}>
          <AccordionDropdown title="クレジットカードのお支払いについて" open={true} onToggle={noop}>
            クレジットカード払いに関する詳細内容がここに表示されます。
          </AccordionDropdown>
        </Preview>
        <Preview label="インタラクティブ" width={390}>
          <AccordionDropdown title="クレジットカードのお支払いについて"
            open={dropdownOpen} onToggle={() => setDropdownOpen(!dropdownOpen)}>
            クレジットカード払いに関する詳細内容がここに表示されます。
          </AccordionDropdown>
        </Preview>
      </Row>
      <SubHead>NumberedDisclosureItem</SubHead>
      <Row>
        <Preview label="Closed" width={390}>
          <NumberedDisclosureItem n={1} title="申込に関する注意事項の確認" open={false} onToggle={noop} />
        </Preview>
        <Preview label="Open" width={390}>
          <NumberedDisclosureItem n={1} title="申込に関する注意事項の確認" open={true} onToggle={noop}>
            申込に関する注意事項の詳細内容がここに表示されます。
          </NumberedDisclosureItem>
        </Preview>
        <Preview label="インタラクティブ" width={390}>
          <NumberedDisclosureItem n={1} title="申込に関する注意事項の確認"
            open={disclosureOpen} onToggle={() => setDisclosureOpen(!disclosureOpen)}>
            申込に関する注意事項の詳細内容がここに表示されます。
          </NumberedDisclosureItem>
        </Preview>
      </Row>
      <SubHead>AgreeItem</SubHead>
      <Row>
        <Preview label="Closed（チェック付き）" width={390}>
          <AgreeItem num="①" item={AGREE_ITEMS[0]} open={false} onToggle={noop} checked={false} onCheck={noop} />
        </Preview>
        <Preview label="インタラクティブ" width={390}>
          <AgreeItem num="②" item={AGREE_ITEMS[1]} open={agreeOpen} onToggle={() => setAgreeOpen(!agreeOpen)}
            checked={agreeChecked} onCheck={() => setAgreeChecked(!agreeChecked)} />
        </Preview>
      </Row>
    </div>
  );
}

/* ================================================================
   9. アイコン（旧：ステータス）
   StatusIcon + アイコン画像 + デコレーション SVG（ブランドから移動）
================================================================ */
export function StatusSection() {
  return (
    <div className="theo-tdf-cd font-jp">
      <SubHead>StatusIcon</SubHead>
      <Row>
        {(["Success","Loading","Error","Cancelled","Locked"] as const).map((s) => (
          <Preview key={s} label={s} width={120}>
            <div className="flex justify-center">
              <StatusIcon state={s} />
            </div>
          </Preview>
        ))}
      </Row>
      <SubHead>アイコン画像</SubHead>
      <Row>
        <AssetCard label="icon_lock.svg">
          <img src="/assets/theo-tdf/icon_lock.svg" alt="" className="w-12 h-12" />
        </AssetCard>
        <AssetCard label="icon_error.png">
          <img src="/assets/theo-tdf/icon_error.png" alt="" className="w-12 h-12 object-contain" />
        </AssetCard>
      </Row>
      <SubHead>デコレーション SVG</SubHead>
      <Row>
        {[
          "activity-heart-circle","calendar","graduation-cap","hand-holding-heart",
          "info-circle","letter-heart-square","person-heart",
          "death-coverage-circle","death-coverage-x",
        ].map((name) => (
          <AssetCard key={name} label={name}>
            <img src={`/assets/theo-tdf/${name}.svg`} alt="" className="w-10 h-10" />
          </AssetCard>
        ))}
      </Row>
    </div>
  );
}

/* ActionSection — 後方互換エイリアス */
export function ActionSection() { return <NavigationSection />; }

/* ================================================================
   TheoCatalog — 全セクション統合（後方互換）
================================================================ */
export function TheoCatalog() {
  return (
    <div className="theo-tdf-cd font-jp">
      <CatSection title="ブランドアセット" sub="Logo / 背景画像 / AppBar / Phone UI Chrome"><BrandSection /></CatSection>
      <CatSection title="ナビゲーション" sub="Steps / Btn / ActionBar"><NavigationSection /></CatSection>
      <CatSection title="ラベル・バッジ" sub="Badge / ReqBadge / ErrText / SelectedPlanBadge"><LabelsSection /></CatSection>
      <CatSection title="フォーム入力" sub="Field / DatePicker / LockedField / Select / SegmentedToggle / GenderField / AgreeCheckbox"><FormsSection /></CatSection>
      <CatSection title="セクション" sub="NumberedSectionHeading / CardHeader / StepSection"><CardsSection /></CatSection>
      <CatSection title="カード・プラン選択" sub="GroupCard / ConfirmCard / PremiumSimulationCard / PlanCard など"><PlanSection /></CatSection>
      <CatSection title="開示・折り畳み" sub="AccordionDropdown / NumberedDisclosureItem / AgreeItem"><DisclosureSection /></CatSection>
      <CatSection title="アイコン" sub="StatusIcon / アイコン画像 / デコレーション SVG"><StatusSection /></CatSection>
      
    </div>
  );
}
