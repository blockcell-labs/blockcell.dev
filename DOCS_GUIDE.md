# Blockcell 文档系统使用指南

## 概述

Blockcell 网站使用了一个自动化的 Markdown 文档系统，你只需要将 `.md` 文件放到指定文件夹，网站就会自动展示内容，无需手动编写 HTML。

## 特性

✅ 自动 Markdown 解析和渲染  
✅ 中英文双语支持，跟随网站语言自动切换  
✅ 文档内链接自动跳转（点击 .md 链接）  
✅ 侧边栏目录导航  
✅ 代码高亮显示  
✅ 表格、列表、引用等完整支持  
✅ 响应式设计，移动端友好  

## 快速开始

### 1. 同步文档

从 blockcell 主仓库同步最新文档：

```bash
./sync-docs.sh
```

这会自动复制所有文档到 `public/docs/zh/` 和 `public/docs/en/`。

### 2. 添加新文档

如果你添加了新的文档文件，需要更新文档列表：

编辑 `src/pages/docs.tsx`：

```typescript
const zhDocs: DocItem[] = [
  { id: '00', title: '系列目录', file: '00_index.md' },
  { id: '01', title: '什么是 blockcell？', file: '01_what_is_blockcell.md' },
  // ... 添加新文档
  { id: '17', title: '新文档标题', file: '17_new_doc.md' },
];

const enDocs: DocItem[] = [
  { id: '00', title: 'Table of Contents', file: '00_index.md' },
  { id: '01', title: 'What is blockcell?', file: '01_what_is_blockcell.md' },
  // ... 添加新文档
  { id: '17', title: 'New Document Title', file: '17_new_doc.md' },
];
```

### 3. 构建和预览

```bash
# 开发模式（热重载）
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## 目录结构

```
blockcell.dev/
├── public/
│   └── docs/
│       ├── zh/              # 中文文档
│       │   ├── 00_index.md
│       │   ├── 01_what_is_blockcell.md
│       │   └── ...
│       ├── en/              # 英文文档
│       │   ├── 00_index.md
│       │   ├── 01_what_is_blockcell.md
│       │   └── ...
│       └── README.md
├── src/
│   ├── pages/
│   │   ├── docs.tsx         # 文档浏览器页面
│   │   └── quickstart.tsx   # 快速开始页面
│   └── index.css            # Markdown 样式
├── sync-docs.sh             # 文档同步脚本
└── DOCS_GUIDE.md            # 本文件
```

## 工作流程

### 日常更新文档

1. 在 `blockcell/docs/` 中编辑 Markdown 文件
2. 运行 `./sync-docs.sh` 同步到网站
3. 如果是新文档，更新 `src/pages/docs.tsx` 中的列表
4. 运行 `npm run build` 构建
5. 部署到服务器

### 修改文档样式

编辑 `src/index.css` 中的 `.prose-rust` 类：

```css
.prose-rust h1 {
  @apply text-3xl font-bold mb-6 mt-8 text-foreground border-b border-border pb-3;
}
```

### 自定义文档组件

如需添加特殊的 Markdown 组件，编辑 `src/pages/docs.tsx` 中的 `ReactMarkdown` 组件配置：

```typescript
<ReactMarkdown
  components={{
    // 自定义链接样式
    a: ({ node, ...props }) => (
      <a {...props} className="text-rust hover:text-rust-light" />
    ),
    // 自定义代码块
    code: ({ node, inline, ...props }) => (
      inline ? <code className="..." {...props} /> : <code {...props} />
    ),
  }}
>
  {content}
