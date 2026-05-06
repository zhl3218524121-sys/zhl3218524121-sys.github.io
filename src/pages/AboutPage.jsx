import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, GraduationCap, Wrench, FileText, ArrowRight } from 'lucide-react'
import { useJsonData } from '../hooks/useJsonData'

function TimelineItem({ item }) {
  const [expanded, setExpanded] = useState(false)
  const isEducation = item.type === 'education'
  const isOpen = item.type === 'open'
  const hasLink = item.link

  return (
    <div className="group">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-4 text-left py-4 px-4 -mx-4 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800/50 transition-colors"
      >
        <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          isEducation ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
          isOpen ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400' :
          'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
        }`}>
          {isEducation ? <GraduationCap size={16} /> : hasLink ? <FileText size={16} /> : <Wrench size={16} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-medium text-sm">{item.title}</div>
              <div className="text-xs opacity-50 mt-0.5">{item.organization}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs opacity-40">{item.date || item.year}</span>
              <ChevronDown
                size={14}
                className={`opacity-40 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              expanded ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-sm opacity-60 leading-relaxed mb-2">{item.description}</p>
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
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
      </button>
    </div>
  )
}

export default function AboutPage() {
  const { data: config } = useJsonData('/data/config.json')
  const { data: timeline } = useJsonData('/data/timeline.json')
  const { data: works } = useJsonData('/data/works.json')
  const { data: articles } = useJsonData('/data/articles.json')
  const bio = config?.site?.bio

  // 合并时间线：手动条目 + 作品 + 文章
  const mergedTimeline = useMemo(() => {
    const items = []

    // 手动经历条目
    if (timeline) {
      items.push(...timeline.filter(t => t.date || t.year || t.type === 'open'))
    }

    // 作品同步
    if (works) {
      works.forEach(work => {
        items.push({
          id: `work-${work.id}`,
          date: '',
          year: '',
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

    // 文章同步
    if (articles) {
      articles.forEach(article => {
        items.push({
          id: `article-${article.id}`,
          date: article.date || '',
          year: article.date || '',
          title: article.title,
          organization: '技术文章',
          description: article.summary,
          tags: article.tags,
          type: 'article',
          link: `/articles/${article.id}`,
          linkLabel: '阅读文章',
        })
      })
    }

    return items
  }, [timeline, works, articles])

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-8">关于我</h1>

        {bio && (
          <p className="text-base leading-relaxed opacity-70 mb-12">
            {bio}
          </p>
        )}

        <h2 className="text-sm font-medium opacity-40 uppercase tracking-wider mb-4">经历</h2>
        <div className="space-y-1">
          {mergedTimeline?.map(item => (
            <TimelineItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
