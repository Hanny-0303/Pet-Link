#!/bin/bash
# 双击这个文件 = 把本地的新改动推送到 GitHub，Vercel 会自动重新部署
# 如果登录凭据失效，会自动带你重新登录一次

cd "$(dirname "$0")" || exit 1
ROOT="$PWD"
GH="$ROOT/.tooling/gh/gh"
export PATH="$ROOT/.tooling/gh:$PATH"

clear
echo "=================================================="
echo "   同步到 GitHub"
echo "=================================================="
echo

if [ ! -x "$GH" ]; then
  echo "❌ 找不到 GitHub CLI（.tooling/gh/gh），请让 AI 重新安装。"
  read -r -p "按回车关闭…" _
  exit 1
fi

# ── 1. 检查登录状态，失效就重新登录 ────────────────────────
if ! "$GH" auth status --hostname github.com >/dev/null 2>&1; then
  echo "⚠️  登录凭据已失效，需要重新登录一次（只有这一次）。"
  echo
  echo "  接下来会打开浏览器："
  echo "   1. 终端显示一个 8 位验证码，已自动复制"
  echo "   2. 浏览器里粘贴，点绿色的 Authorize"
  echo "   3. 回到这个窗口，可能还要按一次回车"
  echo
  read -r -p "按回车开始登录…" _

  # 先清掉失效的旧凭据，避免弹「是否重新认证」的追问
  "$GH" auth logout --hostname github.com >/dev/null 2>&1

  if ! "$GH" auth login --hostname github.com --git-protocol https --web; then
    echo
    echo "❌ 登录没有完成，重新双击这个脚本再试一次。"
    read -r -p "按回车关闭…" _
    exit 1
  fi
  echo
  echo "✅ 登录成功"
fi

# 让 git 用 gh 的凭据（会覆盖失效的旧配置）
"$GH" auth setup-git >/dev/null 2>&1

# ── 2. 有未提交的改动就先提交 ──────────────────────────────
CHANGES=$(git status --porcelain)
if [ -n "$CHANGES" ]; then
  echo
  echo "检测到未提交的改动："
  printf '%s\n' "$CHANGES" | sed 's/^/   /'
  echo
  read -r -p "提交说明（直接回车 = update）: " MSG
  MSG=${MSG:-update}
  git add -A
  git commit -q -m "$MSG"
  echo "✅ 已提交"
fi

# ── 3. 推送 ───────────────────────────────────────────────
echo
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
  echo "❌ 推送仍然失败"
  echo
  echo "   把上面红色的报错整段发给 AI。"
  echo "   也可以双击 上传到GitHub.command 走完整体检流程。"
  echo "=================================================="
fi

echo
read -r -p "按回车关闭…" _
