import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, ConfigProvider } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import useAdminStore from '@/admin/store/useAdminStore'
import { USERNAME_RULES, LOGIN_PASSWORD_RULES } from '@/mall/constants/validation'

const { Title, Text } = Typography

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAdminStore((s) => s.login)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      await login(values.username, values.password)

      const hasPermission = useAdminStore.getState().hasPermission
      const from = location.state?.from
      const routePermMap = [
        { prefix: '/admin/products', permission: 'product' },
        { prefix: '/admin/categories', permission: 'category' },
        { prefix: '/admin/shops', permission: 'shop' },
        { prefix: '/admin/orders', permission: 'order' },
        { prefix: '/admin/users', permission: 'user' },
      ]
      const allowedFrom = routePermMap.find(
        (r) => from?.startsWith(r.prefix) && hasPermission(r.permission),
      )

      navigate(allowedFrom ? from : '/admin', { replace: true })
    } catch (err) {
      form.setFields([{ name: 'password', errors: [err.message || '登录失败'] }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          controlHeight: 52,
          fontSize: 16,
          borderRadius: 10,
        },
      }}
    >
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-cream-100 via-cream-50 to-olive-100">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-olive-700 text-cream-50 text-xl font-bold shadow-lg mb-5">
              LM
            </div>
            <Title level={2} className="!mb-2 !text-olive-800">
              LUMIÈRE 后台管理
            </Title>
            <Text type="secondary" className="text-base">管理员登录</Text>
          </div>

          <Card bordered={false} className="shadow-lg !px-2 !py-4">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              size="large"
              requiredMark={false}
            >
              <Form.Item name="username" label={<span className="text-base">管理员账号</span>} rules={USERNAME_RULES}>
                <Input
                  prefix={<UserOutlined className="text-stone-400" />}
                  placeholder="请输入管理员账号"
                  autoComplete="username"
                  className="!text-base"
                />
              </Form.Item>
              <Form.Item name="password" label={<span className="text-base">密码</span>} rules={LOGIN_PASSWORD_RULES}>
                <Input.Password
                  prefix={<LockOutlined className="text-stone-400" />}
                  placeholder="请输入密码"
                  autoComplete="current-password"
                  className="!text-base"
                />
              </Form.Item>
              <Form.Item className="!mb-0 !mt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  className="!bg-olive-700 !h-12 !text-base !font-medium"
                >
                  登录后台
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <p className="text-center text-sm text-stone-500 mt-8">
            商城用户请前往
            <Link to="/login" className="text-olive-600 ml-1">前台登录</Link>
          </p>
        </div>
      </div>
    </ConfigProvider>
  )
}
