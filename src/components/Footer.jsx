import { Link } from 'react-router-dom'
import { Mail, MapPin, Github } from 'lucide-react'
import SocialIcons from './SocialIcons'
import { useJsonData } from '../hooks/useJsonData'

const footerLinks = [
  {
    title: '页面',
    links: [
      { label: '首页', path: '/' },
      { label: '关于', path: '/about' },
      { label: '作品', path: '/works' },
      { label: '文章', path: '/articles' },
      { label: '简历', path: '/resume' },
      { label: '技能', path: '/skills' },
    ],
  },
  {
    title: '更多',
    links: [
      { label: '灵感板', path: '/gallery' },
      { label: '书架', path: '/books' },
      { label: '联系我', path: '/contact' },
    ],
  },
]

export default function Footer() {
  const { data: config } = useJsonData('/data/config.json')
  const site = config?.site
  const social = config?.social

  return (
    <footer className="border-t border-stone-200/30 dark:border-stone-700/30 bg-stone-50/50 dark:bg-stone-900/30">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* 品牌信息 */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-lg font-semibold tracking-tight hover:opacity-70 transition-opacity">
              {site?.name || 'Zhang Hailin'}
            </Link>
            <p className="text-sm opacity-50 mt-2 mb-4 max-w-sm">
              {site?.tagline || '控制科学与工程 / 机器人学 / 嵌入式系统研发'}
            </p>
            <div className="space-y-2 text-sm opacity-50">
              {site?.email && (
                <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                  <Mail size={14} />
                  {site.email}
                </a>
              )}
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                中国
              </div>
              {social?.github && (
                <a href={social.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                  <Github size={14} />
                  GitHub
                </a>
              )}
            </div>
          </div>

          {/* 链接列表 */}
          {footerLinks.map(group => (
            <div key={group.title}>
              <h3 className="text-sm font-medium mb-3 opacity-70">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map(link => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm opacity-50 hover:opacity-100 transition-opacity"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 底部栏 */}
        <div className="pt-8 border-t border-stone-200/30 dark:border-stone-700/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs opacity-40">
            © {new Date().getFullYear()} {site?.name || 'Zhang Hailin'}. All rights reserved.
          </div>
          <SocialIcons social={social} />
        </div>
      </div>
    </footer>
  )
}
