/**
 * 商城图片资源库
 * 规格：1:1 正方形电商主图，资源托管在 public/product-assets/
 */

const local = (name) => `/product-assets/${name}.jpg`
const localCore = (id) => `/product-assets/core-${id}.jpg`

const productAssetLibrary = {
  // --- 12 款核心商品（ID 1-12 固定匹配）---
  core: {
    1: localCore(1), // 极简亚麻衬衫
    2: localCore(2), // 羊毛混纺大衣
    3: localCore(3), // 真皮编织腰带
    4: localCore(4), // 无线降噪耳机
    5: localCore(5), // 轻薄笔记本电脑
    6: localCore(6), // 智能手机 Pro
    7: localCore(7), // 北欧实木餐椅
    8: localCore(8), // 纯棉四件套
    9: localCore(9), // 保湿精华液
    10: localCore(10), // 哑光唇釉套装
    11: localCore(11), // 休闲运动卫衣
    12: localCore(12), // 智能手表
  },

  // --- 分类素材（Key 匹配）---
  categories: {
    shirt: local('shirt'),
    jacket: local('jacket'),
    hoodie: local('hoodie'),
    pants: local('pants'),
    dress: local('dress'),
    coat: local('coat'),
    sweater: local('sweater'),
    belt: local('belt'),
    handbag: local('handbag'),
    silkScarf: local('silkScarf'),
    jewelry: local('jewelry'),
    hat: local('hat'),
    smartphone: local('smartphone'),
    tablet: local('tablet'),
    laptop: local('laptop'),
    headphones: local('headphones'),
    smartwatch: local('smartwatch'),
    keyboard: local('keyboard'),
    mouse: local('mouse'),
    speaker: local('speaker'),
    powerbank: local('powerbank'),
    charger: local('charger'),
    router: local('router'),
    chair: local('chair'),
    furniture: local('furniture'),
    bedding: local('bedding'),
    pillow: local('pillow'),
    skincare: local('skincare'),
    lipstick: local('lipstick'),
    makeup: local('makeup'),
  },

  extras: {
    avatars: [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&h=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400&h=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400&h=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=400&auto=format&fit=crop',
    ],
    banners: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&h=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&h=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&h=600&auto=format&fit=crop',
    ],
  },
}

export const CORE_PRODUCT_IMAGES = productAssetLibrary.core
export const PRODUCT_ASSETS = productAssetLibrary.categories
export const AVATAR_ASSETS = productAssetLibrary.extras.avatars
export const BANNER_ASSETS = productAssetLibrary.extras.banners

/** 标题关键词 → 素材 key */
export const TITLE_ASSET_RULES = [
  { pattern: /降噪耳机|无线耳机|蓝牙耳机|耳机|耳麦/, key: 'headphones' },
  { pattern: /智能手表|运动手环|手表|手环/, key: 'smartwatch' },
  { pattern: /机械键盘|键盘/, key: 'keyboard' },
  { pattern: /无线鼠标|鼠标/, key: 'mouse' },
  { pattern: /蓝牙音箱|音箱/, key: 'speaker' },
  { pattern: /移动电源|充电宝/, key: 'powerbank' },
  { pattern: /快充头|数据线/, key: 'charger' },
  { pattern: /路由器|拓展坞|摄像头|麦克风|支架/, key: 'router' },
  { pattern: /笔记本|电脑|二合一|主机|超极本|游戏本/, key: 'laptop' },
  { pattern: /平板|触控屏本/, key: 'tablet' },
  { pattern: /智能手机|折叠屏|手机|5G|曲面屏|AI 手机/, key: 'smartphone' },
  { pattern: /羊毛.*大衣|双面呢|呢外套|大衣/, key: 'coat' },
  { pattern: /连衣裙|方领裙|吊带裙|碎花/, key: 'dress' },
  { pattern: /雪纺|毛衣|羊绒|针织|打底衫|套装/, key: 'sweater' },
  { pattern: /衬衫|亚麻|Polo|T恤|亨利领|条纹/, key: 'shirt' },
  { pattern: /卫衣|摇粒绒|夹克|风衣|开衫|防泼水|外套|裤/, key: 'jacket' },
  { pattern: /牛仔裤|瑜伽裤|阔腿裤|束脚裤|工装长裤|长裤/, key: 'pants' },
  { pattern: /腰带|皮带|编织.*带/, key: 'belt' },
  { pattern: /托特包|双肩包|腰包|钱包|钥匙包|包/, key: 'handbag' },
  { pattern: /草帽|贝雷帽|棒球帽|帽/, key: 'hat' },
  { pattern: /桑蚕丝|丝巾|方巾|围巾/, key: 'silkScarf' },
  { pattern: /耳钉|锁骨链|胸针|珠宝|项链/, key: 'jewelry' },
  { pattern: /餐椅|书桌|边柜|落地灯|衣帽架|茶几|书架|沙发|餐边|床头柜|鞋架|餐桌|吧台|搁板|收纳|实木|橡木|藤编|岩板|家具|椅/, key: 'furniture' },
  { pattern: /四件套|床品|羽绒|乳胶枕|珊瑚绒|窗帘|床垫|凉被|地垫|浴袍|毛巾|床笠|午睡毯|天丝|床/, key: 'bedding' },
  { pattern: /抱枕|靠垫/, key: 'pillow' },
  { pattern: /精华|面霜|洁面|防晒|爽肤水|眼霜|卸妆|面膜|身体乳|护手|安瓶|护肤|慕斯|喷雾|保湿|修护/, key: 'skincare' },
  { pattern: /唇釉|口红|眉笔|腮红|散粉|眼影|睫毛膏|遮瑕|高光|彩妆|唇线|染眉|气垫|化妆刷|哑光|粉底/, key: 'makeup' },
]

/** 分类默认素材池 */
export const CATEGORY_ASSET_POOL = {
  101: ['shirt', 'jacket', 'hoodie', 'pants'],
  102: ['dress', 'coat', 'sweater', 'jacket'],
  103: ['belt', 'handbag', 'silkScarf', 'jewelry', 'hat'],
  201: ['smartphone', 'tablet', 'smartphone'],
  202: ['laptop', 'laptop', 'tablet'],
  203: ['headphones', 'smartwatch', 'keyboard', 'speaker', 'powerbank'],
  301: ['chair', 'furniture', 'furniture'],
  302: ['bedding', 'pillow', 'bedding'],
  401: ['skincare', 'skincare', 'makeup'],
  402: ['lipstick', 'makeup', 'makeup'],
}

export function resizeImageUrl(url, size = 800) {
  if (!url) return PRODUCT_ASSETS.shirt
  if (url.startsWith('/')) return url
  return url.replace(/w=\d+/, `w=${size}`).replace(/h=\d+/, `h=${size}`)
}

export function assetUrl(key, w = 800) {
  const base = PRODUCT_ASSETS[key]
  if (!base) return PRODUCT_ASSETS.shirt
  return resizeImageUrl(base, w)
}

export default productAssetLibrary
