import { useEffect, useState } from 'react'
import SubPageShell from '@/mall/components/SubPageShell'
import { getZoneCoupons, claimCoupon } from '@/utils/api'
import useCouponStore from '@/mall/store/useCouponStore'
import mallToast from '@/mall/utils/toast'

export default function CouponPage() {
  const [coupons, setCoupons] = useState([])
  const { claim, isClaimed } = useCouponStore()

  useEffect(() => {
    getZoneCoupons().then((res) => setCoupons(res.data || []))
  }, [])

  const handleClaim = async (coupon) => {
    if (isClaimed(coupon.id)) {
      mallToast.info('已领取过该优惠券')
      return
    }
    try {
      await claimCoupon(coupon.id)
      claim(coupon.id)
      mallToast.success('领取成功，可在结算时使用')
    } catch (err) {
      mallToast.fail(err.message || '领取失败')
    }
  }

  return (
    <SubPageShell title="领券中心">
      <div className="p-4 space-y-4">
        {coupons.map((c) => {
          const claimed = isClaimed(c.id)
          return (
            <div
              key={c.id}
              className="relative flex rounded-2xl overflow-hidden shadow-md"
              style={{
                background: 'linear-gradient(135deg, #fff 0%, #fff 58%, #f8f6f0 58%, #f8f6f0 100%)',
              }}
            >
              <div className="w-[30%] flex flex-col items-center justify-center py-5 border-r border-dashed border-cream-300">
                <span className="text-2xl font-bold text-[#FF5000]">¥{c.amount}</span>
                <span className="text-[10px] text-stone-400 mt-1">{c.desc}</span>
              </div>
              <div className="flex-1 px-4 py-4 flex flex-col justify-center">
                <p className="text-sm font-semibold text-stone-800">{c.title}</p>
                <p className="text-xs text-stone-400 mt-1">有效期至 {c.expire}</p>
                <button
                  type="button"
                  disabled={claimed}
                  onClick={() => handleClaim(c)}
                  className={`mt-2 self-start px-4 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                    claimed
                      ? 'bg-stone-100 text-stone-400'
                      : 'bg-[#FF5000] text-white'
                  }`}
                >
                  {claimed ? '已领取' : '立即领取'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </SubPageShell>
  )
}
