import { useState } from 'react'
import { Send, CheckCircle, AlertCircle, Mail, MapPin, Github, Bell } from 'lucide-react'
import { useJsonData } from '../hooks/useJsonData'

export default function ContactPage() {
  const { data: config } = useJsonData('/data/config.json')
  const services = config?.services
  const site = config?.site
  const social = config?.social
  const web3formsKey = services?.web3formsKey

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const [subEmail, setSubEmail] = useState('')
  const [subStatus, setSubStatus] = useState('idle')

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (status !== 'idle') setStatus('idle')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')

    if (!web3formsKey || web3formsKey.includes('YOUR_')) {
      setTimeout(() => {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
      }, 1000)
      return
    }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: web3formsKey,
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `来自 ${form.name} 的新消息`,
        }),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const handleSubscribe = async e => {
    e.preventDefault()
    if (!subEmail) return
    setSubStatus('sending')
    setTimeout(() => {
      setSubStatus('success')
      setSubEmail('')
    }, 800)
  }

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* 左侧：信息与订阅 */}
          <div>
            <h1 className="text-3xl font-semibold mb-2">联系我</h1>
            <p className="text-sm opacity-50 mb-10">
              有合作意向或想聊聊技术？欢迎随时联系。
            </p>

            <div className="space-y-6">
              {site?.email && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="text-xs opacity-40 mb-0.5">邮箱</div>
                    <a href={`mailto:${site.email}`} className="text-sm hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      {site.email}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <div className="text-xs opacity-40 mb-0.5">位置</div>
                  <span className="text-sm">中国</span>
                </div>
              </div>

              {social?.github && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Github size={16} />
                  </div>
                  <div>
                    <div className="text-xs opacity-40 mb-0.5">GitHub</div>
                    <a
                      href={social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      {social.github.replace('https://', '')}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* 订阅更新 */}
            <div className="mt-12 pt-8 border-t border-stone-200/30 dark:border-stone-700/30">
              <div className="flex items-center gap-2 mb-2">
                <Bell size={14} className="opacity-60" />
                <h3 className="text-sm font-medium">订阅更新</h3>
              </div>
              <p className="text-xs opacity-40 mb-4">输入邮箱，获取最新文章与项目动态。</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={subEmail}
                  onChange={e => { setSubEmail(e.target.value); setSubStatus('idle') }}
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 text-sm transition-all"
                />
                <button
                  type="submit"
                  disabled={subStatus === 'sending'}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {subStatus === 'success' ? '已订阅' : '订阅'}
                </button>
              </form>
            </div>
          </div>

          {/* 右侧：联系表单 */}
          <div className="bg-white dark:bg-stone-800/40 rounded-2xl border border-stone-200/40 dark:border-stone-700/40 p-6 md:p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">姓名</label>
                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 text-sm transition-all"
                  placeholder="你的名字"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">邮箱</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 text-sm transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">留言 *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 text-sm transition-all resize-none"
                  placeholder="想对我说点什么..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <Send size={14} />
                {status === 'sending' ? '发送中...' : status === 'success' ? '发送成功' : '发送留言'}
              </button>

              {status === 'success' && (
                <div className="flex items-center justify-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
                  <CheckCircle size={14} />
                  消息已发送，我会尽快回复
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center justify-center gap-1.5 text-sm text-red-500">
                  <AlertCircle size={14} />
                  发送失败，请重试
                </div>
              )}
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}
