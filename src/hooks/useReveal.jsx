import { useEffect, useRef, useState } from 'react'

/**
 * 滚动入场动画 hook
 * 用法：const { ref, isVisible } = useReveal()
 * 给元素加 ref，当元素进入视口时 isVisible 变为 true
 */
export function useReveal(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // 如果用户偏好减少动画，直接显示
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -50px 0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin])

  return { ref, isVisible }
}

/**
 *  Reveal 包裹组件
 * 用法：<Reveal><div>内容</div></Reveal>
 * 自动给子元素加 reveal / is-visible 类
 */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const { ref, isVisible } = useReveal()

  return (
    <Tag
      ref={ref}
      className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}
