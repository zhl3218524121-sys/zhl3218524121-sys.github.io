import { useEffect, useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'

/**
 * 数字滚动计数组件
 * 当元素进入视口时，数字从 0 滚动到目标值
 */
export default function CountUp({ end, duration = 1500, suffix = '', prefix = '', className = '' }) {
  const { ref, isVisible } = useReveal({ threshold: 0.5 })
  const [count, setCount] = useState(0)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!isVisible || startedRef.current) return
    startedRef.current = true

    const startTime = performance.now()
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutCubic 缓动
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  )
}
