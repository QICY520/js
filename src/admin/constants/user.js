/** 后台权限模块 */
export const PERMISSIONS = [
  { value: 'product', label: '商品管理' },
  { value: 'category', label: '分类管理' },
  { value: 'shop', label: '店铺管理' },
  { value: 'order', label: '订单管理' },
  { value: 'user', label: '用户管理' },
]

export const PERMISSION_VALUES = PERMISSIONS.map((p) => p.value)

/** 仅两种角色：普通用户 / 管理员 */
export const ROLES = [
  { value: 'user', label: '普通用户', color: 'default' },
  { value: 'admin', label: '管理员', color: 'red' },
]

export const ROLE_MAP = Object.fromEntries(ROLES.map((r) => [r.value, r]))

export function isAdminRole(role) {
  return role === 'admin'
}

export function getRoleLabel(role) {
  return ROLE_MAP[role]?.label || role
}

export function getRoleColor(role) {
  return ROLE_MAP[role]?.color || 'default'
}
