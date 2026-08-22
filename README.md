# LiangYouBiao 的博客 · Vue 3 版本

> 从 Hexo (matery 主题) 迁移至 **Vue 3 + Vite + vite-ssg** 的静态博客。

## 功能

- [x] **Vue 3.5 + Vite 8 + TypeScript** 静态生成
- [x] **Matery 主题** 视觉复刻(绿白渐变、卡片化、彩虹 Banner)
- [x] **Shiki** VS Code 同款语法高亮(双主题:github-light + github-dark)
- [x] **代码一键复制** + **图片懒加载** + **lightGallery** 灯箱
- [x] **FlexSearch** 全文搜索(`Ctrl/⌘ + K`)
- [x] **RSS / Atom / Sitemap** / `robots.txt`
- [x] **ECharts 分类雷达** + **归档日历** + **标签云** 侧栏 widget
- [x] **文章目录 TOC**(`IntersectionObserver` 滚动高亮)
- [x] **不蒜子** 阅读量统计(总 PV/UV + 本页 PV)
- [x] **PWA** 可安装 + 离线访问(workbox 预缓存 24MB)

## 开发

```bash
# Node 22.18+ 或 24+
npm install
npm run dev           # http://127.0.0.1:5173
npm run build         # dist/ 静态文件(含 RSS、Sitemap、PWA)
npm run preview       # http://127.0.0.1:5050
```

## 部署到 GitHub Pages

### 1. 准备仓库

- 仓库名必须是 `liangyoubiao.github.io`(user page 固定)
- 推送代码到 `main` 分支

### 2. 启用 Pages

`Settings → Pages → Source: GitHub Actions`

### 3. 触发部署

```bash
git push origin main
```

`.github/workflows/deploy.yml` 自动:
- 拉取代码
- 安装依赖(`npm ci`)
- 构建静态站(`npm run build`)
- 验证产物(`dist/index.html` / `rss.xml` / `sitemap.xml` / `sw.js`)
- 部署到 `https://liangyoubiao.github.io`

### 4. 自定义域名(可选)

把 `CNAME` 文件放进 `public/`,内容写域名,例如 `blog.example.com`。

## 目录结构

```
my-blog-new/
├── .github/workflows/deploy.yml     # CI 自动部署
├── public/
│   ├── favicon.svg
│   ├── pwa-192x192.png               # PWA 图标
│   ├── pwa-512x512.png
│   ├── maskable-icon.png
│   ├── apple-touch-icon.png
│   ├── robots.txt                    # 指向 sitemap
│   ├── images/yuque/                 # 15 张文章图
│   ├── medias/
│   │   ├── banner/                   # 7 张轮播图
│   │   ├── featureimages/            # 24 张文章封面池
│   │   ├── avatar.jpg
│   │   ├── cover.jpg
│   │   └── comment_bg.png
│   ├── demos/                        # 7 个独立 HTML 演示
│   ├── page/, test/                  # 静态页
├── scripts/
│   ├── build-search.mjs              # 生成 search-data.json
│   ├── build-rss.mjs                 # 生成 rss/atom/sitemap
│   ├── fix-lang.mjs                  # 后置 lang=zh-CN 修复
│   └── yuque.py                      # 语雀图片下载(本地工具)
├── src/
│   ├── assets/
│   │   ├── main.css                  # 全局基础
│   │   └── matery.css                # Matery 主题样式
│   ├── components/
│   │   ├── Banner.vue                # 100vh 轮播 + 打字效果
│   │   ├── Dream.vue                 # 「我的梦想」
│   │   ├── PostCard.vue              # 文章卡(图+摘要+元信息)
│   │   ├── ProgressBar.vue           # 顶部进度条
│   │   ├── Recommend.vue             # 推荐文章
│   │   ├── SearchBox.vue             # Ctrl+K 搜索
│   │   └── TocSidebar.vue            # 文章目录
│   ├── composables/
│   │   ├── useTyped.ts               # 打字效果
│   │   └── useSearch.ts              # FlexSearch 封装
│   ├── content/posts/                # Markdown 博文
│   ├── data/friends.json             # 友链
│   ├── layouts/Default.vue          # 全局布局
│   ├── pages/                        # 路由页面
│   │   ├── index.vue                 # 首页
│   │   ├── PostDetail.vue            # 文章详情(代码复制+TOC+lightGallery)
│   │   ├── archives.vue
│   │   ├── categories.vue
│   │   ├── tags.vue
│   │   ├── TagDetail.vue
│   │   ├── Calendar.vue              # /calendar/ 文章日历
│   │   ├── friends.vue
│   │   ├── about.vue
│   │   ├── contact.vue
│   │   ├── demos.vue                 # 小工具列表
│   │   └── 404.vue
│   ├── router/index.ts
│   ├── utils/
│   │   ├── site.ts                   # 站点配置(导航/hero/梦想)
│   │   ├── posts.ts                  # 文章加载 + front-matter 解析
│   │   └── markdown.ts               # Shiki + 复制按钮 + lightGallery 包装
│   ├── App.vue
│   └── main.ts
├── index.html
├── vite.config.ts                    # mdAsData + PWA + lang 修复
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── package.json
└── README.md
```

## 添加新文章

1. 在 `src/content/posts/` 新建 `标题.md`
2. 头部写 front-matter:
   ```yaml
   ---
   title: 文章标题
   date: 2026-08-22 16:00:00
   tags: [标签1, 标签2]
   categories: [教程]
   cover: /medias/featureimages/0.jpg   # 可选,默认按 slug 哈希取 24 张池
   top: false                            # true 进入「推荐文章」
   ---
   ```
3. 正文用标准 Markdown,可写代码块(自动 Shiki 高亮)
4. `npm run build` 自动生成 `/year/month/day/slug/`

## 添加新工具(Demo)

把独立 HTML 文件放进 `public/demos/`,然后在 `src/pages/demos.vue` 的 `demos` 数组加一项。

