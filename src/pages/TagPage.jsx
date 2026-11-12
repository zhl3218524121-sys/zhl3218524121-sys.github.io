import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Wrench, Tag, ArrowRight, Hash } from 'lucide-react'
import { useJsonData } from '../hooks/useJsonData'
import { Reveal } from '../hooks/useReveal'

export default function TagPage() {
  const { tag } = useParams()
  const navigate = useNavigate()
  const decodedTag = decodeURIComponent(tag || '')
  const { data: articles } = useJsonData('/data/articles.json')
  const { data: works } = useJsonData('/data/works.json')

  const taggedArticles = articles?.filter(a => a.tags?.includes(decodedTag)) || []
  const taggedWorks = works?.filter(w => w.tags?.includes(decodedTag)) || []
  const totalCount = taggedArticles.length + taggedWorks.length

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity mb-6">
          <ArrowLeft size={16} /> 返回
        </button>

        {/* 标签头部 */}
        <Reveal>
          <div className="mb-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Hash size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{decodedTag}</h1>
              <p className="text-sm opacity-40 mt-1">共 {totalCount} 条内容 · {taggedArticles.length} 篇文章 · {taggedWorks.length} 个作品</p>
            </div>
          </div>
        </Reveal>

        {/* 相关作品 */}
        {taggedWorks.length > 0 && (
          <Reveal delay={100}>
            <section className="mb-10">
              <h2 className="text-sm font-medium mb-4 flex items-center gap-2 opacity-70">
                <Wrench size={15} className="opacity-50" /> 相关作品
              </h2>
              <div className="space-y-3">
                {taggedWorks.map(work => (
                  <button
                    key={work.id}
                    onClick={() => navigate(`/works/${work.id}`)}
                    className="w-full text-left group flex items-center gap-4 p-4 rounded-xl border border-stone-200/40 dark:border-stone-700/40 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0">
                      <img src={work.image} alt={work.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{work.title}</h3>
                      <p className="text-xs opacity-40 line-clamp-1 mt-0.5">{work.description}</p>
                    </div>
                    <ArrowRight size={14} className="opacity-30 shrink-0" />
                  </button>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* 相关文章 */}
        {taggedArticles.length > 0 && (
          <Reveal delay={200}>
            <section>
              <h2 className="text-sm font-medium mb-4 flex items-center gap-2 opacity-70">
                <FileText size={15} className="opacity-50" /> 相关文章
              </h2>
              <div className="space-y-3">
                {taggedArticles.map(article => (
                  <button
                    key={article.id}
                    onClick={() => navigate(`/articles/${article.id}`)}
                    className="w-full text-left group flex items-center gap-4 p-4 rounded-xl border border-stone-200/40 dark:border-stone-700/40 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <FileText size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{article.title}</h3>
                      <p className="text-xs opacity-40 line-clamp-1 mt-0.5">{article.summary}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] opacity-40">{article.date}</span>
                      <ArrowRight size={14} className="opacity-30" />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {totalCount === 0 && (
          <div className="text-center py-16 opacity-40">
            <Tag size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">没有找到与"{decodedTag}"相关的内容</p>
          </div>
        )}
      </div>
    </div>
  )
}
