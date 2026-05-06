import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, GraduationCap, Wrench, Handshake, FileText, ArrowRight } from 'lucide-react'
import { useJsonData } from '../hooks/useJsonData'

const typeConfig = {
  education: { icon: GraduationCap, color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30 text-blue-600 dark:text-blue-400' },
  project: { icon: Wrench, color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30 text-amber-600 dark:text-amber-400' },
  open: { icon: Handshake, color: 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800/30 text-violet-600 dark:text-violet-400' },
}

export default function TimelinePage() {
  const { data: timeline } = useJsonData('/data/timeline.json')
  const { data: works } = useJsonData('/data/works.json')
  const { data: articles } = useJsonData('/data/articles.json')
  const [filter, setFilter] = useState('全部')

  // 自动同步：将作品和文章合并到时间线
  const mergedTimeline = useMemo(() => {
    const items = []

    // 添加手动时间线条目
    if (timeline) {
      items.push(...timeline.filter(t => t.date || t.type === 'open'))
    }

    // 将作品同步为项目节点
    if (works) {
      works.forEach(work => {
        items.push({
          id: `work-${work.id}`,
          date: work.detail?.date || '',
          title: work.title,
          organization: '项目作品',
          description: work.description,
          tags: work.tags,
          type: 'project',
          link: `/works/${work.id}`,
          linkLabel: '查看项目',
        })
      })
    }

    // 将文章同步为项目节点
    if (articles) {
      articles.forEach(article => {
        items.push({
          id: `article-${article.id}`,
          date: article.date || '',
          title: article.title,
          organization: '技术文章',
          description: article.summary,
          tags: article.tags,
          type: 'project',
          link: `/articles/${article.id}`,
          linkLabel: '阅读文章',
        })
      })
    }

    // 按日期排序（空日期放最后）
    return items.sort((a, b) => {
      if (!a.date && !b.date) return 0
      if (!a.date) return 1
      if (!b.date) return -1
      return b.date.localeCompare(a.date)
    })
  }, [timeline, works, articles])

  const filters = ['全部', '教育', '项目']
  const typeMap = { education: '教育', project: '项目', open: '开放' }

  const filtered = filter === '全部'
    ? mergedTimeline
    : mergedTimeline.filter(t => typeMap[t.type] === filter)

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">经历时间线</h1>
        <p className="text-sm opacity-50 mb-8">教育背景、项目经历与技术文章时间脉络</p>

        {/* 筛选 */}
        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-300 ${
                filter === f
                  ? 'bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 border-transparent'
                  : 'border-stone-200 dark:border-stone-700 opacity-60 hover:opacity-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* 时间轴 */}
        <div className="relative">
          {/* 竖线 */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-stone-200 dark:bg-stone-700/50" />

          <div className="space-y-8">
            {filtered.map((item, index) => {
              const config = typeConfig[item.type] || typeConfig.project
              const Icon = config.icon
              const isOpen = item.type === 'open'
              const hasLink = item.link

              return (
                <div key={item.id} className="relative flex gap-5">
                  {/* 节点圆点 */}
                  <div className={`relative z-10 shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${config.color} ${isOpen ? 'animate-pulse' : ''}`}>
                    <Icon size={16} />
                  </div>

                  {/* 内容卡片 */}
                  <div className={`flex-1 pb-8 ${index < filtered.length - 1 ? 'border-b border-stone-200/30 dark:border-stone-700/30' : ''}`}>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {item.date && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${config.color}`}>
                          {item.date}
                        </span>
                      )}
                      {isOpen && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">
                          欢迎联系
                        </span>
                      )}
                      {item.linkLabel && (
                        <span className="text-[10px] opacity-40">{item.organization}</span>
                      )}
                    </div>

                    <h3 className="text-base font-medium mb-1">{item.title}</h3>
                    {!item.linkLabel && item.organization && (
                      <p className="text-sm opacity-50 mb-2">{item.organization}</p>
                    )}
                    <p className="text-sm opacity-60 leading-relaxed mb-3">{item.description}</p>

                    {/* 标签 + 链接 */}
                    <div className="flex flex-wrap items-center gap-2">
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {item.tags.slice(0, 4).map(tag => (
                            <span key={tag} className="px-2 py-0.5 text-[10px] rounded-md bg-stone-100 dark:bg-stone-800/50 opacity-60">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {hasLink && (
                        <Link
                          to={item.link}
                          className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          {item.linkLabel}
                          <ArrowRight size={10} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
