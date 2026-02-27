# 快速参考

## 🚀 常用命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 同步文档
./sync-docs.sh
```

## 📁 关键文件

| 文件 | 说明 |
|------|------|
| `src/pages/docs.tsx` | 文档浏览器（需要更新文档列表） |
| `src/pages/quickstart.tsx` | 快速开始页面 |
| `public/docs/zh/` | 中文文档目录 |
| `public/docs/en/` | 英文文档目录 |
| `src/index.css` | Markdown 样式 |
| `sync-docs.sh` | 文档同步脚本 |

## 📝 添加新文档流程

1. **创建 Markdown 文件**
   ```bash
   # 在 blockcell 主仓库中
   vim blockcell/docs/17_new_doc.md
   vim blockcell/docs/en/17_new_doc.md
   ```

2. **同步到网站**
   ```bash
   cd blockcell.dev
   ./sync-docs.sh
   ```

3. **更新文档列表**
   编辑 `src/pages/docs.tsx`:
   ```typescript
   const zhDocs: DocItem[] = [
     // ... 现有文档
     { id: '17', title: '新文档', file: '17_new_doc.md' },
   ];
   
   const enDocs: DocItem[] = [
     // ... 现有文档
     { id: '17', title: 'New Doc', file: '17_new_doc.md' },
   ];
   ```

4. **构建和测试**
   ```bash
   npm run build
   npm run preview
   ```

## 🎨 修改样式

编辑 `src/index.css` 中的 `.prose-rust` 类：

```css
.prose-rust h1 {
  @apply text-3xl font-bold mb-6 mt-8;
}
```

## 🔗 路由

| 路径 | 页面 |
|------|------|
| `/` | 首页 |
| `/features` | 特性 |
| `/architecture` | 架构 |
| `/innovation` | 创新 |
| `/quickstart` | 快速开始 |
| `/docs` | 文档浏览器 |

## 🌐 翻译

翻译文件位置：
- `src/locales/zh.json`
- `src/locales/en.json`

导航翻译键：
```json
{
  "nav": {
    "quickstart": "快速开始",
    "docs": "文档"
  }
}
```

## 📦 依赖包

```json
{
  "react-markdown": "Markdown 解析器",
  "remark-gfm": "GitHub Flavored Markdown",
  "rehype-raw": "HTML 支持",
  "rehype-sanitize": "HTML 安全过滤"
}
```

## 🐛 常见问题

**Q: 如何切换文档语言？**
- 点击顶部导航栏的语言切换按钮
- 文档会自动切换到对应语言

**Q: 文档内链接不工作？**
- 确保链接格式为 `./XX_filename.md`
- 确保文件名符合命名规范（两位数字开头）

**Q: 文档不显示？**
- 检查文件是否在 `public/docs/zh/` 或 `public/docs/en/`
- 检查是否在 `docs.tsx` 中添加了条目
- 检查文件编码是否为 UTF-8

**Q: 构建失败？**
- 运行 `npm install` 确保依赖安装完整
- 检查 TypeScript 错误

## 📊 当前状态

- ✅ 中文文档: 17 篇
- ✅ 英文文档: 17 篇
- ✅ 自动 Markdown 解析
- ✅ 文档语言跟随网站语言
- ✅ 内部链接自动跳转
- ✅ 响应式设计
- ✅ 代码高亮

## 💡 重要提示

### 文档语言切换
- 文档语言会自动跟随顶部导航栏的语言设置
- 无需在文档页面单独切换语言
- 切换网站语言时，文档会自动切换到对应语言版本

### Markdown 内部链接
- 文档内的 `.md` 链接会自动处理
- 点击后直接跳转到对应文档，无需刷新页面
- 链接格式：`[标题](./XX_filename.md)`
- 外部链接会在新标签页打开

## 🎯 下一步

- [ ] 添加搜索功能
- [ ] 添加文档版本控制
- [ ] 添加目录锚点
- [ ] 添加上一篇/下一篇导航
