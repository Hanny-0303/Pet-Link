#!/bin/bash
# 双击这个文件 = 把本地的新改动推送到 GitHub，Vercel 会自动重新部署

cd "$(dirname "$0")" || exit 1
export PATH="$PWD/.tooling/gh:$PATH"

clear
echo "=================================================="
echo "   同步到 GitHub"
echo "=================================================="
echo

CHANGES=$(git status --porcelain)
if [ -n "$CHANGES" ]; then
  echo "检测到未提交的改动："
  printf '%s\n' "$CHANGES" | sed 's/^/   /'
  echo
  read -r -p "提交说明（直接回车 = update）: " MSG
  MSG=${MSG:-update}
  git add -A
  git commit -q -m "$MSG"
  echo "✅ 已提交"
  echo
fi

echo "正在推送…"
echo

if git push 2>&1; then
  echo
  echo "=================================================="
  echo "✅ 推送成功"
  echo
  echo "   Vercel 会在大约 1 分钟内自动重新部署"
  echo "   网址不变：https://pet-link-kohl.vercel.app"
  echo
  echo "   仓库：https://github.com/Hanny-0303/Pet-Link"
  echo "=================================================="
else
  echo
  echo "=================================================="
  echo "❌ 推送失败"
  echo
  echo "  多半是登录凭据过期了。"
  echo "  双击 上传到GitHub.command 重新登录一次就好。"
  echo "=================================================="
fi

echo
read -r -p "按回车关闭…" _
