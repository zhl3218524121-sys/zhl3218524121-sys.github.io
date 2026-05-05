import { useJsonData } from '../hooks/useJsonData'

export default function SkillsPage() {
  const { data: skills } = useJsonData('/data/skills.json')

  // 按 category 分组
  const grouped = skills?.reduce((acc, skill) => {
    const cat = skill.category || '其他'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {}) || {}

  // 定义分类显示顺序
  const categoryOrder = ['控制与仿真', '嵌入式开发', '网络与系统', '基础能力']
  const categories = categoryOrder.filter(c => grouped[c])

  const sizeClass = (level) => {
    if (level >= 5) return 'text-lg px-5 py-2.5'
    if (level >= 4) return 'text-base px-4 py-2'
    if (level >= 3) return 'text-sm px-3.5 py-1.5'
    if (level >= 2) return 'text-xs px-3 py-1.5'
    return 'text-[11px] px-2.5 py-1'
  }

  const colorClass = (level) => {
    if (level >= 5) return 'bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800'
    if (level >= 4) return 'bg-stone-600 dark:bg-stone-300 text-white dark:text-stone-900'
    if (level >= 3) return 'bg-stone-300 dark:bg-stone-600 text-stone-800 dark:text-stone-100'
    if (level >= 2) return 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
    return 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 border border-stone-200 dark:border-stone-700'
  }

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">技能</h1>
        <p className="text-sm opacity-50 mb-10">技术栈与熟练度一览</p>

        <div className="space-y-10">
          {categories.map(category => (
            <section key={category}>
              <h2 className="text-xs font-semibold uppercase tracking-wider opacity-40 mb-4">{category}</h2>
              <div className="flex flex-wrap gap-3">
                {grouped[category].map(skill => (
                  <span
                    key={skill.name}
                    className={`inline-block rounded-full font-medium transition-transform hover:scale-105 cursor-default ${sizeClass(skill.level)} ${colorClass(skill.level)}`}
                    title={`熟练度: ${skill.level}/5`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* 图例 */}
        <div className="mt-14 pt-8 border-t border-stone-200/30 dark:border-stone-700/30">
          <p className="text-xs opacity-40 mb-4">熟练度说明</p>
          <div className="flex flex-wrap gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-stone-800 dark:bg-stone-100" />
              精通
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-stone-600 dark:bg-stone-300" />
              熟练
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-stone-300 dark:bg-stone-600" />
              掌握
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-stone-200 dark:bg-stone-700" />
              了解
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700" />
              入门
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
