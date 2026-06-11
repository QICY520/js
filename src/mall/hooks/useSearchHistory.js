import { useState, useCallback } from 'react'
import { SEARCH_HISTORY_KEY, SEARCH_HISTORY_MAX } from '@/mall/constants/search'

function readHistory() {
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export default function useSearchHistory() {
  const [history, setHistory] = useState(readHistory)

  const addHistory = useCallback((keyword) => {
    const trimmed = keyword?.trim()
    if (!trimmed) return
    setHistory((prev) => {
      const next = [trimmed, ...prev.filter((h) => h !== trimmed)].slice(
        0,
        SEARCH_HISTORY_MAX,
      )
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const removeHistory = useCallback((keyword) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h !== keyword)
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    localStorage.removeItem(SEARCH_HISTORY_KEY)
    setHistory([])
  }, [])

  return { history, addHistory, removeHistory, clearHistory }
}