</ReactMarkdown>
```

## Markdown 功能支持

### 基础语法

- 标题：`# H1` 到 `###### H6`
- 粗体：`**bold**`
- 斜体：`*italic*`
- 链接：`[text](url)`
- 图片：`![alt](url)`
- 列表：`-` 或 `1.`
- 引用：`> quote`
- 代码：`` `code` `` 或 ` ```language ` 

### 内部链接（重要！）

文档内的 `.md` 链接会自动处理，点击后跳转到对应文档：

```markdown
[什么是 blockcell？](./01_what_is_blockcell.md)
[5分钟上手](./02_quickstart.md)
```

**注意事项：**
1. 链接必须以 `./` 开头
2. 文件名必须符合 `XX_title.md` 格式（XX 为两位数字）
3. 点击后会自动切换文档并滚动到顶部

### 外部链接

外部链接会在新标签页打开：

```markdown
[GitHub](https://github.com/blockcell-labs/blockcell)
[官网](https://blockcell.dev)
```

### 扩展功能（GFM）

- 表格
- 任务列表：`- [ ]` 和 `- [x]`
- 删除线：`~~text~~`
- 自动链接

### 代码高亮

支持多种语言的代码高亮：

````markdown
```typescript
const hello = "world";
```

```rust
fn main() {
    println!("Hello, world!");
}
```

```bash
npm install
```
````

## 导航配置

导航栏配置在 `src/components/layout/navbar.tsx`：

```typescript
const navItems = [
  { name: t('nav.home'), path: '/' },
  { name: t('nav.features'), path: '/features' },
  { name: t('nav.architecture'), path: '/architecture' },
  { name: t('nav.innovation'), path: '/innovation' },
  { name: t('nav.quickstart'), path: '/quickstart' },  // 快速开始
  { name: t('nav.docs'), path: '/docs' },              // 文档
];
```

翻译文件在 `src/locales/zh.json` 和 `src/locales/en.json`。

## 路由配置

路由配置在 `src/App.tsx`：

```typescript
<Route path="quickstart" element={<QuickstartPage />} />
<Route path="docs" element={<DocsPage />} />
```

## 常见问题

### Q: 如何切换文档语言？

A: 文档语言会自动跟随网站语言。点击顶部导航栏的语言切换按钮（中文 ⇄ English），文档会自动切换到对应语言。

### Q: 文档内的链接如何工作？

A: 
- `.md` 链接（如 `./01_what_is_blockcell.md`）会自动跳转到对应文档
- 外部链接（http/https）会在新标签页打开
- 链接必须以 `./` 开头才能正确识别

### Q: 文档没有显示？

A: 检查以下几点：
1. 文件是否在 `public/docs/zh/` 或 `public/docs/en/` 中
2. 文件名是否在 `src/pages/docs.tsx` 的列表中
3. 文件编码是否为 UTF-8
4. 是否重新构建了项目

### Q: 样式不对？

A: 检查 `src/index.css` 中的 `.prose-rust` 样式定义。

### Q: 如何添加图片？

A: 将图片放到 `public/images/` 目录，然后在 Markdown 中使用：

```markdown
![描述](/images/screenshot.png)
```

### Q: 内部链接不工作？

A: 文档系统会自动处理 `.md` 链接。确保链接格式正确：

```markdown
[其他文档](./01_what_is_blockcell.md)
```

## 技术栈

- React 18
- TypeScript
- Vite
- TailwindCSS
- react-markdown
- remark-gfm（GitHub Flavored Markdown）
- rehype-raw & rehype-sanitize（安全的 HTML 支持）

## 性能优化

文档系统已经做了以下优化：

1. 按需加载：只加载当前查看的文档
2. 代码分割：Markdown 解析器独立打包
3. 缓存：浏览器会缓存已加载的文档
4. 懒加载：图片和代码块懒加载

## 部署

构建后的文件在 `dist/` 目录：

```bash
npm run build
```

可以部署到任何静态网站托管服务：
- Netlify
- Vercel
- Cloudflare Pages
- GitHub Pages
- 自己的服务器

## 维护建议

1. 定期运行 `./sync-docs.sh` 同步最新文档
2. 保持文档命名规范（序号_标题.md）
3. 及时更新文档列表
4. 测试中英文版本的一致性
5. 检查内部链接的有效性

## 贡献

如果你想改进文档系统，欢迎提交 PR！

主要文件：
- `src/pages/docs.tsx` - 文档浏览器
- `src/index.css` - Markdown 样式
- `sync-docs.sh` - 同步脚本
