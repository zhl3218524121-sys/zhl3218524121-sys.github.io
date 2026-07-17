import { useState, useEffect } from 'react'

/* 模块级缓存：已加载的数据 + 正在进行的请求 Promise */
const dataCache = new Map()
const promiseCache = new Map()

export function useJsonData(path) {
  const [data, setData] = useState(dataCache.get(path) || null)
  const [loading, setLoading] = useState(!dataCache.has(path))
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    if (dataCache.has(path)) {
      if (!cancelled) {
        setData(dataCache.get(path))
        setLoading(false)
      }
      return
    }

    const fetchData = () => {
      return fetch(path)
        .then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`)
          return r.json()
        })
        .then(d => {
          dataCache.set(path, d)
          return d
        })
    }

    let fetchPromise
    if (promiseCache.has(path)) {
      fetchPromise = promiseCache.get(path)
    } else {
      fetchPromise = fetchData()
      promiseCache.set(path, fetchPromise)
    }

    fetchPromise
      .then(d => {
        if (!cancelled) {
          setData(d)
          setLoading(false)
        }
      })
      .catch(e => {
        if (!cancelled) {
          setError(e)
          setLoading(false)
        }
      })
      .finally(() => {
        promiseCache.delete(path)
      })

    return () => { cancelled = true }
  }, [path])

  return { data, loading, error }
}
