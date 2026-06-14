import Mock from 'mockjs'
import {
  MOCK_DATA_VERSION,
  SEED_MIN_COUNTS,
  buildSeedBundle,
  CORE_PRODUCTS,
} from './seedData'
import {
  getProductImage,
  getProductGallery,
  getSkuVariantImages,
  getAvatarImage,
  syncProductImage,
} from './productImages'
import { BANNER_ASSETS } from './productAssetLibrary'

// ─── 仅在开发环境启用 Mock 拦截 ───────────────────────────────
if (import.meta.env.DEV) {
  Mock.setup({ timeout: '200-600' })

  // ─── 工具函数 ─────────────────────────────────────────────
  const success = (data, message = 'success') => ({ code: 0, data, message })
  const fail = (message, code = 1) => ({ code, data: null, message })

  const parseBody = (options) => {
    try {
      return options.body ? JSON.parse(options.body) : {}
    } catch {
      return {}
    }
  }

  const parseToken = (options) => {
    const headers = options.headers || {}
    const auth =
      headers.Authorization ||
      headers.authorization ||
      headers['Authorization'] ||
      ''
    const fromHeader = auth.replace(/^Bearer\s+/i, '').trim()
    if (fromHeader) return fromHeader

    // Mock.js 拦截 XHR 时可能丢失 Authorization，从 storage 兜底
    return (
      sessionStorage.getItem('mall-token') ||
      localStorage.getItem('mall-token') ||
      localStorage.getItem('admin-token') ||
      ''
    )
  }

  const STORAGE_KEYS = {
    products: 'mock_products',
    categories: 'mock_categories',
    cart: 'mock_cart',
    orders: 'mock_orders',
    users: 'mock_users',
    tokens: 'mock_tokens',
    shops: 'mock_shops',
    chats: 'mock_chats',
    shopFollows: 'mock_shop_follows',
  }

  const loadStore = (key, fallback) => {
    const raw = localStorage.getItem(key)
    if (raw) {
      try {
        return JSON.parse(raw)
      } catch {
        /* fall through */
      }
    }
    localStorage.setItem(key, JSON.stringify(fallback))
    return fallback
  }

  const saveStore = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
  }

  const VERSION_KEY = 'mock_data_version'

  const readStoredLength = (key) => {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return 0
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.length : 0
    } catch {
      return 0
    }
  }

  const isStaleCache = () =>
    readStoredLength(STORAGE_KEYS.products) < SEED_MIN_COUNTS.products
    || readStoredLength(STORAGE_KEYS.shops) < SEED_MIN_COUNTS.shops
    || readStoredLength(STORAGE_KEYS.users) < SEED_MIN_COUNTS.users
    || readStoredLength(STORAGE_KEYS.orders) < SEED_MIN_COUNTS.orders

  const clearMockCache = () => {
    ;[
      ...Object.values(STORAGE_KEYS),
      'mock_claimed_coupons',
      VERSION_KEY,
    ].forEach((key) => localStorage.removeItem(key))
  }

  if (localStorage.getItem(VERSION_KEY) !== MOCK_DATA_VERSION || isStaleCache()) {
    clearMockCache()
    localStorage.setItem(VERSION_KEY, MOCK_DATA_VERSION)
    console.info('[Mock] 检测到旧版缓存，已自动清空并重新播种')
  }

  const seed = buildSeedBundle()

  const loadSeedStore = (key, fallback, minCount = 0) => {
    const len = readStoredLength(key)
    if (len >= minCount && len > 0) {
      return JSON.parse(localStorage.getItem(key))
    }
    localStorage.setItem(key, JSON.stringify(fallback))
    return fallback
  }

  // ─── 种子数据：两级分类 ─────────────────────────────────────
  const defaultCategories = [
    {
      id: 1,
      name: '服饰',
      parentId: 0,
      children: [
        { id: 101, name: '男装', parentId: 1 },
        { id: 102, name: '女装', parentId: 1 },
        { id: 103, name: '配饰', parentId: 1 },
      ],
    },
    {
      id: 2,
      name: '数码',
      parentId: 0,
      children: [
        { id: 201, name: '手机', parentId: 2 },
        { id: 202, name: '电脑', parentId: 2 },
        { id: 203, name: '配件', parentId: 2 },
      ],
    },
    {
      id: 3,
      name: '家居',
      parentId: 0,
      children: [
        { id: 301, name: '家具', parentId: 3 },
        { id: 302, name: '家纺', parentId: 3 },
      ],
    },
    {
      id: 4,
      name: '美妆',
      parentId: 0,
      children: [
        { id: 401, name: '护肤', parentId: 4 },
        { id: 402, name: '彩妆', parentId: 4 },
      ],
    },
  ]

  const defaultShopIdByProduct = Object.fromEntries(
    CORE_PRODUCTS.map((p) => [p.id, p.shopId]),
  )
  const defaultShops = seed.shops
  const defaultProducts = seed.products

  const defaultHomeBanners = [
    { id: 1, image: BANNER_ASSETS[0], title: '春季新品', subtitle: '焕新衣橱，遇见更好的自己', themeColor: '#4a6340', themeRgb: '74, 99, 64' },
    { id: 2, image: BANNER_ASSETS[1], title: '数码盛典', subtitle: '旗舰好物，限时特惠', themeColor: '#325a72', themeRgb: '50, 90, 114' },
    { id: 3, image: BANNER_ASSETS[2], title: '居家美学', subtitle: '打造你的理想生活空间', themeColor: '#57534e', themeRgb: '87, 83, 78' },
  ]

  const defaultNavGrid = [
    { id: 'flash', name: '限时秒杀', icon: 'flash', color: 'from-red-500 to-red-700', link: '/flash-sale' },
    { id: 'sale', name: '特价', icon: 'sale', color: 'from-amber-400 to-orange-500', link: '/value-sale' },
    { id: 'rank', name: '排行榜', icon: 'rank', color: 'from-yellow-400 to-amber-500', link: '/ranking' },
    { id: 'coupon', name: '领券中心', icon: 'coupon', color: 'from-orange-400 to-red-500', link: '/coupon' },
    { id: 'new', name: '新品首发', icon: 'new', color: 'from-olive-400 to-olive-600', link: '/new-arrivals' },
    { id: 'farm', name: '品质生活', icon: 'farm', color: 'from-green-400 to-teal-600', link: '/lifestyle' },
    { id: 'gift', name: '礼品卡', icon: 'gift', color: 'from-pink-400 to-rose-500', link: '/gift-card' },
    { id: 'more', name: '更多', icon: 'more', color: 'from-stone-400 to-stone-600', link: '/more' },
  ]

  const getSoldCount = (id) => 3200 + id * 487

  const defaultCoupons = seed.coupons

  let claimedCoupons = loadStore('mock_claimed_coupons', [])

  const defaultGiftCards = seed.giftCards

  const defaultSearchHot = seed.searchHot
  const defaultSearchGuess = seed.searchGuess

  const defaultHotRankingTabs = [
    { key: 'fashion', label: '箱包服饰', categoryIds: [101, 102, 103] },
    { key: 'digital', label: '数码', categoryIds: [201, 202, 203] },
    { key: 'life', label: '家居美妆', categoryIds: [301, 302, 401, 402] },
  ]

  const buildHotRankings = () => {
    const tabs = defaultHotRankingTabs.map((tab) => {
      const list = products
        .filter((p) => p.status === 1 && tab.categoryIds.includes(p.categoryId))
        .slice(0, 9)
        .map((p, index) => ({
          rank: index + 1,
          productId: p.id,
          title: p.title,
          image: p.image,
          price: p.price,
        }))
      return { ...tab, list }
    })
    return tabs
  }

  const defaultSearchAiPool = [
    'AI 推荐：适合通勤的极简穿搭',
    'AI 推荐：高性价比数码配件',
    'AI 推荐：卧室氛围感好物',
    'AI 推荐：敏感肌护肤精选',
    'AI 推荐：送礼不踩雷清单',
  ]

  const defaultUsers = seed.users
  const defaultOrders = seed.orders

  // 初始化内存仓库（localStorage 持久化，实现前后台数据联动）
  let categories = loadStore(STORAGE_KEYS.categories, defaultCategories)
  let products = loadSeedStore(STORAGE_KEYS.products, defaultProducts, SEED_MIN_COUNTS.products).map((p) =>
    syncProductImage({
      ...p,
      shopId: p.shopId || defaultShopIdByProduct[p.id] || 1,
    }),
  )
  saveStore(STORAGE_KEYS.products, products)
  let shops = loadSeedStore(STORAGE_KEYS.shops, defaultShops, SEED_MIN_COUNTS.shops)
  let chats = loadStore(STORAGE_KEYS.chats, {})
  let shopFollows = loadStore(STORAGE_KEYS.shopFollows, {})
  let cart = loadStore(STORAGE_KEYS.cart, [])
  let orders = loadSeedStore(STORAGE_KEYS.orders, defaultOrders, SEED_MIN_COUNTS.orders)
  let users = loadSeedStore(STORAGE_KEYS.users, defaultUsers, SEED_MIN_COUNTS.users)
  saveStore(STORAGE_KEYS.users, users)
  let tokens = loadStore(STORAGE_KEYS.tokens, {})

  const getUserByToken = (token) => {
    if (!token) return null
    const tokenMap = loadStore(STORAGE_KEYS.tokens, {})
    const userId = tokenMap[token]
    if (!userId) return null
    return users.find((u) => u.id === userId) || null
  }

  const flattenCategories = () => {
    const flat = []
    categories.forEach((parent) => {
      flat.push({ id: parent.id, name: parent.name, parentId: parent.parentId })
      parent.children?.forEach((child) => flat.push(child))
    })
    return flat
  }

  const getProductById = (id) => products.find((p) => p.id === Number(id))

  const syncOrderItemImages = (order) => ({
    ...order,
    items: (order.items || []).map((item) => {
      const product = getProductById(item.productId)
      if (!product) return item
      return {
        ...item,
        image: product.image,
        title: product.title,
        price: product.price,
      }
    }),
  })

  orders = orders.map(syncOrderItemImages)
  saveStore(STORAGE_KEYS.orders, orders)

  const getShopById = (id) => shops.find((s) => s.shopId === Number(id))

  const formatChatTime = () =>
    new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })

  const getChatKey = (userId, shopId) => `${userId}_${shopId}`

  const getShopAutoReply = (text) => {
    const t = String(text || '')
    if (t.includes('发货')) return '亲，本店 48 小时内闪电发货哦~'
    if (t.includes('优惠')) return '亲，现在下单立减 20 元呢！'
    if (t.includes('退') || t.includes('换')) return '亲，支持 7 天无理由退换，退货包邮哦~'
    if (t.includes('尺码') || t.includes('大小')) return '亲，建议参考详情页尺码表，也可以把身高体重发我帮您推荐~'
    return '亲，收到啦～有需要随时问我，我会尽快为您解答！'
  }

  const ensureWelcomeMessage = (userId, shopId) => {
    const key = getChatKey(userId, shopId)
    if (!chats[key]?.length) {
      const shop = getShopById(shopId)
      chats[key] = [
        {
          id: Date.now(),
          shopId: Number(shopId),
          sender: 'shop',
          content: `您好，欢迎光临${shop?.shopName || '本店'}～我是店小二，关于尺码、发货或优惠都可以问我哦！`,
          type: 'text',
          time: formatChatTime(),
        },
      ]
      saveStore(STORAGE_KEYS.chats, chats)
    }
    return chats[key]
  }

  const VISUAL_SPEC_KEYS = ['color', 'material', 'type', 'shade', 'strap']

  const PRODUCT_SKU_CONFIG = {
    1: {
      groups: [
        { name: '颜色', key: 'color', values: ['雾霾蓝', '亚麻原色', '炭黑色'] },
        { name: '尺码', key: 'size', values: ['S', 'M', 'L', 'XL'] },
      ],
      priceAdjust: { size: { XL: 20 } },
      zeroStock: [{ color: '炭黑色', size: 'S' }],
    },
    2: {
      groups: [
        { name: '颜色', key: 'color', values: ['驼色', '深灰色', '黑色'], images: { 驼色: 'https://picsum.photos/seed/coat-camel/400/400', 深灰色: 'https://picsum.photos/seed/coat-gray/400/400', 黑色: 'https://picsum.photos/seed/coat-black/400/400' } },
        { name: '尺码', key: 'size', values: ['S', 'M', 'L'] },
      ],
      priceAdjust: { size: { L: 50 } },
      zeroStock: [{ color: '驼色', size: 'S' }],
    },
    3: {
      groups: [
        { name: '颜色', key: 'color', values: ['经典棕', '曜石黑'], images: { 经典棕: 'https://picsum.photos/seed/belt-brown/400/400', 曜石黑: 'https://picsum.photos/seed/belt-black/400/400' } },
        { name: '腰围', key: 'size', values: ['100cm', '110cm', '120cm'] },
      ],
      priceAdjust: { size: { '120cm': 30 } },
      zeroStock: [],
    },
    4: {
      groups: [
        { name: '颜色', key: 'color', values: ['曜石黑', '珍珠白', '星空蓝'], images: { 曜石黑: 'https://picsum.photos/seed/earphone-black/400/400', 珍珠白: 'https://picsum.photos/seed/earphone-white/400/400', 星空蓝: 'https://picsum.photos/seed/earphone-blue/400/400' } },
        { name: '版本', key: 'edition', values: ['标准版', '降噪加强版'] },
      ],
      priceAdjust: { edition: { 降噪加强版: 200 } },
      zeroStock: [{ color: '星空蓝', edition: '降噪加强版' }],
    },
    5: {
      groups: [
        { name: '颜色', key: 'color', values: ['深空灰', '月光银'], images: { 深空灰: 'https://picsum.photos/seed/laptop-gray/400/400', 月光银: 'https://picsum.photos/seed/laptop-silver/400/400' } },
        { name: '配置', key: 'config', values: ['16G+512G', '32G+1TB'] },
      ],
      priceAdjust: { config: { '32G+1TB': 1200 } },
      zeroStock: [{ color: '月光银', config: '32G+1TB' }],
    },
    6: {
      groups: [
        { name: '颜色', key: 'color', values: ['钛金黑', '云白色', '远峰蓝'], images: { 钛金黑: 'https://picsum.photos/seed/phone-black/400/400', 云白色: 'https://picsum.photos/seed/phone-white/400/400', 远峰蓝: 'https://picsum.photos/seed/phone-blue/400/400' } },
        { name: '存储', key: 'storage', values: ['128GB', '256GB', '512GB'] },
      ],
      priceAdjust: { storage: { '256GB': 500, '512GB': 1000 } },
      zeroStock: [{ color: '远峰蓝', storage: '512GB' }],
    },
    7: {
      groups: [
        { name: '材质', key: 'material', values: ['橡木色', '胡桃木色'], images: { 橡木色: 'https://picsum.photos/seed/chair-oak/400/400', 胡桃木色: 'https://picsum.photos/seed/chair-walnut/400/400' } },
        { name: '尺寸', key: 'size', values: ['标准款', '加宽款'] },
      ],
      priceAdjust: { size: { 加宽款: 80 } },
      zeroStock: [],
    },
    8: {
      groups: [
        { name: '颜色', key: 'color', values: ['象牙白', '浅咖色', '雾霾蓝'], images: { 象牙白: 'https://picsum.photos/seed/bedding-white/400/400', 浅咖色: 'https://picsum.photos/seed/bedding-beige/400/400', 雾霾蓝: 'https://picsum.photos/seed/bedding-blue/400/400' } },
        { name: '规格', key: 'spec', values: ['1.5m床', '1.8m床', '2.0m床'] },
      ],
      priceAdjust: { spec: { '1.8m床': 50, '2.0m床': 100 } },
      zeroStock: [{ color: '雾霾蓝', spec: '1.5m床' }],
    },
    9: {
      groups: [
        { name: '功效', key: 'type', values: ['补水保湿', '修护屏障'], images: { 补水保湿: 'https://picsum.photos/seed/serum-hydrate/400/400', 修护屏障: 'https://picsum.photos/seed/serum-repair/400/400' } },
        { name: '容量', key: 'volume', values: ['30ml', '50ml', '100ml'] },
      ],
      priceAdjust: { volume: { '50ml': 80, '100ml': 180 } },
      zeroStock: [],
    },
    10: {
      groups: [
        { name: '色号', key: 'shade', values: ['#01 豆沙红', '#02 枫叶橘', '#03 玫瑰粉'], images: { '#01 豆沙红': 'https://picsum.photos/seed/lip-red/400/400', '#02 枫叶橘': 'https://picsum.photos/seed/lip-orange/400/400', '#03 玫瑰粉': 'https://picsum.photos/seed/lip-pink/400/400' } },
        { name: '套装', key: 'set', values: ['单支装', '三支礼盒'] },
      ],
      priceAdjust: { set: { 三支礼盒: 120 } },
      zeroStock: [{ shade: '#02 枫叶橘', set: '单支装' }],
    },
    11: {
      groups: [
        { name: '颜色', key: 'color', values: ['米白色', '深灰色'], images: { 米白色: 'https://picsum.photos/seed/hoodie-white/400/400', 深灰色: 'https://picsum.photos/seed/hoodie-gray/400/400' } },
        { name: '尺码', key: 'size', values: ['M', 'L', 'XL'] },
      ],
      priceAdjust: {},
      zeroStock: [{ color: '米白色', size: 'M' }, { color: '深灰色', size: 'L' }],
    },
    12: {
      groups: [
        { name: '表带', key: 'strap', values: ['运动硅胶', '真皮棕', '米兰尼斯'], images: { 运动硅胶: 'https://picsum.photos/seed/watch-sport/400/400', 真皮棕: 'https://picsum.photos/seed/watch-leather/400/400', 米兰尼斯: 'https://picsum.photos/seed/watch-milanese/400/400' } },
        { name: '尺寸', key: 'size', values: ['42mm', '46mm'] },
      ],
      priceAdjust: { size: { '46mm': 200 }, strap: { 米兰尼斯: 150 } },
      zeroStock: [{ strap: '米兰尼斯', size: '42mm' }],
    },
  }

  const buildProductSkus = (product) => {
    const config = PRODUCT_SKU_CONFIG[product.id]
    if (!config) {
      return { specs: [], skus: [], variantImages: {} }
    }

    const specs = config.groups.map(({ name, key, values }) => ({ name, key, values }))
    const specKeys = specs.map((s) => s.key)

    const variantImages = {}
    config.groups.forEach((g) => {
      if (VISUAL_SPEC_KEYS.includes(g.key)) {
        variantImages[g.key] = getSkuVariantImages(product, g.values)
      }
    })

    const cartesian = (arrays) =>
      arrays.reduce((acc, arr) => acc.flatMap((x) => arr.map((y) => [...x, y])), [[]])

    const valueLists = config.groups.map((g) => g.values)
    const combinations = cartesian(valueLists)

    const isZeroStock = (specMap) =>
      (config.zeroStock || []).some((z) =>
        Object.entries(z).every(([k, v]) => specMap[k] === v),
      )

    const calcPrice = (specMap) => {
      let price = product.price
      Object.entries(config.priceAdjust || {}).forEach(([key, map]) => {
        const delta = map[specMap[key]]
        if (delta) price += delta
      })
      return price
    }

    const getPreviewImg = (specMap) => {
      for (const g of config.groups) {
        if (variantImages[g.key] && specMap[g.key]) {
          return variantImages[g.key][specMap[g.key]]
        }
      }
      return product.image
    }

    const skus = combinations.map((combo, idx) => {
      const specMap = Object.fromEntries(specKeys.map((k, i) => [k, combo[i]]))
      const price = calcPrice(specMap)
      const combination = combo.join('-')
      return {
        id: `${product.id}-${combination}`,
        combination,
        specs: specMap,
        price,
        originalPrice: price + Math.round(price * 0.15),
        stock: isZeroStock(specMap) ? 0 : Math.max(5, 20 + product.id - idx),
        img: getPreviewImg(specMap),
      }
    })

    return { specs, skus, variantImages }
  }

  const buildProductDetail = (product) => {
    if (!product) return null
    const endTime = new Date()
    endTime.setHours(23, 59, 59, 999)
    const originalPrice = product.originalPrice || Math.round(product.price * 1.35)
    const repeaters = 280 + product.id * 34
    const skuData = buildProductSkus(product)

    const shop = getShopById(product.shopId)

    return {
      ...product,
      shop,
      originalPrice,
      ...skuData,
      images: getProductGallery(product),
      promotion: {
        title: product.badgeType === 'promo' ? '618品类周' : '限时特惠',
        label: '热销爆款',
        endTime: endTime.getTime(),
      },
      soldCount: 3200 + product.id * 487,
      discountLabel: originalPrice > product.price ? '官方立减15%' : null,
      serviceTags: [
        '退货包邮',
        `回头客${repeaters}人+`,
        '店铺半年超3千好评',
        '7天无理由',
      ],
      reviews: {
        total: 86 + product.id * 23,
        preview: [
          {
            id: 1,
            user: '爱***猫',
            avatar: getAvatarImage(`r${product.id}a`, 80),
            content: `质感很好，${product.title.slice(0, 6)}比想象中更满意，物流也很快！`,
            rating: 5,
          },
          {
            id: 2,
            user: '向***阳',
            avatar: getAvatarImage(`r${product.id}b`, 80),
            content: '第二次回购了，包装精致，性价比很高，推荐入手。',
            rating: 5,
          },
        ],
      },
      qa: [
        {
          id: 1,
          question: '这款适合日常通勤吗？',
          answer: '很适合，材质轻薄透气，搭配休闲裤很好看。',
          answerCount: 5,
        },
        {
          id: 2,
          question: '支持退换货吗？运费谁承担？',
          answer: '支持7天无理由退换，退货包邮。',
          answerCount: 3,
        },
      ],
    }
  }

  // ─── 注册接口 ───────────────────────────────────────────────
  Mock.mock(/\/api\/register$/, 'post', (options) => {
    const { username, password, nickname } = parseBody(options)

    if (!username || !password) {
      return fail('用户名和密码不能为空')
    }
    if (username.length < 3) {
      return fail('用户名至少 3 个字符')
    }
    if (password.length < 6) {
      return fail('密码至少 6 位')
    }
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return fail('密码需同时包含字母和数字')
    }
    if (users.some((u) => u.username === username)) {
      return fail('用户名已被注册，请更换')
    }

    const newId = Math.max(...users.map((u) => u.id), 0) + 1
    const newUser = {
      id: newId,
      username,
      password,
      role: 'user',
      nickname: nickname || username,
      avatar: getAvatarImage(`u${newId}`),
      permissions: [],
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    }
    users.push(newUser)
    saveStore(STORAGE_KEYS.users, users)

    const token = Mock.Random.guid()
    tokens[token] = newUser.id
    saveStore(STORAGE_KEYS.tokens, tokens)

    const { password: _, ...safeUser } = newUser
    return success({
      token,
      user: safeUser,
      role: 'user',
      permissions: [],
    }, '注册成功')
  })

  // ─── 登录接口 ───────────────────────────────────────────────
  Mock.mock(/\/api\/login$/, 'post', (options) => {
    const { username, password } = parseBody(options)
    const user = users.find((u) => u.username === username && u.password === password)

    if (!user) {
      return fail('用户名或密码错误', 401)
    }

    const token = Mock.Random.guid()
    tokens[token] = user.id
    saveStore(STORAGE_KEYS.tokens, tokens)

    const { password: _, ...safeUser } = user
    return success({
      token,
      user: safeUser,
      role: user.role,
      permissions: user.permissions,
    }, '登录成功')
  })

  // ─── 用户信息 ───────────────────────────────────────────────
  Mock.mock(/\/api\/user\/info/, 'get', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('未登录或 Token 已失效', 401)
    const { password: _, ...safeUser } = user
    return success(safeUser)
  })

  // ─── 用户管理（后台） ─────────────────────────────────────────
  const ALL_PERMISSIONS = ['product', 'category', 'shop', 'order', 'user']

  const sanitizeUser = (user) => {
    if (!user) return null
    const { password, ...safe } = user
    return safe
  }

  const actorCanManageUsers = (actor) =>
    actor?.role === 'admin' && (actor.permissions?.includes('user') ?? false)

  const actorCanManageOrders = (actor) =>
    actor?.role === 'admin' && (actor.permissions?.includes('order') ?? false)

  const actorCanManageCategories = (actor) =>
    actor?.role === 'admin' && (actor.permissions?.includes('category') ?? false)

  const findCategoryNode = (id) => {
    for (const parent of categories) {
      if (parent.id === id) return { node: parent, parent: null, isParent: true }
      const child = parent.children?.find((c) => c.id === id)
      if (child) return { node: child, parent, isParent: false }
    }
    return null
  }

  const countAdmins = () => users.filter((u) => u.role === 'admin').length

  const validatePasswordRule = (password) => {
    if (!password || password.length < 6) return '密码至少 6 位'
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return '密码需同时包含字母和数字'
    return null
  }

  const normalizeUserPayload = (body, { isCreate = false } = {}) => {
    const role = body.role || 'user'
    let permissions = Array.isArray(body.permissions) ? [...body.permissions] : []

    if (role === 'user') {
      permissions = []
    } else if (role === 'admin') {
      permissions = permissions.filter((p) => ALL_PERMISSIONS.includes(p))
    }

    const payload = {
      nickname: body.nickname?.trim() || body.username,
      role,
      permissions,
    }

    if (isCreate) {
      payload.username = body.username?.trim()
      payload.password = body.password
      payload.avatar = body.avatar || getAvatarImage(`u${Date.now()}`)
      payload.createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
    }

    if (body.password) {
      payload.password = body.password
    }

    return payload
  }

  Mock.mock(/\/api\/users(\?.*)?$/, 'get', (options) => {
    const actor = getUserByToken(parseToken(options))
    if (!actorCanManageUsers(actor)) return fail('无用户管理权限', 403)

    const url = new URL(options.url, 'http://localhost')
    const keyword = (url.searchParams.get('keyword') || '').trim()
    const role = url.searchParams.get('role')
    const page = Number(url.searchParams.get('page') || 1)
    const pageSize = Number(url.searchParams.get('pageSize') || 10)

    let list = [...users].sort((a, b) => b.id - a.id)

    if (keyword) {
      list = list.filter(
        (u) => u.username.includes(keyword) || u.nickname?.includes(keyword),
      )
    }

    if (role === 'user') {
      list = list.filter((u) => u.role === 'user')
    } else if (role === 'admin') {
      list = list.filter((u) => u.role === 'admin')
    } else if (role) {
      list = list.filter((u) => u.role === role)
    }

    const total = list.length
    const start = (page - 1) * pageSize
    const pageList = list.slice(start, start + pageSize).map(sanitizeUser)

    return success({ list: pageList, total, page, pageSize })
  })

  Mock.mock(/\/api\/users\/\d+/, 'get', (options) => {
    const actor = getUserByToken(parseToken(options))
    if (!actorCanManageUsers(actor)) return fail('无用户管理权限', 403)

    const id = Number(options.url.match(/\/api\/users\/(\d+)/)?.[1])
    const user = users.find((u) => u.id === id)
    if (!user) return fail('用户不存在', 404)
    return success(sanitizeUser(user))
  })

  Mock.mock(/\/api\/users$/, 'post', (options) => {
    const actor = getUserByToken(parseToken(options))
    if (!actorCanManageUsers(actor)) return fail('无用户管理权限', 403)

    const body = parseBody(options)
    const payload = normalizeUserPayload(body, { isCreate: true })

    if (!payload.username || !payload.password) {
      return fail('用户名和密码不能为空')
    }
    if (payload.username.length < 3) return fail('用户名至少 3 个字符')
    if (users.some((u) => u.username === payload.username)) {
      return fail('用户名已存在')
    }

    const pwdErr = validatePasswordRule(payload.password)
    if (pwdErr) return fail(pwdErr)

    const newId = Math.max(...users.map((u) => u.id), 0) + 1
    const newUser = { id: newId, ...payload }
    users.push(newUser)
    saveStore(STORAGE_KEYS.users, users)
    return success(sanitizeUser(newUser), '用户创建成功')
  })

  Mock.mock(/\/api\/users\/\d+/, 'put', (options) => {
    const actor = getUserByToken(parseToken(options))
    if (!actorCanManageUsers(actor)) return fail('无用户管理权限', 403)

    const id = Number(options.url.match(/\/api\/users\/(\d+)/)?.[1])
    const body = parseBody(options)
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) return fail('用户不存在', 404)

    const current = users[index]
    const nextRole = body.role ?? current.role
    const payload = normalizeUserPayload({ ...current, ...body, role: nextRole })

    if (body.password) {
      const pwdErr = validatePasswordRule(body.password)
      if (pwdErr) return fail(pwdErr)
    }

    if (current.role === 'admin' && nextRole !== 'admin' && countAdmins() <= 1) {
      return fail('不能降级唯一的系统管理员')
    }

    if (nextRole === 'admin' && !payload.permissions?.length) {
      return fail('管理员至少需分配一项权限')
    }

    const updated = { ...current, ...payload, id }
    if (!body.password) delete updated.password
    else updated.password = body.password

    users[index] = updated
    saveStore(STORAGE_KEYS.users, users)
    return success(sanitizeUser(updated), '用户更新成功')
  })

  Mock.mock(/\/api\/users\/\d+/, 'delete', (options) => {
    const actor = getUserByToken(parseToken(options))
    if (!actorCanManageUsers(actor)) return fail('无用户管理权限', 403)

    const id = Number(options.url.match(/\/api\/users\/(\d+)/)?.[1])
    const target = users.find((u) => u.id === id)
    if (!target) return fail('用户不存在', 404)

    if (actor.id === id) return fail('不能删除当前登录账号')
    if (target.role === 'admin' && countAdmins() <= 1) {
      return fail('不能删除唯一的系统管理员')
    }

    users = users.filter((u) => u.id !== id)
    saveStore(STORAGE_KEYS.users, users)
    return success(null, '用户删除成功')
  })

  // ─── 分类接口 ───────────────────────────────────────────────
  Mock.mock(/\/api\/categories/, 'get', () => {
    return success(categories)
  })

  Mock.mock(/\/api\/categories$/, 'post', (options) => {
    const actor = getUserByToken(parseToken(options))
    if (!actorCanManageCategories(actor)) return fail('无分类管理权限', 403)

    const body = parseBody(options)
    if (!body.name?.trim()) return fail('分类名称不能为空')
    const newId = Math.max(...flattenCategories().map((c) => c.id), 0) + 1
    if (body.parentId && body.parentId !== 0) {
      const parent = categories.find((c) => c.id === body.parentId)
      if (!parent) return fail('一级分类不存在', 404)
      parent.children = parent.children || []
      parent.children.push({ id: newId, name: body.name.trim(), parentId: body.parentId })
    } else {
      categories.push({ id: newId, name: body.name.trim(), parentId: 0, children: [] })
    }
    saveStore(STORAGE_KEYS.categories, categories)
    return success({ id: newId }, '分类创建成功')
  })

  Mock.mock(/\/api\/categories\/\d+$/, 'put', (options) => {
    const actor = getUserByToken(parseToken(options))
    if (!actorCanManageCategories(actor)) return fail('无分类管理权限', 403)

    const id = Number(options.url.match(/\/api\/categories\/(\d+)/)?.[1])
    const body = parseBody(options)
    const found = findCategoryNode(id)
    if (!found) return fail('分类不存在', 404)
    if (!body.name?.trim()) return fail('分类名称不能为空')

    found.node.name = body.name.trim()
    saveStore(STORAGE_KEYS.categories, categories)
    return success(found.node, '分类更新成功')
  })

  Mock.mock(/\/api\/categories\/\d+$/, 'delete', (options) => {
    const actor = getUserByToken(parseToken(options))
    if (!actorCanManageCategories(actor)) return fail('无分类管理权限', 403)

    const id = Number(options.url.match(/\/api\/categories\/(\d+)/)?.[1])
    const found = findCategoryNode(id)
    if (!found) return fail('分类不存在', 404)

    const inUse = products.some((p) => p.categoryId === id)
    if (inUse) return fail('该分类下仍有商品，无法删除')

    if (found.isParent) {
      if (found.node.children?.length) return fail('请先删除子分类')
      categories.splice(categories.findIndex((c) => c.id === id), 1)
    } else {
      found.parent.children = found.parent.children.filter((c) => c.id !== id)
    }

    saveStore(STORAGE_KEYS.categories, categories)
    return success(null, '分类删除成功')
  })

  // ─── 商品接口 ───────────────────────────────────────────────
  Mock.mock(/\/api\/products(\?.*)?$/, 'get', (options) => {
    const url = new URL(options.url, 'http://localhost')
    const categoryId = url.searchParams.get('categoryId')
    const keyword = url.searchParams.get('keyword')
    const page = Number(url.searchParams.get('page') || 1)
    const pageSize = Number(url.searchParams.get('pageSize') || 10)
    const status = url.searchParams.get('status')
    const shopId = url.searchParams.get('shopId')

    let list = [...products]

    if (shopId) {
      list = list.filter((p) => p.shopId === Number(shopId))
    }

    if (categoryId) {
      const cid = Number(categoryId)
      const parent = categories.find((c) => c.id === cid)
      if (parent?.children) {
        const childIds = parent.children.map((c) => c.id)
        list = list.filter((p) => childIds.includes(p.categoryId) || p.categoryId === cid)
      } else {
        list = list.filter((p) => p.categoryId === cid)
      }
    }

    if (keyword) {
      list = list.filter((p) => p.title.includes(keyword))
    }

    if (status !== null && status !== undefined && status !== '') {
      list = list.filter((p) => p.status === Number(status))
    }

    const total = list.length
    const start = (page - 1) * pageSize
    const pageList = list.slice(start, start + pageSize)

    return success({ list: pageList, total, page, pageSize })
  })

  Mock.mock(/\/api\/products\/\d+/, 'get', (options) => {
    const id = options.url.match(/\/api\/products\/(\d+)/)?.[1]
    const product = getProductById(id)
    if (!product) return fail('商品不存在', 404)
    return success(buildProductDetail(product))
  })

  Mock.mock(/\/api\/products$/, 'post', (options) => {
    const body = parseBody(options)
    const newId = Math.max(...products.map((p) => p.id), 0) + 1
    const product = {
      id: newId,
      title: body.title,
      price: body.price,
      stock: body.stock ?? 0,
      categoryId: body.categoryId,
      shopId: body.shopId || 1,
      image: body.image || getProductImage({
        id: newId,
        categoryId: body.categoryId,
        title: body.title,
      }),
      status: body.status ?? 1,
      desc: body.desc || '',
    }
    products.push(product)
    saveStore(STORAGE_KEYS.products, products)
    return success(product, '商品创建成功')
  })

  Mock.mock(/\/api\/products\/\d+/, 'put', (options) => {
    const id = Number(options.url.match(/\/api\/products\/(\d+)/)?.[1])
    const body = parseBody(options)
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return fail('商品不存在', 404)
    products[index] = { ...products[index], ...body, id }
    saveStore(STORAGE_KEYS.products, products)
    return success(products[index], '商品更新成功')
  })

  Mock.mock(/\/api\/products\/\d+/, 'delete', (options) => {
    const id = Number(options.url.match(/\/api\/products\/(\d+)/)?.[1])
    products = products.filter((p) => p.id !== id)
    saveStore(STORAGE_KEYS.products, products)
    return success(null, '商品删除成功')
  })

  // ─── 店铺接口 ───────────────────────────────────────────────
  Mock.mock(/\/api\/shops(\?.*)?$/, 'get', () => {
    const list = shops.map((shop) => ({
      ...shop,
      productCount: products.filter((p) => p.shopId === shop.shopId && p.status === 1).length,
    }))
    return success(list)
  })

  Mock.mock(/\/api\/shops\/\d+/, 'get', (options) => {
    const shopId = Number(options.url.match(/\/api\/shops\/(\d+)/)?.[1])
    const shop = getShopById(shopId)
    if (!shop) return fail('店铺不存在', 404)

    const user = getUserByToken(parseToken(options))
    const followed = user
      ? (shopFollows[getChatKey(user.id, shopId)] ?? false)
      : false

    return success({
      ...shop,
      followed,
      productCount: products.filter((p) => p.shopId === shopId && p.status === 1).length,
    })
  })

  Mock.mock(/\/api\/shops\/\d+/, 'put', (options) => {
    const actor = getUserByToken(parseToken(options))
    if (!actor || actor.role !== 'admin' || !actor.permissions?.includes('shop')) {
      return fail('无店铺管理权限', 403)
    }

    const shopId = Number(options.url.match(/\/api\/shops\/(\d+)/)?.[1])
    const body = parseBody(options)
    const index = shops.findIndex((s) => s.shopId === shopId)
    if (index === -1) return fail('店铺不存在', 404)

    shops[index] = {
      ...shops[index],
      shopLogo: body.shopLogo ?? shops[index].shopLogo,
      promoNotice: body.promoNotice ?? shops[index].promoNotice,
      shopDescription: body.shopDescription ?? shops[index].shopDescription,
    }
    saveStore(STORAGE_KEYS.shops, shops)
    return success(shops[index], '店铺更新成功')
  })

  Mock.mock(/\/api\/shops\/\d+\/follow/, 'post', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)

    const shopId = Number(options.url.match(/\/api\/shops\/(\d+)/)?.[1])
    const shop = getShopById(shopId)
    if (!shop) return fail('店铺不存在', 404)

    const key = getChatKey(user.id, shopId)
    const { follow = true } = parseBody(options)
    shopFollows[key] = follow
    saveStore(STORAGE_KEYS.shopFollows, shopFollows)

    if (follow) {
      shops = shops.map((s) =>
        s.shopId === shopId ? { ...s, fansCount: s.fansCount + 1 } : s,
      )
    } else {
      shops = shops.map((s) =>
        s.shopId === shopId ? { ...s, fansCount: Math.max(0, s.fansCount - 1) } : s,
      )
    }
    saveStore(STORAGE_KEYS.shops, shops)
    return success({ followed: follow }, follow ? '关注成功' : '已取消关注')
  })

  // ─── 客服聊天接口 ───────────────────────────────────────────
  Mock.mock(/\/api\/chats\/\d+(\?.*)?$/, 'get', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)

    const shopId = Number(options.url.match(/\/api\/chats\/(\d+)/)?.[1])
    const shop = getShopById(shopId)
    if (!shop) return fail('店铺不存在', 404)

    const messages = ensureWelcomeMessage(user.id, shopId)
    return success({ shop, messages })
  })

  Mock.mock(/\/api\/chats\/\d+$/, 'post', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)

    const shopId = Number(options.url.match(/\/api\/chats\/(\d+)/)?.[1])
    const shop = getShopById(shopId)
    if (!shop) return fail('店铺不存在', 404)

    const body = parseBody(options)
    const key = getChatKey(user.id, shopId)
    ensureWelcomeMessage(user.id, shopId)

    const baseId = Date.now()
    const userMsg = {
      id: baseId,
      shopId,
      sender: 'user',
      content: body.content || '',
      type: body.type || 'text',
      time: formatChatTime(),
      product: body.product || null,
    }
    chats[key] = [...(chats[key] || []), userMsg]

    const replyText =
      body.type === 'product'
        ? `亲，这款「${body.product?.title || '商品'}」很受欢迎呢～现在下单可享店铺优惠！`
        : getShopAutoReply(body.content)

    const shopMsg = {
      id: baseId + 1,
      shopId,
      sender: 'shop',
      content: replyText,
      type: 'text',
      time: formatChatTime(),
    }
    chats[key].push(shopMsg)
    saveStore(STORAGE_KEYS.chats, chats)

    return success({ messages: chats[key] })
  })

  // ─── 购物车接口 ─────────────────────────────────────────────
  Mock.mock(/\/api\/cart(\?.*)?$/, 'get', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)
    const list = cart
      .filter((item) => item.userId === user.id)
      .map((item) => {
        const product = getProductById(item.productId)
        return { ...item, product }
      })
    return success(list)
  })

  Mock.mock(/\/api\/cart$/, 'post', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)
    const { productId, quantity = 1 } = parseBody(options)
    const product = getProductById(productId)
    if (!product) return fail('商品不存在', 404)
    if (product.stock < quantity) return fail('库存不足')

    const existing = cart.find((c) => c.userId === user.id && c.productId === Number(productId))
    if (existing) {
      existing.quantity += quantity
      existing.selected = true
    } else {
      cart.push({
        id: Mock.Random.integer(10000, 99999),
        userId: user.id,
        productId: Number(productId),
        quantity,
        selected: true,
      })
    }
    saveStore(STORAGE_KEYS.cart, cart)
    return success(null, '已加入购物车')
  })

  Mock.mock(/\/api\/cart\/\d+/, 'put', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)
    const cartId = Number(options.url.match(/\/api\/cart\/(\d+)/)?.[1])
    const body = parseBody(options)
    const item = cart.find((c) => c.id === cartId && c.userId === user.id)
    if (!item) return fail('购物车项不存在', 404)

    if (body.quantity !== undefined) {
      const product = getProductById(item.productId)
      if (product && body.quantity > product.stock) return fail('库存不足')
      item.quantity = body.quantity
    }
    if (body.selected !== undefined) item.selected = body.selected

    saveStore(STORAGE_KEYS.cart, cart)
    return success(item, '购物车已更新')
  })

  Mock.mock(/\/api\/cart\/\d+/, 'delete', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)
    const cartId = Number(options.url.match(/\/api\/cart\/(\d+)/)?.[1])
    cart = cart.filter((c) => !(c.id === cartId && c.userId === user.id))
    saveStore(STORAGE_KEYS.cart, cart)
    return success(null, '已从购物车移除')
  })

  // ─── 订单接口 ───────────────────────────────────────────────
  Mock.mock(/\/api\/orders(\?.*)?$/, 'get', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)

    let list = [...orders]
    if (user.role === 'user') {
      list = list.filter((o) => o.userId === user.id)
    }

    const url = new URL(options.url, 'http://localhost')
    const status = url.searchParams.get('status')
    if (status !== null && status !== '') {
      list = list.filter((o) => o.status === Number(status))
    }

    return success({ list, total: list.length })
  })

  Mock.mock(/\/api\/orders\/\d+/, 'get', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)
    const id = Number(options.url.match(/\/api\/orders\/(\d+)/)?.[1])
    const order = orders.find((o) => o.id === id)
    if (!order) return fail('订单不存在', 404)
    if (user.role === 'user' && order.userId !== user.id) return fail('无权查看', 403)
    return success(order)
  })

  Mock.mock(/\/api\/orders$/, 'post', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)
    const { items, address } = parseBody(options)

    const newId = Math.max(...orders.map((o) => o.id), 0) + 1
    const orderItems = items.map((item) => {
      const product = getProductById(item.productId)
      return {
        productId: item.productId,
        title: product?.title || '',
        price: product?.price || 0,
        quantity: item.quantity,
        image: product?.image || '',
      }
    })
    const totalPrice = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

    const order = {
      id: newId,
      orderNo: `2026${String(Date.now()).slice(-8)}`,
      userId: user.id,
      status: 0,
      totalPrice,
      address: address || '默认地址',
      createTime: new Date().toLocaleString('zh-CN'),
      payTime: null,
      items: orderItems,
    }
    orders.push(order)
    saveStore(STORAGE_KEYS.orders, orders)
    return success(order, '订单创建成功')
  })

  /** 用户取消待支付订单 */
  Mock.mock(/\/api\/orders\/\d+\/cancel/, 'post', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)
    const id = Number(options.url.match(/\/api\/orders\/(\d+)\/cancel/)?.[1])
    const index = orders.findIndex((o) => o.id === id)
    if (index === -1) return fail('订单不存在', 404)
    const order = orders[index]
    if (user.role === 'user' && order.userId !== user.id) return fail('无权操作', 403)
    if (order.status !== 0) return fail('仅待支付订单可取消')

    orders.splice(index, 1)
    saveStore(STORAGE_KEYS.orders, orders)
    return success(null, '已取消支付')
  })

  Mock.mock(/\/api\/orders\/\d+\/pay/, 'post', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)
    const id = Number(options.url.match(/\/api\/orders\/(\d+)/)?.[1])
    const order = orders.find((o) => o.id === id)
    if (!order) return fail('订单不存在', 404)
    if (user.role === 'user' && order.userId !== user.id) return fail('无权操作', 403)
    if (order.status !== 0) return fail('订单状态不允许支付')

    const { paymentMethod = 'wechat' } = parseBody(options)
    order.status = 1
    order.paymentMethod = paymentMethod
    order.payTime = new Date().toLocaleString('zh-CN')
    order.reviewed = false

    // 支付成功后扣减商品库存（前后台数据联动）
    order.items.forEach((item) => {
      const product = getProductById(item.productId)
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity)
      }
    })
    saveStore(STORAGE_KEYS.products, products)
    saveStore(STORAGE_KEYS.orders, orders)
    return success(order, '支付成功')
  })

  /** 用户确认收货 → 待评价 */
  Mock.mock(/\/api\/orders\/\d+\/receive/, 'post', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)
    const id = Number(options.url.match(/\/api\/orders\/(\d+)\/receive/)?.[1])
    const order = orders.find((o) => o.id === id)
    if (!order) return fail('订单不存在', 404)
    if (user.role === 'user' && order.userId !== user.id) return fail('无权操作', 403)
    if (order.status !== 2) return fail('当前订单不可确认收货，请等待商家发货')

    order.status = 3
    saveStore(STORAGE_KEYS.orders, orders)
    return success(order, '已确认收货')
  })

  /** 用户提交评价 → 已完成 */
  Mock.mock(/\/api\/orders\/\d+\/review/, 'post', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)
    const id = Number(options.url.match(/\/api\/orders\/(\d+)\/review/)?.[1])
    const order = orders.find((o) => o.id === id)
    if (!order) return fail('订单不存在', 404)
    if (user.role === 'user' && order.userId !== user.id) return fail('无权操作', 403)
    if (order.status !== 3) return fail('当前订单不可评价')

    const { rating = 5, content = '' } = parseBody(options)
    if (!content.trim()) return fail('请填写评价内容')

    order.status = 5
    order.reviewed = true
    order.review = {
      rating,
      content: content.trim(),
      createTime: new Date().toLocaleString('zh-CN'),
    }
    saveStore(STORAGE_KEYS.orders, orders)
    return success(order, '评价成功')
  })

  Mock.mock(/\/api\/orders\/\d+\/status/, 'put', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)
    if (!actorCanManageOrders(user)) return fail('无权操作', 403)

    const id = Number(options.url.match(/\/api\/orders\/(\d+)/)?.[1])
    const { status } = parseBody(options)
    const order = orders.find((o) => o.id === id)
    if (!order) return fail('订单不存在', 404)

    order.status = status
    saveStore(STORAGE_KEYS.orders, orders)
    return success(order, '订单状态已更新')
  })

  // ─── 首页接口 ───────────────────────────────────────────────
  Mock.mock(/\/api\/home\/banners/, 'get', () => success(defaultHomeBanners))

  Mock.mock(/\/api\/home\/nav-grid/, 'get', () => success(defaultNavGrid))

  Mock.mock(/\/api\/home\/flash-sale/, 'get', () => {
    const endTime = new Date()
    endTime.setHours(23, 59, 59, 999)
    const flashProducts = products
      .filter((p) => p.status === 1 && p.originalPrice)
      .slice(0, 12)
      .map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        originalPrice: p.originalPrice,
        image: p.image,
      }))
    return success({ endTime: endTime.getTime(), products: flashProducts })
  })

  // ─── 搜索接口 ───────────────────────────────────────────────
  Mock.mock(/\/api\/search\/hot/, 'get', () => success(defaultSearchHot))

  Mock.mock(/\/api\/search\/guess/, 'get', () => success(defaultSearchGuess))

  Mock.mock(/\/api\/search\/rankings/, 'get', () => success(buildHotRankings()))

  Mock.mock(/\/api\/search\/suggest(\?.*)?$/, 'get', (options) => {
    const url = new URL(options.url, 'http://localhost')
    const keyword = (url.searchParams.get('keyword') || '').trim()
    if (!keyword) return success([])

    const fromProducts = products
      .filter((p) => p.status === 1 && p.title.includes(keyword))
      .slice(0, 4)
      .map((p) => ({ text: p.title, type: 'product' }))

    const fromAi = defaultSearchAiPool
      .filter((s) => s.includes(keyword) || keyword.length >= 2)
      .slice(0, 2)
      .map((text) => ({ text, type: 'ai' }))

    const fromHot = defaultSearchHot
      .filter((s) => s.includes(keyword))
      .slice(0, 3)
      .map((text) => ({ text, type: 'hot' }))

    const merged = [...fromProducts, ...fromAi, ...fromHot]
    const unique = merged.filter(
      (item, index, arr) => arr.findIndex((x) => x.text === item.text) === index,
    )
    return success(unique.slice(0, 8))
  })

  // ─── 金刚区二级页接口 ─────────────────────────────────────────
  Mock.mock(/\/api\/zone\/flash-sale/, 'get', () => {
    const endTime = new Date()
    endTime.setHours(23, 59, 59, 999)
    const list = products
      .filter((p) => p.status === 1)
      .slice(0, 24)
      .map((p, i) => {
        const base = p.originalPrice || Math.round(p.price * 1.3)
        const flashPrice = Math.round(p.price * 0.75)
        return {
          ...p,
          originalPrice: base,
          flashPrice,
          soldPercent: 55 + ((p.id + i * 7) % 40),
          soldCount: getSoldCount(p.id),
        }
      })
    return success({ endTime: endTime.getTime(), list })
  })

  Mock.mock(/\/api\/zone\/value-sale/, 'get', () => {
    const list = products
      .filter((p) => p.status === 1 && p.price <= 268)
      .map((p) => ({
        ...p,
        salePrice: Math.max(Math.round(p.price * 0.6), 19),
        soldCount: getSoldCount(p.id),
      }))
    return success({ list, freeShipping: true })
  })

  Mock.mock(/\/api\/zone\/ranking/, 'get', () => {
    const tabs = [
      { key: 'digital', label: '手机数码', categoryIds: [201, 202, 203] },
      { key: 'fashion', label: '服饰箱包', categoryIds: [101, 102, 103] },
      { key: 'life', label: '家居美妆', categoryIds: [301, 302, 401, 402] },
    ].map((tab) => {
      const list = products
        .filter((p) => p.status === 1 && tab.categoryIds.includes(p.categoryId))
        .map((p) => ({ ...p, soldCount: getSoldCount(p.id) }))
        .sort((a, b) => b.soldCount - a.soldCount)
        .slice(0, 10)
        .map((p, i) => ({ ...p, rank: i + 1 }))
      return { ...tab, list }
    })
    return success(tabs)
  })

  Mock.mock(/\/api\/zone\/coupons/, 'get', () => success(defaultCoupons))

  Mock.mock(/\/api\/zone\/coupons\/\d+\/claim/, 'post', (options) => {
    const id = Number(options.url.match(/\/api\/zone\/coupons\/(\d+)\/claim/)?.[1])
    const coupon = defaultCoupons.find((c) => c.id === id)
    if (!coupon) return fail('优惠券不存在', 404)
    if (claimedCoupons.includes(id)) return fail('已领取过该优惠券')
    claimedCoupons.push(id)
    saveStore('mock_claimed_coupons', claimedCoupons)
    return success(coupon, '领取成功')
  })

  Mock.mock(/\/api\/zone\/new-arrivals/, 'get', () => {
    const launched = products
      .filter((p) => p.status === 1)
      .slice(-6)
      .reverse()
      .map((p, i) => ({
        ...p,
        launchDate: `2026-06-${String(8 - i).padStart(2, '0')}`,
        isNew: true,
      }))
    const upcoming = [
      { id: 'u1', title: '夏日凉感床品系列', launchDate: '2026-06-15', image: 'https://picsum.photos/seed/upcoming1/400/300' },
      { id: 'u2', title: '智能护眼台灯 Pro', launchDate: '2026-06-20', image: 'https://picsum.photos/seed/upcoming2/400/300' },
    ]
    return success({ launched, upcoming })
  })

  Mock.mock(/\/api\/zone\/lifestyle/, 'get', () => {
    const homeCategoryIds = [301, 302]
    const list = products
      .filter((p) => p.status === 1 && homeCategoryIds.includes(p.categoryId))
      .map((p) => ({
        ...p,
        sceneImage: `https://picsum.photos/seed/scene${p.id}/400/500`,
        recommendBy: ['居家达人小雅', '生活美学家', '品质生活家'][p.id % 3],
      }))
    return success({ list })
  })

  Mock.mock(/\/api\/zone\/gift-cards/, 'get', () => {
    return success({
      cards: defaultGiftCards,
      amounts: [50, 100, 200, 500, 1000],
    })
  })

  Mock.mock(/\/api\/zone\/gift-cards\/buy/, 'post', (options) => {
    const { cardId, amount } = parseBody(options)
    if (!cardId || !amount) return fail('请选择卡面与面额')
    return success({ cardId, amount, balanceAdded: amount }, '礼品卡购买成功')
  })

  Mock.mock(/\/api\/zone\/more/, 'get', () => {
    return success({
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        icon: c.name.slice(0, 1),
        link: `/category?cat=${c.id}`,
      })),
      tools: [
        { id: 'footprint', name: '我的足迹', link: '/orders' },
        { id: 'favorite', name: '我的收藏', link: '/orders' },
        { id: 'coupon', name: '优惠券', link: '/coupon' },
        { id: 'wallet', name: '礼品卡余额', link: '/gift-card' },
        { id: 'feedback', name: '意见反馈', link: '/more' },
        { id: 'service', name: '联系客服', link: '/more' },
      ],
    })
  })

  console.info(
    `[Mock] 数据中心已启动 v${MOCK_DATA_VERSION} · 店铺 ${shops.length} · 商品 ${products.length} · 用户 ${users.length} · 订单 ${orders.length}`,
  )

  if (import.meta.env.DEV) {
    window.__RESET_MOCK__ = () => {
      clearMockCache()
      localStorage.setItem(VERSION_KEY, MOCK_DATA_VERSION)
      window.location.reload()
    }
  }
}

export default Mock
