/** Mock 数据版本：升级后自动清空 localStorage 并重新生成 */
export const MOCK_DATA_VERSION = '3.1.0'

/** 低于此数量视为旧版缓存，自动重新播种 */
export const SEED_MIN_COUNTS = {
  products: 200,
  shops: 20,
  users: 50,
  orders: 100,
}

export const CORE_SHOPS = [
  {
    shopId: 1,
    shopName: '云间丝语',
    shopLogo: 'https://picsum.photos/seed/cloud-silk/120/120',
    rating: 4.9,
    fansCount: 28600,
    shopDescription: '甄选天然丝麻，以云间织就日常风雅。每一件衣物，都是触手可及的温柔。',
    promoNotice: '官方立减 · 丝纺节狂欢',
    categoryIds: [101, 102, 103],
  },
  {
    shopId: 2,
    shopName: '墨染匠心馆',
    shopLogo: 'https://picsum.photos/seed/ink-artisan/120/120',
    rating: 4.8,
    fansCount: 15200,
    shopDescription: '手作木艺与东方美学相遇，让匠心融入生活角落。',
    promoNotice: '官方立减 · 匠心造物季',
    categoryIds: [301, 302],
  },
  {
    shopId: 3,
    shopName: '织梦坊',
    shopLogo: 'https://picsum.photos/seed/dream-weaver/120/120',
    rating: 4.9,
    fansCount: 42100,
    shopDescription: '以植萃之力唤醒肌肤，织就你的美丽梦境。',
    promoNotice: '官方立减 · 美妆焕新周',
    categoryIds: [401, 402],
  },
  {
    shopId: 4,
    shopName: '青藤数码',
    shopLogo: 'https://picsum.photos/seed/green-ivy/120/120',
    rating: 4.7,
    fansCount: 53800,
    shopDescription: '前沿数码装备，像青藤一样蔓延进你的智能生活。',
    promoNotice: '官方立减 · 数码盛典',
    categoryIds: [201, 202, 203],
  },
]

const EXTRA_SHOP_NAMES = [
  { shopName: '晨光家纺', categoryIds: [302, 301] },
  { shopName: '山野集物所', categoryIds: [301, 103] },
  { shopName: '南风服饰', categoryIds: [102, 101] },
  { shopName: '拾光文具社', categoryIds: [103, 203] },
  { shopName: '禾木生活馆', categoryIds: [301, 302] },
  { shopName: '琉璃美妆屋', categoryIds: [401, 402] },
  { shopName: '星野数码站', categoryIds: [201, 203] },
  { shopName: '半夏衣舍', categoryIds: [101, 102] },
  { shopName: '听风配饰', categoryIds: [103, 102] },
  { shopName: '云端电脑城', categoryIds: [202, 203] },
  { shopName: '花间护肤', categoryIds: [401, 402] },
  { shopName: '木语家居', categoryIds: [301, 302] },
  { shopName: '轻行户外', categoryIds: [101, 103] },
  { shopName: '像素潮玩', categoryIds: [203, 201] },
  { shopName: '素色美学', categoryIds: [102, 401] },
  { shopName: '暖巢布艺', categoryIds: [302, 301] },
  { shopName: '极客研究所', categoryIds: [202, 201] },
  { shopName: '悦己彩妆', categoryIds: [402, 401] },
  { shopName: '日常好物仓', categoryIds: [101, 301, 203] },
  { shopName: '林间手作', categoryIds: [301, 103] },
]

