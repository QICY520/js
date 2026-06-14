import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import App from '@/App'
import AuthPage from '@/mall/pages/Auth'
import MallGuestGuard from '@/mall/components/MallGuestGuard'
import MallAuthGuard from '@/mall/components/MallAuthGuard'
import AdminLayout from '@/admin/components/AdminLayout'
import AuthGuard, { PermissionGuard } from '@/admin/components/AuthGuard'
import AdminGuestGuard from '@/admin/components/AdminGuestGuard'
import AdminLoginPage from '@/admin/pages/Login'
import AdminIndexRedirect from '@/admin/components/AdminIndexRedirect'
import { lazyRoute } from '@/router/lazyRoute'
import {
  HomePageSkeleton,
  ListPageSkeleton,
  CategoryPageSkeleton,
} from '@/mall/components/PageSkeleton'

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
          { index: true, element: lazyRoute(() => import('@/mall/pages/Home'), HomePageSkeleton) },
          { path: 'mall', element: lazyRoute(() => import('@/mall/pages/Home'), HomePageSkeleton) },
          { path: 'search', element: lazyRoute(() => import('@/mall/pages/Search')) },
          { path: 'category', element: lazyRoute(() => import('@/mall/pages/Category'), CategoryPageSkeleton) },
          { path: 'product/:id', element: lazyRoute(() => import('@/mall/pages/ProductDetail')) },
          { path: 'flash-sale', element: lazyRoute(() => import('@/mall/pages/zones/FlashSale')) },
          { path: 'value-sale', element: lazyRoute(() => import('@/mall/pages/zones/ValueSale')) },
          { path: 'ranking', element: lazyRoute(() => import('@/mall/pages/zones/Ranking')) },
          { path: 'coupon', element: lazyRoute(() => import('@/mall/pages/zones/Coupon')) },
          { path: 'new-arrivals', element: lazyRoute(() => import('@/mall/pages/zones/NewArrivals')) },
          { path: 'lifestyle', element: lazyRoute(() => import('@/mall/pages/zones/Lifestyle')) },
          { path: 'gift-card', element: lazyRoute(() => import('@/mall/pages/zones/GiftCard')) },
          { path: 'more', element: lazyRoute(() => import('@/mall/pages/zones/More')) },
          { path: 'my', element: lazyRoute(() => import('@/mall/pages/My')) },
          { path: 'messages', element: lazyRoute(() => import('@/mall/pages/Messages')) },
          { path: 'addresses', element: lazyRoute(() => import('@/mall/pages/Addresses')) },
          { path: 'cart', element: lazyRoute(() => import('@/mall/pages/Cart')) },
          { path: 'checkout', element: lazyRoute(() => import('@/mall/pages/CreateOrder')) },
          { path: 'pay/success/:orderId', element: lazyRoute(() => import('@/mall/pages/PaySuccess')) },
          { path: 'orders', element: lazyRoute(() => import('@/mall/pages/Orders')) },
          { path: 'orders/:id', element: lazyRoute(() => import('@/mall/pages/OrderDetail')) },
          { path: 'shop/:shopId', element: lazyRoute(() => import('@/mall/pages/Shop/Home')) },
          { path: 'shop/:shopId/products', element: lazyRoute(() => import('@/mall/pages/Shop/Products')) },
          { path: 'shop/:shopId/chat', element: lazyRoute(() => import('@/mall/pages/Shop/Chat')) },
        ],
      },

      /* ── 后台管理 ── */
      {
        path: 'admin',
        children: [
          {
            path: 'login',
            element: (
              <AdminGuestGuard>
                <AdminLoginPage />
              </AdminGuestGuard>
            ),
          },
          {
            element: (
              <AuthGuard>
                <Outlet />
              </AuthGuard>
            ),
            children: [
              { index: true, element: <AdminIndexRedirect /> },
              { path: 'forbidden', element: lazyRoute(() => import('@/admin/pages/Forbidden')) },
              {
                element: <AdminLayout />,
                children: [
                  {
                    path: 'products',
                    element: (
                      <PermissionGuard permission="product">
                        {lazyRoute(() => import('@/admin/pages/Product'))}
                      </PermissionGuard>
                    ),
                  },
                  {
                    path: 'categories',
                    element: (
                      <PermissionGuard permission="category">
                        {lazyRoute(() => import('@/admin/pages/Category'))}
                      </PermissionGuard>
                    ),
                  },
                  {
                    path: 'shops',
                    element: (
                      <PermissionGuard permission="shop">
                        {lazyRoute(() => import('@/admin/pages/Shop'))}
                      </PermissionGuard>
                    ),
                  },
                  {
                    path: 'orders',
                    element: (
                      <PermissionGuard permission="order">
                        {lazyRoute(() => import('@/admin/pages/Order'))}
                      </PermissionGuard>
                    ),
                  },
                  {
                    path: 'users',
                    element: (
                      <PermissionGuard permission="user">
                        {lazyRoute(() => import('@/admin/pages/User'))}
                      </PermissionGuard>
                    ),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
])

export default router
