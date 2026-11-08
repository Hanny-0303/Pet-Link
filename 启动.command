#!/bin/bash
# 双击这个文件就能启动项目（macOS）
cd "$(dirname "$0")" || exit 1

NODE_BIN=$(ls -d "$PWD"/.tooling/node-*/bin 2>/dev/null | head -1)
if [ -z "$NODE_BIN" ]; then
  echo "❌ 找不到 .tooling 里的 Node，请让 AI 重新安装一次。"
  read -r -p "按回车关闭…" _
  exit 1
fi

export PATH="$NODE_BIN:$PATH"
export HOME="$PWD/.tooling/home"
export npm_config_cache="$PWD/.tooling/npm-cache"
export NEXT_TELEMETRY_DISABLED=1

echo "正在启动… 几秒后浏览器会自动打开 http://localhost:3000"
echo "（关掉这个终端窗口 = 停止服务）"
(sleep 7 && open "http://localhost:3000") &

npx next dev -p 3000
