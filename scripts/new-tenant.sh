#!/usr/bin/env bash
# ============================================================================
# new-tenant.sh — XXX 雛形から新規テナントを生成する
#
# 使い方:
#   ./scripts/new-tenant.sh <tenant>
#       例: ./scripts/new-tenant.sh aaa
#
#   --brand-label "AAA Corp"   ヘッダーに出すブランド名 (省略時: "<TENANT> Design System")
#   --brand-initial "A"         ヘッダー左上のマーク 1 文字 (省略時: 先頭1文字大文字)
#   --force                     既存の app/<tenant>/, components/<tenant>/ を上書き
#   --dry-run                   実行内容のみ表示、ファイルは触らない
#
# 動作:
#   1) app/xxx/ → app/<tenant>/ を複製
#   2) components/xxx/ → components/<tenant>/ を複製
#   3) コピーしたファイル内の xxx 文字列 (URL / import / CSS scope) を <tenant> に置換
#   4) components/site-header.tsx の TENANTS 配列に新エントリを挿入
#   5) app/page.tsx の TENANT_CARDS 配列 (汎用 TOP「ブランド別の運用」) に追加
#   6) app/layout.tsx の root に tokens.css の import を挿入
#   7) 結果を要約して表示
#
# 置換しないもの (意図的):
#   - "XXX" (大文字) というブランド表記 — 顧客提示用テキストは別途 /init-brand-tokens で
#   - React コンポーネント名 (例: TdfFlowPrototype) — テナント間で名前衝突しない
# ============================================================================

set -euo pipefail

# ---- リポジトリのルートに移動 ----
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${REPO_ROOT}"

# ---- 色付け (TTY のみ) ----
if [[ -t 1 ]]; then
  C_GREEN='\033[0;32m'; C_BLUE='\033[0;34m'; C_YELLOW='\033[0;33m'
  C_RED='\033[0;31m';   C_BOLD='\033[1m';    C_RESET='\033[0m'
else
  C_GREEN=''; C_BLUE=''; C_YELLOW=''; C_RED=''; C_BOLD=''; C_RESET=''
fi

log()  { printf "%b▸%b %s\n"  "${C_BLUE}"   "${C_RESET}" "$*"; }
ok()   { printf "%b✓%b %s\n"  "${C_GREEN}"  "${C_RESET}" "$*"; }
warn() { printf "%b!%b %s\n"  "${C_YELLOW}" "${C_RESET}" "$*"; }
err()  { printf "%b✗%b %s\n"  "${C_RED}"    "${C_RESET}" "$*" >&2; }

# ---- 引数パース ----
TENANT=""
BRAND_LABEL=""
BRAND_INITIAL=""
FORCE=0
DRY_RUN=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --brand-label)   BRAND_LABEL="$2"; shift 2 ;;
    --brand-initial) BRAND_INITIAL="$2"; shift 2 ;;
    --force)         FORCE=1; shift ;;
    --dry-run)       DRY_RUN=1; shift ;;
    -h|--help)
      sed -n '2,25p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    -*)
      err "未知のオプション: $1"; exit 2 ;;
    *)
      if [[ -z "${TENANT}" ]]; then TENANT="$1"
      else err "テナント名は1つだけ指定してください: $1"; exit 2
      fi
      shift ;;
  esac
done

if [[ -z "${TENANT}" ]]; then
  err "テナント名を指定してください。例: $0 aaa"
  exit 2
fi

# ---- テナント名のバリデーション ----
if ! [[ "${TENANT}" =~ ^[a-z][a-z0-9-]{0,31}$ ]]; then
  err "テナント名は英小文字で始まり、英小文字・数字・ハイフンのみ (1〜32文字): '${TENANT}'"
  exit 2
fi

if [[ "${TENANT}" == "xxx" ]]; then
  err "'xxx' は雛形テナント名のため使えません"
  exit 2
fi

# ---- デフォルト値 ----
TENANT_UPPER="$(printf '%s' "${TENANT}" | tr '[:lower:]' '[:upper:]')"
if [[ -z "${BRAND_LABEL}" ]];   then BRAND_LABEL="${TENANT_UPPER} Design System"; fi
if [[ -z "${BRAND_INITIAL}" ]]; then BRAND_INITIAL="${TENANT_UPPER:0:1}"; fi

