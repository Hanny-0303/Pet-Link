#!/bin/bash
# 双击这个文件 = 用浏览器登录 GitHub，然后把项目推上去
# 不需要任何 Token

cd "$(dirname "$0")" || exit 1
ROOT="$PWD"
cd "$ROOT" || exit 1

GH="$ROOT/.tooling/gh/gh"
if [ ! -x "$GH" ]; then
  echo "❌ 找不到 GitHub CLI（.tooling/gh/gh），请让 AI 重新安装。"
  read -r -p "按回车关闭…" _
  exit 1
fi
export PATH="$ROOT/.tooling/gh:$PATH"

clear
echo "=================================================="
echo "   上传到 GitHub · Hanny-0303/Pet-Link"
echo "   方式：浏览器登录（不用 Token）"
echo "=================================================="
echo
echo "接下来会："
echo "  1. 终端里显示一个 8 位的验证码，并自动复制到剪贴板"
echo "  2. 自动打开浏览器，粘贴验证码，点绿色的 Authorize 按钮"
echo "  3. 回到终端，自动上传"
echo
echo "中途可能会问一两个问题，全部直接按回车就行（默认都是对的）。"
echo
read -r -p "准备好后按回车开始…" _

echo
# 如果已经登录过，直接跳过
if "$GH" auth status --hostname github.com >/dev/null 2>&1; then
  echo "✅ 已经是登录状态，跳过登录。"
else
  "$GH" auth logout --hostname github.com >/dev/null 2>&1

  if ! "$GH" auth login --hostname github.com --git-protocol https --web; then
    echo
    echo "❌ 登录没有完成。重新双击这个脚本再试一次即可。"
    read -r -p "按回车关闭…" _
    exit 1
  fi
fi

echo
echo "正在确认登录状态…"
LOGIN=$("$GH" api user -q .login 2>/dev/null)
if [ -z "$LOGIN" ]; then
  echo "❌ 登录状态异常，没能读到账号信息。重新双击脚本再试。"
  read -r -p "按回车关闭…" _
  exit 1
fi
echo "✅ 已登录，账号：$LOGIN"

if [ "$LOGIN" != "Hanny-0303" ]; then
  echo
  echo "⚠️  登录的账号是「$LOGIN」，不是 Hanny-0303。"
  echo "   推到 Hanny-0303 的仓库通常需要协作者权限，可能会失败。"
  echo
  read -r -p "仍然继续？(y/N) " GO
  if [ "$GO" != "y" ] && [ "$GO" != "Y" ]; then
    echo "已取消。"
    read -r -p "按回车关闭…" _
    exit 1
  fi
fi

# 把凭据存进 macOS 钥匙串，这样以后在任何终端里 git push 都不用再登录
TOKEN=$("$GH" auth token 2>/dev/null)
if [ -n "$TOKEN" ]; then
  git config --global credential.helper osxkeychain 2>/dev/null
  printf "protocol=https\nhost=github.com\nusername=%s\npassword=%s\n" "$LOGIN" "$TOKEN" \
    | git credential-osxkeychain store 2>/dev/null
fi
unset TOKEN

echo
echo "正在上传…"
echo

git push -u origin main
STATUS=$?

echo
if [ "$STATUS" -eq 0 ]; then
  echo "=================================================="
  echo "✅ 上传成功"
  echo
  echo "   仓库地址：https://github.com/Hanny-0303/Pet-Link"
  echo
  echo "   下一步：去 Vercel 把这个仓库变成网站"
  echo "   1. 打开 https://vercel.com/new"
  echo "   2. 用 GitHub 账号登录"
  echo "   3. 找到 Pet-Link，点 Import"
  echo "   4. 什么都不用改，直接点 Deploy"
  echo "   5. 等两分钟，拿到 https:// 开头的网址"
  echo "=================================================="
  "$GH" auth setup-git 2>/dev/null
  open "https://github.com/Hanny-0303/Pet-Link"
else
  echo "=================================================="
  echo "❌ 上传失败，把上面的报错整段发给 AI。"
  echo "=================================================="
fi

echo
read -r -p "按回车关闭…" _
