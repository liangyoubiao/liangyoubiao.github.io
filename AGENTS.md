# AGENTS.md - 项目工作指南

> 给接手本项目的 AI agent / 开发者阅读。记下踩过的坑和约定。

## 血泪教训(必须遵守)

### 1. 改 package.json 后必须跑 npm install 重新生 lockfile

npm ci 严格校验 lockfile 与 package.json 一致。少一次 npm install 整个 build 死在第一步:

  npm error EUSAGE
  npm error Invalid: lock file sharp@0.35.3 does not satisfy sharp@0.34.5

正确流程:
  1. 编辑 package.json
  2. rm -rf node_modules package-lock.json   # 或保留
  3. npm install   # 重新生 lockfile
  4. 确认 package-lock.json 已变,add + commit + push

### 2. 删功能时检查 workflow 里有没有相关检查步骤

删 PWA 插件时只改 vite.config.ts + 删资源 + 卸依赖,忘了看 .github/workflows/deploy.yml。CI 跑 test -f dist/sw.js 时 PWA 已删文件不存在,exit 1,整个 job 失败。

修正:删 PWA 时也要改 .github/workflows/deploy.yml 里的 test -f dist/sw.js 和 test -f dist/manifest.webmanifest 行。

正确流程:删功能时 grep 整个仓库,找相关的:
  - GitHub Actions workflow 里的 test -f / curl / 引用
  - Vite 插件链里的 import
  - dist 里的引用名
  - manifest / package.json 里的字段

---

## 项目概览

- 类型: 个人静态博客(Vue 3 + Vite + vite-ssg)
- 部署: GitHub Pages(liangyoubiao.github.io)
- 域名: https://liangyoubiao.github.io
- 数据源: src/content/posts/*.md(front-matter + Markdown)
- 写新文章: 看 docs/发布文章指南.md

## 常用命令

  npm run dev              # http://127.0.0.1:5173,热更新
  npm run preview          # http://127.0.0.1:5050,看 dist

  npm run build            # build-search + vite-ssg + build-rss + fix-lang
                           # prebuild:node scripts/sync-yuque.mjs(下载语雀图)

  node scripts/compress-images.mjs   # sharp 压缩 public/ 下图片为 WebP
  node scripts/sync-yuque.mjs        # 手动跑语雀图同步
  npm run sync:images                # = 上面那个

  npx vue-tsc --noEmit -p tsconfig.app.json
  npx tsc --noEmit -p tsconfig.node.json

## 常见坑(开发时)

### 1. gray-matter 把 YAML 时间戳解析成 UTC Date

坑:date: 2026-08-22 14:30:00 在 gray-matter 里变成 Date 对象(UTC)。
修法:src/utils/posts.ts 的 fixDates() 递归把所有 Date 转成本地时间字符串。改动这函数要小心,改坏了 URL 路径会偏一天。

### 2. import.meta.glob 在 vite-ssg 里会被 tree-shake 客户端动态路由

坑:getAllPosts() 函数会被 tree-shake,从 main.ts 的 createApp 链里消失,客户端点击文章跳 404。
修法:vite.config.ts 的 generateRoutes() 插件在 buildStart 时把 URL 数据写入 src/__generated_routes.ts,main.ts 从那里 import。该文件已加入 .gitignore,每次 npm run build 重新生成。

### 3. 路由顺序

/demos/ 子目录有 index.html,Vite-SSG 也会生成 dist/demos/index.html。直链 /demos/ 会静态 HTML 优先(SIRV 默认行为),而不是 Vue Router 的 /demos/ 页面。如果某天 /demos/ 路由消失,记得删 public/demos/index.html。

### 4. TypeScript strict 模式

tsconfig.app.json 已开 strict,新加代码需要显式类型。vite.config.ts 走 tsconfig.node.json(也 strict)。
常见坑:
- 递归函数用 function foo(obj: any): any(无法精确推导结构)
- 第三方包(Shiki / FlexSearch)用 // @ts-ignore(不是 @ts-expect-error,后者在版本升级后会变 unused)
- vite-ssg 私有字段 ssgOptions 上加 // @ts-expect-error

### 5. PWA / Service Worker

教训:PWA 缓存会卡住老版本,GitHub Pages CDN 又长 cache。一旦部署出错,清缓存要 DevTools -> Application -> Clear site data。
当前项目已移除 PWA(commit 2923d40):
- 不再有 Add to home screen / 离线访问
- 部署后立即拿到新版本(无 SW 拦)
- 如果将来想加回,记得 verify 步骤要重新加 sw.js 检查

## 重要文件位置

  src/utils/posts.ts           # 文章加载 + front-matter 解析
  src/utils/markdown.ts        # Shiki 高亮 + 图片处理
  src/utils/site.ts            # 站点全局配置(导航/hero/dream)
  src/__generated_routes.ts   # .gitignored,build 时自动生成
  src/content/posts/*.md       # 博客文章
  src/components/              # 通用组件
  src/pages/                   # 路由页面
  docs/发布文章指南.md         # 新文章写作流程
  .github/workflows/deploy.yml # CI 配置
  vite.config.ts               # 构建配置(含 generateRoutes + mdAsData 插件)

## 部署流程

  1. 改代码,本地 npm run dev 验证
  2. npm run build 确认能 build 通
  3. git add . && git commit -m ..
  4. git push 后 GitHub Actions 自动跑:
     - prebuild: node scripts/sync-yuque.mjs(下载语雀图)
     - build: npm run build = build-search + vite-ssg + build-rss + fix-lang
     - verify: test -f dist/{index.html,rss.xml,sitemap.xml}
     - deploy: actions/deploy-pages@v4 -> GitHub Pages
  5. 几分钟后访问 https://liangyoubiao.github.io 验证