# ---- 雛形存在チェック ----
if [[ ! -d "app/xxx" || ! -d "components/xxx" ]]; then
  err "雛形が見つかりません (app/xxx/, components/xxx/ が必要)"
  exit 1
fi

# ---- 既存チェック ----
if [[ -d "app/${TENANT}" || -d "components/${TENANT}" ]]; then
  if [[ "${FORCE}" -eq 1 ]]; then
    warn "既存の app/${TENANT}/, components/${TENANT}/ を上書きします (--force)"
  else
    err "テナント '${TENANT}' は既に存在します。上書きするなら --force を付けてください。"
    exit 1
  fi
fi

# ---- site-header.tsx に既存エントリがあるか確認 ----
HEADER_FILE="components/site-header.tsx"
if [[ ! -f "${HEADER_FILE}" ]]; then
  err "${HEADER_FILE} が見つかりません"
  exit 1
fi

# コメント行 (先頭が // で始まる行) は除外して "本物" のエントリだけを探す
EXISTING_ENTRY=0
if grep -vE '^\s*//' "${HEADER_FILE}" | grep -qE "pathPrefix:\s*\"/${TENANT}\""; then
  if [[ "${FORCE}" -eq 1 ]]; then
    warn "TENANTS 配列に既存の /${TENANT} エントリがあります。--force で除去して再追加します。"
    EXISTING_ENTRY=1
  else
    err "${HEADER_FILE} の TENANTS 配列に /${TENANT} エントリが既にあります。"
    exit 1
  fi
fi

# ---- 実行内容のサマリ ----
echo
printf "%b%s%b\n" "${C_BOLD}" "==== /new-tenant ====" "${C_RESET}"
echo "  tenant         : ${TENANT}"
echo "  brand label    : ${BRAND_LABEL}"
echo "  brand initial  : ${BRAND_INITIAL}"
echo "  force          : ${FORCE}"
echo "  dry-run        : ${DRY_RUN}"
echo

if [[ "${DRY_RUN}" -eq 1 ]]; then
  warn "dry-run: ファイルは変更しません。終了します。"
  exit 0
fi

# ==========================================================================
# Step 1: app/xxx/ → app/<tenant>/
# ==========================================================================
log "Step 1/4: app/xxx/ → app/${TENANT}/ を複製"

if [[ -d "app/${TENANT}" ]]; then
  rm -rf "app/${TENANT}"
fi
cp -R "app/xxx" "app/${TENANT}"

# .fuse_hidden* など GoogleDrive 同期残骸を除去
find "app/${TENANT}" -name ".fuse_hidden*" -delete 2>/dev/null || true
ok "app/${TENANT}/ を作成"

# ==========================================================================
# Step 2: components/xxx/ → components/<tenant>/
# ==========================================================================
log "Step 2/4: components/xxx/ → components/${TENANT}/ を複製"

if [[ -d "components/${TENANT}" ]]; then
  rm -rf "components/${TENANT}"
fi
cp -R "components/xxx" "components/${TENANT}"
find "components/${TENANT}" -name ".fuse_hidden*" -delete 2>/dev/null || true
ok "components/${TENANT}/ を作成"

# ==========================================================================
# Step 3: コピーしたファイル内の小文字 xxx → <tenant> 置換
#   置換対象 (パス / クラス / CSS 変数):
#     /xxx                → /<tenant>
#     @/components/xxx/   → @/components/<tenant>/
#     xxx-scope           → <tenant>-scope    (.xxx-scope も含む)
#     xxx-flow            → <tenant>-flow     (.xxx-flow も含む)
#     --xxx-              → --<tenant>-       (CSS 変数 prefix)
#
#   置換しない (意図的):
#     XXX (大文字)         → ブランド表記は手動 or /init-brand-tokens で
# ==========================================================================
log "Step 3/4: コピー先ファイル内の xxx 参照を ${TENANT} に置換"

# macOS の sed は -i に拡張子引数が必要、Linux GNU sed は -i だけで動く。
# 互換性のため Python で書く (このリポはどちらの環境でも触られる)。
# 引数はクォート付き heredoc を使うため環境変数で渡す (バックティック等の干渉を回避)。
NT_TENANT="${TENANT}" python3 <<'PYEOF'
import os, re, sys