const PRODUCT_TITLES = {
  101: ['亚麻衬衫', '纯棉卫衣', '商务 Polo', '休闲夹克', '工装长裤', '短袖 T 恤', '轻薄风衣', '针织开衫', '束脚裤', '条纹衬衫', '摇粒绒外套', '直筒牛仔裤', '亨利领上衣', '防泼水外套', '棉麻阔腿裤'],
  102: ['碎花连衣裙', '真丝半裙', '针织打底衫', '羊毛大衣', '雪纺衬衫', '背带阔腿裤', '羊绒毛衣', '高腰瑜伽裤', '法式方领裙', '灯芯绒半裙', '蕾丝内搭', '双面呢外套', '针织套装', '醋酸衬衫', '丝绒吊带裙'],
  103: ['真皮腰带', '编织草帽', '帆布托特包', '羊毛围巾', '极简钱包', '运动腰包', '金属锁骨链', '防晒袖套', '皮质手套', '尼龙双肩包', '贝雷帽', '丝巾方巾', '钥匙收纳包', '棒球帽', '胸针套装'],
  201: ['智能手机', '拍照手机', '游戏手机', '老人机', '折叠屏手机', '5G 入门机', '影像旗舰', '轻薄手机', '大电池手机', '学生手机', '商务手机', '曲面屏手机', '快充手机', '防水手机', 'AI 手机'],
  202: ['轻薄笔记本', '游戏本', '商务本', '二合一平板', '设计师本', '学生本', '超极本', '创作本', '14 英寸本', '16 英寸本', '高刷屏本', '长续航本', '金属机身本', '触控屏本', '迷你主机'],
  203: ['无线耳机', '降噪耳机', '蓝牙音箱', '移动电源', '智能手表', '机械键盘', '无线鼠标', '拓展坞', '快充头', '数据线套装', '运动手环', '桌面支架', '摄像头', '麦克风', '路由器'],
  301: ['实木餐椅', '橡木书桌', '收纳边柜', '落地灯', '衣帽架', '茶几组合', '书架单元', '懒人沙发', '餐边柜', '床头柜', '鞋架玄关', '藤编收纳筐', '岩板餐桌', '吧台椅', '展示搁板'],
  302: ['纯棉四件套', '天丝床品', '羽绒被芯', '乳胶枕', '珊瑚绒毯', '遮光窗帘', '记忆棉床垫', '夏凉被', '刺绣抱枕', '防滑地垫', '浴袍套装', '毛巾礼盒', '床头靠垫', '床笠保护垫', '午睡毯'],
  401: ['保湿精华液', '修护面霜', '洁面乳', '防晒乳', '爽肤水', '眼霜', '卸妆油', '面膜套装', '身体乳', '护手霜', '安瓶精华', '护肤礼盒', '洁面慕斯', '精华水', '修护喷雾'],
  402: ['哑光唇釉', '丝绒口红', '眉笔套装', '腮红盘', '定妆散粉', '眼影盘', '睫毛膏', '遮瑕膏', '高光修容', '彩妆礼盒', '唇线笔', '染眉膏', '气垫粉底', '化妆刷组', '卸妆湿巾'],
}

const BADGE_POOL = [
  { badge: 'LUMIÈRE自营', badgeType: 'self' },
  { badge: '限时特惠', badgeType: 'sale' },
  { badge: '爆款', badgeType: 'hot' },
  { badge: '618狂欢', badgeType: 'promo' },
  { badge: '限时秒杀', badgeType: 'flash' },
  null,
  null,
]

const promoEndTime = () => {
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  return end.getTime()
}

export function generateShops() {
  const shops = CORE_SHOPS.map((s) => ({
    ...s,
    promoEndTime: promoEndTime(),
  }))

  EXTRA_SHOP_NAMES.forEach((item, idx) => {
    const shopId = shops.length + 1
    const seed = `shop-${shopId}`
    shops.push({
      shopId,
      shopName: item.shopName,
      shopLogo: `https://picsum.photos/seed/${seed}/120/120`,
      rating: Number((4.5 + (idx % 5) * 0.1).toFixed(1)),
      fansCount: 3200 + shopId * 1739 + idx * 421,
      shopDescription: `${item.shopName} · 精选好物，品质生活每一天。`,
      promoNotice: `官方立减 · ${item.shopName}专场`,
      promoEndTime: promoEndTime(),
      categoryIds: item.categoryIds,
    })
  })

  return shops
}

