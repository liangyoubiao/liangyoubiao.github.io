# AGENTS.md

## 约定(重要)

- **git commit / push 必须手动**:AI 助手(包括本次会话)不自动 commit 或 push。所有改动由人 review 后手动提交。
- **每次修改后需中文总结**:改完一个功能点(无论大小)就总结改了什么、用作 commit message。格式: `类型: 一句话描述改动`(类型用英文: feat/fix/refactor/docs/style/perf/chore,描述用中文)。例: `feat: 新增文章 TOC 左侧悬浮` / `fix: 修复路由 404,避免 Vite tree-shake` / `docs: AGENTS.md 补充 git 工作流约定` / `style: 移除首页 sidebar widgets 让首页更聚焦`。多个独立改动用多次 commit(不要一次 commit 很多事),方便回溯。
- **commit message 必须用中文**:比如 `feat: 新增 XX 功能` 而不是 `feat: add XX feature`。`docs:` `fix:` `refactor:` `style:` `chore:` `perf:` `test:` `build:` 这种类型前缀可以保留英文(行业标准),但描述部分必须是中文。


### 1. 改 package.json 后必须 npm install 重新生 lockfile

```
npm error EUSAGE
npm error Invalid: lock file sharp@0.35.3 does not satisfy sharp@0.34.5
```

`npm ci` 严格校验 lockfile。改 package.json 后:

  rm -rf node_modules package-lock.json && npm install
  确认 package-lock.json 变了再 commit + push

### 2. 删功能时检查 workflow 里的相关检查

上次 PWA 删了 sw.js / manifest.webmanifest,但 .github/workflows/deploy.yml 里 verify 步骤还有 `test -f dist/sw.js`,CI verify 失败整个 job 红。

删功能前 `grep -r <功能名> .` 找:
  - GitHub Actions workflow 里的 test -f / curl / 引用
  - Vite 插件链 import
  - dist 里的引用名
  - manifest / package.json 里的字段

## 项目

个人静态博客(Vue 3 + Vite + vite-ssg),部署 GitHub Pages(liangyoubiao.github.io)。数据源 `src/content/posts/*.md`。
新文章写作流程见 `docs/发布文章指南.md`。

## 命令

```
npm run dev                  # 开发,http://127.0.0.1:5173
npm run preview              # 看 dist,http://127.0.0.1:5050
npm run build                # 包含 prebuild(语雀图同步) + build
node scripts/sync-yuque.mjs # 手动跑语雀图同步
npx vue-tsc --noEmit         # 类型检查
```

## 5 个常见坑

1. **gray-matter Date 是 UTC**:`src/utils/posts.ts` 的 `fixDates()` 把它递归转成本地时间。改坏会偏一天 URL。
2. **import.meta.glob 在 vite-ssg 里被 tree-shake**:`getAllPosts()` 没了,客户端跳 404。修法是 `vite.config.ts` 的 `generateRoutes()` 插件在 buildStart 时把数据写进 `src/__generated_routes.ts`(已 .gitignore,自动重生)。
3. **/demos/ 静态 HTML 优先**:public/demos/index.html 比 Vue Router 优先被 sirv 返回。
4. **TS strict**:`tsconfig.app.json` 和 `tsconfig.node.json` 都开了。递归函数用 `(obj: any): any`。第三方包用 `// @ts-ignore`(不是 `@ts-expect-error`,后者升级后会变 unused)。
5. **PWA 已删**(commit `2923d40`):不再有离线缓存,但 PWA 缓存会卡老版本。如要加回记得 verify 步骤加 sw.js 检查。

## 部署

  git add . && git commit -m "..." && git push
  GitHub Actions 自动:
    prebuild → sync-yuque.mjs(语雀图下载)
    build    → vite-ssg + rss + sitemap
    verify   → test -f dist/{index.html,rss.xml,sitemap.xml}
    deploy   → GitHub Pages