tenant = os.environ["NT_TENANT"]
targets = []
for base in (f"app/{tenant}", f"components/{tenant}"):
    for root, _dirs, files in os.walk(base):
        for f in files:
            if f.startswith(".fuse_hidden"): continue
            ext = os.path.splitext(f)[1].lower()
            if ext in (".tsx", ".ts", ".css", ".js", ".jsx", ".md", ".mdx", ".json"):
                targets.append(os.path.join(root, f))

# 置換ルール: 順番が大事 (より具体的 → より一般的)
rules = [
    # URL パス: "/xxx" や "/xxx/..." を、クォート ", ', ` で囲まれた文脈に限定して捉える
    (re.compile(r'(["\'' + chr(0x60) + r'])/xxx(["\'' + chr(0x60) + r'/])'),
                                                    rf'\1/{tenant}\2'),
    # コメント内のパス参照: " /xxx", " /xxx/", "* /xxx" など (語境界で区切る)
    # 注意: 大文字 XXX は対象外
    (re.compile(r'(?<![A-Za-z0-9])/xxx(?=[/\s,.)`*"\'])'),
                                                    f'/{tenant}'),
    (re.compile(r'(?<![A-Za-z0-9])components/xxx(?=[/\s,.)`*"\'])'),
                                                    f'components/{tenant}'),
    (re.compile(r'(?<![A-Za-z0-9])app/xxx(?=[/\s,.)`*"\'])'),
                                                    f'app/{tenant}'),
    # import / require のパス
    (re.compile(r'@/components/xxx/'),              f'@/components/{tenant}/'),
    (re.compile(r'@/components/xxx(["\'' + chr(0x60) + r'])'),
                                                    rf'@/components/{tenant}\1'),
    (re.compile(r'@/app/xxx/'),                     f'@/app/{tenant}/'),
    # CSS スコープクラス
    (re.compile(r'\.xxx-scope\b'),                  f'.{tenant}-scope'),
    (re.compile(r'\bxxx-scope\b'),                  f'{tenant}-scope'),
    (re.compile(r'\.xxx-flow\b'),                   f'.{tenant}-flow'),
    (re.compile(r'\bxxx-flow\b'),                   f'{tenant}-flow'),
    # CSS 変数 prefix (--xxx-cta, --xxx-warm 等)
    (re.compile(r'--xxx-'),                         f'--{tenant}-'),
    (re.compile(r'var\(--xxx-'),                    f'var(--{tenant}-'),
]

total_changes = 0
changed_files = []
for path in targets:
    try:
        with open(path, encoding="utf-8") as fh:
            src = fh.read()
    except (UnicodeDecodeError, OSError):
        continue
    new = src
    for pat, repl in rules:
        new = pat.sub(repl, new)
    if new != src:
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(new)
        diff_count = sum(1 for a, b in zip(src.splitlines(), new.splitlines()) if a != b)
        diff_count += abs(len(src.splitlines()) - len(new.splitlines()))
        total_changes += diff_count
        changed_files.append(path)

print(f"  置換された行: 約 {total_changes}")
print(f"  変更ファイル: {len(changed_files)}")
for p in changed_files:
    print(f"    - {p}")
PYEOF

ok "xxx → ${TENANT} 置換完了"

# ==========================================================================
# Step 4: site-header.tsx の TENANTS 配列に新エントリを挿入
# ==========================================================================
log "Step 4/6: ${HEADER_FILE} に /${TENANT} エントリを追加"

NT_TENANT="${TENANT}" \
NT_HEADER="${HEADER_FILE}" \
NT_LABEL="${BRAND_LABEL}" \
NT_INITIAL="${BRAND_INITIAL}" \
NT_EXISTING="${EXISTING_ENTRY}" \
python3 <<'PYEOF'
import os, re, sys, pathlib

path     = pathlib.Path(os.environ["NT_HEADER"])
tenant   = os.environ["NT_TENANT"]
label    = os.environ["NT_LABEL"]
init     = os.environ["NT_INITIAL"]
existing = os.environ.get("NT_EXISTING", "0") == "1"

src = path.read_text(encoding="utf-8")

