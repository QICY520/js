import { useEffect, useState } from 'react'
import { Image } from 'antd-mobile'
import SubPageShell from '@/mall/components/SubPageShell'
import { getZoneGiftCards, buyGiftCard } from '@/utils/api'
import useWalletStore from '@/mall/store/useWalletStore'
import mallToast from '@/mall/utils/toast'

export default function GiftCardPage() {
  const [cards, setCards] = useState([])
  const [amounts, setAmounts] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [selectedAmount, setSelectedAmount] = useState(null)
  const balance = useWalletStore((s) => s.balance)
  const recharge = useWalletStore((s) => s.recharge)

  useEffect(() => {
    getZoneGiftCards().then((res) => {
      setCards(res.data?.cards || [])
      setAmounts(res.data?.amounts || [])
      if (res.data?.cards?.[0]) setSelectedCard(res.data.cards[0].id)
      if (res.data?.amounts?.[0]) setSelectedAmount(res.data.amounts[0])
    })
  }, [])

  const handleBuy = async () => {
    if (!selectedCard || !selectedAmount) {
      mallToast.info('请选择卡面与面额')
      return
    }
    try {
      await buyGiftCard({ cardId: selectedCard, amount: selectedAmount })
      const card = cards.find((c) => c.id === selectedCard)
      recharge(selectedAmount, `礼品卡「${card?.name}」`)
      mallToast.success(`购买成功，余额 +¥${selectedAmount}`)
    } catch (err) {
      mallToast.fail(err.message || '购买失败')
    }
  }

  return (
    <SubPageShell title="礼品卡">
      <div className="mx-4 mt-4 p-4 rounded-2xl bg-gradient-to-br from-olive-600 to-olive-800 text-cream-50">
        <p className="text-xs opacity-80">账户余额</p>
        <p className="text-3xl font-bold mt-1">¥{balance.toFixed(2)}</p>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-stone-800 mb-3">选择卡面</h3>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {cards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => setSelectedCard(card.id)}
              className={`shrink-0 w-40 rounded-xl overflow-hidden border-2 transition-all ${
                selectedCard === card.id ? 'border-[#FF5000] scale-105' : 'border-transparent'
              }`}
            >
              <div className={`h-24 bg-gradient-to-br ${card.theme} relative`}>
                <Image src={card.image} fit="cover" className="w-full h-full opacity-60" />
                <span className="absolute bottom-2 left-2 text-white text-sm font-bold">{card.name}</span>
              </div>
            </button>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-stone-800 mt-5 mb-3">选择面额</h3>
        <div className="grid grid-cols-3 gap-2">
          {amounts.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setSelectedAmount(amt)}
              className={`py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                selectedAmount === amt
                  ? 'bg-orange-50 text-[#FF5000] border-2 border-[#FF5000]'
                  : 'bg-stone-100 text-stone-700 border-2 border-transparent'
              }`}
            >
              ¥{amt}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleBuy}
          className="w-full mt-6 h-12 rounded-full bg-[#FF5000] text-white font-bold active:scale-95 transition-transform"
        >
          立即购买
        </button>
      </div>
    </SubPageShell>
  )
}
