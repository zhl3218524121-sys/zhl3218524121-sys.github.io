import { useState } from 'react'
import { Calendar, Building2, GraduationCap, Wrench, Users, Handshake } from 'lucide-react'
import { useJsonData } from '../hooks/useJsonData'

const typeConfig = {
  education: { icon: GraduationCap, color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30 text-blue-600 dark:text-blue-400' },
  work: { icon: Building2, color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400' },
  project: { icon: Wrench, color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30 text-amber-600 dark:text-amber-400' },
  open: { icon: Handshake, color: 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800/30 text-violet-600 dark:text-violet-400' },
}

export default function TimelinePage() {
  const { data: timeline } = useJsonData('/data/timeline.json')
  const [filter, setFilter] = useState('全部')

  const filters = ['全部', '教育', '工作', '项目']
  const typeMap = { education: '教育', work: '工作', project: '项目', open: '开放' }

  const filtered = !timeline ? [] : filter === '全部'
    ? timeline
    : timeline.filter(t => typeMap[t.type] === filter)

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">经历时间线</h1>
        <p className="text-sm opacity-50 mb-8">教育背景、实习经历与项目时间脉络</p>

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

              return (
                <div key={item.id} className="relative flex gap-5">
                  {/* 节点圆点 */}
                  <div className={`relative z-10 shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${config.color} ${isOpen ? 'animate-pulse' : ''}`}>
                    <Icon size={16} />
                  </div>

                  {/* 内容卡片 */}
                  <div className={`flex-1 pb-8 ${index < filtered.length - 1 ? 'border-b border-stone-200/30 dark:border-stone-700/30' : ''}`}>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${config.color}`}>
                        {item.date}
                      </span>
                      {isOpen && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">
                          欢迎联系
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-medium mb-1">{item.title}</h3>
                    <p className="text-sm opacity-50 mb-2">{item.organization}</p>
                    <p className="text-sm opacity-60 leading-relaxed mb-3">{item.description}</p>

                    {item.tags && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 text-[10px] rounded-md bg-stone-100 dark:bg-stone-800/50 opacity-60">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
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
