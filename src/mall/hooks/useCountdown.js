import { useState, useEffect } from 'react'

function pad(n) {
  return String(Math.max(0, n)).padStart(2, '0')
}

/** 倒计时至 endTimestamp（毫秒） */
export default function useCountdown(endTimestamp) {
  const [left, setLeft] = useState(() =>
    Math.max(0, (endTimestamp || 0) - Date.now()),
  )

  useEffect(() => {
    if (!endTimestamp) return undefined
    const tick = () => setLeft(Math.max(0, endTimestamp - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [endTimestamp])

  const totalSec = Math.floor(left / 1000)
  const hours = pad(Math.floor(totalSec / 3600))
  const minutes = pad(Math.floor((totalSec % 3600) / 60))
  const seconds = pad(totalSec % 60)

  return { hours, minutes, seconds, finished: left <= 0 }
}
