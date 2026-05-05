import { useState } from 'react'
import { Send } from 'lucide-react'

export default function SubscribeBar({ mailchimpUrl }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !mailchimpUrl) return
    setStatus('sending')
    // 如果用户配置了 Mailchimp URL，这里会实际提交
    if (mailchimpUrl.includes('YOUR_MAILCHIMP')) {
      setTimeout(() => setStatus('success'), 800)
      return
    }
    try {
      const formData = new FormData()
      formData.append('EMAIL', email)
      await fetch(mailchimpUrl, { method: 'POST', body: formData, mode: 'no-cors' })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="w-full bg-stone-100 dark:bg-stone-800/50 border-t border-stone-200/40 dark:border-stone-700/40">
      <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm opacity-60">订阅更新，第一时间获取新文章与作品</p>
        <form onSubmit={handleSubmit} className="flex w-full sm:w-auto gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={e => { setEmail(e.target.value); setStatus('idle') }}
            placeholder="your@email.com"
            className="flex-1 sm:w-56 px-3 py-2 text-sm rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400/30 transition-all"
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="px-4 py-2 text-sm rounded-lg bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send size={14} />
            {status === 'sending' ? '发送中' : status === 'success' ? '已订阅' : '订阅'}
          </button>
        </form>
      </div>
    </div>
  )
}
