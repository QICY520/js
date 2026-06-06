import MallTabBar from '@/mall/components/MallTabBar'

/** 带底部 Tab 的商城页面容器 */
export default function MallPageShell({ children, className = '' }) {
  return (
    <div className={`min-h-screen pb-20 ${className}`}>
      {children}
      <MallTabBar />
    </div>
  )
}
