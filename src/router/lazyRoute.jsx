import { lazy, Suspense } from 'react'
import { ListPageSkeleton } from '@/mall/components/PageSkeleton'

/** 路由级懒加载，配合 React.lazy 减小首屏 bundle */
export function lazyRoute(importFn, Fallback = ListPageSkeleton, props = {}) {
  const Lazy = lazy(importFn)
  return (
    <Suspense fallback={<Fallback />}>
      <Lazy {...props} />
    </Suspense>
  )
}
