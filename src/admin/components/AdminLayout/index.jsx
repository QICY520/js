import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Typography, theme } from 'antd'
import {
  ShopOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons'
import useAdminStore from '@/admin/store/useAdminStore'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const ALL_MENU = [
  { key: '/admin/products', icon: <ShopOutlined />, label: '商品管理', permission: 'product' },
  { key: '/admin/categories', icon: <AppstoreOutlined />, label: '分类管理', permission: 'category' },
  { key: '/admin/orders', icon: <ShoppingCartOutlined />, label: '订单管理', permission: 'order' },
  { key: '/admin/users', icon: <TeamOutlined />, label: '用户管理', permission: 'user' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = theme.useToken()
  const user = useAdminStore((s) => s.user)
  const logout = useAdminStore((s) => s.logout)
  const hasPermission = useAdminStore((s) => s.hasPermission)
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = ALL_MENU.filter((item) => hasPermission(item.permission))

  const userMenu = {
    items: [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: () => {
          logout()
          navigate('/admin/login')
        },
      },
    ],
  }

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={220}
        style={{ background: '#2b3728' }}
      >
        <div className="h-16 flex items-center justify-center border-b border-white/10">
          <Text className={`font-semibold text-cream-50 transition-all ${collapsed ? 'text-sm' : 'text-base'}`}>
            {collapsed ? 'LM' : 'LUMIÈRE 后台'}
          </Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: 'transparent', borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: token.colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg text-stone-600 hover:text-olive-700 transition-colors cursor-pointer bg-transparent border-0"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>

          <Dropdown menu={userMenu} placement="bottomRight">
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar size={32} icon={<UserOutlined />} src={user?.avatar} />
              <div className="hidden sm:block">
                <Text className="text-sm font-medium block leading-tight">{user?.nickname}</Text>
                <Text type="secondary" className="text-xs">{user?.role}</Text>
              </div>
            </div>
          </Dropdown>
        </Header>

        <Content style={{ margin: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
