"use client";

import * as React from "react";

import { FLOW_META } from "@/components/xxx/flow-meta";

/**
 * XXX Embedded Insurance Flow — モバイル 11 画面の TSX 移植。
 *
 * 一次ソース:
 *   uploads/MILIZE UIUX Design System (Bundle).zip
 *     ├── screens.jsx          (4 画面: Guidance / Product / Plan / Confirm)
 *     ├── screens-extra.jsx    (7 画面: CustomerInfo / CustomerInfoConfirm /
 *     │                              EkycSelect / EkycCapture / Health /
 *     │                              Payment / Complete)
 *     └── screens.css          (本ファイルが参照するスタイル定義)
 *
 * スタイルは `components/xxx/flow.css` を `.xxx-flow` でスコープ化。
 * 全画面の最上位ラッパー `<div className="phone">` の親に `xxx-flow` を
 * 付けることで、`.card` `.btn` 等のクラスが他所に漏れないようにしている。
 */

export type ScreenProps = {
  onNext: () => void;
  onBack: () => void;
};

/* ===============================================================
 * Icon set — lucide 風の自前 SVG (オリジナルと同等)
 * =============================================================== */

const Icon = {
  chevron: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  list: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M8 6h13M8 12h13M8 18h13" />
      <circle cx="3.5" cy="6" r="1.4" /><circle cx="3.5" cy="12" r="1.4" /><circle cx="3.5" cy="18" r="1.4" />
    </svg>
  ),
  folder: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M12 3l8 3v6c0 4.5-3.4 8.4-8 9-4.6-.6-8-4.5-8-9V6l8-3z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="m10.3 3.7-7.6 13a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3l-7.6-13a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4" /><circle cx="12" cy="17" r="0.5" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <circle cx="12" cy="12" r="9" /><path d="M12 16v-5" /><circle cx="12" cy="8" r="0.5" />
    </svg>
  ),
  card: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18M7 15h2" />
    </svg>
  ),
  camera: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M14.5 4h-5l-2 3H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5l-2-3z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  ),
  doc: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  ),
};

/* ===============================================================
 * 共通: ヘッダー
 * =============================================================== */

