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
  LockedField,
  Select,
  GroupCard,
  StepSection,
  SimSliders,
  ActionBar,
  PlanCard,
  PlanCardAccordion,
  PLANS,
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
      <div className="theo-tdf-cd font-jp rounded-2xl border border-warm-200 bg-warm-50 shadow-sm overflow-hidden w-full">
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
      <div className="theo-tdf-cd font-jp rounded-xl border border-warm-200 bg-white p-4 shadow-sm">
        {children}
      </div>
    </figure>
  );
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

  return (
    <div className="theo-tdf-cd font-jp">

      {/* ---- 1. AppBar & Steps ---- */}
      <CatSection title="AppBar & Steps" sub="画面上部の固定ヘッダーとSTEPインジケーター">
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

      {/* ---- 2. Badge ---- */}
      <CatSection title="Badge" sub="ラベル・タグ（tone: secondary / primary / warm）">
        <Row>
          <Preview label="secondary（デフォルト）" width={200}>
            <div className="flex gap-2 flex-wrap">
              <Badge tone="secondary">がん保障型</Badge>
              <Badge tone="secondary">死亡保障あり</Badge>
            </div>
          </Preview>
          <Preview label="primary" width={200}>
            <div className="flex gap-2 flex-wrap">
              <Badge tone="primary">告知</Badge>
            </div>
          </Preview>
          <Preview label="warm" width={200}>
            <div className="flex gap-2 flex-wrap">
              <Badge tone="warm">選択中</Badge>
            </div>
          </Preview>
        </Row>
      </CatSection>

      {/* ---- 3. Buttons ---- */}
      <CatSection title="Btn" sub="5種類 × 通常/Disabled">
        <Row>
          {(["cta", "button", "outline", "ghost", "danger"] as const).map((kind) => (
            <Preview key={kind} label={`kind="${kind}"`} width={220}>
              <div className="flex flex-col gap-3">
                <Btn kind={kind} full={false}>{kind === "cta" ? "申込む" : kind === "danger" ? "解約する" : kind === "outline" ? "戻る" : kind === "ghost" ? "スキップ" : "確認する"}</Btn>
                <Btn kind={kind} full={false} disabled>{kind === "cta" ? "申込む" : kind === "danger" ? "解約する" : kind === "outline" ? "戻る" : kind === "ghost" ? "スキップ" : "確認する"} (disabled)</Btn>
              </div>
            </Preview>
          ))}
        </Row>
      </CatSection>

      {/* ---- 4. ReqBadge & ErrText ---- */}
      <CatSection title="ReqBadge & ErrText" sub="必須マーク・インラインエラー">
        <Row>
          <Preview label="ReqBadge" width={200}>
            <span className="text-h6 font-medium text-neutral-800">姓<ReqBadge /></span>
          </Preview>
          <Preview label="ErrText" width={300}>
            <ErrText>入力内容を確認してください</ErrText>
          </Preview>
        </Row>
      </CatSection>

      {/* ---- 5. Field ---- */}
      <CatSection title="Field" sub="テキスト入力 — 4状態">
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
      </CatSection>

      {/* ---- 6. LockedField ---- */}
      <CatSection title="LockedField" sub="読み取り専用フィールド（変更不可）">
        <Row>
          <Preview label="LockedField">
            <LockedField label="生年月日" value="1990 / 01 / 01" />
          </Preview>
          <Preview label="LockedField — 性別">
            <LockedField label="性別" value="男性" />
          </Preview>
        </Row>
      </CatSection>

      {/* ---- 7. Select ---- */}
      <CatSection title="Select" sub="セレクトボックス — 3状態">
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
      </CatSection>

      {/* ---- 8. GroupCard ---- */}
      <CatSection title="GroupCard" sub="入力グループのコンテナ">
        <Row>
          <Preview label="GroupCard — 契約者情報">
            <GroupCard title="契約者情報" sub="ご契約者ご本人さまの情報" iconSrc="/assets/theo-tdf/person-heart.svg">
              <Field label="姓" placeholder="山田" required />
              <Field label="名" placeholder="太郎" required />
              <LockedField label="生年月日" value="1990 / 01 / 01" />
            </GroupCard>
          </Preview>
        </Row>
      </CatSection>

      {/* ---- 9. StepSection ---- */}
      <CatSection title="StepSection" sub="STEP番号バッジ付きセクション">
        <Row>
          <Preview label="StepSection（n=1）">
            <StepSection label="メールアドレス" n={1}>
              <Field label="メールアドレス" placeholder="example@email.com" required />
            </StepSection>
          </Preview>
          <Preview label="StepSection（big）">
            <StepSection label="保険料シミュレーション" n={2} big>
              <p className="text-caption text-neutral-500">コンテンツエリア</p>
            </StepSection>
          </Preview>
        </Row>
      </CatSection>

      {/* ---- 10. SimSliders ---- */}
      <CatSection title="SimSliders" sub="積立金額・保障期間スライダー（divベース・インタラクティブ）">
        <Preview label="SimSliders — インタラクティブ">
          <SimSliders m={m} setM={setM} y={y} setY={setY} />
        </Preview>
      </CatSection>

      {/* ---- 11. ActionBar ---- */}
      <CatSection title="ActionBar" sub="画面下部のスティッキーバー">
        <Row>
          <PhoneFrame label="ActionBar — 通常">
            <div className="h-32 bg-warm-50 flex items-center justify-center">
              <span className="text-caption text-neutral-400">コンテンツエリア</span>
            </div>
            <ActionBar>
              <Btn kind="cta">次へ進む</Btn>
            </ActionBar>
          </PhoneFrame>
          <PhoneFrame label="ActionBar — solid（ブルー帯）">
            <div className="h-32 bg-warm-50 flex items-center justify-center">
              <span className="text-caption text-neutral-400">コンテンツエリア</span>
            </div>
            <ActionBar solid>
              <Btn kind="cta">申込む</Btn>
              <Btn kind="ghost" full={false}>キャンセル</Btn>
            </ActionBar>
          </PhoneFrame>
        </Row>
      </CatSection>


      {/* ---- 12. PlanCard ---- */}
      <CatSection title="PlanCard" sub="プラン選択カード（未選択 / 選択済 / ツールチップ展開）">
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
      </CatSection>

      {/* ---- 13. PlanCardAccordion ---- */}
      <CatSection title="PlanCardAccordion" sub="アコーディオン式プランカード（閉 / 展開 / 選択中）">
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

    </div>
  );
}
