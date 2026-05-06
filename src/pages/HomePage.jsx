import { Link } from 'react-router-dom'
import { ArrowRight, Github, Mail, Briefcase, Download } from 'lucide-react'
import BgSwitcher from '../components/BgSwitcher'

import SocialIcons from '../components/SocialIcons'
import { useJsonData } from '../hooks/useJsonData'

export default function HomePage() {
  const { data: config, loading: cLoading } = useJsonData('/data/config.json')
  const { data: works } = useJsonData('/data/works.json')
  const { data: skills } = useJsonData('/data/skills.json')
  const site = config?.site
  const social = config?.social

  const featuredWorks = works?.filter(w => w.featured).slice(0, 3) || []
  const topSkills = skills?.filter(s => s.level >= 4).slice(0, 6) || []

  if (cLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BgSwitcher />
      <div className="absolute inset-0 bg-black/20 dark:bg-black/30 pointer-events-none" />

      {/* 装饰方块 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[6%] w-20 h-20 bg-white/5 rounded-2xl" />
        <div className="absolute top-[18%] right-[10%] w-28 h-28 bg-white/5 rounded-2xl" />
        <div className="absolute top-[42%] left-[3%] w-14 h-14 bg-white/5 rounded-xl" />
        <div className="absolute top-[52%] right-[6%] w-24 h-24 bg-white/5 rounded-2xl" />
        <div className="absolute bottom-[15%] left-[12%] w-16 h-16 bg-white/5 rounded-xl" />
        <div className="absolute bottom-[22%] right-[15%] w-12 h-12 bg-white/5 rounded-lg" />
        <div className="absolute top-[32%] left-[18%] w-10 h-10 bg-white/5 rounded-lg" />
        <div className="absolute top-[62%] right-[22%] w-20 h-20 bg-white/5 rounded-2xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-[90rem] grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* 左侧：个人资料 */}
          <div className="lg:col-span-4 space-y-4">
            {/* 头像卡片 */}
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/15 p-10 text-center">
              <div className="relative mx-auto mb-4 w-24 h-24">
                <img
                  src={site?.avatar || 'https://via.placeholder.com/200'}
                  alt="avatar"
                  className="w-full h-full rounded-full object-cover border-2 border-white/30 shadow-xl"
                />

              </div>
              <h1 className="text-2xl font-bold text-white mb-1">{site?.name || '章海林'}</h1>
              <p className="text-sm text-white/60 mb-4">{site?.tagline || '控制科学与工程 / 机器人学 / 嵌入式系统研发'}</p>
              <div className="flex items-center justify-center gap-2">
                <Link
                  to="/works"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs transition-all"
                >
                  <Briefcase size={12} />
                  查看作品
                </Link>
                <a
                  href={site?.resumePdf || '#'}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs transition-all"
                >
                  <Download size={12} />
                  下载简历
                </a>
              </div>
            </div>

            {/* 社交链接 */}
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/15 p-8">
              <h3 className="text-xs font-semibold text-white/50 mb-3">社交链接</h3>
              <div className="flex justify-center">
                <SocialIcons social={social} />
              </div>
            </div>

            {/* 技术栈 */}
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/15 p-8">
              <h3 className="text-xs font-semibold text-white/50 mb-3">技术栈</h3>
              <div className="flex flex-wrap gap-2">
                {topSkills.map(skill => (
                  <span key={skill.name} className="px-2.5 py-1 rounded-full bg-white/10 text-white/80 text-xs border border-white/10">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：内容区 */}
          <div className="lg:col-span-8 space-y-4">
            {/* 关于 */}
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/15 p-10">
              <h2 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                关于
              </h2>
              <p className="text-sm text-white/70 leading-relaxed">{site?.bio}</p>
              <Link to="/about" className="inline-flex items-center gap-1 mt-4 text-xs text-white/50 hover:text-white transition-colors">
                了解更多 <ArrowRight size={12} />
              </Link>
            </div>

            {/* 精选作品 */}
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/15 p-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white/70">精选作品</h2>
                <Link to="/works" className="text-xs text-white/40 hover:text-white transition-colors">查看全部 →</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {featuredWorks.map(work => (
                  <Link
                    key={work.id}
                    to="/works"
                    className="group rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <div className="aspect-[3/2] overflow-hidden">
                      <img src={work.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm text-white/90 truncate">{work.title}</h3>
                      <p className="text-[11px] text-white/40 truncate">{work.tags.join(' · ')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 核心技能 */}
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/15 p-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white/70">核心技能</h2>
                <Link to="/skills" className="text-xs text-white/40 hover:text-white transition-colors">查看全部 →</Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {topSkills.map(skill => (
                  <span
                    key={skill.name}
                    className={`inline-block rounded-full font-medium transition-transform hover:scale-105 cursor-default ${
                      skill.level >= 5
                        ? 'text-sm px-4 py-1.5 bg-white/20 text-white'
                        : 'text-xs px-3 py-1 bg-white/10 text-white/70'
                    }`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
