/**
 * RSS 订阅源生成脚本
 * 读取 public/data/articles.json，生成 public/rss.xml
 * 在 vite build 之前自动运行（通过 package.json 的 prebuild 钩子）
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const root = resolve(__dirname, '..')

const SITE_URL = 'https://zhl3218524121-sys.github.io'

function escapeXml(text) {
  if (typeof text !== 'string') return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// 将 YYYY-MM-DD 格式转为 RFC 822 日期
function toRfc822(dateStr) {
  if (!dateStr) return new Date().toUTCString()
  const date = new Date(`${dateStr}T00:00:00+08:00`)
  return date.toUTCString()
}

function generateRss() {
  const articlesPath = resolve(root, 'public/data/articles.json')
  const articles = JSON.parse(readFileSync(articlesPath, 'utf-8'))

  const sortedArticles = [...articles].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  )

  const items = sortedArticles.map(article => {
    const link = `${SITE_URL}/#/articles/${article.id}`
    const categories = [article.category, ...(article.tags || [])]
      .map(cat => `    <category>${escapeXml(cat)}</category>`)
      .join('\n')

    return `  <item>
    <title>${escapeXml(article.title)}</title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    <description>${escapeXml(article.summary || '')}</description>
    <pubDate>${toRfc822(article.date)}</pubDate>
${categories}
  </item>`
  }).join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>章海林的技术博客</title>
    <link>${SITE_URL}/</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>控制科学与工程 / 机器人学 / 嵌入式系统研发 — 技术探索、踩坑记录与解决方案</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`

  const outputPath = resolve(root, 'public/rss.xml')
  writeFileSync(outputPath, rss, 'utf-8')
  console.log(`[RSS] Generated ${sortedArticles.length} items -> public/rss.xml`)
}

generateRss()