export const CORE_PRODUCTS = [
  { id: 1, shopId: 1, title: '极简亚麻衬衫', price: 299, originalPrice: 459, stock: 120, categoryId: 101, image: 'https://picsum.photos/seed/p1/400/400', status: 1, desc: '透气亚麻，夏日首选', badge: 'LUMIÈRE自营', badgeType: 'self' },
  { id: 2, shopId: 1, title: '羊毛混纺大衣', price: 899, originalPrice: 1299, stock: 45, categoryId: 102, image: 'https://picsum.photos/seed/p2/400/400', status: 1, desc: '经典版型，保暖舒适', badge: '限时特惠', badgeType: 'sale' },
  { id: 3, shopId: 1, title: '真皮编织腰带', price: 199, stock: 80, categoryId: 103, image: 'https://picsum.photos/seed/p3/400/400', status: 1, desc: '手工编织，质感出众' },
  { id: 4, shopId: 4, title: '无线降噪耳机', price: 1299, originalPrice: 1899, stock: 200, categoryId: 203, image: 'https://picsum.photos/seed/p4/400/400', status: 1, desc: '主动降噪，续航 30h', badge: 'LUMIÈRE自营', badgeType: 'self' },
  { id: 5, shopId: 4, title: '轻薄笔记本电脑', price: 5999, stock: 30, categoryId: 202, image: 'https://picsum.photos/seed/p5/400/400', status: 1, desc: '14 英寸，1.2kg 超轻', badge: '爆款', badgeType: 'hot' },
  { id: 6, shopId: 4, title: '智能手机 Pro', price: 4999, originalPrice: 5499, stock: 150, categoryId: 201, image: 'https://picsum.photos/seed/p6/400/400', status: 1, desc: '旗舰芯片，影像系统', badge: '618狂欢', badgeType: 'promo' },
  { id: 7, shopId: 2, title: '北欧实木餐椅', price: 459, stock: 60, categoryId: 301, image: 'https://picsum.photos/seed/p7/400/400', status: 1, desc: '橡木材质，简约设计' },
  { id: 8, shopId: 1, title: '纯棉四件套', price: 399, originalPrice: 599, stock: 90, categoryId: 302, image: 'https://picsum.photos/seed/p8/400/400', status: 1, desc: '60 支长绒棉，亲肤柔软', badge: '特价', badgeType: 'sale' },
  { id: 9, shopId: 3, title: '保湿精华液', price: 268, stock: 300, categoryId: 401, image: 'https://picsum.photos/seed/p9/400/400', status: 1, desc: '深层补水，修护屏障', badge: 'LUMIÈRE自营', badgeType: 'self' },
  { id: 10, shopId: 3, title: '哑光唇釉套装', price: 158, originalPrice: 228, stock: 500, categoryId: 402, image: 'https://picsum.photos/seed/p10/400/400', status: 1, desc: '三支装，持久不脱色', badge: '限时秒杀', badgeType: 'flash' },
  { id: 11, shopId: 1, title: '休闲运动卫衣', price: 259, stock: 0, categoryId: 101, image: 'https://picsum.photos/seed/p11/400/400', status: 0, desc: '已下架，库存清零' },
  { id: 12, shopId: 4, title: '智能手表', price: 1999, originalPrice: 2499, stock: 75, categoryId: 203, image: 'https://picsum.photos/seed/p12/400/400', status: 1, desc: '健康监测，运动追踪', badge: 'LUMIÈRE自营', badgeType: 'self' },
]

const PRODUCTS_PER_SHOP = 18

