import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import type { Element } from 'hast'
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

// Shiki transformer: 给每个 <pre> 注入一个 <button> 作为第一子节点
// 由 src/composables/useCodeCopy 统一处理 click 事件(事件代理)
const addCopyButton = {
  name: 'add-copy-button',
  pre(node: Element) {
    const button: Element = {
      type: 'element',
      tagName: 'button',
      properties: {
        className: ['code-copy'],
        type: 'button',
        'aria-label': '复制代码',
        title: '复制代码',
      },
      children: [
        {
          type: 'element',
          tagName: 'span',
          properties: { className: ['copy-icon'] },
          children: [
            {
              type: 'element',
              tagName: 'svg',
              properties: {
                width: '14',
                height: '14',
                viewBox: '0 0 16 16',
                fill: 'currentColor',
                'aria-hidden': 'true',
              },
              children: [
                {
                  type: 'element',
                  tagName: 'path',
                  properties: {
                    d: 'M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z',
                  },
                  children: [],
                },
                {
                  type: 'element',
                  tagName: 'path',
                  properties: {
                    d: 'M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z',
                  },
                  children: [],
                },
              ],
            },
          ],
        },
        {
          type: 'element',
          tagName: 'span',
          properties: { className: ['copy-text'] },
          children: [{ type: 'text', value: '复制' }],
        },
      ],
    }
    node.children.unshift(button)
  },
}

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
  transformers: [addCopyButton],
}))

// 重写图片规则:加 loading="lazy" + lightGallery 包装
// lightGallery 通过 <a data-lg-size="..." class="lightgallery-item"> 抓取大图
md.renderer.rules.image = (tokens, idx) => {
  const token = tokens[idx]
  const src = token.attrGet('src') || ''
  const alt = (token.content || '').replace(/"/g, '&quot;')
  const title = (token.attrGet('title') || alt).replace(/"/g, '&quot;')
  if (!src) return token.content
  return `<a href="${src}" class="lightgallery-item" data-lg-size="1280-720" data-sub-html="${title}">` +
         `<img src="${src}" alt="${alt}" loading="lazy" class="lazy-img" decoding="async" />` +
         `</a>`
}

export function renderMarkdown(content: string): string {
  return md.render(content)
}

