import { Link2 } from 'lucide-react'
import { useState } from 'react'

export default function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false)
  const shareUrl = typeof window !== 'undefined' ? (url || window.location.href) : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs opacity-40 mr-1">分享</span>
      <button
        onClick={handleCopy}
        className="w-8 h-8 rounded-full border border-stone-300/40 dark:border-stone-600/40 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        aria-label="复制链接"
        title={copied ? '已复制' : '复制链接'}
      >
        <Link2 size={14} />
      </button>
    </div>
  )
}
