import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Code, BookOpen, Cpu, Music, Coffee, Calendar, ExternalLink, Sparkles } from 'lucide-react'
import { useJsonData } from '../hooks/useJsonData'
import { Reveal } from '../hooks/useReveal'

export default function NowPage() {
  const { data: config } = useJsonData('/data/config.json')
  const { data: books } = useJsonData('/data/books.json')
  const [lastUpdated] = useState('2026-09-28')

  const nowItems = [
    {
      icon: Code,
      title: '正在做',
      color: 'emerald',
      items: [
        '六自由度机械臂串级 PID 调参与力矩补偿',
        'STM32 嵌入式控制系统底层驱动优化',
        '个人网站功能迭代（你正在看的这个）',
      ],
    },
    {
      icon: BookOpen,
      title: '正在学',
      color: 'blue',
      items: [
        '现代控制理论（状态空间分析 / LQR / 卡尔曼滤波）',
        '机器人学（逆运动学 / 动力学建模 / 轨迹规划）',
        'Linux 内核与网络协议栈深入',
      ],
    },
    {
      icon: Cpu,
      title: '正在折腾',
      color: 'amber',
      items: [
        'FreeRTOS 任务调度器源码阅读',
        'MATLAB Simulink 代码生成与硬件在环测试',
        'TCP BBR 拥塞控制算法复现实验',
      ],
    },
    {
      icon: Coffee,
      title: '生活状态',
      color: 'violet',
      items: [
        '备战考研，目标浙江大学控制科学与工程',
        '每天保持 8 小时高效学习 + 1 小时技术写作',
        '周末偶尔打羽毛球放松',
      ],
    },
  ]

  const colorMap = {
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    violet: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
  }

  const readingBooks = books?.slice(0, 3) || []

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* 页面头部 */}
        <Reveal>
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-emerald-500" />
              <h1 className="text-2xl font-semibold">Now</h1>
            </div>
            <p className="text-sm opacity-50 mb-2">
              这是我的 <span className="font-medium">/now</span> 页面，记录当下正在做的事、正在学的东西。
            </p>
            <p className="text-xs opacity-30 flex items-center gap-1">
              <Calendar size={11} />
              最后更新：{lastUpdated}
            </p>
          </div>
        </Reveal>

        {/* 状态卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {nowItems.map((section, i) => (
            <Reveal key={section.title} delay={i * 100}>
              <div className="p-6 rounded-2xl border border-stone-200/40 dark:border-stone-700/40 bg-white dark:bg-stone-800/30 h-full">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[section.color]}`}>
                    <section.icon size={15} />
                  </div>
                  <h2 className="text-sm font-medium">{section.title}</h2>
                </div>
                <ul className="space-y-2.5">
                  {section.items.map((item, j) => (
                    <li key={j} className="text-xs opacity-60 leading-relaxed flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* 正在读的书 */}
        {readingBooks.length > 0 && (
          <Reveal delay={200}>
            <div className="mb-12">
              <h2 className="text-sm font-medium mb-4 flex items-center gap-2 opacity-70">
                <BookOpen size={15} className="opacity-50" />
                正在读
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {readingBooks.map(book => (
                  <Link
                    key={book.id}
                    to="/books"
                    className="group p-4 rounded-xl border border-stone-200/40 dark:border-stone-700/40 bg-stone-50 dark:bg-stone-800/20 hover:shadow-md transition-all"
                  >
                    {book.cover && (
                      <div className="aspect-[3/4] rounded-lg overflow-hidden mb-3 bg-stone-200 dark:bg-stone-700">
                        <img src={book.cover} alt={book.title} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <h3 className="text-xs font-medium mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{book.title}</h3>
                    <p className="text-[10px] opacity-40">{book.author}</p>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* 底部说明 */}
        <Reveal delay={300}>
          <div className="text-center py-8 border-t border-stone-200/30 dark:border-stone-700/30">
            <p className="text-xs opacity-30 mb-2">
               inspired by <a href="https://nownownow.com" target="_blank" rel="noopener noreferrer" className="hover:underline text-emerald-600 dark:text-emerald-400">nownownow.com</a>
            </p>
            <p className="text-xs opacity-20">
              如果你也在做类似的事，欢迎 <Link to="/contact" className="hover:underline">联系我</Link> 交流
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
