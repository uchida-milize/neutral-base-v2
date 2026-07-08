import type { Metadata } from "next";
import { AccessibilityIcon, TypeIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SectionHeading,
  Section,
} from "@/components/guidelines/theo-tdf-shared";

export const metadata: Metadata = {
  title: "アクセシビリティ | ガイドライン | THEO × T&Dファイナンシャル 組込",
  description:
    "WCAG 2.2 AA 準拠・コントラスト比・フォントサイズ・Tone & Content ルール。",
};

export default function AccessibilityPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
      <AccessibilityRules />
      <ContentRules />
    </main>
  );
}

/* ---------------------------------------------------------------- */
/* アクセシビリティ                                                   */
/* ---------------------------------------------------------------- */

function AccessibilityRules() {
  return (
    <Section id="a11y">
      <SectionHeading
        eyebrow="Accessibility"
        title="WCAG 2.2 AA 準拠。年齢・習熟度を問わず操作できることを最低条件とする"
        description="契約者の年齢層やデバイス習熟度にかかわらず、UI が破綻しないことを最低条件とします。WCAG 2.2 AA を基準とし、コントラスト・タップ領域・フォームの入力補助を実装レベルで担保します。"
        audience="both"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-none transition-colors duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-md bg-accent text-accent-foreground">
                <AccessibilityIcon className="size-4" />
              </span>
              <CardTitle className="text-h4">コントラスト比</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-body text-muted-foreground">
            <p>
              本文 (body / body-lg): <strong className="text-foreground">4.5 : 1 以上</strong>を必須。
              18px 以上の太字または 24px 以上の通常文字は 3 : 1 を許容。
            </p>
            <p>
              UI コンポーネント (ボタンの外周線、フォームの境界): 3 : 1 以上。
            </p>
            <p>
              Sky Blue <code>#1aa5dc</code> on 白 = <strong>2.8 : 1</strong>（本文 AA 4.5:1 / UI 3:1 とも未達。要確認）。
              通常ボタンは白文字を青系の面・グラデーション上に置くが、グラデーション終端の <code>#7fd0f0</code> は 1.7 : 1 まで低下する。
              純赤 (secondary-color-700 系) はアラート・エラー・必須表示専用で、通常ボタンや申込確定には使わない。
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none transition-colors duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-md bg-accent text-accent-foreground">
                <TypeIcon className="size-4" />
              </span>
              <CardTitle className="text-h4">フォントサイズ</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-body text-muted-foreground">
            <p>
              60 代以上向けの導線 (申込フォーム / 約款) は{" "}
              <strong className="text-foreground">body-lg (15px) 以上</strong>を既定とする。
            </p>
            <p>
              caption (12px) と eyebrow (11px) は補助/装飾専用。
              意味を伝える情報には使わない。
            </p>
            <p>
              ブラウザの拡大率を 200% にしてもレイアウトが崩れないこと
              (水平スクロール禁止)。
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none transition-colors duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-h4">タッチターゲット</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-body text-muted-foreground">
            <p>
              モバイル ボタン: <strong className="text-foreground">44 × 44 px 以上</strong>。
              Portal の cta / primary は h=40px だが、タップ領域は周囲 padding を含めて 44px を確保する。
            </p>
            <p>リンク / アイコンボタンの間隔は最低 8px、隣接タップの誤操作を防ぐ。</p>
          </CardContent>
        </Card>

        <Card className="shadow-none transition-colors duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-h4">フォーカス可視化</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-body text-muted-foreground">
            <p>
              キーボード操作時のフォーカスリングは必ず表示。
              focus-visible のリング色は navy ベースに統一（CTA も含め、全ボタンで共通）。
            </p>
            <p>
              色だけで状態を伝えない。エラーは color + テキスト + アイコンの 3 重で示す
              (例: Portal の StatusBadge は 5 種類の意味色 × ラベル文字)。
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 視認性プレビュー */}
      <Card className="mt-6 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-h4">サイズ感の比較 (theo-tdf 推奨)</CardTitle>
          <CardDescription>
            60 代以上の主要導線は左の body-lg を既定としてください。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md border border-border p-4 transition-colors duration-300">
            <p className="text-caption font-medium text-primary">推奨 (body-lg 15px)</p>
            <p className="mt-2" style={{ fontSize: 15 }}>
              ご契約内容の確認はこちらから。
            </p>
          </div>
          <div className="rounded-md border border-border p-4 transition-colors duration-300">
            <p className="text-caption font-medium text-muted-foreground">標準 (body 14px)</p>
            <p className="mt-2" style={{ fontSize: 14 }}>
              ご契約内容の確認はこちらから。
            </p>
          </div>
          <div className="rounded-md border border-border p-4 transition-colors duration-300">
            <p className="text-caption font-medium" style={{ color: "var(--cta-color-600)" }}>
              非推奨 (caption 12px)
            </p>
            <p className="mt-2" style={{ fontSize: 12 }}>
              ご契約内容の確認はこちらから。
            </p>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* Content rules                                                      */
/* ---------------------------------------------------------------- */

function ContentRules() {
  return (
    <Section id="content">
      <SectionHeading
        eyebrow="Voice & Content"
        title="Tone：です・ます統一。Content：数値・仕様は一次ソースから"
        description="語調（Tone）と内容の誠実さ（Content）は別の問題として扱います。語尾を『です・ます』に統一しつつ、文言の根拠には必ず一次ソースを置き、誇張・推測を混入させません。"
        audience="designer"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-none transition-colors duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-h4">言語・トーン</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-body text-muted-foreground">
            <p>日本語が一次言語。コンポーネント名は英語、UI 文言は日本語。</p>
            <p>「です・ます」調で統一。命令形は使わない。</p>
            <p>「あなた」「私」など人称は基本使わず、無人称的に書く。</p>
            <p>
              絵文字は使わない。アイコンは lucide-react に統一。
              ステータスバッジは英単語 (Active / Trial / Suspended …)。
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none transition-colors duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-h4">具体例</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-body text-muted-foreground">
            <p>
              <strong className="text-foreground">成功:</strong>{" "}
              「保存が完了しました」/ 「変更内容はすべてサーバーに反映されました。」
            </p>
            <p>
              <strong className="text-foreground">エラー:</strong>{" "}
              「エラーが発生しました」/ 「サーバーに接続できません。ネットワークをご確認ください。」
            </p>
            <p>
              <strong className="text-foreground">確認:</strong>{" "}
              「本当に削除しますか？」 / 「この操作は取り消せません。」
            </p>
            <p>
              <strong className="text-foreground">警告:</strong>{" "}
              「ご注意」 / 「パスワードの有効期限が 3 日以内に切れます。」
            </p>
            <p>
              <strong className="text-foreground">ボタン:</strong>{" "}
              「保存」「キャンセル」「削除する」「やめる」「編集」「作成する」
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none transition-colors duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-h4">ケース・記号</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-body text-muted-foreground">
            <p>
              日本語と英数字の間に <strong>半角スペースは入れない</strong>。
              ただし数値と単位の間にはスペースを入れる: 「12 月 25 日」「87.4 %」「162 件」。
            </p>
            <p>句点は <strong>。</strong> (全角)、読点は <strong>、</strong> (全角) を使用。</p>
            <p>数値のシンボルは半角: +12.3% / ¥1,200。</p>
          </CardContent>
        </Card>

        <Card className="shadow-none transition-colors duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-h4">雰囲気 (Vibe)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-body text-muted-foreground">
            <p>業務系・金融系のフォーマル。エンタープライズ管理画面のトーン。</p>
            <p>親しみよりも正確さ・信頼感を優先する。</p>
            <p>余白は十分に取り、密度はミドル〜高。テーブルとフォームが主役。</p>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
