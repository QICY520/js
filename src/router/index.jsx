import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import App from '@/App'
import AuthPage from '@/mall/pages/Auth'
import MallGuestGuard from '@/mall/components/MallGuestGuard'
import MallAuthGuard from '@/mall/components/MallAuthGuard'
import MallHome from '@/mall/pages/Home'
import ProductDetail from '@/mall/pages/ProductDetail'
import CartPage from '@/mall/pages/Cart'
import CreateOrderPage from '@/mall/pages/CreateOrder'
import PaySuccessPage from '@/mall/pages/PaySuccess'
import OrdersPage from '@/mall/pages/Orders'
import OrderDetailPage from '@/mall/pages/OrderDetail'
import AdminLogin from '@/admin/pages/Login'
import AdminLayout from '@/admin/components/AdminLayout'
import AuthGuard, { PermissionGuard } from '@/admin/components/AuthGuard'
import AdminIndexRedirect from '@/admin/components/AdminIndexRedirect'
import ProductManagement from '@/admin/pages/Product'
import ForbiddenPage from '@/admin/pages/Forbidden'
import OrderManagement from '@/admin/pages/Order'
import PlaceholderPage from '@/admin/pages/Placeholder'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      /* ── 游客页：登录 / 注册 ── */
      {
        path: 'login',
        element: (
          <MallGuestGuard>
            <AuthPage defaultTab="login" />
          </MallGuestGuard>
        ),
      },
      {
        path: 'register',
        element: (
          <MallGuestGuard>
            <AuthPage defaultTab="register" />
          </MallGuestGuard>
        ),
      },

      /* ── 商城：全部需登录 ── */
      {
        element: (
          <MallAuthGuard>
            <Outlet />
          </MallAuthGuard>
        ),
        children: [
          { index: true, element: <MallHome /> },
          { path: 'mall', element: <MallHome /> },
          { path: 'product/:id', element: <ProductDetail /> },
          { path: 'cart', element: <CartPage /> },
          { path: 'checkout', element: <CreateOrderPage /> },
          { path: 'pay/success/:orderId', element: <PaySuccessPage /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'orders/:id', element: <OrderDetailPage /> },
        ],
      },

      /* ── 后台管理 ── */
      {
        path: 'admin',
        children: [
          { index: true, element: <Navigate to="/admin/login" replace /> },
          { path: 'login', element: <AdminLogin /> },
          {
            path: 'forbidden',
            element: (
              <AuthGuard>
                <ForbiddenPage />
              </AuthGuard>
            ),
          },
          {
            element: (
              <AuthGuard>
                <AdminLayout />
              </AuthGuard>
            ),
            children: [
              { index: true, element: <AdminIndexRedirect /> },
              {
                path: 'products',
                element: (
                  <PermissionGuard permission="product">
                    <ProductManagement />
                  </PermissionGuard>
                ),
              },
              {
                path: 'categories',
                element: (
                  <PermissionGuard permission="category">
                    <PlaceholderPage title="分类管理" />
                  </PermissionGuard>
                ),
              },
              {
                path: 'orders',
                element: (
                  <PermissionGuard permission="order">
                    <OrderManagement />
                  </PermissionGuard>
                ),
              },
              {
                path: 'users',
                element: (
                  <PermissionGuard permission="user">
                    <PlaceholderPage title="用户管理" />
                  </PermissionGuard>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
])

export default router
