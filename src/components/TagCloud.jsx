import { useNavigate } from 'react-router-dom'
import { useJsonData } from '../hooks/useJsonData'

export default function TagCloud({ onTagClick, activeTag }) {
  const navigate = useNavigate()
  const { data: articles } = useJsonData('/data/articles.json')
  const { data: works } = useJsonData('/data/works.json')

  // 统计所有标签出现次数
  const tagCounts = {}
  articles?.forEach(a => {
    a.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  works?.forEach(w => {
    w.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)

  const maxCount = Math.max(...sortedTags.map(([, c]) => c), 1)

  const handleClick = (tag) => {
    if (onTagClick) {
      onTagClick(tag)
    } else {
      navigate(`/articles`)
    }
  }

  if (sortedTags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {sortedTags.map(([tag, count]) => {
        const size = 0.75 + (count / maxCount) * 0.5 // 0.75rem ~ 1.25rem
        const opacity = 0.4 + (count / maxCount) * 0.6
        const isActive = activeTag === tag

        return (
          <button
            key={tag}
            onClick={() => handleClick(tag)}
            className={`px-2.5 py-1 rounded-full border text-xs transition-all duration-200 hover:scale-105 ${
              isActive
                ? 'bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 border-transparent'
                : 'border-white/30 bg-white/10 text-white/90 hover:bg-white/20 hover:border-white/40'
            }`}
            style={{
              fontSize: `${size}rem`,
            }}
          >
            {tag}
            <span className="ml-1 text-[10px] opacity-50">{count}</span>
          </button>
        )
      })}
    </div>
  )
}
