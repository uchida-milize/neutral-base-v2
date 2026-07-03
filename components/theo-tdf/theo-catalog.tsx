"use client";

import * as React from "react";
import {
  AppBar,
  Steps,
  Badge,
  Btn,
  ReqBadge,
  ErrText,
  Field,
  DatePicker,
  LockedField,
  Select,
  SegmentedToggle,
  GenderField,
  AgreeCheckbox,
  GroupCard,
  StepSection,
  NumberedSectionHeading,
  CardHeader,
  BirthDateGenderBlock,
  NumberedStepCard,
  IconNoteCard,
  NoteBox,
  AttentionNoticeCard,
  ConfirmRow,
  AddressRow,
  ConfirmCard,
  SelectedPlanBadge,
  SliderField,
  PremiumSimulationCard,
  PlanCard,
  PlanCardAccordion,
  PLANS,
  AccordionDropdown,
  NumberedDisclosureItem,
  StatusIcon,
  ActionBar,
  Logo,
  PhoneStatusBar,
  HomeIndicator,
} from "@/components/theo-tdf/claude-design/screens";

const PREFS = ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"];

/* ---- カタログ内セクション共通ヘッダー ---- */
function CatSection({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
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

/* ---- Phone フレーム（390px 幅） ---- */
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

/* ---- コンポーネントグリッド（横並び） ---- */
function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-6 items-start">{children}</div>;
}

/* ---- インラインプレビュー枠 ---- */
function Preview({ label, children, width = 390 }: { label: string; children: React.ReactNode; width?: number }) {
  return (
    <figure className="flex flex-col gap-2 shrink-0" style={{ width }}>
      <figcaption className="text-caption font-medium text-muted-foreground">{label}</figcaption>
      <div className="theo-tdf-cd font-jp rounded-xl bg-white p-4">
        {children}
      </div>
    </figure>
  );
}

/* ---- アセットカード（ロゴ・画像用） ---- */
function AssetCard({ label, children, bg = "bg-white" }: { label: string; children: React.ReactNode; bg?: string }) {
  return (
    <figure className="flex flex-col gap-2 shrink-0">
      <div className={`flex items-center justify-center rounded-xl border border-warm-200 ${bg} p-4`} style={{ minWidth: 160, minHeight: 80 }}>
        {children}
      </div>
      <figcaption className="text-caption text-muted-foreground text-center">{label}</figcaption>
    </figure>
  );
}

/* ---- サブ見出し ---- */
function SubHead({ children }: { children: React.ReactNode }) {
  return <h3 className="text-h5 font-semibold mb-3 text-foreground">{children}</h3>;
}

/* ================================================================
   メインカタログ
================================================================ */
export function TheoCatalog() {
  const noop = () => {};
  const [m, setM] = React.useState<number>(10000);
  const [y, setY] = React.useState<number>(15);
  const [planSel, setPlanSel] = React.useState<string>("");
  const [accordionOpen, setAccordionOpen] = React.useState<Record<string, boolean>>({});
  const [disclosureOpen, setDisclosureOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <div className="theo-tdf-cd font-jp">

      {/* ================================================================
          1. ブランドアセット
      ================================================================ */}
      <CatSection title="ブランドアセット" sub="ロゴ・背景画像・アイコン・デコレーション・Phone UI Chrome">

        {/* ロゴ（コンポーネント） */}
        <SubHead>Logo コンポーネント</SubHead>
        <Row>
          <AssetCard label="variant=default">
            <Logo variant="default" />
          </AssetCard>
          <AssetCard label="variant=blue">
            <Logo variant="blue" />
          </AssetCard>
        </Row>

        {/* ロゴ（画像ファイル） */}
        <SubHead>ロゴ 画像ファイル</SubHead>
        <Row>
          <AssetCard label="logo_theo_insurance_blue.svg">
            <img src="/assets/theo-tdf/logo_theo_insurance_blue.svg" alt="THEO Insurance Blue" className="h-8 w-auto" />
          </AssetCard>
          <AssetCard label="logo_theo_insurance.svg">
            <img src="/assets/theo-tdf/logo_theo_insurance.svg" alt="THEO Insurance" className="h-8 w-auto" />
          </AssetCard>
          <AssetCard label="logo_td.png">
            <img src="/assets/theo-tdf/logo_td.png" alt="T&D" className="h-8 w-auto" />
          </AssetCard>
          <AssetCard label="logo_td_financial.png">
            <img src="/assets/theo-tdf/logo_td_financial.png" alt="T&D Financial" className="h-8 w-auto" />
          </AssetCard>
          <AssetCard label="logo_td_insurance.png">
            <img src="/assets/theo-tdf/logo_td_insurance.png" alt="T&D Insurance" className="h-8 w-auto" />
          </AssetCard>
        </Row>

        {/* 背景・ヒーロー画像 */}
        <SubHead>背景・ヒーロー画像</SubHead>
        <Row>
          <AssetCard label="hero_bg.png" bg="bg-warm-100">
            <img src="/assets/theo-tdf/hero_bg.png" alt="Hero Background" className="h-20 w-auto rounded-lg object-cover" />
          </AssetCard>
          <AssetCard label="hero_bg_done.png" bg="bg-warm-100">
            <img src="/assets/theo-tdf/hero_bg_done.png" alt="Hero Background Done" className="h-20 w-auto rounded-lg object-cover" />
          </AssetCard>
          <AssetCard label="status_bg.png" bg="bg-warm-100">
            <img src="/assets/theo-tdf/status_bg.png" alt="Status Background" className="h-20 w-auto rounded-lg object-cover" />
          </AssetCard>
          <AssetCard label="chart_savings.png" bg="bg-warm-100">
            <img src="/assets/theo-tdf/chart_savings.png" alt="Chart Savings" className="h-20 w-auto rounded-lg object-cover" />
          </AssetCard>
          <AssetCard label="hero-chart.png" bg="bg-warm-100">
            <img src="/assets/theo-tdf/hero-chart.png" alt="Hero Chart" className="h-20 w-auto rounded-lg object-cover" />
          </AssetCard>
          <AssetCard label="hero-notch.svg" bg="bg-primary-600">
            <img src="/assets/theo-tdf/hero-notch.svg" alt="Hero Notch" className="h-8 w-auto" />
          </AssetCard>
        </Row>

        {/* アイコン画像 */}
        <SubHead>アイコン画像</SubHead>
        <Row>
          <AssetCard label="icon_lock.svg">
            <img src="/assets/theo-tdf/icon_lock.svg" alt="Lock" className="w-12 h-12" />
          </AssetCard>
          <AssetCard label="icon_error.png">
            <img src="/assets/theo-tdf/icon_error.png" alt="Error" className="w-12 h-12 object-contain" />
          </AssetCard>
          <AssetCard label="icon_maint.png">
            <img src="/assets/theo-tdf/icon_maint.png" alt="Maintenance" className="w-12 h-12 object-contain" />
          </AssetCard>
        </Row>

        {/* デコレーション SVG */}
        <SubHead>デコレーション SVG</SubHead>
        <Row>
          {[
            { file: "activity-heart-circle.svg", label: "activity-heart-circle" },
            { file: "calendar.svg", label: "calendar" },
            { file: "graduation-cap.svg", label: "graduation-cap" },
            { file: "hand-holding-heart.svg", label: "hand-holding-heart" },
            { file: "info-circle.svg", label: "info-circle" },
            { file: "letter-heart-square.svg", label: "letter-heart-square" },
            { file: "line-chart-dots-square.svg", label: "line-chart-dots-square" },
            { file: "person-heart.svg", label: "person-heart" },
          ].map(({ file, label }) => (
            <AssetCard key={file} label={label}>
              <img src={`/assets/theo-tdf/${file}`} alt={label} className="w-10 h-10" />
            </AssetCard>
          ))}
        </Row>

        {/* Phone UI Chrome */}
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
      </CatSection>

      {/* ================================================================
          2. ナビゲーション
      ================================================================ */}
      <CatSection title="ナビゲーション" sub="AppBar / Steps — 画面上部固定ヘッダーとSTEPインジケーター">
        <Row>
          <PhoneFrame label="AppBar — 通常">
            <AppBar title="保険" />
          </PhoneFrame>
          <PhoneFrame label="AppBar — 完了（空）">
            <AppBar title="お申込み完了" />
          </PhoneFrame>
        </Row>
        <div className="mt-6">
          <Row>
            {[1, 2, 3, 4, 5].map((n) => (
              <Preview key={n} label={`Steps — ${n}/5`} width={300}>
                <Steps n={n} of={5} go={noop} />
              </Preview>
            ))}
          </Row>
        </div>
      </CatSection>

      {/* ================================================================
          3. ボタン
      ================================================================ */}
      <CatSection title="ボタン" sub="Btn — kind: cta / button / outline / ghost / danger × 通常/Disabled">
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
      </CatSection>

      {/* ================================================================
          4. ラベル・バッジ
      ================================================================ */}
      <CatSection title="ラベル・バッジ" sub="Badge / ReqBadge / ErrText / SelectedPlanBadge">
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
          <Preview label="ReqBadge（必須マーク）" width={180}>
            <span className="text-h6 font-medium text-neutral-800">姓<ReqBadge /></span>
          </Preview>
          <Preview label="ErrText（インラインエラー）" width={280}>
            <ErrText>入力内容を確認してください</ErrText>
          </Preview>
          <Preview label="SelectedPlanBadge" width={280}>
            <SelectedPlanBadge planType="がん保障型" deathCoverage />
          </Preview>
        </Row>
      </CatSection>

      {/* ================================================================
          5. フォーム入力
      ================================================================ */}
      <CatSection title="フォーム入力" sub="Field / DatePicker / LockedField / Select / SegmentedToggle / GenderField / AgreeCheckbox">

        <SubHead>Field — テキスト入力（4状態）</SubHead>
        <Row>
          <Preview label="Default（空）">
            <Field label="姓" placeholder="山田" required />
          </Preview>
          <Preview label="Filled（入力済み）">
            <Field label="姓" placeholder="山田" required value="山田" />
          </Preview>
          <Preview label="Error（inline）">
            <Field label="姓" placeholder="山田" required error="姓を入力してください" errMode="inline" />
          </Preview>
          <Preview label="Disabled">
            <Field label="生年月日" value="1990 / 01 / 01" disabled />
          </Preview>
        </Row>

        <SubHead>DatePicker — 日付入力（2状態）</SubHead>
        <Row>
          <Preview label="Default">
            <DatePicker label="生年月日" required />
          </Preview>
          <Preview label="Error（inline）">
            <DatePicker label="生年月日" required error="生年月日を選択してください" errMode="inline" />
          </Preview>
        </Row>

        <SubHead>LockedField — 読み取り専用</SubHead>
        <Row>
          <Preview label="LockedField — 生年月日">
            <LockedField label="生年月日" value="1990 / 01 / 01" />
          </Preview>
          <Preview label="LockedField — 性別">
            <LockedField label="性別" value="男性" />
          </Preview>
        </Row>

        <SubHead>Select — セレクトボックス（3状態）</SubHead>
        <Row>
          <Preview label="Default">
            <Select label="都道府県" required options={PREFS} />
          </Preview>
          <Preview label="Error（inline）">
            <Select label="都道府県" required options={PREFS} error="都道府県を選択してください" errMode="inline" />
          </Preview>
          <Preview label="Disabled">
            <Select label="都道府県" options={PREFS} disabled />
          </Preview>
        </Row>

        <SubHead>SegmentedToggle — セグメントトグル</SubHead>
        <Row>
          <Preview label="通常" width={300}>
            <SegmentedToggle options={["男性", "女性"]} value="男性" onChange={noop} />
          </Preview>
          <Preview label="エラー" width={300}>
            <SegmentedToggle options={["男性", "女性"]} value="" onChange={noop} error />
          </Preview>
        </Row>

        <SubHead>GenderField — 性別フィールド</SubHead>
        <Row>
          <Preview label="通常" width={300}>
            <GenderField value="男性" onChange={noop} required />
          </Preview>
          <Preview label="エラー" width={300}>
            <GenderField value="" onChange={noop} required error />
          </Preview>
        </Row>

        <SubHead>AgreeCheckbox — 同意チェックボックス</SubHead>
        <Row>
          <Preview label="未チェック">
            <AgreeCheckbox checked={false} onChange={() => {}}>
              上記の事前同意事項を確認し、同意します
            </AgreeCheckbox>
          </Preview>
          <Preview label="チェック済">
            <AgreeCheckbox checked={true} onChange={() => {}}>
              上記の事前同意事項を確認し、同意します
            </AgreeCheckbox>
          </Preview>
        </Row>
      </CatSection>

      {/* ================================================================
          6. セクション・カード
      ================================================================ */}
      <CatSection title="セクション・カード" sub="NumberedSectionHeading / CardHeader / StepSection / GroupCard / BirthDateGenderBlock / NumberedStepCard / IconNoteCard / NoteBox / AttentionNoticeCard / ConfirmRow・AddressRow・ConfirmCard">

        <SubHead>NumberedSectionHeading — 番号付きセクション見出し</SubHead>
        <Row>
          {[1, 2, 3].map((n) => (
            <Preview key={n} label={`n=${n}`} width={280}>
              <NumberedSectionHeading n={n}>
                {n === 1 ? "プランを選ぶ" : n === 2 ? "お客様情報" : "お申込み内容の確認"}
              </NumberedSectionHeading>
            </Preview>
          ))}
        </Row>

        <SubHead>CardHeader — カードヘッダー（4状態）</SubHead>
        <Row>
          {(["Plain", "Locked", "Editable", "Editing"] as const).map((state) => (
            <Preview key={state} label={`state=${state}`} width={320}>
              <CardHeader title="積立内容" state={state} />
            </Preview>
          ))}
        </Row>

        <SubHead>StepSection — STEP番号バッジ付きセクション</SubHead>
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

        <SubHead>GroupCard — 入力グループコンテナ</SubHead>
        <Row>
          <Preview label="GroupCard — 契約者情報">
            <GroupCard title="契約者情報" sub="ご契約者ご本人さまの情報" iconSrc="/assets/theo-tdf/person-heart.svg">
              <Field label="姓" placeholder="山田" required />
              <Field label="名" placeholder="太郎" required />
              <LockedField label="生年月日" value="1990 / 01 / 01" />
            </GroupCard>
          </Preview>
        </Row>

        <SubHead>BirthDateGenderBlock — 生年月日・性別ブロック</SubHead>
        <Row>
          <Preview label="BirthDateGenderBlock">
            <BirthDateGenderBlock />
          </Preview>
        </Row>

        <SubHead>NumberedStepCard — 番号付きステップカード</SubHead>
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

        <SubHead>IconNoteCard — アイコン付きノートカード</SubHead>
        <Row>
          <Preview label="IconNoteCard">
            <IconNoteCard iconSrc="/assets/theo-tdf/person-heart.svg">
              ご契約者さまの情報をご確認ください。変更がある場合はTHEOアプリよりご連絡ください。
            </IconNoteCard>
          </Preview>
        </Row>

        <SubHead>NoteBox — 注釈ボックス</SubHead>
        <Row>
          <Preview label="NoteBox">
            <NoteBox>
              本保険は THEO の積立投資と組み合わせた保険商品です。詳細は重要事項説明書をご確認ください。
            </NoteBox>
          </Preview>
        </Row>

        <SubHead>AttentionNoticeCard — 重要事項・事前同意カード</SubHead>
        <Row>
          <Preview label="AttentionNoticeCard">
            <AttentionNoticeCard />
          </Preview>
        </Row>

        <SubHead>ConfirmRow / AddressRow / ConfirmCard — 確認画面</SubHead>
        <Row>
          <Preview label="ConfirmRow" width={340}>
            <div className="divide-y divide-warm-100">
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
      </CatSection>

      {/* ================================================================
          7. プラン選択
      ================================================================ */}
      <CatSection title="プラン選択" sub="PremiumSimulationCard / SliderField / PlanCard / PlanCardAccordion">

        <SubHead>PremiumSimulationCard — シミュレーションカード（インタラクティブ）</SubHead>
        <Preview label="PremiumSimulationCard" width={390}>
          <PremiumSimulationCard
            m={m} setM={setM} y={y} setY={setY}
            planType="がん保障型" deathCoverage
          />
        </Preview>

        <SubHead>SliderField — スライダーフィールド</SubHead>
        <Row>
          <Preview label="積立金額スライダー" width={390}>
            <SliderField
              label="毎月の積立金額"
              value={m} min={5000} max={150000} step={1000}
              onChange={setM}
              formatValue={(v) => `${v.toLocaleString()}円`}
              minLabel="5,000円" maxLabel="150,000円"
            />
          </Preview>
          <Preview label="保障期間スライダー" width={390}>
            <SliderField
              label="保障期間"
              value={y} min={5} max={30} step={1}
              onChange={setY}
              formatValue={(v) => `${v}年`}
              minLabel="5年" maxLabel="30年"
            />
          </Preview>
        </Row>

        <SubHead>PlanCard — プラン選択カード</SubHead>
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

        <SubHead>PlanCardAccordion — アコーディオン式プランカード</SubHead>
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
      </CatSection>

      {/* ================================================================
          8. 開示・折り畳み
      ================================================================ */}
      <CatSection title="開示・折り畳み" sub="AccordionDropdown / NumberedDisclosureItem">

        <SubHead>AccordionDropdown — アコーディオンドロップダウン</SubHead>
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
            <AccordionDropdown
              title="クレジットカードのお支払いについて"
              open={dropdownOpen}
              onToggle={() => setDropdownOpen(!dropdownOpen)}
            >
              クレジットカード払いに関する詳細内容がここに表示されます。
            </AccordionDropdown>
          </Preview>
        </Row>

        <SubHead>NumberedDisclosureItem — 番号付き開示項目</SubHead>
        <Row>
          <Preview label="Closed" width={390}>
            <NumberedDisclosureItem n={1} title="申込に関する注意事項の確認" open={false} onToggle={noop} />
          </Preview>
          <Preview label="Open" width={390}>
            <NumberedDisclosureItem n={1} title="申込に関する注意事項の確認" open={true} onToggle={noop}>
              申込に関する注意事項の詳細内容がここに表示されます。内容をよくお読みください。
            </NumberedDisclosureItem>
          </Preview>
          <Preview label="インタラクティブ" width={390}>
            <NumberedDisclosureItem
              n={1}
              title="申込に関する注意事項の確認"
              open={disclosureOpen}
              onToggle={() => setDisclosureOpen(!disclosureOpen)}
            >
              申込に関する注意事項の詳細内容がここに表示されます。
            </NumberedDisclosureItem>
          </Preview>
        </Row>
      </CatSection>

      {/* ================================================================
          9. ステータス
      ================================================================ */}
      <CatSection title="ステータス" sub="StatusIcon — Success / Loading / Error / Maintenance / Cancelled / Locked">
        <Row>
          {(["Success", "Loading", "Error", "Maintenance", "Cancelled", "Locked"] as const).map((s) => (
            <Preview key={s} label={s} width={120}>
              <div className="flex justify-center">
                <StatusIcon state={s} />
              </div>
            </Preview>
          ))}
        </Row>
      </CatSection>

      {/* ================================================================
          10. アクション
      ================================================================ */}
      <CatSection title="アクション" sub="ActionBar — 画面下部スティッキーバー（normal / solid / back）">
        <Row>
          <PhoneFrame label="variant=normal">
            <div className="h-20 bg-warm-50 flex items-center justify-center">
              <span className="text-caption text-neutral-400">コンテンツエリア</span>
            </div>
            <ActionBar>
              <Btn kind="cta">次へ進む</Btn>
            </ActionBar>
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
      </CatSection>

    </div>
  );
}
