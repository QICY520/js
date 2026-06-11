import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import App from '@/App'
import AuthPage from '@/mall/pages/Auth'
import MallGuestGuard from '@/mall/components/MallGuestGuard'
import MallAuthGuard from '@/mall/components/MallAuthGuard'
import MallHome from '@/mall/pages/Home'
import SearchPage from '@/mall/pages/Search'
import CategoryPage from '@/mall/pages/Category'
import ProductDetail from '@/mall/pages/ProductDetail'
import CartPage from '@/mall/pages/Cart'
import CreateOrderPage from '@/mall/pages/CreateOrder'
import PaySuccessPage from '@/mall/pages/PaySuccess'
import OrdersPage from '@/mall/pages/Orders'
import OrderDetailPage from '@/mall/pages/OrderDetail'
import FlashSalePage from '@/mall/pages/zones/FlashSale'
import ValueSalePage from '@/mall/pages/zones/ValueSale'
import RankingPage from '@/mall/pages/zones/Ranking'
import CouponPage from '@/mall/pages/zones/Coupon'
import NewArrivalsPage from '@/mall/pages/zones/NewArrivals'
import LifestylePage from '@/mall/pages/zones/Lifestyle'
import GiftCardPage from '@/mall/pages/zones/GiftCard'
import MorePage from '@/mall/pages/zones/More'
import AdminLayout from '@/admin/components/AdminLayout'
import AuthGuard, { PermissionGuard } from '@/admin/components/AuthGuard'
import AdminIndexRedirect from '@/admin/components/AdminIndexRedirect'
import ProductManagement from '@/admin/pages/Product'
import ForbiddenPage from '@/admin/pages/Forbidden'
import OrderManagement from '@/admin/pages/Order'
import UserManagement from '@/admin/pages/User'
import ShopManagement from '@/admin/pages/Shop'
import ShopHome from '@/mall/pages/Shop/Home'
import ShopProducts from '@/mall/pages/Shop/Products'
import ShopChat from '@/mall/pages/Shop/Chat'

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
          { path: 'search', element: <SearchPage /> },
          { path: 'category', element: <CategoryPage /> },
          { path: 'product/:id', element: <ProductDetail /> },
          { path: 'flash-sale', element: <FlashSalePage /> },
          { path: 'value-sale', element: <ValueSalePage /> },
          { path: 'ranking', element: <RankingPage /> },
          { path: 'coupon', element: <CouponPage /> },
          { path: 'new-arrivals', element: <NewArrivalsPage /> },
          { path: 'lifestyle', element: <LifestylePage /> },
          { path: 'gift-card', element: <GiftCardPage /> },
          { path: 'more', element: <MorePage /> },
          { path: 'cart', element: <CartPage /> },
          { path: 'checkout', element: <CreateOrderPage /> },
          { path: 'pay/success/:orderId', element: <PaySuccessPage /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'orders/:id', element: <OrderDetailPage /> },
          { path: 'shop/:shopId', element: <ShopHome /> },
          { path: 'shop/:shopId/products', element: <ShopProducts /> },
          { path: 'shop/:shopId/chat', element: <ShopChat /> },
        ],
      },

      /* ── 后台管理（统一登录页鉴权） ── */
      {
        path: 'admin',
        element: (
          <AuthGuard>
            <Outlet />
          </AuthGuard>
        ),
        children: [
          { index: true, element: <AdminIndexRedirect /> },
          { path: 'forbidden', element: <ForbiddenPage /> },
          {
            element: <AdminLayout />,
            children: [
              {
                path: 'products',
                element: (
                  <PermissionGuard permission="product">
                    <ProductManagement />
                  </PermissionGuard>
                ),
              },
              {
                path: 'shops',
                element: (
                  <PermissionGuard permission="shop">
                    <ShopManagement />
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
                    <UserManagement />
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
