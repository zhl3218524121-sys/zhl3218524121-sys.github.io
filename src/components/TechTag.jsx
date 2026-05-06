/**
 * 技术栈标签组件 - 带分类配色
 * 控制系统蓝、嵌入式青、语言橙、网络紫
 */

const categoryColors = {
  '控制系统与仿真': {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800/30',
    text: 'text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  '嵌入式系统开发': {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  '编程语言': {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800/30',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  '网络与系统优化': {
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    border: 'border-violet-200 dark:border-violet-800/30',
    text: 'text-violet-700 dark:text-violet-300',
    dot: 'bg-violet-500',
  },
  '数据分析': {
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    border: 'border-rose-200 dark:border-rose-800/30',
    text: 'text-rose-700 dark:text-rose-300',
    dot: 'bg-rose-500',
  },
  '部署环境': {
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    border: 'border-cyan-200 dark:border-cyan-800/30',
    text: 'text-cyan-700 dark:text-cyan-300',
    dot: 'bg-cyan-500',
  },
}

const defaultColor = {
  bg: 'bg-stone-50 dark:bg-stone-800/40',
  border: 'border-stone-200 dark:border-stone-700/30',
  text: 'text-stone-600 dark:text-stone-400',
  dot: 'bg-stone-400',
}

export function TechCategory({ category, items }) {
  const colors = categoryColors[category] || defaultColor

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
        <span className="text-xs font-medium opacity-60">{category}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <TechTag key={item} label={item} colors={colors} />
        ))}
      </div>
    </div>
  )
}

export function TechTag({ label, colors }) {
  const c = colors || defaultColor
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs rounded-full border ${c.bg} ${c.border} ${c.text} hover:scale-105 hover:shadow-sm transition-all duration-200 cursor-default`}
    >
      {label}
    </span>
  )
}

export function SimpleTechTag({ label }) {
  return (
    <span className="px-2 py-0.5 text-[11px] rounded-md bg-stone-100 dark:bg-stone-700/50 opacity-70 hover:opacity-100 transition-opacity">
      {label}
    </span>
  )
}
