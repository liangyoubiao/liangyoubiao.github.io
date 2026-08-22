import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import Shiki from '@shikijs/markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: false,
})

md.use(anchor, {
  permalink: anchor.permalink.linkInsideHeader({
    symbol: '#',
    placement: 'before',
    ariaHidden: true,
  }),
})

// 预加载常用语言(构建时一次性载入,客户端零开销)
const COMMON_LANGS = [
  'bash', 'sh', 'shell', 'console',
  'javascript', 'js', 'typescript', 'ts', 'jsx', 'tsx',
  'json', 'jsonc',
  'html', 'vue',
  'css', 'scss', 'less',
  'markdown', 'md',
  'python', 'py',
  'java', 'kotlin', 'swift',
  'go', 'golang', 'rust', 'rs',
  'c', 'cpp', 'csharp', 'cs',
  'ruby', 'rb', 'php',
  'sql',
  'yaml', 'yml', 'toml',
  'diff',
  'ini', 'dockerfile', 'nginx',
  'plaintext', 'text',
]

// 异步初始化 Shiki(顶层 await,vite-ssg 构建时执行)
await md.use(await Shiki({
  themes: {
    light: 'github-light',
    dark: 'github-dark',
  },
  langs: COMMON_LANGS,
  langAlias: {
    angular2html: 'html',
    sh: 'bash',
    shell: 'bash',
    console: 'bash',
    yml: 'yaml',
    md: 'markdown',
    py: 'python',
    ts: 'typescript',
    js: 'javascript',
    rs: 'rust',
    golang: 'go',
    cs: 'csharp',
    'c++': 'cpp',
  },
  defaultLanguage: 'plaintext',
  fallbackLanguage: 'plaintext',
}))

export function renderMarkdown(content: string): string {
  return md.render(content)
}

