import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navItems = [
  { path: '/', label: '首页' },
  { path: '/about', label: '关于' },
  { path: '/works', label: '作品' },
  { path: '/articles', label: '文章' },
  { path: '/gallery', label: '灵感' },
  { path: '/timeline', label: '经历' },
  { path: '/resume', label: '简历' },
  { path: '/skills', label: '技能' },
  { path: '/books', label: '书架' },
  { path: '/contact', label: '联系' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-400 ${
      isHome
        ? 'bg-black/20 dark:bg-black/30 backdrop-blur-md border-white/10'
        : 'glass border-stone-200/30 dark:border-stone-700/30'
    }`}>
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          to="/"
          className={`text-lg font-semibold tracking-tight hover:opacity-70 transition-opacity ${
            isHome ? 'text-white' : ''
          }`}
        >
          Zhang Hailin
        </Link>

        {/* Desktop */}
        <div className={`hidden md:flex items-center gap-8 text-sm ${isHome ? 'text-white' : ''}`}>
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
        </div>

        {/* Mobile toggle */}
        <button
          className={`md:hidden p-2 -mr-2 transition-opacity ${
            isHome ? 'text-white opacity-70 hover:opacity-100' : 'opacity-60 hover:opacity-100'
          }`}
          onClick={() => setOpen(!open)}
          aria-label="菜单"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className={`md:hidden border-b animate-fade-in ${
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
                className={`py-1 transition-opacity ${
                  location.pathname === item.path ? 'opacity-100 font-medium' : 'opacity-70'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