function AppHeader({ step, total = 8 }: { step?: number; total?: number }) {
  const pct = step != null ? (step / total) * 100 : 0;
  return (
    <div>
      <header className="app-header">
        <span
          className="logo"
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            letterSpacing: "0.05em",
            color: "var(--navigation-navy-500)",
            fontSize: 14,
            lineHeight: "18px",
          }}
        >
          XXX Financial
        </span>
        {step != null ? (
          <span className="step-count">
            STEP <strong>{step}</strong>/{total}
          </span>
        ) : (
          <span className="step-count">事前ガイダンス</span>
        )}
      </header>
      {step != null && (
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}

/* ===============================================================
 * SCREEN 1 — 事前ガイダンス
 * =============================================================== */

const FLOW_STEPS = [
  { title: "対象商品の選択・設定", desc: "金融商品の選択、契約希望期間と積立額の設定" },
  { title: "希望補償プランの決定", desc: "標準プラン／充実プランの選択" },
  { title: "お客様情報の入力", desc: "サービス連携情報を確認・編集" },
  { title: "入力情報の最終確認", desc: "提出前の入力データプレビュー" },
  { title: "本人確認 (eKYC)", desc: "スマホカメラによる証明書・生体確認" },
  { title: "健康告知", desc: "Yes / No 形式での簡易告知" },
  { title: "お申込み内容のご確認", desc: "保障内容と保険料の確認、電子署名" },
  { title: "カード登録・決済", desc: "本人名義カードでの与信登録" },
];

function GuidanceIllustration() {
  return (
    <svg className="illust" viewBox="0 0 350 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="86" width="350" height="24" fill="#f3e6d2" opacity="0.5" />
      <g stroke="#0f766e" strokeWidth="1.6" fill="#fff" strokeLinejoin="round" strokeLinecap="round">
        <rect x="30" y="34" width="64" height="80" rx="4" />
        <path d="M40 50h44M40 60h44M40 70h32M40 80h28" stroke="#8590a8" />
        <circle cx="79" cy="100" r="8" fill="#d97706" stroke="none" />
      </g>
      <g stroke="#0f766e" strokeWidth="1.6" fill="#fff" strokeLinejoin="round" strokeLinecap="round">
        <rect x="125" y="26" width="60" height="92" rx="8" />
        <rect x="132" y="38" width="46" height="60" rx="2" fill="#f3f5f8" stroke="none" />
        <circle cx="155" cy="106" r="2" />
        <path d="M141 56h28M141 64h22M141 72h28" stroke="#8590a8" />
      </g>
      <g stroke="#0f766e" strokeWidth="1.6" fill="#fff" strokeLinejoin="round" strokeLinecap="round">
        <circle cx="240" cy="44" r="11" />
        <path d="M222 96c0-12 8-22 18-22s18 10 18 22" />
      </g>
      <g stroke="#0f766e" strokeWidth="1.6" fill="#fafaf9" strokeLinejoin="round" strokeLinecap="round">
        <path d="M298 38l16 6v14c0 11-7 19-16 22-9-3-16-11-16-22V44l16-6z" />
        <path d="M298 70c-4-2-6-5-6-8a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 3-2 6-6 8z" fill="#d97706" stroke="#d97706" />
      </g>
      <path d="M100 70 C 110 70, 120 70, 125 70" stroke="#d97706" strokeWidth="1.2" strokeDasharray="2 3" />
      <path d="M188 70 C 198 70, 208 70, 218 70" stroke="#d97706" strokeWidth="1.2" strokeDasharray="2 3" />
      <path d="M262 70 C 272 70, 278 60, 282 56" stroke="#d97706" strokeWidth="1.2" strokeDasharray="2 3" />
    </svg>
  );
}

export function GuidanceScreen({ onNext }: ScreenProps) {
  return (
    <div className="phone" data-screen-label="01 事前ガイダンス">
      <AppHeader />
      <div className="screen">
        <div className="hero">
          <div className="hero-copy">
            <span className="eyebrow">お申込み前の事前ガイド</span>
            <h1>5分でお手続きが完了します</h1>
            <p className="hero-lead">
              次の「全体フロー」と「ご用意いただく書類」をご確認のうえお進みください。
            </p>
          </div>
          <GuidanceIllustration />
        </div>

        <div className="card">
          <div className="card-title">
            <span className="leading-icon">{Icon.list}</span>
            お申込み手順の全体フロー
          </div>
          <hr className="card-divider" />
          <div className="timeline">
            {FLOW_STEPS.map((s, i) => (
              <div key={i} className={`timeline-step ${i === 0 ? "current" : ""}`}>
                <div className="dot">{i + 1}</div>
                <div>
                  <div className="title">{s.title}</div>
                  <div className="desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <span className="leading-icon">{Icon.folder}</span>
            ご用意いただく本人確認書類
            <span className="badge neutral">いずれか1点</span>
          </div>
          <p className="field-help">
            スマートフォンでの本人確認 (eKYC) で次のいずれかを使用します。
          </p>
          {[
            { name: "運転免許証 / 運転経歴証明書", desc: "表面・裏面および厚みスキャンを行います。", rec: true },
            { name: "マイナンバーカード", desc: "顔写真のある表面のみを撮影します。" },
            { name: "在留カード / 特別永住者証明書", desc: "外国籍の方はこちらをご用意ください。" },
          ].map((d, i) => (
            <div className="doc-tile" key={i}>
              <span className="swatch">{Icon.doc}</span>
              <div>
                <div className="name">
                  {d.name}
                  {d.rec && <span className="rec">推奨</span>}
                </div>
                <div className="desc">{d.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="banner warning">
          <span className="icon">{Icon.alert}</span>
          <div>
            書類の住所・生年月日等が、提携元のご登録情報（<strong>山田 太郎</strong> 様、東京都港区虎ノ門 1丁目 23-1）と異なる場合、eKYC 不一致で再提出が必要となります。
          </div>
        </div>

        <button className="btn btn-cta full" onClick={onNext}>
          内容を確認して手続きを開始する
          <span aria-hidden="true">{Icon.chevron}</span>
        </button>
      </div>
    </div>
  );
}

/* ===============================================================
 * SCREEN 2 — 対象商品の選択・個別設定
 * =============================================================== */

const PRODUCTS = [
  {
    id: "日本株式型",
    label: "日経225 インデックス",
    badgeClass: "neutral",
    fund: "日経225 インデックス (適格機関投資家専用)",
    manager: "東京海上アセットマネジメント株式会社",
    fee: "年率 0.275%",
    years: ["10年", "15年", "20年"],
    selectedYear: "15年",
    amount: 30000,
    selected: true,
    hasEsg: true,
    subtype: undefined as string | undefined,
  },
  {
    id: "世界株式型",
    label: "先進国株式インデックス",
    badgeClass: "success",
    fund: "全世界株式 ESG インデックス (適格機関投資家専用)",
    manager: "大和アセットマネジメント株式会社",
    fee: "年率 0.330%",
    years: ["10年", "15年", "20年"],
    selectedYear: "20年",
    amount: 20000,
    selected: true,
    hasEsg: true,
    subtype: "ESG" as string | undefined,
  },
  {
    id: "米国株式型",
    label: "NASDAQ100 インデックス",
    badgeClass: "info",
    fund: "インデックスファンド NASDAQ100 (適格機関投資家専用)",
    manager: "アモーヴァ・アセットマネジメント株式会社",
    fee: "年率 0.418%",
    years: ["5年", "10年"],
    selectedYear: undefined as string | undefined,
    amount: 0,
    selected: false,
    hasEsg: false,
    subtype: undefined as string | undefined,
  },
];

export function ProductScreen({ onNext }: ScreenProps) {
  const totalSavings = PRODUCTS.filter((p) => p.selected).reduce((s, p) => s + p.amount, 0);
  const premium = Math.round((806 * totalSavings) / 50000);
  return (
    <div className="phone" data-screen-label="02 対象商品の選択">
      <AppHeader step={1} />
      <div className="screen">
        <div className="section-header">
          <span className="eyebrow">STEP 1 · 商品の選択</span>
          <h2>対象商品を選んでください</h2>
          <p className="lead">
            ポートフォリオ運用の補完となるプランを選択し、契約希望年数を指定します。
          </p>
        </div>

        <div className="card flat">
          <div className="card-title">前提条件の設定</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field">
              <label className="field-label">加入年齢</label>
              <select className="select-native" defaultValue="38">
                <option value="38">38 歳</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label">性別</label>
              <div className="segmented" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <button className="active">男性</button>
                <button>女性</button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PRODUCTS.map((p) => (
            <div key={p.id} className={`select-card ${p.selected ? "active" : ""}`}>
              <div className="row">
                <span className={`badge ${p.badgeClass}`}>{p.id}</span>
                {p.hasEsg && p.selected && (
                  <div className="chip-group">
                    <button className={p.subtype !== "ESG" ? "active" : ""}>通常</button>
                    <button className={p.subtype === "ESG" ? "active" : ""}>ESG</button>
                  </div>
                )}
                {!p.selected && <div className="indicator" />}
              </div>
              <div>
                <div className="name">{p.fund}</div>
                <div className="meta">
                  <span>委託 {p.manager.replace("株式会社", "")}</span>
                  <span className="fee">{p.fee}</span>
                </div>
              </div>
              {p.selected && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 10, borderTop: "1px dashed var(--border-subtle)" }}>
                  <span className="field-label">契約希望期間</span>
                  <div className="year-grid">
                    {p.years.map((y) => (
                      <button key={y} className={p.selectedYear === y ? "active" : ""}>{y}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="card flat">
          <div className="card-title">毎月の積立額調整</div>
          {PRODUCTS.filter((p) => p.selected).map((p) => (
            <div
              key={p.id}
              style={{
                background: "#fff",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-md)",
                padding: 12,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{p.id}</span>
                <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                  上限 ¥50,000 / 月
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--text-sub)" }}>積立設定額</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 800, color: "var(--navigation-navy-500)" }}>
                  ¥{p.amount.toLocaleString()}
                </span>
              </div>
              <input className="range" type="range" min={1000} max={50000} step={1000} defaultValue={p.amount} readOnly />
            </div>
          ))}
        </div>

        <div className="summary-bar">
          <div className="grid">
            <div>
              <span className="label">毎月の積立額合計</span>
              <div className="amount">¥{totalSavings.toLocaleString()}</div>
            </div>
            <hr />
            <div>
              <span className="label" style={{ textAlign: "right" }}>月額保険料 (自動算出)</span>
              <div className="amount right premium">¥{premium.toLocaleString()}</div>
            </div>
          </div>
          <button className="btn btn-cta full" onClick={onNext}>
            設定を保存して、補償プランへ
            <span aria-hidden="true">{Icon.chevron}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
 * SCREEN 3 — 希望補償プラン
 * =============================================================== */

export function PlanScreen({ onNext }: ScreenProps) {
  return (
    <div className="phone" data-screen-label="03 補償プラン">
      <AppHeader step={2} />
      <div className="screen">
        <div className="section-header">
          <span className="eyebrow">STEP 2 · 補償プラン</span>
          <h2>万が一の備えを選びます</h2>
          <p className="lead">
            お預かり運用資産の配分上限にあわせて、給付基準を決定します。
          </p>
        </div>

        <div className="plan-card active">
          <div className="head">
            <span className="plan-pill">標準プラン</span>
            <div className="radio" />
          </div>
          <div className="lede">
            死亡 ＋ 障害・介護に対応した、ご家族の生活をサポートする定期保険です。
          </div>
          <div className="underwriter">引受会社: XXXフィナンシャル生命</div>

          <div className="accordion">
            <div className="row">
              保障内容の詳細
              <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>−</span>
            </div>
            <div className="body">
              <div>
                <strong>死亡保険金・障害介護給付:</strong>
                <br />
                国民年金法障害等級 第 2 級以上に該当時に支給。保障金額は変動型です。
              </div>
              <div className="banner info" style={{ marginTop: 4 }}>
                <span className="icon">{Icon.shield}</span>
                <div>
                  保障金額 (変動算定) ＝ 毎月の積立設定額 <strong>¥50,000</strong> × 期間満了までの残月数
                </div>
              </div>
            </div>
          </div>

          <div className="accordion">
            <div className="row">
              年間想定保険料の目安
              <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>−</span>
            </div>
            <div className="body">
              <div className="stat-grid">
                <div className="row2"><span>1年目</span><strong>¥806</strong></div>
                <div className="row2"><span>2年目</span><strong>¥810</strong></div>
                <div className="row2"><span>3年目</span><strong>¥814</strong></div>
                <div className="row2"><span>他期間</span><strong>積立比例</strong></div>
              </div>
            </div>
          </div>
        </div>

        <div className="plan-card">
          <div className="head">
            <span className="plan-pill">充実プラン</span>
            <div className="radio" />
          </div>
          <div className="lede">
            死亡・介護に加え、<strong>三大疾病 (がん・心疾患・脳卒中)</strong> までを一貫して保障するプランです。
          </div>
          <div className="underwriter">引受会社: XXXフィナンシャル生命</div>
          <div className="accordion">
            <div className="row">
              保障内容（三大疾病対応モデル）
              <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>＋</span>
            </div>
          </div>
          <div className="accordion">
            <div className="row">
              年間想定保険料の目安
              <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>＋</span>
            </div>
          </div>
        </div>

        <div className="summary-bar">
          <div className="grid">
            <div>
              <span className="label">毎月の積立額合計</span>
              <div className="amount">¥50,000</div>
            </div>
            <hr />
            <div>
              <span className="label" style={{ textAlign: "right" }}>月額保険料</span>
              <div className="amount right premium">¥806</div>
            </div>
          </div>
          <button className="btn btn-cta full" onClick={onNext}>
            プランを決定して、お客様情報登録へ
            <span aria-hidden="true">{Icon.chevron}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
 * SCREEN 4 — お客様情報入力
 * =============================================================== */

export function CustomerInfoScreen({ onNext, onBack }: ScreenProps) {
  return (
    <div className="phone" data-screen-label="04 お客様情報入力">
      <AppHeader step={3} />
      <div className="screen">
        <div className="section-header">
          <span className="eyebrow">STEP 3 · お客様情報</span>
          <h2>お客様情報のご登録</h2>
          <p className="lead">
            サービス連携により自動入力されています。内容を確認・編集してください。
          </p>
        </div>

        <div className="card">
          <div className="card-title">
            <span className="leading-icon">{Icon.user}</span>
            ご契約者プロフィール
            <span className="badge success">自動取得</span>
          </div>
          <hr className="card-divider" />
          <div className="field">
            <label className="field-label">お名前 (氏名)</label>
            <input className="input" defaultValue="山田 太郎" />
          </div>
          <div className="field">
            <label className="field-label">フリガナ</label>
            <input className="input" defaultValue="ヤマダ タロウ" />
          </div>
          <div className="field">
            <label className="field-label">生年月日</label>
            <input className="input" defaultValue="1987 年 4 月 12 日" />
          </div>
          <div className="field">
            <label className="field-label">ご登録住所</label>
            <input className="input" defaultValue="東京都港区虎ノ門 1丁目 23-1" />
          </div>
          <div className="field">
            <label className="field-label">連絡先 (携帯電話番号)</label>
            <input className="input" defaultValue="090-1234-5678" />
          </div>
          <div className="field">
            <label className="field-label">メールアドレス</label>
            <input className="input" defaultValue="taro.yamada@example.jp" />
          </div>
        </div>

        <div className="banner info">
          <span className="icon">{Icon.info}</span>
          <div>
            本人確認書類 (運転免許証など) に記載の住所・氏名と相違がないか必ずご確認ください。不一致の場合は eKYC 審査が通りません。
          </div>
        </div>

        <button className="btn btn-cta full" onClick={onNext}>
          入力内容の確認画面へ進む
          <span aria-hidden="true">{Icon.chevron}</span>
        </button>
        <button className="btn btn-neutral full" onClick={onBack} style={{ marginTop: -8 }}>
          補償プランへ戻る
        </button>
      </div>
    </div>
  );
}

/* ===============================================================
 * SCREEN 5 — ご登録情報の最終確認 (入力プレビュー)
 * =============================================================== */

export function CustomerInfoConfirmScreen({ onNext, onBack }: ScreenProps) {
  return (
    <div className="phone" data-screen-label="05 入力内容の確認">
      <AppHeader step={4} />
      <div className="screen">
        <div className="section-header">
          <span className="eyebrow">STEP 4 · 入力確認</span>
          <h2>ご登録情報の最終確認</h2>
          <p className="lead">
            次のステップで本人確認書類との照合を行います。誤りがある場合は前画面へ戻り修正してください。
          </p>
        </div>

        <div className="card warm">
          <div className="card-title">
            <span className="leading-icon">{Icon.shield}</span>
            登録情報のプレビュー
            <span className="badge success">入力検証合格</span>
          </div>
          <div className="kv">
            <div className="row"><span className="k">お名前</span><span className="v">山田 太郎 様</span></div>
            <div className="row"><span className="k">フリガナ</span><span className="v">ヤマダ タロウ</span></div>
            <div className="row"><span className="k">生年月日</span><span className="v">1987 年 4 月 12 日</span></div>
            <div className="row"><span className="k">ご登録住所</span><span className="v" style={{ maxWidth: 200 }}>東京都港区虎ノ門 1丁目 23-1</span></div>
            <div className="row"><span className="k">携帯番号</span><span className="v">090-1234-5678</span></div>
            <div className="row"><span className="k">メール</span><span className="v">taro.yamada@example.jp</span></div>
          </div>
        </div>

        <div className="banner info">
          <span className="icon">{Icon.camera}</span>
          <div>
            <strong>次のステップ:</strong> スマホカメラによる本人確認 (eKYC) を実施します。
            <br />お手元に本人確認書類をご用意ください。
          </div>
        </div>

        <button className="btn btn-cta full" onClick={onNext}>
          情報を確認して本人確認 (eKYC) へ進む
          <span aria-hidden="true">{Icon.chevron}</span>
        </button>
        <button className="btn btn-neutral full" onClick={onBack} style={{ marginTop: -8 }}>
          入力画面に戻り修正する
        </button>
      </div>
    </div>
  );
}

/* ===============================================================
 * SCREEN 6 — eKYC 書類選択
 * =============================================================== */

export function EkycSelectScreen({ onNext, onBack }: ScreenProps) {
  const [doc, setDoc] = React.useState("運転免許証");
  return (
    <div className="phone" data-screen-label="06 本人確認 書類選択">
      <AppHeader step={5} />
      <div className="screen">
        <div className="section-header">
          <span className="eyebrow">STEP 5 · eKYC</span>
          <h2>本人確認書類の選択</h2>
          <p className="lead">
            スマートフォンの内蔵カメラで本人確認を完結させます。提出する書類を選んでください。
          </p>
        </div>

        <div className="card">
          <div className="card-title">
            <span className="leading-icon">{Icon.folder}</span>
            提出する本人確認書類
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { id: "運転免許証", desc: "表面・裏面および厚みスキャンを行います。", rec: true },
              { id: "マイナンバーカード", desc: "顔写真のある表面のみを撮影します。", rec: false },
              { id: "在留カード", desc: "外国籍の方はこちらをご用意ください。", rec: false },
            ].map((d) => (
              <div
                key={d.id}
                className={`select-card ${doc === d.id ? "active" : ""}`}
                onClick={() => setDoc(d.id)}
              >
                <div className="row">
                  <span className="badge neutral" style={{ fontSize: 12, padding: "4px 12px" }}>{d.id}</span>
                  {d.rec && <span className="badge info">推奨</span>}
                  {doc !== d.id && <div className="indicator" />}
                </div>
                <div className="meta" style={{ marginTop: 0 }}>
                  <span style={{ color: "var(--text-sub)" }}>{d.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="banner warning">
          <span className="icon">{Icon.alert}</span>
          <div>
            お手元に書類をご用意のうえ「次へ」を押してください。撮影中の中断はできません。
          </div>
        </div>

        <button className="btn btn-cta full" onClick={onNext}>
          {doc} で本人確認を開始
          <span aria-hidden="true">{Icon.chevron}</span>
        </button>
        <button className="btn btn-neutral full" onClick={onBack} style={{ marginTop: -8 }}>
          戻る
        </button>
      </div>
    </div>
  );
}

/* ===============================================================
 * SCREEN 7 — eKYC 撮影 (3 phase + 完了)
 * =============================================================== */

export function EkycCaptureScreen({ onNext, onBack }: ScreenProps) {
  const [phase, setPhase] = React.useState(0);
  const phases = [
    { name: "書類の表面", instruction: "緑枠にカードを合わせてください", color: "#10b981", border: "#10b981" },
    { name: "書類の厚み", instruction: "書類を斜め 45° 傾けて撮影します", color: "#f59e0b", border: "#f59e0b" },
    { name: "セルフィー", instruction: "正面を向き、ゆっくりまばたきしてください", color: "#6366f1", border: "#6366f1" },
    { name: "照合完了", instruction: "本人確認システムと適合しました", color: "#10b981", border: "#10b981" },
  ];
  const p = phases[phase];

  return (
    <div className="phone" data-screen-label="07 本人確認 撮影">
      <AppHeader step={5} />
      <div className="screen">
        <div className="section-header">
          <span className="eyebrow">STEP 5 · eKYC 撮影</span>
          <h2>{p.name}</h2>
          <p className="lead">{p.instruction}</p>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          {["表面", "厚み", "セルフィー"].map((label, i) => (
            <div
              key={label}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                background: i <= phase || phase === 3 ? "var(--navigation-navy-500)" : "var(--background-3)",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>

        <div
          style={{
            background: "#0a0a0a",
            borderRadius: "var(--radius-xl)",
            aspectRatio: "4/5",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          {phase < 3 ? (
            <>
              {phase === 0 && (
                <div
                  style={{
                    width: "70%",
                    aspectRatio: "1.586/1",
                    border: `2px dashed ${p.border}`,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: 0,
                      right: 0,
                      height: 2,
                      background: p.border,
                      opacity: 0.6,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 10,
                      color: p.color,
                      background: "rgba(0,0,0,0.6)",
                      padding: "4px 8px",
                      borderRadius: 4,
                      fontWeight: 700,
                    }}
                  >
                    運転免許証 · 表面
                  </span>
                </div>
              )}
              {phase === 1 && (
                <div
                  style={{
                    width: "60%",
                    aspectRatio: "1.586/1",
                    border: `2px dashed ${p.border}`,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "rotate(8deg) skewX(-4deg)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: p.color,
                      background: "rgba(0,0,0,0.6)",
                      padding: "4px 8px",
                      borderRadius: 4,
                      fontWeight: 700,
                    }}
                  >
                    45° SLANT
                  </span>
                </div>
              )}
              {phase === 2 && (
                <div
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    border: `2px dashed ${p.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(99,102,241,0.08)",
                  }}
                >
                  <span style={{ fontSize: 11, color: p.color, fontWeight: 700 }}>
                    まばたき検知
                  </span>
                </div>
              )}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "rgba(0,0,0,0.7)",
                  padding: "8px 12px",
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#cbd5e1" }}>analyzing · phase {phase + 1}/3</span>
                <span style={{ color: "#10b981", fontWeight: 700 }}>● LIVE</span>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: "#10b981",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l5 5L20 7" />
                </svg>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>本人確認完了</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{p.instruction}</div>
            </div>
          )}
        </div>

        {phase < 3 ? (
          <button className="btn btn-primary full" onClick={() => setPhase(phase + 1)}>
            模擬スキャンを進める ({phase + 1}/3)
            <span aria-hidden="true">{Icon.chevron}</span>
          </button>
        ) : (
          <button className="btn btn-cta full" onClick={onNext}>
            健康告知へ進む
            <span aria-hidden="true">{Icon.chevron}</span>
          </button>
        )}
        <button className="btn btn-neutral full" onClick={onBack} style={{ marginTop: -8 }}>
          書類選択へ戻る
        </button>
      </div>
    </div>
  );
}

/* ===============================================================
 * SCREEN 8 — 健康告知
 * =============================================================== */

export function HealthScreen({ onNext, onBack }: ScreenProps) {
  const [answers, setAnswers] = React.useState<Record<number, string>>({ 1: "いいえ", 2: "いいえ" });
  const questions = [
    {
      id: 1,
      q: "最近 3 ヶ月以内に、医師から治療・投薬・検査の受診勧告を受けましたか？",
      desc: "要再検査などの精密検査指示を含みます。",
    },
    {
      id: 2,
      q: "これまでに、がん・心疾患・脳血管疾患・慢性腎不全等の重大な疾病で入院または手術歴がありますか？",
      desc: "医師の診断事実・措置状況を確認するプロセスです。",
    },
  ];
  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <div className="phone" data-screen-label="08 健康告知">
      <AppHeader step={6} />
      <div className="screen">
        <div className="section-header">
          <span className="eyebrow">STEP 6 · 健康告知</span>
          <h2>健康に関する告知</h2>
          <p className="lead">
            生命保険を組込型でご契約いただくために、必要最小限の健康告知にお答えください。
          </p>
        </div>

        {questions.map((item) => (
          <div key={item.id} className="card">
            <div className="card-title">
              <span className="badge neutral">告知 {item.id}</span>
            </div>
            <div className="qa">
              <div className="q">{item.q}</div>
              <p className="field-help">{item.desc}</p>
              <div className="yn">
                <button
                  className={`yes ${answers[item.id] === "はい" ? "active" : ""}`}
                  onClick={() => setAnswers({ ...answers, [item.id]: "はい" })}
                >
                  はい
                </button>
                <button
                  className={`no ${answers[item.id] === "いいえ" ? "active" : ""}`}
                  onClick={() => setAnswers({ ...answers, [item.id]: "いいえ" })}
                >
                  いいえ
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="banner info">
          <span className="icon">{Icon.info}</span>
          <div>
            告知内容に応じて、お引き受けできない場合や、保障内容を変更させていただく場合があります。
          </div>
        </div>

        <button className="btn btn-cta full" onClick={onNext} disabled={!allAnswered}>
          告知内容を登録して次へ
          <span aria-hidden="true">{Icon.chevron}</span>
        </button>
        <button className="btn btn-neutral full" onClick={onBack} style={{ marginTop: -8 }}>
          戻る
        </button>
      </div>
    </div>
  );
}

/* ===============================================================
 * SCREEN 9 — お申込み内容のご確認 (電子署名)
 * =============================================================== */

export function ConfirmScreen({ onNext, onBack }: ScreenProps) {
  return (
    <div className="phone" data-screen-label="09 申込内容の確認">
      <AppHeader step={7} />
      <div className="screen">
        <div className="section-header">
          <span className="eyebrow">STEP 7 · 内容確認</span>
          <h2>お申込み内容のご確認</h2>
          <p className="lead">
            ご入力内容に間違いがないかご確認ください。電子署名後はカード登録へ進みます。
          </p>
        </div>

        <div className="card">
          <div className="card-title">
            <span className="leading-icon">{Icon.user}</span>
            ご契約者情報
            <span className="badge success">入力検証合格</span>
          </div>
          <div className="kv">
            <div className="row"><span className="k">お名前</span><span className="v">山田 太郎 様</span></div>
            <div className="row"><span className="k">生年月日</span><span className="v">1987 年 4 月 12 日</span></div>
            <div className="row"><span className="k">ご登録住所</span><span className="v" style={{ maxWidth: 200 }}>東京都港区虎ノ門 1丁目 23-1</span></div>
            <div className="row"><span className="k">携帯番号</span><span className="v">090-1234-5678</span></div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <span className="leading-icon">{Icon.shield}</span>
            ご契約内容
          </div>
          <div className="kv">
            <div className="row"><span className="k">補償プラン</span><span className="v">標準プラン</span></div>
            <div className="row"><span className="k">対象商品</span><span className="v">2 商品（日本株式型 / 世界株式型）</span></div>
            <div className="row"><span className="k">契約合計お積立額</span><span className="v">¥50,000 / 月</span></div>
            <div className="row"><span className="k">月額保険料</span><span className="v" style={{ color: "var(--navigation-navy-500)" }}>¥806 / 月</span></div>
          </div>
        </div>

        <div className="card flat">
          <div className="card-title">電子的提供に関する重要約款および電子署名</div>
          <div className="terms-box">
            <p style={{ margin: 0 }}>
              【電子署名および約定承諾】
              <br />
              本お申込みは XXX 保険グループ契約交付に基づく重要な電磁約款です。ご提供いただいたお客様氏名「<strong>山田 太郎</strong>」が、スマホカメラ撮影の eKYC 本人確認システムにより厳密に検証され、本契約に同意したとみなされます。約款の主要条項は別途交付書面でもご確認いただけます。
            </p>
          </div>
          <div className="checkbox-row">
            <input type="checkbox" id="agree" defaultChecked />
            <label htmlFor="agree">
              電磁的交付規約、告知および約定内容を十分に確認し、契約上の電子署名同意に承諾いたします。
            </label>
          </div>
        </div>

        <button className="btn btn-cta full" onClick={onNext}>
          署名を確定し、カード登録・決済へ
          <span aria-hidden="true">{Icon.chevron}</span>
        </button>
        <button className="btn btn-neutral full" onClick={onBack} style={{ marginTop: -8 }}>
          入力画面に戻り修正する
        </button>
      </div>
    </div>
  );
}

/* ===============================================================
 * SCREEN 10 — カード登録・決済
 * =============================================================== */

export function PaymentScreen({ onNext, onBack }: ScreenProps) {
  return (
    <div className="phone" data-screen-label="10 カード登録・決済">
      <AppHeader step={8} />
      <div className="screen">
        <div className="section-header">
          <span className="eyebrow">STEP 8 · お支払い</span>
          <h2>クレジットカード情報</h2>
          <p className="lead">
            ご契約者本人名義のカードに限ります。受託安全ゲートウェイで承認のうえ登録します。
          </p>
        </div>

        <div className="banner warning">
          <span className="icon">{Icon.shield}</span>
          <div>
            <strong>ご契約者本人名義のカード限定（厳守）</strong>
            <br />
            ご家族の名義などでは受付処理ができません。<strong>山田 太郎</strong> 様と同一名義のカードをご利用ください。
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <span className="leading-icon">{Icon.card}</span>
            カード情報の入力
          </div>
          <hr className="card-divider" />
          <div className="field">
            <label className="field-label">カード番号</label>
            <input className="input" defaultValue="4988 4321 0123 9876" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field">
              <label className="field-label">有効期限</label>
              <input className="input" defaultValue="04 / 28" />
            </div>
            <div className="field">
              <label className="field-label">セキュリティコード</label>
              <input className="input" defaultValue="988" />
            </div>
          </div>
          <div className="field">
            <label className="field-label">カード名義人 (半角英字)</label>
            <input className="input" defaultValue="TARO YAMADA" />
          </div>
        </div>

        <div className="card flat">
          <div className="card-title">お引き落とし内容</div>
          <div className="kv">
            <div className="row"><span className="k">毎月の保険料</span><span className="v">¥806</span></div>
            <div className="row"><span className="k">引き落とし日</span><span className="v">毎月 27 日</span></div>
            <div className="row"><span className="k">初回引き落とし</span><span className="v">2026 年 6 月 27 日</span></div>
          </div>
        </div>

        <button className="btn btn-cta full" onClick={onNext}>
          カードを登録して、お申込みを確定する
          <span aria-hidden="true">{Icon.chevron}</span>
        </button>
        <button className="btn btn-neutral full" onClick={onBack} style={{ marginTop: -8 }}>
          内容確認に戻る
        </button>
      </div>
    </div>
  );
}

/* ===============================================================
 * SCREEN 11 — お申込み完了
 * =============================================================== */

export function CompleteScreen({ onBack }: ScreenProps) {
  return (
    <div className="phone" data-screen-label="11 完了">
      <AppHeader step={8} />
      <div className="screen" style={{ paddingTop: 40 }}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "20px 0" }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "var(--bg-success)",
              border: "3px solid var(--success-green-500)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--success-green-500)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l5 5L20 7" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--text-main)" }}>
              お申込み完了
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-sub)", lineHeight: 1.7, maxWidth: 280 }}>
              お申込みを正常に受け付けました。<br />
              審査完了後、ご案内書類とマイページ開設通知をメールでお送りします。
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <span className="leading-icon">{Icon.doc}</span>
            受付番号
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 18,
              fontWeight: 800,
              color: "var(--navigation-navy-500)",
              letterSpacing: "0.05em",
              textAlign: "center",
              padding: "8px 0",
            }}
          >
            TD-2026-0522-71834
          </div>
          <hr className="card-divider" />
          <div className="kv">
            <div className="row"><span className="k">お申込み日時</span><span className="v">2026/05/22 18:43</span></div>
            <div className="row"><span className="k">補償プラン</span><span className="v">標準プラン</span></div>
            <div className="row"><span className="k">月額保険料</span><span className="v">¥806</span></div>
            <div className="row"><span className="k">通知メール</span><span className="v">taro.yamada@example.jp</span></div>
          </div>
        </div>

        <div className="banner info">
          <span className="icon">{Icon.info}</span>
          <div>
            審査には通常 1〜3 営業日いただきます。結果はメールでお知らせします。
          </div>
        </div>

        <button className="btn btn-primary full" onClick={onBack}>
          サービスへ戻る
        </button>
      </div>
    </div>
  );
}

/* ===============================================================
 * Flow definition
 * =============================================================== */

export type FlowStep = {
  id: string;
  label: string;
  Component: React.ComponentType<ScreenProps>;
};

// id → Component の対応表 (順序は flow-meta.ts の FLOW_META に任せる)
const COMPONENTS: Record<string, React.ComponentType<ScreenProps>> = {
  guidance: GuidanceScreen,
  product: ProductScreen,
  plan: PlanScreen,
  info: CustomerInfoScreen,
  confirm1: CustomerInfoConfirmScreen,
  "ekyc-doc": EkycSelectScreen,
  "ekyc-cap": EkycCaptureScreen,
  health: HealthScreen,
  confirm2: ConfirmScreen,
  payment: PaymentScreen,
  done: CompleteScreen,
};

export const FLOW: FlowStep[] = FLOW_META.map((m) => ({
  ...m,
  Component: COMPONENTS[m.id],
}));
