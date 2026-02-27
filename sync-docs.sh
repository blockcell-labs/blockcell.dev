#!/bin/bash

# Blockcell 文档同步脚本
# 用于从 blockcell 主仓库同步文档到网站

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BLOCKCELL_DOCS="../blockcell/docs"
TARGET_DIR="$SCRIPT_DIR/public/docs"

echo "🔄 开始同步文档..."

# 检查源目录是否存在
if [ ! -d "$BLOCKCELL_DOCS" ]; then
    echo "❌ 错误：找不到 blockcell 文档目录: $BLOCKCELL_DOCS"
    echo "请确保 blockcell 仓库在正确的位置"
    exit 1
fi

# 创建目标目录
mkdir -p "$TARGET_DIR/zh"
mkdir -p "$TARGET_DIR/en"

# 同步中文文档
echo "📄 同步中文文档..."
cp "$BLOCKCELL_DOCS"/*.md "$TARGET_DIR/zh/"
echo "✅ 中文文档同步完成"

# 同步英文文档
echo "📄 同步英文文档..."
cp "$BLOCKCELL_DOCS/en"/*.md "$TARGET_DIR/en/"
echo "✅ 英文文档同步完成"

# 统计文档数量
ZH_COUNT=$(ls -1 "$TARGET_DIR/zh"/*.md 2>/dev/null | wc -l)
EN_COUNT=$(ls -1 "$TARGET_DIR/en"/*.md 2>/dev/null | wc -l)

echo ""
echo "📊 同步统计："
echo "   中文文档: $ZH_COUNT 篇"
echo "   英文文档: $EN_COUNT 篇"
echo ""
echo "✨ 文档同步完成！"
echo ""
echo "💡 提示："
echo "   1. 如果添加了新文档，请更新 src/pages/docs.tsx 中的文档列表"
echo "   2. 运行 'npm run build' 重新构建网站"
