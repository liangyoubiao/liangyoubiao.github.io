import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'

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

export function renderMarkdown(content: string): string {
  return md.render(content)
}
