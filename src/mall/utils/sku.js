/** 根据已选规格匹配 SKU */
export function findMatchedSku(skus = [], selected = {}, specKeys = []) {
  if (!skus.length) return null
  const allSelected = specKeys.every((key) => selected[key])
  if (!allSelected) return null
  return (
    skus.find((sku) =>
      specKeys.every((key) => sku.specs?.[key] === selected[key]),
    ) || null
  )
}

/** 某规格值在当前已选组合下是否有库存 */
export function isSpecValueAvailable(skus, selected, specKey, value, specKeys) {
  return skus.some((sku) => {
    if (sku.specs?.[specKey] !== value || sku.stock <= 0) return false
    return specKeys.every((key) => {
      if (key === specKey) return true
      const picked = selected[key]
      return !picked || sku.specs?.[key] === picked
    })
  })
}

/** 已选规格文案 */
export function formatSpecSummary(selected = {}, specs = []) {
  const parts = specs
    .map((group) => selected[group.key])
    .filter(Boolean)
  return parts.length ? parts.join(' / ') : '请选择规格'
}

/** 购物车行唯一键 */
export function buildCartLineKey(productId, selected = {}, specKeys = []) {
  const suffix = specKeys.map((k) => selected[k] || '').join('-')
  return suffix ? `${productId}-${suffix}` : String(productId)
}

/** 根据已选规格取预览图（支持 variantImages[groupKey][value]） */
export function getVariantPreviewImage(product, selected = {}, specs = []) {
  if (!product) return ''
  for (const group of specs) {
    const val = selected[group.key]
    if (!val) continue
    const fromVariant = product.variantImages?.[group.key]?.[val]
    if (fromVariant) return fromVariant
  }
  return product.image || ''
}
