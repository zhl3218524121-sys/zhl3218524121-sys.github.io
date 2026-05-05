import { useState, useMemo } from 'react'
import { ExternalLink, Github } from 'lucide-react'
import ShareButtons from '../components/ShareButtons'
import CommentSlot from '../components/CommentSlot'
import { useJsonData } from '../hooks/useJsonData'

export default function WorksPage() {
  const { data: works } = useJsonData('/data/works.json')
  const [filter, setFilter] = useState('全部')

  const allTags = useMemo(() => {
    if (!works) return ['全部']
    const tags = new Set(works.flatMap(w => w.tags))
    return ['全部', ...Array.from(tags)]
  }, [works])

  const filtered = useMemo(() => {
    if (!works) return []
    if (filter === '全部') return works
    return works.filter(w => w.tags.includes(filter))
  }, [works, filter])

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">作品集</h1>
        <p className="text-sm opacity-50 mb-8">一些我参与或独立完成的项目</p>

        {/* 筛选标签 */}
        <div className="flex flex-wrap gap-2 mb-10">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-300 ${
                filter === tag
                  ? 'bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 border-transparent'
                  : 'border-stone-200 dark:border-stone-700 opacity-60 hover:opacity-100'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 作品网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(work => (
            <article
              key={work.id}
              className="group rounded-2xl overflow-hidden border border-stone-200/40 dark:border-stone-700/40 bg-white dark:bg-stone-800/40 hover:shadow-lg hover:shadow-stone-200/20 dark:hover:shadow-stone-900/30 transition-all duration-400"
            >
              <div className="aspect-[3/2] overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="font-medium mb-1.5">{work.title}</h3>
                <p className="text-sm opacity-60 leading-relaxed mb-4 line-clamp-2">
                  {work.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {work.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[11px] rounded-md bg-stone-100 dark:bg-stone-700/50 opacity-70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {work.demoUrl && (
                      <a
                        href={work.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink size={13} />
                        演示
                      </a>
                    )}
                    {work.sourceUrl && (
                      <a
                        href={work.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <Github size={13} />
                        源码
                      </a>
                    )}
                  </div>
                  <ShareButtons url={work.demoUrl} title={work.title} />
                </div>

                {/* 评论预留区域 */}
                <CommentSlot workId={work.id} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
