import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Form, Input, Button } from 'antd-mobile'
import { UserOutline, LockOutline, SmileOutline } from 'antd-mobile-icons'
import useMallUserStore from '@/mall/store/useMallUserStore'
import useAdminStore from '@/admin/store/useAdminStore'
import { login as loginApi } from '@/utils/api'
import { isAdminRole } from '@/utils/auth'
import mallToast from '@/mall/utils/toast'
import { PASSWORD_RULE, USERNAME_RULES } from '@/mall/constants/validation'

const TABS = [
  { key: 'login', label: '登录' },
  { key: 'register', label: '注册' },
]

export default function AuthPage({ defaultTab = 'login' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const establishMallSession = useMallUserStore((s) => s.establishSession)
  const establishAdminSession = useAdminStore((s) => s.establishSession)
  const logoutMall = useMallUserStore((s) => s.logout)
  const logoutAdmin = useAdminStore((s) => s.logout)
  const register = useMallUserStore((s) => s.register)
  const [tab, setTab] = useState(defaultTab)
  const [loading, setLoading] = useState(false)
  const [loginForm] = Form.useForm()
  const [registerForm] = Form.useForm()

  const switchTab = (key) => {
    setTab(key)
    if (key === 'register') {
      registerForm.resetFields()
    }
  }

  const redirectAfterAuth = () => {
    const from = location.state?.from || '/'
    setTimeout(() => navigate(from, { replace: true }), 300)
  }

  const handleLogin = async (values) => {
    setLoading(true)
    try {
      const res = await loginApi({
        username: values.username,
        password: values.password,
      })
      const { token, user, role, permissions } = res.data

      if (isAdminRole(role)) {
        logoutMall()
        establishAdminSession(token, user, role, permissions)
        mallToast.success('管理员登录成功，正在进入后台…')
        const from = location.state?.from
        const adminTarget =
          from && from.startsWith('/admin') && from !== '/admin/forbidden' ? from : '/admin/products'
        setTimeout(() => navigate(adminTarget, { replace: true }), 300)
        return
      }

      logoutAdmin()
      establishMallSession(token, user)
      mallToast.success('登录成功，欢迎回来！')
      redirectAfterAuth()
    } catch (err) {
      mallToast.fail(err.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (values) => {
    if (values.password !== values.confirmPassword) {
      mallToast.fail('两次输入的密码不一致')
      return
    }
    setLoading(true)
    try {
      await register({
        username: values.username,
        password: values.password,
        nickname: values.nickname || values.username,
      })
      mallToast.success('注册成功，已自动登录')
      redirectAfterAuth()
    } catch (err) {
      mallToast.fail(err.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-cream-100 via-cream-50 to-olive-100">
      {/* 装饰背景 */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-olive-200/30 blur-3xl" />
      <div className="absolute bottom-20 -left-16 w-48 h-48 rounded-full bg-sea-200/25 blur-3xl" />

      <div className="relative flex flex-col min-h-screen max-w-lg mx-auto px-6 py-10">
        {/* 品牌区 */}
        <div className="text-center mt-8 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-olive-700 text-cream-50 text-xl font-bold shadow-lg shadow-olive-900/20 mb-4">
            L
          </div>
          <h1 className="text-2xl font-semibold tracking-wide text-olive-800">LUMIÈRE</h1>
          <p className="text-sm text-stone-500 mt-1">极简生活美学 · 品质好物</p>
        </div>

        {/* 表单卡片 */}
        <div className="flex-1">
          <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white shadow-2xl shadow-olive-900/8 overflow-hidden">
            {/* Tab 切换 */}
            <div className="flex border-b border-cream-200">
              {TABS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => switchTab(key)}
                  className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
                    tab === key ? 'text-olive-700' : 'text-stone-400'
                  }`}
                >
                  {label}
                  {tab === key && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-olive-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-6">
              {tab === 'login' ? (
                <Form
                  form={loginForm}
                  layout="vertical"
                  onFinish={handleLogin}
                  initialValues={{ username: 'user' }}
                  footer={
                    <Button
                      block
                      type="submit"
                      color="primary"
                      size="large"
                      loading={loading}
                      shape="rounded"
                      className="!mt-2"
                      style={{ '--background': '#4a6340' }}
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
              ) : (
                <Form
                  form={registerForm}
                  layout="vertical"
                  onFinish={handleRegister}
                  autoComplete="off"
                  footer={
                    <Button
                      block
                      type="submit"
                      color="primary"
                      size="large"
                      loading={loading}
                      shape="rounded"
                      className="!mt-2"
                      style={{ '--background': '#4a6340' }}
                    >
                      立即注册
                    </Button>
                  }
                >
                  <Form.Item
                    name="username"
                    label="用户名"
                    rules={USERNAME_RULES}
                  >
                    <Input
                      placeholder="3-20 位，字母/数字/下划线"
                      clearable
                      prefix={<UserOutline />}
                      autoComplete="off"
                    />
                  </Form.Item>
                  <Form.Item name="nickname" label="昵称">
                    <Input
                      placeholder="显示名称（可选）"
                      clearable
                      prefix={<SmileOutline />}
                      autoComplete="off"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                      { required: true, message: '请输入密码' },
                      PASSWORD_RULE,
                    ]}
                  >
                    <Input
                      type="password"
                      placeholder="至少 6 位，含字母和数字"
                      clearable
                      prefix={<LockOutline />}
                      autoComplete="new-password"
                    />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    label="确认密码"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: '请再次输入密码' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve()
                          }
                          return Promise.reject(new Error('两次输入的密码不一致'))
                        },
                      }),
                    ]}
                  >
                    <Input
                      type="password"
                      placeholder="再次输入密码"
                      clearable
                      prefix={<LockOutline />}
                      autoComplete="new-password"
                    />
                  </Form.Item>
                </Form>
              )}

              {tab === 'login' && (
                <div className="mt-5 pt-4 border-t border-cream-200 space-y-2">
                  <p className="text-xs text-stone-400">演示账号</p>
                  <p className="text-xs text-stone-500">
                    商城用户：
                    <code className="bg-cream-100 px-1.5 py-0.5 rounded ml-1">user</code>
                    {' / '}
                    <code className="bg-cream-100 px-1.5 py-0.5 rounded">123456</code>
                  </p>
                  <p className="text-xs text-stone-500">
                    管理员：
                    <code className="bg-cream-100 px-1.5 py-0.5 rounded ml-1">admin</code>
                    {' / '}
                    <code className="bg-cream-100 px-1.5 py-0.5 rounded">admin123</code>
                    <span className="text-stone-400 ml-1">（登录后进入后台）</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="text-center mt-6 text-sm text-stone-500">
            {tab === 'login' ? (
              <>
                还没有账号？
                <button type="button" onClick={() => switchTab('register')} className="text-olive-600 ml-1">
                  立即注册
                </button>
              </>
            ) : (
              <>
                已有账号？
                <button type="button" onClick={() => switchTab('login')} className="text-olive-600 ml-1">
                  去登录
                </button>
              </>
            )}
          </p>
        </div>

        <p className="text-center text-xs text-stone-400 pb-4">
          登录后自动识别身份：普通用户进入商城，管理员进入后台
        </p>
      </div>
    </div>
  )
}
