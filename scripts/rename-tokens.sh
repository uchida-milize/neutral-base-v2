#!/usr/bin/env bash
# ============================================================================
# rename-tokens.sh — CSS 変数名のリネーム (一括)
#
#   --navigation-navy-* → --primary-color-*
#   --primary-blue-*    → --secondary-color-*
#   --cta-amber-*       → --button-color-*
#
# 対象: app/, components/ 配下の .css / .tsx / .ts / .jsx / .js / .md
# 実行: ./scripts/rename-tokens.sh [--dry-run]
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${REPO_ROOT}"

DRY_RUN=0
if [[ "${1:-}" == "--dry-run" ]]; then DRY_RUN=1; fi
export DRY_RUN

echo "▸ リネーム対象を走査中... (DRY_RUN=${DRY_RUN})"

python3 <<'PYEOF'
import os, re, sys

dry_run = os.environ.get("DRY_RUN", "0") == "1"
print(f"  Python 側 dry_run = {dry_run}")

# 順番が大事:
# 1) 古い名前を全て一時マーカーに置き換える (相互衝突回避)
# 2) 一時マーカーを新しい名前に置き換える
#
# プレフィックスの "--", "var(--", クラス参照 ".navigation-navy" 等は
# まとめて文字列単位で扱う。
rules = [
    # 旧変数名 → 新変数名 (CSS カスタムプロパティ名)
    ("navigation-navy", "primary-color"),
    ("primary-blue",    "secondary-color"),
    ("cta-amber",       "button-color"),
]

# 走査対象
target_exts = (".css", ".tsx", ".ts", ".jsx", ".js", ".md", ".mdx")
target_dirs = ["app", "components"]

# ワード境界の判定: ハイフンは含めない (CSS 変数は --navigation-navy-10 のように
# 両側がハイフンで囲まれるため、ハイフンを境界に含めるとマッチしなくなる)。
# 英数字・アンダースコアで連続していなければ独立したトークンとみなす。
def make_pattern(old):
    return re.compile(r'(?<![A-Za-z0-9_])' + re.escape(old) + r'(?![A-Za-z0-9_])')

total_changes = 0
changed_files = []

targets = []
for d in target_dirs:
    for root, _dirs, files in os.walk(d):
        for f in files:
            if f.startswith(".fuse_hidden"): continue
            if os.path.splitext(f)[1].lower() in target_exts:
                targets.append(os.path.join(root, f))

for path in sorted(targets):
    try:
        with open(path, encoding="utf-8") as fh:
            src = fh.read()
    except (UnicodeDecodeError, OSError):
        continue

    new = src
    file_changes = 0
    for old, _new in rules:
        pat = make_pattern(old)
        matches = pat.findall(new)
        if matches:
            file_changes += len(matches)

    # 実際の置換: 一時マーカー方式 (rules 順に独立置換)
    for old, new_name in rules:
        pat = make_pattern(old)
        new = pat.sub(new_name, new)

    if new != src:
        changed_files.append((path, file_changes))
        total_changes += file_changes
        if not dry_run:
            with open(path, "w", encoding="utf-8") as fh:
                fh.write(new)

print(f"  置換回数 (全合計): {total_changes}")
print(f"  変更ファイル数:    {len(changed_files)}")
for p, n in changed_files:
    print(f"    {n:>4}× {p}")

if dry_run:
    print("\n  [dry-run] 実際の書き込みは行いませんでした。")
PYEOF
