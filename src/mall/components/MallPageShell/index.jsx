import MallTabBar from '@/mall/components/MallTabBar'

/** 带底部 Tab 的商城页面容器 — iOS 风格，内容区响应式限宽 */
export default function MallPageShell({ children, className = '' }) {
  return (
    <div className={`min-h-screen pb-[50px] ${className}`}>
      <div className="mall-main w-full">{children}</div>
      <MallTabBar />
    </div>
  )
}
