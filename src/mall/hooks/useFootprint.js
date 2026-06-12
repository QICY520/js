import { useEffect } from 'react'
import useUserStore from '@/mall/store/useUserStore'

/** 商品详情页加载时自动记录足迹 */
export default function useFootprint(productId) {
  const addFootprint = useUserStore((s) => s.addFootprint)

  useEffect(() => {
    if (productId) {
      addFootprint(Number(productId))
    }
  }, [productId, addFootprint])
}
