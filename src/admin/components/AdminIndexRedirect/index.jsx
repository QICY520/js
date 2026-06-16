import { Navigate } from 'react-router-dom'
import useAdminStore from '@/admin/store/useAdminStore'

const DEFAULT_ROUTES = [
  { permission: 'product', path: '/admin/products' },
  { permission: 'category', path: '/admin/categories' },
  { permission: 'shop', path: '/admin/shops' },
  { permission: 'order', path: '/admin/orders' },
  { permission: 'user', path: '/admin/users' },
]

export default function AdminIndexRedirect() {
  const hasPermission = useAdminStore((s) => s.hasPermission)
  const route = DEFAULT_ROUTES.find((r) => hasPermission(r.permission))
  return <Navigate to={route?.path || '/admin/orders'} replace />
}
