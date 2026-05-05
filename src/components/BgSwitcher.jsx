import { useState, useEffect, useCallback } from 'react'
import { useJsonData } from '../hooks/useJsonData'

export default function BgSwitcher() {
  const { data: config } = useJsonData('/data/config.json')
  const images = config?.background?.images || []
  const interval = config?.background?.interval || 8000

  const [index, setIndex] = useState(0)

  const switchTo = useCallback((i) => {
    setIndex(i)
  }, [])

  const next = useCallback(() => {
    if (images.length <= 1) return
    switchTo((index + 1) % images.length)
  }, [images.length, index, switchTo])

  // 自动轮播
  useEffect(() => {
    if (images.length <= 1) return
    const t = setInterval(next, interval)
    return () => clearInterval(t)
  }, [images.length, interval, next])

  // 监听手动切换事件（仅通过设置菜单触发）
  useEffect(() => {
    const handler = () => next()
    window.addEventListener('bg-switch', handler)
    return () => window.removeEventListener('bg-switch', handler)
  }, [next])

  if (images.length === 0) return null

  return (
    <div className="fixed inset-0 -z-10">
      {images.map((src, i) => (
        <div
          key={src + i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.85)' }}
          />
        </div>
      ))}
      {/* 暗色遮罩 */}
      <div className="absolute inset-0 bg-stone-900/30 dark:bg-stone-950/50" />
    </div>
  )
}
