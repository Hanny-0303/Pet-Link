#!/bin/bash
# 双击这个文件 = 把项目部署到 Vercel（需先有 Vercel 账号，没有会当场注册）

cd "$(dirname "$0")" || exit 1
ROOT="$PWD"

NODE_BIN=$(ls -d "$ROOT"/.tooling/node-*/bin 2>/dev/null | head -1)
if [ -z "$NODE_BIN" ]; then
  echo "❌ 找不到 .tooling 里的 Node，请让 AI 重新安装一次。"
  read -r -p "按回车关闭…" _
  exit 1
fi

export PATH="$NODE_BIN:$PATH"
export npm_config_cache="$ROOT/.tooling/npm-cache"
export NEXT_TELEMETRY_DISABLED=1

cd "$ROOT" || exit 1

PROJECT="liuliu-pet"

clear
echo "=================================================="
echo "   遛遛 · 部署到 Vercel"
echo "=================================================="
echo
echo "接下来分两步，全程都在这个窗口里完成。"
echo
echo "【第一步】登录"
echo "  · 会自动打开浏览器，用 GitHub / Google / 邮箱都行"
echo "  · 没有账号的话，浏览器里点注册，一分钟搞定"
echo "  · 看到 Authorize 之类的按钮就点同意"
echo "  · 回到这个窗口，看到登录成功的提示就继续"
echo
read -r -p "准备好后按回车开始…" _

if ! npx --yes vercel@latest login; then
  echo
  echo "❌ 登录没成功。把上面的报错截图发给 AI。"
  read -r -p "按回车关闭…" _
  exit 1
fi

echo
echo "【第二步】开始部署，大约 1–3 分钟，不要关窗口"
echo

npx --yes vercel@latest deploy --prod --yes \
  --project "$PROJECT" --create-if-missing 2>&1 | tee "$ROOT/.tooling/deploy.log"

URL=$(grep -Eo 'https://[a-zA-Z0-9._-]+\.vercel\.app' "$ROOT/.tooling/deploy.log" | tail -1)

echo
if [ -n "$URL" ]; then
  printf "%s" "$URL" | pbcopy
  echo "=================================================="
  echo "✅ 部署成功"
  echo
  echo "   $URL"
  echo
  echo "   链接已经复制到剪贴板，直接粘贴就能发给别人。"
  echo "   用手机扫这个链接打开，就是 App 的样子。"
  echo "=================================================="
  open "$URL"
else
  echo "⚠️  没抓到网址，看上面的输出里有没有 https:// 开头的链接。"
  echo "   也可以去 https://vercel.com/dashboard 看。"
fi

echo
read -r -p "按回车关闭…" _
