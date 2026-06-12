import MallTabBar from '@/mall/components/MallTabBar'

/** 带底部 Tab 的商城页面容器 — iOS 风格 */
export default function MallPageShell({ children, className = '' }) {
  return (
    <div className={`min-h-screen pb-[50px] ${className}`}>
      {children}
      <MallTabBar />
    </div>
  )
}