# --force で既存エントリを除去する場合: pathPrefix: "/<tenant>" を含むオブジェクトを丸ごと削除
if existing:
    # `{ ... pathPrefix: "/<tenant>" ... },` ブロックを正規表現でマッチ
    # 各エントリは "  {" で始まり "  }," で終わる (2スペースインデント)
    pattern = re.compile(
        r'^  \{\n'                                        # オブジェクト開始
        r'(?:    [^\n]*\n)*?'                             # 任意の内側行
        r'    pathPrefix:\s*"/' + re.escape(tenant) + r'",\n'  # マッチ対象のキー
        r'(?:    [^\n]*\n)*?'                             # 任意の内側行
        r'  \},\n',                                       # オブジェクト終了
        re.MULTILINE,
    )
    new_src, n = pattern.subn('', src)
    if n > 0:
        src = new_src
        print(f"  既存の /{tenant} エントリを {n} 個除去")

# アンカー: "// 将来の他社はここに追加 (例)" の行を見つけ、その前に挿入
anchor_re = re.compile(r'^(\s*)//\s*将来の他社はここに追加', re.MULTILINE)
m = anchor_re.search(src)

new_entry = (
    "  {\n"
    f'    pathPrefix: "/{tenant}",\n'
    f'    brandLabel: "{label}",\n'
    f'    brandInitial: "{init}",\n'
    f'    brandHref: "/{tenant}",\n'
    "    items: [\n"
    f'      {{ href: "/{tenant}", label: "TOP", match: "exact" }},\n'
    f'      {{ href: "/{tenant}/guidelines", label: "Guidelines", match: "exact" }},\n'
    f'      {{ href: "/{tenant}/components", label: "Components", match: "exact" }},\n'
    f'      {{ href: "/{tenant}/prototype", label: "Prototype", match: "exact" }},\n'
    f'      {{ href: "/{tenant}/windows", label: "Windows", match: "exact" }},\n'
    "    ],\n"
    "  },\n"
)

if m:
    insert_at = m.start()
    new_src = src[:insert_at] + new_entry + src[insert_at:]
else:
    # アンカーが無い場合は ']' の直前 (TENANTS 配列終端) に挿入
    arr_re = re.compile(r'(const\s+TENANTS\s*:\s*Tenant\[\]\s*=\s*\[)(.*?)(\]\s*;)', re.DOTALL)
    mm = arr_re.search(src)
    if not mm:
        print("ERROR: TENANTS 配列が見つかりませんでした", file=sys.stderr)
        sys.exit(1)
    body = mm.group(2).rstrip()
    if not body.endswith(","): body += ","
    new_body = body + "\n" + new_entry
    new_src = src[:mm.start(2)] + new_body + src[mm.end(2):]

path.write_text(new_src, encoding="utf-8")
print("  /" + tenant + " エントリを TENANTS 配列に追加 (brandLabel='" + label + "', brandInitial='" + init + "')")
PYEOF

ok "${HEADER_FILE} 更新完了"

# ==========================================================================
# Step 5: app/page.tsx の TENANT_CARDS 配列に新エントリを追加
#   (汎用 TOP「ブランド別の運用」セクション)
# ==========================================================================
HOME_FILE="app/page.tsx"
log "Step 5/6: ${HOME_FILE} の TENANT_CARDS に /${TENANT} エントリを追加"

NT_TENANT="${TENANT}" \
NT_HOME="${HOME_FILE}" \
NT_LABEL="${BRAND_LABEL}" \
python3 <<'PYEOF'
import os, re, pathlib, sys

path   = pathlib.Path(os.environ["NT_HOME"])
tenant = os.environ["NT_TENANT"]
label  = os.environ["NT_LABEL"]

src = path.read_text(encoding="utf-8")

# 既存エントリを除去 (--force 想定 / 冪等性のため毎回除去 → 再追加)
# `  { id: "<tenant>", ... },` をブロック単位で削除
block_re = re.compile(
    r'^  \{\n'
    r'(?:    [^\n]*\n)*?'
    r'    id:\s*"' + re.escape(tenant) + r'",\n'
    r'(?:    [^\n]*\n)*?'
    r'  \},\n',
    re.MULTILINE,
)
src_after_rm, n_rm = block_re.subn('', src)
if n_rm > 0:
    print(f"  既存の id: \"{tenant}\" エントリを {n_rm} 個除去")
    src = src_after_rm

# アンカー: `  // 新規テナントはここに追加 (new-tenant.sh で自動挿入)` 行の直前に挿入
anchor_re = re.compile(r'^(\s*)//\s*新規テナントはここに追加', re.MULTILINE)
m = anchor_re.search(src)

