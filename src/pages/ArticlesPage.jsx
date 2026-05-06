import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Tag, ArrowRight, BookOpen } from 'lucide-react'
import { useJsonData } from '../hooks/useJsonData'

export default function ArticlesPage() {
  const navigate = useNavigate()
  const { data: articles } = useJsonData('/data/articles.json')
  const [filter, setFilter] = useState('全部')

  const allCategories = useMemo(() => {
    if (!articles) return ['全部']
    const cats = new Set(articles.map(a => a.category))
    return ['全部', ...Array.from(cats)]
  }, [articles])

  const filtered = useMemo(() => {
    if (!articles) return []
    if (filter === '全部') return articles
    return articles.filter(a => a.category === filter)
  }, [articles, filter])

  const featured = articles?.filter(a => a.featured) || []

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">技术文章</h1>
        <p className="text-sm opacity-50 mb-8">记录技术探索中的思考、踩坑与解决方案</p>

        {/* 精选文章 */}
        {featured.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-medium mb-4 flex items-center gap-2 opacity-70">
              <BookOpen size={16} className="opacity-50" />
              精选文章
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map(article => (
                <ArticleCard key={article.id} article={article} onClick={() => navigate(`/articles/${article.id}`)} />
              ))}
            </div>
          </div>
        )}

        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-300 ${
                filter === cat
                  ? 'bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 border-transparent'
                  : 'border-stone-200 dark:border-stone-700 opacity-60 hover:opacity-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 文章列表 */}
        <div className="space-y-4">
          {filtered.map(article => (
            <ArticleListItem key={article.id} article={article} onClick={() => navigate(`/articles/${article.id}`)} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ArticleCard({ article, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group rounded-2xl border border-stone-200/40 dark:border-stone-700/40 bg-white dark:bg-stone-800/40 p-5 cursor-pointer hover:shadow-lg hover:shadow-stone-200/20 dark:hover:shadow-stone-900/30 transition-all duration-400"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">
          {article.category}
        </span>
        <span className="text-[10px] opacity-40">{article.date}</span>
      </div>
      <h3 className="font-medium text-sm mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
        {article.title}
      </h3>
      <p className="text-xs opacity-50 leading-relaxed line-clamp-3 mb-3">
        {article.summary}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-[10px] opacity-40">
          <Clock size={10} />
          {article.readTime}
        </div>
        <span className="text-xs opacity-40 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          阅读 <ArrowRight size={10} />
        </span>
      </div>
    </div>
  )
}

function ArticleListItem({ article, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group flex flex-col sm:flex-row sm:items-start gap-4 p-5 rounded-2xl border border-stone-200/40 dark:border-stone-700/40 bg-white dark:bg-stone-800/40 cursor-pointer hover:shadow-md hover:shadow-stone-200/10 dark:hover:shadow-stone-900/20 transition-all duration-300"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 text-[10px] rounded-full bg-stone-100 dark:bg-stone-700/50 opacity-60">
            {article.category}
          </span>
          <span className="text-[10px] opacity-40">{article.date}</span>
          <span className="text-[10px] opacity-40 flex items-center gap-1">
            <Clock size={10} />
            {article.readTime}
          </span>
        </div>
        <h3 className="font-medium text-sm mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {article.title}
        </h3>
        <p className="text-xs opacity-50 leading-relaxed line-clamp-2 mb-3">
          {article.summary}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {article.tags.map(tag => (
            <span key={tag} className="flex items-center gap-0.5 text-[10px] opacity-40">
              <Tag size={8} />
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="shrink-0">
        <span className="text-xs opacity-30 group-hover:opacity-70 transition-opacity flex items-center gap-1">
          阅读 <ArrowRight size={12} />
        </span>
      </div>
    </div>
  )
}
