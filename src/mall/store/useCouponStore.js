import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCouponStore = create(
  persist(
    (set, get) => ({
      claimedIds: [],

      claim: (couponId) => {
        const { claimedIds } = get()
        if (claimedIds.includes(couponId)) return false
        set({ claimedIds: [...claimedIds, couponId] })
        return true
      },

      isClaimed: (couponId) => get().claimedIds.includes(couponId),

      getClaimedCoupons: (allCoupons = []) =>
        allCoupons.filter((c) => get().claimedIds.includes(c.id)),
    }),
    { name: 'mall-coupon-storage' },
  ),
)

export default useCouponStore
