#!/bin/bash
# 双击这个文件 = 把本地的新改动推送到 GitHub，Vercel 会自动重新部署
# 直连不通时会自动走系统代理重试

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

# ── 3. 找出系统代理（macOS 的系统代理 git 默认不会用）──────
detect_proxy() {
  local host port
  host=$(scutil --proxy 2>/dev/null | awk -F' : ' '/HTTPSProxy/{print $2; exit}')
  port=$(scutil --proxy 2>/dev/null | awk -F' : ' '/HTTPSPort/{print $2; exit}')
  if [ -z "$host" ] || [ -z "$port" ]; then
    host=$(scutil --proxy 2>/dev/null | awk -F' : ' '/HTTPProxy/{print $2; exit}')
    port=$(scutil --proxy 2>/dev/null | awk -F' : ' '/HTTPPort/{print $2; exit}')
  fi
  [ -z "$host" ] || [ -z "$port" ] && return 1
  nc -z "$host" "$port" >/dev/null 2>&1 || return 1
  echo "http://$host:$port"
}

PROXY=$(detect_proxy || true)

# ── 4. 推送：先直连，失败再走代理 ──────────────────────────
echo
echo "正在推送…"
echo

FASTFAIL="-c http.lowSpeedLimit=1000 -c http.lowSpeedTime=25"

if git $FASTFAIL push 2>/dev/null; then
  PUSHED=1
else
  if [ -n "$PROXY" ]; then
    echo "直连 GitHub 失败，改用系统代理重试（$PROXY）…"
    echo
    if git -c http.proxy="$PROXY" -c https.proxy="$PROXY" $FASTFAIL push 2>&1; then
      PUSHED=1
      echo
      echo "ℹ️  这次是靠代理推上去的。以后推送建议先把代理开着。"
    else
      PUSHED=0
    fi
  else
    PUSHED=0
    echo "直连失败，而且没检测到可用的系统代理。"
  fi
fi

echo
if [ "$PUSHED" = "1" ]; then
  echo "=================================================="
  echo "✅ 推送成功"
  echo
  echo "   Vercel 会在大约 1 分钟内自动重新部署"
  echo "   网址不变：https://pet-link-kohl.vercel.app"
  echo
  echo "   仓库：https://github.com/Hanny-0303/Pet-Link"
  echo "=================================================="
else
  echo "=================================================="
  echo "❌ 推送失败"
  echo
  echo "  如果是 SSL / 连接超时 / 443 这类报错，说明网络连不上 GitHub："
  echo "   1. 把代理软件（Clash / Shadowrocket 等）打开，确认是「全局」或规则里有 GitHub"
  echo "   2. 再双击一次这个脚本，它会自动走代理"
  echo
  echo "  如果是 401 / Authentication 这类报错，说明凭据失效："
  echo "   双击 上传到GitHub.command 重新登录"
  echo "=================================================="
fi

echo
read -r -p "按回车关闭…" _
