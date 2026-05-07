import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase, Download, FileText, Wrench, BookOpen } from 'lucide-react'
import BgSwitcher from '../components/BgSwitcher'
import SocialIcons from '../components/SocialIcons'
import TagCloud from '../components/TagCloud'
import { useJsonData } from '../hooks/useJsonData'

export default function HomePage() {
  const { data: config, loading: cLoading } = useJsonData('/data/config.json')
  const { data: works } = useJsonData('/data/works.json')
  const { data: skills } = useJsonData('/data/skills.json')
  const { data: articles } = useJsonData('/data/articles.json')
  const site = config?.site
  const social = config?.social

  const featuredWorks = works?.filter(w => w.featured).slice(0, 3) || []
  const topSkills = skills?.filter(s => s.level >= 4).slice(0, 8) || []
  const featuredArticles = articles?.filter(a => a.featured).slice(0, 3) || []

  const stats = [
    { label: '项目', value: works?.length || 0, icon: Wrench, path: '/works' },
    { label: '文章', value: articles?.length || 0, icon: FileText, path: '/articles' },
    { label: '技能', value: skills?.length || 0, icon: BookOpen, path: '/skills' },
  ]

  if (cLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative">
      {/* ====== HERO 首屏 ====== */}
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

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-2xl">
            {/* 头像 */}
            <div className="relative mx-auto mb-6 w-28 h-28">
              <img
                src={site?.avatar || 'https://via.placeholder.com/200'}
                alt="avatar"
                className="w-full h-full rounded-full object-cover border-2 border-white/30 shadow-xl"
              />
            </div>

            {/* 名字 */}
            <h1 className="text-4xl font-bold text-white mb-3">{site?.name || '章海林'}</h1>
            <p className="text-lg text-white/70 mb-2">{site?.tagline || '控制科学与工程 / 机器人学 / 嵌入式系统研发'}</p>
            <p className="text-sm text-white/50 mb-8 max-w-md mx-auto leading-relaxed">{site?.bio?.slice(0, 80)}...</p>

            {/* 核心数据 */}
            <div className="flex items-center justify-center gap-6 mb-8">
              {stats.map(stat => (
                <Link
                  key={stat.label}
                  to={stat.path}
                  className="text-center group"
                >
                  <div className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">{stat.value}</div>
                  <div className="text-xs text-white/50 flex items-center gap-1 justify-center">
                    <stat.icon size={12} />
                    {stat.label}
                  </div>
                </Link>
              ))}
            </div>

            {/* CTA 按钮 */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <Link
                to="/works"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-stone-900 text-sm font-medium hover:bg-white/90 transition-colors"
              >
                <Briefcase size={14} />
                查看作品
              </Link>
              <a
                href={site?.resumePdf || '#'}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm transition-all"
              >
                <Download size={14} />
                下载简历
              </a>
            </div>

            {/* 社交链接 */}
            <div className="flex justify-center">
              <SocialIcons social={social} />
            </div>
          </div>
        </div>
      </div>

      {/* ====== 下方分区块 ====== */}
      <div className="relative">
        <BgSwitcher />
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20 pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 space-y-20">

          {/* 精选作品 */}
          {featuredWorks.length > 0 && (
            <section className="bg-white/5 dark:bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/15 p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">精选作品</h2>
                  <p className="text-sm text-white/50">独立或团队完成的项目</p>
                </div>
                <Link to="/works" className="text-sm text-white/60 hover:text-white transition-opacity flex items-center gap-1">
                  查看全部 <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {featuredWorks.map(work => (
                  <Link
                    key={work.id}
                    to={`/works/${work.id}`}
                    className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-400"
                  >
                    <div className="aspect-[3/2] overflow-hidden">
                      <img src={work.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-medium mb-1 text-white/90 group-hover:text-emerald-400 transition-colors">{work.title}</h3>
                      <p className="text-xs text-white/50 line-clamp-2">{work.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 核心技能 + 标签云 */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 dark:bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/15 p-10">
              <h2 className="text-xl font-semibold text-white mb-1">核心技能</h2>
              <p className="text-sm text-white/50 mb-6">技术能力分布</p>
              <div className="flex flex-wrap gap-2">
                {topSkills.map(skill => (
                  <span
                    key={skill.name}
                    className={`inline-block rounded-full font-medium transition-transform hover:scale-105 cursor-default ${
                      skill.level >= 5
                        ? 'text-sm px-4 py-2 bg-white/20 text-white'
                        : 'text-xs px-3 py-1.5 bg-white/10 text-white/70'
                    }`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white/5 dark:bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/15 p-10">
              <h2 className="text-xl font-semibold text-white mb-1">技术标签</h2>
              <p className="text-sm text-white/50 mb-6">按主题筛选内容</p>
              <TagCloud />
            </div>
          </section>

          {/* 精选文章 */}
          {featuredArticles.length > 0 && (
            <section className="bg-white/5 dark:bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/15 p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">技术文章</h2>
                  <p className="text-sm text-white/50">思考、踩坑与解决方案</p>
                </div>
                <Link to="/articles" className="text-sm text-white/60 hover:text-white transition-opacity flex items-center gap-1">
                  查看全部 <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuredArticles.map(article => (
                  <Link
                    key={article.id}
                    to={`/articles/${article.id}`}
                    className="group p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-50/20 text-emerald-400 border border-emerald-500/30">
                        {article.category}
                      </span>
                      <span className="text-[10px] text-white/40">{article.readTime}</span>
                    </div>
                    <h3 className="font-medium text-sm mb-2 text-white/90 group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-white/50 line-clamp-2">{article.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  )
}
