import { useState, useLayoutEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, FileText, Wrench, ArrowRight } from 'lucide-react'
import Fuse from 'fuse.js'
import { useJsonData } from '../hooks/useJsonData'

export default function SearchModal({ open, onClose }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const dialogRef = useRef(null)
  const resultsRef = useRef(null)
  const { data: articles } = useJsonData('/data/articles.json')
  const { data: works } = useJsonData('/data/works.json')

  // 构建搜索索引
  const searchItems = useMemo(() => {
    const items = []
    works?.forEach(w => {
      items.push({
        type: 'work',
        id: w.id,
        title: w.title,
        description: w.description,
        tags: w.tags || [],
        path: `/works/${w.id}`,
      })
    })
    articles?.forEach(a => {
      items.push({
        type: 'article',
        id: a.id,
        title: a.title,
        description: a.summary,
        tags: a.tags || [],
        category: a.category,
        path: `/articles/${a.id}`,
      })
    })
    return items
  }, [articles, works])

  const fuse = useMemo(() => {
    return new Fuse(searchItems, {
      keys: [
        { name: 'title', weight: 0.5 },
        { name: 'description', weight: 0.2 },
        { name: 'tags', weight: 0.2 },
        { name: 'category', weight: 0.1 },
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 1,
    })
  }, [searchItems])

  const results = useMemo(() => {
    if (!query.trim()) return searchItems.slice(0, 6)
    return fuse.search(query.trim()).map(r => r.item).slice(0, 8)
  }, [query, fuse, searchItems])

  useLayoutEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    const previousFocus = document.activeElement
    setQuery('')
    setActiveIndex(0)
    dialog.showModal()
    inputRef.current.focus()
    return () => {
      dialog.close()
      previousFocus?.focus()
    }
  }, [open])

  if (!open) return null

  const handleSelect = (item) => {
    navigate(item.path)
    onClose()
  }

  const handleInputKey = e => {
    if (e.nativeEvent.isComposing || !results.length) return
    if (e.key === 'Enter') {
      e.preventDefault()
      if (results[activeIndex]) handleSelect(results[activeIndex])
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const step = e.key === 'ArrowDown' ? 1 : -1
      const index = Math.max(0, Math.min(activeIndex + step, results.length - 1))
      setActiveIndex(index)
      resultsRef.current.children[index]?.scrollIntoView({ block: 'nearest' })
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="站内搜索"
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none bg-transparent pt-[15vh] px-4 text-inherit open:flex items-start justify-center backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      onClick={onClose}
      onCancel={e => { e.preventDefault(); onClose() }}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-stone-800 rounded-2xl shadow-2xl border border-stone-200/50 dark:border-stone-700/50 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* 搜索输入框 */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-200/50 dark:border-stone-700/50">
          <Search size={18} className="opacity-40 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIndex(0) }}
            onKeyDown={handleInputKey}
            aria-label="搜索文章、项目或技术标签"
            placeholder="搜索文章、项目、技术标签..."
            className="min-w-0 flex-1 bg-transparent outline-none text-sm placeholder:opacity-40"
            spellCheck={false}
          />
          <button type="button" onClick={onClose} aria-label="关闭搜索" className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700">
            <X size={17} />
          </button>
        </div>

        {/* 搜索结果 */}
        <div ref={resultsRef} className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="text-center py-10 text-sm opacity-40">
              没有找到匹配的内容
            </div>
          ) : (
            results.map((item, i) => (
              <button
                key={`${item.type}-${item.id}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
                  i === activeIndex
                    ? 'bg-stone-100 dark:bg-stone-700/50'
                    : 'hover:bg-stone-50 dark:hover:bg-stone-700/30'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  item.type === 'article'
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                }`}>
                  {item.type === 'article' ? <FileText size={14} /> : <Wrench size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.title}</div>
                  <div className="text-xs opacity-40 truncate mt-0.5">{item.description}</div>
                </div>
                <div className="hidden sm:flex items-center gap-1 shrink-0">
                  {item.tags?.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-700/50 opacity-50">
                      {tag}
                    </span>
                  ))}
                  <ArrowRight size={12} className="opacity-30 ml-1" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* 底部提示 */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-stone-200/50 dark:border-stone-700/50 text-[10px] opacity-30">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="border border-stone-300 dark:border-stone-600 rounded px-1">↑</kbd>
              <kbd className="border border-stone-300 dark:border-stone-600 rounded px-1">↓</kbd>
              导航
            </span>
            <span className="flex items-center gap-1">
              <kbd className="border border-stone-300 dark:border-stone-600 rounded px-1">↵</kbd>
              打开
            </span>
          </div>
          <span>{results.length} 个结果</span>
        </div>
      </div>
    </dialog>
  )
}
