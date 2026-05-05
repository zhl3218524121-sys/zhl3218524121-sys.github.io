import { useState } from 'react'
import { MessageSquare, Send, CheckCircle } from 'lucide-react'

/**
 * 本地评论系统
 * 评论存储在 localStorage，需要管理员审核后才显示
 * 评论者提交后看到"评论已提交"，不知道需要审核
 */
export default function CommentSlot({ workId }) {
  const [form, setForm] = useState({ name: '', email: '', content: '' })
  const [submitted, setSubmitted] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const storageKey = `comments-${workId}`
  const pendingKey = `comments-pending-${workId}`

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.content.trim()) return

    const comment = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      content: form.content.trim(),
      date: new Date().toISOString(),
      approved: false,
    }

    // 保存到待审核列表
    const pending = JSON.parse(localStorage.getItem(pendingKey) || '[]')
    pending.push(comment)
    localStorage.setItem(pendingKey, JSON.stringify(pending))

    setForm({ name: '', email: '', content: '' })
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  // 读取已审核的评论
  const approvedComments = JSON.parse(localStorage.getItem(storageKey) || '[]')

  return (
    <div className="comment-slot">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={14} className="opacity-50" />
        <span className="text-xs font-medium opacity-50">评论</span>
        {approvedComments.length > 0 && (
          <span className="text-[10px] opacity-30">({approvedComments.length})</span>
        )}
      </div>

      {/* 已审核评论列表 */}
      {approvedComments.length > 0 && (
        <div className="space-y-3 mb-5">
          {approvedComments.map(c => (
            <div key={c.id} className="rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/30 dark:border-stone-700/30 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">{c.name}</span>
                <span className="text-[10px] opacity-30">{new Date(c.date).toLocaleDateString('zh-CN')}</span>
              </div>
              <p className="text-xs opacity-60 leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* 评论表单 */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            required
            placeholder="昵称"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="px-3 py-2 rounded-lg bg-white/50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:ring-2 focus:ring-stone-400/30"
          />
          <input
            type="email"
            placeholder="邮箱（可选）"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="px-3 py-2 rounded-lg bg-white/50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:ring-2 focus:ring-stone-400/30"
          />
        </div>
        <textarea
          required
          rows={2}
          placeholder="写下你的评论..."
          value={form.content}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-stone-400/30"
        />
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 text-xs hover:opacity-90 transition-opacity"
          >
            <Send size={12} />
            提交评论
          </button>
          {submitted && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle size={12} />
              评论已提交
            </span>
          )}
        </div>
      </form>

      {/* 管理员审核入口 - 需要密码 */}
      <div className="mt-3 pt-3 border-t border-dashed border-stone-200 dark:border-stone-700/30">
        {!isAdmin ? (
          <button
            onClick={() => {
              const pwd = prompt('请输入管理员密码')
              if (pwd === 'admin888') setIsAdmin(true)
            }}
            className="text-[10px] opacity-20 hover:opacity-40 transition-opacity select-none"
          >
            管理员
          </button>
        ) : (
          <div className="text-[10px]">
            <div className="flex items-center justify-between mb-1">
              <span className="opacity-40">管理员面板</span>
              <button onClick={() => setIsAdmin(false)} className="opacity-30 hover:opacity-60">退出</button>
            </div>
            <CommentAdmin workId={workId} />
          </div>
        )}
      </div>
    </div>
  )
}

// 管理员审核面板
function CommentAdmin({ workId }) {
  const storageKey = `comments-${workId}`
  const pendingKey = `comments-pending-${workId}`
  const [refresh, setRefresh] = useState(0)

  const pending = JSON.parse(localStorage.getItem(pendingKey) || '[]')
  const approved = JSON.parse(localStorage.getItem(storageKey) || '[]')

  const approve = (comment) => {
    const newApproved = [...approved, { ...comment, approved: true }]
    localStorage.setItem(storageKey, JSON.stringify(newApproved))
    localStorage.setItem(pendingKey, JSON.stringify(pending.filter(c => c.id !== comment.id)))
    setRefresh(r => r + 1)
  }

  const reject = (comment) => {
    localStorage.setItem(pendingKey, JSON.stringify(pending.filter(c => c.id !== comment.id)))
    setRefresh(r => r + 1)
  }

  const deleteApproved = (comment) => {
    localStorage.setItem(storageKey, JSON.stringify(approved.filter(c => c.id !== comment.id)))
    setRefresh(r => r + 1)
  }

  return (
    <div className="mt-2 space-y-2">
      {pending.length === 0 && approved.length === 0 && (
        <p className="opacity-30">暂无评论</p>
      )}

      {pending.length > 0 && (
        <div>
          <p className="opacity-40 mb-1">待审核 ({pending.length})</p>
          {pending.map(c => (
            <div key={c.id} className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 p-2 mb-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium">{c.name}</span>
                <div className="flex gap-1">
                  <button onClick={() => approve(c)} className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px]">通过</button>
                  <button onClick={() => reject(c)} className="px-2 py-0.5 rounded bg-red-400 text-white text-[10px]">拒绝</button>
                </div>
              </div>
              <p className="text-[10px] opacity-60 mt-0.5">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      {approved.length > 0 && (
        <div>
          <p className="opacity-40 mb-1">已通过 ({approved.length})</p>
          {approved.map(c => (
            <div key={c.id} className="flex items-center justify-between rounded-lg bg-stone-50 dark:bg-stone-800/30 p-2 mb-1">
              <span className="text-[10px] opacity-60">{c.name}: {c.content.slice(0, 20)}...</span>
              <button onClick={() => deleteApproved(c)} className="text-[10px] text-red-400 hover:text-red-500">删除</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
