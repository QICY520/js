import { useEffect, useState } from 'react'

const PAY_TIMEOUT_SECONDS = 15 * 60

/** 格式化剩余支付时间 mm:ss */
export function formatPayCountdown(seconds) {
  const safe = Math.max(0, Math.floor(seconds))
  const m = Math.floor(safe / 60)
  const s = safe % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/** 支付弹窗 15 分钟倒计时，visible 为 false 时重置 */
export default function usePayCountdown(visible) {
  const [secondsLeft, setSecondsLeft] = useState(PAY_TIMEOUT_SECONDS)

  useEffect(() => {
    if (!visible) {
      setSecondsLeft(PAY_TIMEOUT_SECONDS)
      return undefined
    }

    setSecondsLeft(PAY_TIMEOUT_SECONDS)
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [visible])

  return {
    secondsLeft,
    formatted: formatPayCountdown(secondsLeft),
    expired: secondsLeft <= 0,
  }
}
