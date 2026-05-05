import { useState, useRef, useEffect } from 'react'
import { Settings, Sun, Moon } from 'lucide-react'

export default function ThemeMenu({ dark, toggleDark }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="fixed bottom-20 right-6 z-50 md:bottom-24 md:right-8">
      {open && (
        <div className="mb-3 flex flex-col gap-2 bg-white/90 dark:bg-stone-800/90 backdrop-blur-md rounded-xl shadow-lg border border-stone-200/40 dark:border-stone-700/40 p-2 animate-slide-up">
          <button
            onClick={() => { toggleDark(); setOpen(false) }}
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            {dark ? '浅色模式' : '深色模式'}
          </button>

        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="tooltip w-10 h-10 rounded-full bg-white/90 dark:bg-stone-800/90 backdrop-blur-md shadow-lg border border-stone-200/40 dark:border-stone-700/40 flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="设置"
        data-tip="设置"
      >
        <Settings size={18} className={`transition-transform duration-500 ${open ? 'rotate-90' : ''}`} />
      </button>
    </div>
  )
}
