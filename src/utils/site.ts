export const site = {
  title: 'LiangYouBiao 的博客',
  shortTitle: 'LiangYouBiao',
  brandIcon: '🌿',
  description: '记录学习与生活的点滴',
  author: 'LiangYouBiao',
  url: 'https://liangyoubiao.github.io',
  githubUrl: 'https://github.com/liangyoubiao',
  language: 'zh-CN',
  // 头像(从老项目 /medias/avatar.jpg 迁移)
  avatar: '/medias/avatar.jpg',
  // 主页 hero 副标题轮播(typed.js 风格打字)
  subtitle: [
    'LiangYouBiao 的博客',
    '记录学习与生活的点滴',
    '从 Hexo 迁移到 Vue 3',
    '代码 · 阅读 · 骑行 · 滑雪',
    'Stay hungry, stay foolish',
  ],
  // 「我的梦想」版块(首页居中展示)
  dream: {
    title: '我的梦想',
    text: '愿你走出半生,归来仍是少年。坚持热爱,持续输出,做一个对世界还有点用的人。',
  },
  // Banner 轮播图(从 /medias/banner/ 加载)
  banners: [
    '/medias/banner/0.jpg',
    '/medias/banner/1.jpg',
    '/medias/banner/2.jpg',
    '/medias/banner/3.jpg',
    '/medias/banner/4.jpg',
    '/medias/banner/5.jpg',
    '/medias/banner/6.jpg',
  ],
  // Banner 底部按钮(可增删)
  bannerButtons: [
    { text: '开始阅读', icon: '↓', href: '#articles', primary: true },
    { text: 'GitHub', icon: '', href: 'https://github.com/liangyoubiao', primary: false },
  ],
  nav: [
    { name: '首页', path: '/' },
    { name: '归档', path: '/archives/' },
    { name: '分类', path: '/categories/' },
    { name: '标签', path: '/tags/' },
    { name: '友链', path: '/friends/' },
    { name: '小工具', path: '/demos/' },
    { name: '关于', path: '/about/' },
    { name: '留言', path: '/contact/' },
  ],
  socials: [
    { name: 'GitHub', url: 'https://github.com/liangyoubiao', icon: 'GitHub' },
  ],
}

