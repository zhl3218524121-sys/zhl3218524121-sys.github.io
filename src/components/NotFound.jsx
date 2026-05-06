import { Link } from 'react-router-dom'
import { ArrowLeft, Home, Search, Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-lg w-full text-center">
        {/* 404 数字 */}
        <div className="relative mb-8">
          <h1 className="text-[120px] sm:text-[160px] font-bold leading-none tracking-tighter opacity-[0.08] select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Compass size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm opacity-40">页面未找到</p>
            </div>
          </div>
        </div>

        {/* 标题 */}
        <h2 className="text-2xl font-semibold mb-3">这里似乎什么都没有</h2>
        <p className="text-sm opacity-50 mb-10 leading-relaxed max-w-sm mx-auto">
          你访问的页面可能已被移除、更名，或者从未存在过。
          <br />
          不妨看看下面的推荐页面。
        </p>

        {/* 快捷导航 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <NavCard to="/" icon={<Home size={18} />} label="首页" />
          <NavCard to="/works" icon={<Search size={18} />} label="作品集" />
          <NavCard to="/skills" icon={<Compass size={18} />} label="技能" />
          <NavCard to="/contact" icon={<ArrowLeft size={18} />} label="联系我" />
        </div>

        {/* 返回首页按钮 */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 text-sm hover:opacity-90 transition-opacity"
        >
          <ArrowLeft size={16} />
          返回首页
        </Link>
      </div>
    </div>
  )
}

function NavCard({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-2 p-4 rounded-xl border border-stone-200/40 dark:border-stone-700/40 bg-white dark:bg-stone-800/40 hover:shadow-md hover:border-stone-300 dark:hover:border-stone-600 transition-all duration-300 group"
    >
      <span className="opacity-40 group-hover:opacity-70 transition-opacity">{icon}</span>
      <span className="text-xs opacity-60 group-hover:opacity-100 transition-opacity">{label}</span>
    </Link>
  )
}
