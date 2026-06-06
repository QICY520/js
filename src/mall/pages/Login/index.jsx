import { useState } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Form, Input, Button } from 'antd-mobile'
import { UserOutline, LockOutline } from 'antd-mobile-icons'
import useMallUserStore from '@/mall/store/useMallUserStore'
import mallToast from '@/mall/utils/toast'

export default function MallLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useMallUserStore((s) => s.login)
  const isLoggedIn = useMallUserStore((s) => !!s.token && !!s.user)
  const [loading, setLoading] = useState(false)

  if (isLoggedIn) {
    const from = location.state?.from || '/'
    return <Navigate to={from} replace />
  }

  const onFinish = async (values) => {
    setLoading(true)
    try {
      await login(values.username, values.password)
      mallToast.success('登录成功，欢迎回来！')
      const from = location.state?.from || '/'
      setTimeout(() => navigate(from, { replace: true }), 300)
    } catch (err) {
      mallToast.fail(err.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-100 via-cream-50 to-olive-50 flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-8 max-w-lg mx-auto w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-light tracking-tight text-olive-800">LUMIÈRE</h1>
          <p className="text-sm text-stone-500 mt-2">极简生活美学商城</p>
        </div>

        <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-white shadow-xl shadow-olive-900/5 p-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-6">用户登录</h2>

          <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ username: 'user' }}
            footer={
              <Button
                block
                type="submit"
                color="primary"
                size="large"
                loading={loading}
                shape="rounded"
                style={{ '--background': '#4a6340', marginTop: 8 }}
              >
                登 录
              </Button>
            }
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" clearable prefix={<UserOutline />} />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input type="password" placeholder="请输入密码" clearable prefix={<LockOutline />} />
            </Form.Item>
          </Form>

          <div className="mt-6 pt-4 border-t border-cream-200">
            <p className="text-xs text-stone-400 mb-2">演示账号</p>
            <p className="text-xs text-stone-500">
              用户名 <code className="bg-cream-100 px-1 rounded">user</code> · 密码{' '}
              <code className="bg-cream-100 px-1 rounded">123456</code>
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-stone-500">
          <Link to="/admin/login" className="text-olive-600">
            管理后台入口 →
          </Link>
        </p>
      </div>
    </div>
  )
}
