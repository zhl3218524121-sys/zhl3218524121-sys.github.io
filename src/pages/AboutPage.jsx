import { useState } from 'react'
import { ChevronDown, GraduationCap, Briefcase } from 'lucide-react'
import { useJsonData } from '../hooks/useJsonData'

function TimelineItem({ item }) {
  const [expanded, setExpanded] = useState(false)
  const isWork = item.type === 'work'

  return (
    <div className="group">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-4 text-left py-4 px-4 -mx-4 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800/50 transition-colors"
      >
        <div className="mt-0.5 w-8 h-8 rounded-lg bg-stone-200 dark:bg-stone-700 flex items-center justify-center shrink-0">
          {isWork ? <Briefcase size={16} /> : <GraduationCap size={16} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-medium text-sm">{item.title}</div>
              <div className="text-xs opacity-50 mt-0.5">{item.organization}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs opacity-40">{item.year}</span>
              <ChevronDown
                size={14}
                className={`opacity-40 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              expanded ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-sm opacity-60 leading-relaxed">{item.description}</p>
          </div>
        </div>
      </button>
    </div>
  )
}

export default function AboutPage() {
  const { data: config } = useJsonData('/data/config.json')
  const { data: timeline } = useJsonData('/data/timeline.json')
  const bio = config?.site?.bio

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
          {timeline?.map(item => (
            <TimelineItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
