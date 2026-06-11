import { useState, useEffect, useMemo } from 'react'
import { Popup, Stepper, Image } from 'antd-mobile'
import { CloseOutline } from 'antd-mobile-icons'
import {
  findMatchedSku,
  isSpecValueAvailable,
  formatSpecSummary,
  getVariantPreviewImage,
} from '@/mall/utils/sku'
import mallToast from '@/mall/utils/toast'

export default function SkuPickerPopup({
  visible,
  product,
  action = 'cart',
  onClose,
  onConfirm,
}) {
  const specs = product?.specs || []
  const skus = product?.skus || []
  const specKeys = specs.map((s) => s.key)

  const [selected, setSelected] = useState({})
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (visible) {
      setSelected({})
      setQuantity(1)
    }
  }, [visible, product?.id])

  const matchedSku = useMemo(
    () => findMatchedSku(skus, selected, specKeys),
    [skus, selected, specKeys],
  )

  const allSelected = specKeys.length > 0 && specKeys.every((key) => selected[key])
  const canConfirm = allSelected && matchedSku && matchedSku.stock > 0

  const displayPrice = matchedSku?.price ?? product?.price ?? 0

  const displayImage = useMemo(() => {
    const variantImg = getVariantPreviewImage(product, selected, specs)
    if (variantImg) return variantImg
    return matchedSku?.img || product?.image
  }, [matchedSku, selected, specs, product])

  const specSummary = formatSpecSummary(selected, specs)
  const pendingSpecNames = specs
    .filter((g) => !selected[g.key])
    .map((g) => g.name)
    .join('、')

  const handleSelect = (specKey, value) => {
    const available = isSpecValueAvailable(skus, selected, specKey, value, specKeys)
    if (!available) return
    setSelected((prev) => ({ ...prev, [specKey]: value }))
    setQuantity(1)
  }

  const handleConfirm = () => {
    if (!allSelected) {
      mallToast.fail('请选择规格')
      return
    }
    if (!matchedSku || matchedSku.stock <= 0) {
      mallToast.fail('该规格暂无库存')
      return
    }
    if (quantity > matchedSku.stock) {
      mallToast.fail(`最多可购买 ${matchedSku.stock} 件`)
      return
    }
    onConfirm?.({
      sku: matchedSku,
      quantity,
      specLabel: specSummary,
      selected: { ...selected },
    })
    onClose?.()
  }

  if (!product) return null

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      onClose={onClose}
      position="bottom"
      destroyOnClose
      bodyStyle={{
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 0,
        overflow: 'visible',
      }}
      showCloseButton={false}
    >
      <div className="relative flex flex-col bg-white rounded-t-2xl max-h-[80vh]">
        {/* 悬浮缩略图占位区 */}
        <div className="relative shrink-0 h-14" />

        {/* Header */}
        <div className="relative shrink-0 px-4 pb-3 border-b border-stone-100">
          <div
            className="absolute left-4 top-0 -translate-y-1/2 w-[88px] h-[88px] rounded-xl overflow-hidden border-[3px] border-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] bg-white z-10"
          >
            <Image src={displayImage} fit="cover" className="w-full h-full" />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-1 z-20 w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 active:scale-95 transition-transform"
            aria-label="关闭"
          >
            <CloseOutline fontSize={14} />
          </button>

          <div className="ml-[100px] min-h-[72px] flex flex-col justify-center pr-8">
            <div className="flex items-baseline gap-0.5">
              <span className="text-[#FF5000] text-sm font-bold">¥</span>
              <span className="text-[28px] font-bold text-[#FF5000] leading-none tracking-tight">
                {displayPrice}
              </span>
              {(matchedSku?.originalPrice > displayPrice || product.originalPrice > displayPrice) && (
                <span className="text-xs text-[#999999] line-through ml-2">
                  ¥{matchedSku?.originalPrice || product.originalPrice}
                </span>
              )}
            </div>
            <p className="text-xs text-[#999999] mt-1.5 leading-relaxed">
              {allSelected ? (
                <>已选：<span className="text-[#333333]">{specSummary}</span></>
              ) : (
                <>请选择：{pendingSpecNames || '规格'}</>
              )}
            </p>
            {matchedSku && (
              <p className="text-[11px] text-stone-400 mt-0.5">库存 {matchedSku.stock} 件</p>
            )}
          </div>
        </div>

        {/* Body：可滚动规格区 */}
        <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4 space-y-5">
          {specs.length === 0 ? (
            <p className="text-sm text-stone-400 text-center py-6">该商品暂无规格可选</p>
          ) : (
            specs.map((group) => (
              <div key={group.key}>
                <h4 className="text-sm font-semibold text-[#333333] mb-2.5">{group.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {group.values.map((value) => {
                    const isActive = selected[group.key] === value
                    const available = isSpecValueAvailable(
                      skus,
                      selected,
                      group.key,
                      value,
                      specKeys,
                    )
                    return (
                      <button
                        key={value}
                        type="button"
                        disabled={!available}
                        onClick={() => handleSelect(group.key, value)}
                        className={`px-3.5 py-2 rounded-full text-xs transition-all active:scale-95 ${
                          !available
                            ? 'bg-stone-50 text-stone-300 line-through cursor-not-allowed border border-stone-100'
                            : isActive
                              ? 'bg-orange-50 text-[#FF5000] font-semibold border border-[#FF5000]'
                              : 'bg-stone-100 text-[#333333] border border-transparent'
                        }`}
                      >
                        {value}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          )}

          <div className="flex items-center justify-between pt-1 pb-2">
            <span className="text-sm font-medium text-[#333333]">购买数量</span>
            <Stepper
              value={quantity}
              min={1}
              max={matchedSku?.stock || product.stock || 99}
              onChange={setQuantity}
              disabled={!canConfirm && !allSelected}
            />
          </div>
        </div>

        {/* 底部确认 */}
        <div className="shrink-0 px-4 pt-2 pb-4 pb-safe bg-white border-t border-stone-50">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`w-full h-11 rounded-full text-white text-base font-bold transition-all active:scale-95 ${
              canConfirm
                ? 'bg-[#FF5000]'
                : 'bg-stone-300 cursor-not-allowed'
            }`}
          >
            {!allSelected
              ? `请选择${pendingSpecNames}`
              : action === 'buy'
                ? '立即购买'
                : '加入购物车'}
          </button>
        </div>
      </div>
    </Popup>
  )
}
