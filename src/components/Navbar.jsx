import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Search } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { useJsonData } from '../hooks/useJsonData'

const navItems = [
  { path: '/', label: '首页' },
  { path: '/about', label: '关于' },
  { path: '/now', label: 'Now' },
  { path: '/works', label: '作品' },
  { path: '/articles', label: '文章' },
  { path: '/gallery', label: '灵感' },
  { path: '/timeline', label: '经历' },
  { path: '/resume', label: '简历' },
  { path: '/skills', label: '技能' },
  { path: '/books', label: '书架' },
  { path: '/contact', label: '联系' },
]

export default function Navbar({ onSearchOpen }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { data: config } = useJsonData('/data/config.json')
  const statusText = config?.site?.status

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-400 ${
      isHome
        ? 'bg-black/20 dark:bg-black/30 backdrop-blur-md border-white/10'
        : 'glass border-stone-200/30 dark:border-stone-700/30'
    }`}>
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className={`text-lg font-semibold tracking-tight hover:opacity-70 transition-opacity ${isHome ? 'text-white' : ''}`}
          >
            Zhang Hailin
          </Link>
          {/* 状态徽章：仅大屏显示，首页用白色版本 */}
          {statusText && (
            <div className={`hidden lg:block ${isHome ? '[&_span]:text-white/80' : ''}`}>
              <StatusBadge text={statusText} />
            </div>
          )}
        </div>

        {/* Desktop */}
        <div className={`hidden md:flex items-center gap-4 lg:gap-5 text-sm ${isHome ? 'text-white' : ''}`}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`transition-opacity duration-300 hover:opacity-100 ${
                location.pathname === item.path ? 'opacity-100 font-medium' : 'opacity-70'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={onSearchOpen}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
              isHome
                ? 'border-white/20 text-white/70 hover:text-white hover:border-white/40'
                : 'border-stone-300/50 dark:border-stone-600/50 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
            title="搜索 (Ctrl+K)"
            aria-label="搜索"
          >
            <Search size={13} />
            <span className="text-[10px] opacity-50 hidden xl:inline">Ctrl K</span>
          </button>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={onSearchOpen}
            className={`p-2 transition-opacity ${isHome ? 'text-white opacity-70 hover:opacity-100' : 'opacity-60 hover:opacity-100'}`}
            aria-label="搜索"
          >
            <Search size={18} />
          </button>
          <button
            className={`p-2 -mr-2 transition-opacity ${isHome ? 'text-white opacity-70 hover:opacity-100' : 'opacity-60 hover:opacity-100'}`}
            onClick={() => setOpen(!open)}
            aria-label="菜单"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className={`md:hidden max-h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain border-b animate-fade-in ${
          isHome
            ? 'bg-black/60 dark:bg-black/70 backdrop-blur-lg border-white/10'
            : 'glass-strong border-stone-200/30 dark:border-stone-700/30'
        }`}>
          <div className={`px-6 py-4 flex flex-col gap-3 text-sm ${isHome ? 'text-white' : ''}`}>
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`py-1 transition-opacity ${location.pathname === item.path ? 'opacity-100 font-medium' : 'opacity-70'}`}
              >
                {item.label}
              </Link>
            ))}
            {statusText && <StatusBadge text={statusText} />}
          </div>
        </div>
      )}
    </nav>
  )
}
