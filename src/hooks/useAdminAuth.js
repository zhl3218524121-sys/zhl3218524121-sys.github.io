import { useState, useEffect } from 'react'
import { auth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '../firebase'

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
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch (err) {
      setError('登录失败：邮箱或密码错误')
      return false
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  return { user, loading, error, login, logout, isAdmin: !!user }
}
