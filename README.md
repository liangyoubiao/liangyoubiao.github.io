# LiangYouBiao 的博客 · Vue 3 版本

> 从 Hexo (matery 主题) 迁移至 **Vue 3 + Vite + vite-ssg** 的静态博客。

## 当前进度

- [x] 工程脚手架(Vite 8 + Vue 3.5 + TypeScript)
- [x] vite-ssg 静态站点生成
- [x] Markdown 文章加载(基于 `import.meta.glob` + `gray-matter`)
- [x] Markdown 渲染(`markdown-it` + `markdown-it-anchor`)
- [x] 基础页面:首页 / 归档 / 分类 / 标签 / 友链 / 关于 / 留言 / 404
- [x] 文章详情(URL 保持 Hexo 原格式 `/:year/:month/:day/:slug/`)
- [x] 标签详情页
- [x] GitHub Actions 自动部署到 `liangyoubiao.github.io`

## 待办(后续阶段)

- [ ] Matery 主题视觉复刻(原 hexo-theme-matery)
- [ ] 本地搜索
- [ ] 评论系统(Twikoo / Waline)
- [ ] RSS / Sitemap
- [ ] 暗色模式
- [ ] `<html lang>` 修正为 zh-CN
- [ ] demos 演示页迁移
- [ ] 友链页美化 / 友链申请
- [ ] 看板娘 / 雪花特效 / 音乐播放器
- [ ] 文章目录 TOC
- [ ] 代码高亮(目前只有样式,无语法高亮)

## 开发

```bash
# 安装依赖(Node 22.18+ 或 24+)
npm install

# 本地开发
npm run dev

# 类型检查
npm run type-check

# 构建静态站点
npm run build

# 本地预览构建产物
npm run preview
```

## 目录结构

```
src/
├── assets/        # 全局样式
├── components/    # 通用组件 (NavBar, PostCard)
├── content/posts/ # Markdown 博文(2 篇从 Hexo 迁来)
├── data/          # JSON 数据 (friends.json)
├── layouts/       # 布局 (Default)
├── pages/         # 路由页面
├── router/        # 静态路由表
├── utils/         # 工具 (posts.ts, markdown.ts, site.ts)
├── App.vue        # 根组件
└── main.ts        # vite-ssg 入口
```

## 部署

推送到 `main` 分支后,`.github/workflows/deploy.yml` 自动构建并发布到 GitHub Pages。

首次启用 Pages:
1. 推送到 GitHub:`git push -u origin main`
2. 仓库 Settings → Pages → Source 选择 **GitHub Actions**
3. 等待第一次 workflow 完成

## 与 Hexo 老站的关系

老站 `E:\my-blog` 完全独立保留,本项目以「最基本」为优先 — 仅复刻框架与列表/详情功能,不照搬 Matery 视觉。后续按 TODO 逐项迭代。