export function generateProducts(shops) {
  const products = [...CORE_PRODUCTS]
  let nextId = products.length + 1

  shops.forEach((shop) => {
    const categoryIds = shop.categoryIds || [101]
    const existing = products.filter((p) => p.shopId === shop.shopId).length
    const need = Math.max(0, PRODUCTS_PER_SHOP - existing)

    for (let i = 0; i < need; i += 1) {
      const categoryId = categoryIds[i % categoryIds.length]
      const titles = PRODUCT_TITLES[categoryId] || PRODUCT_TITLES[101]
      const baseTitle = titles[(nextId + i) % titles.length]
      const variant = ['经典款', '升级版', '限定色', '新品', '热销款', '舒适款'][(nextId + i) % 6]
      const title = `${shop.shopName.replace(/馆|坊|所|屋|站|城|社|仓/g, '')} · ${baseTitle} ${variant}`
      const priceBase = categoryId >= 201 && categoryId <= 203 ? 199 : 89
      const price = priceBase + ((nextId * 37 + i * 13) % 900)
      const hasDiscount = nextId % 3 !== 0
      const badgeInfo = BADGE_POOL[nextId % BADGE_POOL.length]
      const stock = 15 + ((nextId * 19) % 480)
      const status = nextId % 17 === 0 ? 0 : 1

      const item = {
        id: nextId,
        shopId: shop.shopId,
        title,
        price,
        stock,
        categoryId,
        image: `https://picsum.photos/seed/p${nextId}/400/400`,
        status,
        desc: `${title}，${shop.shopName}精选上架，品质保障。`,
      }

      if (hasDiscount) {
        item.originalPrice = Math.round(price * (1.25 + (nextId % 5) * 0.05))
      }
      if (badgeInfo) {
        item.badge = badgeInfo.badge
        item.badgeType = badgeInfo.badgeType
      }

      products.push(item)
      nextId += 1
    }
  })

  return products
}

export function generateUsers() {
  const users = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      nickname: '系统管理员',
      avatar: 'https://picsum.photos/seed/admin/100/100',
      permissions: ['product', 'shop', 'order', 'user'],
      createdAt: '2026-01-01 09:00:00',
    },
    {
      id: 2,
      username: 'user',
      password: '123456',
      role: 'user',
      nickname: '商城用户',
      avatar: 'https://picsum.photos/seed/user/100/100',
      permissions: [],
      createdAt: '2026-01-15 14:20:00',
    },
  ]

  for (let i = 1; i <= 98; i += 1) {
    const id = i + 2
    users.push({
      id,
      username: `user${String(i).padStart(3, '0')}`,
      password: '123456',
      role: 'user',
      nickname: `用户${String(i).padStart(3, '0')}`,
      avatar: `https://picsum.photos/seed/u${id}/100/100`,
      permissions: [],
      createdAt: `2026-0${1 + (i % 5)}-${String((i % 28) + 1).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}:00`,
    })
  }

  return users
}

export function generateOrders(products, users) {
  const mallUsers = users.filter((u) => u.role === 'user')
  const onSale = products.filter((p) => p.status === 1 && p.stock > 0)
  const orders = []
  const statuses = [0, 1, 2, 3, 4]

  for (let i = 1; i <= 180; i += 1) {
    const user = mallUsers[i % mallUsers.length]
    const itemCount = 1 + (i % 3)
    const items = []
    let totalPrice = 0

    for (let j = 0; j < itemCount; j += 1) {
      const product = onSale[(i * 7 + j * 11) % onSale.length]
      const quantity = 1 + (j % 2)
      items.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity,
        image: product.image,
      })
      totalPrice += product.price * quantity
    }

    const status = statuses[i % statuses.length]
    const month = String(1 + (i % 6)).padStart(2, '0')
    const day = String((i % 28) + 1).padStart(2, '0')
    const hour = String(8 + (i % 12)).padStart(2, '0')
    const minute = String(i % 60).padStart(2, '0')

    orders.push({
      id: i,
      orderNo: `2026${month}${day}${String(i).padStart(4, '0')}`,
      userId: user.id,
      status,
      totalPrice,
      address: `上海市浦东新区张江路 ${88 + (i % 200)} 号`,
      createTime: `2026-${month}-${day} ${hour}:${minute}:00`,
      payTime: status >= 1 ? `2026-${month}-${day} ${hour}:${String(Number(minute) + 2).padStart(2, '0')}:00` : null,
      items,
    })
  }

  return orders
}

