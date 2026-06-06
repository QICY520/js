import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, Input, Button, Card, message, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import useAdminStore from '@/admin/store/useAdminStore'

const { Text } = Typography

const DEFAULT_ROUTES = [
  { permission: 'product', path: '/admin/products' },
  { permission: 'category', path: '/admin/categories' },
  { permission: 'order', path: '/admin/orders' },
  { permission: 'user', path: '/admin/users' },
]

function getDefaultRoute(hasPermission) {
  const route = DEFAULT_ROUTES.find((r) => hasPermission(r.permission))
  return route?.path || '/admin/forbidden'
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAdminStore((s) => s.login)
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    setLoading(true)
    try {
      await login(values.username, values.password)
      message.success('登录成功')
      const checkPerm = useAdminStore.getState().hasPermission
      const from = location.state?.from
      const target = from && from !== '/admin/login' ? from : getDefaultRoute(checkPerm)
      navigate(target, { replace: true })
    } catch (err) {
      message.error(err.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-cream-100 via-cream-50 to-olive-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-olive-800 tracking-tight">
            管理后台
          </h1>
          <p className="text-stone-500 text-sm mt-2">极简商城 · 运营管理中心</p>
        </div>

        <Card
          className="shadow-lg shadow-olive-900/5 border-cream-200"
          styles={{ body: { padding: '32px' } }}
        >
          <Form
            name="admin-login"
            layout="vertical"
            onFinish={onFinish}
            size="large"
            requiredMark={false}
            initialValues={{ username: 'admin' }}
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input prefix={<UserOutlined className="text-stone-400" />} placeholder="admin" />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-stone-400" />}
                placeholder="请输入密码"
              />
            </Form.Item>

            <Form.Item className="mb-0 mt-6">
              <Button type="primary" htmlType="submit" block loading={loading}>
                登 录
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-6 pt-4 border-t border-cream-200">
            <Text type="secondary" className="text-xs block mb-2">演示账号</Text>
            <div className="text-xs text-stone-500 space-y-1">
              <p><Text code>admin</Text> / admin123 — 全部模块</p>
              <p><Text code>test</Text> / 123456 — 仅商品管理</p>
              <p><Text code>operator</Text> / 123456 — 仅订单管理</p>
            </div>
          </div>
        </Card>

        <p className="text-center mt-6 text-sm text-stone-500">
          <Link to="/" className="text-olive-600 hover:text-olive-700 transition-colors">
            ← 返回商城首页
          </Link>
        </p>
      </div>
    </div>
  )
}