new_entry = (
    "  {\n"
    f'    id: "{tenant}",\n'
    f'    label: "{label}",\n'
    f'    title: "{label} ガイドライン",\n'
    f'    description:\n'
    f'      "tokens.css の 4 スケール (primary / secondary / button / cta) で構成される {label} 専用テナント。色は自動反映。",\n'
    f'    href: "/{tenant}/guidelines",\n'
    f'    path: "/{tenant}/guidelines",\n'
    "  },\n"
)

if m:
    insert_at = m.start()
    new_src = src[:insert_at] + new_entry + src[insert_at:]
else:
    # アンカーがない場合: TENANT_CARDS 配列の末尾 ']' 直前に挿入
    arr_re = re.compile(r'(const\s+TENANT_CARDS\s*:\s*TenantCardData\[\]\s*=\s*\[)(.*?)(\]\s*;)', re.DOTALL)
    mm = arr_re.search(src)
    if not mm:
        print("ERROR: TENANT_CARDS 配列が見つかりません", file=sys.stderr)
        sys.exit(1)
    body = mm.group(2).rstrip()
    if not body.endswith(","): body += ","
    new_body = body + "\n" + new_entry
    new_src = src[:mm.start(2)] + new_body + src[mm.end(2):]

path.write_text(new_src, encoding="utf-8")
print(f"  /{tenant} エントリを TENANT_CARDS に追加 (label='{label}')")
PYEOF

ok "${HOME_FILE} 更新完了"

# ==========================================================================
# Step 6: app/layout.tsx に tokens.css の import を追加
#   (root layout でグローバル import することで、汎用 TOP の AutoTenantCard が
#    getComputedStyle() で CSS var を読み取れるようにする)
# ==========================================================================
LAYOUT_FILE="app/layout.tsx"
log "Step 6/6: ${LAYOUT_FILE} に @/components/${TENANT}/tokens.css の import を追加"

NT_TENANT="${TENANT}" \
NT_LAYOUT="${LAYOUT_FILE}" \
python3 <<'PYEOF'
import os, re, pathlib

path   = pathlib.Path(os.environ["NT_LAYOUT"])
tenant = os.environ["NT_TENANT"]

src = path.read_text(encoding="utf-8")
import_line = f'import "@/components/{tenant}/tokens.css";\n'

# 既に存在すれば何もしない (冪等)
if import_line.strip() in src:
    print(f"  既に @/components/{tenant}/tokens.css の import が存在 — スキップ")
else:
    # アンカー: `// 新規テナントの tokens.css はここに追加` の直前に挿入
    anchor_re = re.compile(r'^(\s*)//\s*新規テナントの tokens\.css はここに追加', re.MULTILINE)
    m = anchor_re.search(src)
    if m:
        insert_at = m.start()
        new_src = src[:insert_at] + import_line + src[insert_at:]
        path.write_text(new_src, encoding="utf-8")
        print(f"  @/components/{tenant}/tokens.css を root layout に import")
    else:
        print(f"  WARN: anchor not found in {path}; 手動で import を追加してください")
PYEOF

ok "${LAYOUT_FILE} 更新完了"

# ==========================================================================
# サマリ
# ==========================================================================
echo
printf "%b%s%b\n" "${C_BOLD}${C_GREEN}" "==== 完了 ====" "${C_RESET}"
echo "  作成: app/${TENANT}/"
echo "  作成: components/${TENANT}/"
echo "  更新: ${HEADER_FILE}      (TENANTS 配列にナビ追加)"
echo "  更新: ${HOME_FILE}        (TENANT_CARDS に「ブランド別の運用」カード追加)"
echo "  更新: ${LAYOUT_FILE}     (tokens.css を root に import)"
echo
echo "次の手順:"
echo "  1. pnpm dev で http://localhost:3000/${TENANT} を確認"
echo "  2. http://localhost:3000/ の「ブランド別の運用」にカードが現れるか確認"
echo "  3. components/${TENANT}/tokens.css でブランドカラーを編集"
echo "     (将来 /init-brand-tokens スキルで自動化予定)"
echo "  4. app/${TENANT}/page.tsx の hero テキストを ${BRAND_LABEL} 用に調整"
echo "  5. git add -A && git commit -m \"feat: add ${TENANT} tenant\""
echo
