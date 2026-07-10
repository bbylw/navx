# WebNav Hub

个人导航起始页（Startpage）。把常用站点按分类集中管理，支持即时搜索与一键跳转。

纯静态前端，无构建步骤、无后端依赖，双击打开或任意静态托管即可使用。

---

## 功能特性

| 功能 | 说明 |
|------|------|
| 分类浏览 | 6 大类：AI 搜索、托管社交、实用工具、科技资讯、云存储、电子邮箱 |
| 即时搜索 | 按站点名称或域名过滤；按 `/` 聚焦搜索框，`Esc` 清空 |
| 侧栏导航 | 桌面端左侧 Index 栏，点击平滑滚动到对应分类 |
| 移动分类条 | 小屏横向 chips 导航 |
| 仪表盘 Hero | 指南针视觉 + 时钟/日期 + 分类快捷跳转 |
| 滚动高亮 | IntersectionObserver 同步当前分类 |
| 回到顶部 | 滚动后显示悬浮按钮 |
| 数据分离 | 网址全部写在 `data.js`，改数据无需动页面结构 |

当前内置约 **183** 个站点链接（以 `data.js` 为准）。

---

## 目录结构

```text
net/
├── index.html      # 页面骨架（顶栏、布局挂载点）
├── styles.css      # 全部样式与主题变量
├── app.js          # 渲染、搜索、导航交互
├── data.js         # 分类与网址数据（主要维护文件）
├── favicon.svg     # 站点图标
└── README.md       # 本说明
```

### 文件职责

| 文件 | 职责 |
|------|------|
| `index.html` | HTML 结构；挂载 `#rail` / `#chips` / `#catalog` / `#hero-jumps` |
| `styles.css` | 设计系统（颜色、字体、布局、卡片、响应式） |
| `app.js` | 读取 `window.NAV_DATA`，渲染 DOM，绑定交互 |
| `data.js` | 导出 `window.NAV_DATA` 数组 |
| `favicon.svg` | SVG Favicon（暖炭底 + 铜色指南针） |

---

## 快速开始

### 本地打开

直接用浏览器打开 `index.html` 即可（同源加载 `data.js` / `app.js` / `styles.css`）。

### 本地静态服务（推荐）

```bash
# Python 3
python -m http.server 8080

# Node（若已安装 npx）
npx serve .
```

浏览器访问：`http://localhost:8080`

### 部署

可部署到任意静态托管，例如：

- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [GitHub Pages](https://pages.github.com/)
- 自有 Nginx / Caddy / OSS 静态站点

无需构建命令；将本目录文件原样上传即可。

---

## 维护网址数据

只需编辑 **`data.js`**。

### 数据结构

```js
/** WebNav Hub site catalog — edit this file to add/remove links. */
window.NAV_DATA = [
  {
    "id": "ai-search",          // 锚点 ID，唯一
    "label": "AI 搜索",         // 分类标题
    "sub": "模型与对话",        // 分类副标题
    "icon": "fa-solid fa-microchip",  // Font Awesome 类名
    "sites": [
      {
        "name": "智谱清言",     // 卡片显示名
        "url": "https://chatglm.cn/",
        "icon": "fa-solid fa-comment-dots"
      }
    ]
  }
];
```

### 新增站点

在目标分类的 `sites` 数组末尾追加：

```js
{
  "name": "示例站点",
  "url": "https://example.com/",
  "icon": "fa-solid fa-link"
}
```

### 新增分类

在 `NAV_DATA` 数组中追加一个分类对象，例如：

```js
{
  "id": "design",
  "label": "设计资源",
  "sub": "灵感与素材",
  "icon": "fa-solid fa-palette",
  "sites": []
}
```

侧栏、移动 chips、Hero 快捷跳转与分类区块会由 `app.js` 自动生成。

### 删除

直接删除对应站点对象或整个分类对象即可。

### 图标

项目使用 [Font Awesome 7](https://fontawesome.com/)（CDN）。

- 实心：`fa-solid fa-xxx`
- 品牌：`fa-brands fa-xxx`
- 线框：`fa-regular fa-xxx`

在 [Font Awesome Icons](https://fontawesome.com/icons) 搜索图标名后填入 `icon` 字段。

---

## 使用说明

### 键盘

| 按键 | 行为 |
|------|------|
| `/` | 聚焦搜索框（输入框/文本域内除外） |
| `Esc` | 清空搜索并失焦 |

### 鼠标 / 触控

- 点击顶栏 Logo：回到顶部并清除搜索
- 点击侧栏 / chips / Hero 图标：滚动到对应分类
- 点击站点卡片：新标签页打开链接（`rel="noopener noreferrer"`）

### 搜索

- 匹配 **站点名称**（`name`）或 **域名**（从 `url` 解析）
- 无结果时显示空状态提示
- 清空搜索后恢复全部分类

---

## 设计说明

### 视觉方向

- **定位**：工具型起始页 / 仪器面板，而非营销 Landing
- **色板**：暖炭黑底 + 单一铜色强调（`#d97845`）
- **字体**：Outfit（界面）+ IBM Plex Mono（状态/辅助信息）
- **卡片**：竖向图块（图标 + 名称），悬停轻浮起与铜色底线

### CSS 变量（节选）

定义在 `styles.css` 的 `:root`：

| 变量 | 用途 |
|------|------|
| `--ink` | 页面底色 |
| `--panel` / `--panel-2` | 卡片与表面 |
| `--text` / `--muted` / `--faint` | 文字层级 |
| `--accent` / `--accent-2` | 主强调色 |
| `--font` / `--mono` | 字体栈 |
| `--rail-w` / `--top-h` / `--max` | 布局尺寸 |

### 响应式

| 断点 | 行为 |
|------|------|
| `> 980px` | 侧栏 + 主栏双栏 |
| `≤ 980px` | 隐藏侧栏，显示 chips；Hero 折行 |
| `≤ 640px` | 顶栏紧凑；卡片约 3 列 |
| `≤ 420px` | 卡片 2 列 |

支持 `prefers-reduced-motion`：减弱/关闭动画。

---

## 技术栈

| 项 | 说明 |
|----|------|
| HTML5 | 语义结构 |
| CSS3 | 自定义属性、Grid、Flex、动画 |
| Vanilla JS | 无框架；IIFE 模块 |
| Font Awesome 7 | CDN 图标 |
| Google Fonts | Outfit、IBM Plex Mono |

**无 npm、无打包器、无运行时依赖**（除 CDN 字体与图标外）。

---

## 架构流程

```text
index.html
    │
    ├─ styles.css          主题与布局
    │
    ├─ data.js             window.NAV_DATA
    │         │
    │         ▼
    └─ app.js (defer)
              │
              ├─ render()          → 侧栏 / chips / Hero 跳转 / 分类卡片
              ├─ tickClock()       → 时钟与日期
              ├─ bindNav()         → 平滑滚动 + 高亮
              ├─ filter()          → 搜索过滤
              └─ IntersectionObserver → 滚动中同步当前分类
```

---

## 自定义建议

### 改主题色

编辑 `styles.css` 中：

```css
--accent: #d97845;
--accent-2: #e8a06a;
--accent-soft: rgba(217, 120, 69, 0.12);
```

同步调整 `favicon.svg` 与 `index.html` 的 `theme-color` 以保持一致。

### 改品牌文案

- 顶栏标题：`index.html` 中 `.logo-type`
- Hero 标题：`index.html` 中 `.hero-title`
- 页脚：`index.html` 中 `.foot`

### 改搜索逻辑

见 `app.js` 中 `filter()`：当前对 `data-name` 与 `data-host` 做子串匹配（不区分大小写）。

---

## 浏览器支持

现代浏览器即可：

- Chrome / Edge / Firefox / Safari 近两个大版本
- 需要：CSS Grid、Flexbox、`IntersectionObserver`、CSS 自定义属性

不依赖 ES Modules，兼容 `file://` 与普通静态服务器。

---

## 常见问题

**Q: 打开后是空白 / 无卡片？**  
检查 `data.js` 是否与 `index.html` 同目录，且控制台无 `NAV_DATA missing` 报错。部分浏览器对 `file://` 限制较严时，请改用本地 HTTP 服务。

**Q: 图标不显示？**  
需能访问 Font Awesome CDN（`cdn.jsdelivr.net`）。内网环境可改为本地托管 FA CSS/字体。

**Q: 字体加载慢？**  
可去掉 Google Fonts 链接，在 `styles.css` 中改用系统字体栈。

**Q: 如何备份我的链接？**  
备份 `data.js` 即可；其余为壳与样式。

---

## 分类一览（默认数据）

| ID | 名称 | 说明 |
|----|------|------|
| `ai-search` | AI 搜索 | 模型与对话 |
| `social` | 托管社交 | 部署与社区 |
| `tools` | 实用工具 | 效率与基础设施 |
| `tech-news` | 科技资讯 | 媒体与开源 |
| `cloud-storage` | 云存储 | 文件与同步 |
| `email` | 电子邮箱 | 隐私与企业 |

数量以 `data.js` 实时内容为准。

---

## License

个人项目，可自由修改与自用。  
第三方站点名称、商标与图标归其各自所有者；本仓库仅作导航索引，不托管其内容。

---

## 致谢

- [Font Awesome](https://fontawesome.com/)
- [Outfit](https://fonts.google.com/specimen/Outfit) · [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono)
