import { ExternalLink, Users } from 'lucide-react'
import { useJsonData } from '../hooks/useJsonData'
import { Reveal } from '../hooks/useReveal'

export default function FriendsPage() {
  const { data: friends } = useJsonData('/data/friends.json')

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* 页面头部 */}
        <Reveal>
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Users size={18} className="text-emerald-500" />
              <h1 className="text-2xl font-semibold">友情链接</h1>
            </div>
            <p className="text-sm opacity-50">
              一些我常逛的技术博客和优秀的个人网站，推荐给你。
            </p>
          </div>
        </Reveal>

        {/* 友链列表 */}
        {friends && friends.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {friends.map((friend, i) => (
              <Reveal key={friend.name} delay={i * 80}>
                <a
                  href={friend.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 p-5 rounded-2xl border border-stone-200/40 dark:border-stone-700/40 bg-white dark:bg-stone-800/30 hover:shadow-lg hover:shadow-stone-200/20 dark:hover:shadow-stone-900/30 hover:border-emerald-300/50 dark:hover:border-emerald-700/50 transition-all duration-300"
                >
                  {/* 头像 */}
                  <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-700 flex items-center justify-center shrink-0 overflow-hidden">
                    {friend.avatar ? (
                      <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold text-stone-400 dark:text-stone-500">
                        {friend.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="text-sm font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {friend.name}
                      </h3>
                      <ExternalLink size={11} className="opacity-30 group-hover:opacity-60 transition-opacity" />
                    </div>
                    <p className="text-xs opacity-50 leading-relaxed line-clamp-2">{friend.desc}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 opacity-40">
            <p className="text-sm">暂无友链</p>
          </div>
        )}

        {/* 申请友链 */}
        <Reveal delay={200}>
          <div className="mt-12 p-6 rounded-2xl border border-dashed border-stone-300 dark:border-stone-600 bg-stone-50/50 dark:bg-stone-800/20 text-center">
            <h2 className="text-sm font-medium mb-2 opacity-70">想交换友链？</h2>
            <p className="text-xs opacity-40 mb-4">
              如果你也有个人网站，欢迎通过下方方式联系我，我们可以互相添加友链。
            </p>
            <a
              href="mailto:3218524121@qq.com?subject=友链交换"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 text-xs hover:opacity-90 transition-opacity"
            >
              邮件联系我
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
