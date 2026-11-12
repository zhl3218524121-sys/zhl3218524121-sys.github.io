import { useId } from 'react'
import { Rss, Send } from 'lucide-react'

export default function SubscribeBar({ mailchimpUrl }) {
  const emailId = useId()
  const hasEmailSubscription = mailchimpUrl?.startsWith('https://') && !mailchimpUrl.includes('YOUR_')

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      {hasEmailSubscription && (
        <form action={mailchimpUrl} method="post" className="flex w-full max-w-sm gap-2">
          <label htmlFor={emailId} className="sr-only">订阅邮箱</label>
          <input
            id={emailId}
            name="EMAIL"
            type="email"
            autoComplete="email"
            required
            placeholder="your@email.com"
            className="min-w-0 flex-1 px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-emerald-500"
          />
          <button type="submit" className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800">
            <Send size={14} />
            邮件订阅
          </button>
        </form>
      )}
      <a href="/rss.xml" className="inline-flex items-center gap-2 font-medium text-emerald-700 dark:text-emerald-400 hover:underline">
        <Rss size={16} />
        通过 RSS 订阅文章
      </a>
    </div>
  )
}
