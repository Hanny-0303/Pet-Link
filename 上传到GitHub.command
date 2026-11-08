#!/bin/bash
# 双击这个文件 = 把项目上传到 GitHub 的 Pet-Link 仓库

cd "$(dirname "$0")" || exit 1
ROOT="$PWD"
cd "$ROOT" || exit 1

clear
echo "=================================================="
echo "   上传到 GitHub · Hanny-0303/Pet-Link"
echo "=================================================="
echo
echo "需要一串「个人访问令牌」（Token），代替密码用。"
echo "没有的话现在去申请，一分钟："
echo
echo "  1. 浏览器打开  https://github.com/settings/tokens/new"
echo "  2. Note 随便填，比如  pet-link"
echo "  3. Expiration 选 90 days"
echo "  4. 下面勾选  [repo]   （只要这一个）"
echo "  5. 拉到最下面点  Generate token"
echo "  6. 复制那串 ghp_ 开头的字符（只显示一次，关掉就看不到了）"
echo
read -r -p "准备好后按回车继续…" _

echo
read -r -p "GitHub 用户名（直接回车 = Hanny-0303）: " GH_USER
GH_USER=${GH_USER:-Hanny-0303}

echo
echo "把 Token 粘贴进来，然后按回车。"
echo "（屏幕上不会显示任何字符，这是正常的，不是卡住了）"
read -rsp "Token: " GH_TOKEN
echo
echo
echo "已收到 Token（${#GH_TOKEN} 个字符）。classic token 正常是 40 个字符。"
echo

if [ -z "$GH_TOKEN" ]; then
  echo "❌ 没有输入 Token（粘贴可能没成功），已取消。"
  read -r -p "按回车关闭…" _
  exit 1
fi

# Token 通过 GIT_ASKPASS 传给 git，不出现在命令行参数里，也不会被打印出来
ASKPASS="$ROOT/.tooling/.askpass.sh"
mkdir -p "$ROOT/.tooling"
cat > "$ASKPASS" <<'EOF'
#!/bin/bash
case "$1" in
  *sername*) printf '%s' "$GH_USER" ;;
  *)         printf '%s' "$GH_TOKEN" ;;
esac
EOF
chmod 700 "$ASKPASS"
export GIT_ASKPASS="$ASKPASS"
export GH_USER GH_TOKEN

echo "正在上传…"
echo

git -c credential.helper= push -u origin main 2>&1 | sed -E "s/${GH_TOKEN}/***/g"
STATUS=${PIPESTATUS[0]}
rm -f "$ASKPASS"

if [ "$STATUS" -eq 0 ]; then
  # 把凭据存进 macOS 钥匙串，以后 push 就不用再输 Token 了
  printf "protocol=https\nhost=github.com\nusername=%s\npassword=%s\n" "$GH_USER" "$GH_TOKEN" \
    | git credential-osxkeychain store 2>/dev/null
  git config credential.helper osxkeychain 2>/dev/null

  echo
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
  open "https://github.com/Hanny-0303/Pet-Link"
else
  echo
  echo "=================================================="
  echo "❌ 上传失败"
  echo
  echo "常见原因："
  echo "  · Token 复制不完整（多半是少了开头或结尾几位）"
  echo "  · Token 没有勾选 repo 权限"
  echo "  · Token 已经过期，或者粘贴时少了字符"
  echo "  · 看到 403 / Invalid username or password，基本就是这个原因"
  echo
  echo "重新生成一个 Token 再跑一次这个脚本就行。"
  echo "=================================================="
fi

echo
read -r -p "按回车关闭…" _
