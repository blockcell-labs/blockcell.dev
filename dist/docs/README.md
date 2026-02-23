# Blockcell 文档系统

## 目录结构

```
public/docs/
├── zh/          # 中文文档
│   ├── 00_index.md
│   ├── 01_what_is_blockcell.md
│   └── ...
├── en/          # 英文文档
│   ├── 00_index.md
│   ├── 01_what_is_blockcell.md
│   └── ...
└── README.md    # 本文件
```

## 如何添加新文档

### 1. 添加 Markdown 文件

将新的 `.md` 文件放入对应语言的文件夹：
- 中文文档：`public/docs/zh/`
- 英文文档：`public/docs/en/`

文件命名建议：`XX_title.md`（XX 为序号）

### 2. 更新文档列表

编辑 `src/pages/docs.tsx`，在对应的文档列表中添加新条目：

```typescript
// 中文文档列表
const zhDocs: DocItem[] = [
  // ... 现有文档
  { id: '17', title: '新文档标题', file: '17_new_doc.md' },
];

// 英文文档列表
const enDocs: DocItem[] = [
  // ... 现有文档
  { id: '17', title: 'New Document Title', file: '17_new_doc.md' },
];
```

### 3. 重新构建

```bash
npm run build
```

## Markdown 支持的功能

文档系统使用 `react-markdown` 解析器，支持：

- ✅ 标题（H1-H6）
- ✅ 段落和换行
- ✅ 粗体、斜体
- ✅ 链接（内部和外部）
- ✅ 列表（有序和无序）
- ✅ 代码块（带语法高亮）
- ✅ 行内代码
- ✅ 引用块
- ✅ 表格
- ✅ 水平分隔线
- ✅ 图片
- ✅ GitHub Flavored Markdown (GFM)

## 样式定制

Markdown 样式定义在 `src/index.css` 的 `.prose-rust` 类中。

如需修改样式，编辑该文件中的对应规则。

## 自动同步

如果需要从 blockcell 主仓库同步文档，可以使用以下命令：

```bash
# 同步中文文档
cp ../blockcell/docs/*.md public/docs/zh/

# 同步英文文档
cp ../blockcell/docs/en/*.md public/docs/en/
```

## 注意事项

1. 文档文件必须是 UTF-8 编码
2. 文件名中不要包含空格，使用下划线或连字符
3. 图片路径建议使用相对路径或绝对 URL
4. 内部链接使用相对路径（如 `./01_what_is_blockcell.md`）
