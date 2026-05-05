import { ExternalLink } from 'lucide-react'
import { useJsonData } from '../hooks/useJsonData'

export default function BooksPage() {
  const { data: books } = useJsonData('/data/books.json')

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">个人书架</h1>
        <p className="text-sm opacity-50 mb-10">读过且想推荐的书，点击卡片可查看详情</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books?.map(book => (
            <a
              key={book.id}
              href={book.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl overflow-hidden border border-stone-200/40 dark:border-stone-700/40 bg-white dark:bg-stone-800/40 hover:shadow-lg hover:shadow-stone-200/20 dark:hover:shadow-stone-900/30 transition-all duration-400"
            >
              <div className="aspect-[2/3] overflow-hidden bg-stone-100 dark:bg-stone-800 relative">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                {/* 悬停提示 */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-medium flex items-center gap-1 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    查看书籍 <ExternalLink size={12} />
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-sm">{book.title}</h3>
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-40 transition-opacity shrink-0 mt-0.5" />
                </div>
                <p className="text-xs opacity-40 mb-3">{book.author}</p>
                <p className="text-xs opacity-60 leading-relaxed">{book.recommendation}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
