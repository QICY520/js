/**
 * 商品图：仅从 productAssetLibrary 精准素材库选取，禁止随机占位符
 */

import {
  CORE_PRODUCT_IMAGES,
  TITLE_ASSET_RULES,
  CATEGORY_ASSET_POOL,
  AVATAR_ASSETS,
  assetUrl,
  resizeImageUrl,
} from './productAssetLibrary'

function resolveImage(product, w = 800) {
  const id = Number(product.id)
  if (CORE_PRODUCT_IMAGES[id]) {
    return resizeImageUrl(CORE_PRODUCT_IMAGES[id], w)
  }

  const text = product.title || ''
  for (const rule of TITLE_ASSET_RULES) {
    if (rule.pattern.test(text)) {
      return assetUrl(rule.key, w)
    }
  }

  const pool = CATEGORY_ASSET_POOL[product.categoryId] || CATEGORY_ASSET_POOL[101]
  const key = pool[(id - 1) % pool.length]
  return assetUrl(key, w)
}

/** 商品主图 */
export function getProductImage(product, size = 400) {
  return resolveImage(product, size)
}

/** 强制同步商品图（修复 localStorage 旧缓存） */
export function syncProductImage(product) {
  return {
    ...product,
    image: getProductImage(product),
  }
}

/** 商品详情轮播图 */
export function getProductGallery(product, count = 3) {
  const id = Number(product.id)
  if (CORE_PRODUCT_IMAGES[id]) {
    return [CORE_PRODUCT_IMAGES[id]]
  }

  const keys = []
  const text = product.title || ''
  for (const rule of TITLE_ASSET_RULES) {
    if (rule.pattern.test(text)) {
      keys.push(rule.key)
      break
    }
  }
  if (!keys.length) {
    keys.push(...(CATEGORY_ASSET_POOL[product.categoryId] || CATEGORY_ASSET_POOL[101]))
  }

  const unique = [...new Set(keys)]
  return Array.from({ length: Math.min(count, unique.length) }, (_, i) =>
    assetUrl(unique[i % unique.length], 800),
  )
}

/** SKU 规格图（同商品主图，保证规格间一致） */
export function getSkuVariantImages(product, values = []) {
  const main = getProductImage(product, 400)
  const map = {}
  values.forEach((val) => {
    map[val] = main
  })
  return map
}

/** 店铺 Logo */
export function getShopLogo(shopId, categoryIds = [101]) {
  const cat = categoryIds[0] || 101
  const pool = CATEGORY_ASSET_POOL[cat] || CATEGORY_ASSET_POOL[101]
  const key = pool[Number(shopId) % pool.length]
  return assetUrl(key, 120)
}

/** 用户头像 */
export function getAvatarImage(seed, size = 100) {
  const n = String(seed).split('').reduce((s, c) => s + c.charCodeAt(0), 0)
  const url = AVATAR_ASSETS[n % AVATAR_ASSETS.length]
  return resizeImageUrl(url, size)
}

export { CORE_PRODUCT_IMAGES, PRODUCT_ASSETS } from './productAssetLibrary'

export default getProductImage
