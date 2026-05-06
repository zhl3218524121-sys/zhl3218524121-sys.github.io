import { useState, useEffect } from 'react'
import { auth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '../firebase'

// 允许的 admin 邮箱列表
const ADMIN_EMAILS = ['3218524121@qq.com']

export function useAdminAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const login = async (email, password) => {
    setError(null)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      // 验证是否为管理员邮箱
      if (!ADMIN_EMAILS.includes(result.user.email)) {
        await signOut(auth)
        setError('该账号没有管理员权限')
        return false
      }
      return true
    } catch (err) {
      setError('登录失败：邮箱或密码错误')
      return false
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  return { user, loading, error, login, logout, isAdmin: !!user && ADMIN_EMAILS.includes(user.email) }
}
