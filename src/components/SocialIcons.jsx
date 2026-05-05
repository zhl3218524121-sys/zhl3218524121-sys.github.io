import { Github, Twitter, Mail } from 'lucide-react'

export default function SocialIcons({ social }) {
  if (!social) return null
  const items = [
    { key: 'github', label: 'GitHub', icon: Github, url: social.github },
    { key: 'twitter', label: 'Twitter', icon: Twitter, url: social.twitter },
    { key: 'email', label: '邮箱', icon: Mail, url: social.email ? `mailto:${social.email}` : null },
  ].filter(i => i.url)

  return (
    <div className="flex items-center gap-4">
      {items.map(item => (
        <a
          key={item.key}
          href={item.url}
          className="tooltip-top text-white/80 hover:text-white transition-colors duration-300"
          aria-label={item.label}
          data-tip={item.label}
        >
          <item.icon size={22} />
        </a>
      ))}
    </div>
  )
}
