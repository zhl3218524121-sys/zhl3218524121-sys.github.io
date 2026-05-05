import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-8 w-48 h-48 rounded-2xl overflow-hidden opacity-80">
        <img
          src="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=400&h=400&fit=crop"
          alt="404"
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="text-4xl font-semibold mb-3">404</h1>
      <p className="text-lg opacity-50 mb-8 max-w-sm">
        页面似乎迷路了，就像这张图片里的猫一样迷茫。
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 text-sm hover:opacity-90 transition-opacity"
      >
        <ArrowLeft size={16} />
        返回首页
      </Link>
    </div>
  )
}
