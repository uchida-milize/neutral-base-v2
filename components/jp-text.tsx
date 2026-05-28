import * as React from "react";

/**
 * JpText — 日本語の見出し用、読点/句点での「意味のある改行」ヘルパー。
 *
 * 例:
 *   <h1>
 *     <JpText>信頼を、もっと触れる距離に。</JpText>
 *   </h1>
 *
 * 仕組み:
 *   入力文字列を「、」「。」の直後で分割し、各セグメントを
 *   <span className="inline-block"> でラップする。ブラウザが折り返すときに
 *   セグメント単位で改行されるため、読点・句点の途中で行が割れない。
 *
 *   例: "どのブランドにも先に通すべき、共通の土台。" の場合:
 *     segments = ["どのブランドにも先に通すべき、", "共通の土台。"]
 *   → 狭い幅に収まらない時、ブラウザは "、" の後 (= セグメント間) で
 *     改行を選ぶようになる。
 *
 * デリミタ:
 *   - 「、」(全角読点)
 *   - 「。」(全角句点)
 *   - 「！」「？」(全角感嘆/疑問符)  ← 文末によくあるため
 *
 * 注意:
 *   - children は string 限定 (太字等のインラインタグを含めたい場合は
 *     呼び出し側で分割して渡す)
 *   - 読点/句点を含まない短い見出し (例: "Guidelines") は単一セグメントとして
 *     そのまま描画される (副作用なし)
 */
export function JpText({ children }: { children: string }) {
  // 読点/句点の直後で分割 (lookbehind 使用、JavaScript / ECMA2018+)
  const segments = children.split(/(?<=[、。！？])/);

  return (
    <>
      {segments.map((seg, i) => (
        <span key={i} className="inline-block">
          {seg}
        </span>
      ))}
    </>
  );
}
