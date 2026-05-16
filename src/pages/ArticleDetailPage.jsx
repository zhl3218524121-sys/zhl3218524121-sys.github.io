import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Tag, Calendar } from 'lucide-react'
import { marked } from 'marked'
import { useJsonData } from '../hooks/useJsonData'
import CommentSlot from '../components/CommentSlot'

// 配置 marked：启用 GitHub Flavored Markdown
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,
  mangle: false,
})

// 自定义 renderer：为各元素添加 Tailwind 样式类
const renderer = {
  code({ text, lang }) {
    const language = lang || ''
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    return `<pre class="rounded-xl bg-stone-100 dark:bg-stone-900/70 overflow-x-auto my-4 border border-stone-200 dark:border-stone-700/50"><code class="font-mono text-xs leading-relaxed opacity-80 block p-4" data-lang="${language}">${escaped}</code></pre>`
  },

  codespan({ text }) {
    return `<code class="px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-mono border border-stone-200 dark:border-stone-700/50">${text}</code>`
  },

  blockquote({ text }) {
    return `<blockquote class="pl-4 border-l-2 border-stone-300 dark:border-stone-600 my-4 opacity-60 text-sm italic">${marked.parseInline(text)}</blockquote>`
  },

  heading({ text, depth }) {
    const sizes = {
      1: 'text-2xl font-semibold mt-10 mb-5 opacity-95',
      2: 'text-lg font-semibold mt-8 mb-4 opacity-90',
      3: 'text-base font-medium mt-6 mb-3 opacity-80',
      4: 'text-sm font-medium mt-5 mb-2 opacity-70',
    }
    const cls = sizes[depth] || sizes[4]
    return `<h${depth} class="${cls}">${marked.parseInline(text)}</h${depth}>`
  },

  paragraph({ text }) {
    return `<p class="text-sm leading-relaxed opacity-70 my-3">${marked.parseInline(text)}</p>`
  },

  list({ items, ordered }) {
    const tag = ordered ? 'ol' : 'ul'
    const cls = ordered
      ? 'list-decimal list-inside my-4 space-y-1.5 text-sm opacity-70'
      : 'list-disc list-inside my-4 space-y-1.5 text-sm opacity-70'
    const lis = items.map(item => `<li class="leading-relaxed">${marked.parseInline(item.text)}</li>`).join('')
    return `<${tag} class="${cls}">${lis}</${tag}>`
  },

  link({ href, text }) {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-emerald-600 dark:text-emerald-400 hover:underline opacity-90">${text}</a>`
  },

  image({ href, text }) {
    return `<img src="${href}" alt="${text || ''}" class="rounded-xl my-4 max-w-full border border-stone-200 dark:border-stone-700/30" loading="lazy" />`
  },

  table({ header, rows }) {
    const thead = header.map(c => `<th class="px-3 py-2 text-left text-xs font-semibold opacity-70 border-b border-stone-200 dark:border-stone-700/50">${marked.parseInline(c.text)}</th>`).join('')
    const tbody = rows.map(row => {
      const tds = row.map(c => `<td class="px-3 py-2 text-sm opacity-60 border-b border-stone-100 dark:border-stone-800/50">${marked.parseInline(c.text)}</td>`).join('')
      return `<tr>${tds}</tr>`
    }).join('')
    return `<div class="overflow-x-auto my-4"><table class="w-full text-left border-collapse"><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table></div>`
  },

  strong({ text }) {
    return `<strong class="font-semibold opacity-90">${text}</strong>`
  },

  em({ text }) {
    return `<em class="italic opacity-80">${text}</em>`
  },

  hr() {
    return `<hr class="my-6 border-stone-200 dark:border-stone-700/50" />`
  },
}

marked.use({ renderer })

export default function ArticleDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: articles } = useJsonData('/data/articles.json')

  const article = articles?.find(a => a.id === Number(id))

  if (!article) {
    return (
      <div className="pt-24 pb-20 px-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">文章未找到</h1>
          <button
            onClick={() => navigate('/articles')}
            className="text-sm opacity-60 hover:opacity-100 transition-opacity"
          >
            ← 返回文章列表
          </button>
        </div>
      </div>
    )
  }

  // 使用 marked 解析 Markdown 为 HTML
  const htmlContent = marked.parse(article.content || '')

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate('/articles')}
          className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity mb-6"
        >
          <ArrowLeft size={16} />
          返回文章列表
        </button>

        {/* 文章头部 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">
              {article.category}
            </span>
            <span className="text-xs opacity-40 flex items-center gap-1">
              <Calendar size={12} />
              {article.date}
            </span>
            <span className="text-xs opacity-40 flex items-center gap-1">
              <Clock size={12} />
              {article.readTime}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold mb-4 leading-tight">{article.title}</h1>
          <p className="text-sm opacity-50 leading-relaxed">{article.summary}</p>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-stone-200/30 dark:border-stone-700/30">
          {article.tags.map(tag => (
            <span key={tag} className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-stone-100 dark:bg-stone-800/50 opacity-60">
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>

        {/* 文章内容 */}
        <article
          className="article-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* 评论区域 */}
        <div className="mt-16 pt-8 border-t border-stone-200/30 dark:border-stone-700/30">
          <CommentSlot workId={`article-${article.id}`} />
        </div>
      </div>
    </div>
  )
}
