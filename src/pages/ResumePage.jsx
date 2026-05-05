import { useState } from 'react'
import { Download, Mail, MapPin, Globe, AlertCircle } from 'lucide-react'
import { useJsonData } from '../hooks/useJsonData'

export default function ResumePage() {
  const { data: config } = useJsonData('/data/config.json')
  const { data: timeline } = useJsonData('/data/timeline.json')
  const { data: skills } = useJsonData('/data/skills.json')
  const site = config?.site
  const [showTip, setShowTip] = useState(false)

  const workItems = timeline?.filter(t => t.type === 'work') || []
  const eduItems = timeline?.filter(t => t.type === 'education') || []

  const resumeUrl = site?.resumePdf
  const hasResume = resumeUrl && resumeUrl !== '#' && resumeUrl !== ''

  const handleDownloadClick = (e) => {
    if (!hasResume) {
      e.preventDefault()
      setShowTip(true)
      setTimeout(() => setShowTip(false), 3000)
    }
  }

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* 顶部操作栏 */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-semibold">简历</h1>
          <div className="relative">
            <a
              href={hasResume ? resumeUrl : '#'}
              onClick={handleDownloadClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 text-sm hover:opacity-90 transition-opacity"
            >
              <Download size={16} />
              下载 PDF
            </a>
            {showTip && (
              <div className="absolute right-0 top-full mt-2 px-3 py-2 rounded-lg bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 text-xs shadow-lg whitespace-nowrap animate-fade-in flex items-center gap-1.5">
                <AlertCircle size={12} />
                请先在 config.json 中配置 resumePdf 路径
              </div>
            )}
          </div>
        </div>

        {/* 简历卡片 */}
        <div className="bg-white dark:bg-stone-800/40 rounded-2xl border border-stone-200/40 dark:border-stone-700/40 p-8 md:p-10 shadow-sm">
          {/* 头部信息 */}
          <div className="flex flex-col md:flex-row gap-6 mb-10">
            <img
              src={site?.avatar}
              alt=""
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold mb-1">{site?.name}</h2>
              <p className="text-sm opacity-60 mb-3">{site?.tagline}</p>
              <div className="flex flex-wrap gap-3 text-xs opacity-50">
                {site?.email && (
                  <span className="flex items-center gap-1">
                    <Mail size={12} />
                    {site.email}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  中国
                </span>
                <span className="flex items-center gap-1">
                  <Globe size={12} />
                  {typeof window !== 'undefined' ? window.location.origin : ''}
                </span>
              </div>
            </div>
          </div>

          {/* 关于 */}
          <section className="mb-10">
            <h3 className="text-xs font-semibold uppercase tracking-wider opacity-40 mb-4">关于</h3>
            <p className="text-sm leading-relaxed opacity-70">{site?.bio}</p>
          </section>

          {/* 工作经历 */}
          {workItems.length > 0 && (
            <section className="mb-10">
              <h3 className="text-xs font-semibold uppercase tracking-wider opacity-40 mb-4">工作经历</h3>
              <div className="space-y-6">
                {workItems.map(item => (
                  <div key={item.id}>
                    <div className="flex items-baseline justify-between mb-1">
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-xs opacity-40">{item.year}</div>
                    </div>
                    <div className="text-xs opacity-50 mb-1.5">{item.organization}</div>
                    <p className="text-sm opacity-60 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 教育经历 */}
          {eduItems.length > 0 && (
            <section className="mb-10">
              <h3 className="text-xs font-semibold uppercase tracking-wider opacity-40 mb-4">教育背景</h3>
              <div className="space-y-6">
                {eduItems.map(item => (
                  <div key={item.id}>
                    <div className="flex items-baseline justify-between mb-1">
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-xs opacity-40">{item.year}</div>
                    </div>
                    <div className="text-xs opacity-50 mb-1.5">{item.organization}</div>
                    <p className="text-sm opacity-60 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 技能 */}
          {skills && skills.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider opacity-40 mb-4">技能</h3>
              {(() => {
                const grouped = skills.reduce((acc, skill) => {
                  const cat = skill.category || '其他'
                  if (!acc[cat]) acc[cat] = []
                  acc[cat].push(skill)
                  return acc
                }, {})
                const order = ['控制与仿真', '嵌入式开发', '网络与系统', '基础能力']
                return order.filter(c => grouped[c]).map(category => (
                  <div key={category} className="mb-4 last:mb-0">
                    <div className="text-xs opacity-50 mb-2">{category}</div>
                    <div className="flex flex-wrap gap-2">
                      {grouped[category].map(skill => (
                        <span
                          key={skill.name}
                          className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                            skill.level >= 5
                              ? 'bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 border-transparent'
                              : skill.level >= 3
                              ? 'bg-stone-200 dark:bg-stone-700 border-transparent'
                              : 'border-stone-200 dark:border-stone-700 opacity-60'
                          }`}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              })()}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
