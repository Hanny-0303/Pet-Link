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
echo
echo "  ⚠️  github.com/settings/tokens/new 页面上方有两个按钮："
echo "         [ Generate new token ]            ← 别点这个（fine-grained）"
echo "         [ Generate new token (classic) ]  ← 点这个"
echo
echo "  1. 浏览器打开  https://github.com/settings/tokens/new"
echo "  2. 点  Generate new token (classic)"
echo "  3. Note 随便填，比如  pet-link"
echo "  4. Expiration 选 90 days"
echo "  5. 权限列表里只勾  [repo]   （只要这一个）"
echo "  6. 拉到最下面点  Generate token"
echo "  7. 复制那串 ghp_ 开头的内容（只显示一次）"
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

if [ -z "$GH_TOKEN" ]; then
  echo "❌ 没有输入 Token（粘贴可能没成功），已取消。"
  read -r -p "按回车关闭…" _
  exit 1
fi

echo "已收到 Token（${#GH_TOKEN} 个字符）。classic token 正常是 40 个字符。"
echo

# ── 推送前先验证 Token，把模糊的报错变成明确的结论 ──────────
echo "正在检查 Token…"

RESP=$(curl -s -w '\n%{http_code}' --max-time 25 \
  -H "Authorization: Bearer ${GH_TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/user 2>/dev/null)
CODE=$(printf '%s\n' "$RESP" | tail -n1)
BODY=$(printf '%s\n' "$RESP" | sed '$d')

if [ "$CODE" != "200" ]; then
  echo
  echo "=================================================="
  echo "❌ 这串 Token 无效（GitHub 返回 ${CODE:-000，可能是网络问题}）"
  echo "=================================================="
  echo
  echo "  最常见的原因，按可能性排序："
  echo
  echo "   1. 你点的是 [ Generate new token ]，生成的是 Fine-grained 类型"
  echo "      → 这种必须逐个配置仓库和权限，漏一项就推不了代码"
  echo "      → 请改点 [ Generate new token (classic) ]"
  echo
  echo "   2. Token 已经被删除或过期"
  echo "   3. 复制时少了开头或结尾的几位"
  echo
  echo "  重新生成一个 classic token，再跑一次这个脚本就行。"
  echo "=================================================="
  read -r -p "按回车关闭…" _
  exit 1
fi

LOGIN=$(printf '%s' "$BODY" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("login",""))' 2>/dev/null)
SCOPES=$(curl -s -D - -o /dev/null --max-time 25 \
  -H "Authorization: Bearer ${GH_TOKEN}" https://api.github.com/user 2>/dev/null \
  | tr -d '\r' | awk -F': ' 'tolower($1)=="x-oauth-scopes"{print $2}')

echo "✅ Token 有效，属于账号：${LOGIN:-未知}"

if [ -n "$LOGIN" ] && [ "$LOGIN" != "$GH_USER" ]; then
  echo
  echo "⚠️  但这个 Token 属于「${LOGIN}」，不是你填的「${GH_USER}」。"
  echo "   如果要推到 Hanny-0303 的仓库，用户名和 Token 必须是同一个账号。"
  echo
  read -r -p "仍然继续尝试？(y/N) " GO
  if [ "$GO" != "y" ] && [ "$GO" != "Y" ]; then
    echo "已取消。"
    read -r -p "按回车关闭…" _
    exit 1
  fi
fi

# 检查能不能读到目标仓库
REPO_CODE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 25 \
  -H "Authorization: Bearer ${GH_TOKEN}" \
  https://api.github.com/repos/Hanny-0303/Pet-Link 2>/dev/null)

if [ -n "$SCOPES" ]; then
  echo "✅ 权限范围：${SCOPES}"
  if ! printf '%s' "$SCOPES" | grep -Eq '(^|, ?)(repo|public_repo)(,|$)'; then
    echo
    echo "⚠️  这个 Token 没有 repo 权限，推送会被拒绝。"
    echo "   回去把 [repo] 勾上再生成一个新 Token。"
    echo
    read -r -p "按回车关闭…" _
    exit 1
  fi
else
  echo "ℹ️  没读到权限范围 —— 说明这是 Fine-grained 类型，能不能推送取决于它的仓库配置。"
fi

if [ "$REPO_CODE" != "200" ]; then
  echo
  echo "⚠️  这个 Token 访问不到仓库 Hanny-0303/Pet-Link（HTTP ${REPO_CODE}）。"
  echo "   如果是 Fine-grained Token，请在它的配置里把该仓库加进 Repository access，"
  echo "   并把 Permissions → Contents 设为 Read and write。"
  echo
  read -r -p "按回车关闭…" _
  exit 1
fi

echo "✅ 可以访问目标仓库"
echo

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
  echo "Token 本身是有效的，但 GitHub 拒绝写入，通常是权限问题："
  echo "  · Fine-grained Token 没有 Contents: Read and write 权限"
  echo "  · 仓库没有把 Token 所属的账号加为协作者"
  echo
  echo "最省事的办法：改用 classic token，只勾 repo 一项。"
  echo "=================================================="
fi

echo
read -r -p "按回车关闭…" _
