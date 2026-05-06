import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Tag, Calendar } from 'lucide-react'
import { useJsonData } from '../hooks/useJsonData'
import CommentSlot from '../components/CommentSlot'

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

  // 解析 markdown 内容（简单处理）
  const renderContent = (content) => {
    const lines = content.split('\n')
    const elements = []
    let inCodeBlock = false
    let codeContent = []
    let codeLang = ''

    lines.forEach((line, i) => {
      // 代码块
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${i}`} className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900/70 overflow-x-auto text-xs leading-relaxed my-4 border border-stone-200 dark:border-stone-700/50">
              <code className="font-mono opacity-80">{codeContent.join('\n')}</code>
            </pre>
          )
          codeContent = []
          inCodeBlock = false
        } else {
          inCodeBlock = true
          codeLang = line.replace('```', '').trim()
        }
        return
      }

      if (inCodeBlock) {
        codeContent.push(line)
        return
      }

      // 空行
      if (line.trim() === '') {
        elements.push(<div key={`br-${i}`} className="h-4" />)
        return
      }

      // 标题
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${i}`} className="text-lg font-semibold mt-8 mb-4 opacity-90">
            {line.replace('## ', '')}
          </h2>
        )
        return
      }
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${i}`} className="text-base font-medium mt-6 mb-3 opacity-80">
            {line.replace('### ', '')}
          </h3>
        )
        return
      }

      // 表格
      if (line.startsWith('|')) {
        // 简单表格渲染，跳过表头分隔行
        if (line.includes('---')) return
        const cells = line.split('|').filter(c => c.trim()).map(c => c.trim())
        elements.push(
          <div key={`table-${i}`} className="flex gap-4 text-sm my-1 px-2">
            {cells.map((cell, ci) => (
              <span key={ci} className={`flex-1 ${ci === 0 ? 'font-medium opacity-70' : 'opacity-60'}`}>
                {cell}
              </span>
            ))}
          </div>
        )
        return
      }

      // 引用
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={`quote-${i}`} className="pl-4 border-l-2 border-stone-300 dark:border-stone-600 my-4 opacity-60 text-sm italic">
            {line.replace('> ', '')}
          </blockquote>
        )
        return
      }

      // 分隔线
      if (line.startsWith('---')) {
        elements.push(<hr key={`hr-${i}`} className="my-6 border-stone-200 dark:border-stone-700/50" />)
        return
      }

      // 普通段落
      elements.push(
        <p key={`p-${i}`} className="text-sm leading-relaxed opacity-70 my-2">
          {line}
        </p>
      )
    })

    return elements
  }

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
          <div className="flex items-center gap-3 mb-4">
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
        <article className="prose dark:prose-invert max-w-none">
          {renderContent(article.content)}
        </article>

        {/* 评论区域 */}
        <div className="mt-16 pt-8 border-t border-stone-200/30 dark:border-stone-700/30">
          <CommentSlot workId={`article-${article.id}`} />
        </div>
      </div>
    </div>
  )
}
