import { Outlet, useLocation } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { ConfigProvider as MobileConfigProvider } from 'antd-mobile'
import zhCN from 'antd/locale/zh_CN'
import zhCNMobile from 'antd-mobile/es/locales/zh-CN'
import MallToastHost from '@/mall/components/MallToastHost'

const adminTheme = {
  token: {
    colorPrimary: '#4a6340',
    colorBgContainer: '#fdfcf9',
    colorBgLayout: '#f8f6f0',
    borderRadius: 8,
    fontFamily: '"Inter", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif',
  },
}

function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  if (isAdmin) {
    return (
      <ConfigProvider locale={zhCN} theme={adminTheme}>
        <div className="relative min-h-screen" style={{ backgroundColor: 'rgba(240, 236, 227, 0.55)' }}>
          <Outlet />
        </div>
      </ConfigProvider>
    )
  }

  return (
    <MobileConfigProvider locale={zhCNMobile}>
      <div
        className="mall-viewport"
        style={{ backgroundColor: 'rgba(248, 246, 240, 0.55)' }}
      >
        <Outlet />
        <MallToastHost />
      </div>
    </MobileConfigProvider>
  )
}

export default App
