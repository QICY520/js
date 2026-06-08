/** 仅游客可访问（已登录则跳走） */
export const MALL_GUEST_PATHS = ['/login', '/register']

/** 前台商城是否需登录（除游客页与后台外，全部需登录） */
export function isMallProtectedPath(pathname) {
  if (pathname.startsWith('/admin')) return false
  if (isMallGuestPath(pathname)) return false
  return true
}

export function isMallGuestPath(pathname) {
  return MALL_GUEST_PATHS.includes(pathname)
}
