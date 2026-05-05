import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 shadow-lg flex items-center justify-center transition-all duration-400 hover:scale-105 opacity-100"
      aria-label="回到顶部"
      title="回到顶部"
    >
      <ArrowUp size={18} />
    </button>
  )
}
