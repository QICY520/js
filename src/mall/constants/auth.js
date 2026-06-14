/** 仅游客可访问（已登录则跳走） */
export const MALL_GUEST_PATHS = ['/login', '/register']

/** 需登录才可进入的商城路由（精确或前缀匹配） */
export const MALL_PROTECTED_PREFIXES = [
  '/cart',
  '/checkout',
  '/orders',
  '/addresses',
  '/messages',
  '/pay/success',
  '/shop/', // 店铺客服等：仅 /shop/:id/chat 需登录，见下方判断
]

export function isMallGuestPath(pathname) {
  return MALL_GUEST_PATHS.includes(pathname)
}

/** 商城路由是否需登录 */
export function isMallProtectedPath(pathname) {
  if (pathname.startsWith('/admin')) return false
  if (isMallGuestPath(pathname)) return false
  if (pathname.match(/^\/shop\/[^/]+\/chat$/)) return true
  return MALL_PROTECTED_PREFIXES.some((prefix) => {
    if (prefix === '/shop/') return false
    return pathname === prefix || pathname.startsWith(`${prefix}/`)
  })
}

/** 登录页路径，携带登录后回跳地址 */
export function buildLoginPath(redirectTo = '/') {
  const safe =
    redirectTo &&
    redirectTo.startsWith('/') &&
    !redirectTo.startsWith('//') &&
    !redirectTo.startsWith('/admin') &&
    !isMallGuestPath(redirectTo.split('?')[0])
      ? redirectTo
      : '/'
  return `/login?redirect=${encodeURIComponent(safe)}`
}

/** 解析登录成功后的回跳地址（优先 URL redirect 参数） */
export function resolveAuthRedirect(search = '', stateFrom) {
  const params = new URLSearchParams(search)
  const candidate = params.get('redirect') || stateFrom || '/my'
  if (
    !candidate.startsWith('/') ||
    candidate.startsWith('//') ||
    candidate.startsWith('/admin') ||
    isMallGuestPath(candidate.split('?')[0])
  ) {
    return '/my'
  }
  return candidate
}
