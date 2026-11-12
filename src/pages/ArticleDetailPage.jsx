import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Tag, Calendar, List, ChevronDown, ChevronUp } from 'lucide-react'
import { useJsonData } from '../hooks/useJsonData'
import CommentSlot from '../components/CommentSlot'
import SubscribeBar from '../components/SubscribeBar'
import { parseMarkdown, extractHeadings, loadMermaidFromCDN } from '../utils/markdown'
import { useState, useEffect, useMemo, useRef } from 'react'

// 轻量 HTML 净化
function sanitizeHtml(html) {
  if (typeof html !== 'string') return html
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, 'nojavascript:')
}

export default function ArticleDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: articles } = useJsonData('/data/articles.json')
  const { data: config } = useJsonData('/data/config.json')
  const [progress, setProgress] = useState(0)
  const [activeHeading, setActiveHeading] = useState(null)
  const [mobileTocOpen, setMobileTocOpen] = useState(false)
  const articleRef = useRef(null)

  const article = articles?.find(a => a.id === Number(id))
  const headings = useMemo(() => extractHeadings(article?.content || ''), [article?.content])

  // 上一篇 / 下一篇（按文章在数组中的顺序）
  const currentIndex = articles?.findIndex(a => a.id === Number(id)) ?? -1
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null
  const nextArticle = currentIndex >= 0 && currentIndex < (articles?.length || 0) - 1 ? articles[currentIndex + 1] : null

  // 阅读进度条
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0
      setProgress(pct)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 渲染后处理：id 分配、复制按钮、TOC 高亮、Mermaid 渲染
  useEffect(() => {
    if (!article) return
    let mermaidCleanup = null

    const tocHeadings = articleRef.current?.querySelectorAll('h2[data-toc-target], h3[data-toc-target]')
    tocHeadings?.forEach((el, i) => { el.id = `toc-heading-${i}` })

    // 复制按钮
    const pres = articleRef.current?.querySelectorAll('pre')
    pres?.forEach((pre, idx) => {
      if (pre.querySelector('.copy-btn')) return
      const btn = document.createElement('button')
      btn.className = 'copy-btn'
      btn.type = 'button'
      const icon = document.createElement('span')
      icon.className = 'copy-icon'
      icon.textContent = '复制'
      btn.appendChild(icon)
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code')
        if (!code) return
        const doCopy = (text) => {
          btn.classList.add('copied')
          icon.textContent = '已复制'
          setTimeout(() => { btn.classList.remove('copied'); icon.textContent = '复制' }, 2000)
        }
        if (navigator.clipboard) {
          navigator.clipboard.writeText(code.innerText).then(() => doCopy()).catch(() => {
            const ta = document.createElement('textarea')
            ta.value = code.innerText
            document.body.appendChild(ta); ta.select()
            document.execCommand('copy'); document.body.removeChild(ta)
            doCopy()
          })
        } else {
          const ta = document.createElement('textarea')
          ta.value = code.innerText
          document.body.appendChild(ta); ta.select()
          document.execCommand('copy'); document.body.removeChild(ta)
          doCopy()
        }
      })
      pre.appendChild(btn)
    })

    // TOC 滚动高亮
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveHeading(entry.target.id)
        })
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )
    tocHeadings?.forEach(h => observer.observe(h))

    // Mermaid 渲染（CDN 按需加载，不参与打包）
    const mermaidElements = articleRef.current?.querySelectorAll('.mermaid')
    if (mermaidElements && mermaidElements.length > 0) {
      loadMermaidFromCDN().then(async (mermaid) => {
        mermaid.initialize({
          startOnLoad: false,
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: 'system-ui, sans-serif',
        })
        try {
          await mermaid.run({ nodes: mermaidElements })
        } catch (e) {
          console.warn('Mermaid render error:', e)
        }
      }).catch((e) => console.warn(e.message))
    }

    return () => {
      observer.disconnect()
    }
  }, [article?.id])

  if (!article) {
    return (
      <div className="pt-24 pb-20 px-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">文章未找到</h1>
          <button onClick={() => navigate('/articles')} className="text-sm opacity-60 hover:opacity-100 transition-opacity">
            ← 返回文章列表
          </button>
        </div>
      </div>
    )
  }

  const rawHtml = parseMarkdown(article.content || '')
  const htmlContent = sanitizeHtml(rawHtml)

  const handleTocClick = (e, id) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMobileTocOpen(false)
  }

  return (
    <div className="pt-24 pb-20 px-6 print-container">
      {/* 阅读进度条 */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-50 no-print">
        <div className="h-full bg-emerald-500/70 transition-all duration-150" style={{ width: `${progress}%` }} />
      </div>

      <div className="max-w-6xl mx-auto flex gap-8">
        {/* 主内容 */}
        <div className="flex-1 min-w-0 max-w-3xl mx-auto">
          <button onClick={() => navigate('/articles')} className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity mb-6 no-print">
            <ArrowLeft size={16} /> 返回文章列表
          </button>

          {/* 文章头部 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">
                {article.category}
              </span>
              <span className="text-xs opacity-40 flex items-center gap-1"><Calendar size={12} />{article.date}</span>
              <span className="text-xs opacity-40 flex items-center gap-1"><Clock size={12} />{article.readTime}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold mb-4 leading-tight">{article.title}</h1>
            <p className="text-sm opacity-50 leading-relaxed">{article.summary}</p>
          </div>

          {/* 移动端 TOC 折叠按钮（xl 以下显示） */}
          {headings.length > 0 && (
            <div className="xl:hidden mb-6 no-print">
              <button
                onClick={() => setMobileTocOpen(!mobileTocOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40 text-sm"
              >
                <span className="flex items-center gap-2 opacity-60">
                  <List size={15} /> 目录（{headings.length}）
                </span>
                {mobileTocOpen ? <ChevronUp size={16} className="opacity-50" /> : <ChevronDown size={16} className="opacity-50" />}
              </button>
              {mobileTocOpen && (
                <nav className="mt-2 p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/30 space-y-1 animate-fade-in">
                  {headings.map((h, i) => (
                    <a
                      key={i}
                      href={`#${h.id}`}
                      onClick={(e) => handleTocClick(e, h.id)}
                      className={`block text-xs leading-relaxed py-1 ${h.depth === 3 ? 'pl-5 opacity-50' : 'opacity-70'}`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              )}
            </div>
          )}

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-stone-200/30 dark:border-stone-700/30">
            {article.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-stone-100 dark:bg-stone-800/50 opacity-60">
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>

          {/* 文章内容 */}
          <article ref={articleRef} className="article-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />

          {/* 上一篇 / 下一篇 */}
          <div className="grid grid-cols-2 gap-4 mt-12 no-print">
            {prevArticle ? (
              <button onClick={() => navigate(`/articles/${prevArticle.id}`)} className="text-left p-4 rounded-xl border border-stone-200/40 dark:border-stone-700/40 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors group">
                <div className="text-[10px] opacity-40 mb-1 flex items-center gap-1"><ArrowLeft size={10} /> 上一篇</div>
                <div className="text-xs font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-2">{prevArticle.title}</div>
              </button>
            ) : <div />}
            {nextArticle ? (
              <button onClick={() => navigate(`/articles/${nextArticle.id}`)} className="text-right p-4 rounded-xl border border-stone-200/40 dark:border-stone-700/40 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors group">
                <div className="text-[10px] opacity-40 mb-1 flex items-center gap-1 justify-end">下一篇 <ArrowLeft size={10} className="rotate-180" /></div>
                <div className="text-xs font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-2">{nextArticle.title}</div>
              </button>
            ) : <div />}
          </div>

          {/* 订阅栏 */}
          <div className="mt-10 rounded-xl overflow-hidden no-print">
            <SubscribeBar mailchimpUrl={config?.services?.mailchimpUrl} />
          </div>

          {/* 评论区 */}
          <div className="mt-12 pt-8 border-t border-stone-200/30 dark:border-stone-700/30">
            <CommentSlot workId={`article-${article.id}`} />
          </div>
        </div>

        {/* 桌面端 TOC 侧边栏 */}
        {headings.length > 0 && (
          <aside className="hidden xl:block w-56 shrink-0 no-print">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4 opacity-50">
                <List size={14} /> <span className="text-xs font-medium">目录</span>
              </div>
              <nav className="space-y-1 border-l border-stone-200/50 dark:border-stone-700/50">
                {headings.map((h, i) => (
                  <a
                    key={i}
                    href={`#${h.id}`}
                    onClick={(e) => handleTocClick(e, h.id)}
                    className={`block text-xs leading-relaxed transition-all duration-200 ${
                      h.depth === 3 ? 'pl-6' : 'pl-3'
                    } ${
                      activeHeading === h.id
                        ? 'text-emerald-600 dark:text-emerald-400 font-medium border-l-2 border-emerald-500 -ml-px'
                        : 'opacity-40 hover:opacity-80 hover:pl-4'
                    }`}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
