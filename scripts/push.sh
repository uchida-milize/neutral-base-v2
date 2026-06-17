#!/usr/bin/env bash
#
# neutral-base 手動コミット&プッシュ ヘルパー（うちだ専用）
# --------------------------------------------------------------
# Cowork は編集のみ。git add/commit/push はこのスクリプトで手動実行する方針。
#
# 使い方:
#   ./scripts/push.sh "コミットメッセージ"
#   ./scripts/push.sh                 # メッセージ省略時は既定文言
#
# やること:
#   1) repo ルートへ移動（gotcha #31: 親の迷子 git を拾わない）
#   2) FUSE 残りロック解除
#   3) GoogleDrive(FUSE) シャドウファイル .fuse_hidden* を掃除
#   4) git add -A → status 表示 → commit → push
# --------------------------------------------------------------

# このスクリプトの場所を基準に repo ルートへ（どこから呼んでも安全）
cd "$(dirname "$0")/.." || exit 1
echo "repo: $(git rev-parse --show-toplevel)"

# FUSE 残りロック解除（あれば）
rm -f .git/index.lock

# GoogleDrive(FUSE) シャドウファイルを掃除
find . -path ./node_modules -prune -o -name '.fuse_hidden*' -print -delete

# コミットメッセージ（引数 > 既定）。1行推奨（複数行は稀に固まる: gotcha #8）
MSG="${1:-chore: 更新}"

git add -A
git --no-pager status
git commit -m "$MSG"
git push

echo "✅ push 完了"
