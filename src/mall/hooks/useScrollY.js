import { useState, useEffect } from 'react'

/** 监听页面滚动距离，用于沉浸式导航栏 */
export default function useScrollY(threshold = 50) {
  const [scrollY, setScrollY] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop
      setScrollY(y)
      setScrolled(y > threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  const progress = Math.min(scrollY / threshold, 1)

  return { scrollY, scrolled, progress }
}