export function generateSearchHot(products) {
  return products
    .filter((p) => p.status === 1)
    .slice(0, 24)
    .map((p) => p.title)
}

export function generateSearchGuess(products) {
  const hints = ['选购攻略', '搭配指南', '护肤精选', '旗舰对比', '卧室好物', '运动必备', null]
  return products
    .filter((p) => p.status === 1)
    .slice(0, 20)
    .map((p, i) => ({
      keyword: p.title,
      hint: hints[i % hints.length],
    }))
}

export function generateCoupons() {
  return [
    { id: 1, amount: 20, minSpend: 99, title: '全场通用券', desc: '满99可用', expire: '2026-12-31' },
    { id: 2, amount: 50, minSpend: 299, title: '服饰专享', desc: '满299可用', expire: '2026-12-31' },
    { id: 3, amount: 100, minSpend: 599, title: '数码大额券', desc: '满599可用', expire: '2026-12-31' },
    { id: 4, amount: 15, minSpend: 49, title: '新人礼券', desc: '满49可用', expire: '2026-12-31' },
    { id: 5, amount: 30, minSpend: 199, title: '家居专享', desc: '满199可用', expire: '2026-12-31' },
    { id: 6, amount: 40, minSpend: 259, title: '美妆专享', desc: '满259可用', expire: '2026-12-31' },
    { id: 7, amount: 80, minSpend: 499, title: '店铺满减券', desc: '满499可用', expire: '2026-12-31' },
    { id: 8, amount: 10, minSpend: 79, title: '周末特惠', desc: '满79可用', expire: '2026-12-31' },
    { id: 9, amount: 120, minSpend: 899, title: '大额满减', desc: '满899可用', expire: '2026-12-31' },
    { id: 10, amount: 25, minSpend: 159, title: '会员专享', desc: '满159可用', expire: '2026-12-31' },
    { id: 11, amount: 60, minSpend: 399, title: '夏日焕新', desc: '满399可用', expire: '2026-12-31' },
    { id: 12, amount: 5, minSpend: 29, title: '无门槛小券', desc: '满29可用', expire: '2026-12-31' },
  ]
}

export function generateGiftCards() {
  return [
    { id: 1, name: '生日快乐', image: 'https://picsum.photos/seed/gift-bday/400/240', theme: 'from-pink-400 to-rose-500' },
    { id: 2, name: '感谢有你', image: 'https://picsum.photos/seed/gift-thanks/400/240', theme: 'from-olive-400 to-olive-600' },
    { id: 3, name: '新春大吉', image: 'https://picsum.photos/seed/gift-newyear/400/240', theme: 'from-red-400 to-orange-500' },
    { id: 4, name: '毕业祝福', image: 'https://picsum.photos/seed/gift-grad/400/240', theme: 'from-blue-400 to-indigo-500' },
    { id: 5, name: '婚礼贺喜', image: 'https://picsum.photos/seed/gift-wedding/400/240', theme: 'from-amber-400 to-orange-500' },
    { id: 6, name: '日常心意', image: 'https://picsum.photos/seed/gift-daily/400/240', theme: 'from-teal-400 to-cyan-500' },
  ]
}

export function buildSeedBundle() {
  const shops = generateShops()
  const products = generateProducts(shops)
  const users = generateUsers()
  const orders = generateOrders(products, users)

  return {
    shops,
    products,
    users,
    orders,
    searchHot: generateSearchHot(products),
    searchGuess: generateSearchGuess(products),
    coupons: generateCoupons(),
    giftCards: generateGiftCards(),
  }
}
